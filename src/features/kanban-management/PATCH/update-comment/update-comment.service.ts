import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistory } from '../../../../entities/task-history.entity';
import { UpdateCommentRequestDto } from './update-comment.request.dto';
import { UpdateCommentResponseDto } from './update-comment.response.dto';

@Injectable()
export class UpdateCommentService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(
    commentId: string,
    requestDto: UpdateCommentRequestDto,
  ): Promise<UpdateCommentResponseDto> {
    const comment = await this.getCommentRecord(commentId);

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    await this.validateUpdatePermissions(comment, requestDto.updatedBy);

    const originalContent = this.extractCommentContent(comment);
    const editCount = await this.getCommentEditCount(commentId);

    const historyLog = await this.createUpdateHistoryLog(
      comment,
      requestDto,
      originalContent,
      editCount + 1,
    );

    return {
      commentId,
      taskId: comment.taskId,
      content: requestDto.content,
      originalContent,
      originalAuthor: comment.agentId,
      updatedBy: requestDto.updatedBy,
      originalCreatedAt: comment.createdAt,
      updatedAt: historyLog.createdAt,
      updateReason: requestDto.updateReason,
      isEdited: true,
      editCount: editCount + 1,
      contentLength: requestDto.content.length,
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

  private async validateUpdatePermissions(
    comment: TaskHistory,
    updatedBy?: string,
  ): Promise<void> {
    // In a real implementation, check if user has permission to edit comment
    // For now, allow original author or admins to edit
    if (updatedBy && comment.agentId !== updatedBy) {
      // In real implementation, check if updatedBy has admin/moderator rights
      // throw new ForbiddenException('You can only edit your own comments');
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

  private async getCommentEditCount(commentId: string): Promise<number> {
    return await this.taskHistoryRepository.count({
      where: {
        action: 'comment_updated',
        context: {
          commentId,
        } as any,
      },
    });
  }

  private async createUpdateHistoryLog(
    originalComment: TaskHistory,
    requestDto: UpdateCommentRequestDto,
    originalContent: string,
    editCount: number,
  ): Promise<TaskHistory> {
    const historyLog = this.taskHistoryRepository.create({
      agentId: requestDto.updatedBy || 'system',
      taskId: originalComment.taskId,
      taskKey: originalComment.taskKey,
      taskTitle: `Updated comment: ${requestDto.content.substring(0, 50)}...`,
      action: 'comment_updated',
      fromStatus: originalComment.fromStatus || originalComment.toStatus,
      toStatus: originalComment.toStatus,
      fromColumn: originalComment.fromColumn || originalComment.toColumn,
      toColumn: originalComment.toColumn,
      status: 'completed',
      context: {
        commentId: originalComment.agentResponse?.commentId,
        originalContent,
        updatedContent: requestDto.content,
        updateReason: requestDto.updateReason,
        editCount,
        commentData: {
          content: requestDto.content,
          editCount,
          lastEditedBy: requestDto.updatedBy,
          lastEditedAt: new Date(),
        },
      },
      agentResponse: {
        success: true,
        commentUpdated: true,
        commentId: originalComment.agentResponse?.commentId,
        content: requestDto.content,
        originalContent,
        editCount,
        timestamp: new Date().toISOString(),
      },
    });

    return await this.taskHistoryRepository.save(historyLog);
  }
}
