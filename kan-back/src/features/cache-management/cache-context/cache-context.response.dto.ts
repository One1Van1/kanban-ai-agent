import { ApiProperty } from '@nestjs/swagger';

export class CacheContextResponseDto {
  @ApiProperty({
    description: 'Indicates if context was cached successfully',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Cache key where context was stored',
    example: 'task-123-context',
  })
  cacheKey: string;

  @ApiProperty({
    description: 'TTL applied to the cached data in seconds',
    example: 600,
  })
  ttl: number;

  @ApiProperty({
    description: 'Timestamp when context was cached',
    example: '2025-10-05T14:33:21.000Z',
  })
  cachedAt: string;

  @ApiProperty({
    description: 'Success message',
    example: 'Context cached successfully',
  })
  message: string;

  constructor(
    success: boolean,
    cacheKey: string,
    ttl: number,
    message: string,
  ) {
    this.success = success;
    this.cacheKey = cacheKey;
    this.ttl = ttl;
    this.cachedAt = new Date().toISOString();
    this.message = message;
  }
}
