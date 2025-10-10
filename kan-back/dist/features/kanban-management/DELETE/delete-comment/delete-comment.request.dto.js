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
exports.DeleteCommentRequestDto = exports.CommentDeleteMode = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var CommentDeleteMode;
(function (CommentDeleteMode) {
    CommentDeleteMode["SOFT_DELETE"] = "SOFT_DELETE";
    CommentDeleteMode["HARD_DELETE"] = "HARD_DELETE";
})(CommentDeleteMode || (exports.CommentDeleteMode = CommentDeleteMode = {}));
class DeleteCommentRequestDto {
    deleteMode = CommentDeleteMode.SOFT_DELETE;
    deletedBy;
    deleteReason;
}
exports.DeleteCommentRequestDto = DeleteCommentRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mode of comment deletion',
        enum: CommentDeleteMode,
        enumName: 'CommentDeleteMode',
        example: CommentDeleteMode.SOFT_DELETE,
    }),
    (0, class_validator_1.IsEnum)(CommentDeleteMode),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DeleteCommentRequestDto.prototype, "deleteMode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User performing the comment deletion',
        example: 'user-123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DeleteCommentRequestDto.prototype, "deletedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for deleting the comment',
        example: 'Comment violates community guidelines',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DeleteCommentRequestDto.prototype, "deleteReason", void 0);
//# sourceMappingURL=delete-comment.request.dto.js.map