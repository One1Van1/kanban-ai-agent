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
exports.DeleteTaskResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const delete_task_request_dto_1 = require("./delete-task.request.dto");
class DeleteTaskResponseDto {
    taskId;
    taskKey;
    taskTitle;
    deleteMode;
    deletedBy;
    deletedAt;
    deleteReason;
    originalStatus;
    originalColumn;
    assignee;
    watchers;
    relatedTasks;
    attachmentsDeleted;
    commentsDeleted;
    historyEntriesArchived;
    notifiedUsers;
    success;
    canBeRestored;
    restorationDeadline;
    historyLogId;
}
exports.DeleteTaskResponseDto = DeleteTaskResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier of the deleted task',
        example: 'a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a',
    }),
    __metadata("design:type", String)
], DeleteTaskResponseDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Task key that was deleted',
        example: 'TASK-123',
    }),
    __metadata("design:type", String)
], DeleteTaskResponseDto.prototype, "taskKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title of the deleted task',
        example: 'Implement user authentication',
    }),
    __metadata("design:type", String)
], DeleteTaskResponseDto.prototype, "taskTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: delete_task_request_dto_1.DeleteMode,
        enumName: 'DeleteMode',
        example: delete_task_request_dto_1.DeleteMode.SOFT_DELETE,
        description: 'Type of deletion that was performed',
    }),
    __metadata("design:type", String)
], DeleteTaskResponseDto.prototype, "deleteMode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User who performed the deletion',
        example: 'agent-001',
    }),
    __metadata("design:type", String)
], DeleteTaskResponseDto.prototype, "deletedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when task was deleted',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], DeleteTaskResponseDto.prototype, "deletedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for deleting the task',
        example: 'Task is no longer relevant due to requirement changes',
        required: false,
    }),
    __metadata("design:type", String)
], DeleteTaskResponseDto.prototype, "deleteReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Task status before deletion',
        example: 'in_progress',
    }),
    __metadata("design:type", String)
], DeleteTaskResponseDto.prototype, "originalStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Column where task was located before deletion',
        example: 'In Progress',
    }),
    __metadata("design:type", String)
], DeleteTaskResponseDto.prototype, "originalColumn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Assignee of the deleted task',
        example: 'agent-002',
        required: false,
    }),
    __metadata("design:type", String)
], DeleteTaskResponseDto.prototype, "assignee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of users who were watching the task',
        example: ['agent-003', 'agent-004'],
        type: [String],
    }),
    __metadata("design:type", Array)
], DeleteTaskResponseDto.prototype, "watchers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of related tasks that were affected',
        example: ['task-456', 'task-789'],
        type: [String],
    }),
    __metadata("design:type", Array)
], DeleteTaskResponseDto.prototype, "relatedTasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of attachments that were deleted',
        example: 3,
    }),
    __metadata("design:type", Number)
], DeleteTaskResponseDto.prototype, "attachmentsDeleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of comments that were deleted',
        example: 7,
    }),
    __metadata("design:type", Number)
], DeleteTaskResponseDto.prototype, "commentsDeleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of history entries that were archived',
        example: 15,
    }),
    __metadata("design:type", Number)
], DeleteTaskResponseDto.prototype, "historyEntriesArchived", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of users who were notified about the deletion',
        example: ['agent-002', 'agent-003', 'agent-004'],
        type: [String],
    }),
    __metadata("design:type", Array)
], DeleteTaskResponseDto.prototype, "notifiedUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether deletion was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], DeleteTaskResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether task can be restored (for soft deletes)',
        example: true,
    }),
    __metadata("design:type", Boolean)
], DeleteTaskResponseDto.prototype, "canBeRestored", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Restoration deadline for soft-deleted tasks',
        example: '2024-02-15T10:30:00Z',
        required: false,
    }),
    __metadata("design:type", Date)
], DeleteTaskResponseDto.prototype, "restorationDeadline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'History log ID for this deletion',
        example: 'b9f6f267-bb90-5f37-b3c2-3c6e5c0c3d9b',
    }),
    __metadata("design:type", String)
], DeleteTaskResponseDto.prototype, "historyLogId", void 0);
//# sourceMappingURL=delete-task.response.dto.js.map