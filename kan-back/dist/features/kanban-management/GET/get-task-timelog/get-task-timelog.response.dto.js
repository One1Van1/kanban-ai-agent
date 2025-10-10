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
exports.GetTaskTimelogResponseDto = exports.TaskTimelogDataDto = exports.TimelogSummaryDto = exports.TimelogEntryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class TimelogEntryDto {
    id;
    taskId;
    userId;
    description;
    timeSpentMinutes;
    startTime;
    endTime;
    createdAt;
}
exports.TimelogEntryDto = TimelogEntryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timelog entry identifier',
        example: '1',
    }),
    __metadata("design:type", String)
], TimelogEntryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Task ID this timelog belongs to',
        example: 'TASK-123',
    }),
    __metadata("design:type", String)
], TimelogEntryDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User who logged the time',
        example: 'agent-001',
    }),
    __metadata("design:type", String)
], TimelogEntryDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of work performed',
        example: 'Initial analysis and planning',
    }),
    __metadata("design:type", String)
], TimelogEntryDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Time spent in minutes',
        example: 120,
    }),
    __metadata("design:type", Number)
], TimelogEntryDto.prototype, "timeSpentMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When work started',
        example: '2024-01-15T09:00:00Z',
    }),
    __metadata("design:type", Date)
], TimelogEntryDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When work ended',
        example: '2024-01-15T11:00:00Z',
    }),
    __metadata("design:type", Date)
], TimelogEntryDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When this timelog entry was created',
        example: '2024-01-15T11:00:00Z',
    }),
    __metadata("design:type", Date)
], TimelogEntryDto.prototype, "createdAt", void 0);
class TimelogSummaryDto {
    totalTimeSpentMinutes;
    totalTimeSpentHours;
    averageTimePerEntry;
    totalEntries;
    uniqueUsers;
}
exports.TimelogSummaryDto = TimelogSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total time spent in minutes',
        example: 390,
    }),
    __metadata("design:type", Number)
], TimelogSummaryDto.prototype, "totalTimeSpentMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total time spent in hours',
        example: 6.5,
    }),
    __metadata("design:type", Number)
], TimelogSummaryDto.prototype, "totalTimeSpentHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Average time per entry in minutes',
        example: 130,
    }),
    __metadata("design:type", Number)
], TimelogSummaryDto.prototype, "averageTimePerEntry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of timelog entries',
        example: 3,
    }),
    __metadata("design:type", Number)
], TimelogSummaryDto.prototype, "totalEntries", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of unique users who logged time',
        example: 2,
    }),
    __metadata("design:type", Number)
], TimelogSummaryDto.prototype, "uniqueUsers", void 0);
class TaskTimelogDataDto {
    taskId;
    items;
    total;
    page;
    limit;
    totalPages;
    summary;
}
exports.TaskTimelogDataDto = TaskTimelogDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Task ID',
        example: 'TASK-123',
    }),
    __metadata("design:type", String)
], TaskTimelogDataDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [TimelogEntryDto],
        description: 'Array of timelog entries',
    }),
    __metadata("design:type", Array)
], TaskTimelogDataDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of timelog entries for this task',
        example: 15,
    }),
    __metadata("design:type", Number)
], TaskTimelogDataDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current page number',
        example: 1,
    }),
    __metadata("design:type", Number)
], TaskTimelogDataDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of entries per page',
        example: 20,
    }),
    __metadata("design:type", Number)
], TaskTimelogDataDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of pages',
        example: 1,
    }),
    __metadata("design:type", Number)
], TaskTimelogDataDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: TimelogSummaryDto,
        description: 'Summary statistics for the timelog',
    }),
    __metadata("design:type", TimelogSummaryDto)
], TaskTimelogDataDto.prototype, "summary", void 0);
class GetTaskTimelogResponseDto {
    success;
    data;
    message;
}
exports.GetTaskTimelogResponseDto = GetTaskTimelogResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if the request was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], GetTaskTimelogResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: TaskTimelogDataDto,
        description: 'Task timelog data with pagination and summary',
    }),
    __metadata("design:type", TaskTimelogDataDto)
], GetTaskTimelogResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response message',
        example: 'Task timelog retrieved successfully',
    }),
    __metadata("design:type", String)
], GetTaskTimelogResponseDto.prototype, "message", void 0);
//# sourceMappingURL=get-task-timelog.response.dto.js.map