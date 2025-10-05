import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ActivityResultFilter {
  ALL = 'all',
  SUCCESS = 'success',
  ERROR = 'error',
  PENDING = 'pending',
}

export class GetAgentActivityRequestDto {
  @ApiProperty({
    example: 'agent_123',
    description: 'ID of the AI agent to get activity for',
  })
  @IsString()
  agentId: string;

  @ApiProperty({
    example: 10,
    description: 'Number of activities to return',
    minimum: 1,
    maximum: 100,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({
    example: 0,
    description: 'Number of activities to skip (for pagination)',
    minimum: 0,
    default: 0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number = 0;

  @ApiProperty({
    enum: ActivityResultFilter,
    enumName: 'ActivityResultFilter',
    example: ActivityResultFilter.ALL,
    description: 'Filter activities by result status',
    default: ActivityResultFilter.ALL,
    required: false,
  })
  @IsOptional()
  @IsEnum(ActivityResultFilter)
  result?: ActivityResultFilter = ActivityResultFilter.ALL;

  @ApiProperty({
    example: 'task_456',
    description: 'Filter activities by specific task ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  taskId?: string;

  @ApiProperty({
    example: '2023-12-01',
    description: 'Filter activities from this date (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiProperty({
    example: '2023-12-07',
    description: 'Filter activities to this date (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsString()
  toDate?: string;
}
