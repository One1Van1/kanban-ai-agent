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
exports.DeleteBoardRequestDto = exports.BoardDeleteMode = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var BoardDeleteMode;
(function (BoardDeleteMode) {
    BoardDeleteMode["SOFT_DELETE"] = "SOFT_DELETE";
    BoardDeleteMode["HARD_DELETE"] = "HARD_DELETE";
    BoardDeleteMode["ARCHIVE"] = "ARCHIVE";
    BoardDeleteMode["EXPORT_AND_DELETE"] = "EXPORT_AND_DELETE";
})(BoardDeleteMode || (exports.BoardDeleteMode = BoardDeleteMode = {}));
class DeleteBoardRequestDto {
    deleteMode = BoardDeleteMode.SOFT_DELETE;
    deletedBy;
    deleteReason;
    forceDelete = false;
    notifyMembers = true;
    targetBoardId;
    createBackup = true;
    deleteFiles = false;
}
exports.DeleteBoardRequestDto = DeleteBoardRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mode of board deletion',
        enum: BoardDeleteMode,
        enumName: 'BoardDeleteMode',
        example: BoardDeleteMode.SOFT_DELETE,
    }),
    (0, class_validator_1.IsEnum)(BoardDeleteMode),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DeleteBoardRequestDto.prototype, "deleteMode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the user who is deleting the board',
        example: 'user-123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeleteBoardRequestDto.prototype, "deletedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for deleting the board',
        example: 'Project completed, board no longer needed',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DeleteBoardRequestDto.prototype, "deleteReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to force delete even if board has active tasks',
        default: false,
        example: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DeleteBoardRequestDto.prototype, "forceDelete", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to notify board members about deletion',
        default: true,
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DeleteBoardRequestDto.prototype, "notifyMembers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Target board ID for moving tasks when using EXPORT_AND_DELETE mode',
        example: '456e7890-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DeleteBoardRequestDto.prototype, "targetBoardId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to backup board data before deletion',
        default: true,
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DeleteBoardRequestDto.prototype, "createBackup", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to delete associated files and attachments',
        default: false,
        example: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DeleteBoardRequestDto.prototype, "deleteFiles", void 0);
//# sourceMappingURL=delete-board.request.dto.js.map