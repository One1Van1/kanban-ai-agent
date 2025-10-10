"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiConfigureAgent = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const configure_agent_response_dto_1 = require("./configure-agent.response.dto");
const ApiConfigureAgent = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Configure existing AI agent' }), (0, swagger_1.ApiParam)({ name: 'agentId', description: 'Agent ID to configure' }), (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'AI agent configured successfully',
    type: configure_agent_response_dto_1.ConfigureAgentResponseDto,
}), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request data' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Agent not found' }), (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }));
exports.ApiConfigureAgent = ApiConfigureAgent;
//# sourceMappingURL=openapi.decorator.js.map