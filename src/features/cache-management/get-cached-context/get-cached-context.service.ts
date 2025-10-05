import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { GetCachedContextResponseDto } from './get-cached-context.response.dto';

@Injectable()
export class GetCachedContextService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {}

  async execute(key: string): Promise<GetCachedContextResponseDto> {
    const keyPrefix = this.configService.get<string>(
      'cache.prefixes.context',
      'ctx:',
    );
    const fullKey = `${keyPrefix}${key}`;

    try {
      const contextData =
        await this.cacheManager.get<Record<string, any>>(fullKey);

      if (contextData) {
        return new GetCachedContextResponseDto(
          true,
          key,
          contextData,
          'Context retrieved successfully',
        );
      } else {
        return new GetCachedContextResponseDto(
          false,
          key,
          null,
          'Context not found in cache',
        );
      }
    } catch (error) {
      throw new Error(
        `Failed to retrieve context from cache: ${error.message}`,
      );
    }
  }
}
