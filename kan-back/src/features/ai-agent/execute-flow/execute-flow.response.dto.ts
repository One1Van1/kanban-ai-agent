import { ApiProperty } from '@nestjs/swagger';

export interface FlowExecutionStep {
  stepId: string;
  stepType: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startedAt?: string;
  completedAt?: string;
  result?: any;
  error?: string;
}

export interface FlowExecutionResult {
  executionId: string;
  flowId: string;
  taskKey: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  startedAt: string;
  completedAt?: string;
  steps: FlowExecutionStep[];
  variables: Record<string, any>;
  error?: string;
}

export class ExecuteFlowResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Execution ID' })
  executionId: string;

  @ApiProperty({ description: 'Task key' })
  taskKey: string;

  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({
    description: 'Flow execution result',
    example: {
      executionId: 'exec-123',
      flowId: 'flow-123',
      taskKey: 'PROJ-123',
      status: 'running',
      startedAt: '2025-01-15T10:00:00Z',
      steps: [
        {
          stepId: 'trigger-1',
          stepType: 'trigger',
          status: 'completed',
          result: { triggered: true },
        },
      ],
      variables: {},
    },
  })
  executionResult: FlowExecutionResult;

  constructor(
    executionId: string,
    taskKey: string,
    executionResult: FlowExecutionResult,
    message: string = 'Flow execution started successfully',
  ) {
    this.success = true;
    this.executionId = executionId;
    this.taskKey = taskKey;
    this.message = message;
    this.executionResult = executionResult;
  }
}
