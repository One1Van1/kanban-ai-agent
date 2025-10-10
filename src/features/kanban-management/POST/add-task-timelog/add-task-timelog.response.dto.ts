import { ApiProperty } from '@nestjs/swagger';

export class TimelogEntryDataDto {
  @ApiProperty({
    description: 'Timelog entry identifier',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
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
    example: 'Implemented user authentication module',
  })
  description: string;

  @ApiProperty({
    description: 'Time spent in minutes',
    example: 120,
  })
  timeSpentMinutes: number;

  @ApiProperty({
    description: 'Time spent in hours',
    example: 2.0,
  })
  timeSpentHours: number;

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
    description: 'Additional notes or context',
    example: 'Used TDD approach, included unit tests',
    required: false,
  })
  notes?: string;

  @ApiProperty({
    description: 'When this timelog entry was created',
    example: '2024-01-15T11:00:00Z',
  })
  createdAt: Date;
}

export class AddTaskTimelogResponseDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    type: TimelogEntryDataDto,
    description: 'Created timelog entry data',
  })
  data: TimelogEntryDataDto;

  @ApiProperty({
    description: 'Response message',
    example: 'Task timelog entry added successfully',
  })
  message: string;
}
