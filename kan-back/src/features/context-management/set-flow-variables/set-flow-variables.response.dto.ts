import { ApiProperty } from '@nestjs/swagger';
import { VariableType, VariableScope } from './set-flow-variables.request.dto';

export class SetVariableResultDto {
  @ApiProperty({
    example: 'user_email',
    description: 'Variable name that was processed',
  })
  name: string;

  @ApiProperty({
    example: true,
    description: 'Whether the variable was successfully set',
  })
  success: boolean;

  @ApiProperty({
    example: 'created',
    description: 'Action performed (created, updated, skipped, failed)',
    enum: ['created', 'updated', 'skipped', 'failed'],
  })
  action: 'created' | 'updated' | 'skipped' | 'failed';

  @ApiProperty({
    example: 'Variable created successfully',
    description: 'Result message or error description',
  })
  message: string;

  @ApiProperty({
    example: 'john.doe@company.com',
    description: 'The value that was set (null if failed)',
    required: false,
  })
  setValue?: any;

  @ApiProperty({
    example: 'jane.smith@company.com',
    description: 'Previous value (null if variable did not exist)',
    required: false,
  })
  previousValue?: any;
}

export class SetFlowVariablesSummaryDto {
  @ApiProperty({
    example: 5,
    description: 'Total number of variables processed',
  })
  totalProcessed: number;

  @ApiProperty({
    example: 3,
    description: 'Number of variables successfully created',
  })
  created: number;

  @ApiProperty({
    example: 2,
    description: 'Number of variables successfully updated',
  })
  updated: number;

  @ApiProperty({
    example: 0,
    description: 'Number of variables skipped (e.g., read-only)',
  })
  skipped: number;

  @ApiProperty({
    example: 0,
    description: 'Number of variables that failed to set',
  })
  failed: number;

  @ApiProperty({
    example: '00:00:01.234',
    description: 'Time taken to process all variables',
  })
  processingTime: string;
}

export class SetFlowVariablesResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates if the request was successful overall',
  })
  success: boolean;

  @ApiProperty({
    example: 'Flow variables set successfully',
    description: 'Overall response message',
  })
  message: string;

  @ApiProperty({
    type: [SetVariableResultDto],
    description: 'Detailed results for each variable',
  })
  results: SetVariableResultDto[];

  @ApiProperty({
    type: SetFlowVariablesSummaryDto,
    description: 'Summary of the operation',
  })
  summary: SetFlowVariablesSummaryDto;

  @ApiProperty({
    example: 'flow_exec_123',
    description: 'Flow execution ID where variables were set',
  })
  flowExecutionId: string;

  @ApiProperty({
    example: 'marketing_automation_v1',
    description: 'Flow template ID',
  })
  flowId: string;

  @ApiProperty({
    example: '2024-01-15T12:45:30Z',
    description: 'Timestamp when variables were set',
  })
  timestamp: string;

  constructor(
    results: SetVariableResultDto[],
    summary: SetFlowVariablesSummaryDto,
    flowExecutionId: string,
    flowId: string,
  ) {
    this.success = summary.failed === 0;
    this.message = this.success
      ? 'Flow variables set successfully'
      : `${summary.failed} variables failed to set`;
    this.results = results;
    this.summary = summary;
    this.flowExecutionId = flowExecutionId;
    this.flowId = flowId;
    this.timestamp = new Date().toISOString();
  }
}
