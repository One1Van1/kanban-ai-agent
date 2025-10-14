import { ApiProperty } from '@nestjs/swagger';
import { FlowExecutionStatus } from '../get-flow-execution-status/get-flow-execution-status.response.dto';

export class RestoredContextDto {
  @ApiProperty({
    description: 'Number of variables successfully restored',
    example: 3,
  })
  variablesRestored: number;

  @ApiProperty({
    description: 'Checkpoint from which execution was restored',
    example: 'after_user_input_validation',
  })
  checkpointRestored: string;

  @ApiProperty({
    description: 'Whether the execution state was validated successfully',
    example: true,
  })
  stateValidated: boolean;
}

export class NextStepInfoDto {
  @ApiProperty({
    description: 'Number of the next step to be executed',
    example: 4,
  })
  nextStepNumber: number;

  @ApiProperty({
    description: 'Human-readable name of the next step',
    example: 'Step 4: Continue processing',
  })
  nextStepName: string;

  @ApiProperty({
    description: 'Estimated duration for the next step in seconds',
    example: 120,
  })
  estimatedDuration: number;

  @ApiProperty({
    description: 'Number of steps remaining after current step',
    example: 5,
  })
  stepsRemaining: number;
}

export class ResumeFlowExecutionResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the flow execution',
    example: 'exec-001',
  })
  executionId: string;

  @ApiProperty({
    description: 'Unique identifier of the flow definition',
    example: 'flow-001',
  })
  flowId: string;

  @ApiProperty({
    enum: FlowExecutionStatus,
    enumName: 'FlowExecutionStatus',
    example: FlowExecutionStatus.RUNNING,
    description: 'Current status of the flow execution after resume',
  })
  status: FlowExecutionStatus;

  @ApiProperty({
    description: 'Timestamp when the flow was resumed',
    example: '2024-01-15T10:10:15Z',
  })
  resumedAt: Date;

  @ApiProperty({
    description: 'Duration of pause in seconds',
    example: 285,
  })
  pausedDuration: number;

  @ApiProperty({
    description: 'Current step being executed after resume',
    example: 3,
  })
  currentStep: number;

  @ApiProperty({
    description: 'Total number of steps in the flow',
    example: 8,
  })
  totalSteps: number;

  @ApiProperty({
    description: 'Execution progress percentage (0-100)',
    example: 37.5,
  })
  progress: number;

  @ApiProperty({
    description: 'Success message about the resume operation',
    example: 'Flow execution has been successfully resumed',
  })
  message: string;

  @ApiProperty({
    description: 'Information about restored execution context',
    type: RestoredContextDto,
  })
  restoredContext: RestoredContextDto;

  @ApiProperty({
    description: 'Information about the next step to be executed',
    type: NextStepInfoDto,
  })
  nextStepInfo: NextStepInfoDto;

  @ApiProperty({
    description: 'Whether the resume operation was successful',
    example: true,
  })
  resumeSuccessful: boolean;

  constructor(data: Partial<ResumeFlowExecutionResponseDto>) {
    Object.assign(this, data);
  }
}
