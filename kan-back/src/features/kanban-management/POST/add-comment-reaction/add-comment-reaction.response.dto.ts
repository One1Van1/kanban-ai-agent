import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReactionType } from './add-comment-reaction.request.dto';

export class AddCommentReactionResponseDto {
  @ApiProperty({
    description: 'UUID of the comment that received the reaction',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  commentId: string;

  @ApiProperty({
    description: 'UUID of the created reaction',
    example: 'reaction-456e7890-e89b-12d3-a456-426614174000',
  })
  reactionId: string;

  @ApiProperty({
    enum: ReactionType,
    enumName: 'ReactionType',
    description: 'Type of reaction that was added',
    example: ReactionType.LIKE,
  })
  reactionType: ReactionType;

  @ApiProperty({
    description: 'UUID of the user who added the reaction',
    example: 'user-123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Display name of the user who reacted',
    example: 'John Doe',
  })
  userName: string;

  @ApiPropertyOptional({
    description: 'Custom emoji if provided',
    example: '🚀',
  })
  customEmoji?: string;

  @ApiPropertyOptional({
    description: 'Note attached to the reaction',
    example: 'Great point!',
  })
  reactionNote?: string;

  @ApiProperty({
    description: 'Timestamp when the reaction was added',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Total count of reactions on this comment',
    example: 5,
  })
  totalReactions: number;

  @ApiProperty({
    description: 'Count of this specific reaction type on the comment',
    example: 3,
  })
  reactionTypeCount: number;

  @ApiProperty({
    description: 'Whether the operation was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'History log entry ID for audit trail',
    example: 'hist-789e4567-e89b-12d3-a456-426614174000',
  })
  historyLogId: string;

  @ApiProperty({
    description: 'Emoji representation of the reaction',
    example: '👍',
  })
  emojiDisplay: string;
}
