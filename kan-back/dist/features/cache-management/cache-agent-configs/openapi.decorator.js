"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCacheAgentConfigs = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cache_agent_configs_response_dto_1 = require("./cache-agent-configs.response.dto");
const ApiCacheAgentConfigs = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Cache agent configuration data',
    description: 'Stores agent configuration in Redis cache with configurable TTL for fast access during AI processing',
}), (0, swagger_1.ApiCreatedResponse)({
    description: 'Agent configuration cached successfully',
    type: cache_agent_configs_response_dto_1.CacheAgentConfigsResponseDto,
}), (0, swagger_1.ApiBadRequestResponse)({
    description: 'Invalid agent configuration data',
}));
exports.ApiCacheAgentConfigs = ApiCacheAgentConfigs;
//# sourceMappingURL=openapi.decorator.js.map