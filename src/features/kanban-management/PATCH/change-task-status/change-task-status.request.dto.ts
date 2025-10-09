import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  MaxLength,
} from 'class-validator';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  IN_REVIEW = 'in-review',
  TESTING = 'testing',
  DONE = 'done',
  BLOCKED = 'blocked',
  CANCELLED = 'cancelled',
}

export class ChangeTaskStatusRequestDto {
  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
    description: 'New status for the task',
  })
  @IsNotEmpty()
  @IsEnum(TaskStatus)
  newStatus: TaskStatus;

  @ApiProperty({
    example: 'Начинаю работу над задачей',
    description: 'Optional comment explaining the status change',
    maxLength: 1000,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  statusComment?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email of the person changing the status',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  changedByEmail?: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the person changing the status',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  changedByName?: string;

  @ApiProperty({
    example: {
      reason: 'requirements_clarified',
      estimatedCompletion: '2024-01-15T10:00:00Z',
      blockers: [],
    },
    description: 'Additional context for the status change',
    required: false,
  })
  @IsOptional()
  context?: Record<string, any>;

  @ApiProperty({
    example: 'uuid-agent-123',
    description: 'ID of the agent performing this status change',
    required: false,
  })
  @IsOptional()
  @IsString()
  agentId?: string;

  @ApiProperty({
    example: 'agent_instruction',
    description: 'What triggered this status change',
    required: false,
    default: 'manual',
  })
  @IsOptional()
  @IsString()
  triggerType?: string = 'manual';

  @ApiProperty({
    example: false,
    description:
      'Whether to force the status change even if it violates workflow rules',
    required: false,
    default: false,
  })
  @IsOptional()
  forceChange?: boolean = false;
}
