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
exports.ExecuteTaskTransitionResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const execute_task_transition_request_dto_1 = require("./execute-task-transition.request.dto");
class ExecuteTaskTransitionResponseDto {
    taskId;
    action;
    fromStatus;
    toStatus;
    fromColumn;
    toColumn;
    executedBy;
    executedAt;
    comment;
    resolution;
    success;
    historyLogId;
}
exports.ExecuteTaskTransitionResponseDto = ExecuteTaskTransitionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier of the task',
        example: 'a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a',
    }),
    __metadata("design:type", String)
], ExecuteTaskTransitionResponseDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: execute_task_transition_request_dto_1.TransitionAction,
        enumName: 'TransitionAction',
        example: execute_task_transition_request_dto_1.TransitionAction.START_PROGRESS,
        description: 'Executed transition action',
    }),
    __metadata("design:type", String)
], ExecuteTaskTransitionResponseDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status before transition',
        example: 'todo',
    }),
    __metadata("design:type", String)
], ExecuteTaskTransitionResponseDto.prototype, "fromStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status after transition',
        example: 'in_progress',
    }),
    __metadata("design:type", String)
], ExecuteTaskTransitionResponseDto.prototype, "toStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Column before transition',
        example: 'To Do',
        required: false,
    }),
    __metadata("design:type", String)
], ExecuteTaskTransitionResponseDto.prototype, "fromColumn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Column after transition',
        example: 'In Progress',
        required: false,
    }),
    __metadata("design:type", String)
], ExecuteTaskTransitionResponseDto.prototype, "toColumn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User who executed the transition',
        example: 'agent-001',
    }),
    __metadata("design:type", String)
], ExecuteTaskTransitionResponseDto.prototype, "executedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when transition was executed',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], ExecuteTaskTransitionResponseDto.prototype, "executedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comment about the transition',
        example: 'Starting work on this task after clarification',
        required: false,
    }),
    __metadata("design:type", String)
], ExecuteTaskTransitionResponseDto.prototype, "comment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Resolution if task was completed',
        example: 'Fixed',
        required: false,
    }),
    __metadata("design:type", String)
], ExecuteTaskTransitionResponseDto.prototype, "resolution", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether transition was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ExecuteTaskTransitionResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'History log ID for this transition',
        example: 'b9f6f267-bb90-5f37-b3c2-3c6e5c0c3d9b',
    }),
    __metadata("design:type", String)
], ExecuteTaskTransitionResponseDto.prototype, "historyLogId", void 0);
//# sourceMappingURL=execute-task-transition.response.dto.js.map