"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiConfigureContextSources = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const configure_context_sources_response_dto_1 = require("./configure-context-sources.response.dto");
const ApiConfigureContextSources = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Configure context sources for AI agent',
    description: 'Creates and configures a new context source for an AI agent. Context sources define how the agent gathers information about tasks and their environment.',
}), (0, swagger_1.ApiCreatedResponse)({
    type: configure_context_sources_response_dto_1.ConfigureContextSourcesResponseDto,
    description: 'Context source configured successfully',
}), (0, swagger_1.ApiBadRequestResponse)({
    description: 'Invalid request data or configuration',
}), (0, swagger_1.ApiInternalServerErrorResponse)({
    description: 'Internal server error occurred',
}));
exports.ApiConfigureContextSources = ApiConfigureContextSources;
//# sourceMappingURL=openapi.decorator.js.map