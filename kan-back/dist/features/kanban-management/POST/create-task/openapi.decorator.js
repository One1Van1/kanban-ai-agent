"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCreateTask = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_task_response_dto_1 = require("./create-task.response.dto");
const ApiCreateTask = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Create a new task in the kanban system' }), (0, swagger_1.ApiCreatedResponse)({
    description: 'Task created successfully',
    type: create_task_response_dto_1.CreateTaskResponseDto,
}), (0, swagger_1.ApiConflictResponse)({
    description: 'Task with the same key already exists',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 409 },
            message: {
                type: 'string',
                example: 'Task with key PROJ-123 already exists',
            },
            error: { type: 'string', example: 'Conflict' },
        },
    },
}), (0, swagger_1.ApiBadRequestResponse)({
    description: 'Invalid request data',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 400 },
            message: { type: 'array', items: { type: 'string' } },
            error: { type: 'string', example: 'Bad Request' },
        },
    },
}));
exports.ApiCreateTask = ApiCreateTask;
//# sourceMappingURL=openapi.decorator.js.map