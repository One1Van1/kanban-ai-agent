import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadAttachmentController } from './upload-attachment.controller';
import { UploadAttachmentService } from './upload-attachment.service';
import { TaskHistory } from '@/entities/task-history.entity';
describe('UploadAttachmentController (E2E)', () => {
  let app: INestApplication;

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
      controllers: [UploadAttachmentController],
      providers: [UploadAttachmentService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/kanban/tasks/:id/attachments (POST)', () => {
    it('should upload a file attachment successfully', async () => {
      const taskId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const fileData = {
        fileName: 'test.pdf',
        mimeType: 'application/pdf',
        fileSize: 1024,
        fileContent: 'JVBERi0xLjQKJcOkw7zDtsO=', // Mock base64
        uploadedBy: 'agent-001',
        description: 'Test document',
      };

      return request(app.getHttpServer())
        .post(`/kanban/tasks/${taskId}/attachments`)
        .send(fileData)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('success');
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data).toHaveProperty('taskId');
          expect(res.body.data).toHaveProperty('fileName');
          expect(res.body.data).toHaveProperty('fileUrl');
          expect(res.body.data).toHaveProperty('downloadUrl');
          expect(res.body.data.taskId).toBe(taskId);
          expect(res.body.data.fileName).toBe(fileData.fileName);
        });
    });

    it('should validate file size limit', async () => {
      const taskId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const fileData = {
        fileName: 'large-file.pdf',
        mimeType: 'application/pdf',
        fileSize: 20971520, // 20MB - exceeds 10MB limit
        fileContent: 'JVBERi0xLjQKJcOkw7zDtsO=',
        uploadedBy: 'agent-001',
      };

      return request(app.getHttpServer())
        .post(`/kanban/tasks/${taskId}/attachments`)
        .send(fileData)
        .expect(400);
    });
  });
});
