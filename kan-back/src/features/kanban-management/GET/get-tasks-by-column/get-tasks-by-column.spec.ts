import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetTasksByColumnController } from './get-tasks-by-column.controller';
import { GetTasksByColumnService } from './get-tasks-by-column.service';
import { TaskHistory } from '@/entities/task-history.entity';
describe('GetTasksByColumnController (E2E)', () => {
  let app: INestApplication;
  let service: GetTasksByColumnService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [TaskHistory],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([TaskHistory]),
      ],
      controllers: [GetTasksByColumnController],
      providers: [GetTasksByColumnService],
    }).compile();

    app = module.createNestApplication();
    service = module.get<GetTasksByColumnService>(GetTasksByColumnService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /kanban/columns/:column/tasks', () => {
    it('should return tasks for existing column', async () => {
      const columnName = 'In Progress';

      return request(app.getHttpServer())
        .get(`/kanban/columns/${encodeURIComponent(columnName)}/tasks`)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('tasks');
          expect(res.body).toHaveProperty('column');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('limit');
          expect(res.body).toHaveProperty('offset');
          expect(res.body).toHaveProperty('hasMore');
          expect(res.body.column).toBe(columnName);
          expect(Array.isArray(res.body.tasks)).toBe(true);
        });
    });

    it('should handle pagination parameters', async () => {
      const columnName = 'To Do';

      return request(app.getHttpServer())
        .get(
          `/kanban/columns/${encodeURIComponent(columnName)}/tasks?limit=5&offset=10`,
        )
        .expect(200)
        .then((res) => {
          expect(res.body.limit).toBe(5);
          expect(res.body.offset).toBe(10);
        });
    });

    it('should return empty array for non-existing column', async () => {
      const nonExistentColumn = 'Non Existent Column';

      return request(app.getHttpServer())
        .get(`/kanban/columns/${encodeURIComponent(nonExistentColumn)}/tasks`)
        .expect(200)
        .then((res) => {
          expect(res.body.tasks).toEqual([]);
          expect(res.body.total).toBe(0);
        });
    });

    it('should validate limit parameter bounds', async () => {
      const columnName = 'To Do';

      return request(app.getHttpServer())
        .get(
          `/kanban/columns/${encodeURIComponent(columnName)}/tasks?limit=150`,
        )
        .expect(400);
    });
  });
});
