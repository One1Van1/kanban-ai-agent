import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { CacheAgentConfigsRequestDto } from './cache-agent-configs.request.dto';
import { CacheAgentConfigsResponseDto } from './cache-agent-configs.response.dto';

@Injectable()
export class CacheAgentConfigsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {}

  async execute(
    dto: CacheAgentConfigsRequestDto,
  ): Promise<CacheAgentConfigsResponseDto> {
    const defaultTtl = this.configService.get<number>(
      'cache.agentConfigTtl',
      1800,
    );
    const keyPrefix = this.configService.get<string>(
      'cache.prefixes.agentConfig',
      'agent:',
    );
    const ttl = dto.ttl || defaultTtl;
    const fullKey = `${keyPrefix}${dto.agentId}`;

    try {
      await this.cacheManager.set(fullKey, dto.configData, ttl * 1000); // convert to milliseconds

      return new CacheAgentConfigsResponseDto(
        true,
        dto.agentId,
        fullKey,
        ttl,
        'Agent configuration cached successfully',
      );
    } catch (error) {
      throw new Error(`Failed to cache agent configuration: ${error.message}`);
    }
  }
}
