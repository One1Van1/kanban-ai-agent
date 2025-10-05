import { ApiProperty } from '@nestjs/swagger';

export class GetCachedContextResponseDto {
  @ApiProperty({
    description: 'Indicates if context was found in cache',
    example: true,
  })
  found: boolean;

  @ApiProperty({
    description: 'Cache key that was requested',
    example: 'task-123-context',
  })
  cacheKey: string;

  @ApiProperty({
    description: 'Cached context data (null if not found)',
    example: {
      taskId: 'TASK-123',
      relatedTasks: ['TASK-124', 'TASK-125'],
      userComments: ['Great work!', 'Needs review'],
      externalData: { jiraStatus: 'In Progress' },
    },
  })
  contextData: Record<string, any> | null;

  @ApiProperty({
    description: 'Message about retrieval result',
    example: 'Context retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Timestamp when context was retrieved',
    example: '2025-10-05T14:33:21.000Z',
  })
  retrievedAt: string;

  constructor(
    found: boolean,
    cacheKey: string,
    contextData: Record<string, any> | null,
    message: string,
  ) {
    this.found = found;
    this.cacheKey = cacheKey;
    this.contextData = contextData;
    this.message = message;
    this.retrievedAt = new Date().toISOString();
  }
}
