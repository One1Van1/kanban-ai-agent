import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetUserActivityController } from './get-user-activity.controller';
import { GetUserActivityService } from './get-user-activity.service';
import { TaskHistory } from '@/entities/task-history.entity';
describe('GetUserActivityController (E2E)', () => {
  let app: INestApplication;
  let controller: GetUserActivityController;

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
      controllers: [GetUserActivityController],
      providers: [GetUserActivityService],
    }).compile();

    app = moduleFixture.createNestApplication();
    controller = moduleFixture.get<GetUserActivityController>(
      GetUserActivityController,
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/kanban/users/:id/activity (GET)', () => {
    it('should return user activity with pagination', async () => {
      const userId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

      return request(app.getHttpServer())
        .get(`/kanban/users/${userId}/activity`)
        .query({ page: 1, limit: 20 })
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('success');
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('userId');
          expect(res.body.data).toHaveProperty('items');
          expect(res.body.data).toHaveProperty('total');
          expect(res.body.data).toHaveProperty('page');
          expect(res.body.data).toHaveProperty('limit');
          expect(res.body.data).toHaveProperty('totalPages');
          expect(Array.isArray(res.body.data.items)).toBe(true);
          expect(res.body.data.userId).toBe(userId);
        });
    });

    it('should handle invalid user ID format', async () => {
      return request(app.getHttpServer())
        .get('/kanban/users/invalid-uuid/activity')
        .expect(400);
    });

    it('should filter by activity type', async () => {
      const userId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

      return request(app.getHttpServer())
        .get(`/kanban/users/${userId}/activity`)
        .query({ type: 'created' })
        .expect(200)
        .then((res) => {
          expect(
            res.body.data.items.every(
              (item: any) =>
                item.type === 'created' || res.body.data.items.length === 0,
            ),
          ).toBe(true);
        });
    });

    it('should handle pagination parameters', async () => {
      const userId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

      return request(app.getHttpServer())
        .get(`/kanban/users/${userId}/activity`)
        .query({ page: 2, limit: 5 })
        .expect(200)
        .then((res) => {
          expect(res.body.data.page).toBe(2);
          expect(res.body.data.limit).toBe(5);
        });
    });

    it('should return activities with correct structure', async () => {
      const userId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

      return request(app.getHttpServer())
        .get(`/kanban/users/${userId}/activity`)
        .expect(200)
        .then((res) => {
          if (res.body.data.items.length > 0) {
            const firstActivity = res.body.data.items[0];
            expect(firstActivity).toHaveProperty('id');
            expect(firstActivity).toHaveProperty('type');
            expect(firstActivity).toHaveProperty('taskId');
            expect(firstActivity).toHaveProperty('taskTitle');
            expect(firstActivity).toHaveProperty('description');
            expect(firstActivity).toHaveProperty('timestamp');
            expect(firstActivity).toHaveProperty('details');
          }
        });
    });
  });
});
