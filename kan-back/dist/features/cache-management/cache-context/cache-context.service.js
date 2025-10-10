"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheContextService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const config_1 = require("@nestjs/config");
const cache_context_response_dto_1 = require("./cache-context.response.dto");
let CacheContextService = class CacheContextService {
    cacheManager;
    configService;
    constructor(cacheManager, configService) {
        this.cacheManager = cacheManager;
        this.configService = configService;
    }
    async execute(dto) {
        const defaultTtl = this.configService.get('cache.contextTtl', 600);
        const keyPrefix = this.configService.get('cache.prefixes.context', 'ctx:');
        const ttl = dto.ttl || defaultTtl;
        const fullKey = `${keyPrefix}${dto.key}`;
        try {
            await this.cacheManager.set(fullKey, dto.contextData, ttl * 1000);
            return new cache_context_response_dto_1.CacheContextResponseDto(true, dto.key, ttl, 'Context cached successfully');
        }
        catch (error) {
            throw new Error(`Failed to cache context: ${error.message}`);
        }
    }
};
exports.CacheContextService = CacheContextService;
exports.CacheContextService = CacheContextService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, config_1.ConfigService])
], CacheContextService);
//# sourceMappingURL=cache-context.service.js.map