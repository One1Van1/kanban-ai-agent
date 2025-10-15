import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { FlowStatus } from '../../../entities/flow.entity';

export class ListFlowsQueryDto {
  @ApiProperty({
    description: 'Number of flows per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({
    description: 'Page number (1-based)',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Filter by flow status',
    enum: FlowStatus,
    enumName: 'FlowStatus',
    example: FlowStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(FlowStatus)
  status?: FlowStatus;

  @ApiProperty({
    description: 'Filter by creator user ID',
    example: 'user-123',
    required: false,
  })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiProperty({
    description: 'Filter by associated agent ID',
    example: 'agent-123',
    required: false,
  })
  @IsOptional()
  @IsString()
  agentId?: string;

  @ApiProperty({
    description: 'Search in flow names and descriptions',
    example: 'content analysis',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by template status',
    example: false,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isTemplate?: boolean;

  @ApiProperty({
    description: 'Filter by flow category',
    example: 'automation',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;
}
