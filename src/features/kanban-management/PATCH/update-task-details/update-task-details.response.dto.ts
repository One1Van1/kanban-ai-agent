import { ApiProperty } from '@nestjs/swagger';
import {
  TaskPriority,
  TaskType,
  TaskCustomField,
} from './update-task-details.request.dto';

export interface TaskUpdateMetadata {
  fieldsUpdated: string[];
  previousValues: Record<string, any>;
  newValues: Record<string, any>;
  updateReason?: string;
  updatedBy: string;
  updatedAt: Date;
}

export class UpdateTaskDetailsResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the updated task',
    example: 'a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a',
  })
  taskId: string;

  @ApiProperty({
    description: 'Updated task title',
    example: 'Implement user authentication with OAuth2',
  })
  title: string;

  @ApiProperty({
    description: 'Updated task description',
    example:
      'Add OAuth2 integration for Google and GitHub authentication providers',
    required: false,
  })
  description?: string;

  @ApiProperty({
    enum: TaskPriority,
    enumName: 'TaskPriority',
    example: TaskPriority.HIGH,
    description: 'Updated task priority',
  })
  priority: TaskPriority;

  @ApiProperty({
    enum: TaskType,
    enumName: 'TaskType',
    example: TaskType.STORY,
    description: 'Updated task type',
  })
  type: TaskType;

  @ApiProperty({
    description: 'Updated assignee ID',
    example: 'agent-002',
    required: false,
  })
  assignee?: string;

  @ApiProperty({
    description: 'Updated reporter ID',
    example: 'agent-001',
    required: false,
  })
  reporter?: string;

  @ApiProperty({
    description: 'Updated task labels',
    example: ['frontend', 'authentication', 'security'],
    type: [String],
    required: false,
  })
  labels?: string[];

  @ApiProperty({
    description: 'Updated estimated hours',
    example: 8,
    required: false,
  })
  estimatedHours?: number;

  @ApiProperty({
    description: 'Updated story points',
    example: 5,
    required: false,
  })
  storyPoints?: number;

  @ApiProperty({
    description: 'Updated due date',
    example: '2024-01-20T23:59:59Z',
    required: false,
  })
  dueDate?: string;

  @ApiProperty({
    description: 'Updated custom fields',
    type: [TaskCustomField],
    required: false,
  })
  customFields?: TaskCustomField[];

  @ApiProperty({
    description: 'User who performed the update',
    example: 'agent-001',
  })
  updatedBy: string;

  @ApiProperty({
    description: 'Timestamp when task was updated',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'List of fields that were updated',
    example: ['priority', 'assignee', 'labels'],
    type: [String],
  })
  fieldsUpdated: string[];

  @ApiProperty({
    description: 'Previous values before update',
    example: {
      priority: 'medium',
      assignee: 'agent-001',
      labels: ['backend'],
    },
  })
  previousValues: Record<string, any>;

  @ApiProperty({
    description: 'Comment about the update',
    example: 'Updated priority due to urgent business requirement',
    required: false,
  })
  updateComment?: string;

  @ApiProperty({
    description: 'Whether update was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Current task version after update',
    example: 3,
  })
  version: number;

  @ApiProperty({
    description: 'History log ID for this update',
    example: 'b9f6f267-bb90-5f37-b3c2-3c6e5c0c3d9b',
  })
  historyLogId: string;
}
