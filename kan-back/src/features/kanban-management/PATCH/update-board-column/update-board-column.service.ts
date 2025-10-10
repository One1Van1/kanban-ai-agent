import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistory } from '../../../../entities/task-history.entity';
import {
  UpdateBoardColumnRequestDto,
  ColumnType,
} from './update-board-column.request.dto';
import {
  UpdateBoardColumnResponseDto,
  ColumnUpdateMetadata,
} from './update-board-column.response.dto';

@Injectable()
export class UpdateBoardColumnService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async updateColumn(
    columnId: string,
    requestDto: UpdateBoardColumnRequestDto,
  ): Promise<UpdateBoardColumnResponseDto> {
    // Get current column state
    const currentColumn = await this.getCurrentColumnState(columnId);

    if (!currentColumn) {
      throw new NotFoundException(`Column with ID ${columnId} not found`);
    }

    // Validate update request
    await this.validateUpdateRequest(currentColumn, requestDto);

    // Calculate what fields are being updated
    const updateMetadata = await this.calculateUpdateMetadata(
      currentColumn,
      requestDto,
    );

    if (updateMetadata.fieldsUpdated.length === 0) {
      throw new BadRequestException('No fields to update provided');
    }

    // Apply updates and create new column state
    const updatedColumnData = this.applyUpdates(currentColumn, requestDto);

    // Get board ID from current column
    const boardId = currentColumn.context?.columnData?.boardId || 'unknown';

    // Handle position changes if needed
    if (
      requestDto.position !== undefined &&
      requestDto.position !== currentColumn.context?.columnData?.position
    ) {
      await this.handlePositionUpdate(
        boardId,
        columnId,
        requestDto.position,
        currentColumn.context?.columnData?.position,
      );
    }

    // Create history log entry
    const historyLog = this.taskHistoryRepository.create({
      agentId: 'system',
      taskId: columnId,
      taskKey: `BOARD-${boardId}-COL-UPDATE`,
      taskTitle: `Updated column: ${updatedColumnData.name}`,
      action: 'column_updated',
      fromStatus: 'active',
      toStatus: updatedColumnData.isActive ? 'active' : 'inactive',
      fromColumn: currentColumn.context?.columnData?.name,
      toColumn: updatedColumnData.name,
      status: 'completed',
      context: {
        updateType: 'column_update',
        fieldsUpdated: updateMetadata.fieldsUpdated,
        previousValues: updateMetadata.previousValues,
        newValues: updateMetadata.newValues,
        updateComment: requestDto.updateComment,
        columnData: updatedColumnData,
        positionChanges: updateMetadata.positionChanges,
      },
      agentResponse: {
        success: true,
        updateApplied: true,
        fieldsModified: updateMetadata.fieldsUpdated.length,
        timestamp: new Date().toISOString(),
      },
    });

    const savedLog = await this.taskHistoryRepository.save(historyLog);

    // Get current task count in column
    const currentTaskCount = await this.getCurrentTaskCountInColumn(columnId);

    return {
      columnId,
      boardId,
      name: updatedColumnData.name,
      type: updatedColumnData.type,
      position: updatedColumnData.position,
      description: updatedColumnData.description,
      color: updatedColumnData.color,
      wipLimit: updatedColumnData.wipLimit,
      isActive: updatedColumnData.isActive,
      updatedBy: requestDto.updatedBy,
      updatedAt: savedLog.createdAt,
      fieldsUpdated: updateMetadata.fieldsUpdated,
      previousValues: updateMetadata.previousValues,
      positionChanges: updateMetadata.positionChanges,
      updateComment: requestDto.updateComment,
      success: true,
      version: (await this.getColumnVersion(columnId)) + 1,
      currentTaskCount,
      historyLogId: savedLog.id,
    };
  }

  private async getCurrentColumnState(columnId: string) {
    return await this.taskHistoryRepository.findOne({
      where: {
        taskId: columnId,
        action: 'column_created',
      },
      order: { createdAt: 'DESC' },
    });
  }

  private async validateUpdateRequest(
    currentColumn: TaskHistory,
    requestDto: UpdateBoardColumnRequestDto,
  ): Promise<void> {
    const boardId = currentColumn.context?.columnData?.boardId;

    // Validate column type enum
    if (
      requestDto.type &&
      !Object.values(ColumnType).includes(requestDto.type)
    ) {
      throw new BadRequestException(`Invalid column type: ${requestDto.type}`);
    }

    // Validate position
    if (requestDto.position !== undefined) {
      const totalColumns = await this.getTotalColumnsInBoard(boardId);
      if (requestDto.position < 0 || requestDto.position >= totalColumns) {
        throw new BadRequestException(
          `Invalid position ${requestDto.position}. Must be between 0 and ${totalColumns - 1}`,
        );
      }
    }

    // Validate WIP limit
    if (requestDto.wipLimit !== undefined && requestDto.wipLimit < 1) {
      throw new BadRequestException('WIP limit must be at least 1');
    }

    // Check for duplicate column name in same board
    if (requestDto.name) {
      const duplicateColumn = await this.findColumnByNameInBoard(
        boardId,
        requestDto.name,
      );
      if (duplicateColumn && duplicateColumn.taskId !== currentColumn.taskId) {
        throw new ConflictException(
          `Column with name "${requestDto.name}" already exists in board ${boardId}`,
        );
      }
    }

    // Validate color format if provided
    if (requestDto.color && !this.isValidHexColor(requestDto.color)) {
      throw new BadRequestException(
        'Color must be a valid hex color code (e.g., #FF5722)',
      );
    }
  }

  private async calculateUpdateMetadata(
    currentColumn: TaskHistory,
    requestDto: UpdateBoardColumnRequestDto,
  ): Promise<ColumnUpdateMetadata> {
    const fieldsUpdated: string[] = [];
    const previousValues: Record<string, any> = {};
    const newValues: Record<string, any> = {};

    const currentData = currentColumn.context?.columnData || {};

    // Check each field for changes
    if (requestDto.name && requestDto.name !== currentData.name) {
      fieldsUpdated.push('name');
      previousValues.name = currentData.name;
      newValues.name = requestDto.name;
    }

    if (requestDto.type && requestDto.type !== currentData.type) {
      fieldsUpdated.push('type');
      previousValues.type = currentData.type;
      newValues.type = requestDto.type;
    }

    if (
      requestDto.description &&
      requestDto.description !== currentData.description
    ) {
      fieldsUpdated.push('description');
      previousValues.description = currentData.description;
      newValues.description = requestDto.description;
    }

    if (requestDto.color && requestDto.color !== currentData.color) {
      fieldsUpdated.push('color');
      previousValues.color = currentData.color;
      newValues.color = requestDto.color;
    }

    if (
      requestDto.wipLimit !== undefined &&
      requestDto.wipLimit !== currentData.wipLimit
    ) {
      fieldsUpdated.push('wipLimit');
      previousValues.wipLimit = currentData.wipLimit;
      newValues.wipLimit = requestDto.wipLimit;
    }

    if (
      requestDto.isActive !== undefined &&
      requestDto.isActive !== currentData.isActive
    ) {
      fieldsUpdated.push('isActive');
      previousValues.isActive = currentData.isActive;
      newValues.isActive = requestDto.isActive;
    }

    let positionChanges;
    if (
      requestDto.position !== undefined &&
      requestDto.position !== currentData.position
    ) {
      fieldsUpdated.push('position');
      previousValues.position = currentData.position;
      newValues.position = requestDto.position;

      // Calculate affected columns for position change
      const affectedColumns = await this.getAffectedColumnsByPositionChange(
        currentData.boardId,
        currentData.position,
        requestDto.position,
      );

      positionChanges = {
        from: currentData.position,
        to: requestDto.position,
        affectedColumns,
      };
    }

    return {
      fieldsUpdated,
      previousValues,
      newValues,
      positionChanges,
      updateReason: requestDto.updateComment,
      updatedBy: requestDto.updatedBy,
      updatedAt: new Date(),
    };
  }

  private applyUpdates(
    currentColumn: TaskHistory,
    requestDto: UpdateBoardColumnRequestDto,
  ) {
    const currentData = currentColumn.context?.columnData || {};

    return {
      name: requestDto.name || currentData.name,
      type: requestDto.type || currentData.type,
      position:
        requestDto.position !== undefined
          ? requestDto.position
          : currentData.position,
      description: requestDto.description || currentData.description,
      color: requestDto.color || currentData.color,
      wipLimit:
        requestDto.wipLimit !== undefined
          ? requestDto.wipLimit
          : currentData.wipLimit,
      isActive:
        requestDto.isActive !== undefined
          ? requestDto.isActive
          : (currentData.isActive ?? true),
      boardId: currentData.boardId,
    };
  }

  private async handlePositionUpdate(
    boardId: string,
    columnId: string,
    newPosition: number,
    oldPosition: number,
  ): Promise<void> {
    // This would update positions of other columns
    // For now, we just log the position change
    // In a real implementation, you would update other columns' positions
    console.log(
      `Column ${columnId} position changed from ${oldPosition} to ${newPosition} in board ${boardId}`,
    );
  }

  private async getTotalColumnsInBoard(boardId: string): Promise<number> {
    return await this.taskHistoryRepository.count({
      where: {
        action: 'column_created',
        taskKey: `%BOARD-${boardId}%`,
      },
    });
  }

  private async findColumnByNameInBoard(boardId: string, name: string) {
    return await this.taskHistoryRepository.findOne({
      where: {
        action: 'column_created',
        taskKey: `%BOARD-${boardId}%`,
        toColumn: name,
      },
    });
  }

  private async getAffectedColumnsByPositionChange(
    boardId: string,
    fromPosition: number,
    toPosition: number,
  ): Promise<string[]> {
    // Get columns that will be affected by position change
    const minPos = Math.min(fromPosition, toPosition);
    const maxPos = Math.max(fromPosition, toPosition);

    const affectedColumns = await this.taskHistoryRepository.find({
      where: {
        action: 'column_created',
        taskKey: `%BOARD-${boardId}%`,
      },
    });

    return affectedColumns
      .filter((col) => {
        const pos = col.context?.columnData?.position;
        return pos >= minPos && pos <= maxPos;
      })
      .map((col) => col.taskId);
  }

  private async getCurrentTaskCountInColumn(columnId: string): Promise<number> {
    // Count tasks currently in this column
    return await this.taskHistoryRepository.count({
      where: {
        toColumn: columnId,
        status: 'completed',
      },
    });
  }

  private async getColumnVersion(columnId: string): Promise<number> {
    const updateCount = await this.taskHistoryRepository.count({
      where: {
        taskId: columnId,
        action: 'column_updated',
      },
    });

    return updateCount;
  }

  private isValidHexColor(color: string): boolean {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexColorRegex.test(color);
  }
}
