import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject, IsOptional, IsNumber, Min } from 'class-validator';

export class CacheContextRequestDto {
  @ApiProperty({
    description: 'Unique cache key for storing context',
    example: 'task-123-context',
  })
  @IsString()
  key: string;

  @ApiProperty({
    description: 'Context data to cache',
    example: {
      taskId: 'TASK-123',
      relatedTasks: ['TASK-124', 'TASK-125'],
      userComments: ['Great work!', 'Needs review'],
      externalData: { jiraStatus: 'In Progress' },
    },
  })
  @IsObject()
  contextData: Record<string, any>;

  @ApiProperty({
    description: 'TTL in seconds (optional, uses default if not provided)',
    example: 600,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  ttl?: number;
}
