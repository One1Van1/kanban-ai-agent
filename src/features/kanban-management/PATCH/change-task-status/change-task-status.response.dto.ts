import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from './change-task-status.request.dto';

export interface TaskStatusChange {
  id: string;
  taskId: string;
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
  changedByEmail?: string;
  changedByName?: string;
  statusComment?: string;
  changedAt: Date;
  context?: Record<string, any>;
  agentId?: string;
  triggerType?: string;
  forceChange?: boolean;
}

export class ChangeTaskStatusResponseDto {
  @ApiProperty({
    example: true,
    description: 'Whether the status change was successful',
  })
  success: boolean;

  @ApiProperty({
    example: 'Task status changed from todo to in-progress',
    description: 'Human-readable message about the status change result',
  })
  message: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID of the task that had its status changed',
  })
  taskId: string;

  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.TODO,
    description: 'Previous status of the task',
  })
  previousStatus: TaskStatus;

  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
    description: 'New status of the task',
  })
  currentStatus: TaskStatus;

  @ApiProperty({
    type: Object,
    description: 'Complete status change information',
    example: {
      id: 'status-change-123',
      taskId: '550e8400-e29b-41d4-a716-446655440000',
      fromStatus: 'todo',
      toStatus: 'in-progress',
      changedByEmail: 'john.doe@example.com',
      changedByName: 'John Doe',
      statusComment: 'Начинаю работу над задачей',
      changedAt: '2024-01-01T12:00:00Z',
      context: { reason: 'requirements_clarified' },
      agentId: 'uuid-agent-123',
      triggerType: 'agent_instruction',
      forceChange: false,
    },
  })
  statusChange: TaskStatusChange;

  @ApiProperty({
    example: '2024-01-01T12:00:00.000Z',
    description: 'Timestamp when status was changed',
  })
  timestamp: string;

  @ApiProperty({
    type: Object,
    description: 'Additional metadata about the operation',
    example: {
      workflowValidation: 'passed',
      notificationsSent: ['email', 'telegram'],
      queueJobId: 'status-job-123',
      timeInPreviousStatus: '2 days 3 hours',
    },
    required: false,
  })
  metadata?: Record<string, any>;
}
