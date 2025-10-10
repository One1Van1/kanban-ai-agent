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
exports.UpdateCommentResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UpdateCommentResponseDto {
    commentId;
    taskId;
    content;
    originalContent;
    originalAuthor;
    updatedBy;
    originalCreatedAt;
    updatedAt;
    updateReason;
    isEdited;
    editCount;
    contentLength;
    success;
    historyLogId;
}
exports.UpdateCommentResponseDto = UpdateCommentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the updated comment',
        example: 'comment-123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], UpdateCommentResponseDto.prototype, "commentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the task containing the comment',
        example: 'task-456e7890-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], UpdateCommentResponseDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated comment content',
        example: 'Updated: This is the corrected analysis of the issue. The problem was in the validation logic.',
    }),
    __metadata("design:type", String)
], UpdateCommentResponseDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Original comment content before update',
        example: 'This is the analysis of the issue.',
    }),
    __metadata("design:type", String)
], UpdateCommentResponseDto.prototype, "originalContent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the user who originally created the comment',
        example: 'user-789e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], UpdateCommentResponseDto.prototype, "originalAuthor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'UUID of the user who updated the comment',
        example: 'user-123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], UpdateCommentResponseDto.prototype, "updatedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when comment was originally created',
        example: '2024-01-10T08:15:00.000Z',
    }),
    __metadata("design:type", Date)
], UpdateCommentResponseDto.prototype, "originalCreatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when comment was updated',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], UpdateCommentResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for updating the comment',
        example: 'Fixed typo and added clarification',
    }),
    __metadata("design:type", String)
], UpdateCommentResponseDto.prototype, "updateReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the comment was edited (true if updated after creation)',
        example: true,
    }),
    __metadata("design:type", Boolean)
], UpdateCommentResponseDto.prototype, "isEdited", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of times this comment has been edited',
        example: 2,
    }),
    __metadata("design:type", Number)
], UpdateCommentResponseDto.prototype, "editCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Character count of updated content',
        example: 97,
    }),
    __metadata("design:type", Number)
], UpdateCommentResponseDto.prototype, "contentLength", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the operation was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], UpdateCommentResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'History log entry ID for audit trail',
        example: 'hist-789e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], UpdateCommentResponseDto.prototype, "historyLogId", void 0);
//# sourceMappingURL=update-comment.response.dto.js.map