import { ApiProperty } from '@nestjs/swagger';

export class ColumnStatDto {
  @ApiProperty({
    description: 'Column identifier',
    example: 'in_progress',
  })
  columnId: string;

  @ApiProperty({
    description: 'Column display name',
    example: 'In Progress',
  })
  name: string;

  @ApiProperty({
    description: 'Number of tasks in this column',
    example: 5,
  })
  taskCount: number;

  @ApiProperty({
    description: 'Column color for UI display',
    example: '#0052CC',
  })
  color: string;
}

export class PriorityStatDto {
  @ApiProperty({
    description: 'Priority level',
    example: 'high',
  })
  priority: string;

  @ApiProperty({
    description: 'Priority display name',
    example: 'High',
  })
  name: string;

  @ApiProperty({
    description: 'Number of tasks with this priority',
    example: 6,
  })
  taskCount: number;

  @ApiProperty({
    description: 'Priority color for UI display',
    example: '#FF8B00',
  })
  color: string;
}

export class BoardSummaryDataDto {
  @ApiProperty({
    description: 'Board identifier',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  boardId: string;

  @ApiProperty({
    description: 'Total number of tasks on the board',
    example: 30,
  })
  totalTasks: number;

  @ApiProperty({
    description: 'Number of active (non-completed) tasks',
    example: 18,
  })
  activeTasks: number;

  @ApiProperty({
    description: 'Number of completed tasks',
    example: 12,
  })
  completedTasks: number;

  @ApiProperty({
    type: [ColumnStatDto],
    description: 'Statistics for each column',
  })
  columns: ColumnStatDto[];

  @ApiProperty({
    type: [PriorityStatDto],
    description: 'Statistics by task priority',
  })
  priorities: PriorityStatDto[];

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  lastUpdated: Date;

  // Optional detailed statistics
  @ApiProperty({
    description: 'Average tasks per column',
    example: 6,
    required: false,
  })
  avgTasksPerColumn?: number;

  @ApiProperty({
    description: 'Tasks created today',
    example: 3,
    required: false,
  })
  tasksCreatedToday?: number;

  @ApiProperty({
    description: 'Tasks completed today',
    example: 4,
    required: false,
  })
  tasksCompletedToday?: number;

  @ApiProperty({
    description: 'Number of overdue tasks',
    example: 2,
    required: false,
  })
  overdueTasks?: number;

  @ApiProperty({
    description: 'Average duration for blocked tasks',
    example: '2.5 days',
    required: false,
  })
  blockedTasksDuration?: string;

  @ApiProperty({
    description: 'Most active column name',
    example: 'in_progress',
    required: false,
  })
  mostActiveColumn?: string;

  @ApiProperty({
    description: 'Task completion rate percentage',
    example: 85.7,
    required: false,
  })
  completionRate?: number;
}

export class GetBoardSummaryResponseDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    type: BoardSummaryDataDto,
    description: 'Board summary data',
  })
  data: BoardSummaryDataDto;

  @ApiProperty({
    description: 'Response message',
    example: 'Board summary retrieved successfully',
  })
  message: string;
}
