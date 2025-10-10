import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { DeleteTaskAttachmentService } from './delete-task-attachment.service';
import { TaskHistory } from '@/entities/task-history.entity';
import {
  DeleteTaskAttachmentRequestDto,
  AttachmentDeleteMode,
} from './delete-task-attachment.request.dto';

describe('DeleteTaskAttachmentService', () => {
  let service: DeleteTaskAttachmentService;
  let taskHistoryRepository: Repository<TaskHistory>;

  const mockTaskHistoryRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockTask = {
    id: 'hist-task-123',
    taskId: 'task-123',
    taskKey: 'TASK-123',
    taskTitle: 'Test Task',
    action: 'task_created',
    createdAt: new Date('2024-01-10T08:00:00.000Z'),
    context: {
      assignmentData: {
        assignee: 'user-456',
        watchers: ['user-789', 'user-101'],
      },
    },
  };

  const mockAttachment = {
    id: 'hist-att-123',
    taskId: 'task-123',
    taskKey: 'TASK-123',
    taskTitle: 'File uploaded: requirements-document.pdf',
    action: 'file_uploaded',
    agentId: 'user-789',
    createdAt: new Date('2024-01-10T08:15:00.000Z'),
    context: {
      attachmentData: {
        fileName: 'requirements-document.pdf',
        fileSize: 2048576,
        mimeType: 'application/pdf',
        uploadedBy: 'user-789',
        filePath: '/uploads/task-123/requirements-document.pdf',
        checksum:
          'sha256:a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
      },
    },
    agentResponse: {
      attachmentId: 'att-456',
      fileName: 'requirements-document.pdf',
      fileSize: 2048576,
      mimeType: 'application/pdf',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTaskAttachmentService,
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: mockTaskHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<DeleteTaskAttachmentService>(
      DeleteTaskAttachmentService,
    );
    taskHistoryRepository = module.get<Repository<TaskHistory>>(
      getRepositoryToken(TaskHistory),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleteAttachment', () => {
    const taskId = 'task-123';
    const attachmentId = 'att-456';
    const mockRequest: DeleteTaskAttachmentRequestDto = {
      deleteMode: AttachmentDeleteMode.SOFT_DELETE,
      deletedBy: 'user-789',
      deleteReason: 'File contains outdated information',
      deletePhysicalFile: false,
      createBackup: true,
      notifyWatchers: true,
    };

    beforeEach(() => {
      mockTaskHistoryRepository.findOne.mockImplementation((options) => {
        if (options.where?.action === 'task_created') {
          return Promise.resolve(mockTask);
        }
        if (options.where?.action === 'file_uploaded') {
          return Promise.resolve(mockAttachment);
        }
        return Promise.resolve(null);
      });
      mockTaskHistoryRepository.count.mockResolvedValue(4); // 4 attachments total
      mockTaskHistoryRepository.create.mockReturnValue({ id: 'hist-456' });
      mockTaskHistoryRepository.save.mockResolvedValue({
        id: 'hist-456',
        createdAt: new Date('2024-01-15T10:30:00.000Z'),
      });
    });

    it('should successfully soft delete an attachment', async () => {
      const result = await service.deleteAttachment(
        taskId,
        attachmentId,
        mockRequest,
      );

      expect(result).toEqual({
        taskId: 'task-123',
        attachmentId: 'att-456',
        fileName: 'requirements-document.pdf',
        mimeType: 'application/pdf',
        fileSize: 2048576,
        deleteMode: AttachmentDeleteMode.SOFT_DELETE,
        deletedBy: 'user-789',
        deletedAt: expect.any(Date),
        deleteReason: 'File contains outdated information',
        originalUploadDate: expect.any(Date),
        originalUploader: 'user-789',
        physicalFileDeleted: false,
        backupCreated: true,
        backupPath: expect.stringContaining('/backups/attachments/att-456_'),
        storageSpaceFreed: 0,
        notifiedWatchers: ['user-456', 'user-789', 'user-101'],
        success: true,
        canBeRestored: true,
        remainingAttachmentsCount: 3,
        fileChecksum:
          'sha256:a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
        historyLogId: 'hist-456',
      });

      expect(mockTaskHistoryRepository.save).toHaveBeenCalled();
    });

    it('should successfully hard delete an attachment with physical file deletion', async () => {
      const hardDeleteRequest: DeleteTaskAttachmentRequestDto = {
        ...mockRequest,
        deleteMode: AttachmentDeleteMode.HARD_DELETE,
        deletePhysicalFile: true,
        createBackup: false,
      };

      const result = await service.deleteAttachment(
        taskId,
        attachmentId,
        hardDeleteRequest,
      );

      expect(result.deleteMode).toBe(AttachmentDeleteMode.HARD_DELETE);
      expect(result.physicalFileDeleted).toBe(true);
      expect(result.backupCreated).toBe(false);
      expect(result.canBeRestored).toBe(false);
      expect(result.storageSpaceFreed).toBe(2048576);
    });

    it('should successfully move attachment to trash', async () => {
      const trashRequest: DeleteTaskAttachmentRequestDto = {
        ...mockRequest,
        deleteMode: AttachmentDeleteMode.MOVE_TO_TRASH,
        deletePhysicalFile: true,
      };

      const result = await service.deleteAttachment(
        taskId,
        attachmentId,
        trashRequest,
      );

      expect(result.deleteMode).toBe(AttachmentDeleteMode.MOVE_TO_TRASH);
      expect(result.physicalFileDeleted).toBe(true);
      expect(result.canBeRestored).toBe(true);
      expect(result.storageSpaceFreed).toBe(2048576);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      mockTaskHistoryRepository.findOne.mockImplementation((options) => {
        if (options.where?.action === 'task_created') {
          return Promise.resolve(null);
        }
        return Promise.resolve(mockAttachment);
      });

      await expect(
        service.deleteAttachment(taskId, attachmentId, mockRequest),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when attachment does not exist', async () => {
      mockTaskHistoryRepository.findOne.mockImplementation((options) => {
        if (options.where?.action === 'task_created') {
          return Promise.resolve(mockTask);
        }
        if (options.where?.action === 'file_uploaded') {
          return Promise.resolve(null);
        }
        return Promise.resolve(null);
      });

      await expect(
        service.deleteAttachment(taskId, attachmentId, mockRequest),
      ).rejects.toThrow(NotFoundException);
    });

    it('should not notify watchers when notifyWatchers is false', async () => {
      const requestWithoutNotify: DeleteTaskAttachmentRequestDto = {
        ...mockRequest,
        notifyWatchers: false,
      };

      const result = await service.deleteAttachment(
        taskId,
        attachmentId,
        requestWithoutNotify,
      );

      expect(result.notifiedWatchers).toEqual([]);
    });

    it('should not create backup when createBackup is false', async () => {
      const requestWithoutBackup: DeleteTaskAttachmentRequestDto = {
        ...mockRequest,
        createBackup: false,
      };

      const result = await service.deleteAttachment(
        taskId,
        attachmentId,
        requestWithoutBackup,
      );

      expect(result.backupCreated).toBe(false);
      expect(result.backupPath).toBeUndefined();
    });

    it('should handle attachment with minimal metadata', async () => {
      const minimalAttachment = {
        ...mockAttachment,
        context: {
          attachmentData: {
            fileName: 'test.txt',
          },
        },
        agentResponse: {
          attachmentId: 'att-456',
        },
      };

      mockTaskHistoryRepository.findOne.mockImplementation((options) => {
        if (options.where?.action === 'task_created') {
          return Promise.resolve(mockTask);
        }
        if (options.where?.action === 'file_uploaded') {
          return Promise.resolve(minimalAttachment);
        }
        return Promise.resolve(null);
      });

      const result = await service.deleteAttachment(
        taskId,
        attachmentId,
        mockRequest,
      );

      expect(result.fileName).toBe('test.txt');
      expect(result.fileSize).toBe(0);
      expect(result.mimeType).toBe('application/octet-stream');
    });

    it('should handle task with no watchers', async () => {
      const taskWithoutWatchers = {
        ...mockTask,
        context: {
          assignmentData: {},
        },
      };

      mockTaskHistoryRepository.findOne.mockImplementation((options) => {
        if (options.where?.action === 'task_created') {
          return Promise.resolve(taskWithoutWatchers);
        }
        if (options.where?.action === 'file_uploaded') {
          return Promise.resolve(mockAttachment);
        }
        return Promise.resolve(null);
      });

      const result = await service.deleteAttachment(
        taskId,
        attachmentId,
        mockRequest,
      );

      expect(result.notifiedWatchers).toEqual([]);
    });

    it('should calculate remaining attachments count correctly', async () => {
      mockTaskHistoryRepository.count.mockResolvedValue(1); // Only this attachment

      const result = await service.deleteAttachment(
        taskId,
        attachmentId,
        mockRequest,
      );

      expect(result.remainingAttachmentsCount).toBe(0);
    });

    it('should preserve original uploader information', async () => {
      const result = await service.deleteAttachment(
        taskId,
        attachmentId,
        mockRequest,
      );

      expect(result.originalUploader).toBe('user-789');
      expect(result.originalUploadDate).toEqual(mockAttachment.createdAt);
    });

    it('should handle different file types correctly', async () => {
      const imageAttachment = {
        ...mockAttachment,
        context: {
          attachmentData: {
            fileName: 'screenshot.png',
            fileSize: 512000,
            mimeType: 'image/png',
            uploadedBy: 'user-123',
            filePath: '/uploads/task-123/screenshot.png',
          },
        },
      };

      mockTaskHistoryRepository.findOne.mockImplementation((options) => {
        if (options.where?.action === 'task_created') {
          return Promise.resolve(mockTask);
        }
        if (options.where?.action === 'file_uploaded') {
          return Promise.resolve(imageAttachment);
        }
        return Promise.resolve(null);
      });

      const result = await service.deleteAttachment(
        taskId,
        attachmentId,
        mockRequest,
      );

      expect(result.fileName).toBe('screenshot.png');
      expect(result.mimeType).toBe('image/png');
      expect(result.fileSize).toBe(512000);
    });
  });
});
