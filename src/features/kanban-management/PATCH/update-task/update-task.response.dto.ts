import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority } from './update-task.request.dto';

export interface TaskUpdateDetails {
  field: string;
  oldValue: any;
  newValue: any;
  updatedAt: Date;
}

export interface UpdatedTask {
  id: string;
  taskId: string;
  taskKey?: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  assigneeEmail?: string;
  assigneeName?: string;
  tags?: string[];
  dueDate?: string;
  estimatedHours?: number;
  currentColumn: string;
  currentStatus: string;
  context?: Record<string, any>;
  updatedAt: Date;
  updatedBy?: string;
  agentId?: string;
}

export class UpdateTaskResponseDto {
  @ApiProperty({
    example: true,
    description: 'Whether the update was successful',
  })
  success: boolean;

  @ApiProperty({
    example: 'Task updated successfully',
    description: 'Human-readable message about the update result',
  })
  message: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID of the updated task',
  })
  taskId: string;

  @ApiProperty({
    type: Object,
    description: 'Complete updated task information',
    example: {
      id: 'history-record-123',
      taskId: '550e8400-e29b-41d4-a716-446655440000',
      taskKey: 'TASK-123',
      title: 'Обновленное название задачи',
      description: 'Обновленное описание задачи',
      priority: 'high',
      assigneeEmail: 'new.assignee@example.com',
      assigneeName: 'New Assignee',
      tags: ['frontend', 'urgent'],
      dueDate: '2024-02-15T10:00:00Z',
      estimatedHours: 8,
      currentColumn: 'in-progress',
      currentStatus: 'in-progress',
      context: { department: 'backend' },
      updatedAt: '2024-01-01T12:00:00Z',
      updatedBy: 'manager@example.com',
      agentId: 'uuid-agent-123',
    },
  })
  updatedTask: UpdatedTask;

  @ApiProperty({
    type: [Object],
    description: 'List of changes made to the task',
    example: [
      {
        field: 'title',
        oldValue: 'Старое название',
        newValue: 'Обновленное название задачи',
        updatedAt: '2024-01-01T12:00:00Z',
      },
      {
        field: 'priority',
        oldValue: 'medium',
        newValue: 'high',
        updatedAt: '2024-01-01T12:00:00Z',
      },
      {
        field: 'assigneeEmail',
        oldValue: 'old.assignee@example.com',
        newValue: 'new.assignee@example.com',
        updatedAt: '2024-01-01T12:00:00Z',
      },
    ],
  })
  changes: TaskUpdateDetails[];

  @ApiProperty({
    example: '2024-01-01T12:00:00.000Z',
    description: 'Timestamp when update was performed',
  })
  timestamp: string;

  @ApiProperty({
    type: Object,
    description: 'Additional metadata about the update operation',
    example: {
      changesCount: 3,
      preservedPosition: true,
      notificationsSent: ['email', 'telegram'],
      queueJobId: 'update-job-123',
      validationsPassed: ['title_length', 'email_format', 'priority_enum'],
      previousVersion: {
        title: 'Старое название',
        priority: 'medium',
        assigneeEmail: 'old.assignee@example.com',
      },
    },
    required: false,
  })
  metadata?: Record<string, any>;
}
