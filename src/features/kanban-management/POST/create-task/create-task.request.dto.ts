import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateTaskRequestDto {
  @ApiProperty({
    example: 'PROJ-123',
    description: 'Unique task key/identifier',
    minLength: 1,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  taskKey: string;

  @ApiProperty({
    example: 'Fix user authentication bug',
    description: 'Task title/summary',
    minLength: 1,
    maxLength: 500,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  taskTitle: string;

  @ApiProperty({
    example: 'To Do',
    description: 'Initial column for the task',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  initialColumn: string;

  @ApiProperty({
    example: 'pending',
    description: 'Initial task status',
    maxLength: 100,
    required: false,
    default: 'pending',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  initialStatus?: string = 'pending';

  @ApiProperty({
    example: { priority: 'high', assignee: 'john.doe@example.com' },
    description: 'Additional context and metadata for the task',
    required: false,
  })
  @IsOptional()
  context?: Record<string, any>;

  @ApiProperty({
    example: 'uuid-agent-123',
    description: 'ID of the agent creating this task',
    required: false,
  })
  @IsOptional()
  @IsString()
  agentId?: string;
}
