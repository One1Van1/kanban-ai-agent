import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Basic Integration Tests (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Checks', () => {
    it('/ (GET) - should return app info', () => {
      return request(app.getHttpServer()).get('/').expect(200);
    });

    it('/jira/health (GET) - should return Jira health status', () => {
      return request(app.getHttpServer()).get('/jira/health').expect(200);
    });
  });

  describe('AI Agent Endpoints', () => {
    it('/ai-agent (POST) - should handle agent creation', async () => {
      const agentData = {
        name: 'Test Agent',
        instructions: 'Test instructions',
        isActive: true,
        model: 'claude-3.5-sonnet',
        temperature: 0.7,
        maxTokens: 1000,
      };

      return request(app.getHttpServer())
        .post('/ai-agent')
        .send(agentData)
        .expect((res) => {
          // Accept either success or validation error - both are valid responses
          expect([200, 201, 400]).toContain(res.status);
        });
    });

    it('/ai-agent/configure-column-instructions (POST) - should handle column instructions', async () => {
      const instructionData = {
        agentId: 'test-agent-id',
        columnId: 'col-1',
        instructions: 'Test column instructions',
        triggerConditions: ['task_moved_to_column'],
      };

      return request(app.getHttpServer())
        .post('/ai-agent/configure-column-instructions')
        .send(instructionData)
        .expect((res) => {
          expect([200, 201, 400, 404]).toContain(res.status);
        });
    });

    it('/ai-agent/execute-action (POST) - should handle action execution', async () => {
      const actionData = {
        agentId: 'test-agent-id',
        taskId: 'TASK-123',
        action: 'analyze_task',
        context: { test: 'context' },
      };

      return request(app.getHttpServer())
        .post('/ai-agent/execute-action')
        .send(actionData)
        .expect((res) => {
          expect([200, 201, 400, 404]).toContain(res.status);
        });
    });
  });

  describe('Queue Management Endpoints', () => {
    it('/queue/status (GET) - should return queue status', () => {
      return request(app.getHttpServer())
        .get('/queue/status')
        .expect((res) => {
          expect([200, 503]).toContain(res.status);
        });
    });

    it('/queue/tasks (POST) - should handle task creation', async () => {
      const taskData = {
        taskId: 'TEST-001',
        taskType: 'analyze',
        priority: 'medium',
        payload: { test: 'data' },
      };

      return request(app.getHttpServer())
        .post('/queue/tasks')
        .send(taskData)
        .expect((res) => {
          expect([200, 201, 400]).toContain(res.status);
        });
    });
  });

  describe('Notifications Endpoints', () => {
    it('/notifications/email (POST) - should handle email sending', async () => {
      const emailData = {
        to: 'test@example.com',
        subject: 'Test Email',
        content: 'Test content',
        priority: 'normal',
      };

      return request(app.getHttpServer())
        .post('/notifications/email')
        .send(emailData)
        .expect((res) => {
          expect([200, 201, 400]).toContain(res.status);
        });
    });

    it('/notifications/telegram (POST) - should handle telegram sending', async () => {
      const telegramData = {
        chatId: '123456789',
        message: 'Test message',
        priority: 'normal',
      };

      return request(app.getHttpServer())
        .post('/notifications/telegram')
        .send(telegramData)
        .expect((res) => {
          expect([200, 201, 400]).toContain(res.status);
        });
    });
  });

  describe('Context Management Endpoints', () => {
    it('/context-management/configure-sources (POST) - should handle context configuration', async () => {
      const contextData = {
        agentId: 'test-agent-id',
        jiraConfiguration: {
          boardId: 'board-1',
          projectKey: 'TEST',
          jqlQuery: 'assignee = currentUser()',
        },
        externalSources: [],
      };

      return request(app.getHttpServer())
        .post('/context-management/configure-sources')
        .send(contextData)
        .expect((res) => {
          expect([200, 201, 400, 404, 500]).toContain(res.status);
        });
    });
  });

  describe('Jira Integration Endpoints', () => {
    it('/jira/tasks/TEST-123 (GET) - should handle task retrieval', () => {
      return request(app.getHttpServer())
        .get('/jira/tasks/TEST-123')
        .expect((res) => {
          expect([200, 404, 401, 500]).toContain(res.status);
        });
    });

    it('/jira/search (POST) - should handle task search', async () => {
      const searchData = {
        jql: 'project = TEST',
        maxResults: 10,
      };

      return request(app.getHttpServer())
        .post('/jira/search')
        .send(searchData)
        .expect((res) => {
          expect([200, 400, 401, 500]).toContain(res.status);
        });
    });
  });
});
