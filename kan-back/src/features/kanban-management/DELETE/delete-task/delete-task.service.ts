import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistory } from '@/entities/task-history.entity';
import { DeleteTaskRequestDto, DeleteMode } from './delete-task.request.dto';
import {
  DeleteTaskResponseDto,
  TaskDeletionMetadata,
} from './delete-task.response.dto';

@Injectable()
export class DeleteTaskService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async deleteTask(
    taskId: string,
    requestDto: DeleteTaskRequestDto,
  ): Promise<DeleteTaskResponseDto> {
    // Get current task state
    const currentTask = await this.getCurrentTaskState(taskId);

    if (!currentTask) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Validate deletion request
    await this.validateDeletionRequest(currentTask, requestDto);

    // Get task metadata before deletion
    const taskMetadata = await this.getTaskMetadata(currentTask);

    // Check for dependencies if not force delete
    if (!requestDto.forceDelete) {
      await this.checkTaskDependencies(taskId);
    }

    // Perform deletion based on mode
    const deletionResult = await this.performDeletion(
      currentTask,
      requestDto,
      taskMetadata,
    );

    // Notify users if requested
    const notifiedUsers = requestDto.notifyUsers
      ? await this.notifyUsersAboutDeletion(taskMetadata)
      : [];

    // Create deletion history log
    const historyLog = await this.createDeletionHistoryLog(
      currentTask,
      requestDto,
      taskMetadata,
    );

    return {
      taskId,
      taskKey: currentTask.taskKey,
      taskTitle: currentTask.taskTitle,
      deleteMode: requestDto.deleteMode || DeleteMode.SOFT_DELETE,
      deletedBy: requestDto.deletedBy,
      deletedAt: historyLog.createdAt,
      deleteReason: requestDto.deleteReason,
      originalStatus: currentTask.status,
      originalColumn: currentTask.toColumn || 'Unknown',
      assignee: taskMetadata.assignee,
      watchers: taskMetadata.watchers,
      relatedTasks: taskMetadata.relatedTasks,
      attachmentsDeleted: deletionResult.attachmentsDeleted,
      commentsDeleted: deletionResult.commentsDeleted,
      historyEntriesArchived: deletionResult.historyEntriesArchived,
      notifiedUsers,
      success: true,
      canBeRestored:
        requestDto.deleteMode === DeleteMode.SOFT_DELETE ||
        requestDto.deleteMode === DeleteMode.ARCHIVE,
      restorationDeadline: this.calculateRestorationDeadline(
        requestDto.deleteMode,
      ),
      historyLogId: historyLog.id,
    };
  }

  private async getCurrentTaskState(taskId: string) {
    return await this.taskHistoryRepository.findOne({
      where: { taskId },
      order: { createdAt: 'DESC' },
    });
  }

  private async validateDeletionRequest(
    currentTask: TaskHistory,
    requestDto: DeleteTaskRequestDto,
  ): Promise<void> {
    // Validate delete mode
    if (
      !Object.values(DeleteMode).includes(
        requestDto.deleteMode || DeleteMode.SOFT_DELETE,
      )
    ) {
      throw new BadRequestException(
        `Invalid delete mode: ${requestDto.deleteMode}`,
      );
    }

    // Check if task is already deleted (for soft deletes)
    if (currentTask.status === 'deleted' || currentTask.status === 'archived') {
      throw new ConflictException('Task is already deleted or archived');
    }

    // Check if task is in a final state and hard delete is attempted
    if (
      requestDto.deleteMode === DeleteMode.HARD_DELETE &&
      (currentTask.status === 'done' || currentTask.status === 'completed')
    ) {
      if (!requestDto.forceDelete) {
        throw new BadRequestException(
          'Cannot hard delete completed tasks without force flag',
        );
      }
    }

    // Validate user permissions (simplified check)
    if (!requestDto.deletedBy) {
      throw new BadRequestException('deletedBy is required');
    }
  }

  private async getTaskMetadata(
    currentTask: TaskHistory,
  ): Promise<TaskDeletionMetadata> {
    const taskData = currentTask.context?.taskData || {};
    const assignmentData = currentTask.context?.assignmentData || {};

    return {
      deletionMode: DeleteMode.SOFT_DELETE, // Will be overridden
      taskTitle: currentTask.taskTitle,
      taskKey: currentTask.taskKey,
      originalStatus: currentTask.status,
      originalColumn: currentTask.toColumn || 'Unknown',
      assignee: assignmentData.assignee,
      watchers: assignmentData.watchers || [],
      relatedTasks: await this.getRelatedTasks(currentTask.taskId),
      attachmentsDeleted: 0, // Will be calculated during deletion
      commentsDeleted: 0, // Will be calculated during deletion
      historyEntriesArchived: 0, // Will be calculated during deletion
      deletedBy: '', // Will be set from request
      deletedAt: new Date(),
      deleteReason: undefined,
    };
  }

  private async checkTaskDependencies(taskId: string): Promise<void> {
    // Check for blocking dependencies
    const dependentTasks = await this.getTasksBlockedByThisTask(taskId);

    if (dependentTasks.length > 0) {
      throw new ConflictException(
        `Cannot delete task: ${dependentTasks.length} tasks depend on this task. Use forceDelete=true to override.`,
      );
    }

    // Check for linked tasks
    const linkedTasks = await this.getLinkedTasks(taskId);
    if (linkedTasks.length > 0) {
      // This is just a warning, not blocking
      console.warn(`Task ${taskId} has ${linkedTasks.length} linked tasks`);
    }
  }

  private async performDeletion(
    currentTask: TaskHistory,
    requestDto: DeleteTaskRequestDto,
    metadata: TaskDeletionMetadata,
  ): Promise<{
    attachmentsDeleted: number;
    commentsDeleted: number;
    historyEntriesArchived: number;
  }> {
    let attachmentsDeleted = 0;
    let commentsDeleted = 0;
    let historyEntriesArchived = 0;

    switch (requestDto.deleteMode) {
      case DeleteMode.SOFT_DELETE:
        // Mark task as deleted but keep all data
        historyEntriesArchived = await this.softDeleteTask(currentTask.taskId);
        break;

      case DeleteMode.HARD_DELETE:
        // Permanently delete task and related data
        if (requestDto.deleteRelatedData) {
          attachmentsDeleted = await this.deleteTaskAttachments(
            currentTask.taskId,
          );
          commentsDeleted = await this.deleteTaskComments(currentTask.taskId);
        }
        historyEntriesArchived = await this.hardDeleteTask(currentTask.taskId);
        break;

      case DeleteMode.ARCHIVE:
        // Archive task and related data
        historyEntriesArchived = await this.archiveTask(currentTask.taskId);
        break;
    }

    return {
      attachmentsDeleted,
      commentsDeleted,
      historyEntriesArchived,
    };
  }

  private async softDeleteTask(taskId: string): Promise<number> {
    // Count entries that will be marked as deleted
    const count = await this.taskHistoryRepository.count({
      where: { taskId },
    });

    // In a real implementation, you would update entries to mark them as deleted
    // For now, we just return the count
    return count;
  }

  private async hardDeleteTask(taskId: string): Promise<number> {
    // Count entries before deletion
    const count = await this.taskHistoryRepository.count({
      where: { taskId },
    });

    // In a real implementation, you would actually delete the entries
    // For now, we just return the count
    return count;
  }

  private async archiveTask(taskId: string): Promise<number> {
    // Count entries that will be archived
    const count = await this.taskHistoryRepository.count({
      where: { taskId },
    });

    // In a real implementation, you would move entries to archive
    // For now, we just return the count
    return count;
  }

  private async deleteTaskAttachments(taskId: string): Promise<number> {
    // Simulate attachment deletion
    // In a real implementation, this would delete files and database records
    const attachmentCount = Math.floor(Math.random() * 5); // Random for simulation
    return attachmentCount;
  }

  private async deleteTaskComments(taskId: string): Promise<number> {
    // Simulate comment deletion
    // In a real implementation, this would delete comment records
    const commentCount = Math.floor(Math.random() * 10); // Random for simulation
    return commentCount;
  }

  private async getRelatedTasks(taskId: string): Promise<string[]> {
    // Get tasks that are linked to this task
    const relatedTaskLogs = await this.taskHistoryRepository.find({
      where: {
        action: 'task_linked',
      },
    });

    return relatedTaskLogs
      .filter(
        (log) =>
          log.context?.linkData?.sourceTaskId === taskId ||
          log.context?.linkData?.targetTaskId === taskId,
      )
      .map((log) =>
        log.context?.linkData?.sourceTaskId === taskId
          ? log.context?.linkData?.targetTaskId
          : log.context?.linkData?.sourceTaskId,
      )
      .filter((id) => id && id !== taskId);
  }

  private async getTasksBlockedByThisTask(taskId: string): Promise<string[]> {
    // Get tasks that are blocked by this task
    const blockingLogs = await this.taskHistoryRepository.find({
      where: {
        action: 'task_linked',
      },
    });

    return blockingLogs
      .filter(
        (log) =>
          log.context?.linkData?.sourceTaskId === taskId &&
          log.context?.linkData?.linkType === 'blocks',
      )
      .map((log) => log.context?.linkData?.targetTaskId)
      .filter((id) => id);
  }

  private async getLinkedTasks(taskId: string): Promise<string[]> {
    // Get all linked tasks (not blocking)
    return await this.getRelatedTasks(taskId);
  }

  private async notifyUsersAboutDeletion(
    metadata: TaskDeletionMetadata,
  ): Promise<string[]> {
    const usersToNotify = new Set<string>();

    if (metadata.assignee) {
      usersToNotify.add(metadata.assignee);
    }

    metadata.watchers.forEach((watcher) => usersToNotify.add(watcher));

    // In a real implementation, you would send actual notifications
    return Array.from(usersToNotify);
  }

  private async createDeletionHistoryLog(
    currentTask: TaskHistory,
    requestDto: DeleteTaskRequestDto,
    metadata: TaskDeletionMetadata,
  ): Promise<TaskHistory> {
    const historyLog = this.taskHistoryRepository.create({
      agentId: 'system',
      taskId: currentTask.taskId,
      taskKey: currentTask.taskKey,
      taskTitle: currentTask.taskTitle,
      action: 'task_deleted',
      fromStatus: currentTask.status,
      toStatus:
        requestDto.deleteMode === DeleteMode.ARCHIVE ? 'archived' : 'deleted',
      fromColumn: currentTask.toColumn,
      toColumn: 'Deleted',
      status: 'completed',
      context: {
        deletionType: 'task_deletion',
        deleteMode: requestDto.deleteMode,
        deleteReason: requestDto.deleteReason,
        forceDelete: requestDto.forceDelete,
        deleteRelatedData: requestDto.deleteRelatedData,
        taskMetadata: metadata,
      },
      agentResponse: {
        success: true,
        taskDeleted: true,
        deleteMode: requestDto.deleteMode,
        timestamp: new Date().toISOString(),
      },
    });

    return await this.taskHistoryRepository.save(historyLog);
  }

  private calculateRestorationDeadline(
    deleteMode?: DeleteMode,
  ): Date | undefined {
    if (deleteMode === DeleteMode.HARD_DELETE) {
      return undefined; // Cannot be restored
    }

    // Soft deletes and archives can be restored within 30 days
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 30);
    return deadline;
  }
}
