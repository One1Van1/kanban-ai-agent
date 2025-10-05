import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

// Cache Context endpoint imports
import { CacheContextController } from '../features/cache-management/cache-context/cache-context.controller';
import { CacheContextService } from '../features/cache-management/cache-context/cache-context.service';

// Get Cached Context endpoint imports
import { GetCachedContextController } from '../features/cache-management/get-cached-context/get-cached-context.controller';
import { GetCachedContextService } from '../features/cache-management/get-cached-context/get-cached-context.service';

// Cache Agent Configs endpoint imports
import { CacheAgentConfigsController } from '../features/cache-management/cache-agent-configs/cache-agent-configs.controller';
import { CacheAgentConfigsService } from '../features/cache-management/cache-agent-configs/cache-agent-configs.service';

@Module({
  imports: [
    ConfigModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('cache.redis.host', 'localhost'),
        port: configService.get<number>('cache.redis.port', 6379),
        password: configService.get<string>('cache.redis.password'),
        db: configService.get<number>('cache.redis.db', 0),
        ttl: configService.get<number>('cache.defaultTtl', 300),
        max: configService.get<number>('cache.maxItems', 1000),
        keyPrefix: configService.get<string>('cache.keyPrefix', 'kanban:'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    CacheContextController,
    GetCachedContextController,
    CacheAgentConfigsController,
  ],
  providers: [
    CacheContextService,
    GetCachedContextService,
    CacheAgentConfigsService,
  ],
  exports: [
    CacheModule,
    CacheContextService,
    GetCachedContextService,
    CacheAgentConfigsService,
  ],
})
export class CacheManagementModule {}
