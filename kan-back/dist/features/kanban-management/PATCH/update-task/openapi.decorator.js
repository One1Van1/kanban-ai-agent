"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiUpdateTask = ApiUpdateTask;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const update_task_request_dto_1 = require("./update-task.request.dto");
const update_task_response_dto_1 = require("./update-task.response.dto");
function ApiUpdateTask() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary: 'Partially update task information',
        description: `
        Partially updates task information while preserving task history and position.
        This endpoint allows AI agents and system components to modify specific task fields
        without affecting other task properties. Only provided fields will be updated.

        **Key Features:**
        - **Partial Updates**: Only specified fields are modified
        - **Data Preservation**: Unspecified fields remain unchanged
        - **Position Preservation**: Task status and column preserved by default
        - **Change Tracking**: Detailed history of what was actually changed
        - **Flexible Updates**: Support for any combination of fields

        **PATCH Semantics:**
        This endpoint follows REST PATCH semantics:
        - Only modifies provided fields
        - Preserves existing field values for omitted fields
        - Idempotent for the same input data
        - Efficient for targeted updates

        **Update Process:**
        1. Validates task exists
        2. Compares provided values with current values
        3. Updates only fields that have actually changed
        4. Creates TaskHistory record with change details
        5. Returns comprehensive update summary

        **Supported Field Updates:**
        - Basic info: title, description, taskKey
        - Priority and assignment details
        - Metadata: tags, dueDate, estimatedHours
        - Custom context and fields
        - Administrative: updateReason, updatedBy

        **Change Detection:**
        The system intelligently detects actual changes and only records
        meaningful updates, avoiding unnecessary history entries for unchanged values.

        **Use Cases:**
        - AI agent updating specific task aspects
        - User editing individual task fields
        - Bulk property updates from external systems
        - Automated task enrichment and metadata updates
        - Assignment changes without affecting other properties

        **Position Preservation:**
        By default, PATCH preserves the task's current column and status.
        This is ideal for content updates that shouldn't affect workflow position.
      `,
        tags: ['Kanban Management', 'Task Updates', 'Partial Updates'],
    }), (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Unique identifier of the task to update',
        example: '550e8400-e29b-41d4-a716-446655440000',
        type: 'string',
    }), (0, swagger_1.ApiBody)({
        type: update_task_request_dto_1.UpdateTaskRequestDto,
        description: 'Partial task update data - provide only fields that need to be changed',
        examples: {
            priority_update: {
                summary: 'Update only priority',
                value: {
                    priority: 'high',
                    updateReason: 'Client escalation',
                    triggerType: 'manual',
                },
            },
            assignment_change: {
                summary: 'Change task assignment',
                value: {
                    assigneeEmail: 'expert@example.com',
                    assigneeName: 'Expert Developer',
                    updateReason: 'Reassigning to specialist',
                    updatedByEmail: 'lead@example.com',
                    triggerType: 'manual',
                },
            },
            content_update: {
                summary: 'Update title and description',
                value: {
                    title: 'Обновленное название задачи',
                    description: 'Новое подробное описание с дополнительными требованиями',
                    updateReason: 'Requirements clarification',
                    triggerType: 'manual',
                },
            },
            metadata_enrichment: {
                summary: 'Add metadata and tags',
                value: {
                    tags: ['urgent', 'security', 'hotfix'],
                    dueDate: '2024-01-20T10:00:00Z',
                    estimatedHours: 16,
                    context: {
                        securityLevel: 'high',
                        clientId: 'enterprise-123',
                    },
                    updateReason: 'Security escalation',
                    triggerType: 'manual',
                },
            },
            ai_agent_update: {
                summary: 'AI agent partial update',
                value: {
                    description: 'Автоматически обновленное описание после анализа',
                    estimatedHours: 8,
                    context: {
                        aiAnalysis: {
                            complexity: 'medium',
                            confidence: 0.92,
                        },
                    },
                    agentId: 'analysis-agent-456',
                    triggerType: 'agent_instruction',
                    sendNotifications: false,
                },
            },
            minimal_update: {
                summary: 'Single field update',
                value: {
                    priority: 'low',
                },
            },
        },
    }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Task partially updated successfully',
        type: update_task_response_dto_1.UpdateTaskResponseDto,
        examples: {
            successful_patch: {
                summary: 'Successful partial update',
                value: {
                    success: true,
                    message: 'Task updated successfully with 2 changes',
                    taskId: '550e8400-e29b-41d4-a716-446655440000',
                    updatedTask: {
                        id: 'history-record-123',
                        taskId: '550e8400-e29b-41d4-a716-446655440000',
                        taskKey: 'TASK-123',
                        title: 'Updated Task Title',
                        description: 'Existing description unchanged',
                        priority: 'high',
                        assigneeEmail: 'existing@example.com',
                        assigneeName: 'Existing Assignee',
                        currentColumn: 'in-progress',
                        currentStatus: 'in-progress',
                        updatedAt: '2024-01-01T12:00:00Z',
                    },
                    changes: [
                        {
                            field: 'title',
                            oldValue: 'Original Title',
                            newValue: 'Updated Task Title',
                            updatedAt: '2024-01-01T12:00:00Z',
                        },
                        {
                            field: 'priority',
                            oldValue: 'medium',
                            newValue: 'high',
                            updatedAt: '2024-01-01T12:00:00Z',
                        },
                    ],
                    timestamp: '2024-01-01T12:00:00.000Z',
                    metadata: {
                        changesCount: 2,
                        preservedPosition: true,
                        fieldsPreserved: ['description', 'assigneeEmail', 'tags'],
                        queueJobId: 'patch-job-123',
                    },
                },
            },
            no_changes_patch: {
                summary: 'No changes detected',
                value: {
                    success: true,
                    message: 'No changes detected - task is already up to date',
                    taskId: '550e8400-e29b-41d4-a716-446655440000',
                    updatedTask: {
                        id: 'existing-record-123',
                        taskId: '550e8400-e29b-41d4-a716-446655440000',
                        title: 'Existing Title',
                        priority: 'medium',
                        currentColumn: 'todo',
                        currentStatus: 'todo',
                    },
                    changes: [],
                    timestamp: '2024-01-01T12:00:00.000Z',
                    metadata: {
                        changesCount: 0,
                        preservedPosition: true,
                        operation: 'no-op',
                    },
                },
            },
        },
    }), (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid request data for partial update',
        examples: {
            invalid_email: {
                summary: 'Invalid email format',
                value: {
                    statusCode: 400,
                    message: ['assigneeEmail must be a valid email'],
                    error: 'Bad Request',
                },
            },
            invalid_enum: {
                summary: 'Invalid enum value',
                value: {
                    statusCode: 400,
                    message: ['priority must be a valid enum value'],
                    error: 'Bad Request',
                },
            },
        },
    }), (0, swagger_1.ApiNotFoundResponse)({
        description: 'Task not found',
        example: {
            statusCode: 404,
            message: 'Task with ID 550e8400-e29b-41d4-a716-446655440000 not found',
            error: 'Not Found',
        },
    }), (0, swagger_1.ApiInternalServerErrorResponse)({
        description: 'Internal server error during partial update',
        example: {
            statusCode: 500,
            message: 'Failed to update task',
            error: 'Internal Server Error',
        },
    }));
}
//# sourceMappingURL=openapi.decorator.js.map