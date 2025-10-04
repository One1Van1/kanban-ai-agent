import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAgentRequestDto {
  @ApiProperty({ description: 'Agent name', example: 'Task Analyzer Bot' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Agent description',
    example: 'Analyzes tasks and provides recommendations',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Agent instructions',
    example:
      'Analyze incoming tasks in the "To Do" column and suggest priorities based on urgency and complexity.',
  })
  @IsString()
  @MaxLength(2000)
  instructions: string;

  @ApiPropertyOptional({
    description: 'AI model to use',
    example: 'claude-3-haiku-20240307',
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({
    description: 'Temperature for AI responses (0.0-1.0)',
    example: 0.3,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  temperature?: number;

  @ApiPropertyOptional({
    description: 'Maximum tokens for AI responses',
    example: 4000,
  })
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(10000)
  maxTokens?: number;

  @ApiPropertyOptional({
    description: 'Whether agent is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'User ID who owns this agent' })
  @IsOptional()
  @IsString()
  userId?: string;
}
