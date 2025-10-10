"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaskResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UpdateTaskResponseDto {
    success;
    message;
    taskId;
    updatedTask;
    changes;
    timestamp;
    metadata;
}
exports.UpdateTaskResponseDto = UpdateTaskResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether the update was successful',
    }),
    __metadata("design:type", Boolean)
], UpdateTaskResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Task updated successfully',
        description: 'Human-readable message about the update result',
    }),
    __metadata("design:type", String)
], UpdateTaskResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'ID of the updated task',
    }),
    __metadata("design:type", String)
], UpdateTaskResponseDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Object,
        description: 'Complete updated task information',
        example: {
            id: 'history-record-123',
            taskId: '550e8400-e29b-41d4-a716-446655440000',
            taskKey: 'TASK-123',
            title: 'Обновленное название задачи',
            description: 'Обновленное описание задачи',
            priority: 'high',
            assigneeEmail: 'new.assignee@example.com',
            assigneeName: 'New Assignee',
            tags: ['frontend', 'urgent'],
            dueDate: '2024-02-15T10:00:00Z',
            estimatedHours: 8,
            currentColumn: 'in-progress',
            currentStatus: 'in-progress',
            context: { department: 'backend' },
            updatedAt: '2024-01-01T12:00:00Z',
            updatedBy: 'manager@example.com',
            agentId: 'uuid-agent-123',
        },
    }),
    __metadata("design:type", Object)
], UpdateTaskResponseDto.prototype, "updatedTask", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [Object],
        description: 'List of changes made to the task',
        example: [
            {
                field: 'title',
                oldValue: 'Старое название',
                newValue: 'Обновленное название задачи',
                updatedAt: '2024-01-01T12:00:00Z',
            },
            {
                field: 'priority',
                oldValue: 'medium',
                newValue: 'high',
                updatedAt: '2024-01-01T12:00:00Z',
            },
            {
                field: 'assigneeEmail',
                oldValue: 'old.assignee@example.com',
                newValue: 'new.assignee@example.com',
                updatedAt: '2024-01-01T12:00:00Z',
            },
        ],
    }),
    __metadata("design:type", Array)
], UpdateTaskResponseDto.prototype, "changes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-01T12:00:00.000Z',
        description: 'Timestamp when update was performed',
    }),
    __metadata("design:type", String)
], UpdateTaskResponseDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Object,
        description: 'Additional metadata about the update operation',
        example: {
            changesCount: 3,
            preservedPosition: true,
            notificationsSent: ['email', 'telegram'],
            queueJobId: 'update-job-123',
            validationsPassed: ['title_length', 'email_format', 'priority_enum'],
            previousVersion: {
                title: 'Старое название',
                priority: 'medium',
                assigneeEmail: 'old.assignee@example.com',
            },
        },
        required: false,
    }),
    __metadata("design:type", Object)
], UpdateTaskResponseDto.prototype, "metadata", void 0);
//# sourceMappingURL=update-task.response.dto.js.map