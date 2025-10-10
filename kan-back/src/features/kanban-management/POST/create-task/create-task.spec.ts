import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateTaskController } from './create-task.controller';
import { CreateTaskService } from './create-task.service';
import { TaskHistory } from '../../../../entities/task-history.entity';
import { CreateTaskRequestDto } from './create-task.request.dto';

describe('CreateTaskController (E2E)', () => {
  let app: INestApplication;
  let service: CreateTaskService;

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
      controllers: [CreateTaskController],
      providers: [CreateTaskService],
    }).compile();

    app = module.createNestApplication();
    service = module.get<CreateTaskService>(CreateTaskService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /kanban/tasks', () => {
    it('should create a new task successfully', async () => {
      const createTaskDto: CreateTaskRequestDto = {
        taskKey: 'PROJ-123',
        taskTitle: 'Fix authentication bug',
        initialColumn: 'To Do',
        initialStatus: 'pending',
        context: { priority: 'high' },
      };

      return request(app.getHttpServer())
        .post('/kanban/tasks')
        .send(createTaskDto)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('task');
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('message');
          expect(res.body.task).toHaveProperty(
            'taskKey',
            createTaskDto.taskKey,
          );
          expect(res.body.task).toHaveProperty(
            'taskTitle',
            createTaskDto.taskTitle,
          );
          expect(res.body.task).toHaveProperty(
            'initialColumn',
            createTaskDto.initialColumn,
          );
        });
    });

    it('should return 409 for duplicate task key', async () => {
      const createTaskDto: CreateTaskRequestDto = {
        taskKey: 'DUPLICATE-123',
        taskTitle: 'Duplicate task',
        initialColumn: 'To Do',
      };

      // Create first task
      await request(app.getHttpServer())
        .post('/kanban/tasks')
        .send(createTaskDto)
        .expect(201);

      // Try to create duplicate
      return request(app.getHttpServer())
        .post('/kanban/tasks')
        .send(createTaskDto)
        .expect(409)
        .then((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('already exists');
        });
    });

    it('should return 400 for invalid request data', async () => {
      const invalidDto = {
        taskKey: '', // Empty task key
        taskTitle: 'Valid title',
        initialColumn: 'To Do',
      };

      return request(app.getHttpServer())
        .post('/kanban/tasks')
        .send(invalidDto)
        .expect(400);
    });

    it('should handle missing optional fields', async () => {
      const minimalDto: CreateTaskRequestDto = {
        taskKey: 'MINIMAL-123',
        taskTitle: 'Minimal task',
        initialColumn: 'To Do',
      };

      return request(app.getHttpServer())
        .post('/kanban/tasks')
        .send(minimalDto)
        .expect(201)
        .then((res) => {
          expect(res.body.task).toHaveProperty('initialStatus', 'pending');
          expect(res.body.task).toHaveProperty('context', {});
        });
    });
  });
});
