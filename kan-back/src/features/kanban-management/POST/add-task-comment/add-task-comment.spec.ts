import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddTaskCommentController } from './add-task-comment.controller';
import { AddTaskCommentService } from './add-task-comment.service';
import { TaskHistory } from '../../../../entities/task-history.entity';
import { AddTaskCommentRequestDto } from './add-task-comment.request.dto';

describe('AddTaskCommentController (E2E)', () => {
  let app: INestApplication;
  let service: AddTaskCommentService;

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
      controllers: [AddTaskCommentController],
      providers: [AddTaskCommentService],
    }).compile();

    app = module.createNestApplication();
    service = module.get<AddTaskCommentService>(AddTaskCommentService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /kanban/tasks/:id/comments', () => {
    it('should add comment to existing task successfully', async () => {
      const taskId = 'PROJ-123';
      const commentDto: AddTaskCommentRequestDto = {
        comment: 'Работа над задачей начата. Планирую завершить до конца дня.',
        authorEmail: 'john.doe@example.com',
        authorName: 'John Doe',
        context: { commentType: 'status_update' },
      };

      // First, we'd need to create a task in the database
      // For this test, we assume the task exists

      return request(app.getHttpServer())
        .post(`/kanban/tasks/${taskId}/comments`)
        .send(commentDto)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('comment');
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('taskId', taskId);
          expect(res.body.comment).toHaveProperty('text', commentDto.comment);
          expect(res.body.comment).toHaveProperty(
            'author',
            commentDto.authorName,
          );
          expect(res.body.comment).toHaveProperty(
            'authorEmail',
            commentDto.authorEmail,
          );
        });
    });

    it('should return 404 for non-existing task', async () => {
      const nonExistentTaskId = 'NON-EXISTENT';
      const commentDto: AddTaskCommentRequestDto = {
        comment: 'Test comment',
      };

      return request(app.getHttpServer())
        .post(`/kanban/tasks/${nonExistentTaskId}/comments`)
        .send(commentDto)
        .expect(404)
        .then((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('not found');
        });
    });

    it('should return 400 for invalid request data', async () => {
      const taskId = 'PROJ-123';
      const invalidDto = {
        comment: '', // Empty comment
      };

      return request(app.getHttpServer())
        .post(`/kanban/tasks/${taskId}/comments`)
        .send(invalidDto)
        .expect(400);
    });

    it('should handle optional fields correctly', async () => {
      const taskId = 'PROJ-123';
      const minimalDto: AddTaskCommentRequestDto = {
        comment: 'Simple comment without author info',
      };

      return request(app.getHttpServer())
        .post(`/kanban/tasks/${taskId}/comments`)
        .send(minimalDto)
        .expect(201)
        .then((res) => {
          expect(res.body.comment).toHaveProperty('author', 'Anonymous');
          expect(res.body.comment).toHaveProperty('authorEmail', '');
          expect(res.body.comment).toHaveProperty('type', 'general');
        });
    });

    it('should handle long comments correctly', async () => {
      const taskId = 'PROJ-123';
      const longComment = 'A'.repeat(1500); // 1500 characters
      const commentDto: AddTaskCommentRequestDto = {
        comment: longComment,
        authorEmail: 'test@example.com',
      };

      return request(app.getHttpServer())
        .post(`/kanban/tasks/${taskId}/comments`)
        .send(commentDto)
        .expect(201)
        .then((res) => {
          expect(res.body.comment.text).toHaveLength(1500);
          expect(res.body.context).toHaveProperty('characterCount', 1500);
        });
    });
  });
});
