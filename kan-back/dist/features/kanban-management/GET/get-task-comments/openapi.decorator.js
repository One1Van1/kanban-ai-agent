"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGetTaskComments = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_task_comments_response_dto_1 = require("./get-task-comments.response.dto");
const ApiGetTaskComments = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Get task comments with pagination',
    description: 'Retrieves all comments for a specific task with pagination support',
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
    description: 'Number of comments per page',
    example: 20,
}), (0, swagger_1.ApiQuery)({
    name: 'sortOrder',
    required: false,
    description: 'Sort order by creation date',
    example: 'DESC',
}), (0, swagger_1.ApiOkResponse)({
    type: get_task_comments_response_dto_1.GetTaskCommentsResponseDto,
    description: 'Task comments retrieved successfully',
}), (0, swagger_1.ApiBadRequestResponse)({
    description: 'Invalid request parameters',
}));
exports.ApiGetTaskComments = ApiGetTaskComments;
//# sourceMappingURL=openapi.decorator.js.map