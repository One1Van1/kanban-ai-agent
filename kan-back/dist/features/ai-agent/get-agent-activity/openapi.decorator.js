"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGetAgentActivity = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_agent_activity_response_dto_1 = require("./get-agent-activity.response.dto");
const get_agent_activity_request_dto_1 = require("./get-agent-activity.request.dto");
const ApiGetAgentActivity = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Get AI agent activity history',
    description: 'Retrieves the execution history and activity log for a specific AI agent. Supports filtering by result status, task ID, date range and pagination.',
}), (0, swagger_1.ApiParam)({
    name: 'agentId',
    description: 'ID of the AI agent to get activity for',
    example: 'agent_123',
}), (0, swagger_1.ApiQuery)({
    name: 'limit',
    description: 'Number of activities to return (1-100)',
    required: false,
    example: 10,
}), (0, swagger_1.ApiQuery)({
    name: 'offset',
    description: 'Number of activities to skip for pagination',
    required: false,
    example: 0,
}), (0, swagger_1.ApiQuery)({
    name: 'result',
    enum: get_agent_activity_request_dto_1.ActivityResultFilter,
    enumName: 'ActivityResultFilter',
    description: 'Filter by activity result status',
    required: false,
    example: get_agent_activity_request_dto_1.ActivityResultFilter.ALL,
}), (0, swagger_1.ApiQuery)({
    name: 'taskId',
    description: 'Filter activities by specific task ID',
    required: false,
    example: 'task_456',
}), (0, swagger_1.ApiQuery)({
    name: 'fromDate',
    description: 'Filter activities from this date (YYYY-MM-DD)',
    required: false,
    example: '2023-12-01',
}), (0, swagger_1.ApiQuery)({
    name: 'toDate',
    description: 'Filter activities to this date (YYYY-MM-DD)',
    required: false,
    example: '2023-12-07',
}), (0, swagger_1.ApiOkResponse)({
    type: get_agent_activity_response_dto_1.GetAgentActivityResponseDto,
    description: 'Agent activity retrieved successfully',
}), (0, swagger_1.ApiBadRequestResponse)({
    description: 'Invalid request parameters or agent ID',
}));
exports.ApiGetAgentActivity = ApiGetAgentActivity;
//# sourceMappingURL=openapi.decorator.js.map