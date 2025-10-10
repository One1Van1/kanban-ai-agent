import { ApiProperty } from '@nestjs/swagger';

export class TaskLinkDataDto {
  @ApiProperty({
    description: 'Link identifier',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  id: string;

  @ApiProperty({
    description: 'Source task ID',
    example: 'TASK-123',
  })
  sourceTaskId: string;

  @ApiProperty({
    description: 'Target task ID',
    example: 'TASK-456',
  })
  targetTaskId: string;

  @ApiProperty({
    description: 'Type of link relationship',
    example: 'blocks',
  })
  linkType: string;

  @ApiProperty({
    description: 'Optional description of the link',
    example: 'This task must be completed before the target task can start',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'User who created the link',
    example: 'agent-001',
  })
  createdBy: string;

  @ApiProperty({
    description: 'When the link was created',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Whether the link is currently active',
    example: true,
  })
  isActive: boolean;
}

export class CreateTaskLinkResponseDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    type: TaskLinkDataDto,
    description: 'Created task link data',
  })
  data: TaskLinkDataDto;

  @ApiProperty({
    description: 'Response message',
    example: 'Task link created successfully',
  })
  message: string;
}
