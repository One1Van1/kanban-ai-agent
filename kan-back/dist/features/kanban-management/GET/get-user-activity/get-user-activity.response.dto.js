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
exports.GetUserActivityResponseDto = exports.UserActivityDataDto = exports.UserActivityItemDto = exports.ActivityDetailsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ActivityDetailsDto {
    fromStatus;
    toStatus;
    fromColumn;
    toColumn;
}
exports.ActivityDetailsDto = ActivityDetailsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Previous status if applicable',
        example: 'in_progress',
        required: false,
    }),
    __metadata("design:type", String)
], ActivityDetailsDto.prototype, "fromStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New status if applicable',
        example: 'done',
        required: false,
    }),
    __metadata("design:type", String)
], ActivityDetailsDto.prototype, "toStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Previous column if applicable',
        example: 'In Progress',
        required: false,
    }),
    __metadata("design:type", String)
], ActivityDetailsDto.prototype, "fromColumn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New column if applicable',
        example: 'Done',
        required: false,
    }),
    __metadata("design:type", String)
], ActivityDetailsDto.prototype, "toColumn", void 0);
class UserActivityItemDto {
    id;
    type;
    taskId;
    taskTitle;
    description;
    timestamp;
    details;
}
exports.UserActivityItemDto = UserActivityItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Activity identifier',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    __metadata("design:type", String)
], UserActivityItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of activity',
        example: 'status_changed',
    }),
    __metadata("design:type", String)
], UserActivityItemDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the task involved',
        example: 'TASK-123',
    }),
    __metadata("design:type", String)
], UserActivityItemDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title of the task involved',
        example: 'Implement user authentication',
    }),
    __metadata("design:type", String)
], UserActivityItemDto.prototype, "taskTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Human-readable description of the activity',
        example: 'Changed status of "Implement user authentication" from in_progress to done',
    }),
    __metadata("design:type", String)
], UserActivityItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When the activity occurred',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], UserActivityItemDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: ActivityDetailsDto,
        description: 'Additional activity details',
    }),
    __metadata("design:type", ActivityDetailsDto)
], UserActivityItemDto.prototype, "details", void 0);
class UserActivityDataDto {
    userId;
    items;
    total;
    page;
    limit;
    totalPages;
}
exports.UserActivityDataDto = UserActivityDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    __metadata("design:type", String)
], UserActivityDataDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [UserActivityItemDto],
        description: 'Array of user activities',
    }),
    __metadata("design:type", Array)
], UserActivityDataDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of activities for this user',
        example: 45,
    }),
    __metadata("design:type", Number)
], UserActivityDataDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current page number',
        example: 1,
    }),
    __metadata("design:type", Number)
], UserActivityDataDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of activities per page',
        example: 20,
    }),
    __metadata("design:type", Number)
], UserActivityDataDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of pages',
        example: 3,
    }),
    __metadata("design:type", Number)
], UserActivityDataDto.prototype, "totalPages", void 0);
class GetUserActivityResponseDto {
    success;
    data;
    message;
}
exports.GetUserActivityResponseDto = GetUserActivityResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if the request was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], GetUserActivityResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: UserActivityDataDto,
        description: 'User activity data with pagination',
    }),
    __metadata("design:type", UserActivityDataDto)
], GetUserActivityResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response message',
        example: 'User activity retrieved successfully',
    }),
    __metadata("design:type", String)
], GetUserActivityResponseDto.prototype, "message", void 0);
//# sourceMappingURL=get-user-activity.response.dto.js.map