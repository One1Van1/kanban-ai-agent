import { ApiProperty } from '@nestjs/swagger';

export enum FlowExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum StepStatus {
  WAITING = 'waiting',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
}

export class FlowStepDto {
  @ApiProperty({
    example: 'step_1',
    description: 'Unique step identifier',
  })
  id: string;

  @ApiProperty({
    example: 'Analyze Jira Task',
    description: 'Step display name',
  })
  name: string;

  @ApiProperty({
    enum: StepStatus,
    enumName: 'StepStatus',
    example: StepStatus.COMPLETED,
    description: 'Current status of the step',
  })
  status: StepStatus;

  @ApiProperty({
    example: 1,
    description: 'Step execution order',
  })
  order: number;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'When step started execution',
    required: false,
  })
  startedAt?: string;

  @ApiProperty({
    example: '2024-01-15T10:32:15Z',
    description: 'When step completed execution',
    required: false,
  })
  completedAt?: string;

  @ApiProperty({
    example: '00:02:15.123',
    description: 'Step execution duration',
    required: false,
  })
  duration?: string;

  @ApiProperty({
    example: 'Task PROJ-123 analyzed successfully',
    description: 'Step execution result message',
    required: false,
  })
  result?: string;

  @ApiProperty({
    example: 'Invalid task ID format',
    description: 'Error message if step failed',
    required: false,
  })
  error?: string;

  @ApiProperty({
    example: 85,
    description: 'Step progress percentage (0-100)',
  })
  progress: number;
}

export class FlowExecutionLogDto {
  @ApiProperty({
    example: '2024-01-15T10:30:45Z',
    description: 'Log entry timestamp',
  })
  timestamp: string;

  @ApiProperty({
    example: 'info',
    description: 'Log level',
    enum: ['debug', 'info', 'warn', 'error'],
  })
  level: 'debug' | 'info' | 'warn' | 'error';

  @ApiProperty({
    example: 'step_2',
    description: 'Step that generated this log',
    required: false,
  })
  stepId?: string;

  @ApiProperty({
    example: 'Processing task PROJ-123',
    description: 'Log message',
  })
  message: string;

  @ApiProperty({
    example: { taskId: 'PROJ-123', userId: 'john.doe' },
    description: 'Additional log context data',
    required: false,
  })
  context?: any;
}

export class FlowExecutionMetricsDto {
  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Flow execution start time',
  })
  startedAt: string;

  @ApiProperty({
    example: '2024-01-15T10:45:30Z',
    description: 'Flow execution end time (null if still running)',
    required: false,
  })
  completedAt?: string;

  @ApiProperty({
    example: '00:15:30.456',
    description: 'Total execution duration',
    required: false,
  })
  duration?: string;

  @ApiProperty({
    example: 75,
    description: 'Overall progress percentage (0-100)',
  })
  progress: number;

  @ApiProperty({
    example: 5,
    description: 'Total number of steps in flow',
  })
  totalSteps: number;

  @ApiProperty({
    example: 3,
    description: 'Number of completed steps',
  })
  completedSteps: number;

  @ApiProperty({
    example: 1,
    description: 'Number of failed steps',
  })
  failedSteps: number;

  @ApiProperty({
    example: 1,
    description: 'Number of skipped steps',
  })
  skippedSteps: number;

  @ApiProperty({
    example: 'step_4',
    description: 'Currently executing step ID',
    required: false,
  })
  currentStep?: string;

  @ApiProperty({
    example: '2024-01-15T11:00:00Z',
    description: 'Estimated completion time',
    required: false,
  })
  estimatedCompletion?: string;
}

export class GetFlowExecutionStatusResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates if the request was successful',
  })
  success: boolean;

  @ApiProperty({
    example: 'Flow execution status retrieved successfully',
    description: 'Response message',
  })
  message: string;

  @ApiProperty({
    example: 'flow_exec_123',
    description: 'Flow execution ID',
  })
  executionId: string;

  @ApiProperty({
    example: 'marketing_automation_v1',
    description: 'Flow template ID',
  })
  flowId: string;

  @ApiProperty({
    example: 'Marketing Campaign Automation',
    description: 'Flow display name',
  })
  flowName: string;

  @ApiProperty({
    enum: FlowExecutionStatus,
    enumName: 'FlowExecutionStatus',
    example: FlowExecutionStatus.RUNNING,
    description: 'Current execution status',
  })
  status: FlowExecutionStatus;

  @ApiProperty({
    type: FlowExecutionMetricsDto,
    description: 'Execution metrics and timing information',
  })
  metrics: FlowExecutionMetricsDto;

  @ApiProperty({
    type: [FlowStepDto],
    description: 'Detailed information about each step',
    required: false,
  })
  steps?: FlowStepDto[];

  @ApiProperty({
    type: [FlowExecutionLogDto],
    description: 'Execution logs',
    required: false,
  })
  logs?: FlowExecutionLogDto[];

  @ApiProperty({
    example: {
      user_email: 'john.doe@company.com',
      task_count: 42,
      processing_status: true,
    },
    description: 'Current flow variables',
    required: false,
  })
  variables?: Record<string, any>;

  @ApiProperty({
    example: 'john.doe@company.com',
    description: 'User who started the execution',
  })
  startedBy: string;

  @ApiProperty({
    example: '2024-01-15T12:45:30Z',
    description: 'Last status update timestamp',
  })
  lastUpdated: string;

  constructor(
    executionId: string,
    flowId: string,
    flowName: string,
    status: FlowExecutionStatus,
    metrics: FlowExecutionMetricsDto,
    startedBy: string,
  ) {
    this.success = true;
    this.message = 'Flow execution status retrieved successfully';
    this.executionId = executionId;
    this.flowId = flowId;
    this.flowName = flowName;
    this.status = status;
    this.metrics = metrics;
    this.startedBy = startedBy;
    this.lastUpdated = new Date().toISOString();
  }
}
