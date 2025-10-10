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
exports.UpdateTaskAssignmentResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const update_task_assignment_request_dto_1 = require("./update-task-assignment.request.dto");
class UpdateTaskAssignmentResponseDto {
    taskId;
    action;
    assignee;
    previousAssignee;
    watchers;
    assignmentDetails;
    updatedBy;
    updatedAt;
    assignmentReason;
    watchersAdded;
    watchersRemoved;
    notificationsSent;
    assignmentPriority;
    success;
    assignmentVersion;
    historyLogId;
}
exports.UpdateTaskAssignmentResponseDto = UpdateTaskAssignmentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier of the task',
        example: 'a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a',
    }),
    __metadata("design:type", String)
], UpdateTaskAssignmentResponseDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: update_task_assignment_request_dto_1.AssignmentAction,
        enumName: 'AssignmentAction',
        example: update_task_assignment_request_dto_1.AssignmentAction.REASSIGN,
        description: 'Assignment action that was performed',
    }),
    __metadata("design:type", String)
], UpdateTaskAssignmentResponseDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current primary assignee',
        example: 'agent-002',
        required: false,
    }),
    __metadata("design:type", String)
], UpdateTaskAssignmentResponseDto.prototype, "assignee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Previous assignee before update',
        example: 'agent-001',
        required: false,
    }),
    __metadata("design:type", String)
], UpdateTaskAssignmentResponseDto.prototype, "previousAssignee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of current watchers',
        example: ['agent-003', 'agent-004'],
        type: [String],
        required: false,
    }),
    __metadata("design:type", Array)
], UpdateTaskAssignmentResponseDto.prototype, "watchers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detailed assignment information',
        type: [update_task_assignment_request_dto_1.AssignmentDetails],
        required: false,
    }),
    __metadata("design:type", Array)
], UpdateTaskAssignmentResponseDto.prototype, "assignmentDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User who performed the assignment update',
        example: 'agent-001',
    }),
    __metadata("design:type", String)
], UpdateTaskAssignmentResponseDto.prototype, "updatedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when assignment was updated',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], UpdateTaskAssignmentResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for assignment change',
        example: 'Reassigning to team member with more relevant expertise',
        required: false,
    }),
    __metadata("design:type", String)
], UpdateTaskAssignmentResponseDto.prototype, "assignmentReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of users who were added as watchers',
        example: ['agent-005'],
        type: [String],
    }),
    __metadata("design:type", Array)
], UpdateTaskAssignmentResponseDto.prototype, "watchersAdded", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of users who were removed as watchers',
        example: ['agent-003'],
        type: [String],
    }),
    __metadata("design:type", Array)
], UpdateTaskAssignmentResponseDto.prototype, "watchersRemoved", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether notifications were sent to assignees',
        example: true,
    }),
    __metadata("design:type", Boolean)
], UpdateTaskAssignmentResponseDto.prototype, "notificationsSent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Assignment priority level',
        example: 'normal',
        required: false,
    }),
    __metadata("design:type", String)
], UpdateTaskAssignmentResponseDto.prototype, "assignmentPriority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether assignment update was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], UpdateTaskAssignmentResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of assignment changes for this task',
        example: 3,
    }),
    __metadata("design:type", Number)
], UpdateTaskAssignmentResponseDto.prototype, "assignmentVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'History log ID for this assignment change',
        example: 'b9f6f267-bb90-5f37-b3c2-3c6e5c0c3d9b',
    }),
    __metadata("design:type", String)
], UpdateTaskAssignmentResponseDto.prototype, "historyLogId", void 0);
//# sourceMappingURL=update-task-assignment.response.dto.js.map