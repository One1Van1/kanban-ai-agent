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
  DeleteBoardRequestDto,
  BoardDeleteMode,
} from './delete-board.request.dto';
import {
  DeleteBoardResponseDto,
  BoardDeletionMetadata,
  TaskRelocation,
  FilesDeletion,
} from './delete-board.response.dto';

@Injectable()
export class DeleteBoardService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async deleteBoard(
    boardId: string,
    requestDto: DeleteBoardRequestDto,
  ): Promise<DeleteBoardResponseDto> {
    const currentBoard = await this.getCurrentBoardState(boardId);

    if (!currentBoard) {
      throw new NotFoundException(`Board with ID ${boardId} not found`);
    }

    await this.validateDeletionRequest(currentBoard, requestDto);

    const boardMetadata = await this.getBoardMetadata(currentBoard);
    const tasksInBoard = await this.getTasksInBoard(boardId);
    const columnsInBoard = await this.getColumnsInBoard(boardId);
    const boardMembers = await this.getBoardMembers(boardId);

    if (
      tasksInBoard.length > 0 &&
      !requestDto.forceDelete &&
      requestDto.deleteMode !== BoardDeleteMode.EXPORT_AND_DELETE
    ) {
      throw new ConflictException(
        `Cannot delete board: ${tasksInBoard.length} tasks are in this board. Use forceDelete=true or EXPORT_AND_DELETE mode.`,
      );
    }

    const deletionResult = await this.performBoardDeletion(
      currentBoard,
      requestDto,
      tasksInBoard,
      columnsInBoard,
    );
    const backupPath = requestDto.createBackup
      ? await this.createBoardBackup(currentBoard, boardMetadata)
      : undefined;
    const filesDeletion = requestDto.deleteFiles
      ? await this.deleteAssociatedFiles(boardId)
      : undefined;
    const notifiedMembers = requestDto.notifyMembers
      ? await this.notifyMembersAboutDeletion(boardMembers)
      : [];
    const historyLog = await this.createDeletionHistoryLog(
      currentBoard,
      requestDto,
      deletionResult,
    );

    return {
      boardId,
      boardName: boardMetadata.boardName,
      deleteMode: requestDto.deleteMode || BoardDeleteMode.SOFT_DELETE,
      deletedBy: requestDto.deletedBy,
      deletedAt: historyLog.createdAt,
      deleteReason: requestDto.deleteReason,
      columnsDeleted: deletionResult.columnsDeleted,
      tasksInBoard: deletionResult.tasksInBoard,
      tasksRelocated: deletionResult.tasksRelocated,
      targetBoardId: requestDto.targetBoardId,
      targetBoardName: deletionResult.targetBoardName,
      taskRelocations: deletionResult.taskRelocations,
      notifiedMembers,
      success: true,
      canBeRestored:
        requestDto.deleteMode === BoardDeleteMode.SOFT_DELETE ||
        requestDto.deleteMode === BoardDeleteMode.ARCHIVE,
      backupPath,
      filesDeletion,
      historyLogId: historyLog.id,
    };
  }

  private async getCurrentBoardState(boardId: string) {
    return await this.taskHistoryRepository.findOne({
      where: {
        taskId: boardId,
        action: 'board_created',
      },
      order: { createdAt: 'DESC' },
    });
  }

  private async validateDeletionRequest(
    currentBoard: TaskHistory,
    requestDto: DeleteBoardRequestDto,
  ): Promise<void> {
    if (
      !Object.values(BoardDeleteMode).includes(
        requestDto.deleteMode || BoardDeleteMode.SOFT_DELETE,
      )
    ) {
      throw new BadRequestException(
        `Invalid delete mode: ${requestDto.deleteMode}`,
      );
    }

    if (requestDto.deleteMode === BoardDeleteMode.EXPORT_AND_DELETE) {
      if (!requestDto.targetBoardId) {
        throw new BadRequestException(
          'targetBoardId is required when using EXPORT_AND_DELETE mode',
        );
      }

      const targetBoard = await this.getCurrentBoardState(
        requestDto.targetBoardId,
      );
      if (!targetBoard) {
        throw new NotFoundException(
          `Target board with ID ${requestDto.targetBoardId} not found`,
        );
      }

      if (requestDto.targetBoardId === currentBoard.taskId) {
        throw new BadRequestException(
          'Cannot move tasks to the same board being deleted',
        );
      }
    }

    // Check if board is not the last active board for the user/organization
    const activeBoardsCount = await this.getActiveBoardsCount();
    if (
      activeBoardsCount <= 1 &&
      requestDto.deleteMode === BoardDeleteMode.HARD_DELETE
    ) {
      throw new ConflictException('Cannot hard delete the last active board');
    }
  }

  private async getBoardMetadata(
    currentBoard: TaskHistory,
  ): Promise<BoardDeletionMetadata> {
    const boardData = currentBoard.context?.boardData || {};

    return {
      boardName: boardData.name || currentBoard.taskTitle || 'Unknown Board',
      boardType: boardData.type || 'kanban',
      columnsCount: await this.getColumnsInBoard(currentBoard.taskId).then(
        (cols) => cols.length,
      ),
      tasksCount: await this.getTasksInBoard(currentBoard.taskId).then(
        (tasks) => tasks.length,
      ),
      membersCount: await this.getBoardMembers(currentBoard.taskId).then(
        (members) => members.length,
      ),
      filesCount: await this.getBoardFilesCount(currentBoard.taskId),
      createdAt: currentBoard.createdAt,
      lastActivityAt: boardData.lastActivityAt || currentBoard.createdAt,
    };
  }

  private async getTasksInBoard(boardId: string): Promise<TaskHistory[]> {
    return await this.taskHistoryRepository.find({
      where: {
        taskKey: `%BOARD-${boardId}%`,
        action: 'task_created',
      },
      order: { createdAt: 'DESC' },
    });
  }

  private async getColumnsInBoard(boardId: string): Promise<TaskHistory[]> {
    return await this.taskHistoryRepository.find({
      where: {
        taskKey: `%BOARD-${boardId}%`,
        action: 'column_created',
      },
      order: { createdAt: 'ASC' },
    });
  }

  private async getBoardMembers(boardId: string): Promise<string[]> {
    const memberRecords = await this.taskHistoryRepository.find({
      where: {
        taskId: boardId,
        action: 'member_added',
      },
    });

    return memberRecords
      .map((record) => record.context?.memberData?.userId)
      .filter(Boolean);
  }

  private async getBoardFilesCount(boardId: string): Promise<number> {
    return await this.taskHistoryRepository.count({
      where: {
        taskKey: `%BOARD-${boardId}%`,
        action: 'file_uploaded',
      },
    });
  }

  private async getActiveBoardsCount(): Promise<number> {
    return await this.taskHistoryRepository.count({
      where: {
        action: 'board_created',
        status: 'completed',
      },
    });
  }

  private async performBoardDeletion(
    currentBoard: TaskHistory,
    requestDto: DeleteBoardRequestDto,
    tasksInBoard: TaskHistory[],
    columnsInBoard: TaskHistory[],
  ): Promise<{
    columnsDeleted: number;
    tasksInBoard: number;
    tasksRelocated: number;
    targetBoardName?: string;
    taskRelocations: TaskRelocation[];
  }> {
    const tasksCount = tasksInBoard.length;
    const columnsCount = columnsInBoard.length;
    let tasksRelocated = 0;
    let targetBoardName: string | undefined;
    const taskRelocations: TaskRelocation[] = [];

    switch (requestDto.deleteMode) {
      case BoardDeleteMode.SOFT_DELETE:
      case BoardDeleteMode.ARCHIVE:
        // Mark board as deleted/archived but keep tasks
        break;

      case BoardDeleteMode.HARD_DELETE:
        // Remove board and handle tasks
        if (requestDto.forceDelete && tasksCount > 0) {
          // In a real implementation, you would handle task deletion or move to trash
          tasksRelocated = 0; // Tasks are deleted, not relocated
        }
        break;

      case BoardDeleteMode.EXPORT_AND_DELETE:
        // Move all tasks to target board
        if (requestDto.targetBoardId) {
          const targetBoard = await this.getCurrentBoardState(
            requestDto.targetBoardId,
          );
          targetBoardName =
            targetBoard?.context?.boardData?.name || 'Unknown Target Board';

          // Create task relocations
          for (const task of tasksInBoard) {
            const relocation: TaskRelocation = {
              taskId: task.taskId,
              taskTitle: task.taskTitle,
              fromBoardId: currentBoard.taskId,
              toBoardId: requestDto.targetBoardId,
              newColumnId: await this.getDefaultColumnInBoard(
                requestDto.targetBoardId,
              ),
              relocatedAt: new Date(),
            };
            taskRelocations.push(relocation);
          }

          tasksRelocated = tasksCount;
        }
        break;
    }

    return {
      columnsDeleted: columnsCount,
      tasksInBoard: tasksCount,
      tasksRelocated,
      targetBoardName,
      taskRelocations,
    };
  }

  private async getDefaultColumnInBoard(boardId: string): Promise<string> {
    const firstColumn = await this.taskHistoryRepository.findOne({
      where: {
        taskKey: `%BOARD-${boardId}%`,
        action: 'column_created',
      },
      order: { createdAt: 'ASC' },
    });

    return firstColumn?.taskId || 'default-column';
  }

  private async createBoardBackup(
    currentBoard: TaskHistory,
    boardMetadata: BoardDeletionMetadata,
  ): Promise<string> {
    // In a real implementation, this would create an actual backup file
    const timestamp = new Date().toISOString().split('T')[0];
    const backupPath = `/backups/boards/board-${currentBoard.taskId}_${timestamp}.json`;

    // Simulate backup creation
    return backupPath;
  }

  private async deleteAssociatedFiles(boardId: string): Promise<FilesDeletion> {
    // In a real implementation, this would delete actual files
    const filesCount = await this.getBoardFilesCount(boardId);

    return {
      totalFiles: filesCount,
      deletedFiles: Math.max(0, filesCount - 2), // Simulate some failures
      failedDeletions: filesCount > 2 ? ['file1.pdf', 'image2.png'] : [],
      totalSizeDeleted: filesCount * 1024 * 512, // Simulate file sizes
    };
  }

  private async notifyMembersAboutDeletion(
    boardMembers: string[],
  ): Promise<string[]> {
    // In a real implementation, this would send actual notifications
    return boardMembers;
  }

  private async createDeletionHistoryLog(
    currentBoard: TaskHistory,
    requestDto: DeleteBoardRequestDto,
    deletionResult: any,
  ): Promise<TaskHistory> {
    const historyLog = this.taskHistoryRepository.create({
      agentId: 'system',
      taskId: currentBoard.taskId,
      taskKey: currentBoard.taskKey,
      taskTitle: `Deleted board: ${currentBoard.context?.boardData?.name || 'Unknown'}`,
      action: 'board_deleted',
      fromStatus: 'active',
      toStatus:
        requestDto.deleteMode === BoardDeleteMode.SOFT_DELETE
          ? 'deleted'
          : requestDto.deleteMode === BoardDeleteMode.ARCHIVE
            ? 'archived'
            : 'removed',
      fromColumn: 'Active Boards',
      toColumn: 'Deleted',
      status: 'completed',
      context: {
        deletionType: 'board_deletion',
        deleteMode: requestDto.deleteMode,
        deleteReason: requestDto.deleteReason,
        forceDelete: requestDto.forceDelete,
        targetBoardId: requestDto.targetBoardId,
        boardMetadata: currentBoard.context?.boardData,
        deletionResult,
      },
      agentResponse: {
        success: true,
        boardDeleted: true,
        deleteMode: requestDto.deleteMode,
        timestamp: new Date().toISOString(),
      },
    });

    return await this.taskHistoryRepository.save(historyLog);
  }
}
