"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiStoreAgentConfig = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const store_agent_config_response_dto_1 = require("./store-agent-config.response.dto");
const ApiStoreAgentConfig = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Store or update agent configuration in database',
    description: 'Creates a new agent or updates existing agent configuration with instructions in the database',
}), (0, swagger_1.ApiOkResponse)({
    type: store_agent_config_response_dto_1.StoreAgentConfigResponseDto,
    description: 'Agent configuration stored successfully',
}), (0, swagger_1.ApiBadRequestResponse)({
    description: 'Invalid request data',
}), (0, swagger_1.ApiNotFoundResponse)({
    description: 'Agent not found (when updating existing agent)',
}));
exports.ApiStoreAgentConfig = ApiStoreAgentConfig;
//# sourceMappingURL=openapi.decorator.js.map