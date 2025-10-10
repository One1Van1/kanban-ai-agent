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
exports.AddCommentReactionRequestDto = exports.ReactionType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var ReactionType;
(function (ReactionType) {
    ReactionType["LIKE"] = "like";
    ReactionType["DISLIKE"] = "dislike";
    ReactionType["HEART"] = "heart";
    ReactionType["LAUGH"] = "laugh";
    ReactionType["SURPRISED"] = "surprised";
    ReactionType["ANGRY"] = "angry";
    ReactionType["THUMBS_UP"] = "thumbs_up";
    ReactionType["THUMBS_DOWN"] = "thumbs_down";
    ReactionType["CELEBRATE"] = "celebrate";
    ReactionType["CONFUSED"] = "confused";
})(ReactionType || (exports.ReactionType = ReactionType = {}));
class AddCommentReactionRequestDto {
    reactionType;
    userId;
    customEmoji;
    reactionNote;
}
exports.AddCommentReactionRequestDto = AddCommentReactionRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ReactionType,
        enumName: 'ReactionType',
        description: 'Type of emoji reaction to add',
        example: ReactionType.LIKE,
    }),
    (0, class_validator_1.IsEnum)(ReactionType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddCommentReactionRequestDto.prototype, "reactionType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the user adding the reaction',
        example: 'user-123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddCommentReactionRequestDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional custom emoji for reaction',
        example: '🚀',
        maxLength: 10,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddCommentReactionRequestDto.prototype, "customEmoji", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional context or note for the reaction',
        example: 'Great point!',
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddCommentReactionRequestDto.prototype, "reactionNote", void 0);
//# sourceMappingURL=add-comment-reaction.request.dto.js.map