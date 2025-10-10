import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistory } from '../../../../entities/task-history.entity';
import { DeleteTaskLinkRequestDto } from './delete-task-link.request.dto';
import { DeleteTaskLinkResponseDto } from './delete-task-link.response.dto';

@Injectable()
export class DeleteTaskLinkService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(
    taskId: string,
    linkId: string,
    requestDto: DeleteTaskLinkRequestDto,
  ): Promise<DeleteTaskLinkResponseDto> {
    // Find the task's link records in history
    const taskLinkRecord = await this.getTaskLinkRecord(taskId, linkId);

    if (!taskLinkRecord) {
      throw new NotFoundException(
        `Link with ID ${linkId} not found on task ${taskId}`,
      );
    }

    // Extract link information from the history record
    const linkInfo = this.extractLinkInfo(taskLinkRecord);

    // Get linked task information
    const linkedTaskInfo = await this.getLinkedTaskInfo(linkInfo.linkedTaskId);

    // Validate permissions (if user specified)
    if (requestDto.deletedBy) {
      await this.validateDeletePermissions(
        taskLinkRecord,
        requestDto.deletedBy,
      );
    }

    // Create deletion history entry
    const historyEntry = await this.createDeletionHistoryLog(
      taskId,
      linkInfo,
      linkedTaskInfo,
      requestDto,
    );

    // Count remaining links for this task
    const remainingLinksCount = await this.countRemainingLinks(taskId, linkId);

    return {
      taskId,
      linkId,
      linkedTaskId: linkInfo.linkedTaskId,
      linkType: linkInfo.linkType,
      linkDirection: linkInfo.linkDirection,
      deletedBy: requestDto.deletedBy,
      deletedAt: historyEntry.createdAt,
      deleteReason: requestDto.deleteReason,
      linkedTaskTitle: linkedTaskInfo.title,
      remainingLinksCount,
      success: true,
      historyLogId: historyEntry.id,
    };
  }

  private async getTaskLinkRecord(
    taskId: string,
    linkId: string,
  ): Promise<TaskHistory | null> {
    return await this.taskHistoryRepository.findOne({
      where: {
        taskId,
        action: 'LINK_CREATED',
        context: {
          linkId,
        } as any,
      },
      order: { createdAt: 'DESC' },
    });
  }

  private extractLinkInfo(taskLinkRecord: TaskHistory): any {
    const context = taskLinkRecord.context || {};
    return {
      linkedTaskId: context.linkedTaskId || 'unknown',
      linkType: context.linkType || 'unknown',
      linkDirection: context.linkDirection || 'outbound',
    };
  }

  private async getLinkedTaskInfo(
    linkedTaskId: string,
  ): Promise<{ title: string }> {
    const linkedTaskRecord = await this.taskHistoryRepository.findOne({
      where: {
        taskId: linkedTaskId,
        action: 'created',
      },
      order: { createdAt: 'DESC' },
    });

    return {
      title: linkedTaskRecord?.taskTitle || 'Unknown Task',
    };
  }

  private async validateDeletePermissions(
    taskLinkRecord: TaskHistory,
    deletedBy: string,
  ): Promise<void> {
    // Check if user has permission to modify task links
    const canModifyLinks = await this.checkTaskLinkPermissions(
      taskLinkRecord,
      deletedBy,
    );

    if (!canModifyLinks) {
      throw new ForbiddenException(
        'Insufficient permissions to delete task links',
      );
    }
  }

  private async checkTaskLinkPermissions(
    taskLinkRecord: TaskHistory,
    userId: string,
  ): Promise<boolean> {
    // Check if user is task creator or has modify permissions
    if (taskLinkRecord.agentId === userId) {
      return true;
    }

    // For demonstration purposes, allow all users to modify links
    // In a real system, this would check project-level permissions
    return true;
  }

  private async createDeletionHistoryLog(
    taskId: string,
    linkInfo: any,
    linkedTaskInfo: any,
    requestDto: DeleteTaskLinkRequestDto,
  ): Promise<TaskHistory> {
    const historyEntry = this.taskHistoryRepository.create({
      agentId: requestDto.deletedBy || 'system',
      taskId,
      taskKey: `TASK-${taskId.slice(-8)}`,
      taskTitle: 'Task Link Deletion',
      action: 'LINK_DELETED',
      context: {
        operation: 'delete_task_link',
        deletedLink: {
          linkId: linkInfo.linkId,
          linkedTaskId: linkInfo.linkedTaskId,
          linkedTaskTitle: linkedTaskInfo.title,
          linkType: linkInfo.linkType,
          linkDirection: linkInfo.linkDirection,
          deleteReason: requestDto.deleteReason,
        },
      },
      status: 'completed',
    });

    return await this.taskHistoryRepository.save(historyEntry);
  }

  private async countRemainingLinks(
    taskId: string,
    excludeLinkId: string,
  ): Promise<number> {
    const linkRecords = await this.taskHistoryRepository.find({
      where: {
        taskId,
        action: 'LINK_CREATED',
      },
    });

    // Filter out the deleted link and count remaining
    const remainingLinks = linkRecords.filter((record) => {
      const context = record.context || {};
      return context.linkId !== excludeLinkId;
    });

    return remainingLinks.length;
  }
}
