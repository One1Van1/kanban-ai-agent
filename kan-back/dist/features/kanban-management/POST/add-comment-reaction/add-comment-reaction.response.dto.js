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
exports.AddCommentReactionResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const add_comment_reaction_request_dto_1 = require("./add-comment-reaction.request.dto");
class AddCommentReactionResponseDto {
    commentId;
    reactionId;
    reactionType;
    userId;
    userName;
    customEmoji;
    reactionNote;
    createdAt;
    totalReactions;
    reactionTypeCount;
    success;
    historyLogId;
    emojiDisplay;
}
exports.AddCommentReactionResponseDto = AddCommentReactionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the comment that received the reaction',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], AddCommentReactionResponseDto.prototype, "commentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the created reaction',
        example: 'reaction-456e7890-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], AddCommentReactionResponseDto.prototype, "reactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: add_comment_reaction_request_dto_1.ReactionType,
        enumName: 'ReactionType',
        description: 'Type of reaction that was added',
        example: add_comment_reaction_request_dto_1.ReactionType.LIKE,
    }),
    __metadata("design:type", String)
], AddCommentReactionResponseDto.prototype, "reactionType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the user who added the reaction',
        example: 'user-123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], AddCommentReactionResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Display name of the user who reacted',
        example: 'John Doe',
    }),
    __metadata("design:type", String)
], AddCommentReactionResponseDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom emoji if provided',
        example: '🚀',
    }),
    __metadata("design:type", String)
], AddCommentReactionResponseDto.prototype, "customEmoji", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Note attached to the reaction',
        example: 'Great point!',
    }),
    __metadata("design:type", String)
], AddCommentReactionResponseDto.prototype, "reactionNote", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when the reaction was added',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], AddCommentReactionResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total count of reactions on this comment',
        example: 5,
    }),
    __metadata("design:type", Number)
], AddCommentReactionResponseDto.prototype, "totalReactions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Count of this specific reaction type on the comment',
        example: 3,
    }),
    __metadata("design:type", Number)
], AddCommentReactionResponseDto.prototype, "reactionTypeCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the operation was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], AddCommentReactionResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'History log entry ID for audit trail',
        example: 'hist-789e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], AddCommentReactionResponseDto.prototype, "historyLogId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Emoji representation of the reaction',
        example: '👍',
    }),
    __metadata("design:type", String)
], AddCommentReactionResponseDto.prototype, "emojiDisplay", void 0);
//# sourceMappingURL=add-comment-reaction.response.dto.js.map