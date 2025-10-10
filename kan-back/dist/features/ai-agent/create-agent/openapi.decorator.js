"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCreateAgent = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_agent_response_dto_1 = require("./create-agent.response.dto");
const ApiCreateAgent = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Create new AI agent' }), (0, swagger_1.ApiResponse)({
    status: 201,
    description: 'AI agent created successfully',
    type: create_agent_response_dto_1.CreateAgentResponseDto,
}), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request data' }), (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }));
exports.ApiCreateAgent = ApiCreateAgent;
//# sourceMappingURL=openapi.decorator.js.map