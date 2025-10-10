import { ApiProperty } from '@nestjs/swagger';

export enum ActivityResult {
  SUCCESS = 'success',
  ERROR = 'error',
  PENDING = 'pending',
}

export class AgentActivityResponseDto {
  @ApiProperty({
    example: 'activity_uuid_123',
    description: 'Unique identifier of the activity',
  })
  id: string;

  @ApiProperty({
    example: 'agent_123',
    description: 'ID of the AI agent',
  })
  agentId: string;

  @ApiProperty({
    example: 'task_456',
    description: 'ID of the task that was processed',
  })
  taskId: string;

  @ApiProperty({
    example: 'task_moved_to_column_executed',
    description: 'Action that was performed',
  })
  action: string;

  @ApiProperty({
    enum: ActivityResult,
    enumName: 'ActivityResult',
    example: ActivityResult.SUCCESS,
    description: 'Result of the activity execution',
  })
  result: ActivityResult;

  @ApiProperty({
    example: {
      agentId: 'agent_123',
      taskId: 'task_456',
      triggerType: 'task_moved_to_column',
    },
    description: 'Input data that triggered the activity',
  })
  input: any;

  @ApiProperty({
    example: [
      {
        actionType: 'priority_notification',
        description: 'High priority task notification sent',
        data: { priority: 'high', notificationSent: true },
      },
    ],
    description: 'Output/result data from the activity',
    required: false,
  })
  output?: any;

  @ApiProperty({
    example: 'Task data validation failed: missing required field',
    description: 'Error message if the activity failed',
    required: false,
  })
  error?: string;

  @ApiProperty({
    example: 1250,
    description: 'Execution time in milliseconds',
  })
  executionTime: number;

  @ApiProperty({
    example: '2023-12-07T10:00:00.000Z',
    description: 'When the activity was executed',
  })
  createdAt: Date;

  constructor(data: Partial<AgentActivityResponseDto>) {
    Object.assign(this, data);
  }
}

export class GetAgentActivityResponseDto {
  @ApiProperty({
    type: [AgentActivityResponseDto],
    description: 'List of agent activities',
  })
  activities: AgentActivityResponseDto[];

  @ApiProperty({
    example: 25,
    description: 'Total number of activities (for pagination)',
  })
  total: number;

  @ApiProperty({
    example: 10,
    description: 'Number of activities returned',
  })
  count: number;

  @ApiProperty({
    example: 0,
    description: 'Number of activities skipped',
  })
  offset: number;

  @ApiProperty({
    example: 10,
    description: 'Maximum number of activities requested',
  })
  limit: number;

  @ApiProperty({
    example: {
      successCount: 20,
      errorCount: 3,
      pendingCount: 2,
      avgExecutionTime: 1150,
    },
    description: 'Summary statistics for the activities',
  })
  summary: {
    successCount: number;
    errorCount: number;
    pendingCount: number;
    avgExecutionTime: number;
  };

  constructor(data: Partial<GetAgentActivityResponseDto>) {
    Object.assign(this, data);
  }
}
