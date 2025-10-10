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
exports.DeleteCommentResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const delete_comment_request_dto_1 = require("./delete-comment.request.dto");
class DeleteCommentResponseDto {
    commentId;
    taskId;
    content;
    deleteMode;
    originalAuthor;
    deletedBy;
    originalCreatedAt;
    deletedAt;
    deleteReason;
    canBeRestored;
    remainingCommentsCount;
    success;
    historyLogId;
}
exports.DeleteCommentResponseDto = DeleteCommentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the deleted comment',
        example: 'comment-123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeleteCommentResponseDto.prototype, "commentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the task containing the comment',
        example: 'task-456e7890-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeleteCommentResponseDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Content of the deleted comment',
        example: 'This comment has been deleted',
    }),
    __metadata("design:type", String)
], DeleteCommentResponseDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Deletion mode used',
        enum: delete_comment_request_dto_1.CommentDeleteMode,
        enumName: 'CommentDeleteMode',
        example: delete_comment_request_dto_1.CommentDeleteMode.SOFT_DELETE,
    }),
    __metadata("design:type", String)
], DeleteCommentResponseDto.prototype, "deleteMode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the user who originally created the comment',
        example: 'user-789e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeleteCommentResponseDto.prototype, "originalAuthor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'UUID of the user who deleted the comment',
        example: 'user-123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeleteCommentResponseDto.prototype, "deletedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when comment was originally created',
        example: '2024-01-10T08:15:00.000Z',
    }),
    __metadata("design:type", Date)
], DeleteCommentResponseDto.prototype, "originalCreatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when comment was deleted',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], DeleteCommentResponseDto.prototype, "deletedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for deleting the comment',
        example: 'Comment violates community guidelines',
    }),
    __metadata("design:type", String)
], DeleteCommentResponseDto.prototype, "deleteReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the comment can be restored',
        example: true,
    }),
    __metadata("design:type", Boolean)
], DeleteCommentResponseDto.prototype, "canBeRestored", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of remaining comments on the task',
        example: 5,
    }),
    __metadata("design:type", Number)
], DeleteCommentResponseDto.prototype, "remainingCommentsCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the operation was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], DeleteCommentResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'History log entry ID for audit trail',
        example: 'hist-789e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeleteCommentResponseDto.prototype, "historyLogId", void 0);
//# sourceMappingURL=delete-comment.response.dto.js.map