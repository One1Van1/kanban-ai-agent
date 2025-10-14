import { ApiProperty } from '@nestjs/swagger';
import { VariableType, VariableScope } from './get-flow-variables.query.dto';

export class FlowVariableDto {
  @ApiProperty({
    example: 'user_email',
    description: 'Variable name/key',
  })
  name: string;

  @ApiProperty({
    example: 'john.doe@company.com',
    description: 'Variable value (can be any type)',
  })
  value: any;

  @ApiProperty({
    enum: VariableType,
    enumName: 'VariableType',
    example: VariableType.STRING,
    description: 'Type of the variable',
  })
  type: VariableType;

  @ApiProperty({
    enum: VariableScope,
    enumName: 'VariableScope',
    example: VariableScope.GLOBAL,
    description: 'Scope of the variable',
  })
  scope: VariableScope;

  @ApiProperty({
    example: 'Email address of the current user',
    description: 'Variable description',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'When the variable was created',
  })
  createdAt: string;

  @ApiProperty({
    example: '2024-01-15T12:45:00Z',
    description: 'When the variable was last updated',
  })
  updatedAt: string;

  @ApiProperty({
    example: 'step_1',
    description: 'Flow step that created this variable',
    required: false,
  })
  createdBy?: string;

  @ApiProperty({
    example: false,
    description: 'Whether this is a system/internal variable',
  })
  isSystem: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether the variable is read-only',
  })
  isReadOnly: boolean;

  @ApiProperty({
    example: ['user', 'email', 'contact'],
    description: 'Tags for categorizing variables',
    type: [String],
    required: false,
  })
  tags?: string[];
}

export class FlowVariablesSummaryDto {
  @ApiProperty({
    example: 15,
    description: 'Total number of variables',
  })
  totalVariables: number;

  @ApiProperty({
    example: {
      string: 8,
      number: 3,
      boolean: 2,
      object: 1,
      array: 1,
    },
    description: 'Count of variables by type',
  })
  typeCount: {
    string: number;
    number: number;
    boolean: number;
    object: number;
    array: number;
  };

  @ApiProperty({
    example: {
      global: 5,
      local: 8,
      shared: 2,
      temporary: 0,
    },
    description: 'Count of variables by scope',
  })
  scopeCount: {
    global: number;
    local: number;
    shared: number;
    temporary: number;
  };

  @ApiProperty({
    example: 12,
    description: 'Number of variables with values',
  })
  variablesWithValues: number;

  @ApiProperty({
    example: 3,
    description: 'Number of system variables',
  })
  systemVariables: number;
}

export class GetFlowVariablesResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates if the request was successful',
  })
  success: boolean;

  @ApiProperty({
    example: 'Flow variables retrieved successfully',
    description: 'Response message',
  })
  message: string;

  @ApiProperty({
    type: [FlowVariableDto],
    description: 'Array of flow variables',
  })
  variables: FlowVariableDto[];

  @ApiProperty({
    type: FlowVariablesSummaryDto,
    description: 'Summary statistics of variables',
  })
  summary: FlowVariablesSummaryDto;

  @ApiProperty({
    example: 'flow_execution_123',
    description: 'Flow execution ID these variables belong to',
  })
  flowExecutionId: string;

  @ApiProperty({
    example: 'marketing_automation_v1',
    description: 'Flow template ID',
  })
  flowId: string;

  constructor(
    variables: FlowVariableDto[],
    summary: FlowVariablesSummaryDto,
    flowExecutionId: string,
    flowId: string,
  ) {
    this.success = true;
    this.message = 'Flow variables retrieved successfully';
    this.variables = variables;
    this.summary = summary;
    this.flowExecutionId = flowExecutionId;
    this.flowId = flowId;
  }
}
