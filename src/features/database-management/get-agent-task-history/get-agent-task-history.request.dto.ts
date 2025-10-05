import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetAgentTaskHistoryQueryDto {
  @ApiProperty({ 
    example: 50, 
    description: 'Maximum number of records to return',
    required: false,
    minimum: 1,
    maximum: 1000,
    default: 50
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(1000)
  limit?: number = 50;
}