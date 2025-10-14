import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { GetTaskFilesByUserController } from './get-task-files-by-user.controller';
import { GetTaskFilesByUserService } from './get-task-files-by-user.service';
import {
  FileType,
  SortBy,
  SortOrder,
} from './get-task-files-by-user.query.dto';

describe('GetTaskFilesByUserController (E2E)', () => {
  let app: INestApplication;
  let getTaskFilesByUserService: GetTaskFilesByUserService;

  const mockFiles = [
    {
      id: 'file_123',
      fileName: 'screenshot_bug.png',
      fileUrl: 'https://example.com/files/screenshot_bug.png',
      thumbnailUrl: 'https://example.com/thumbnails/screenshot_bug_thumb.png',
      fileType: FileType.IMAGE,
      mimeType: 'image/png',
      fileSize: 524288,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      uploaderEmail: 'john.doe@company.com',
      uploaderName: 'John Doe',
      description: 'Bug report screenshot',
      tags: ['bug', 'screenshot'],
    },
    {
      id: 'file_456',
      fileName: 'test_document.pdf',
      fileUrl: 'https://example.com/files/test_document.pdf',
      fileType: FileType.DOCUMENT,
      mimeType: 'application/pdf',
      fileSize: 1048576,
      createdAt: '2024-01-14T15:20:00Z',
      updatedAt: '2024-01-14T15:20:00Z',
      uploaderEmail: 'john.doe@company.com',
      uploaderName: 'John Doe',
      description: 'Test documentation',
      tags: ['test', 'specification'],
    },
  ];

  const mockResponse = {
    success: true,
    message: 'Task files retrieved successfully',
    files: mockFiles,
    totalFiles: 2,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
    fileTypeCounts: {
      images: 1,
      documents: 1,
      archives: 0,
      videos: 0,
      others: 0,
    },
  };

  const mockGetTaskFilesByUserService = {
    execute: jest.fn().mockResolvedValue(mockResponse),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
      ],
      controllers: [GetTaskFilesByUserController],
      providers: [
        {
          provide: GetTaskFilesByUserService,
          useValue: mockGetTaskFilesByUserService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    getTaskFilesByUserService = moduleFixture.get<GetTaskFilesByUserService>(
      GetTaskFilesByUserService,
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /jira/tasks/:taskId/files/user/:userId', () => {
    const taskId = 'PROJ-123';
    const userId = 'john.doe@company.com';

    it('should successfully retrieve task files for a specific user', async () => {
      const response = await request(app.getHttpServer())
        .get(`/jira/tasks/${taskId}/files/user/${userId}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('files');
      expect(response.body).toHaveProperty('totalFiles', 2);
      expect(response.body).toHaveProperty('totalPages', 1);
      expect(response.body).toHaveProperty('currentPage', 1);
      expect(response.body).toHaveProperty('limit', 10);
      expect(response.body).toHaveProperty('fileTypeCounts');

      // Проверяем структуру файлов
      const files = response.body.files;
      expect(Array.isArray(files)).toBe(true);
      expect(files).toHaveLength(2);

      // Проверяем структуру первого файла
      const firstFile = files[0];
      expect(firstFile).toHaveProperty('id');
      expect(firstFile).toHaveProperty('fileName');
      expect(firstFile).toHaveProperty('fileUrl');
      expect(firstFile).toHaveProperty('fileType');
      expect(firstFile).toHaveProperty('mimeType');
      expect(firstFile).toHaveProperty('fileSize');
      expect(firstFile).toHaveProperty('createdAt');
      expect(firstFile).toHaveProperty('uploaderEmail');
      expect(firstFile).toHaveProperty('uploaderName');

      expect(mockGetTaskFilesByUserService.execute).toHaveBeenCalledWith(
        taskId,
        userId,
        expect.any(Object),
      );
    });

    it('should handle pagination parameters correctly', async () => {
      const response = await request(app.getHttpServer())
        .get(`/jira/tasks/${taskId}/files/user/${userId}`)
        .query({
          page: 1,
          limit: 5,
        })
        .expect(200);

      expect(mockGetTaskFilesByUserService.execute).toHaveBeenCalledWith(
        taskId,
        userId,
        expect.objectContaining({
          page: 1,
          limit: 5,
        }),
      );
    });

    it('should handle file type filtering', async () => {
      const response = await request(app.getHttpServer())
        .get(`/jira/tasks/${taskId}/files/user/${userId}`)
        .query({
          fileType: FileType.IMAGE,
        })
        .expect(200);

      expect(mockGetTaskFilesByUserService.execute).toHaveBeenCalledWith(
        taskId,
        userId,
        expect.objectContaining({
          fileType: FileType.IMAGE,
        }),
      );
    });

    it('should handle sorting parameters', async () => {
      const response = await request(app.getHttpServer())
        .get(`/jira/tasks/${taskId}/files/user/${userId}`)
        .query({
          sortBy: SortBy.FILE_SIZE,
          sortOrder: SortOrder.ASC,
        })
        .expect(200);

      expect(mockGetTaskFilesByUserService.execute).toHaveBeenCalledWith(
        taskId,
        userId,
        expect.objectContaining({
          sortBy: SortBy.FILE_SIZE,
          sortOrder: SortOrder.ASC,
        }),
      );
    });

    it('should handle search parameter', async () => {
      const response = await request(app.getHttpServer())
        .get(`/jira/tasks/${taskId}/files/user/${userId}`)
        .query({
          search: 'screenshot',
        })
        .expect(200);

      expect(mockGetTaskFilesByUserService.execute).toHaveBeenCalledWith(
        taskId,
        userId,
        expect.objectContaining({
          search: 'screenshot',
        }),
      );
    });

    it('should return file type counts correctly', async () => {
      const response = await request(app.getHttpServer())
        .get(`/jira/tasks/${taskId}/files/user/${userId}`)
        .expect(200);

      const fileTypeCounts = response.body.fileTypeCounts;
      expect(fileTypeCounts).toHaveProperty('images');
      expect(fileTypeCounts).toHaveProperty('documents');
      expect(fileTypeCounts).toHaveProperty('archives');
      expect(fileTypeCounts).toHaveProperty('videos');
      expect(fileTypeCounts).toHaveProperty('others');
      expect(typeof fileTypeCounts.images).toBe('number');
      expect(typeof fileTypeCounts.documents).toBe('number');
    });

    it('should handle service errors gracefully', async () => {
      mockGetTaskFilesByUserService.execute.mockRejectedValueOnce(
        new Error('Jira API error'),
      );

      await request(app.getHttpServer())
        .get(`/jira/tasks/${taskId}/files/user/${userId}`)
        .expect(500);
    });

    it('should handle invalid parameters', async () => {
      // Тестируем с невалидным номером страницы
      await request(app.getHttpServer())
        .get(`/jira/tasks/${taskId}/files/user/${userId}`)
        .query({
          page: 0, // Невалидная страница
        })
        .expect(400);
    });

    it('should validate enum parameters correctly', async () => {
      const response = await request(app.getHttpServer())
        .get(`/jira/tasks/${taskId}/files/user/${userId}`)
        .query({
          fileType: 'invalid_type', // Невалидный тип файла
        })
        .expect(400);
    });
  });
});
