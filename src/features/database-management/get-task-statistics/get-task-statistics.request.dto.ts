import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTaskStatisticsQueryDto {
  @ApiProperty({ 
    example: 'd5a9adec-daa3-48e2-a563-107f13ae2bcd', 
    description: 'Filter statistics by specific agent ID',
    required: false
  })
  @IsOptional()
  @IsUUID()
  agentId?: string;
}