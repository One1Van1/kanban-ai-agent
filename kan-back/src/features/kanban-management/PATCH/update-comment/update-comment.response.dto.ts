import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCommentResponseDto {
  @ApiProperty({
    description: 'UUID of the updated comment',
    example: 'comment-123e4567-e89b-12d3-a456-426614174000',
  })
  commentId: string;

  @ApiProperty({
    description: 'UUID of the task containing the comment',
    example: 'task-456e7890-e89b-12d3-a456-426614174000',
  })
  taskId: string;

  @ApiProperty({
    description: 'Updated comment content',
    example:
      'Updated: This is the corrected analysis of the issue. The problem was in the validation logic.',
  })
  content: string;

  @ApiProperty({
    description: 'Original comment content before update',
    example: 'This is the analysis of the issue.',
  })
  originalContent: string;

  @ApiProperty({
    description: 'UUID of the user who originally created the comment',
    example: 'user-789e4567-e89b-12d3-a456-426614174000',
  })
  originalAuthor: string;

  @ApiPropertyOptional({
    description: 'UUID of the user who updated the comment',
    example: 'user-123e4567-e89b-12d3-a456-426614174000',
  })
  updatedBy?: string;

  @ApiProperty({
    description: 'Timestamp when comment was originally created',
    example: '2024-01-10T08:15:00.000Z',
  })
  originalCreatedAt: Date;

  @ApiProperty({
    description: 'Timestamp when comment was updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Reason for updating the comment',
    example: 'Fixed typo and added clarification',
  })
  updateReason?: string;

  @ApiProperty({
    description:
      'Whether the comment was edited (true if updated after creation)',
    example: true,
  })
  isEdited: boolean;

  @ApiProperty({
    description: 'Number of times this comment has been edited',
    example: 2,
  })
  editCount: number;

  @ApiProperty({
    description: 'Character count of updated content',
    example: 97,
  })
  contentLength: number;

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
