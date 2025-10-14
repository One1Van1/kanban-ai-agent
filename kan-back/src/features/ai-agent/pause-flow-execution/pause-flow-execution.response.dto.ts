import { ApiProperty } from '@nestjs/swagger';
import { FlowExecutionStatus } from '../get-flow-execution-status/get-flow-execution-status.response.dto';

export class PauseFlowExecutionResponseDto {
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
    example: FlowExecutionStatus.PAUSED,
    description: 'Current status of the flow execution',
  })
  status: FlowExecutionStatus;

  @ApiProperty({
    description: 'Timestamp when the flow was paused',
    example: '2024-01-15T10:05:30Z',
  })
  pausedAt: Date;

  @ApiProperty({
    description: 'Reason for pausing the flow execution',
    example: 'Paused by user request',
  })
  pauseReason: string;

  @ApiProperty({
    description: 'Current step being executed when paused',
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
    description: 'Success message about the pause operation',
    example: 'Flow execution has been successfully paused',
  })
  message: string;

  @ApiProperty({
    description: 'Whether the flow can be resumed',
    example: true,
  })
  canBeResumed: boolean;

  @ApiProperty({
    description:
      'Estimated time when the flow can be resumed (null if immediate)',
    example: null,
    nullable: true,
  })
  estimatedResumeTime: Date | null;

  @ApiProperty({
    description: 'Next recommended action for the user',
    example: 'Use resume-flow-execution endpoint to continue',
  })
  nextAction: string;

  constructor(data: Partial<PauseFlowExecutionResponseDto>) {
    Object.assign(this, data);
  }
}
