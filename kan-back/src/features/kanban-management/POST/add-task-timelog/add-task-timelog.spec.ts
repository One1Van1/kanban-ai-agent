import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddTaskTimelogController } from './add-task-timelog.controller';
import { AddTaskTimelogService } from './add-task-timelog.service';
import { TaskHistory } from '../../../../entities/task-history.entity';

describe('AddTaskTimelogController (E2E)', () => {
  let app: INestApplication;
  let controller: AddTaskTimelogController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [TaskHistory],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([TaskHistory]),
      ],
      controllers: [AddTaskTimelogController],
      providers: [AddTaskTimelogService],
    }).compile();

    app = moduleFixture.createNestApplication();
    controller = moduleFixture.get<AddTaskTimelogController>(
      AddTaskTimelogController,
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/kanban/tasks/:id/timelog (POST)', () => {
    it('should create a new timelog entry', async () => {
      const taskId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const timelogData = {
        description: 'Implemented user authentication',
        timeSpentMinutes: 120,
        startTime: '2024-01-15T09:00:00Z',
        endTime: '2024-01-15T11:00:00Z',
        userId: 'agent-001',
        notes: 'Used TDD approach',
      };

      return request(app.getHttpServer())
        .post(`/kanban/tasks/${taskId}/timelog`)
        .send(timelogData)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('success');
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('message');
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data).toHaveProperty('taskId');
          expect(res.body.data).toHaveProperty('userId');
          expect(res.body.data).toHaveProperty('description');
          expect(res.body.data).toHaveProperty('timeSpentMinutes');
          expect(res.body.data).toHaveProperty('timeSpentHours');
          expect(res.body.data).toHaveProperty('startTime');
          expect(res.body.data).toHaveProperty('endTime');
          expect(res.body.data).toHaveProperty('createdAt');
          expect(res.body.data.taskId).toBe(taskId);
          expect(res.body.data.userId).toBe(timelogData.userId);
          expect(res.body.data.description).toBe(timelogData.description);
          expect(res.body.data.timeSpentMinutes).toBe(
            timelogData.timeSpentMinutes,
          );
          expect(res.body.data.notes).toBe(timelogData.notes);
        });
    });

    it('should handle invalid task ID format', async () => {
      const timelogData = {
        description: 'Test work',
        timeSpentMinutes: 60,
        startTime: '2024-01-15T09:00:00Z',
        endTime: '2024-01-15T10:00:00Z',
        userId: 'agent-001',
      };

      return request(app.getHttpServer())
        .post('/kanban/tasks/invalid-uuid/timelog')
        .send(timelogData)
        .expect(400);
    });

    it('should validate required fields', async () => {
      const taskId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const invalidData = {
        description: 'Test work',
        // Missing required fields
      };

      return request(app.getHttpServer())
        .post(`/kanban/tasks/${taskId}/timelog`)
        .send(invalidData)
        .expect(400);
    });

    it('should validate time spent range', async () => {
      const taskId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const invalidData = {
        description: 'Test work',
        timeSpentMinutes: 2000, // More than 24 hours
        startTime: '2024-01-15T09:00:00Z',
        endTime: '2024-01-15T10:00:00Z',
        userId: 'agent-001',
      };

      return request(app.getHttpServer())
        .post(`/kanban/tasks/${taskId}/timelog`)
        .send(invalidData)
        .expect(400);
    });

    it('should validate date format', async () => {
      const taskId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const invalidData = {
        description: 'Test work',
        timeSpentMinutes: 60,
        startTime: 'invalid-date',
        endTime: '2024-01-15T10:00:00Z',
        userId: 'agent-001',
      };

      return request(app.getHttpServer())
        .post(`/kanban/tasks/${taskId}/timelog`)
        .send(invalidData)
        .expect(400);
    });

    it('should handle timelog entry without notes', async () => {
      const taskId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const timelogData = {
        description: 'Bug fixing',
        timeSpentMinutes: 30,
        startTime: '2024-01-15T14:00:00Z',
        endTime: '2024-01-15T14:30:00Z',
        userId: 'agent-002',
      };

      return request(app.getHttpServer())
        .post(`/kanban/tasks/${taskId}/timelog`)
        .send(timelogData)
        .expect(201)
        .then((res) => {
          expect(res.body.data.notes).toBeUndefined();
        });
    });
  });
});
