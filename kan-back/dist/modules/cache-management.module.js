"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManagementModule = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const config_1 = require("@nestjs/config");
const redisStore = require("cache-manager-redis-store");
const cache_context_controller_1 = require("../features/cache-management/cache-context/cache-context.controller");
const cache_context_service_1 = require("../features/cache-management/cache-context/cache-context.service");
const get_cached_context_controller_1 = require("../features/cache-management/get-cached-context/get-cached-context.controller");
const get_cached_context_service_1 = require("../features/cache-management/get-cached-context/get-cached-context.service");
const cache_agent_configs_controller_1 = require("../features/cache-management/cache-agent-configs/cache-agent-configs.controller");
const cache_agent_configs_service_1 = require("../features/cache-management/cache-agent-configs/cache-agent-configs.service");
let CacheManagementModule = class CacheManagementModule {
};
exports.CacheManagementModule = CacheManagementModule;
exports.CacheManagementModule = CacheManagementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            cache_manager_1.CacheModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    store: redisStore,
                    host: configService.get('cache.redis.host', 'localhost'),
                    port: configService.get('cache.redis.port', 6379),
                    password: configService.get('cache.redis.password'),
                    db: configService.get('cache.redis.db', 0),
                    ttl: configService.get('cache.defaultTtl', 300),
                    max: configService.get('cache.maxItems', 1000),
                    keyPrefix: configService.get('cache.keyPrefix', 'kanban:'),
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [
            cache_context_controller_1.CacheContextController,
            get_cached_context_controller_1.GetCachedContextController,
            cache_agent_configs_controller_1.CacheAgentConfigsController,
        ],
        providers: [
            cache_context_service_1.CacheContextService,
            get_cached_context_service_1.GetCachedContextService,
            cache_agent_configs_service_1.CacheAgentConfigsService,
        ],
        exports: [
            cache_manager_1.CacheModule,
            cache_context_service_1.CacheContextService,
            get_cached_context_service_1.GetCachedContextService,
            cache_agent_configs_service_1.CacheAgentConfigsService,
        ],
    })
], CacheManagementModule);
//# sourceMappingURL=cache-management.module.js.map