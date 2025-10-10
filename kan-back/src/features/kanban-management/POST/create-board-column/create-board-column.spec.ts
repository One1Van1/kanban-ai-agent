import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBoardColumnController } from './create-board-column.controller';
import { CreateBoardColumnService } from './create-board-column.service';
import { TaskHistory } from '@/entities/task-history.entity';
import {
  CreateBoardColumnRequestDto,
  ColumnType,
} from './create-board-column.request.dto';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('CreateBoardColumnController', () => {
  let controller: CreateBoardColumnController;
  let service: CreateBoardColumnService;
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
      controllers: [CreateBoardColumnController],
      providers: [
        CreateBoardColumnService,
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<CreateBoardColumnController>(
      CreateBoardColumnController,
    );
    service = module.get<CreateBoardColumnService>(CreateBoardColumnService);
    repository = module.get<Repository<TaskHistory>>(
      getRepositoryToken(TaskHistory),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createColumn', () => {
    const mockRequest: CreateBoardColumnRequestDto = {
      boardId: 'board-001',
      name: 'Ready for Testing',
      type: ColumnType.CUSTOM,
      position: 2,
      description: 'Tasks ready for QA testing',
      color: '#4CAF50',
      wipLimit: 5,
      createdBy: 'agent-001',
    };

    it('should create column successfully', async () => {
      const mockSavedLog = {
        id: 'log-123',
        agentId: 'system',
        taskId: 'col-new-column',
        taskKey: 'BOARD-board-001-COL-2',
        taskTitle: 'Created column: Ready for Testing',
        action: 'column_created',
        toColumn: 'Ready for Testing',
        status: 'completed',
        createdAt: new Date('2024-01-15T10:30:00Z'),
        agentResponse: {},
        context: {
          columnData: {
            columnId: 'col-new-column',
            boardId: 'board-001',
            name: 'Ready for Testing',
            type: ColumnType.CUSTOM,
            position: 2,
          },
        },
      } as Partial<TaskHistory>;

      // Mock existing columns
      mockRepository.find.mockResolvedValue([
        {
          taskId: 'col-1',
          toColumn: 'To Do',
          context: { columnData: { position: 0, type: ColumnType.TODO } },
        },
        {
          taskId: 'col-2',
          toColumn: 'In Progress',
          context: {
            columnData: { position: 1, type: ColumnType.IN_PROGRESS },
          },
        },
      ]);

      mockRepository.count.mockResolvedValue(2);
      mockRepository.findOne.mockResolvedValue(null); // Board exists check
      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.createColumn(mockRequest);

      expect(result).toEqual({
        columnId: expect.stringMatching(/^col-/),
        boardId: 'board-001',
        name: 'Ready for Testing',
        type: ColumnType.CUSTOM,
        position: 2,
        description: 'Tasks ready for QA testing',
        color: '#4CAF50',
        wipLimit: 5,
        createdBy: 'agent-001',
        createdAt: expect.any(Date),
        success: true,
        totalColumnsInBoard: 3,
        adjacentColumns: expect.any(Object),
        historyLogId: 'log-123',
      });

      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid position', async () => {
      const invalidRequest = {
        ...mockRequest,
        position: 10, // Too high
      };

      mockRepository.find.mockResolvedValue([
        { context: { columnData: { position: 0 } } },
        { context: { columnData: { position: 1 } } },
      ]);

      await expect(controller.createColumn(invalidRequest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ConflictException for duplicate column name', async () => {
      const duplicateRequest = {
        ...mockRequest,
        name: 'To Do', // Already exists
      };

      mockRepository.find.mockResolvedValue([
        {
          taskId: 'col-1',
          toColumn: 'To Do',
          context: { columnData: { position: 0, type: ColumnType.TODO } },
        },
      ]);

      await expect(controller.createColumn(duplicateRequest)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should handle custom column with all optional parameters', async () => {
      const customRequest = {
        boardId: 'board-002',
        name: 'Custom Status',
        type: ColumnType.CUSTOM,
        position: 0,
        description: 'Custom workflow step',
        color: '#9C27B0',
        wipLimit: 10,
        createdBy: 'agent-002',
      };

      const mockSavedLog = {
        id: 'log-custom',
        createdAt: new Date('2024-01-15T11:00:00Z'),
      } as TaskHistory;

      mockRepository.find.mockResolvedValue([]);
      mockRepository.count.mockResolvedValue(0);
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.createColumn(customRequest);

      expect(result.name).toBe('Custom Status');
      expect(result.type).toBe(ColumnType.CUSTOM);
      expect(result.description).toBe('Custom workflow step');
      expect(result.color).toBe('#9C27B0');
      expect(result.wipLimit).toBe(10);
      expect(result.totalColumnsInBoard).toBe(1);
    });

    it('should handle column insertion between existing columns', async () => {
      const insertRequest = {
        ...mockRequest,
        position: 1, // Insert between position 0 and 1
      };

      mockRepository.find.mockResolvedValue([
        {
          taskId: 'col-1',
          toColumn: 'To Do',
          context: { columnData: { position: 0, type: ColumnType.TODO } },
        },
        {
          taskId: 'col-2',
          toColumn: 'Done',
          context: { columnData: { position: 1, type: ColumnType.DONE } },
        },
      ]);

      mockRepository.count.mockResolvedValue(2);
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue({
        id: 'log-insert',
        createdAt: new Date(),
      });
      mockRepository.save.mockResolvedValue({
        id: 'log-insert',
        createdAt: new Date(),
      });

      const result = await controller.createColumn(insertRequest);

      expect(result.position).toBe(1);
      expect(result.adjacentColumns).toBeDefined();
    });

    it('should validate maximum columns limit', async () => {
      // Mock 20 existing columns
      const existingColumns = Array.from({ length: 20 }, (_, i) => ({
        taskId: `col-${i}`,
        toColumn: `Column ${i}`,
        context: { columnData: { position: i, type: ColumnType.CUSTOM } },
      }));

      mockRepository.find.mockResolvedValue(existingColumns);

      await expect(controller.createColumn(mockRequest)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('service methods', () => {
    it('should return available column types', async () => {
      const types = await service.getAvailableColumnTypes();

      expect(types).toEqual([
        ColumnType.TODO,
        ColumnType.IN_PROGRESS,
        ColumnType.IN_REVIEW,
        ColumnType.DONE,
        ColumnType.CUSTOM,
      ]);
    });

    it('should validate column name uniqueness', async () => {
      mockRepository.find.mockResolvedValue([
        {
          toColumn: 'Existing Column',
          context: { columnData: { position: 0 } },
        },
      ]);

      const isValidNew = await service.validateColumnName(
        'board-001',
        'New Column',
      );
      const isValidExisting = await service.validateColumnName(
        'board-001',
        'Existing Column',
      );

      expect(isValidNew).toBe(true);
      expect(isValidExisting).toBe(false);
    });
  });
});
