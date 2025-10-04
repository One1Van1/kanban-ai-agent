import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
  Max,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ConfigureAgentRequestDto {
  @ApiPropertyOptional({
    description: 'Agent name',
    example: 'Updated Task Analyzer Bot',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: 'Agent description',
    example: 'Updated agent description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Agent instructions',
    example: 'Updated instructions for analyzing tasks.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  instructions?: string;

  @ApiPropertyOptional({
    description: 'AI model to use',
    example: 'claude-3-haiku-20240307',
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({
    description: 'Temperature for AI responses (0.0-1.0)',
    example: 0.5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  temperature?: number;

  @ApiPropertyOptional({
    description: 'Maximum tokens for AI responses',
    example: 5000,
  })
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(10000)
  maxTokens?: number;

  @ApiPropertyOptional({
    description: 'Whether agent is active',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
