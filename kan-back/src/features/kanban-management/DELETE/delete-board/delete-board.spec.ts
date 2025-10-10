import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { DeleteBoardService } from './delete-board.service';
import { TaskHistory } from '@/entities/task-history.entity';
import {
  DeleteBoardRequestDto,
  BoardDeleteMode,
} from './delete-board.request.dto';

describe('DeleteBoardService', () => {
  let service: DeleteBoardService;
  let taskHistoryRepository: Repository<TaskHistory>;

  const mockTaskHistoryRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockBoardData = {
    id: 'hist-123',
    taskId: 'board-123',
    taskKey: 'BOARD-123',
    taskTitle: 'Sprint Planning Board',
    action: 'board_created',
    context: {
      boardData: {
        name: 'Sprint Planning Board',
        type: 'kanban',
        lastActivityAt: new Date('2024-01-10T10:00:00.000Z'),
      },
    },
    createdAt: new Date('2024-01-01T10:00:00.000Z'),
  };

  const mockTasksInBoard = [
    {
      taskId: 'task-001',
      taskKey: '%BOARD-board-123%',
      taskTitle: 'Implement authentication',
      action: 'task_created',
    },
    {
      taskId: 'task-002',
      taskKey: '%BOARD-board-123%',
      taskTitle: 'Setup database',
      action: 'task_created',
    },
  ];

  const mockColumnsInBoard = [
    {
      taskId: 'col-001',
      taskKey: '%BOARD-board-123%',
      action: 'column_created',
    },
    {
      taskId: 'col-002',
      taskKey: '%BOARD-board-123%',
      action: 'column_created',
    },
  ];

  const mockBoardMembers = [
    {
      taskId: 'board-123',
      action: 'member_added',
      context: {
        memberData: {
          userId: 'user-456',
        },
      },
    },
    {
      taskId: 'board-123',
      action: 'member_added',
      context: {
        memberData: {
          userId: 'user-789',
        },
      },
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteBoardService,
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: mockTaskHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<DeleteBoardService>(DeleteBoardService);
    taskHistoryRepository = module.get<Repository<TaskHistory>>(
      getRepositoryToken(TaskHistory),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleteBoard', () => {
    const boardId = 'board-123';
    const mockRequest: DeleteBoardRequestDto = {
      deleteMode: BoardDeleteMode.SOFT_DELETE,
      deletedBy: 'user-123',
      deleteReason: 'Project completed',
      notifyMembers: true,
      createBackup: true,
    };

    beforeEach(() => {
      mockTaskHistoryRepository.findOne.mockResolvedValue(mockBoardData);
      mockTaskHistoryRepository.find.mockImplementation((options) => {
        if (options.where?.action === 'task_created') {
          return Promise.resolve(mockTasksInBoard);
        }
        if (options.where?.action === 'column_created') {
          return Promise.resolve(mockColumnsInBoard);
        }
        if (options.where?.action === 'member_added') {
          return Promise.resolve(mockBoardMembers);
        }
        return Promise.resolve([]);
      });
      mockTaskHistoryRepository.count.mockImplementation((options) => {
        if (options.where?.action === 'board_created') {
          return Promise.resolve(5); // Multiple active boards
        }
        if (options.where?.action === 'file_uploaded') {
          return Promise.resolve(3); // Some files
        }
        return Promise.resolve(0);
      });
      mockTaskHistoryRepository.create.mockReturnValue({ id: 'hist-456' });
      mockTaskHistoryRepository.save.mockResolvedValue({
        id: 'hist-456',
        createdAt: new Date('2024-01-15T10:30:00.000Z'),
      });
    });

    it('should successfully soft delete a board', async () => {
      const result = await service.deleteBoard(boardId, mockRequest);

      expect(result).toEqual({
        boardId: 'board-123',
        boardName: 'Sprint Planning Board',
        deleteMode: BoardDeleteMode.SOFT_DELETE,
        deletedBy: 'user-123',
        deletedAt: expect.any(Date),
        deleteReason: 'Project completed',
        columnsDeleted: 2,
        tasksInBoard: 2,
        tasksRelocated: 0,
        targetBoardId: undefined,
        targetBoardName: undefined,
        taskRelocations: [],
        notifiedMembers: ['user-456', 'user-789'],
        success: true,
        canBeRestored: true,
        backupPath: expect.stringContaining('/backups/boards/board-board-123_'),
        filesDeletion: undefined,
        historyLogId: 'hist-456',
      });

      expect(mockTaskHistoryRepository.save).toHaveBeenCalled();
    });

    it('should successfully hard delete a board with force', async () => {
      const hardDeleteRequest: DeleteBoardRequestDto = {
        ...mockRequest,
        deleteMode: BoardDeleteMode.HARD_DELETE,
        forceDelete: true,
        deleteFiles: true,
      };

      const result = await service.deleteBoard(boardId, hardDeleteRequest);

      expect(result.deleteMode).toBe(BoardDeleteMode.HARD_DELETE);
      expect(result.canBeRestored).toBe(false);
      expect(result.filesDeletion).toEqual({
        totalFiles: 3,
        deletedFiles: 1,
        failedDeletions: ['file1.pdf', 'image2.png'],
        totalSizeDeleted: 1536, // 3 * 1024 * 512 / 1024
      });
    });

    it('should successfully archive a board', async () => {
      const archiveRequest: DeleteBoardRequestDto = {
        ...mockRequest,
        deleteMode: BoardDeleteMode.ARCHIVE,
        notifyMembers: false,
      };

      const result = await service.deleteBoard(boardId, archiveRequest);

      expect(result.deleteMode).toBe(BoardDeleteMode.ARCHIVE);
      expect(result.canBeRestored).toBe(true);
      expect(result.notifiedMembers).toEqual([]);
    });

    it('should successfully export and delete board', async () => {
      const targetBoardId = 'board-target';
      const exportRequest: DeleteBoardRequestDto = {
        ...mockRequest,
        deleteMode: BoardDeleteMode.EXPORT_AND_DELETE,
        targetBoardId,
      };

      mockTaskHistoryRepository.findOne.mockImplementation((options) => {
        if (options.where?.taskId === boardId) {
          return Promise.resolve(mockBoardData);
        }
        if (options.where?.taskId === targetBoardId) {
          return Promise.resolve({
            ...mockBoardData,
            taskId: targetBoardId,
            context: {
              boardData: {
                name: 'Backlog Board',
                type: 'kanban',
              },
            },
          });
        }
        if (
          options.where?.action === 'column_created' &&
          options.where?.taskKey?.includes(targetBoardId)
        ) {
          return Promise.resolve({
            taskId: 'col-target-001',
            action: 'column_created',
          });
        }
        return Promise.resolve(null);
      });

      const result = await service.deleteBoard(boardId, exportRequest);

      expect(result.deleteMode).toBe(BoardDeleteMode.EXPORT_AND_DELETE);
      expect(result.targetBoardId).toBe(targetBoardId);
      expect(result.targetBoardName).toBe('Backlog Board');
      expect(result.tasksRelocated).toBe(2);
      expect(result.taskRelocations).toHaveLength(2);
      expect(result.taskRelocations[0]).toEqual({
        taskId: 'task-001',
        taskTitle: 'Implement authentication',
        fromBoardId: boardId,
        toBoardId: targetBoardId,
        newColumnId: 'col-target-001',
        relocatedAt: expect.any(Date),
      });
    });

    it('should throw NotFoundException when board does not exist', async () => {
      mockTaskHistoryRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteBoard(boardId, mockRequest)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException when trying to delete board with tasks without force', async () => {
      const requestWithoutForce: DeleteBoardRequestDto = {
        ...mockRequest,
        forceDelete: false,
      };

      await expect(
        service.deleteBoard(boardId, requestWithoutForce),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException for invalid delete mode', async () => {
      const invalidRequest: DeleteBoardRequestDto = {
        ...mockRequest,
        deleteMode: 'INVALID_MODE' as any,
      };

      await expect(
        service.deleteBoard(boardId, invalidRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when exporting without target board', async () => {
      const exportWithoutTarget: DeleteBoardRequestDto = {
        ...mockRequest,
        deleteMode: BoardDeleteMode.EXPORT_AND_DELETE,
        targetBoardId: undefined,
      };

      await expect(
        service.deleteBoard(boardId, exportWithoutTarget),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when target board does not exist', async () => {
      const exportRequest: DeleteBoardRequestDto = {
        ...mockRequest,
        deleteMode: BoardDeleteMode.EXPORT_AND_DELETE,
        targetBoardId: 'non-existent-board',
      };

      mockTaskHistoryRepository.findOne.mockImplementation((options) => {
        if (options.where?.taskId === boardId) {
          return Promise.resolve(mockBoardData);
        }
        return Promise.resolve(null);
      });

      await expect(service.deleteBoard(boardId, exportRequest)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when trying to export to same board', async () => {
      const selfExportRequest: DeleteBoardRequestDto = {
        ...mockRequest,
        deleteMode: BoardDeleteMode.EXPORT_AND_DELETE,
        targetBoardId: boardId,
      };

      await expect(
        service.deleteBoard(boardId, selfExportRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException when trying to hard delete the last board', async () => {
      mockTaskHistoryRepository.count.mockImplementation((options) => {
        if (options.where?.action === 'board_created') {
          return Promise.resolve(1); // Only one active board
        }
        return Promise.resolve(0);
      });

      const lastBoardRequest: DeleteBoardRequestDto = {
        ...mockRequest,
        deleteMode: BoardDeleteMode.HARD_DELETE,
      };

      await expect(
        service.deleteBoard(boardId, lastBoardRequest),
      ).rejects.toThrow(ConflictException);
    });

    it('should handle board with no tasks', async () => {
      mockTaskHistoryRepository.find.mockImplementation((options) => {
        if (options.where?.action === 'task_created') {
          return Promise.resolve([]);
        }
        if (options.where?.action === 'column_created') {
          return Promise.resolve(mockColumnsInBoard);
        }
        if (options.where?.action === 'member_added') {
          return Promise.resolve([]);
        }
        return Promise.resolve([]);
      });

      const result = await service.deleteBoard(boardId, mockRequest);

      expect(result.tasksInBoard).toBe(0);
      expect(result.tasksRelocated).toBe(0);
      expect(result.notifiedMembers).toEqual([]);
    });

    it('should not create backup when createBackup is false', async () => {
      const requestWithoutBackup: DeleteBoardRequestDto = {
        ...mockRequest,
        createBackup: false,
      };

      const result = await service.deleteBoard(boardId, requestWithoutBackup);

      expect(result.backupPath).toBeUndefined();
    });

    it('should not delete files when deleteFiles is false', async () => {
      const requestWithoutFiles: DeleteBoardRequestDto = {
        ...mockRequest,
        deleteFiles: false,
      };

      const result = await service.deleteBoard(boardId, requestWithoutFiles);

      expect(result.filesDeletion).toBeUndefined();
    });
  });
});
