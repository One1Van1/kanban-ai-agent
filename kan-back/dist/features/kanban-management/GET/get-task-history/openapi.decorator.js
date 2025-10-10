"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGetTaskHistory = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_task_history_response_dto_1 = require("./get-task-history.response.dto");
const ApiGetTaskHistory = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Get task history records by task ID',
    description: 'Retrieves all task history records for a specific task',
}), (0, swagger_1.ApiParam)({
    name: 'taskId',
    description: 'ID of the task to get history for',
    example: 'TASK-123',
}), (0, swagger_1.ApiOkResponse)({
    type: get_task_history_response_dto_1.GetTaskHistoryResponseDto,
    description: 'Task history records retrieved successfully',
}));
exports.ApiGetTaskHistory = ApiGetTaskHistory;
//# sourceMappingURL=openapi.decorator.js.map