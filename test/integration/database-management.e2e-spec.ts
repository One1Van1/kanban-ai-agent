import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { DatabaseModule } from '../../src/modules/database.module';
import { DatabaseManagementModule } from '../../src/modules/database-management.module';
import { databaseConfig } from '../../src/config';

describe('Database Management (E2E)', () => {
  let app: INestApplication;
  let agentId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [databaseConfig],
          envFilePath: '.env.test',
        }),
        DatabaseModule,
        DatabaseManagementModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/database/agents/store-config (POST)', () => {
    it('should create a new agent configuration', () => {
      const createAgentDto = {
        name: 'Test Agent',
        description: 'Test Description',
        status: 'active',
        config: { key: 'value' },
        jiraInstanceUrl: 'https://test.atlassian.net',
        jiraProjectKey: 'TEST',
        contextSources: { source: 'test' },
        notificationSettings: { email: true },
        createdBy: 'test-user',
        instructions: [
          {
            columnId: 'COL1',
            columnName: 'To Do',
            instruction: 'Test instruction',
            triggerEvent: 'on_enter',
            isActive: true,
            priority: 1,
          },
        ],
      };

      return request(app.getHttpServer())
        .post('/database/agents/store-config')
        .send(createAgentDto)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('agentId');
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('message');
          agentId = res.body.agentId;
        });
    });

    it('should update existing agent configuration', () => {
      const updateAgentDto = {
        agentId,
        name: 'Updated Test Agent',
        description: 'Updated Description',
        status: 'inactive',
      };

      return request(app.getHttpServer())
        .post('/database/agents/store-config')
        .send(updateAgentDto)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('agentId', agentId);
          expect(res.body).toHaveProperty('success', true);
          expect(res.body.message).toContain('updated');
        });
    });

    it('should return 404 when updating non-existent agent', () => {
      const updateAgentDto = {
        agentId: '00000000-0000-0000-0000-000000000000',
        name: 'Non-existent Agent',
      };

      return request(app.getHttpServer())
        .post('/database/agents/store-config')
        .send(updateAgentDto)
        .expect(404);
    });

    it('should validate required fields', () => {
      const invalidDto = {
        description: 'Missing name field',
      };

      return request(app.getHttpServer())
        .post('/database/agents/store-config')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('/database/task-history/store (POST)', () => {
    it('should create task history record', () => {
      const taskHistoryDto = {
        agentId,
        taskId: 'TASK-123',
        taskKey: 'TEST-123',
        taskTitle: 'Test Task',
        action: 'status_changed',
        fromStatus: 'To Do',
        toStatus: 'In Progress',
        fromColumn: 'COLUMN_TODO',
        toColumn: 'COLUMN_PROGRESS',
        context: { key: 'value' },
        status: 'pending',
      };

      return request(app.getHttpServer())
        .post('/database/task-history/store')
        .send(taskHistoryDto)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('historyId');
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('message');
        });
    });

    it('should validate required fields for task history', () => {
      const invalidDto = {
        taskId: 'TASK-123',
        // Missing required fields
      };

      return request(app.getHttpServer())
        .post('/database/task-history/store')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('/database/task-history/agent/:agentId (GET)', () => {
    it('should retrieve task history by agent', () => {
      return request(app.getHttpServer())
        .get(`/database/task-history/agent/${agentId}`)
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should retrieve task history with limit', () => {
      return request(app.getHttpServer())
        .get(`/database/task-history/agent/${agentId}?limit=10`)
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/database/task-history/statistics (GET)', () => {
    it('should retrieve global statistics', () => {
      return request(app.getHttpServer())
        .get('/database/task-history/statistics')
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('completed');
          expect(res.body).toHaveProperty('failed');
          expect(res.body).toHaveProperty('pending');
        });
    });

    it('should retrieve agent-specific statistics', () => {
      return request(app.getHttpServer())
        .get(`/database/task-history/statistics?agentId=${agentId}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('completed');
          expect(res.body).toHaveProperty('failed');
          expect(res.body).toHaveProperty('pending');
        });
    });
  });
});
