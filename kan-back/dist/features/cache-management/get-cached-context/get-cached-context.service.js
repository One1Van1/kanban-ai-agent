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
exports.GetCachedContextService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const config_1 = require("@nestjs/config");
const get_cached_context_response_dto_1 = require("./get-cached-context.response.dto");
let GetCachedContextService = class GetCachedContextService {
    cacheManager;
    configService;
    constructor(cacheManager, configService) {
        this.cacheManager = cacheManager;
        this.configService = configService;
    }
    async execute(key) {
        const keyPrefix = this.configService.get('cache.prefixes.context', 'ctx:');
        const fullKey = `${keyPrefix}${key}`;
        try {
            const contextData = await this.cacheManager.get(fullKey);
            if (contextData) {
                return new get_cached_context_response_dto_1.GetCachedContextResponseDto(true, key, contextData, 'Context retrieved successfully');
            }
            else {
                return new get_cached_context_response_dto_1.GetCachedContextResponseDto(false, key, null, 'Context not found in cache');
            }
        }
        catch (error) {
            throw new Error(`Failed to retrieve context from cache: ${error.message}`);
        }
    }
};
exports.GetCachedContextService = GetCachedContextService;
exports.GetCachedContextService = GetCachedContextService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, config_1.ConfigService])
], GetCachedContextService);
//# sourceMappingURL=get-cached-context.service.js.map