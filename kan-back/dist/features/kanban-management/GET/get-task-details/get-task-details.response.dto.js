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
exports.GetTaskDetailsResponseDto = exports.TaskHistoryItemDto = exports.TaskDetailsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class TaskDetailsDto {
    taskId;
    taskKey;
    taskTitle;
    status;
    toColumn;
    fromColumn;
    toStatus;
    fromStatus;
    createdAt;
    context;
    constructor(taskHistory) {
        this.taskId = taskHistory.taskId;
        this.taskKey = taskHistory.taskKey;
        this.taskTitle = taskHistory.taskTitle;
        this.status = taskHistory.status;
        this.toColumn = taskHistory.toColumn || '';
        this.fromColumn = taskHistory.fromColumn || '';
        this.toStatus = taskHistory.toStatus || '';
        this.fromStatus = taskHistory.fromStatus || '';
        this.createdAt = taskHistory.createdAt;
        this.context = taskHistory.context || {};
    }
}
exports.TaskDetailsDto = TaskDetailsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TASK-123', description: 'Task ID' }),
    __metadata("design:type", String)
], TaskDetailsDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TASK-123', description: 'Task key' }),
    __metadata("design:type", String)
], TaskDetailsDto.prototype, "taskKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Fix login bug', description: 'Task title' }),
    __metadata("design:type", String)
], TaskDetailsDto.prototype, "taskTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'In Progress', description: 'Current task status' }),
    __metadata("design:type", String)
], TaskDetailsDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'To Do', description: 'Current column' }),
    __metadata("design:type", String)
], TaskDetailsDto.prototype, "toColumn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Done', description: 'Previous column' }),
    __metadata("design:type", String)
], TaskDetailsDto.prototype, "fromColumn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'In Progress', description: 'Current status' }),
    __metadata("design:type", String)
], TaskDetailsDto.prototype, "toStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'To Do', description: 'Previous status' }),
    __metadata("design:type", String)
], TaskDetailsDto.prototype, "fromStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-10-09T12:00:00Z',
        description: 'Task creation date',
    }),
    __metadata("design:type", Date)
], TaskDetailsDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: {}, description: 'Additional context data' }),
    __metadata("design:type", Object)
], TaskDetailsDto.prototype, "context", void 0);
class TaskHistoryItemDto {
    id;
    taskId;
    taskKey;
    taskTitle;
    action;
    toStatus;
    fromStatus;
    createdAt;
    constructor(taskHistory) {
        this.id = taskHistory.id;
        this.taskId = taskHistory.taskId;
        this.taskKey = taskHistory.taskKey;
        this.taskTitle = taskHistory.taskTitle;
        this.action = taskHistory.action;
        this.toStatus = taskHistory.toStatus || '';
        this.fromStatus = taskHistory.fromStatus || '';
        this.createdAt = taskHistory.createdAt;
    }
}
exports.TaskHistoryItemDto = TaskHistoryItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-123', description: 'History record ID' }),
    __metadata("design:type", String)
], TaskHistoryItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TASK-123', description: 'Task ID' }),
    __metadata("design:type", String)
], TaskHistoryItemDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TASK-123', description: 'Task key' }),
    __metadata("design:type", String)
], TaskHistoryItemDto.prototype, "taskKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Fix login bug', description: 'Task title' }),
    __metadata("design:type", String)
], TaskHistoryItemDto.prototype, "taskTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'status_changed', description: 'Action type' }),
    __metadata("design:type", String)
], TaskHistoryItemDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'In Progress', description: 'Target status' }),
    __metadata("design:type", String)
], TaskHistoryItemDto.prototype, "toStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'To Do', description: 'Source status' }),
    __metadata("design:type", String)
], TaskHistoryItemDto.prototype, "fromStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-10-09T12:00:00Z',
        description: 'Change timestamp',
    }),
    __metadata("design:type", Date)
], TaskHistoryItemDto.prototype, "createdAt", void 0);
class GetTaskDetailsResponseDto {
    task;
    history;
    historyCount;
    constructor(latestTask, history) {
        this.task = new TaskDetailsDto(latestTask);
        this.history = history.map((h) => new TaskHistoryItemDto(h));
        this.historyCount = history.length;
    }
}
exports.GetTaskDetailsResponseDto = GetTaskDetailsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: TaskDetailsDto, description: 'Current task details' }),
    __metadata("design:type", TaskDetailsDto)
], GetTaskDetailsResponseDto.prototype, "task", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [TaskHistoryItemDto],
        description: 'Recent task history',
    }),
    __metadata("design:type", Array)
], GetTaskDetailsResponseDto.prototype, "history", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Total history records count' }),
    __metadata("design:type", Number)
], GetTaskDetailsResponseDto.prototype, "historyCount", void 0);
//# sourceMappingURL=get-task-details.response.dto.js.map