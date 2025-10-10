import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistory } from '@/entities/task-history.entity';
import {
  CreateBoardColumnRequestDto,
  ColumnType,
} from './create-board-column.request.dto';
import {
  CreateBoardColumnResponseDto,
  BoardColumnMetadata,
} from './create-board-column.response.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateBoardColumnService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async createColumn(
    requestDto: CreateBoardColumnRequestDto,
  ): Promise<CreateBoardColumnResponseDto> {
    const {
      boardId,
      name,
      type,
      position,
      description,
      color,
      wipLimit,
      createdBy,
    } = requestDto;

    // Validate board exists and get current columns
    await this.validateBoardAndPosition(boardId, position, name);

    // Generate unique column ID
    const columnId = `col-${uuidv4()}`;

    // Get adjacent columns information
    const adjacentColumns = await this.getAdjacentColumns(boardId, position);

    // Create column metadata
    const columnMetadata: BoardColumnMetadata = {
      boardId,
      totalColumns: (await this.getTotalColumnsInBoard(boardId)) + 1,
      columnInsertedAt: position,
      adjacentColumns,
    };

    // Create history log entry for column creation
    const historyLog = this.taskHistoryRepository.create({
      agentId: 'system',
      taskId: columnId,
      taskKey: `BOARD-${boardId}-COL-${position}`,
      taskTitle: `Created column: ${name}`,
      action: 'column_created',
      fromStatus: undefined,
      toStatus: 'active',
      fromColumn: undefined,
      toColumn: name,
      status: 'completed',
      context: {
        columnData: {
          columnId,
          boardId,
          name,
          type,
          position,
          description,
          color,
          wipLimit,
        },
        ...columnMetadata,
      },
      agentResponse: {
        success: true,
        columnCreated: true,
        columnId,
        timestamp: new Date().toISOString(),
      },
    });

    const savedLog = await this.taskHistoryRepository.save(historyLog);

    return {
      columnId,
      boardId,
      name,
      type,
      position,
      description,
      color,
      wipLimit,
      createdBy,
      createdAt: savedLog.createdAt,
      success: true,
      totalColumnsInBoard: columnMetadata.totalColumns,
      adjacentColumns: columnMetadata.adjacentColumns,
      historyLogId: savedLog.id,
    };
  }

  private async validateBoardAndPosition(
    boardId: string,
    position: number,
    columnName: string,
  ): Promise<void> {
    // Check if board exists by looking for any tasks in this board
    const boardExists = await this.taskHistoryRepository.findOne({
      where: { taskKey: `%BOARD-${boardId}%` },
    });

    // Get existing columns for this board
    const existingColumns = await this.getExistingColumns(boardId);

    // Validate position
    if (position < 0 || position > existingColumns.length) {
      throw new BadRequestException(
        `Invalid position ${position}. Must be between 0 and ${existingColumns.length}`,
      );
    }

    // Check for duplicate column name
    const duplicateColumn = existingColumns.find(
      (col) => col.name.toLowerCase() === columnName.toLowerCase(),
    );

    if (duplicateColumn) {
      throw new ConflictException(
        `Column with name "${columnName}" already exists in board ${boardId}`,
      );
    }

    // Validate maximum columns per board
    if (existingColumns.length >= 20) {
      throw new BadRequestException(
        `Maximum number of columns (20) reached for board ${boardId}`,
      );
    }
  }

  private async getExistingColumns(boardId: string) {
    const columnLogs = await this.taskHistoryRepository.find({
      where: {
        action: 'column_created',
        taskKey: `%BOARD-${boardId}%`,
      },
      order: { createdAt: 'ASC' },
    });

    return columnLogs.map((log) => ({
      id: log.taskId,
      name: log.toColumn || 'Unknown',
      position: log.context?.columnData?.position || 0,
      type: log.context?.columnData?.type || ColumnType.CUSTOM,
    }));
  }

  private async getAdjacentColumns(
    boardId: string,
    position: number,
  ): Promise<{ before?: string; after?: string }> {
    const existingColumns = await this.getExistingColumns(boardId);

    // Sort by position
    existingColumns.sort((a, b) => a.position - b.position);

    const adjacentColumns: { before?: string; after?: string } = {};

    // Find columns that will be before and after the new position
    const beforeColumn = existingColumns.find(
      (col) => col.position === position - 1,
    );
    const afterColumn = existingColumns.find(
      (col) => col.position === position,
    );

    if (beforeColumn) {
      adjacentColumns.before = beforeColumn.name;
    }

    if (afterColumn) {
      adjacentColumns.after = afterColumn.name;
    }

    return adjacentColumns;
  }

  private async getTotalColumnsInBoard(boardId: string): Promise<number> {
    const columnCount = await this.taskHistoryRepository.count({
      where: {
        action: 'column_created',
        taskKey: `%BOARD-${boardId}%`,
      },
    });

    return columnCount;
  }

  async getAvailableColumnTypes(): Promise<ColumnType[]> {
    return Object.values(ColumnType);
  }

  async validateColumnName(boardId: string, name: string): Promise<boolean> {
    const existingColumns = await this.getExistingColumns(boardId);
    return !existingColumns.some(
      (col) => col.name.toLowerCase() === name.toLowerCase(),
    );
  }
}
