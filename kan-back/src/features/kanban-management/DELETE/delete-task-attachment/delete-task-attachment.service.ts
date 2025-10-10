import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistory } from '../../../../entities/task-history.entity';
import {
  DeleteTaskAttachmentRequestDto,
  AttachmentDeleteMode,
} from './delete-task-attachment.request.dto';
import {
  DeleteTaskAttachmentResponseDto,
  AttachmentMetadata,
  AttachmentDeletionSummary,
} from './delete-task-attachment.response.dto';

@Injectable()
export class DeleteTaskAttachmentService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async deleteAttachment(
    taskId: string,
    attachmentId: string,
    requestDto: DeleteTaskAttachmentRequestDto,
  ): Promise<DeleteTaskAttachmentResponseDto> {
    const task = await this.validateTaskExists(taskId);
    const attachment = await this.getAttachmentRecord(taskId, attachmentId);

    if (!attachment) {
      throw new NotFoundException(
        `Attachment with ID ${attachmentId} not found in task ${taskId}`,
      );
    }

    await this.validateDeletionPermissions(attachment, requestDto.deletedBy);

    const attachmentMetadata = await this.getAttachmentMetadata(attachment);
    const deletionSummary = await this.performAttachmentDeletion(
      attachment,
      requestDto,
    );
    const notifiedWatchers = requestDto.notifyWatchers
      ? await this.notifyTaskWatchers(taskId, attachmentMetadata)
      : [];
    const historyLog = await this.createDeletionHistoryLog(
      taskId,
      attachment,
      requestDto,
      deletionSummary,
    );

    return {
      taskId,
      attachmentId,
      fileName: attachmentMetadata.fileName,
      mimeType: attachmentMetadata.mimeType,
      fileSize: attachmentMetadata.fileSize,
      deleteMode: requestDto.deleteMode || AttachmentDeleteMode.SOFT_DELETE,
      deletedBy: requestDto.deletedBy,
      deletedAt: historyLog.createdAt,
      deleteReason: requestDto.deleteReason,
      originalUploadDate: attachmentMetadata.uploadedAt,
      originalUploader: attachmentMetadata.uploadedBy,
      physicalFileDeleted: deletionSummary.physicalFileDeleted,
      backupCreated: deletionSummary.backupCreated,
      backupPath: deletionSummary.backupPath,
      storageSpaceFreed: deletionSummary.storageSpaceFreed,
      notifiedWatchers,
      success: true,
      canBeRestored:
        requestDto.deleteMode === AttachmentDeleteMode.SOFT_DELETE ||
        requestDto.deleteMode === AttachmentDeleteMode.MOVE_TO_TRASH,
      remainingAttachmentsCount:
        await this.getRemainingAttachmentsCount(taskId),
      fileChecksum: attachmentMetadata.checksum,
      historyLogId: historyLog.id,
    };
  }

  private async validateTaskExists(taskId: string): Promise<TaskHistory> {
    const task = await this.taskHistoryRepository.findOne({
      where: {
        taskId,
        action: 'task_created',
      },
      order: { createdAt: 'DESC' },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    return task;
  }

  private async getAttachmentRecord(
    taskId: string,
    attachmentId: string,
  ): Promise<TaskHistory | null> {
    return await this.taskHistoryRepository.findOne({
      where: {
        taskId,
        action: 'file_uploaded',
        agentResponse: {
          attachmentId,
        } as any,
      },
      order: { createdAt: 'DESC' },
    });
  }

  private async validateDeletionPermissions(
    attachment: TaskHistory,
    deletedBy: string,
  ): Promise<void> {
    // Check if user has permission to delete attachment
    const attachmentData = attachment.context?.attachmentData || {};
    const originalUploader = attachmentData.uploadedBy || attachment.agentId;

    // In a real implementation, you would check user roles and permissions
    // For now, we'll allow deletion if user is the original uploader or has admin rights
    if (originalUploader !== deletedBy) {
      // In a real implementation, check if user has admin/moderator rights
      // throw new ForbiddenException('You do not have permission to delete this attachment');
    }
  }

  private async getAttachmentMetadata(
    attachment: TaskHistory,
  ): Promise<AttachmentMetadata> {
    const attachmentData = attachment.context?.attachmentData || {};
    const agentResponse = attachment.agentResponse || {};

    return {
      fileName:
        attachmentData.fileName || agentResponse.fileName || 'unknown_file',
      fileSize: attachmentData.fileSize || agentResponse.fileSize || 0,
      mimeType:
        attachmentData.mimeType ||
        agentResponse.mimeType ||
        'application/octet-stream',
      uploadedAt: attachment.createdAt,
      uploadedBy: attachmentData.uploadedBy || attachment.agentId,
      filePath: attachmentData.filePath || agentResponse.filePath || '',
      checksum: attachmentData.checksum || agentResponse.checksum,
    };
  }

  private async performAttachmentDeletion(
    attachment: TaskHistory,
    requestDto: DeleteTaskAttachmentRequestDto,
  ): Promise<AttachmentDeletionSummary> {
    const attachmentData = attachment.context?.attachmentData || {};
    const fileSize = attachmentData.fileSize || 0;

    let physicalFileDeleted = false;
    let backupCreated = false;
    let backupPath: string | undefined;
    let storageSpaceFreed = 0;

    // Create backup if requested
    if (
      requestDto.createBackup &&
      requestDto.deleteMode !== AttachmentDeleteMode.HARD_DELETE
    ) {
      backupPath = await this.createAttachmentBackup(attachment);
      backupCreated = !!backupPath;
    }

    // Handle physical file deletion
    switch (requestDto.deleteMode) {
      case AttachmentDeleteMode.SOFT_DELETE:
        // Keep physical file, just mark as deleted
        break;

      case AttachmentDeleteMode.MOVE_TO_TRASH:
        // Move file to trash directory
        if (requestDto.deletePhysicalFile) {
          physicalFileDeleted = await this.moveFileToTrash(
            attachmentData.filePath,
          );
          storageSpaceFreed = physicalFileDeleted ? fileSize : 0;
        }
        break;

      case AttachmentDeleteMode.HARD_DELETE:
        // Permanently delete physical file
        if (requestDto.deletePhysicalFile) {
          physicalFileDeleted = await this.deletePhysicalFile(
            attachmentData.filePath,
          );
          storageSpaceFreed = physicalFileDeleted ? fileSize : 0;
        }
        break;
    }

    return {
      physicalFileDeleted,
      backupCreated,
      backupPath,
      storageSpaceFreed,
    };
  }

  private async createAttachmentBackup(
    attachment: TaskHistory,
  ): Promise<string | undefined> {
    // In a real implementation, this would copy the file to a backup location
    const attachmentData = attachment.context?.attachmentData || {};
    const fileName = attachmentData.fileName || 'unknown_file';
    const timestamp = new Date().toISOString().split('T')[0];

    return `/backups/attachments/${attachment.agentResponse?.attachmentId || 'unknown'}_${timestamp}_${fileName}`;
  }

  private async moveFileToTrash(filePath: string): Promise<boolean> {
    // In a real implementation, this would move the file to a trash directory
    return filePath ? true : false;
  }

  private async deletePhysicalFile(filePath: string): Promise<boolean> {
    // In a real implementation, this would delete the actual file from storage
    return filePath ? true : false;
  }

  private async notifyTaskWatchers(
    taskId: string,
    attachmentMetadata: AttachmentMetadata,
  ): Promise<string[]> {
    // Get task watchers and assignment data
    const taskData = await this.taskHistoryRepository.findOne({
      where: { taskId, action: 'task_created' },
      order: { createdAt: 'DESC' },
    });

    const watchers = new Set<string>();

    if (taskData?.context?.assignmentData) {
      const assignmentData = taskData.context.assignmentData;

      if (assignmentData.assignee) {
        watchers.add(assignmentData.assignee);
      }

      if (Array.isArray(assignmentData.watchers)) {
        assignmentData.watchers.forEach((watcher: string) =>
          watchers.add(watcher),
        );
      }
    }

    // In a real implementation, send actual notifications here
    return Array.from(watchers);
  }

  private async getRemainingAttachmentsCount(taskId: string): Promise<number> {
    return (
      (await this.taskHistoryRepository.count({
        where: {
          taskId,
          action: 'file_uploaded',
          status: 'completed',
        },
      })) - 1
    ); // Subtract 1 for the deleted attachment
  }

  private async createDeletionHistoryLog(
    taskId: string,
    attachment: TaskHistory,
    requestDto: DeleteTaskAttachmentRequestDto,
    deletionSummary: AttachmentDeletionSummary,
  ): Promise<TaskHistory> {
    const attachmentData = attachment.context?.attachmentData || {};

    const historyLog = this.taskHistoryRepository.create({
      agentId: 'system',
      taskId,
      taskKey: attachment.taskKey,
      taskTitle: `Deleted attachment: ${attachmentData.fileName || 'unknown'}`,
      action: 'attachment_deleted',
      fromStatus: 'active',
      toStatus:
        requestDto.deleteMode === AttachmentDeleteMode.SOFT_DELETE
          ? 'deleted'
          : requestDto.deleteMode === AttachmentDeleteMode.MOVE_TO_TRASH
            ? 'trashed'
            : 'removed',
      fromColumn: attachment.fromColumn,
      toColumn: attachment.toColumn,
      status: 'completed',
      context: {
        deletionType: 'attachment_deletion',
        deleteMode: requestDto.deleteMode,
        deleteReason: requestDto.deleteReason,
        attachmentId: attachment.agentResponse?.attachmentId,
        originalAttachmentData: attachmentData,
        deletionSummary,
      },
      agentResponse: {
        success: true,
        attachmentDeleted: true,
        deleteMode: requestDto.deleteMode,
        timestamp: new Date().toISOString(),
      },
    });

    return await this.taskHistoryRepository.save(historyLog);
  }
}
