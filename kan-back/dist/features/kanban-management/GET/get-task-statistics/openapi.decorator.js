"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGetTaskStatistics = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_task_statistics_response_dto_1 = require("./get-task-statistics.response.dto");
const ApiGetTaskStatistics = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Get task processing statistics',
    description: 'Retrieves aggregated statistics about task processing, optionally filtered by agent',
}), (0, swagger_1.ApiQuery)({
    name: 'agentId',
    description: 'UUID of agent to filter statistics (optional)',
    required: false,
    example: 'd5a9adec-daa3-48e2-a563-107f13ae2bcd',
}), (0, swagger_1.ApiOkResponse)({
    type: get_task_statistics_response_dto_1.GetTaskStatisticsResponseDto,
    description: 'Task processing statistics retrieved successfully',
}));
exports.ApiGetTaskStatistics = ApiGetTaskStatistics;
//# sourceMappingURL=openapi.decorator.js.map