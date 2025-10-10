import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AddTaskCommentRequestDto {
  @ApiProperty({
    example: 'Работа над задачей начата. Планирую завершить до конца дня.',
    description: 'Comment text content',
    minLength: 1,
    maxLength: 2000,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  comment: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email of the person adding the comment',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  authorEmail?: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the person adding the comment',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  authorName?: string;

  @ApiProperty({
    example: {
      commentType: 'status_update',
      visibility: 'public',
      priority: 'normal',
    },
    description: 'Additional context for the comment',
    required: false,
  })
  @IsOptional()
  context?: Record<string, any>;

  @ApiProperty({
    example: 'uuid-agent-123',
    description: 'ID of the agent adding this comment',
    required: false,
  })
  @IsOptional()
  @IsString()
  agentId?: string;

  @ApiProperty({
    example: 'agent_instruction',
    description: 'What triggered this comment creation',
    required: false,
    default: 'manual',
  })
  @IsOptional()
  @IsString()
  triggerType?: string = 'manual';
}
