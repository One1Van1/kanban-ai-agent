"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiAddTaskTimelog = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const add_task_timelog_response_dto_1 = require("./add-task-timelog.response.dto");
const ApiAddTaskTimelog = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Add timelog entry to task',
    description: 'Creates a new timelog entry for tracking time spent on a specific task',
}), (0, swagger_1.ApiParam)({
    name: 'id',
    description: 'Task ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
}), (0, swagger_1.ApiCreatedResponse)({
    type: add_task_timelog_response_dto_1.AddTaskTimelogResponseDto,
    description: 'Timelog entry created successfully',
}), (0, swagger_1.ApiBadRequestResponse)({
    description: 'Invalid request data or time validation failed',
}));
exports.ApiAddTaskTimelog = ApiAddTaskTimelog;
//# sourceMappingURL=openapi.decorator.js.map