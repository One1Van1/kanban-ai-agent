import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { DeleteBoardColumnService } from './delete-board-column.service';
import { TaskHistory } from '@/entities/task-history.entity';
import {
  DeleteBoardColumnRequestDto,
  ColumnDeleteMode,
} from './delete-board-column.request.dto';

describe('DeleteBoardColumnService', () => {
  let service: DeleteBoardColumnService;
  let taskHistoryRepository: Repository<TaskHistory>;

  const mockTaskHistoryRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockColumnData = {
    id: 'hist-123',
    taskId: 'col-123',
    taskKey: 'BOARD-456-COL',
    action: 'column_created',
    context: {
      columnData: {
        name: 'In Review',
        type: 'custom',
        position: 3,
        boardId: 'board-456',
      },
    },
    createdAt: new Date('2024-01-15T10:00:00.000Z'),
  };

  const mockTasksInColumn = [
    {
      id: 'task-1',
      taskId: 'task-001',
      toColumn: 'col-123',
      status: 'completed',
      context: {
        assignmentData: {
          assignee: 'user-456',
          watchers: ['user-789', 'user-101'],
        },
      },
    },
    {
      id: 'task-2',
      taskId: 'task-002',
      toColumn: 'col-123',
      status: 'completed',
      context: {
        assignmentData: {
          assignee: 'user-789',
        },
      },
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteBoardColumnService,
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: mockTaskHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<DeleteBoardColumnService>(DeleteBoardColumnService);
    taskHistoryRepository = module.get<Repository<TaskHistory>>(
      getRepositoryToken(TaskHistory),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleteColumn', () => {
    const columnId = 'col-123';
    const mockRequest: DeleteBoardColumnRequestDto = {
      deleteMode: ColumnDeleteMode.SOFT_DELETE,
      deletedBy: 'user-123',
      deleteReason: 'Column no longer needed',
      notifyUsers: true,
    };

    beforeEach(() => {
      mockTaskHistoryRepository.findOne.mockResolvedValue(mockColumnData);
      mockTaskHistoryRepository.find.mockImplementation((options) => {
        if (options.where?.toColumn === columnId) {
          return Promise.resolve(mockTasksInColumn);
        }
        if (options.where?.action === 'column_created') {
          return Promise.resolve([
            mockColumnData,
            { id: 'col-2' },
            { id: 'col-3' },
          ]);
        }
        return Promise.resolve([]);
      });
      mockTaskHistoryRepository.count.mockResolvedValue(3);
      mockTaskHistoryRepository.create.mockReturnValue({ id: 'hist-456' });
      mockTaskHistoryRepository.save.mockResolvedValue({
        id: 'hist-456',
        createdAt: new Date('2024-01-15T10:30:00.000Z'),
      });
    });

    it('should successfully soft delete a column', async () => {
      const result = await service.deleteColumn(columnId, mockRequest);

      expect(result).toEqual({
        columnId: 'col-123',
        boardId: 'board-456',
        columnName: 'In Review',
        deleteMode: ColumnDeleteMode.SOFT_DELETE,
        deletedBy: 'user-123',
        deletedAt: expect.any(Date),
        deleteReason: 'Column no longer needed',
        originalPosition: 3,
        tasksInColumn: 2,
        tasksRelocated: 0,
        targetColumnId: undefined,
        targetColumnName: undefined,
        positionAdjustments: [],
        notifiedUsers: ['user-456', 'user-789', 'user-101'],
        success: true,
        canBeRestored: true,
        remainingColumnsInBoard: 2,
        historyLogId: 'hist-456',
      });

      expect(mockTaskHistoryRepository.save).toHaveBeenCalled();
    });

    it('should successfully hard delete a column with force', async () => {
      const hardDeleteRequest: DeleteBoardColumnRequestDto = {
        ...mockRequest,
        deleteMode: ColumnDeleteMode.HARD_DELETE,
        forceDelete: true,
      };

      const result = await service.deleteColumn(columnId, hardDeleteRequest);

      expect(result.deleteMode).toBe(ColumnDeleteMode.HARD_DELETE);
      expect(result.tasksRelocated).toBe(2);
      expect(result.canBeRestored).toBe(false);
    });

    it('should successfully merge column with another', async () => {
      const targetColumnId = 'col-target';
      const mergeRequest: DeleteBoardColumnRequestDto = {
        ...mockRequest,
        deleteMode: ColumnDeleteMode.MERGE_WITH_ANOTHER,
        targetColumnId,
      };

      mockTaskHistoryRepository.findOne.mockImplementation((options) => {
        if (options.where?.taskId === columnId) {
          return Promise.resolve(mockColumnData);
        }
        if (options.where?.taskId === targetColumnId) {
          return Promise.resolve({
            ...mockColumnData,
            taskId: targetColumnId,
            context: {
              columnData: {
                name: 'Done',
                type: 'custom',
                position: 4,
                boardId: 'board-456',
              },
            },
          });
        }
        return Promise.resolve(null);
      });

      const result = await service.deleteColumn(columnId, mergeRequest);

      expect(result.deleteMode).toBe(ColumnDeleteMode.MERGE_WITH_ANOTHER);
      expect(result.targetColumnId).toBe(targetColumnId);
      expect(result.targetColumnName).toBe('Done');
      expect(result.tasksRelocated).toBe(2);
    });

    it('should throw NotFoundException when column does not exist', async () => {
      mockTaskHistoryRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteColumn(columnId, mockRequest)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException when trying to delete column with tasks without force', async () => {
      const requestWithoutForce: DeleteBoardColumnRequestDto = {
        ...mockRequest,
        forceDelete: false,
      };

      await expect(
        service.deleteColumn(columnId, requestWithoutForce),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException for invalid delete mode', async () => {
      const invalidRequest: DeleteBoardColumnRequestDto = {
        ...mockRequest,
        deleteMode: 'INVALID_MODE' as any,
      };

      await expect(
        service.deleteColumn(columnId, invalidRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when merging without target column', async () => {
      const mergeWithoutTarget: DeleteBoardColumnRequestDto = {
        ...mockRequest,
        deleteMode: ColumnDeleteMode.MERGE_WITH_ANOTHER,
        targetColumnId: undefined,
      };

      await expect(
        service.deleteColumn(columnId, mergeWithoutTarget),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when target column does not exist', async () => {
      const mergeRequest: DeleteBoardColumnRequestDto = {
        ...mockRequest,
        deleteMode: ColumnDeleteMode.MERGE_WITH_ANOTHER,
        targetColumnId: 'non-existent-col',
      };

      mockTaskHistoryRepository.findOne.mockImplementation((options) => {
        if (options.where?.taskId === columnId) {
          return Promise.resolve(mockColumnData);
        }
        return Promise.resolve(null);
      });

      await expect(
        service.deleteColumn(columnId, mergeRequest),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when trying to merge column with itself', async () => {
      const selfMergeRequest: DeleteBoardColumnRequestDto = {
        ...mockRequest,
        deleteMode: ColumnDeleteMode.MERGE_WITH_ANOTHER,
        targetColumnId: columnId,
      };

      mockTaskHistoryRepository.findOne.mockResolvedValue(mockColumnData);

      await expect(
        service.deleteColumn(columnId, selfMergeRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException when trying to delete the last column', async () => {
      mockTaskHistoryRepository.find.mockResolvedValue([mockColumnData]); // Only one column

      await expect(service.deleteColumn(columnId, mockRequest)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should not notify users when notifyUsers is false', async () => {
      const requestWithoutNotify: DeleteBoardColumnRequestDto = {
        ...mockRequest,
        notifyUsers: false,
      };

      const result = await service.deleteColumn(columnId, requestWithoutNotify);

      expect(result.notifiedUsers).toEqual([]);
    });

    it('should handle column with no tasks', async () => {
      mockTaskHistoryRepository.find.mockImplementation((options) => {
        if (options.where?.toColumn === columnId) {
          return Promise.resolve([]);
        }
        if (options.where?.action === 'column_created') {
          return Promise.resolve([mockColumnData, { id: 'col-2' }]);
        }
        return Promise.resolve([]);
      });

      const result = await service.deleteColumn(columnId, mockRequest);

      expect(result.tasksInColumn).toBe(0);
      expect(result.tasksRelocated).toBe(0);
      expect(result.notifiedUsers).toEqual([]);
    });

    it('should adjust positions of remaining columns', async () => {
      mockTaskHistoryRepository.find.mockImplementation((options) => {
        if (
          options.where?.action === 'column_created' &&
          options.where?.taskKey
        ) {
          return Promise.resolve([
            {
              taskId: 'col-after-1',
              context: { columnData: { position: 4 } },
            },
            {
              taskId: 'col-after-2',
              context: { columnData: { position: 5 } },
            },
          ]);
        }
        return Promise.resolve([]);
      });

      const result = await service.deleteColumn(columnId, mockRequest);

      expect(result.positionAdjustments).toContainEqual({
        columnId: 'col-after-1',
        oldPosition: 4,
        newPosition: 3,
      });
      expect(result.positionAdjustments).toContainEqual({
        columnId: 'col-after-2',
        oldPosition: 5,
        newPosition: 4,
      });
    });
  });
});
