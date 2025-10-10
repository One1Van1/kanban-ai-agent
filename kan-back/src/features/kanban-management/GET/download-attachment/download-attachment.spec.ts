import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { DownloadAttachmentService } from './download-attachment.service';
import { TaskHistory } from '../../../../entities/task-history.entity';
import { DownloadAttachmentQueryDto } from './download-attachment.query.dto';

// Mock fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  createReadStream: jest.fn(),
}));

describe('DownloadAttachmentService', () => {
  let service: DownloadAttachmentService;
  let taskHistoryRepository: Repository<TaskHistory>;

  const mockTaskHistoryRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockAttachment = {
    id: 'hist-att-123',
    taskId: 'task-123',
    taskKey: 'TASK-123',
    taskTitle: 'File uploaded: document.pdf',
    action: 'file_uploaded',
    agentId: 'user-789',
    createdAt: new Date('2024-01-10T08:15:00.000Z'),
    fromStatus: 'In Progress',
    toStatus: 'In Progress',
    fromColumn: 'In Progress',
    toColumn: 'In Progress',
    context: {
      attachmentData: {
        fileName: 'document.pdf',
        fileSize: 1024576,
        mimeType: 'application/pdf',
        filePath: '/uploads/task-123/document.pdf',
      },
    },
    agentResponse: {
      attachmentId: 'att-456',
      fileName: 'document.pdf',
      fileSize: 1024576,
      mimeType: 'application/pdf',
      filePath: '/uploads/task-123/document.pdf',
    },
  };

  const mockResponse = {
    setHeader: jest.fn(),
    send: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DownloadAttachmentService,
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: mockTaskHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<DownloadAttachmentService>(DownloadAttachmentService);
    taskHistoryRepository = module.get<Repository<TaskHistory>>(
      getRepositoryToken(TaskHistory),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    const attachmentId = 'att-456';
    const mockQuery: DownloadAttachmentQueryDto = {
      forceDownload: false,
      requestedBy: 'user-123',
    };

    beforeEach(() => {
      mockTaskHistoryRepository.findOne.mockResolvedValue(mockAttachment);
      mockTaskHistoryRepository.create.mockReturnValue({ id: 'hist-456' });
      mockTaskHistoryRepository.save.mockResolvedValue({ id: 'hist-456' });

      // Mock fs.existsSync to return false (file doesn't exist, will use mock content)
      const fs = require('fs');
      fs.existsSync.mockReturnValue(false);
    });

    it('should successfully download an attachment with inline display', async () => {
      await service.execute(attachmentId, mockQuery, mockResponse);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/pdf',
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'inline; filename="document.pdf"',
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Length',
        '1024576',
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'X-Content-Type-Options',
        'nosniff',
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Cache-Control',
        'private, max-age=3600',
      );

      expect(mockResponse.send).toHaveBeenCalled();
      expect(mockTaskHistoryRepository.save).toHaveBeenCalled();
    });

    it('should successfully download an attachment with force download', async () => {
      const forceDownloadQuery: DownloadAttachmentQueryDto = {
        ...mockQuery,
        forceDownload: true,
      };

      await service.execute(attachmentId, forceDownloadQuery, mockResponse);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename="document.pdf"',
      );
    });

    it('should use custom filename when provided', async () => {
      const customFilenameQuery: DownloadAttachmentQueryDto = {
        ...mockQuery,
        filename: 'my-custom-file.pdf',
      };

      await service.execute(attachmentId, customFilenameQuery, mockResponse);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'inline; filename="my-custom-file.pdf"',
      );
    });

    it('should throw NotFoundException when attachment does not exist', async () => {
      mockTaskHistoryRepository.findOne.mockResolvedValue(null);

      await expect(
        service.execute(attachmentId, mockQuery, mockResponse),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle attachment with minimal data', async () => {
      const minimalAttachment = {
        ...mockAttachment,
        context: {},
        agentResponse: {
          attachmentId: 'att-456',
        },
      };

      mockTaskHistoryRepository.findOne.mockResolvedValue(minimalAttachment);

      await service.execute(attachmentId, mockQuery, mockResponse);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/octet-stream',
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'inline; filename="unknown_file"',
      );
    });

    it('should extract data from agentResponse when context is empty', async () => {
      const attachmentWithAgentResponse = {
        ...mockAttachment,
        context: {},
        agentResponse: {
          attachmentId: 'att-456',
          fileName: 'response-file.jpg',
          fileSize: 512000,
          mimeType: 'image/jpeg',
          filePath: '/uploads/response-file.jpg',
        },
      };

      mockTaskHistoryRepository.findOne.mockResolvedValue(
        attachmentWithAgentResponse,
      );

      await service.execute(attachmentId, mockQuery, mockResponse);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'image/jpeg',
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'inline; filename="response-file.jpg"',
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Length',
        '512000',
      );
    });

    it('should handle missing file size gracefully', async () => {
      const attachmentWithoutSize = {
        ...mockAttachment,
        context: {
          attachmentData: {
            fileName: 'no-size-file.txt',
            mimeType: 'text/plain',
            filePath: '/uploads/no-size-file.txt',
          },
        },
        agentResponse: {
          attachmentId: 'att-456',
        },
      };

      mockTaskHistoryRepository.findOne.mockResolvedValue(
        attachmentWithoutSize,
      );

      await service.execute(attachmentId, mockQuery, mockResponse);

      expect(mockResponse.setHeader).not.toHaveBeenCalledWith(
        'Content-Length',
        expect.anything(),
      );
    });

    it('should log download activity with proper context', async () => {
      await service.execute(attachmentId, mockQuery, mockResponse);

      expect(mockTaskHistoryRepository.create).toHaveBeenCalledWith({
        agentId: 'user-123',
        taskId: 'task-123',
        taskKey: 'TASK-123',
        taskTitle: 'Downloaded attachment: document.pdf',
        action: 'attachment_downloaded',
        fromStatus: 'In Progress',
        toStatus: 'In Progress',
        fromColumn: 'In Progress',
        toColumn: 'In Progress',
        status: 'completed',
        context: {
          attachmentId: 'att-456',
          fileName: 'document.pdf',
          fileSize: 1024576,
          mimeType: 'application/pdf',
          downloadedBy: 'user-123',
          downloadedAt: expect.any(Date),
        },
        agentResponse: {
          success: true,
          attachmentDownloaded: true,
          attachmentId: 'att-456',
          fileName: 'document.pdf',
          timestamp: expect.any(String),
        },
      });
    });

    it('should handle download without requestedBy field', async () => {
      const queryWithoutUser: DownloadAttachmentQueryDto = {
        forceDownload: true,
      };

      await service.execute(attachmentId, queryWithoutUser, mockResponse);

      expect(mockTaskHistoryRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          agentId: 'anonymous',
          context: expect.objectContaining({
            downloadedBy: undefined,
          }),
        }),
      );
    });

    it('should throw NotFoundException when file path is empty', async () => {
      const attachmentWithoutPath = {
        ...mockAttachment,
        context: {
          attachmentData: {
            fileName: 'no-path-file.txt',
            mimeType: 'text/plain',
            filePath: '',
          },
        },
        agentResponse: {
          attachmentId: 'att-456',
        },
      };

      mockTaskHistoryRepository.findOne.mockResolvedValue(
        attachmentWithoutPath,
      );

      await expect(
        service.execute(attachmentId, mockQuery, mockResponse),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
