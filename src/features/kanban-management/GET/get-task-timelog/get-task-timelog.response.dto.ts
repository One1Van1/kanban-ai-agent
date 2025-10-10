import { ApiProperty } from '@nestjs/swagger';

export class TimelogEntryDto {
  @ApiProperty({
    description: 'Timelog entry identifier',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'Task ID this timelog belongs to',
    example: 'TASK-123',
  })
  taskId: string;

  @ApiProperty({
    description: 'User who logged the time',
    example: 'agent-001',
  })
  userId: string;

  @ApiProperty({
    description: 'Description of work performed',
    example: 'Initial analysis and planning',
  })
  description: string;

  @ApiProperty({
    description: 'Time spent in minutes',
    example: 120,
  })
  timeSpentMinutes: number;

  @ApiProperty({
    description: 'When work started',
    example: '2024-01-15T09:00:00Z',
  })
  startTime: Date;

  @ApiProperty({
    description: 'When work ended',
    example: '2024-01-15T11:00:00Z',
  })
  endTime: Date;

  @ApiProperty({
    description: 'When this timelog entry was created',
    example: '2024-01-15T11:00:00Z',
  })
  createdAt: Date;
}

export class TimelogSummaryDto {
  @ApiProperty({
    description: 'Total time spent in minutes',
    example: 390,
  })
  totalTimeSpentMinutes: number;

  @ApiProperty({
    description: 'Total time spent in hours',
    example: 6.5,
  })
  totalTimeSpentHours: number;

  @ApiProperty({
    description: 'Average time per entry in minutes',
    example: 130,
  })
  averageTimePerEntry: number;

  @ApiProperty({
    description: 'Total number of timelog entries',
    example: 3,
  })
  totalEntries: number;

  @ApiProperty({
    description: 'Number of unique users who logged time',
    example: 2,
  })
  uniqueUsers: number;
}

export class TaskTimelogDataDto {
  @ApiProperty({
    description: 'Task ID',
    example: 'TASK-123',
  })
  taskId: string;

  @ApiProperty({
    type: [TimelogEntryDto],
    description: 'Array of timelog entries',
  })
  items: TimelogEntryDto[];

  @ApiProperty({
    description: 'Total number of timelog entries for this task',
    example: 15,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of entries per page',
    example: 20,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 1,
  })
  totalPages: number;

  @ApiProperty({
    type: TimelogSummaryDto,
    description: 'Summary statistics for the timelog',
  })
  summary: TimelogSummaryDto;
}

export class GetTaskTimelogResponseDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    type: TaskTimelogDataDto,
    description: 'Task timelog data with pagination and summary',
  })
  data: TaskTimelogDataDto;

  @ApiProperty({
    description: 'Response message',
    example: 'Task timelog retrieved successfully',
  })
  message: string;
}
