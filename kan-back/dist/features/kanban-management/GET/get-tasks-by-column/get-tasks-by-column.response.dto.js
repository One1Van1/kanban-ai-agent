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
exports.GetTasksByColumnResponseDto = exports.ColumnTaskDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ColumnTaskDto {
    taskId;
    taskKey;
    taskTitle;
    status;
    currentColumn;
    lastUpdated;
    lastAction;
    constructor(taskHistory) {
        this.taskId = taskHistory.taskId;
        this.taskKey = taskHistory.taskKey;
        this.taskTitle = taskHistory.taskTitle;
        this.status = taskHistory.status;
        this.currentColumn = taskHistory.toColumn || taskHistory.fromColumn || '';
        this.lastUpdated = taskHistory.createdAt;
        this.lastAction = taskHistory.action;
    }
}
exports.ColumnTaskDto = ColumnTaskDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TASK-123', description: 'Task ID' }),
    __metadata("design:type", String)
], ColumnTaskDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TASK-123', description: 'Task key' }),
    __metadata("design:type", String)
], ColumnTaskDto.prototype, "taskKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Fix login bug', description: 'Task title' }),
    __metadata("design:type", String)
], ColumnTaskDto.prototype, "taskTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'completed', description: 'Task status' }),
    __metadata("design:type", String)
], ColumnTaskDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'In Progress', description: 'Current column' }),
    __metadata("design:type", String)
], ColumnTaskDto.prototype, "currentColumn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-10-09T12:00:00Z',
        description: 'Last update timestamp',
    }),
    __metadata("design:type", Date)
], ColumnTaskDto.prototype, "lastUpdated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'status_changed',
        description: 'Last action performed',
    }),
    __metadata("design:type", String)
], ColumnTaskDto.prototype, "lastAction", void 0);
class GetTasksByColumnResponseDto {
    tasks;
    column;
    total;
    limit;
    offset;
    hasMore;
    constructor(taskHistories, total, column, query) {
        this.tasks = taskHistories.map((th) => new ColumnTaskDto(th));
        this.column = column;
        this.total = total;
        this.limit = query.limit || 10;
        this.offset = query.offset || 0;
        this.hasMore = this.offset + this.limit < total;
    }
}
exports.GetTasksByColumnResponseDto = GetTasksByColumnResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [ColumnTaskDto],
        description: 'List of tasks in the column',
    }),
    __metadata("design:type", Array)
], GetTasksByColumnResponseDto.prototype, "tasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'In Progress', description: 'Column name' }),
    __metadata("design:type", String)
], GetTasksByColumnResponseDto.prototype, "column", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25, description: 'Total number of tasks in column' }),
    __metadata("design:type", Number)
], GetTasksByColumnResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Number of tasks returned' }),
    __metadata("design:type", Number)
], GetTasksByColumnResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Number of tasks skipped' }),
    __metadata("design:type", Number)
], GetTasksByColumnResponseDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether there are more tasks available',
    }),
    __metadata("design:type", Boolean)
], GetTasksByColumnResponseDto.prototype, "hasMore", void 0);
//# sourceMappingURL=get-tasks-by-column.response.dto.js.map