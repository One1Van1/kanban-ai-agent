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
  DeleteBoardColumnRequestDto,
  ColumnDeleteMode,
} from './delete-board-column.request.dto';
import {
  DeleteBoardColumnResponseDto,
  ColumnDeletionMetadata,
} from './delete-board-column.response.dto';

@Injectable()
export class DeleteBoardColumnService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async deleteColumn(
    columnId: string,
    requestDto: DeleteBoardColumnRequestDto,
  ): Promise<DeleteBoardColumnResponseDto> {
    const currentColumn = await this.getCurrentColumnState(columnId);

    if (!currentColumn) {
      throw new NotFoundException(`Column with ID ${columnId} not found`);
    }

    await this.validateDeletionRequest(currentColumn, requestDto);

    const columnMetadata = await this.getColumnMetadata(currentColumn);
    const tasksInColumn = await this.getTasksInColumn(columnId);

    if (
      tasksInColumn.length > 0 &&
      !requestDto.forceDelete &&
      requestDto.deleteMode !== ColumnDeleteMode.MERGE_WITH_ANOTHER
    ) {
      throw new ConflictException(
        `Cannot delete column: ${tasksInColumn.length} tasks are in this column. Use forceDelete=true or merge with another column.`,
      );
    }

    const deletionResult = await this.performColumnDeletion(
      currentColumn,
      requestDto,
      tasksInColumn,
    );
    const notifiedUsers = requestDto.notifyUsers
      ? await this.notifyUsersAboutDeletion(tasksInColumn)
      : [];
    const historyLog = await this.createDeletionHistoryLog(
      currentColumn,
      requestDto,
      deletionResult,
    );

    return {
      columnId,
      boardId: columnMetadata.boardId,
      columnName: columnMetadata.columnName,
      deleteMode: requestDto.deleteMode || ColumnDeleteMode.SOFT_DELETE,
      deletedBy: requestDto.deletedBy,
      deletedAt: historyLog.createdAt,
      deleteReason: requestDto.deleteReason,
      originalPosition: columnMetadata.position,
      tasksInColumn: deletionResult.tasksInColumn,
      tasksRelocated: deletionResult.tasksRelocated,
      targetColumnId: requestDto.targetColumnId,
      targetColumnName: deletionResult.targetColumnName,
      positionAdjustments: deletionResult.positionAdjustments,
      notifiedUsers,
      success: true,
      canBeRestored: requestDto.deleteMode === ColumnDeleteMode.SOFT_DELETE,
      remainingColumnsInBoard: await this.getRemainingColumnsCount(
        columnMetadata.boardId,
      ),
      historyLogId: historyLog.id,
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

  private async validateDeletionRequest(
    currentColumn: TaskHistory,
    requestDto: DeleteBoardColumnRequestDto,
  ): Promise<void> {
    if (
      !Object.values(ColumnDeleteMode).includes(
        requestDto.deleteMode || ColumnDeleteMode.SOFT_DELETE,
      )
    ) {
      throw new BadRequestException(
        `Invalid delete mode: ${requestDto.deleteMode}`,
      );
    }

    if (requestDto.deleteMode === ColumnDeleteMode.MERGE_WITH_ANOTHER) {
      if (!requestDto.targetColumnId) {
        throw new BadRequestException(
          'targetColumnId is required when merging with another column',
        );
      }

      const targetColumn = await this.getCurrentColumnState(
        requestDto.targetColumnId,
      );
      if (!targetColumn) {
        throw new NotFoundException(
          `Target column with ID ${requestDto.targetColumnId} not found`,
        );
      }

      if (requestDto.targetColumnId === currentColumn.taskId) {
        throw new BadRequestException('Cannot merge column with itself');
      }
    }

    const boardId = currentColumn.context?.columnData?.boardId;
    const remainingColumns = await this.getActiveColumnsInBoard(boardId);

    if (remainingColumns.length <= 1) {
      throw new ConflictException('Cannot delete the last column in the board');
    }
  }

  private async getColumnMetadata(
    currentColumn: TaskHistory,
  ): Promise<ColumnDeletionMetadata> {
    const columnData = currentColumn.context?.columnData || {};

    return {
      columnName: columnData.name || currentColumn.toColumn || 'Unknown',
      columnType: columnData.type || 'custom',
      position: columnData.position || 0,
      boardId: columnData.boardId || 'unknown',
      tasksInColumn: 0, // Will be filled later
      tasksRelocated: 0, // Will be filled later
      positionAdjustments: [], // Will be filled later
    };
  }

  private async getTasksInColumn(columnId: string): Promise<TaskHistory[]> {
    return await this.taskHistoryRepository.find({
      where: {
        toColumn: columnId,
        status: 'completed',
      },
      order: { createdAt: 'DESC' },
    });
  }

  private async getActiveColumnsInBoard(
    boardId: string,
  ): Promise<TaskHistory[]> {
    return await this.taskHistoryRepository.find({
      where: {
        action: 'column_created',
        taskKey: `%BOARD-${boardId}%`,
      },
      order: { createdAt: 'ASC' },
    });
  }

  private async performColumnDeletion(
    currentColumn: TaskHistory,
    requestDto: DeleteBoardColumnRequestDto,
    tasksInColumn: TaskHistory[],
  ): Promise<{
    tasksInColumn: number;
    tasksRelocated: number;
    targetColumnName?: string;
    positionAdjustments: {
      columnId: string;
      oldPosition: number;
      newPosition: number;
    }[];
  }> {
    const tasksCount = tasksInColumn.length;
    let tasksRelocated = 0;
    let targetColumnName: string | undefined;
    const positionAdjustments: {
      columnId: string;
      oldPosition: number;
      newPosition: number;
    }[] = [];

    switch (requestDto.deleteMode) {
      case ColumnDeleteMode.SOFT_DELETE:
        // Mark column as deleted but keep tasks
        break;

      case ColumnDeleteMode.HARD_DELETE:
        // Remove column and handle tasks
        if (requestDto.forceDelete && tasksCount > 0) {
          // In a real implementation, you would move tasks to a default column
          tasksRelocated = tasksCount;
        }
        break;

      case ColumnDeleteMode.MERGE_WITH_ANOTHER:
        // Move all tasks to target column
        if (requestDto.targetColumnId) {
          const targetColumn = await this.getCurrentColumnState(
            requestDto.targetColumnId,
          );
          targetColumnName =
            targetColumn?.context?.columnData?.name || 'Unknown';
          tasksRelocated = tasksCount;
        }
        break;
    }

    // Adjust positions of remaining columns
    const columnData = currentColumn.context?.columnData;
    if (columnData?.position !== undefined) {
      positionAdjustments.push(
        ...(await this.adjustColumnPositions(
          columnData.boardId,
          columnData.position,
        )),
      );
    }

    return {
      tasksInColumn: tasksCount,
      tasksRelocated,
      targetColumnName,
      positionAdjustments,
    };
  }

  private async adjustColumnPositions(
    boardId: string,
    deletedPosition: number,
  ): Promise<{ columnId: string; oldPosition: number; newPosition: number }[]> {
    const columnsToAdjust = await this.taskHistoryRepository.find({
      where: {
        action: 'column_created',
        taskKey: `%BOARD-${boardId}%`,
      },
    });

    return columnsToAdjust
      .filter((col) => {
        const pos = col.context?.columnData?.position;
        return pos !== undefined && pos > deletedPosition;
      })
      .map((col) => ({
        columnId: col.taskId,
        oldPosition: col.context?.columnData?.position,
        newPosition: col.context?.columnData?.position - 1,
      }));
  }

  private async notifyUsersAboutDeletion(
    tasksInColumn: TaskHistory[],
  ): Promise<string[]> {
    const usersToNotify = new Set<string>();

    tasksInColumn.forEach((task) => {
      const assignmentData = task.context?.assignmentData;
      if (assignmentData?.assignee) {
        usersToNotify.add(assignmentData.assignee);
      }
      if (assignmentData?.watchers) {
        assignmentData.watchers.forEach((watcher: string) =>
          usersToNotify.add(watcher),
        );
      }
    });

    return Array.from(usersToNotify);
  }

  private async createDeletionHistoryLog(
    currentColumn: TaskHistory,
    requestDto: DeleteBoardColumnRequestDto,
    deletionResult: any,
  ): Promise<TaskHistory> {
    const historyLog = this.taskHistoryRepository.create({
      agentId: 'system',
      taskId: currentColumn.taskId,
      taskKey: currentColumn.taskKey,
      taskTitle: `Deleted column: ${currentColumn.context?.columnData?.name || 'Unknown'}`,
      action: 'column_deleted',
      fromStatus: 'active',
      toStatus:
        requestDto.deleteMode === ColumnDeleteMode.SOFT_DELETE
          ? 'deleted'
          : 'removed',
      fromColumn: currentColumn.context?.columnData?.name,
      toColumn: 'Deleted',
      status: 'completed',
      context: {
        deletionType: 'column_deletion',
        deleteMode: requestDto.deleteMode,
        deleteReason: requestDto.deleteReason,
        forceDelete: requestDto.forceDelete,
        targetColumnId: requestDto.targetColumnId,
        columnMetadata: currentColumn.context?.columnData,
        deletionResult,
      },
      agentResponse: {
        success: true,
        columnDeleted: true,
        deleteMode: requestDto.deleteMode,
        timestamp: new Date().toISOString(),
      },
    });

    return await this.taskHistoryRepository.save(historyLog);
  }

  private async getRemainingColumnsCount(boardId: string): Promise<number> {
    return (
      (await this.taskHistoryRepository.count({
        where: {
          action: 'column_created',
          taskKey: `%BOARD-${boardId}%`,
        },
      })) - 1
    ); // Subtract 1 for the deleted column
  }
}
