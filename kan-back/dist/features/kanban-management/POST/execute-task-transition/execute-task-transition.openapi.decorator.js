"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteTaskTransitionOpenApi = ExecuteTaskTransitionOpenApi;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const execute_task_transition_request_dto_1 = require("./execute-task-transition.request.dto");
const execute_task_transition_response_dto_1 = require("./execute-task-transition.response.dto");
function ExecuteTaskTransitionOpenApi() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary: 'Execute task status transition',
        description: 'Executes a status transition for a task with validation and history logging',
    }), (0, swagger_1.ApiParam)({
        name: 'taskId',
        description: 'Unique identifier of the task',
        example: 'a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a',
    }), (0, swagger_1.ApiBody)({
        type: execute_task_transition_request_dto_1.ExecuteTaskTransitionRequestDto,
        description: 'Transition parameters',
        examples: {
            startProgress: {
                summary: 'Start Progress',
                description: 'Move task from todo to in_progress',
                value: {
                    action: 'start_progress',
                    toStatus: 'in_progress',
                    toColumn: 'In Progress',
                    executedBy: 'agent-001',
                    comment: 'Starting work on this task',
                },
            },
            submitForReview: {
                summary: 'Submit for Review',
                description: 'Move task from in_progress to in_review',
                value: {
                    action: 'submit_for_review',
                    toStatus: 'in_review',
                    toColumn: 'In Review',
                    executedBy: 'agent-001',
                    comment: 'Task implementation completed, ready for review',
                },
            },
            complete: {
                summary: 'Complete Task',
                description: 'Complete task with resolution',
                value: {
                    action: 'complete',
                    toStatus: 'done',
                    toColumn: 'Done',
                    executedBy: 'agent-001',
                    comment: 'Task completed successfully',
                    resolution: 'Fixed',
                },
            },
        },
    }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transition executed successfully',
        type: execute_task_transition_response_dto_1.ExecuteTaskTransitionResponseDto,
    }), (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid transition or validation failed',
        schema: {
            example: {
                statusCode: 400,
                message: 'Cannot execute start_progress from status done. Allowed from: todo, blocked',
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
        description: 'Internal server error during transition execution',
        schema: {
            example: {
                statusCode: 500,
                message: 'Failed to execute task transition',
                error: 'Internal Server Error',
            },
        },
    }));
}
//# sourceMappingURL=execute-task-transition.openapi.decorator.js.map