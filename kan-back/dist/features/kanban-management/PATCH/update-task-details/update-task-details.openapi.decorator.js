"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaskDetailsOpenApi = UpdateTaskDetailsOpenApi;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const update_task_details_request_dto_1 = require("./update-task-details.request.dto");
const update_task_details_response_dto_1 = require("./update-task-details.response.dto");
function UpdateTaskDetailsOpenApi() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary: 'Update task details',
        description: 'Updates various task properties like title, description, priority, assignee, etc. with change tracking',
    }), (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Unique identifier of the task to update',
        example: 'a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a',
    }), (0, swagger_1.ApiBody)({
        type: update_task_details_request_dto_1.UpdateTaskDetailsRequestDto,
        description: 'Task update parameters',
        examples: {
            priorityUpdate: {
                summary: 'Update Priority',
                description: 'Update task priority and assignee',
                value: {
                    priority: 'high',
                    assignee: 'agent-002',
                    updatedBy: 'agent-001',
                    updateComment: 'Escalating priority due to urgent business requirement',
                },
            },
            fullUpdate: {
                summary: 'Comprehensive Update',
                description: 'Update multiple task fields',
                value: {
                    title: 'Implement user authentication with OAuth2 and 2FA',
                    description: 'Add OAuth2 integration for Google and GitHub authentication providers with two-factor authentication',
                    priority: 'high',
                    type: 'story',
                    assignee: 'agent-002',
                    labels: ['frontend', 'authentication', 'security', '2fa'],
                    estimatedHours: 12,
                    storyPoints: 8,
                    dueDate: '2024-01-25T23:59:59Z',
                    updatedBy: 'agent-001',
                    updateComment: 'Updated scope to include 2FA requirement',
                },
            },
            customFieldsUpdate: {
                summary: 'Custom Fields Update',
                description: 'Update task with custom fields',
                value: {
                    customFields: [
                        { name: 'Sprint', value: 'Sprint 24.2' },
                        { name: 'Component', value: 'Authentication Module' },
                        { name: 'Test Coverage', value: '95%' },
                    ],
                    updatedBy: 'agent-001',
                    updateComment: 'Updated sprint and component information',
                },
            },
        },
    }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Task details updated successfully',
        type: update_task_details_response_dto_1.UpdateTaskDetailsResponseDto,
    }), (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid input data or no fields to update',
        schema: {
            example: {
                statusCode: 400,
                message: 'No fields to update provided',
                error: 'Bad Request',
            },
        },
    }), (0, swagger_1.ApiNotFoundResponse)({
        description: 'Task not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Task with ID a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a not found',
                error: 'Not Found',
            },
        },
    }), (0, swagger_1.ApiInternalServerErrorResponse)({
        description: 'Internal server error during task update',
        schema: {
            example: {
                statusCode: 500,
                message: 'Failed to update task details',
                error: 'Internal Server Error',
            },
        },
    }));
}
//# sourceMappingURL=update-task-details.openapi.decorator.js.map