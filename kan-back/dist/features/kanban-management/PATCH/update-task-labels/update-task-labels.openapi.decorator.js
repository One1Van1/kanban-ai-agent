"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiUpdateTaskLabels = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const update_task_labels_request_dto_1 = require("./update-task-labels.request.dto");
const update_task_labels_response_dto_1 = require("./update-task-labels.response.dto");
const ApiUpdateTaskLabels = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Update task labels',
    description: `
        Updates labels on a task with different operations:
        - ADD: Add new labels to existing ones
        - REMOVE: Remove specific labels from task
        - REPLACE: Replace all labels with new set
        
        Labels are used for categorization, filtering, and organization.
      `,
}), (0, swagger_1.ApiParam)({
    name: 'taskId',
    description: 'UUID of the task to update labels for',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
}), (0, swagger_1.ApiBody)({
    type: update_task_labels_request_dto_1.UpdateTaskLabelsRequestDto,
    description: 'Label update configuration',
    examples: {
        addLabels: {
            summary: 'Add labels',
            description: 'Add new labels to existing ones',
            value: {
                operation: update_task_labels_request_dto_1.LabelOperation.ADD,
                labels: ['bug', 'high-priority'],
                updatedBy: 'user-123',
                updateReason: 'Added priority after triage',
            },
        },
        removeLabels: {
            summary: 'Remove labels',
            description: 'Remove specific labels from task',
            value: {
                operation: update_task_labels_request_dto_1.LabelOperation.REMOVE,
                labels: ['low-priority', 'draft'],
                updatedBy: 'user-456',
                updateReason: 'Removed outdated labels',
            },
        },
        replaceLabels: {
            summary: 'Replace all labels',
            description: 'Replace all existing labels with new set',
            value: {
                operation: update_task_labels_request_dto_1.LabelOperation.REPLACE,
                labels: ['feature', 'backend', 'ready-for-review'],
                updatedBy: 'user-789',
                updateReason: 'Updated labels after implementation',
            },
        },
    },
}), (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Labels successfully updated',
    type: update_task_labels_response_dto_1.UpdateTaskLabelsResponseDto,
    example: {
        taskId: '123e4567-e89b-12d3-a456-426614174000',
        operation: update_task_labels_request_dto_1.LabelOperation.ADD,
        currentLabels: ['bug', 'high-priority', 'backend', 'in-review'],
        addedLabels: ['high-priority', 'backend'],
        removedLabels: [],
        totalLabelsCount: 4,
        updatedAt: '2024-01-15T10:30:00.000Z',
        updatedBy: 'user-123',
        updateReason: 'Added priority after triage',
        success: true,
        labelChanges: [
            {
                labelName: 'high-priority',
                operation: 'added',
                timestamp: '2024-01-15T10:30:00.000Z',
            },
            {
                labelName: 'backend',
                operation: 'added',
                timestamp: '2024-01-15T10:30:00.000Z',
            },
        ],
        historyLogId: 'hist-789',
    },
}), (0, swagger_1.ApiBadRequestResponse)({
    description: 'Invalid label update request',
    example: {
        statusCode: 400,
        message: [
            'operation must be one of: ADD, REMOVE, REPLACE',
            'labels must be an array of strings',
        ],
        error: 'Bad Request',
    },
}), (0, swagger_1.ApiNotFoundResponse)({
    description: 'Task not found',
    example: {
        statusCode: 404,
        message: 'Task with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        error: 'Not Found',
    },
}), (0, swagger_1.ApiInternalServerErrorResponse)({
    description: 'Internal server error during label update',
    example: {
        statusCode: 500,
        message: 'Failed to update task labels',
        error: 'Internal Server Error',
    },
}));
exports.ApiUpdateTaskLabels = ApiUpdateTaskLabels;
//# sourceMappingURL=update-task-labels.openapi.decorator.js.map