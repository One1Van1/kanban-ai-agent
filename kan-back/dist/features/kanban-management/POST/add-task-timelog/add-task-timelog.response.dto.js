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
exports.AddTaskTimelogResponseDto = exports.TimelogEntryDataDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class TimelogEntryDataDto {
    id;
    taskId;
    userId;
    description;
    timeSpentMinutes;
    timeSpentHours;
    startTime;
    endTime;
    notes;
    createdAt;
}
exports.TimelogEntryDataDto = TimelogEntryDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timelog entry identifier',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    __metadata("design:type", String)
], TimelogEntryDataDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Task ID this timelog belongs to',
        example: 'TASK-123',
    }),
    __metadata("design:type", String)
], TimelogEntryDataDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User who logged the time',
        example: 'agent-001',
    }),
    __metadata("design:type", String)
], TimelogEntryDataDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of work performed',
        example: 'Implemented user authentication module',
    }),
    __metadata("design:type", String)
], TimelogEntryDataDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Time spent in minutes',
        example: 120,
    }),
    __metadata("design:type", Number)
], TimelogEntryDataDto.prototype, "timeSpentMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Time spent in hours',
        example: 2.0,
    }),
    __metadata("design:type", Number)
], TimelogEntryDataDto.prototype, "timeSpentHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When work started',
        example: '2024-01-15T09:00:00Z',
    }),
    __metadata("design:type", Date)
], TimelogEntryDataDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When work ended',
        example: '2024-01-15T11:00:00Z',
    }),
    __metadata("design:type", Date)
], TimelogEntryDataDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes or context',
        example: 'Used TDD approach, included unit tests',
        required: false,
    }),
    __metadata("design:type", String)
], TimelogEntryDataDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When this timelog entry was created',
        example: '2024-01-15T11:00:00Z',
    }),
    __metadata("design:type", Date)
], TimelogEntryDataDto.prototype, "createdAt", void 0);
class AddTaskTimelogResponseDto {
    success;
    data;
    message;
}
exports.AddTaskTimelogResponseDto = AddTaskTimelogResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if the request was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], AddTaskTimelogResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: TimelogEntryDataDto,
        description: 'Created timelog entry data',
    }),
    __metadata("design:type", TimelogEntryDataDto)
], AddTaskTimelogResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response message',
        example: 'Task timelog entry added successfully',
    }),
    __metadata("design:type", String)
], AddTaskTimelogResponseDto.prototype, "message", void 0);
//# sourceMappingURL=add-task-timelog.response.dto.js.map