import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoveTaskToColumnController } from './move-task-to-column.controller';
import { MoveTaskToColumnService } from './move-task-to-column.service';
import { TaskHistory } from '@/entities/task-history.entity';
import { MoveTaskRequestDto } from './move-task-request.dto';

describe('MoveTaskToColumnController (E2E)', () => {
  let app: INestApplication;
  let service: MoveTaskToColumnService;

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
      controllers: [MoveTaskToColumnController],
      providers: [MoveTaskToColumnService],
    }).compile();

    app = module.createNestApplication();
    service = module.get<MoveTaskToColumnService>(MoveTaskToColumnService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('PATCH /kanban/tasks/:id/move', () => {
    it('should move task to new column successfully', async () => {
      const taskId = 'PROJ-123';
      const moveDto: MoveTaskRequestDto = {
        targetColumn: 'In Progress',
        newStatus: 'in_progress',
        context: { reason: 'Starting work' },
      };

      // First, we'd need to create a task in the database
      // For this test, we assume the task exists

      return request(app.getHttpServer())
        .patch(`/kanban/tasks/${taskId}/move`)
        .send(moveDto)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('task');
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('message');
          expect(res.body.task).toHaveProperty(
            'toColumn',
            moveDto.targetColumn,
          );
          expect(res.body.task).toHaveProperty('toStatus', moveDto.newStatus);
        });
    });

    it('should return 404 for non-existing task', async () => {
      const nonExistentTaskId = 'NON-EXISTENT';
      const moveDto: MoveTaskRequestDto = {
        targetColumn: 'In Progress',
      };

      return request(app.getHttpServer())
        .patch(`/kanban/tasks/${nonExistentTaskId}/move`)
        .send(moveDto)
        .expect(404)
        .then((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('not found');
        });
    });

    it('should return 400 for invalid request data', async () => {
      const taskId = 'PROJ-123';
      const invalidDto = {
        targetColumn: '', // Empty target column
      };

      return request(app.getHttpServer())
        .patch(`/kanban/tasks/${taskId}/move`)
        .send(invalidDto)
        .expect(400);
    });

    it('should handle optional fields correctly', async () => {
      const taskId = 'PROJ-123';
      const minimalDto: MoveTaskRequestDto = {
        targetColumn: 'Done',
      };

      return request(app.getHttpServer())
        .patch(`/kanban/tasks/${taskId}/move`)
        .send(minimalDto)
        .expect(200)
        .then((res) => {
          expect(res.body.task).toHaveProperty('toColumn', 'Done');
          // Status should remain the same if not provided
        });
    });
  });
});
