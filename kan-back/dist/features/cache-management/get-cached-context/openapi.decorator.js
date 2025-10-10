"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGetCachedContext = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_cached_context_response_dto_1 = require("./get-cached-context.response.dto");
const ApiGetCachedContext = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Retrieve cached context data by key',
    description: 'Retrieves previously cached context data from Redis using the cache key',
}), (0, swagger_1.ApiParam)({
    name: 'key',
    description: 'Cache key to retrieve context data',
    example: 'task-123-context',
}), (0, swagger_1.ApiOkResponse)({
    description: 'Context retrieved successfully (or not found)',
    type: get_cached_context_response_dto_1.GetCachedContextResponseDto,
}), (0, swagger_1.ApiNotFoundResponse)({
    description: 'Cache key not found',
}));
exports.ApiGetCachedContext = ApiGetCachedContext;
//# sourceMappingURL=openapi.decorator.js.map