import { ApiProperty } from '@nestjs/swagger';
import { FlowExecutionStatus } from '../get-flow-execution-status/get-flow-execution-status.response.dto';

export class CleanupResultDto {
  @ApiProperty({
    description: 'List of cleanup steps performed during cancellation',
    example: [
      'Terminated 2 active connections: jira-api, database',
      'Freed 3 resources: temp-file-001.json, api-session-abc123, transaction-lock-xyz',
      'Performed transaction rollback',
    ],
    type: [String],
  })
  cleanupSteps: string[];

  @ApiProperty({
    description: 'Duration of cleanup process in milliseconds',
    example: 150,
  })
  cleanupDuration: number;

  @ApiProperty({
    description: 'Whether cleanup was successful',
    example: true,
  })
  cleanupSuccessful: boolean;

  @ApiProperty({
    description: 'Warnings generated during cleanup (if any)',
    example: [],
    type: [String],
  })
  warningsGenerated: string[];

  @ApiProperty({
    description: 'Number of resources that were recovered',
    example: 3,
  })
  resourcesRecovered: number;

  @ApiProperty({
    description: 'Number of connections that were terminated',
    example: 2,
  })
  connectionsTerminated: number;
}

export class CancelFlowExecutionResponseDto {
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
    example: FlowExecutionStatus.CANCELLED,
    description: 'Current status of the flow execution after cancellation',
  })
  status: FlowExecutionStatus;

  @ApiProperty({
    description: 'Timestamp when the flow was cancelled',
    example: '2024-01-15T10:15:45Z',
  })
  cancelledAt: Date;

  @ApiProperty({
    description: 'Reason for cancelling the flow execution',
    example: 'Cancelled by user',
  })
  cancelReason: string;

  @ApiProperty({
    description: 'Whether the cancellation was forced',
    example: false,
  })
  wasForced: boolean;

  @ApiProperty({
    description: 'Current step that was executing when cancelled',
    example: 3,
  })
  currentStep: number;

  @ApiProperty({
    description: 'Total number of steps in the flow',
    example: 8,
  })
  totalSteps: number;

  @ApiProperty({
    description: 'Execution progress percentage when cancelled (0-100)',
    example: 37.5,
  })
  progress: number;

  @ApiProperty({
    description: 'Success message about the cancellation operation',
    example: 'Flow execution has been successfully cancelled',
  })
  message: string;

  @ApiProperty({
    description: 'Detailed information about cleanup operations performed',
    type: CleanupResultDto,
  })
  cleanupResult: CleanupResultDto;

  @ApiProperty({
    description: 'Whether transaction rollback was performed',
    example: false,
  })
  rollbackPerformed: boolean;

  @ApiProperty({
    description: 'Number of resources that were freed during cancellation',
    example: 3,
  })
  resourcesFreed: number;

  @ApiProperty({
    description:
      'Number of connections that were terminated during cancellation',
    example: 2,
  })
  connectionsTerminated: number;

  constructor(data: Partial<CancelFlowExecutionResponseDto>) {
    Object.assign(this, data);
  }
}
