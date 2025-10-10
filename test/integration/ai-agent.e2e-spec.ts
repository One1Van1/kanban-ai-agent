import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../kan-back/src/app.module';
import { TestDataFactory } from '../helpers/test-data-factory';
import {
  MockBullQueue,
  MockEmailService,
  MockTelegramService,
  MockDatabaseService,
} from '../helpers/mock-services';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';

describe('AI Agent Integration Tests (E2E)', () => {
  let app: INestApplication;
  let mockQueue: MockBullQueue;
  let mockEmailService: MockEmailService;
  let mockTelegramService: MockTelegramService;
  let mockDatabase: MockDatabaseService;

  beforeAll(async () => {
    // Initialize mock services
    mockQueue = new MockBullQueue();
    mockEmailService = new MockEmailService();
    mockTelegramService = new MockTelegramService();
    mockDatabase = new MockDatabaseService();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        AppModule,
      ],
    })
      .overrideProvider('BullQueue_ai-agent-queue')
      .useValue(mockQueue)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clear all mock data before each test
    mockDatabase.clearAllData();
    mockEmailService.clearSentEmails();
    mockTelegramService.clearSentMessages();
  });

  describe('POST /ai-agent (Create Agent)', () => {
    it('should create a new AI agent successfully', async () => {
      const agentData = TestDataFactory.createAgentData();

      const response = await request(app.getHttpServer())
        .post('/ai-agent')
        .send(agentData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(agentData.name);
      expect(response.body.data.instructions).toBe(agentData.instructions);
      expect(response.body.data.isActive).toBe(agentData.isActive);
    });

    it('should fail with invalid agent data', async () => {
      const invalidData = TestDataFactory.getInvalidAgentData();

      await request(app.getHttpServer())
        .post('/ai-agent')
        .send(invalidData)
        .expect(400);
    });

    it('should handle duplicate agent names', async () => {
      const agentData = TestDataFactory.createAgentData();

      // Create first agent
      await request(app.getHttpServer())
        .post('/ai-agent')
        .send(agentData)
        .expect(201);

      // Try to create agent with same name
      const response = await request(app.getHttpServer())
        .post('/ai-agent')
        .send(agentData)
        .expect(409);

      expect(response.body.message).toContain(
        'Agent with this name already exists',
      );
    });
  });

  describe('PUT /ai-agent/:agentId/configure (Configure Agent)', () => {
    let createdAgentId: string;

    beforeEach(async () => {
      // Create an agent first
      const agentData = TestDataFactory.createAgentData();
      const createResponse = await request(app.getHttpServer())
        .post('/ai-agent')
        .send(agentData);
      createdAgentId = createResponse.body.data.id;
    });

    it('should configure existing agent successfully', async () => {
      const configData = TestDataFactory.configureAgentData();

      const response = await request(app.getHttpServer())
        .put(`/ai-agent/${createdAgentId}/configure`)
        .send(configData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(configData.name);
      expect(response.body.data.model).toBe(configData.model);
    });

    it('should fail with non-existent agent', async () => {
      const configData = TestDataFactory.configureAgentData();

      await request(app.getHttpServer())
        .put('/ai-agent/non-existent-id/configure')
        .send(configData)
        .expect(404);
    });
  });

  describe('POST /ai-agent/configure-column-instructions (Configure Column Instructions)', () => {
    let createdAgentId: string;

    beforeEach(async () => {
      const agentData = TestDataFactory.createAgentData();
      const createResponse = await request(app.getHttpServer())
        .post('/ai-agent')
        .send(agentData);
      createdAgentId = createResponse.body.data.id;
    });

    it('should configure column instructions successfully', async () => {
      const instructionsData =
        TestDataFactory.configureColumnInstructionsData();
      instructionsData.agentId = createdAgentId;

      const response = await request(app.getHttpServer())
        .post('/ai-agent/configure-column-instructions')
        .send(instructionsData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.agentId).toBe(createdAgentId);
      expect(response.body.data.columnName).toBe(instructionsData.columnName);
    });

    it('should fail with invalid trigger conditions', async () => {
      const invalidData = TestDataFactory.getInvalidColumnInstructionsData();

      await request(app.getHttpServer())
        .post('/ai-agent/configure-column-instructions')
        .send(invalidData)
        .expect(400);
    });
  });

  describe('POST /ai-agent/execute-action (Execute Agent Action)', () => {
    let createdAgentId: string;

    beforeEach(async () => {
      const agentData = TestDataFactory.createAgentData();
      const createResponse = await request(app.getHttpServer())
        .post('/ai-agent')
        .send(agentData);
      createdAgentId = createResponse.body.data.id;

      // Configure column instructions
      const instructionsData =
        TestDataFactory.configureColumnInstructionsData();
      instructionsData.agentId = createdAgentId;
      await request(app.getHttpServer())
        .post('/ai-agent/configure-column-instructions')
        .send(instructionsData);
    });

    it('should execute agent action successfully', async () => {
      const actionData = TestDataFactory.executeAgentActionData();
      actionData.agentId = createdAgentId;

      const response = await request(app.getHttpServer())
        .post('/ai-agent/execute-action')
        .send(actionData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.executionId).toBeDefined();
      expect(response.body.data.status).toBe('completed');
    });

    it('should handle execution errors gracefully', async () => {
      const actionData = TestDataFactory.executeAgentActionData();
      actionData.agentId = 'non-existent-agent';

      await request(app.getHttpServer())
        .post('/ai-agent/execute-action')
        .send(actionData)
        .expect(404);
    });
  });

  describe('GET /ai-agent/:agentId/activity (Get Agent Activity)', () => {
    let createdAgentId: string;

    beforeEach(async () => {
      const agentData = TestDataFactory.createAgentData();
      const createResponse = await request(app.getHttpServer())
        .post('/ai-agent')
        .send(agentData);
      createdAgentId = createResponse.body.data.id;

      // Execute some actions to create activity
      const actionData = TestDataFactory.executeAgentActionData();
      actionData.agentId = createdAgentId;
      await request(app.getHttpServer())
        .post('/ai-agent/execute-action')
        .send(actionData);
    });

    it('should retrieve agent activity successfully', async () => {
      const response = await request(app.getHttpServer())
        .get(`/ai-agent/${createdAgentId}/activity`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.activities).toBeInstanceOf(Array);
      expect(response.body.data.summary).toBeDefined();
      expect(response.body.data.summary.totalActivities).toBeGreaterThan(0);
    });

    it('should handle pagination correctly', async () => {
      const response = await request(app.getHttpServer())
        .get(`/ai-agent/${createdAgentId}/activity`)
        .query({ page: 1, limit: 5 })
        .expect(200);

      expect(response.body.data.activities).toBeInstanceOf(Array);
      expect(response.body.data.activities.length).toBeLessThanOrEqual(5);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should filter by date range', async () => {
      const today = new Date().toISOString().split('T')[0];

      const response = await request(app.getHttpServer())
        .get(`/ai-agent/${createdAgentId}/activity`)
        .query({
          fromDate: today,
          toDate: today,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.activities).toBeInstanceOf(Array);
    });
  });

  describe('POST /ai-agent/track-agent-in-task/:agentId (Track Agent in Task)', () => {
    let createdAgentId: string;

    beforeEach(async () => {
      const agentData = TestDataFactory.createAgentData();
      const createResponse = await request(app.getHttpServer())
        .post('/ai-agent')
        .send(agentData);
      createdAgentId = createResponse.body.data.id;
    });

    it('should track agent in task successfully', async () => {
      const trackingData = TestDataFactory.trackAgentInTaskData();

      const response = await request(app.getHttpServer())
        .post(`/ai-agent/track-agent-in-task/${createdAgentId}`)
        .send(trackingData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.agentId).toBe(createdAgentId);
      expect(response.body.data.trackingId).toBeDefined();
    });

    it('should fail with non-existent agent', async () => {
      const trackingData = TestDataFactory.trackAgentInTaskData();

      await request(app.getHttpServer())
        .post('/ai-agent/track-agent-in-task/non-existent-id')
        .send(trackingData)
        .expect(404);
    });
  });

  describe('Integration Workflow Tests', () => {
    it('should complete full agent lifecycle successfully', async () => {
      // 1. Create agent
      const agentData = TestDataFactory.createAgentData();
      const createResponse = await request(app.getHttpServer())
        .post('/ai-agent')
        .send(agentData)
        .expect(201);

      const agentId = createResponse.body.data.id;

      // 2. Configure column instructions
      const instructionsData =
        TestDataFactory.configureColumnInstructionsData();
      instructionsData.agentId = agentId;

      await request(app.getHttpServer())
        .post('/ai-agent/configure-column-instructions')
        .send(instructionsData)
        .expect(201);

      // 3. Execute action
      const actionData = TestDataFactory.executeAgentActionData();
      actionData.agentId = agentId;

      await request(app.getHttpServer())
        .post('/ai-agent/execute-action')
        .send(actionData)
        .expect(201);

      // 4. Track in task
      const trackingData = TestDataFactory.trackAgentInTaskData();

      await request(app.getHttpServer())
        .post(`/ai-agent/track-agent-in-task/${agentId}`)
        .send(trackingData)
        .expect(201);

      // 5. Get activity
      const activityResponse = await request(app.getHttpServer())
        .get(`/ai-agent/${agentId}/activity`)
        .expect(200);

      expect(
        activityResponse.body.data.summary.totalActivities,
      ).toBeGreaterThan(0);
    });

    it('should handle concurrent agent operations', async () => {
      const agentCount = 3;
      const agentPromises = [];

      // Create multiple agents concurrently
      for (let i = 0; i < agentCount; i++) {
        const agentData = TestDataFactory.createAgentData();
        agentData.name = `Concurrent Agent ${i + 1}`;

        agentPromises.push(
          request(app.getHttpServer())
            .post('/ai-agent')
            .send(agentData)
            .expect(201),
        );
      }

      const responses = await Promise.all(agentPromises);

      // Verify all agents were created
      expect(responses).toHaveLength(agentCount);
      responses.forEach((response, index) => {
        expect(response.body.data.name).toBe(`Concurrent Agent ${index + 1}`);
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle malformed JSON gracefully', async () => {
      await request(app.getHttpServer())
        .post('/ai-agent')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400);
    });

    it('should handle very large instruction text', async () => {
      const agentData = TestDataFactory.createAgentData();
      agentData.instructions = 'x'.repeat(10000); // Very large instructions

      const response = await request(app.getHttpServer())
        .post('/ai-agent')
        .send(agentData);

      // Should either accept or reject based on validation rules
      expect([201, 400]).toContain(response.status);
    });

    it('should validate temperature range', async () => {
      const agentData = TestDataFactory.createAgentData();
      agentData.temperature = 2.0; // Invalid: > 1.0

      await request(app.getHttpServer())
        .post('/ai-agent')
        .send(agentData)
        .expect(400);
    });

    it('should validate maxTokens range', async () => {
      const agentData = TestDataFactory.createAgentData();
      agentData.maxTokens = -100; // Invalid: negative

      await request(app.getHttpServer())
        .post('/ai-agent')
        .send(agentData)
        .expect(400);
    });
  });

  describe('Performance Tests', () => {
    it('should handle bulk agent creation efficiently', async () => {
      const bulkAgents = TestDataFactory.generateBulkAgentData(10);
      const promises = bulkAgents.map((agentData, index) => {
        agentData.name = `Bulk Agent ${index + 1}`;
        return request(app.getHttpServer()).post('/ai-agent').send(agentData);
      });

      const startTime = Date.now();
      const responses = await Promise.all(promises);
      const endTime = Date.now();

      // All should succeed
      responses.forEach((response) => {
        expect(response.status).toBe(201);
      });

      // Should complete within reasonable time (5 seconds)
      expect(endTime - startTime).toBeLessThan(5000);
    });

    it('should maintain performance under load', async () => {
      // Create an agent first
      const agentData = TestDataFactory.createAgentData();
      const createResponse = await request(app.getHttpServer())
        .post('/ai-agent')
        .send(agentData);

      const agentId = createResponse.body.data.id;

      // Execute multiple actions concurrently
      const actionPromises = [];
      for (let i = 0; i < 20; i++) {
        const actionData = TestDataFactory.executeAgentActionData();
        actionData.agentId = agentId;
        actionData.taskId = `TASK-${i}`;

        actionPromises.push(
          request(app.getHttpServer())
            .post('/ai-agent/execute-action')
            .send(actionData),
        );
      }

      const startTime = Date.now();
      const responses = await Promise.all(actionPromises);
      const endTime = Date.now();

      // All should succeed
      responses.forEach((response) => {
        expect(response.status).toBe(201);
      });

      // Should maintain reasonable response time
      const avgResponseTime = (endTime - startTime) / 20;
      expect(avgResponseTime).toBeLessThan(1000); // < 1 second per request
    });
  });
});
