import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetTaskDetailsController } from './get-task-details.controller';
import { GetTaskDetailsService } from './get-task-details.service';
import { TaskHistory } from '@/entities/task-history.entity';
describe('GetTaskDetailsController (E2E)', () => {
  let app: INestApplication;
  let service: GetTaskDetailsService;

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
      controllers: [GetTaskDetailsController],
      providers: [GetTaskDetailsService],
    }).compile();

    app = module.createNestApplication();
    service = module.get<GetTaskDetailsService>(GetTaskDetailsService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /kanban/tasks/:id', () => {
    it('should return task details for existing task', async () => {
      // Mock task data would be inserted here in real test
      const taskId = 123;

      return request(app.getHttpServer())
        .get(`/kanban/tasks/${taskId}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('task');
          expect(res.body).toHaveProperty('history');
          expect(res.body).toHaveProperty('historyCount');
          expect(res.body.task).toHaveProperty('taskId');
          expect(res.body.task).toHaveProperty('taskKey');
          expect(res.body.task).toHaveProperty('taskTitle');
        });
    });

    it('should return 404 for non-existing task', async () => {
      const nonExistentTaskId = 99999;

      return request(app.getHttpServer())
        .get(`/kanban/tasks/${nonExistentTaskId}`)
        .expect(404)
        .then((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('not found');
        });
    });

    it('should return 400 for invalid task ID format', async () => {
      const invalidTaskId = 'invalid-id';

      return request(app.getHttpServer())
        .get(`/kanban/tasks/${invalidTaskId}`)
        .expect(400);
    });
  });
});
