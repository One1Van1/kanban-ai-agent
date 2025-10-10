import { ApiProperty } from '@nestjs/swagger';
import { DeleteMode } from './delete-task.request.dto';

export interface TaskDeletionMetadata {
  deletionMode: DeleteMode;
  taskTitle: string;
  taskKey: string;
  originalStatus: string;
  originalColumn: string;
  assignee?: string;
  watchers: string[];
  relatedTasks: string[];
  attachmentsDeleted: number;
  commentsDeleted: number;
  historyEntriesArchived: number;
  deletedBy: string;
  deletedAt: Date;
  deleteReason?: string;
}

export class DeleteTaskResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the deleted task',
    example: 'a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a',
  })
  taskId: string;

  @ApiProperty({
    description: 'Task key that was deleted',
    example: 'TASK-123',
  })
  taskKey: string;

  @ApiProperty({
    description: 'Title of the deleted task',
    example: 'Implement user authentication',
  })
  taskTitle: string;

  @ApiProperty({
    enum: DeleteMode,
    enumName: 'DeleteMode',
    example: DeleteMode.SOFT_DELETE,
    description: 'Type of deletion that was performed',
  })
  deleteMode: DeleteMode;

  @ApiProperty({
    description: 'User who performed the deletion',
    example: 'agent-001',
  })
  deletedBy: string;

  @ApiProperty({
    description: 'Timestamp when task was deleted',
    example: '2024-01-15T10:30:00Z',
  })
  deletedAt: Date;

  @ApiProperty({
    description: 'Reason for deleting the task',
    example: 'Task is no longer relevant due to requirement changes',
    required: false,
  })
  deleteReason?: string;

  @ApiProperty({
    description: 'Task status before deletion',
    example: 'in_progress',
  })
  originalStatus: string;

  @ApiProperty({
    description: 'Column where task was located before deletion',
    example: 'In Progress',
  })
  originalColumn: string;

  @ApiProperty({
    description: 'Assignee of the deleted task',
    example: 'agent-002',
    required: false,
  })
  assignee?: string;

  @ApiProperty({
    description: 'List of users who were watching the task',
    example: ['agent-003', 'agent-004'],
    type: [String],
  })
  watchers: string[];

  @ApiProperty({
    description: 'List of related tasks that were affected',
    example: ['task-456', 'task-789'],
    type: [String],
  })
  relatedTasks: string[];

  @ApiProperty({
    description: 'Number of attachments that were deleted',
    example: 3,
  })
  attachmentsDeleted: number;

  @ApiProperty({
    description: 'Number of comments that were deleted',
    example: 7,
  })
  commentsDeleted: number;

  @ApiProperty({
    description: 'Number of history entries that were archived',
    example: 15,
  })
  historyEntriesArchived: number;

  @ApiProperty({
    description: 'List of users who were notified about the deletion',
    example: ['agent-002', 'agent-003', 'agent-004'],
    type: [String],
  })
  notifiedUsers: string[];

  @ApiProperty({
    description: 'Whether deletion was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Whether task can be restored (for soft deletes)',
    example: true,
  })
  canBeRestored: boolean;

  @ApiProperty({
    description: 'Restoration deadline for soft-deleted tasks',
    example: '2024-02-15T10:30:00Z',
    required: false,
  })
  restorationDeadline?: Date;

  @ApiProperty({
    description: 'History log ID for this deletion',
    example: 'b9f6f267-bb90-5f37-b3c2-3c6e5c0c3d9b',
  })
  historyLogId: string;
}
