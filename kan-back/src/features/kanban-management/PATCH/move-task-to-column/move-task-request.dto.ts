import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class MoveTaskRequestDto {
  @ApiProperty({
    example: 'In Progress',
    description: 'Target column to move the task to',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  targetColumn: string;

  @ApiProperty({
    example: 'in_progress',
    description: 'New status for the task',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  newStatus?: string;

  @ApiProperty({
    example: {
      reason: 'Starting work on this task',
      assignee: 'john.doe@example.com',
    },
    description: 'Additional context for the move operation',
    required: false,
  })
  @IsOptional()
  context?: Record<string, any>;

  @ApiProperty({
    example: 'uuid-agent-123',
    description: 'ID of the agent performing this move',
    required: false,
  })
  @IsOptional()
  @IsString()
  agentId?: string;

  @ApiProperty({
    example: 'agent_instruction',
    description: 'What triggered this move',
    required: false,
    default: 'manual',
  })
  @IsOptional()
  @IsString()
  triggerType?: string = 'manual';
}
