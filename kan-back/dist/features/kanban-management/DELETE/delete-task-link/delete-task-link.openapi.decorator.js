"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiDeleteTaskLink = ApiDeleteTaskLink;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const delete_task_link_request_dto_1 = require("./delete-task-link.request.dto");
const delete_task_link_response_dto_1 = require("./delete-task-link.response.dto");
function ApiDeleteTaskLink() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)('Kanban Management - Task Links'), (0, swagger_1.ApiOperation)({
        summary: 'Delete a link between tasks',
        description: `
        Removes a specific link/relationship between two tasks. This endpoint handles:
        - Deletion of task relationships (blocks, relates to, duplicates, etc.)
        - Removal of reciprocal links automatically
        - Audit trail creation for the deletion
        - Permission validation for link modifications
        
        Common use cases:
        - Remove blocking dependencies when tasks are completed
        - Correct incorrectly linked tasks
        - Clean up obsolete task relationships
        - Manage task dependency changes
      `,
        operationId: 'deleteTaskLink',
    }), (0, swagger_1.ApiParam)({
        name: 'taskId',
        description: 'UUID of the task containing the link to delete',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }), (0, swagger_1.ApiParam)({
        name: 'linkId',
        description: 'UUID of the specific link to delete',
        example: 'link-456e7890-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }), (0, swagger_1.ApiBody)({
        type: delete_task_link_request_dto_1.DeleteTaskLinkRequestDto,
        description: 'Optional metadata for the link deletion',
        required: false,
        examples: {
            basic: {
                summary: 'Basic deletion',
                description: 'Delete link without additional metadata',
                value: {},
            },
            withMetadata: {
                summary: 'Deletion with metadata',
                description: 'Delete link with user and reason tracking',
                value: {
                    deletedBy: 'user-123e4567-e89b-12d3-a456-426614174000',
                    deleteReason: 'Task dependencies changed after requirements update',
                },
            },
            systemDeletion: {
                summary: 'System-initiated deletion',
                description: 'Automatic cleanup when task is completed',
                value: {
                    deleteReason: 'Automatic cleanup - blocking task completed',
                },
            },
        },
    }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Link successfully deleted with details',
        type: delete_task_link_response_dto_1.DeleteTaskLinkResponseDto,
        example: {
            taskId: '123e4567-e89b-12d3-a456-426614174000',
            linkId: 'link-456e7890-e89b-12d3-a456-426614174000',
            linkedTaskId: '789e1234-e89b-12d3-a456-426614174000',
            linkType: 'blocks',
            linkDirection: 'outbound',
            deletedBy: 'user-123e4567-e89b-12d3-a456-426614174000',
            deletedAt: '2024-01-15T10:30:00.000Z',
            deleteReason: 'Task dependencies changed after requirements update',
            linkedTaskTitle: 'Setup database configuration',
            remainingLinksCount: 2,
            success: true,
            historyLogId: 'hist-789e4567-e89b-12d3-a456-426614174000',
        },
    }), (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid request parameters or malformed UUIDs',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 400 },
                message: {
                    type: 'string',
                    example: 'Validation failed (uuid is expected)',
                },
                error: { type: 'string', example: 'Bad Request' },
            },
        },
    }), (0, swagger_1.ApiNotFoundResponse)({
        description: 'Task, link, or linked task not found',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 404 },
                message: {
                    oneOf: [
                        {
                            type: 'string',
                            example: 'Task with ID 123e4567-e89b-12d3-a456-426614174000 not found',
                        },
                        {
                            type: 'string',
                            example: 'Link with ID link-456e7890-e89b-12d3-a456-426614174000 not found on task 123e4567-e89b-12d3-a456-426614174000',
                        },
                        {
                            type: 'string',
                            example: 'Linked task with ID 789e1234-e89b-12d3-a456-426614174000 not found',
                        },
                    ],
                },
                error: { type: 'string', example: 'Not Found' },
            },
        },
    }), (0, swagger_1.ApiForbiddenResponse)({
        description: 'Insufficient permissions to delete task links',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 403 },
                message: {
                    type: 'string',
                    example: 'Insufficient permissions to delete task links',
                },
                error: { type: 'string', example: 'Forbidden' },
            },
        },
    }), (0, swagger_1.ApiInternalServerErrorResponse)({
        description: 'Internal server error during link deletion',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 500 },
                message: { type: 'string', example: 'Internal server error' },
                error: { type: 'string', example: 'Internal Server Error' },
            },
        },
    }));
}
//# sourceMappingURL=delete-task-link.openapi.decorator.js.map