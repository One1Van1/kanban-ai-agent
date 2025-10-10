import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DeleteTaskLinkResponseDto {
  @ApiProperty({
    description: 'UUID of the task containing the link',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  taskId: string;

  @ApiProperty({
    description: 'UUID of the deleted link',
    example: 'link-456e7890-e89b-12d3-a456-426614174000',
  })
  linkId: string;

  @ApiProperty({
    description: 'UUID of the linked task that was disconnected',
    example: '789e1234-e89b-12d3-a456-426614174000',
  })
  linkedTaskId: string;

  @ApiProperty({
    description: 'Type of link that was deleted',
    example: 'blocks',
  })
  linkType: string;

  @ApiProperty({
    description: 'Direction of the link (outbound/inbound)',
    example: 'outbound',
  })
  linkDirection: string;

  @ApiPropertyOptional({
    description: 'User who deleted the link',
    example: 'user-123e4567-e89b-12d3-a456-426614174000',
  })
  deletedBy?: string;

  @ApiProperty({
    description: 'Timestamp when link was deleted',
    example: '2024-01-15T10:30:00.000Z',
  })
  deletedAt: Date;

  @ApiPropertyOptional({
    description: 'Reason for deleting the link',
    example: 'Link is no longer relevant after task completion',
  })
  deleteReason?: string;

  @ApiProperty({
    description: 'Title of the task that was unlinked',
    example: 'Setup database configuration',
  })
  linkedTaskTitle: string;

  @ApiProperty({
    description: 'Number of remaining links on the task',
    example: 3,
  })
  remainingLinksCount: number;

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
