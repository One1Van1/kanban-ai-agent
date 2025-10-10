"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiMoveTaskToColumn = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const move_task_response_dto_1 = require("./move-task-response.dto");
const ApiMoveTaskToColumn = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Move a task to a different column' }), (0, swagger_1.ApiParam)({
    name: 'id',
    type: 'string',
    description: 'Task ID',
    example: 'PROJ-123',
}), (0, swagger_1.ApiOkResponse)({
    description: 'Task moved successfully',
    type: move_task_response_dto_1.MoveTaskResponseDto,
}), (0, swagger_1.ApiNotFoundResponse)({
    description: 'Task not found',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 404 },
            message: {
                type: 'string',
                example: 'Task with ID PROJ-123 not found',
            },
            error: { type: 'string', example: 'Not Found' },
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
exports.ApiMoveTaskToColumn = ApiMoveTaskToColumn;
//# sourceMappingURL=openapi.decorator.js.map