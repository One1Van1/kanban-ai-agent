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
exports.AddTaskCommentResponseDto = exports.CommentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CommentDto {
    id;
    taskId;
    text;
    author;
    authorEmail;
    createdAt;
    type;
    action;
    constructor(taskHistory, commentDto) {
        this.id = taskHistory.id;
        this.taskId = taskHistory.taskId;
        this.text = commentDto.comment;
        this.author =
            commentDto.authorName || commentDto.authorEmail || 'Anonymous';
        this.authorEmail = commentDto.authorEmail || '';
        this.createdAt = taskHistory.createdAt;
        this.type = commentDto.context?.commentType || 'general';
        this.action = taskHistory.action;
    }
}
exports.CommentDto = CommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-123', description: 'Comment record ID' }),
    __metadata("design:type", String)
], CommentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PROJ-123', description: 'Task ID' }),
    __metadata("design:type", String)
], CommentDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Работа над задачей начата. Планирую завершить до конца дня.',
        description: 'Comment text',
    }),
    __metadata("design:type", String)
], CommentDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe', description: 'Comment author name' }),
    __metadata("design:type", String)
], CommentDto.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'john.doe@example.com',
        description: 'Comment author email',
    }),
    __metadata("design:type", String)
], CommentDto.prototype, "authorEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-10-09T12:00:00Z',
        description: 'Comment creation timestamp',
    }),
    __metadata("design:type", Date)
], CommentDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'general', description: 'Comment type' }),
    __metadata("design:type", String)
], CommentDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'comment_added', description: 'Action performed' }),
    __metadata("design:type", String)
], CommentDto.prototype, "action", void 0);
class AddTaskCommentResponseDto {
    comment;
    success;
    message;
    taskId;
    context;
    constructor(taskHistory, commentDto) {
        this.comment = new CommentDto(taskHistory, commentDto);
        this.success = true;
        this.message = `Comment added successfully to task ${taskHistory.taskId}`;
        this.taskId = taskHistory.taskId;
        this.context = {
            ...commentDto.context,
            wordCount: commentDto.comment.split(' ').length,
            characterCount: commentDto.comment.length,
            timestamp: new Date().toISOString(),
        };
    }
}
exports.AddTaskCommentResponseDto = AddTaskCommentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: CommentDto, description: 'Added comment information' }),
    __metadata("design:type", CommentDto)
], AddTaskCommentResponseDto.prototype, "comment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether comment addition was successful',
    }),
    __metadata("design:type", Boolean)
], AddTaskCommentResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Comment added successfully to task PROJ-123',
        description: 'Success message',
    }),
    __metadata("design:type", String)
], AddTaskCommentResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'PROJ-123',
        description: 'Task ID the comment was added to',
    }),
    __metadata("design:type", String)
], AddTaskCommentResponseDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            commentType: 'status_update',
            visibility: 'public',
            wordCount: 15,
        },
        description: 'Additional context about the comment',
    }),
    __metadata("design:type", Object)
], AddTaskCommentResponseDto.prototype, "context", void 0);
//# sourceMappingURL=add-task-comment.response.dto.js.map