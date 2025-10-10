import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  DeleteCommentRequestDto,
  CommentDeleteMode,
} from './delete-comment.request.dto';
import { DeleteCommentResponseDto } from './delete-comment.response.dto';
import { TaskHistory } from '@/entities/task-history.entity';

@Injectable()
export class DeleteCommentService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(
    commentId: string,
    requestDto: DeleteCommentRequestDto,
  ): Promise<DeleteCommentResponseDto> {
    const comment = await this.getCommentRecord(commentId);

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    await this.validateDeletionPermissions(comment, requestDto.deletedBy);

    const commentContent = this.extractCommentContent(comment);
    const remainingCount = await this.getRemainingCommentsCount(
      comment.taskId,
      commentId,
    );

    const historyLog = await this.createDeletionHistoryLog(comment, requestDto);

    return {
      commentId,
      taskId: comment.taskId,
      content: commentContent,
      deleteMode: requestDto.deleteMode || CommentDeleteMode.SOFT_DELETE,
      originalAuthor: comment.agentId,
      deletedBy: requestDto.deletedBy,
      originalCreatedAt: comment.createdAt,
      deletedAt: historyLog.createdAt,
      deleteReason: requestDto.deleteReason,
      canBeRestored: requestDto.deleteMode === CommentDeleteMode.SOFT_DELETE,
      remainingCommentsCount: remainingCount,
      success: true,
      historyLogId: historyLog.id,
    };
  }

  private async getCommentRecord(
    commentId: string,
  ): Promise<TaskHistory | null> {
    return await this.taskHistoryRepository.findOne({
      where: {
        action: 'comment_added',
        agentResponse: {
          commentId,
        } as any,
      },
      order: { createdAt: 'DESC' },
    });
  }

  private async validateDeletionPermissions(
    comment: TaskHistory,
    deletedBy?: string,
  ): Promise<void> {
    // In a real implementation, check if user has permission to delete comment
    // For now, allow original author or admins to delete
    if (deletedBy && comment.agentId !== deletedBy) {
      // In real implementation, check if deletedBy has admin/moderator rights
      // throw new ForbiddenException('You can only delete your own comments');
    }
  }

  private extractCommentContent(comment: TaskHistory): string {
    return (
      comment.context?.commentData?.content ||
      comment.agentResponse?.content ||
      comment.taskTitle ||
      'No content available'
    );
  }

  private async getRemainingCommentsCount(
    taskId: string,
    excludeCommentId: string,
  ): Promise<number> {
    const totalComments = await this.taskHistoryRepository.count({
      where: {
        taskId,
        action: 'comment_added',
      },
    });

    return Math.max(0, totalComments - 1); // Subtract the deleted comment
  }

  private async createDeletionHistoryLog(
    originalComment: TaskHistory,
    requestDto: DeleteCommentRequestDto,
  ): Promise<TaskHistory> {
    const commentContent = this.extractCommentContent(originalComment);

    const historyLog = this.taskHistoryRepository.create({
      agentId: requestDto.deletedBy || 'system',
      taskId: originalComment.taskId,
      taskKey: originalComment.taskKey,
      taskTitle: `Deleted comment: ${commentContent.substring(0, 50)}...`,
      action: 'comment_deleted',
      fromStatus: originalComment.fromStatus || originalComment.toStatus,
      toStatus: originalComment.toStatus,
      fromColumn: originalComment.fromColumn || originalComment.toColumn,
      toColumn: originalComment.toColumn,
      status: 'completed',
      context: {
        commentId: originalComment.agentResponse?.commentId,
        deletedContent: commentContent,
        deleteMode: requestDto.deleteMode,
        deleteReason: requestDto.deleteReason,
        originalAuthor: originalComment.agentId,
        originalCreatedAt: originalComment.createdAt,
      },
      agentResponse: {
        success: true,
        commentDeleted: true,
        commentId: originalComment.agentResponse?.commentId,
        deleteMode: requestDto.deleteMode,
        canBeRestored: requestDto.deleteMode === CommentDeleteMode.SOFT_DELETE,
        timestamp: new Date().toISOString(),
      },
    });

    return await this.taskHistoryRepository.save(historyLog);
  }
}
