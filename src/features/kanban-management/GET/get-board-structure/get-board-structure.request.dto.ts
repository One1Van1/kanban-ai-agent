import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class GetBoardStructureRequestDto {
  @ApiProperty({
    example: 'project-alpha',
    description: 'Filter structure by specific board/project ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  boardId?: string;

  @ApiProperty({
    example: true,
    description: 'Include task counts for each column',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeTaskCounts?: boolean = true;

  @ApiProperty({
    example: false,
    description: 'Include detailed column metadata (WIP limits, etc.)',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  includeMetadata?: boolean = false;

  @ApiProperty({
    example: true,
    description: 'Include available status transitions for each column',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeStatusTransitions?: boolean = true;

  @ApiProperty({
    example: false,
    description: 'Include sample tasks for each column (for AI context)',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  includeSampleTasks?: boolean = false;

  @ApiProperty({
    example: 3,
    description:
      'Number of sample tasks to include per column (if includeSampleTasks=true)',
    minimum: 1,
    maximum: 10,
    required: false,
    default: 3,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  sampleTasksLimit?: number = 3;

  @ApiProperty({
    example: 'uuid-agent-123',
    description: 'ID of the agent requesting board structure',
    required: false,
  })
  @IsOptional()
  @IsString()
  agentId?: string;

  @ApiProperty({
    example: 'task_assignment',
    description: 'Context of why board structure is needed',
    required: false,
  })
  @IsOptional()
  @IsString()
  purpose?: string;
}
