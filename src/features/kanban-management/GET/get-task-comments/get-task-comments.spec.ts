import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetTaskCommentsController } from './get-task-comments.controller';
import { GetTaskCommentsService } from './get-task-comments.service';
import { TaskHistory } from '../../../../entities/task-history.entity';

describe('GetTaskCommentsController (E2E)', () => {
  let app: INestApplication;
  let controller: GetTaskCommentsController;

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
      controllers: [GetTaskCommentsController],
      providers: [GetTaskCommentsService],
    }).compile();

    app = moduleFixture.createNestApplication();
    controller = moduleFixture.get<GetTaskCommentsController>(
      GetTaskCommentsController,
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/kanban/tasks/:id/comments (GET)', () => {
    it('should return task comments with pagination', async () => {
      const taskId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

      return request(app.getHttpServer())
        .get(`/kanban/tasks/${taskId}/comments`)
        .query({ page: 1, limit: 20 })
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('success');
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('items');
          expect(res.body.data).toHaveProperty('total');
          expect(res.body.data).toHaveProperty('page');
          expect(res.body.data).toHaveProperty('limit');
          expect(res.body.data).toHaveProperty('totalPages');
          expect(Array.isArray(res.body.data.items)).toBe(true);
        });
    });

    it('should handle invalid task ID format', async () => {
      return request(app.getHttpServer())
        .get('/kanban/tasks/invalid-uuid/comments')
        .expect(400);
    });

    it('should handle pagination parameters', async () => {
      const taskId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

      return request(app.getHttpServer())
        .get(`/kanban/tasks/${taskId}/comments`)
        .query({ page: 2, limit: 5, sortOrder: 'ASC' })
        .expect(200)
        .then((res) => {
          expect(res.body.data.page).toBe(2);
          expect(res.body.data.limit).toBe(5);
        });
    });

    it('should return empty results when no comments exist', async () => {
      const taskId = 'f47ac10b-58cc-4372-a567-0e02b2c3d480';

      return request(app.getHttpServer())
        .get(`/kanban/tasks/${taskId}/comments`)
        .expect(200)
        .then((res) => {
          expect(res.body.data.items).toEqual([]);
          expect(res.body.data.total).toBe(0);
        });
    });
  });
});
