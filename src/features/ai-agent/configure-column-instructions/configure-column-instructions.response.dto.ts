import { ApiProperty } from '@nestjs/swagger';
import {
  TriggerConditionType,
  TriggerOperator,
} from './configure-column-instructions.request.dto';

export class AgentTriggerConditionResponseDto {
  @ApiProperty({
    enum: TriggerConditionType,
    enumName: 'TriggerConditionType',
    example: TriggerConditionType.TASK_MOVED_TO_COLUMN,
    description: 'Type of trigger condition',
  })
  type: TriggerConditionType;

  @ApiProperty({
    example: 'urgent',
    description: 'Value for the trigger condition',
    required: false,
  })
  value?: string;

  @ApiProperty({
    enum: TriggerOperator,
    enumName: 'TriggerOperator',
    example: TriggerOperator.EQUALS,
    description: 'Operator for comparing values',
    required: false,
  })
  operator?: TriggerOperator;

  constructor(data: Partial<AgentTriggerConditionResponseDto>) {
    Object.assign(this, data);
  }
}

export class AgentColumnInstructionResponseDto {
  @ApiProperty({
    example: 'instruction_uuid_123',
    description: 'Unique identifier of the column instruction',
  })
  id: string;

  @ApiProperty({
    example: 'agent_123',
    description: 'ID of the AI agent',
  })
  agentId: string;

  @ApiProperty({
    example: 'board_456',
    description: 'ID of the Kanban board',
  })
  boardId: string;

  @ApiProperty({
    example: 'column_789',
    description: 'ID of the column',
  })
  columnId: string;

  @ApiProperty({
    example: 'In Progress',
    description: 'Name of the column',
  })
  columnName: string;

  @ApiProperty({
    example:
      'When a task moves to this column, analyze its priority and notify the assignee if it is high priority.',
    description: 'Instructions for the AI agent when tasks are in this column',
  })
  instructions: string;

  @ApiProperty({
    type: [AgentTriggerConditionResponseDto],
    description: 'Trigger conditions for when the agent should act',
    required: false,
  })
  triggerConditions?: AgentTriggerConditionResponseDto[];

  @ApiProperty({
    example: true,
    description: 'Whether these column instructions are active',
  })
  isActive: boolean;

  @ApiProperty({
    example: '2023-12-07T10:00:00.000Z',
    description: 'When the column instruction was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-12-07T10:00:00.000Z',
    description: 'When the column instruction was last updated',
  })
  updatedAt: Date;

  constructor(data: Partial<AgentColumnInstructionResponseDto>) {
    Object.assign(this, data);
  }
}

export class ConfigureColumnInstructionsResponseDto {
  @ApiProperty({
    type: AgentColumnInstructionResponseDto,
    description: 'The configured column instruction',
  })
  columnInstruction: AgentColumnInstructionResponseDto;

  @ApiProperty({
    example: 'Column instructions configured successfully',
    description: 'Success message',
  })
  message: string;

  constructor(
    columnInstruction: AgentColumnInstructionResponseDto,
    message: string,
  ) {
    this.columnInstruction = columnInstruction;
    this.message = message;
  }
}
