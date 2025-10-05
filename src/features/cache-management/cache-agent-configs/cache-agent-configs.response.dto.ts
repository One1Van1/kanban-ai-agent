import { ApiProperty } from '@nestjs/swagger';

export class CacheAgentConfigsResponseDto {
  @ApiProperty({
    description: 'Indicates if agent config was cached successfully',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Agent ID for which config was cached',
    example: 'agent-uuid-123',
  })
  agentId: string;

  @ApiProperty({
    description: 'Cache key where agent config was stored',
    example: 'agent:agent-uuid-123',
  })
  cacheKey: string;

  @ApiProperty({
    description: 'TTL applied to the cached agent config in seconds',
    example: 1800,
  })
  ttl: number;

  @ApiProperty({
    description: 'Timestamp when agent config was cached',
    example: '2025-10-05T14:33:21.000Z',
  })
  cachedAt: string;

  @ApiProperty({
    description: 'Success message',
    example: 'Agent configuration cached successfully',
  })
  message: string;

  constructor(
    success: boolean,
    agentId: string,
    cacheKey: string,
    ttl: number,
    message: string,
  ) {
    this.success = success;
    this.agentId = agentId;
    this.cacheKey = cacheKey;
    this.ttl = ttl;
    this.cachedAt = new Date().toISOString();
    this.message = message;
  }
}
