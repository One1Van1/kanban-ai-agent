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
  AddCommentReactionRequestDto,
  ReactionType,
} from './add-comment-reaction.request.dto';
import { AddCommentReactionResponseDto } from './add-comment-reaction.response.dto';

@Injectable()
export class AddCommentReactionService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(
    commentId: string,
    requestDto: AddCommentReactionRequestDto,
  ): Promise<AddCommentReactionResponseDto> {
    // Find the comment
    const commentRecord = await this.getCommentRecord(commentId);

    if (!commentRecord) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    // Check if user already reacted with this type
    const existingReaction = await this.findExistingReaction(
      commentId,
      requestDto.userId,
      requestDto.reactionType,
    );

    if (existingReaction) {
      throw new ConflictException(
        `User already has a ${requestDto.reactionType} reaction on this comment`,
      );
    }

    // Generate reaction ID
    const reactionId = `reaction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create reaction history entry
    const reactionEntry = await this.createReactionHistoryLog(
      commentId,
      reactionId,
      requestDto,
      commentRecord,
    );

    // Get user display name
    const userName = await this.getUserDisplayName(requestDto.userId);

    // Count reactions
    const { totalReactions, reactionTypeCount } = await this.countReactions(
      commentId,
      requestDto.reactionType,
    );

    // Get emoji display
    const emojiDisplay = this.getEmojiDisplay(
      requestDto.reactionType,
      requestDto.customEmoji,
    );

    return {
      commentId,
      reactionId,
      reactionType: requestDto.reactionType,
      userId: requestDto.userId,
      userName,
      customEmoji: requestDto.customEmoji,
      reactionNote: requestDto.reactionNote,
      createdAt: reactionEntry.createdAt,
      totalReactions: totalReactions + 1, // Include the new reaction
      reactionTypeCount: reactionTypeCount + 1, // Include the new reaction
      success: true,
      historyLogId: reactionEntry.id,
      emojiDisplay,
    };
  }

  private async getCommentRecord(
    commentId: string,
  ): Promise<TaskHistory | null> {
    return await this.taskHistoryRepository.findOne({
      where: {
        context: {
          commentId,
        } as any,
        action: 'COMMENT_ADDED',
      },
      order: { createdAt: 'DESC' },
    });
  }

  private async findExistingReaction(
    commentId: string,
    userId: string,
    reactionType: ReactionType,
  ): Promise<TaskHistory | null> {
    return await this.taskHistoryRepository.findOne({
      where: {
        agentId: userId,
        action: 'REACTION_ADDED',
        context: {
          commentId,
          reactionType,
        } as any,
      },
    });
  }

  private async createReactionHistoryLog(
    commentId: string,
    reactionId: string,
    requestDto: AddCommentReactionRequestDto,
    commentRecord: TaskHistory,
  ): Promise<TaskHistory> {
    const reactionEntry = this.taskHistoryRepository.create({
      agentId: requestDto.userId,
      taskId: commentRecord.taskId,
      taskKey: commentRecord.taskKey,
      taskTitle: `Reaction on Comment`,
      action: 'REACTION_ADDED',
      context: {
        operation: 'add_comment_reaction',
        commentId,
        reactionId,
        reactionType: requestDto.reactionType,
        customEmoji: requestDto.customEmoji,
        reactionNote: requestDto.reactionNote,
        originalCommentContent:
          commentRecord.context?.content?.substring(0, 100) || '',
      },
      status: 'completed',
    });

    return await this.taskHistoryRepository.save(reactionEntry);
  }

  private async getUserDisplayName(userId: string): Promise<string> {
    // In a real system, this would fetch from user service
    // For now, generate a display name from userId
    if (userId.startsWith('user-')) {
      return `User ${userId.slice(-8)}`;
    }
    return `User ${userId.substring(0, 8)}`;
  }

  private async countReactions(
    commentId: string,
    reactionType: ReactionType,
  ): Promise<{ totalReactions: number; reactionTypeCount: number }> {
    const allReactions = await this.taskHistoryRepository.find({
      where: {
        action: 'REACTION_ADDED',
        context: {
          commentId,
        } as any,
      },
    });

    const totalReactions = allReactions.length;
    const reactionTypeCount = allReactions.filter((reaction) => {
      const context = reaction.context || {};
      return context.reactionType === reactionType;
    }).length;

    return { totalReactions, reactionTypeCount };
  }

  private getEmojiDisplay(
    reactionType: ReactionType,
    customEmoji?: string,
  ): string {
    if (customEmoji) {
      return customEmoji;
    }

    const emojiMap: Record<ReactionType, string> = {
      [ReactionType.LIKE]: '👍',
      [ReactionType.DISLIKE]: '👎',
      [ReactionType.HEART]: '❤️',
      [ReactionType.LAUGH]: '😂',
      [ReactionType.SURPRISED]: '😮',
      [ReactionType.ANGRY]: '😠',
      [ReactionType.THUMBS_UP]: '👍',
      [ReactionType.THUMBS_DOWN]: '👎',
      [ReactionType.CELEBRATE]: '🎉',
      [ReactionType.CONFUSED]: '😕',
    };

    return emojiMap[reactionType] || '👍';
  }
}
