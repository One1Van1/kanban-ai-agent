import { ApiProperty } from '@nestjs/swagger';

export class ActivityDetailsDto {
  @ApiProperty({
    description: 'Previous status if applicable',
    example: 'in_progress',
    required: false,
  })
  fromStatus?: string;

  @ApiProperty({
    description: 'New status if applicable',
    example: 'done',
    required: false,
  })
  toStatus?: string;

  @ApiProperty({
    description: 'Previous column if applicable',
    example: 'In Progress',
    required: false,
  })
  fromColumn?: string;

  @ApiProperty({
    description: 'New column if applicable',
    example: 'Done',
    required: false,
  })
  toColumn?: string;
}

export class UserActivityItemDto {
  @ApiProperty({
    description: 'Activity identifier',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  id: string;

  @ApiProperty({
    description: 'Type of activity',
    example: 'status_changed',
  })
  type: string;

  @ApiProperty({
    description: 'ID of the task involved',
    example: 'TASK-123',
  })
  taskId: string;

  @ApiProperty({
    description: 'Title of the task involved',
    example: 'Implement user authentication',
  })
  taskTitle: string;

  @ApiProperty({
    description: 'Human-readable description of the activity',
    example:
      'Changed status of "Implement user authentication" from in_progress to done',
  })
  description: string;

  @ApiProperty({
    description: 'When the activity occurred',
    example: '2024-01-15T10:30:00Z',
  })
  timestamp: Date;

  @ApiProperty({
    type: ActivityDetailsDto,
    description: 'Additional activity details',
  })
  details: ActivityDetailsDto;
}

export class UserActivityDataDto {
  @ApiProperty({
    description: 'User ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  userId: string;

  @ApiProperty({
    type: [UserActivityItemDto],
    description: 'Array of user activities',
  })
  items: UserActivityItemDto[];

  @ApiProperty({
    description: 'Total number of activities for this user',
    example: 45,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of activities per page',
    example: 20,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 3,
  })
  totalPages: number;
}

export class GetUserActivityResponseDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    type: UserActivityDataDto,
    description: 'User activity data with pagination',
  })
  data: UserActivityDataDto;

  @ApiProperty({
    description: 'Response message',
    example: 'User activity retrieved successfully',
  })
  message: string;
}
