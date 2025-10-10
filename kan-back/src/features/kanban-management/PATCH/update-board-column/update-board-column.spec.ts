import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBoardColumnController } from './update-board-column.controller';
import { UpdateBoardColumnService } from './update-board-column.service';
import { TaskHistory } from '@/entities/task-history.entity';
import {
  UpdateBoardColumnRequestDto,
  ColumnType,
} from './update-board-column.request.dto';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

describe('UpdateBoardColumnController', () => {
  let controller: UpdateBoardColumnController;
  let service: UpdateBoardColumnService;
  let repository: Repository<TaskHistory>;

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateBoardColumnController],
      providers: [
        UpdateBoardColumnService,
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<UpdateBoardColumnController>(
      UpdateBoardColumnController,
    );
    service = module.get<UpdateBoardColumnService>(UpdateBoardColumnService);
    repository = module.get<Repository<TaskHistory>>(
      getRepositoryToken(TaskHistory),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateColumn', () => {
    const columnId = 'col-a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a';

    const mockCurrentColumn = {
      id: 'history-column-1',
      agentId: 'system',
      taskId: columnId,
      taskKey: 'BOARD-board-001-COL-2',
      taskTitle: 'Created column: Testing',
      action: 'column_created',
      toColumn: 'Testing',
      status: 'completed',
      context: {
        columnData: {
          columnId,
          boardId: 'board-001',
          name: 'Testing',
          type: ColumnType.CUSTOM,
          position: 2,
          description: 'Tasks in testing phase',
          color: '#4CAF50',
          wipLimit: 5,
          isActive: true,
        },
      },
      agentResponse: {},
      createdAt: new Date('2024-01-15T09:00:00Z'),
    } as Partial<TaskHistory>;

    const mockRequest: UpdateBoardColumnRequestDto = {
      name: 'QA Testing',
      color: '#2196F3',
      wipLimit: 8,
      updatedBy: 'agent-001',
      updateComment: 'Updated name and WIP limit for better flow',
    };

    it('should update column successfully', async () => {
      const mockSavedLog = {
        id: 'history-column-update-1',
        createdAt: new Date('2024-01-15T10:30:00Z'),
      } as TaskHistory;

      mockRepository.findOne.mockResolvedValue(mockCurrentColumn);
      mockRepository.count.mockResolvedValueOnce(3); // Total columns in board
      mockRepository.count.mockResolvedValueOnce(1); // Column version
      mockRepository.count.mockResolvedValueOnce(2); // Current task count
      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.updateColumn(columnId, mockRequest);

      expect(result).toEqual({
        columnId,
        boardId: 'board-001',
        name: 'QA Testing',
        type: ColumnType.CUSTOM,
        position: 2,
        description: 'Tasks in testing phase',
        color: '#2196F3',
        wipLimit: 8,
        isActive: true,
        updatedBy: 'agent-001',
        updatedAt: expect.any(Date),
        fieldsUpdated: ['name', 'color', 'wipLimit'],
        previousValues: {
          name: 'Testing',
          color: '#4CAF50',
          wipLimit: 5,
        },
        positionChanges: undefined,
        updateComment: 'Updated name and WIP limit for better flow',
        success: true,
        version: 2,
        currentTaskCount: 2,
        historyLogId: 'history-column-update-1',
      });

      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException for non-existent column', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        controller.updateColumn(columnId, mockRequest),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when no fields to update', async () => {
      const emptyRequest: UpdateBoardColumnRequestDto = {
        updatedBy: 'agent-001',
      };

      mockRepository.findOne.mockResolvedValue(mockCurrentColumn);

      await expect(
        controller.updateColumn(columnId, emptyRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle position update with affected columns tracking', async () => {
      const positionRequest: UpdateBoardColumnRequestDto = {
        position: 4,
        updatedBy: 'agent-001',
        updateComment: 'Moving column to end of workflow',
      };

      mockRepository.findOne.mockResolvedValue(mockCurrentColumn);
      mockRepository.count.mockResolvedValueOnce(5); // Total columns
      mockRepository.count.mockResolvedValueOnce(0); // Version
      mockRepository.count.mockResolvedValueOnce(1); // Task count
      mockRepository.find.mockResolvedValue([
        { taskId: 'col-1', context: { columnData: { position: 3 } } },
        { taskId: 'col-2', context: { columnData: { position: 4 } } },
      ]);

      const mockSavedLog = {
        id: 'history-position-update',
        createdAt: new Date('2024-01-15T11:00:00Z'),
      } as TaskHistory;

      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.updateColumn(columnId, positionRequest);

      expect(result.position).toBe(4);
      expect(result.fieldsUpdated).toContain('position');
      expect(result.positionChanges).toEqual({
        from: 2,
        to: 4,
        affectedColumns: ['col-1', 'col-2'],
      });
    });

    it('should validate invalid column type', async () => {
      const invalidRequest = {
        ...mockRequest,
        type: 'invalid-type' as ColumnType,
      };

      mockRepository.findOne.mockResolvedValue(mockCurrentColumn);

      await expect(
        controller.updateColumn(columnId, invalidRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should validate invalid position', async () => {
      const invalidRequest = {
        ...mockRequest,
        position: 10, // Too high
      };

      mockRepository.findOne.mockResolvedValue(mockCurrentColumn);
      mockRepository.count.mockResolvedValue(3); // Total columns

      await expect(
        controller.updateColumn(columnId, invalidRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException for duplicate column name', async () => {
      const duplicateRequest = {
        ...mockRequest,
        name: 'In Progress', // Already exists
      };

      const duplicateColumn = {
        taskId: 'col-other',
        toColumn: 'In Progress',
      };

      mockRepository.findOne.mockResolvedValueOnce(mockCurrentColumn);
      mockRepository.findOne.mockResolvedValueOnce(duplicateColumn);

      await expect(
        controller.updateColumn(columnId, duplicateRequest),
      ).rejects.toThrow(ConflictException);
    });

    it('should validate invalid hex color', async () => {
      const invalidRequest = {
        ...mockRequest,
        color: 'invalid-color',
      };

      mockRepository.findOne.mockResolvedValue(mockCurrentColumn);

      await expect(
        controller.updateColumn(columnId, invalidRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle WIP limit validation', async () => {
      const invalidRequest = {
        ...mockRequest,
        wipLimit: 0, // Too low
      };

      mockRepository.findOne.mockResolvedValue(mockCurrentColumn);

      await expect(
        controller.updateColumn(columnId, invalidRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle column deactivation', async () => {
      const deactivateRequest: UpdateBoardColumnRequestDto = {
        isActive: false,
        updatedBy: 'agent-001',
        updateComment: 'Temporarily disabling column',
      };

      const mockSavedLog = {
        id: 'history-deactivate',
        createdAt: new Date('2024-01-15T12:00:00Z'),
      } as TaskHistory;

      mockRepository.findOne.mockResolvedValue(mockCurrentColumn);
      mockRepository.count.mockResolvedValueOnce(3);
      mockRepository.count.mockResolvedValueOnce(0);
      mockRepository.count.mockResolvedValueOnce(0);
      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.updateColumn(columnId, deactivateRequest);

      expect(result.isActive).toBe(false);
      expect(result.fieldsUpdated).toContain('isActive');
    });

    it('should handle comprehensive column update', async () => {
      const comprehensiveRequest: UpdateBoardColumnRequestDto = {
        name: 'Quality Assurance',
        type: ColumnType.IN_REVIEW,
        description: 'Comprehensive QA testing phase',
        color: '#9C27B0',
        wipLimit: 6,
        position: 3,
        updatedBy: 'agent-001',
        updateComment: 'Complete column restructure',
      };

      const mockSavedLog = {
        id: 'history-comprehensive',
        createdAt: new Date('2024-01-15T13:00:00Z'),
      } as TaskHistory;

      mockRepository.findOne.mockResolvedValue(mockCurrentColumn);
      mockRepository.count.mockResolvedValueOnce(5); // Total columns
      mockRepository.count.mockResolvedValueOnce(0); // Version
      mockRepository.count.mockResolvedValueOnce(3); // Task count
      mockRepository.find.mockResolvedValue([]);
      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.updateColumn(
        columnId,
        comprehensiveRequest,
      );

      expect(result.name).toBe('Quality Assurance');
      expect(result.type).toBe(ColumnType.IN_REVIEW);
      expect(result.description).toBe('Comprehensive QA testing phase');
      expect(result.color).toBe('#9C27B0');
      expect(result.wipLimit).toBe(6);
      expect(result.position).toBe(3);
      expect(result.fieldsUpdated).toEqual([
        'name',
        'type',
        'description',
        'color',
        'wipLimit',
        'position',
      ]);
    });
  });
});
