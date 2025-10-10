import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { CacheContextRequestDto } from './cache-context.request.dto';
import { CacheContextResponseDto } from './cache-context.response.dto';

@Injectable()
export class CacheContextService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {}

  async execute(dto: CacheContextRequestDto): Promise<CacheContextResponseDto> {
    const defaultTtl = this.configService.get<number>('cache.contextTtl', 600);
    const keyPrefix = this.configService.get<string>(
      'cache.prefixes.context',
      'ctx:',
    );
    const ttl = dto.ttl || defaultTtl;
    const fullKey = `${keyPrefix}${dto.key}`;

    try {
      await this.cacheManager.set(fullKey, dto.contextData, ttl * 1000); // convert to milliseconds

      return new CacheContextResponseDto(
        true,
        dto.key,
        ttl,
        'Context cached successfully',
      );
    } catch (error) {
      throw new Error(`Failed to cache context: ${error.message}`);
    }
  }
}
