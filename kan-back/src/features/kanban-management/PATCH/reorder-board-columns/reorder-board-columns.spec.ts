import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ReorderBoardColumnsController } from './reorder-board-columns.controller';
import { ReorderBoardColumnsService } from './reorder-board-columns.service';
import { TaskHistory } from '../../../../entities/task-history.entity';

describe('ReorderBoardColumnsController', () => {
  let controller: ReorderBoardColumnsController;
  let service: ReorderBoardColumnsService;

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReorderBoardColumnsController],
      providers: [
        ReorderBoardColumnsService,
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<ReorderBoardColumnsController>(
      ReorderBoardColumnsController,
    );
    service = module.get<ReorderBoardColumnsService>(
      ReorderBoardColumnsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('handle', () => {
    it('should successfully reorder board columns', async () => {
      const requestDto = {
        boardId: 'board-123e4567-e89b-12d3-a456-426614174000',
        columnOrder: [
          { columnId: 'col-1', position: 0, columnName: 'Backlog' },
          { columnId: 'col-2', position: 1, columnName: 'To Do' },
          { columnId: 'col-3', position: 2, columnName: 'In Progress' },
          { columnId: 'col-4', position: 3, columnName: 'Done' },
        ],
        userId: 'user-123e4567-e89b-12d3-a456-426614174000',
        reorderReason: 'Reorganizing workflow',
      };

      const expectedResponse = {
        boardId: requestDto.boardId,
        userId: requestDto.userId,
        userName: 'John Doe',
        reorderedAt: expect.any(Date),
        reorderReason: requestDto.reorderReason,
        columnsChanged: 2,
        boardLayout: {
          boardId: requestDto.boardId,
          boardName: 'Project Kanban Board',
          totalColumns: 4,
          columns: expect.any(Array),
        },
        success: true,
        historyLogId: 'hist-789e4567-e89b-12d3-a456-426614174000',
        changesSummary:
          'Reordered 4 columns: moved "Backlog" from position 3 to 0',
        previousOrder: [0, 1, 2, 3],
        newOrder: [0, 1, 2, 3],
      };

      jest.spyOn(service, 'execute').mockResolvedValue(expectedResponse);

      const result = await controller.handle(requestDto);

      expect(result).toEqual(expectedResponse);
      expect(service.execute).toHaveBeenCalledWith(requestDto);
    });

    it('should handle simple column swap', async () => {
      const requestDto = {
        boardId: 'board-123e4567-e89b-12d3-a456-426614174000',
        columnOrder: [
          { columnId: 'col-2', position: 0 },
          { columnId: 'col-1', position: 1 },
        ],
        userId: 'user-123e4567-e89b-12d3-a456-426614174000',
        validateComplete: false,
      };

      const expectedResponse = {
        boardId: requestDto.boardId,
        userId: requestDto.userId,
        userName: 'John Doe',
        reorderedAt: expect.any(Date),
        columnsChanged: 2,
        boardLayout: {
          boardId: requestDto.boardId,
          boardName: 'Project Kanban Board',
          totalColumns: 2,
          columns: [
            {
              columnId: 'col-2',
              columnName: 'To Do',
              previousPosition: 1,
              newPosition: 0,
              positionChanged: true,
            },
            {
              columnId: 'col-1',
              columnName: 'Backlog',
              previousPosition: 0,
              newPosition: 1,
              positionChanged: true,
            },
          ],
        },
        success: true,
        historyLogId: 'hist-789e4567-e89b-12d3-a456-426614174000',
        changesSummary:
          'Reordered 2 columns: moved "To Do" from position 1 to 0, "Backlog" from position 0 to 1',
        previousOrder: [0, 1],
        newOrder: [1, 0],
      };

      jest.spyOn(service, 'execute').mockResolvedValue(expectedResponse);

      const result = await controller.handle(requestDto);

      expect(result).toEqual(expectedResponse);
      expect(result.columnsChanged).toBe(2);
    });

    it('should throw NotFoundException when board is not found', async () => {
      const requestDto = {
        boardId: 'nonexistent-board',
        columnOrder: [{ columnId: 'col-1', position: 0 }],
        userId: 'user-123e4567-e89b-12d3-a456-426614174000',
      };

      jest
        .spyOn(service, 'execute')
        .mockRejectedValue(
          new NotFoundException(
            `Board with ID ${requestDto.boardId} not found`,
          ),
        );

      await expect(controller.handle(requestDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for duplicate positions', async () => {
      const requestDto = {
        boardId: 'board-123e4567-e89b-12d3-a456-426614174000',
        columnOrder: [
          { columnId: 'col-1', position: 0 },
          { columnId: 'col-2', position: 0 }, // Duplicate position
        ],
        userId: 'user-123e4567-e89b-12d3-a456-426614174000',
      };

      jest
        .spyOn(service, 'execute')
        .mockRejectedValue(
          new BadRequestException('Duplicate positions found in column order'),
        );

      await expect(controller.handle(requestDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for invalid position range', async () => {
      const requestDto = {
        boardId: 'board-123e4567-e89b-12d3-a456-426614174000',
        columnOrder: [
          { columnId: 'col-1', position: -1 }, // Invalid position
        ],
        userId: 'user-123e4567-e89b-12d3-a456-426614174000',
      };

      jest
        .spyOn(service, 'execute')
        .mockRejectedValue(
          new BadRequestException(
            'Invalid position range. Positions must be between 0 and 0',
          ),
        );

      await expect(controller.handle(requestDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle no position changes', async () => {
      const requestDto = {
        boardId: 'board-123e4567-e89b-12d3-a456-426614174000',
        columnOrder: [
          { columnId: 'col-1', position: 0 },
          { columnId: 'col-2', position: 1 },
        ],
        userId: 'user-123e4567-e89b-12d3-a456-426614174000',
      };

      const expectedResponse = {
        boardId: requestDto.boardId,
        userId: requestDto.userId,
        userName: 'John Doe',
        reorderedAt: expect.any(Date),
        columnsChanged: 0, // No changes
        boardLayout: {
          boardId: requestDto.boardId,
          boardName: 'Project Kanban Board',
          totalColumns: 2,
          columns: expect.any(Array),
        },
        success: true,
        historyLogId: 'hist-789e4567-e89b-12d3-a456-426614174000',
        changesSummary: 'No position changes were made',
        previousOrder: [0, 1],
        newOrder: [0, 1],
      };

      jest.spyOn(service, 'execute').mockResolvedValue(expectedResponse);

      const result = await controller.handle(requestDto);

      expect(result.columnsChanged).toBe(0);
      expect(result.changesSummary).toBe('No position changes were made');
    });
  });
});
