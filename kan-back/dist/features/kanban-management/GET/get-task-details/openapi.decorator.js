"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGetTaskDetails = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_task_details_response_dto_1 = require("./get-task-details.response.dto");
const ApiGetTaskDetails = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get detailed task information by ID' }), (0, swagger_1.ApiParam)({
    name: 'id',
    type: 'number',
    description: 'Task ID',
    example: 123,
}), (0, swagger_1.ApiOkResponse)({
    description: 'Task details retrieved successfully',
    type: get_task_details_response_dto_1.GetTaskDetailsResponseDto,
}), (0, swagger_1.ApiNotFoundResponse)({
    description: 'Task not found',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 404 },
            message: { type: 'string', example: 'Task with ID 123 not found' },
            error: { type: 'string', example: 'Not Found' },
        },
    },
}));
exports.ApiGetTaskDetails = ApiGetTaskDetails;
//# sourceMappingURL=openapi.decorator.js.map