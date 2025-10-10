import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistory } from '@/entities/task-history.entity';
import {
  ReorderBoardColumnsRequestDto,
  ColumnOrderDto,
} from './reorder-board-columns.request.dto';
import {
  ReorderBoardColumnsResponseDto,
  ReorderedColumnDto,
  BoardLayoutDto,
} from './reorder-board-columns.response.dto';

@Injectable()
export class ReorderBoardColumnsService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(
    requestDto: ReorderBoardColumnsRequestDto,
  ): Promise<ReorderBoardColumnsResponseDto> {
    // Validate the board exists
    await this.validateBoardExists(requestDto.boardId);

    // Get current board structure
    const currentColumns = await this.getCurrentBoardColumns(
      requestDto.boardId,
    );

    // Validate the reorder request
    this.validateReorderRequest(requestDto, currentColumns);

    // Calculate position changes
    const reorderedColumns = this.calculatePositionChanges(
      requestDto.columnOrder,
      currentColumns,
    );

    // Apply the reorder and create history log
    const historyEntry = await this.createReorderHistoryLog(
      requestDto,
      reorderedColumns,
      currentColumns,
    );

    // Get user display name
    const userName = await this.getUserDisplayName(requestDto.userId);

    // Build response
    const columnsChanged = reorderedColumns.filter(
      (col) => col.positionChanged,
    ).length;
    const boardLayout = this.buildBoardLayout(
      requestDto.boardId,
      reorderedColumns,
    );
    const changesSummary = this.generateChangesSummary(reorderedColumns);

    return {
      boardId: requestDto.boardId,
      userId: requestDto.userId,
      userName,
      reorderedAt: historyEntry.createdAt,
      reorderReason: requestDto.reorderReason,
      columnsChanged,
      boardLayout,
      success: true,
      historyLogId: historyEntry.id,
      changesSummary,
      previousOrder: currentColumns.map((_, index) => index),
      newOrder: reorderedColumns.map((col) => col.newPosition),
    };
  }

  private async validateBoardExists(boardId: string): Promise<void> {
    const boardRecord = await this.taskHistoryRepository.findOne({
      where: {
        action: 'BOARD_CREATED',
        context: {
          boardId,
        } as any,
      },
    });

    if (!boardRecord) {
      throw new NotFoundException(`Board with ID ${boardId} not found`);
    }
  }

  private async getCurrentBoardColumns(boardId: string): Promise<any[]> {
    const columnRecords = await this.taskHistoryRepository.find({
      where: {
        action: 'COLUMN_CREATED',
        context: {
          boardId,
        } as any,
      },
      order: { createdAt: 'ASC' },
    });

    return columnRecords.map((record, index) => ({
      columnId: record.context?.columnId || `col-${index}`,
      columnName: record.context?.columnName || `Column ${index + 1}`,
      position: record.context?.position ?? index,
      createdAt: record.createdAt,
    }));
  }

  private validateReorderRequest(
    requestDto: ReorderBoardColumnsRequestDto,
    currentColumns: any[],
  ): void {
    const { columnOrder, validateComplete } = requestDto;

    // Check for duplicate positions
    const positions = columnOrder.map((col) => col.position);
    const uniquePositions = new Set(positions);
    if (positions.length !== uniquePositions.size) {
      throw new BadRequestException(
        'Duplicate positions found in column order',
      );
    }

    // Check for valid position range
    const maxPosition = Math.max(...positions);
    const minPosition = Math.min(...positions);
    if (minPosition < 0 || maxPosition >= columnOrder.length) {
      throw new BadRequestException(
        `Invalid position range. Positions must be between 0 and ${columnOrder.length - 1}`,
      );
    }

    // Validate all columns exist
    for (const orderItem of columnOrder) {
      const columnExists = currentColumns.some(
        (col) => col.columnId === orderItem.columnId,
      );
      if (!columnExists) {
        throw new BadRequestException(
          `Column ${orderItem.columnId} not found on board`,
        );
      }
    }

    // If validation is enabled, ensure all columns are included
    if (validateComplete && columnOrder.length !== currentColumns.length) {
      throw new BadRequestException(
        `All columns must be included. Expected ${currentColumns.length}, got ${columnOrder.length}`,
      );
    }
  }

  private calculatePositionChanges(
    newOrder: ColumnOrderDto[],
    currentColumns: any[],
  ): ReorderedColumnDto[] {
    return newOrder.map((orderItem) => {
      const currentColumn = currentColumns.find(
        (col) => col.columnId === orderItem.columnId,
      );
      const previousPosition = currentColumn?.position ?? -1;
      const newPosition = orderItem.position;

      return {
        columnId: orderItem.columnId,
        columnName:
          orderItem.columnName || currentColumn?.columnName || 'Unknown Column',
        previousPosition,
        newPosition,
        positionChanged: previousPosition !== newPosition,
      };
    });
  }

  private async createReorderHistoryLog(
    requestDto: ReorderBoardColumnsRequestDto,
    reorderedColumns: ReorderedColumnDto[],
    currentColumns: any[],
  ): Promise<TaskHistory> {
    const historyEntry = this.taskHistoryRepository.create({
      agentId: requestDto.userId,
      taskId: `board-reorder-${Date.now()}`,
      taskKey: `BOARD-REORDER-${requestDto.boardId.slice(-8)}`,
      taskTitle: 'Board Columns Reordered',
      action: 'BOARD_COLUMNS_REORDERED',
      context: {
        operation: 'reorder_board_columns',
        boardId: requestDto.boardId,
        reorderReason: requestDto.reorderReason,
        columnsChanged: reorderedColumns.filter((col) => col.positionChanged)
          .length,
        previousOrder: currentColumns.map((col) => ({
          columnId: col.columnId,
          position: col.position,
        })),
        newOrder: reorderedColumns.map((col) => ({
          columnId: col.columnId,
          position: col.newPosition,
        })),
        reorderedColumns,
      },
      status: 'completed',
    });

    return await this.taskHistoryRepository.save(historyEntry);
  }

  private async getUserDisplayName(userId: string): Promise<string> {
    // In a real system, this would fetch from user service
    if (userId.startsWith('user-')) {
      return `User ${userId.slice(-8)}`;
    }
    return `User ${userId.substring(0, 8)}`;
  }

  private buildBoardLayout(
    boardId: string,
    reorderedColumns: ReorderedColumnDto[],
  ): BoardLayoutDto {
    // Sort columns by new position
    const sortedColumns = [...reorderedColumns].sort(
      (a, b) => a.newPosition - b.newPosition,
    );

    return {
      boardId,
      boardName: `Kanban Board ${boardId.slice(-8)}`,
      totalColumns: reorderedColumns.length,
      columns: sortedColumns,
    };
  }

  private generateChangesSummary(
    reorderedColumns: ReorderedColumnDto[],
  ): string {
    const changedColumns = reorderedColumns.filter(
      (col) => col.positionChanged,
    );

    if (changedColumns.length === 0) {
      return 'No position changes were made';
    }

    const changes = changedColumns.map(
      (col) =>
        `"${col.columnName}" from position ${col.previousPosition} to ${col.newPosition}`,
    );

    return `Reordered ${reorderedColumns.length} columns: moved ${changes.join(', ')}`;
  }
}
