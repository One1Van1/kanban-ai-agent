"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaskAssignmentOpenApi = UpdateTaskAssignmentOpenApi;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const update_task_assignment_request_dto_1 = require("./update-task-assignment.request.dto");
const update_task_assignment_response_dto_1 = require("./update-task-assignment.response.dto");
function UpdateTaskAssignmentOpenApi() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary: 'Update task assignment',
        description: 'Updates task assignment including assignee, watchers, and assignment details with notification support',
    }), (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Unique identifier of the task to update assignment for',
        example: 'a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a',
    }), (0, swagger_1.ApiBody)({
        type: update_task_assignment_request_dto_1.UpdateTaskAssignmentRequestDto,
        description: 'Assignment update parameters',
        examples: {
            reassign: {
                summary: 'Reassign Task',
                description: 'Reassign task to different user',
                value: {
                    action: 'reassign',
                    assignee: 'agent-002',
                    assignmentReason: 'Reassigning to team member with more relevant expertise',
                    notifyAssignees: true,
                    updatedBy: 'agent-001',
                },
            },
            addWatchers: {
                summary: 'Add Watchers',
                description: 'Add watchers to track task progress',
                value: {
                    action: 'add_watcher',
                    watchers: ['agent-003', 'agent-004', 'agent-005'],
                    assignmentReason: 'Adding stakeholders to watch progress',
                    notifyAssignees: true,
                    updatedBy: 'agent-001',
                },
            },
            detailedAssignment: {
                summary: 'Detailed Assignment',
                description: 'Assign with detailed role and timeline information',
                value: {
                    action: 'assign',
                    assignee: 'agent-002',
                    watchers: ['agent-003', 'agent-004'],
                    assignmentDetails: [
                        {
                            userId: 'agent-002',
                            role: 'primary_assignee',
                            startDate: '2024-01-15T09:00:00Z',
                            endDate: '2024-01-20T17:00:00Z',
                        },
                        {
                            userId: 'agent-003',
                            role: 'reviewer',
                            startDate: '2024-01-19T09:00:00Z',
                            endDate: '2024-01-20T17:00:00Z',
                        },
                    ],
                    assignmentPriority: 'high',
                    assignmentReason: 'Critical feature for upcoming release',
                    notifyAssignees: true,
                    updatedBy: 'agent-001',
                },
            },
            unassign: {
                summary: 'Unassign Task',
                description: 'Remove current assignee from task',
                value: {
                    action: 'unassign',
                    assignmentReason: 'Task on hold pending requirements clarification',
                    notifyAssignees: true,
                    updatedBy: 'agent-001',
                },
            },
        },
    }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Task assignment updated successfully',
        type: update_task_assignment_response_dto_1.UpdateTaskAssignmentResponseDto,
    }), (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid assignment action or missing required fields',
        schema: {
            example: {
                statusCode: 400,
                message: 'Assignee is required for assign action',
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
        description: 'Internal server error during assignment update',
        schema: {
            example: {
                statusCode: 500,
                message: 'Failed to update task assignment',
                error: 'Internal Server Error',
            },
        },
    }));
}
//# sourceMappingURL=update-task-assignment.openapi.decorator.js.map