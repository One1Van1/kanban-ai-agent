import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommentDeleteMode } from './delete-comment.request.dto';

export class DeleteCommentResponseDto {
  @ApiProperty({
    description: 'UUID of the deleted comment',
    example: 'comment-123e4567-e89b-12d3-a456-426614174000',
  })
  commentId: string;

  @ApiProperty({
    description: 'UUID of the task containing the comment',
    example: 'task-456e7890-e89b-12d3-a456-426614174000',
  })
  taskId: string;

  @ApiProperty({
    description: 'Content of the deleted comment',
    example: 'This comment has been deleted',
  })
  content: string;

  @ApiProperty({
    description: 'Deletion mode used',
    enum: CommentDeleteMode,
    enumName: 'CommentDeleteMode',
    example: CommentDeleteMode.SOFT_DELETE,
  })
  deleteMode: CommentDeleteMode;

  @ApiProperty({
    description: 'UUID of the user who originally created the comment',
    example: 'user-789e4567-e89b-12d3-a456-426614174000',
  })
  originalAuthor: string;

  @ApiPropertyOptional({
    description: 'UUID of the user who deleted the comment',
    example: 'user-123e4567-e89b-12d3-a456-426614174000',
  })
  deletedBy?: string;

  @ApiProperty({
    description: 'Timestamp when comment was originally created',
    example: '2024-01-10T08:15:00.000Z',
  })
  originalCreatedAt: Date;

  @ApiProperty({
    description: 'Timestamp when comment was deleted',
    example: '2024-01-15T10:30:00.000Z',
  })
  deletedAt: Date;

  @ApiPropertyOptional({
    description: 'Reason for deleting the comment',
    example: 'Comment violates community guidelines',
  })
  deleteReason?: string;

  @ApiProperty({
    description: 'Whether the comment can be restored',
    example: true,
  })
  canBeRestored: boolean;

  @ApiProperty({
    description: 'Number of remaining comments on the task',
    example: 5,
  })
  remainingCommentsCount: number;

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
}
