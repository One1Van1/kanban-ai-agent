import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  MaxLength,
} from 'class-validator';

export class AssignTaskRequestDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email of the person to assign the task to',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  assigneeEmail: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the person to assign the task to',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  assigneeName?: string;

  @ApiProperty({
    example: 'jane.doe@example.com',
    description: 'Email of the person assigning the task',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  assignedByEmail?: string;

  @ApiProperty({
    example: 'Jane Doe',
    description: 'Name of the person assigning the task',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  assignedByName?: string;

  @ApiProperty({
    example:
      'Назначаю тебе эту задачу, так как у тебя больше опыта в этой области.',
    description: 'Optional message for the assignment',
    maxLength: 1000,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  assignmentMessage?: string;

  @ApiProperty({
    example: {
      priority: 'high',
      department: 'backend',
      estimatedHours: 8,
    },
    description: 'Additional context for the assignment',
    required: false,
  })
  @IsOptional()
  context?: Record<string, any>;

  @ApiProperty({
    example: 'uuid-agent-123',
    description: 'ID of the agent performing this assignment',
    required: false,
  })
  @IsOptional()
  @IsString()
  agentId?: string;

  @ApiProperty({
    example: 'agent_instruction',
    description: 'What triggered this assignment',
    required: false,
    default: 'manual',
  })
  @IsOptional()
  @IsString()
  triggerType?: string = 'manual';
}
