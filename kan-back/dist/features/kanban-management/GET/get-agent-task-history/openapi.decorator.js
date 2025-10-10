"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGetAgentTaskHistory = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_agent_task_history_response_dto_1 = require("./get-agent-task-history.response.dto");
const ApiGetAgentTaskHistory = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Get task history records by agent ID',
    description: 'Retrieves task history records for a specific agent with optional limit',
}), (0, swagger_1.ApiParam)({
    name: 'agentId',
    description: 'UUID of the agent to get history for',
    example: 'd5a9adec-daa3-48e2-a563-107f13ae2bcd',
}), (0, swagger_1.ApiQuery)({
    name: 'limit',
    description: 'Maximum number of records to return (1-1000)',
    required: false,
    type: Number,
    example: 50,
}), (0, swagger_1.ApiOkResponse)({
    type: get_agent_task_history_response_dto_1.GetAgentTaskHistoryResponseDto,
    description: 'Task history records retrieved successfully',
}));
exports.ApiGetAgentTaskHistory = ApiGetAgentTaskHistory;
//# sourceMappingURL=openapi.decorator.js.map