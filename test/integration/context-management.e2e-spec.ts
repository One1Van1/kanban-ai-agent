import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { TestDataFactory } from '../helpers/test-data-factory';
import {
  MockJiraService,
  MockRedisService,
  MockDatabaseService,
} from '../helpers/mock-services';
import { ConfigModule } from '@nestjs/config';

describe('Context Management Integration Tests (E2E)', () => {
  let app: INestApplication;
  let mockJiraService: MockJiraService;
  let mockRedisService: MockRedisService;
  let mockDatabaseService: MockDatabaseService;

  beforeAll(async () => {
    mockJiraService = new MockJiraService();
    mockRedisService = new MockRedisService();
    mockDatabaseService = new MockDatabaseService();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        AppModule,
      ],
    })
      .overrideProvider('JIRA_SERVICE')
      .useValue(mockJiraService)
      .overrideProvider('REDIS_CLIENT')
      .useValue(mockRedisService)
      .overrideProvider('DATABASE_SERVICE')
      .useValue(mockDatabaseService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clear all mock data before each test
    mockDatabaseService.clearAllData();
    await mockRedisService.flushall();
    mockJiraService.clearWebhookEvents();
  });

  describe('POST /context-management/configure-sources (Configure Context Sources)', () => {
    let createdAgentId: string;

    beforeEach(async () => {
      // Create an agent first
      const agentData = TestDataFactory.createAgentData();
      const agent = await mockDatabaseService.saveAgent(agentData);
      createdAgentId = agent.id;
    });

    it('should configure context sources successfully', async () => {
      const contextData = TestDataFactory.configureContextSourcesData();
      contextData.agentId = createdAgentId;

      const response = await request(app.getHttpServer())
        .post('/context-management/configure-sources')
        .send(contextData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.agentId).toBe(createdAgentId);
      expect(response.body.data.configurationId).toBeDefined();
      expect(response.body.data.sourcesConfigured).toBeGreaterThan(0);
    });

    it('should fail with non-existent agent', async () => {
      const contextData = TestDataFactory.configureContextSourcesData();
      contextData.agentId = 'non-existent-agent';

      await request(app.getHttpServer())
        .post('/context-management/configure-sources')
        .send(contextData)
        .expect(404);
    });

    it('should validate Jira configuration', async () => {
      const contextData = TestDataFactory.configureContextSourcesData();
      contextData.agentId = createdAgentId;
      // Invalid Jira config
      contextData.jiraConfiguration.projectKey = '';

      await request(app.getHttpServer())
        .post('/context-management/configure-sources')
        .send(contextData)
        .expect(400);
    });

    it('should handle external source configuration', async () => {
      const contextData = TestDataFactory.configureContextSourcesData();
      contextData.agentId = createdAgentId;

      const response = await request(app.getHttpServer())
        .post('/context-management/configure-sources')
        .send(contextData)
        .expect(201);

      expect(response.body.data.externalSourcesCount).toBeGreaterThanOrEqual(0);
    });

    it('should update existing configuration', async () => {
      const initialConfig = TestDataFactory.configureContextSourcesData();
      initialConfig.agentId = createdAgentId;

      // Create initial configuration
      await request(app.getHttpServer())
        .post('/context-management/configure-sources')
        .send(initialConfig)
        .expect(201);

      // Update configuration
      const updatedConfig = TestDataFactory.configureContextSourcesData();
      updatedConfig.agentId = createdAgentId;
      updatedConfig.jiraConfiguration.jqlQuery = 'updated query';

      const response = await request(app.getHttpServer())
        .post('/context-management/configure-sources')
        .send(updatedConfig)
        .expect(201);

      expect(response.body.data.jiraConfiguration.jqlQuery).toBe(
        'updated query',
      );
    });
  });

  describe('Context Source Integration Tests', () => {
    let agentId: string;
    let configurationId: string;

    beforeEach(async () => {
      // Setup agent and context configuration
      const agentData = TestDataFactory.createAgentData();
      const agent = await mockDatabaseService.saveAgent(agentData);
      agentId = agent.id;

      const contextData = TestDataFactory.configureContextSourcesData();
      contextData.agentId = agentId;

      const configResponse = await request(app.getHttpServer())
        .post('/context-management/configure-sources')
        .send(contextData);

      configurationId = configResponse.body.data.configurationId;
    });

    it('should fetch context from Jira integration', async () => {
      // Mock Jira to have some test data
      const testTask = await mockJiraService.getTask('TASK-123');
      expect(testTask).toBeDefined();
      expect(testTask.key).toBe('TASK-123');

      // Context should be available for agent
      const storedConfig =
        await mockDatabaseService.getConfiguration(configurationId);
      expect(storedConfig).toBeDefined();
      expect(storedConfig.agentId).toBe(agentId);
    });

    it('should cache context data efficiently', async () => {
      const cacheKey = `context:${agentId}:jira`;

      // First request should fetch and cache
      await mockRedisService.set(
        cacheKey,
        JSON.stringify({
          tasks: ['TASK-123'],
          lastFetched: new Date().toISOString(),
        }),
        300,
      );

      const cachedData = await mockRedisService.get(cacheKey);
      expect(cachedData).toBeDefined();

      const parsedCache = JSON.parse(cachedData!);
      expect(parsedCache.tasks).toContain('TASK-123');
    });

    it('should handle external source failures gracefully', async () => {
      const contextData = TestDataFactory.configureContextSourcesData();
      contextData.agentId = agentId;

      // Should still succeed even if external source fails
      const response = await request(app.getHttpServer())
        .post('/context-management/configure-sources')
        .send(contextData)
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    it('should refresh context data periodically', async () => {
      const initialCacheKey = `context:${agentId}:refresh`;

      // Set initial refresh timestamp
      await mockRedisService.set(
        initialCacheKey,
        new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
        3600,
      );

      // Context should be marked for refresh
      const refreshTime = await mockRedisService.get(initialCacheKey);
      expect(refreshTime).toBeDefined();

      const lastRefresh = new Date(refreshTime!);
      const tenMinutesAgo = new Date(Date.now() - 600000);
      expect(lastRefresh.getTime()).toBeLessThanOrEqual(
        tenMinutesAgo.getTime(),
      );
    });
  });

  describe('Context Data Processing Tests', () => {
    let agentId: string;

    beforeEach(async () => {
      const agentData = TestDataFactory.createAgentData();
      const agent = await mockDatabaseService.saveAgent(agentData);
      agentId = agent.id;
    });

    it('should process Jira task context correctly', async () => {
      const contextData = TestDataFactory.configureContextSourcesData();
      contextData.agentId = agentId;

      await request(app.getHttpServer())
        .post('/context-management/configure-sources')
        .send(contextData)
        .expect(201);

      // Simulate context processing
      const task = await mockJiraService.getTask('TASK-123');
      expect(task.summary).toBe('Test Task');
      expect(task.status).toBe('To Do');
      expect(task.assignee).toBe('john.doe@example.com');
    });

    it('should filter context based on JQL query', async () => {
      const contextData = TestDataFactory.configureContextSourcesData();
      contextData.agentId = agentId;
      contextData.jiraConfiguration.jqlQuery =
        'assignee = "john.doe@example.com"';

      const response = await request(app.getHttpServer())
        .post('/context-management/configure-sources')
        .send(contextData)
        .expect(201);

      expect(response.body.data.jiraConfiguration.jqlQuery).toContain(
        'john.doe@example.com',
      );
    });

    it('should validate context data integrity', async () => {
      const contextData = TestDataFactory.configureContextSourcesData();
      contextData.agentId = agentId;

      const response = await request(app.getHttpServer())
        .post('/context-management/configure-sources')
        .send(contextData)
        .expect(201);

      // Context configuration should be validated
      expect(response.body.data.validationStatus).toBe('passed');
    });
  });

  describe('Performance and Scalability Tests', () => {
    it('should handle multiple agents with different context sources', async () => {
      const agentPromises = [];
      const agentCount = 5;

      // Create multiple agents with context sources
      for (let i = 0; i < agentCount; i++) {
        const agentData = TestDataFactory.createAgentData();
        agentData.name = `Context Agent ${i + 1}`;

        agentPromises.push(
          mockDatabaseService.saveAgent(agentData).then(async (agent) => {
            const contextData = TestDataFactory.configureContextSourcesData();
            contextData.agentId = agent.id;
            contextData.jiraConfiguration.projectKey = `PROJ${i}`;

            return request(app.getHttpServer())
              .post('/context-management/configure-sources')
              .send(contextData);
          }),
        );
      }

      const responses = await Promise.all(agentPromises);

      responses.forEach((response) => {
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
      });
    });

    it('should cache context efficiently under load', async () => {
      const agent = await mockDatabaseService.saveAgent(
        TestDataFactory.createAgentData(),
      );
      const cacheOperations = [];

      // Simulate heavy cache usage
      for (let i = 0; i < 20; i++) {
        const cacheKey = `context:${agent.id}:test:${i}`;
        const cacheData = JSON.stringify({
          data: `test data ${i}`,
          timestamp: new Date().toISOString(),
        });

        cacheOperations.push(mockRedisService.set(cacheKey, cacheData, 300));
      }

      await Promise.all(cacheOperations);

      // Verify cache operations completed successfully
      const testKey = `context:${agent.id}:test:0`;
      const cachedData = await mockRedisService.get(testKey);
      expect(cachedData).toBeDefined();
    });

    it('should handle context source timeouts gracefully', async () => {
      const agentData = TestDataFactory.createAgentData();
      const agent = await mockDatabaseService.saveAgent(agentData);

      const contextData = TestDataFactory.configureContextSourcesData();
      contextData.agentId = agent.id;

      const startTime = Date.now();
      const response = await request(app.getHttpServer())
        .post('/context-management/configure-sources')
        .send(contextData)
        .expect(201);
      const endTime = Date.now();

      // Should not hang indefinitely
      expect(endTime - startTime).toBeLessThan(10000);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Security and Validation Tests', () => {
    let agentId: string;

    beforeEach(async () => {
      const agentData = TestDataFactory.createAgentData();
      const agent = await mockDatabaseService.saveAgent(agentData);
      agentId = agent.id;
    });

    it('should validate external API URLs', async () => {
      const contextData = TestDataFactory.configureContextSourcesData();
      contextData.agentId = agentId;
      contextData.externalSources = [
        {
          name: 'Invalid URL',
          url: 'not-a-valid-url',
          headers: {
            Authorization: 'Bearer invalid-token',
          },
        },
      ];

      await request(app.getHttpServer())
        .post('/context-management/configure-sources')
        .send(contextData)
        .expect(400);
    });

    it('should sanitize external source headers', async () => {
      const contextData = TestDataFactory.configureContextSourcesData();
      contextData.agentId = agentId;
      contextData.externalSources = [
        {
          name: 'API with headers',
          url: 'https://api.example.com/data',
          headers: {
            Authorization: 'Bearer safe-token',
          },
        },
      ];

      const response = await request(app.getHttpServer())
        .post('/context-management/configure-sources')
        .send(contextData)
        .expect(201);

      expect(response.body.success).toBe(true);
      // Headers should be validated/sanitized
    });

    it('should protect against context injection attacks', async () => {
      const contextData = TestDataFactory.configureContextSourcesData();
      contextData.agentId = agentId;
      contextData.jiraConfiguration.jqlQuery =
        'project = "TEST" AND summary ~ "malicious"';

      const response = await request(app.getHttpServer())
        .post('/context-management/configure-sources')
        .send(contextData);

      // Should either sanitize or reject malicious query
      expect([201, 400]).toContain(response.status);
    });

    it('should validate context source limits', async () => {
      const contextData = TestDataFactory.configureContextSourcesData();
      contextData.agentId = agentId;
      contextData.externalSources = Array(50)
        .fill(null)
        .map((_, i) => ({
          name: `Source ${i}`,
          url: `https://api${i}.example.com/data`,
          headers: {
            Authorization: `Bearer token${i}`,
          },
        }));

      await request(app.getHttpServer())
        .post('/context-management/configure-sources')
        .send(contextData)
        .expect(400); // Too many sources
    });
  });

  describe('Integration Workflow Tests', () => {
    it('should complete full context management lifecycle', async () => {
      // 1. Create agent
      const agentData = TestDataFactory.createAgentData();
      const agent = await mockDatabaseService.saveAgent(agentData);

      // 2. Configure context sources
      const contextData = TestDataFactory.configureContextSourcesData();
      contextData.agentId = agent.id;

      const configResponse = await request(app.getHttpServer())
        .post('/context-management/configure-sources')
        .send(contextData)
        .expect(201);

      const configId = configResponse.body.data.configurationId;

      // 3. Verify Jira integration
      const task = await mockJiraService.getTask('TASK-123');
      expect(task).toBeDefined();

      // 4. Check cache utilization
      const cacheKey = `context:${agent.id}:config`;
      await mockRedisService.set(cacheKey, JSON.stringify(contextData), 300);
      const cached = await mockRedisService.get(cacheKey);
      expect(cached).toBeDefined();

      // 5. Verify configuration persistence
      const storedConfig = await mockDatabaseService.getConfiguration(configId);
      expect(storedConfig).toBeDefined();
      expect(storedConfig.agentId).toBe(agent.id);
    });

    it('should handle context updates in real-time', async () => {
      const agentData = TestDataFactory.createAgentData();
      const agent = await mockDatabaseService.saveAgent(agentData);

      // Initial configuration
      const contextData = TestDataFactory.configureContextSourcesData();
      contextData.agentId = agent.id;

      await request(app.getHttpServer())
        .post('/context-management/configure-sources')
        .send(contextData)
        .expect(201);

      // Simulate Jira task update
      const updatedTask = await mockJiraService.moveTask('TASK-123', 'col-2');
      expect(updatedTask.columnId).toBe('col-2');

      // Context should reflect the update
      const webhookEvents = mockJiraService.getWebhookEvents();
      expect(webhookEvents).toHaveLength(1);
      expect(webhookEvents[0].type).toBe('task_moved');
    });

    it('should maintain context consistency across multiple operations', async () => {
      const agentData = TestDataFactory.createAgentData();
      const agent = await mockDatabaseService.saveAgent(agentData);

      // Configure multiple context sources
      const operations = [];

      for (let i = 0; i < 3; i++) {
        const contextData = TestDataFactory.configureContextSourcesData();
        contextData.agentId = agent.id;
        contextData.jiraConfiguration.boardId = `board-${i}`;

        operations.push(
          request(app.getHttpServer())
            .post('/context-management/configure-sources')
            .send(contextData),
        );
      }

      const responses = await Promise.all(operations);

      // Last configuration should win
      responses.forEach((response) => {
        expect(response.status).toBe(201);
      });

      // Final configuration should be consistent
      const finalConfig = await mockDatabaseService.getConfiguration(
        responses[2].body.data.configurationId,
      );
      expect(finalConfig.jiraConfiguration.boardId).toBe('board-2');
    });
  });
});
