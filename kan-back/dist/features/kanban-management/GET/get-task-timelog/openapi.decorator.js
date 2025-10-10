"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGetTaskTimelog = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_task_timelog_response_dto_1 = require("./get-task-timelog.response.dto");
const ApiGetTaskTimelog = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Get task timelog entries',
    description: 'Retrieves paginated timelog entries for a specific task with summary statistics',
}), (0, swagger_1.ApiParam)({
    name: 'id',
    description: 'Task ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
}), (0, swagger_1.ApiQuery)({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
}), (0, swagger_1.ApiQuery)({
    name: 'limit',
    required: false,
    description: 'Number of timelog entries per page',
    example: 20,
}), (0, swagger_1.ApiQuery)({
    name: 'fromDate',
    required: false,
    description: 'Filter entries from this date',
    example: '2024-01-01T00:00:00Z',
}), (0, swagger_1.ApiQuery)({
    name: 'toDate',
    required: false,
    description: 'Filter entries to this date',
    example: '2024-01-31T23:59:59Z',
}), (0, swagger_1.ApiOkResponse)({
    type: get_task_timelog_response_dto_1.GetTaskTimelogResponseDto,
    description: 'Task timelog retrieved successfully',
}), (0, swagger_1.ApiBadRequestResponse)({
    description: 'Invalid request parameters',
}));
exports.ApiGetTaskTimelog = ApiGetTaskTimelog;
//# sourceMappingURL=openapi.decorator.js.map