"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGetTasksByColumn = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_tasks_by_column_response_dto_1 = require("./get-tasks-by-column.response.dto");
const ApiGetTasksByColumn = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Get all tasks in a specific column with pagination',
}), (0, swagger_1.ApiParam)({
    name: 'column',
    type: 'string',
    description: 'Column name',
    example: 'In Progress',
}), (0, swagger_1.ApiQuery)({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'Number of tasks to return (1-100)',
    example: 10,
}), (0, swagger_1.ApiQuery)({
    name: 'offset',
    type: 'number',
    required: false,
    description: 'Number of tasks to skip',
    example: 0,
}), (0, swagger_1.ApiOkResponse)({
    description: 'Tasks retrieved successfully',
    type: get_tasks_by_column_response_dto_1.GetTasksByColumnResponseDto,
}));
exports.ApiGetTasksByColumn = ApiGetTasksByColumn;
//# sourceMappingURL=openapi.decorator.js.map