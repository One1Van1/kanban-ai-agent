import { ApiProperty } from '@nestjs/swagger';

export class TaskCommentDto {
  @ApiProperty({
    description: 'Unique comment identifier',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  id: string;

  @ApiProperty({
    description: 'ID of the task this comment belongs to',
    example: 'TASK-123',
  })
  taskId: string;

  @ApiProperty({
    description: 'Content of the comment',
    example: 'This task has been updated with new requirements',
  })
  content: string;

  @ApiProperty({
    description: 'ID of the agent who created the comment',
    example: 'agent-001',
  })
  authorId: string;

  @ApiProperty({
    description: 'Comment creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Comment last update timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;
}

export class TaskCommentsDataDto {
  @ApiProperty({
    type: [TaskCommentDto],
    description: 'Array of task comments',
  })
  items: TaskCommentDto[];

  @ApiProperty({
    description: 'Total number of comments for this task',
    example: 15,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of comments per page',
    example: 20,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 1,
  })
  totalPages: number;
}

export class GetTaskCommentsResponseDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    type: TaskCommentsDataDto,
    description: 'Task comments data with pagination',
  })
  data: TaskCommentsDataDto;

  @ApiProperty({
    description: 'Response message',
    example: 'Task comments retrieved successfully',
  })
  message: string;
}
