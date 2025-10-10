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
exports.GetBoardSummaryResponseDto = exports.BoardSummaryDataDto = exports.PriorityStatDto = exports.ColumnStatDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ColumnStatDto {
    columnId;
    name;
    taskCount;
    color;
}
exports.ColumnStatDto = ColumnStatDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Column identifier',
        example: 'in_progress',
    }),
    __metadata("design:type", String)
], ColumnStatDto.prototype, "columnId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Column display name',
        example: 'In Progress',
    }),
    __metadata("design:type", String)
], ColumnStatDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of tasks in this column',
        example: 5,
    }),
    __metadata("design:type", Number)
], ColumnStatDto.prototype, "taskCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Column color for UI display',
        example: '#0052CC',
    }),
    __metadata("design:type", String)
], ColumnStatDto.prototype, "color", void 0);
class PriorityStatDto {
    priority;
    name;
    taskCount;
    color;
}
exports.PriorityStatDto = PriorityStatDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Priority level',
        example: 'high',
    }),
    __metadata("design:type", String)
], PriorityStatDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Priority display name',
        example: 'High',
    }),
    __metadata("design:type", String)
], PriorityStatDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of tasks with this priority',
        example: 6,
    }),
    __metadata("design:type", Number)
], PriorityStatDto.prototype, "taskCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Priority color for UI display',
        example: '#FF8B00',
    }),
    __metadata("design:type", String)
], PriorityStatDto.prototype, "color", void 0);
class BoardSummaryDataDto {
    boardId;
    totalTasks;
    activeTasks;
    completedTasks;
    columns;
    priorities;
    lastUpdated;
    avgTasksPerColumn;
    tasksCreatedToday;
    tasksCompletedToday;
    overdueTasks;
    blockedTasksDuration;
    mostActiveColumn;
    completionRate;
}
exports.BoardSummaryDataDto = BoardSummaryDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Board identifier',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    __metadata("design:type", String)
], BoardSummaryDataDto.prototype, "boardId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of tasks on the board',
        example: 30,
    }),
    __metadata("design:type", Number)
], BoardSummaryDataDto.prototype, "totalTasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of active (non-completed) tasks',
        example: 18,
    }),
    __metadata("design:type", Number)
], BoardSummaryDataDto.prototype, "activeTasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of completed tasks',
        example: 12,
    }),
    __metadata("design:type", Number)
], BoardSummaryDataDto.prototype, "completedTasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [ColumnStatDto],
        description: 'Statistics for each column',
    }),
    __metadata("design:type", Array)
], BoardSummaryDataDto.prototype, "columns", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [PriorityStatDto],
        description: 'Statistics by task priority',
    }),
    __metadata("design:type", Array)
], BoardSummaryDataDto.prototype, "priorities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], BoardSummaryDataDto.prototype, "lastUpdated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Average tasks per column',
        example: 6,
        required: false,
    }),
    __metadata("design:type", Number)
], BoardSummaryDataDto.prototype, "avgTasksPerColumn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tasks created today',
        example: 3,
        required: false,
    }),
    __metadata("design:type", Number)
], BoardSummaryDataDto.prototype, "tasksCreatedToday", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tasks completed today',
        example: 4,
        required: false,
    }),
    __metadata("design:type", Number)
], BoardSummaryDataDto.prototype, "tasksCompletedToday", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of overdue tasks',
        example: 2,
        required: false,
    }),
    __metadata("design:type", Number)
], BoardSummaryDataDto.prototype, "overdueTasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Average duration for blocked tasks',
        example: '2.5 days',
        required: false,
    }),
    __metadata("design:type", String)
], BoardSummaryDataDto.prototype, "blockedTasksDuration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Most active column name',
        example: 'in_progress',
        required: false,
    }),
    __metadata("design:type", String)
], BoardSummaryDataDto.prototype, "mostActiveColumn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Task completion rate percentage',
        example: 85.7,
        required: false,
    }),
    __metadata("design:type", Number)
], BoardSummaryDataDto.prototype, "completionRate", void 0);
class GetBoardSummaryResponseDto {
    success;
    data;
    message;
}
exports.GetBoardSummaryResponseDto = GetBoardSummaryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if the request was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], GetBoardSummaryResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: BoardSummaryDataDto,
        description: 'Board summary data',
    }),
    __metadata("design:type", BoardSummaryDataDto)
], GetBoardSummaryResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response message',
        example: 'Board summary retrieved successfully',
    }),
    __metadata("design:type", String)
], GetBoardSummaryResponseDto.prototype, "message", void 0);
//# sourceMappingURL=get-board-summary.response.dto.js.map