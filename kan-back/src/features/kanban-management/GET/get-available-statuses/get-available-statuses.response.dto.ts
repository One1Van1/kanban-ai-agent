import { ApiProperty } from '@nestjs/swagger';

export class TaskStatusDto {
  @ApiProperty({
    description: 'Unique status identifier',
    example: 'in_progress',
  })
  id: string;

  @ApiProperty({
    description: 'Human-readable status name',
    example: 'In Progress',
  })
  name: string;

  @ApiProperty({
    description: 'Status description',
    example: 'Tasks that are currently being worked on',
  })
  description: string;

  @ApiProperty({
    description: 'Status color for UI display',
    example: '#0052CC',
  })
  color: string;

  @ApiProperty({
    description: 'Status category',
    example: 'in_progress',
  })
  category: string;

  @ApiProperty({
    description: 'Display order of status',
    example: 2,
  })
  order: number;

  @ApiProperty({
    description: 'Whether this is an initial status for new tasks',
    example: false,
  })
  isInitial: boolean;

  @ApiProperty({
    description: 'Whether this is a final status',
    example: false,
  })
  isFinal: boolean;
}

export class StatusTransitionDto {
  @ApiProperty({
    description: 'Source status ID',
    example: 'in_progress',
  })
  from: string;

  @ApiProperty({
    description: 'Target status ID',
    example: 'in_review',
  })
  to: string;

  @ApiProperty({
    description: 'Transition action name',
    example: 'Submit for Review',
  })
  name: string;
}

export class StatusesDataDto {
  @ApiProperty({
    type: [TaskStatusDto],
    description: 'Array of available task statuses',
  })
  statuses: TaskStatusDto[];

  @ApiProperty({
    type: [StatusTransitionDto],
    description: 'Array of possible status transitions',
  })
  transitions: StatusTransitionDto[];

  @ApiProperty({
    description: 'Default status ID for new tasks',
    example: 'todo',
  })
  defaultStatus: string;

  @ApiProperty({
    description: 'Total number of available statuses',
    example: 5,
  })
  totalStatuses: number;
}

export class GetAvailableStatusesResponseDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    type: StatusesDataDto,
    description: 'Available statuses and transitions data',
  })
  data: StatusesDataDto;

  @ApiProperty({
    description: 'Response message',
    example: 'Available statuses retrieved successfully',
  })
  message: string;
}
