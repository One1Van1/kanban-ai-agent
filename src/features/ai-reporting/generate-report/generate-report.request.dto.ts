import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateReportRequestDto {
  @ApiProperty({
    description: 'Task key for the report request',
    example: 'KAN-33',
  })
  @IsString()
  taskKey: string;

  @ApiProperty({
    description: 'Date range description in free form',
    example: 'со вчера до вторника',
  })
  @IsString()
  dateRange: string;

  @ApiProperty({
    description: 'Assignee email who requested the report',
    example: 'ai-report-maker@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  assigneeEmail?: string;
}
