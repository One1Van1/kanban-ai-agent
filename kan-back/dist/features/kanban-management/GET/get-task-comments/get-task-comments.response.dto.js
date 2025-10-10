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
exports.GetTaskCommentsResponseDto = exports.TaskCommentsDataDto = exports.TaskCommentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class TaskCommentDto {
    id;
    taskId;
    content;
    authorId;
    createdAt;
    updatedAt;
}
exports.TaskCommentDto = TaskCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique comment identifier',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    __metadata("design:type", String)
], TaskCommentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the task this comment belongs to',
        example: 'TASK-123',
    }),
    __metadata("design:type", String)
], TaskCommentDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Content of the comment',
        example: 'This task has been updated with new requirements',
    }),
    __metadata("design:type", String)
], TaskCommentDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the agent who created the comment',
        example: 'agent-001',
    }),
    __metadata("design:type", String)
], TaskCommentDto.prototype, "authorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comment creation timestamp',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], TaskCommentDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comment last update timestamp',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], TaskCommentDto.prototype, "updatedAt", void 0);
class TaskCommentsDataDto {
    items;
    total;
    page;
    limit;
    totalPages;
}
exports.TaskCommentsDataDto = TaskCommentsDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [TaskCommentDto],
        description: 'Array of task comments',
    }),
    __metadata("design:type", Array)
], TaskCommentsDataDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of comments for this task',
        example: 15,
    }),
    __metadata("design:type", Number)
], TaskCommentsDataDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current page number',
        example: 1,
    }),
    __metadata("design:type", Number)
], TaskCommentsDataDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of comments per page',
        example: 20,
    }),
    __metadata("design:type", Number)
], TaskCommentsDataDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of pages',
        example: 1,
    }),
    __metadata("design:type", Number)
], TaskCommentsDataDto.prototype, "totalPages", void 0);
class GetTaskCommentsResponseDto {
    success;
    data;
    message;
}
exports.GetTaskCommentsResponseDto = GetTaskCommentsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if the request was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], GetTaskCommentsResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: TaskCommentsDataDto,
        description: 'Task comments data with pagination',
    }),
    __metadata("design:type", TaskCommentsDataDto)
], GetTaskCommentsResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response message',
        example: 'Task comments retrieved successfully',
    }),
    __metadata("design:type", String)
], GetTaskCommentsResponseDto.prototype, "message", void 0);
//# sourceMappingURL=get-task-comments.response.dto.js.map