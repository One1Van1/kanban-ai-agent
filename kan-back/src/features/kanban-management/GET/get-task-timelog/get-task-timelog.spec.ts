import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetTaskTimelogController } from './get-task-timelog.controller';
import { GetTaskTimelogService } from './get-task-timelog.service';
import { TaskHistory } from '../../../../entities/task-history.entity';

describe('GetTaskTimelogController (E2E)', () => {
  let app: INestApplication;
  let controller: GetTaskTimelogController;

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
      controllers: [GetTaskTimelogController],
      providers: [GetTaskTimelogService],
    }).compile();

    app = moduleFixture.createNestApplication();
    controller = moduleFixture.get<GetTaskTimelogController>(
      GetTaskTimelogController,
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/kanban/tasks/:id/timelog (GET)', () => {
    it('should return task timelog with pagination and summary', async () => {
      const taskId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

      return request(app.getHttpServer())
        .get(`/kanban/tasks/${taskId}/timelog`)
        .query({ page: 1, limit: 20 })
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('success');
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('taskId');
          expect(res.body.data).toHaveProperty('items');
          expect(res.body.data).toHaveProperty('total');
          expect(res.body.data).toHaveProperty('page');
          expect(res.body.data).toHaveProperty('limit');
          expect(res.body.data).toHaveProperty('totalPages');
          expect(res.body.data).toHaveProperty('summary');
          expect(Array.isArray(res.body.data.items)).toBe(true);
          expect(res.body.data.taskId).toBe(taskId);
        });
    });

    it('should handle invalid task ID format', async () => {
      return request(app.getHttpServer())
        .get('/kanban/tasks/invalid-uuid/timelog')
        .expect(400);
    });

    it('should handle date filtering', async () => {
      const taskId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

      return request(app.getHttpServer())
        .get(`/kanban/tasks/${taskId}/timelog`)
        .query({
          fromDate: '2024-01-01T00:00:00Z',
          toDate: '2024-01-31T23:59:59Z',
        })
        .expect(200)
        .then((res) => {
          expect(res.body.data.items).toBeDefined();
        });
    });

    it('should return timelog entries with correct structure', async () => {
      const taskId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

      return request(app.getHttpServer())
        .get(`/kanban/tasks/${taskId}/timelog`)
        .expect(200)
        .then((res) => {
          if (res.body.data.items.length > 0) {
            const firstEntry = res.body.data.items[0];
            expect(firstEntry).toHaveProperty('id');
            expect(firstEntry).toHaveProperty('taskId');
            expect(firstEntry).toHaveProperty('userId');
            expect(firstEntry).toHaveProperty('description');
            expect(firstEntry).toHaveProperty('timeSpentMinutes');
            expect(firstEntry).toHaveProperty('startTime');
            expect(firstEntry).toHaveProperty('endTime');
            expect(firstEntry).toHaveProperty('createdAt');
          }
        });
    });

    it('should return summary with correct structure', async () => {
      const taskId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

      return request(app.getHttpServer())
        .get(`/kanban/tasks/${taskId}/timelog`)
        .expect(200)
        .then((res) => {
          const summary = res.body.data.summary;
          expect(summary).toHaveProperty('totalTimeSpentMinutes');
          expect(summary).toHaveProperty('totalTimeSpentHours');
          expect(summary).toHaveProperty('averageTimePerEntry');
          expect(summary).toHaveProperty('totalEntries');
          expect(summary).toHaveProperty('uniqueUsers');
        });
    });

    it('should handle pagination parameters', async () => {
      const taskId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

      return request(app.getHttpServer())
        .get(`/kanban/tasks/${taskId}/timelog`)
        .query({ page: 2, limit: 5 })
        .expect(200)
        .then((res) => {
          expect(res.body.data.page).toBe(2);
          expect(res.body.data.limit).toBe(5);
        });
    });
  });
});
