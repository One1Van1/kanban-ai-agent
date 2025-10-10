"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCacheContext = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cache_context_response_dto_1 = require("./cache-context.response.dto");
const ApiCacheContext = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Cache context data for AI agent processing',
    description: 'Stores context data in Redis cache with configurable TTL for efficient retrieval during AI agent processing',
}), (0, swagger_1.ApiCreatedResponse)({
    description: 'Context cached successfully',
    type: cache_context_response_dto_1.CacheContextResponseDto,
}), (0, swagger_1.ApiBadRequestResponse)({
    description: 'Invalid request data',
}));
exports.ApiCacheContext = ApiCacheContext;
//# sourceMappingURL=openapi.decorator.js.map