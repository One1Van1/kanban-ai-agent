import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TaskPriority {
  LOWEST = 'lowest',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  HIGHEST = 'highest',
}

export enum TaskType {
  TASK = 'task',
  BUG = 'bug',
  STORY = 'story',
  EPIC = 'epic',
  SUBTASK = 'subtask',
}

export class TaskCustomField {
  @ApiProperty({
    description: 'Custom field name',
    example: 'Sprint',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Custom field value',
    example: 'Sprint 24.1',
  })
  @IsString()
  value: string;
}

export class UpdateTaskDetailsRequestDto {
  @ApiProperty({
    description: 'Updated task title',
    example: 'Implement user authentication with OAuth2',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Updated task description',
    example:
      'Add OAuth2 integration for Google and GitHub authentication providers',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: TaskPriority,
    enumName: 'TaskPriority',
    example: TaskPriority.HIGH,
    description: 'Updated task priority',
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({
    enum: TaskType,
    enumName: 'TaskType',
    example: TaskType.STORY,
    description: 'Updated task type',
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskType)
  type?: TaskType;

  @ApiProperty({
    description: 'Updated assignee ID',
    example: 'agent-002',
    required: false,
  })
  @IsOptional()
  @IsString()
  assignee?: string;

  @ApiProperty({
    description: 'Updated reporter ID',
    example: 'agent-001',
    required: false,
  })
  @IsOptional()
  @IsString()
  reporter?: string;

  @ApiProperty({
    description: 'Updated task labels',
    example: ['frontend', 'authentication', 'security'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];

  @ApiProperty({
    description: 'Updated estimated hours',
    example: 8,
    minimum: 0,
    maximum: 1000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1000)
  estimatedHours?: number;

  @ApiProperty({
    description: 'Updated story points',
    example: 5,
    minimum: 0,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  storyPoints?: number;

  @ApiProperty({
    description: 'Updated due date',
    example: '2024-01-20T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsString()
  dueDate?: string;

  @ApiProperty({
    description: 'Updated custom fields',
    type: [TaskCustomField],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskCustomField)
  customFields?: TaskCustomField[];

  @ApiProperty({
    description: 'User performing the update',
    example: 'agent-001',
  })
  @IsString()
  updatedBy: string;

  @ApiProperty({
    description: 'Comment about the update',
    example: 'Updated priority due to urgent business requirement',
    required: false,
  })
  @IsOptional()
  @IsString()
  updateComment?: string;
}
