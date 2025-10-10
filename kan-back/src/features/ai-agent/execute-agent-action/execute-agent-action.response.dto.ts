import { ApiProperty } from '@nestjs/swagger';

export enum AgentActionResult {
  SUCCESS = 'success',
  ERROR = 'error',
  PENDING = 'pending',
  SKIPPED = 'skipped',
}

export class AgentActionOutputDto {
  @ApiProperty({
    example: 'notification_sent',
    description: 'Type of action performed',
  })
  actionType: string;

  @ApiProperty({
    example:
      'Notification sent to john.doe@example.com about high priority task',
    description: 'Details of what the agent did',
  })
  description: string;

  @ApiProperty({
    example: {
      emailSent: true,
      recipient: 'john.doe@example.com',
      notificationId: 'notif_123',
    },
    description: 'Additional data from the action execution',
  })
  data?: Record<string, any>;

  constructor(data: Partial<AgentActionOutputDto>) {
    Object.assign(this, data);
  }
}

export class ExecuteAgentActionResponseDto {
  @ApiProperty({
    example: 'execution_uuid_123',
    description: 'Unique identifier of the execution',
  })
  executionId: string;

  @ApiProperty({
    example: 'agent_123',
    description: 'ID of the AI agent that was executed',
  })
  agentId: string;

  @ApiProperty({
    example: 'task_456',
    description: 'ID of the task that triggered the action',
  })
  taskId: string;

  @ApiProperty({
    enum: AgentActionResult,
    enumName: 'AgentActionResult',
    example: AgentActionResult.SUCCESS,
    description: 'Result of the agent execution',
  })
  result: AgentActionResult;

  @ApiProperty({
    type: [AgentActionOutputDto],
    description: 'List of actions performed by the agent',
  })
  actions: AgentActionOutputDto[];

  @ApiProperty({
    example: 'Task analyzed and high priority notification sent to assignee',
    description: 'Summary of what the agent accomplished',
  })
  summary: string;

  @ApiProperty({
    example: 1250,
    description: 'Execution time in milliseconds',
  })
  executionTimeMs: number;

  @ApiProperty({
    example: 'Error processing task data: Invalid priority value',
    description: 'Error message if execution failed',
    required: false,
  })
  error?: string;

  @ApiProperty({
    example: {
      tokensUsed: 150,
      model: 'gpt-4',
      contextSources: ['task_details', 'related_tasks'],
    },
    description: 'Additional metadata about the execution',
    required: false,
  })
  metadata?: Record<string, any>;

  @ApiProperty({
    example: '2023-12-07T10:00:00.000Z',
    description: 'When the execution started',
  })
  executedAt: Date;

  constructor(data: Partial<ExecuteAgentActionResponseDto>) {
    Object.assign(this, data);
  }
}
