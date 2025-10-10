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
exports.MoveTaskResponseDto = exports.TaskMovedDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class TaskMovedDto {
    taskId;
    taskKey;
    taskTitle;
    fromColumn;
    toColumn;
    fromStatus;
    toStatus;
    movedAt;
    action;
    constructor(moveHistory) {
        this.taskId = moveHistory.taskId;
        this.taskKey = moveHistory.taskKey;
        this.taskTitle = moveHistory.taskTitle;
        this.fromColumn = moveHistory.fromColumn || '';
        this.toColumn = moveHistory.toColumn || '';
        this.fromStatus = moveHistory.fromStatus || '';
        this.toStatus = moveHistory.toStatus || '';
        this.movedAt = moveHistory.createdAt;
        this.action = moveHistory.action;
    }
}
exports.TaskMovedDto = TaskMovedDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PROJ-123', description: 'Task ID' }),
    __metadata("design:type", String)
], TaskMovedDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PROJ-123', description: 'Task key' }),
    __metadata("design:type", String)
], TaskMovedDto.prototype, "taskKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Fix authentication bug', description: 'Task title' }),
    __metadata("design:type", String)
], TaskMovedDto.prototype, "taskTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'To Do', description: 'Previous column' }),
    __metadata("design:type", String)
], TaskMovedDto.prototype, "fromColumn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'In Progress', description: 'New column' }),
    __metadata("design:type", String)
], TaskMovedDto.prototype, "toColumn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pending', description: 'Previous status' }),
    __metadata("design:type", String)
], TaskMovedDto.prototype, "fromStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'in_progress', description: 'New status' }),
    __metadata("design:type", String)
], TaskMovedDto.prototype, "toStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-10-09T12:00:00Z',
        description: 'Move timestamp',
    }),
    __metadata("design:type", Date)
], TaskMovedDto.prototype, "movedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'moved', description: 'Action performed' }),
    __metadata("design:type", String)
], TaskMovedDto.prototype, "action", void 0);
class MoveTaskResponseDto {
    task;
    success;
    message;
    context;
    constructor(moveHistory, previousState) {
        this.task = new TaskMovedDto(moveHistory);
        this.success = true;
        this.message = `Task moved successfully from "${previousState.toColumn}" to "${moveHistory.toColumn}"`;
        this.context = moveHistory.context || {};
    }
}
exports.MoveTaskResponseDto = MoveTaskResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: TaskMovedDto, description: 'Moved task information' }),
    __metadata("design:type", TaskMovedDto)
], MoveTaskResponseDto.prototype, "task", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether move operation was successful',
    }),
    __metadata("design:type", Boolean)
], MoveTaskResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Task moved successfully from "To Do" to "In Progress"',
        description: 'Success message',
    }),
    __metadata("design:type", String)
], MoveTaskResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            previousState: { column: 'To Do', status: 'pending' },
            moveReason: 'Starting work on this task',
        },
        description: 'Additional context about the move',
    }),
    __metadata("design:type", Object)
], MoveTaskResponseDto.prototype, "context", void 0);
//# sourceMappingURL=move-task-response.dto.js.map