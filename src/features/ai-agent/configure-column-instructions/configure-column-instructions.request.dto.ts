import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TriggerConditionType {
  TASK_MOVED_TO_COLUMN = 'task_moved_to_column',
  TASK_ASSIGNED = 'task_assigned',
  TASK_PRIORITY_CHANGED = 'task_priority_changed',
  TASK_DUE_DATE_APPROACHING = 'task_due_date_approaching',
}

export enum TriggerOperator {
  EQUALS = 'equals',
  CONTAINS = 'contains',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
}

export class AgentTriggerConditionDto {
  @ApiProperty({
    enum: TriggerConditionType,
    enumName: 'TriggerConditionType',
    example: TriggerConditionType.TASK_MOVED_TO_COLUMN,
    description: 'Type of trigger condition',
  })
  @IsEnum(TriggerConditionType)
  type: TriggerConditionType;

  @ApiProperty({
    example: 'urgent',
    description: 'Value for the trigger condition',
    required: false,
  })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiProperty({
    enum: TriggerOperator,
    enumName: 'TriggerOperator',
    example: TriggerOperator.EQUALS,
    description: 'Operator for comparing values',
    required: false,
  })
  @IsOptional()
  @IsEnum(TriggerOperator)
  operator?: TriggerOperator;
}

export class ConfigureColumnInstructionsRequestDto {
  @ApiProperty({
    example: 'agent_123',
    description: 'ID of the AI agent',
  })
  @IsString()
  agentId: string;

  @ApiProperty({
    example: 'board_456',
    description: 'ID of the Kanban board',
  })
  @IsString()
  boardId: string;

  @ApiProperty({
    example: 'column_789',
    description: 'ID of the column',
  })
  @IsString()
  columnId: string;

  @ApiProperty({
    example: 'In Progress',
    description: 'Name of the column',
  })
  @IsString()
  columnName: string;

  @ApiProperty({
    example:
      'When a task moves to this column, analyze its priority and notify the assignee if it is high priority. Also check if all required fields are filled.',
    description: 'Instructions for the AI agent when tasks are in this column',
  })
  @IsString()
  instructions: string;

  @ApiProperty({
    type: [AgentTriggerConditionDto],
    description: 'Trigger conditions for when the agent should act',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AgentTriggerConditionDto)
  triggerConditions?: AgentTriggerConditionDto[];

  @ApiProperty({
    example: true,
    description: 'Whether these column instructions are active',
  })
  @IsBoolean()
  isActive: boolean;
}
