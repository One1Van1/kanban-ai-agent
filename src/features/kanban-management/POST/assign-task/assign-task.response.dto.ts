import { ApiProperty } from '@nestjs/swagger';

export interface TaskAssignment {
  id: string;
  taskId: string;
  assigneeEmail: string;
  assigneeName?: string;
  assignedByEmail?: string;
  assignedByName?: string;
  assignmentMessage?: string;
  assignedAt: Date;
  context?: Record<string, any>;
  agentId?: string;
  triggerType?: string;
}

export class AssignTaskResponseDto {
  @ApiProperty({
    example: true,
    description: 'Whether the assignment was successful',
  })
  success: boolean;

  @ApiProperty({
    example: 'Task assigned successfully',
    description: 'Human-readable message about the assignment result',
  })
  message: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID of the assigned task',
  })
  taskId: string;

  @ApiProperty({
    type: Object,
    description: 'Complete assignment information',
    example: {
      id: 'assignment-123',
      taskId: '550e8400-e29b-41d4-a716-446655440000',
      assigneeEmail: 'john.doe@example.com',
      assigneeName: 'John Doe',
      assignedByEmail: 'jane.doe@example.com',
      assignedByName: 'Jane Doe',
      assignmentMessage: 'Назначаю тебе эту задачу',
      assignedAt: '2024-01-01T12:00:00Z',
      context: { priority: 'high' },
      agentId: 'uuid-agent-123',
      triggerType: 'agent_instruction',
    },
  })
  assignment: TaskAssignment;

  @ApiProperty({
    example: '2024-01-01T12:00:00.000Z',
    description: 'Timestamp when assignment was created',
  })
  timestamp: string;

  @ApiProperty({
    type: Object,
    description: 'Additional metadata about the operation',
    example: {
      previousAssignee: 'previous.user@example.com',
      notificationsSent: ['email', 'telegram'],
      queueJobId: 'job-123',
    },
    required: false,
  })
  metadata?: Record<string, any>;
}
