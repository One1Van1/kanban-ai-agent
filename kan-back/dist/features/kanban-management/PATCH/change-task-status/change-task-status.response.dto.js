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
exports.ChangeTaskStatusResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const change_task_status_request_dto_1 = require("./change-task-status.request.dto");
class ChangeTaskStatusResponseDto {
    success;
    message;
    taskId;
    previousStatus;
    currentStatus;
    statusChange;
    timestamp;
    metadata;
}
exports.ChangeTaskStatusResponseDto = ChangeTaskStatusResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether the status change was successful',
    }),
    __metadata("design:type", Boolean)
], ChangeTaskStatusResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Task status changed from todo to in-progress',
        description: 'Human-readable message about the status change result',
    }),
    __metadata("design:type", String)
], ChangeTaskStatusResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'ID of the task that had its status changed',
    }),
    __metadata("design:type", String)
], ChangeTaskStatusResponseDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: change_task_status_request_dto_1.TaskStatus,
        example: change_task_status_request_dto_1.TaskStatus.TODO,
        description: 'Previous status of the task',
    }),
    __metadata("design:type", String)
], ChangeTaskStatusResponseDto.prototype, "previousStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: change_task_status_request_dto_1.TaskStatus,
        example: change_task_status_request_dto_1.TaskStatus.IN_PROGRESS,
        description: 'New status of the task',
    }),
    __metadata("design:type", String)
], ChangeTaskStatusResponseDto.prototype, "currentStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Object,
        description: 'Complete status change information',
        example: {
            id: 'status-change-123',
            taskId: '550e8400-e29b-41d4-a716-446655440000',
            fromStatus: 'todo',
            toStatus: 'in-progress',
            changedByEmail: 'john.doe@example.com',
            changedByName: 'John Doe',
            statusComment: 'Начинаю работу над задачей',
            changedAt: '2024-01-01T12:00:00Z',
            context: { reason: 'requirements_clarified' },
            agentId: 'uuid-agent-123',
            triggerType: 'agent_instruction',
            forceChange: false,
        },
    }),
    __metadata("design:type", Object)
], ChangeTaskStatusResponseDto.prototype, "statusChange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-01T12:00:00.000Z',
        description: 'Timestamp when status was changed',
    }),
    __metadata("design:type", String)
], ChangeTaskStatusResponseDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Object,
        description: 'Additional metadata about the operation',
        example: {
            workflowValidation: 'passed',
            notificationsSent: ['email', 'telegram'],
            queueJobId: 'status-job-123',
            timeInPreviousStatus: '2 days 3 hours',
        },
        required: false,
    }),
    __metadata("design:type", Object)
], ChangeTaskStatusResponseDto.prototype, "metadata", void 0);
//# sourceMappingURL=change-task-status.response.dto.js.map