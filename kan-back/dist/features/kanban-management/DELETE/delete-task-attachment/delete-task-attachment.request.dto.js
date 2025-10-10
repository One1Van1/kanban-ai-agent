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
exports.DeleteTaskAttachmentRequestDto = exports.AttachmentDeleteMode = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var AttachmentDeleteMode;
(function (AttachmentDeleteMode) {
    AttachmentDeleteMode["SOFT_DELETE"] = "SOFT_DELETE";
    AttachmentDeleteMode["HARD_DELETE"] = "HARD_DELETE";
    AttachmentDeleteMode["MOVE_TO_TRASH"] = "MOVE_TO_TRASH";
})(AttachmentDeleteMode || (exports.AttachmentDeleteMode = AttachmentDeleteMode = {}));
class DeleteTaskAttachmentRequestDto {
    deleteMode = AttachmentDeleteMode.SOFT_DELETE;
    deletedBy;
    deleteReason;
    deletePhysicalFile = false;
    createBackup = true;
    notifyWatchers = true;
}
exports.DeleteTaskAttachmentRequestDto = DeleteTaskAttachmentRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mode of attachment deletion',
        enum: AttachmentDeleteMode,
        enumName: 'AttachmentDeleteMode',
        example: AttachmentDeleteMode.SOFT_DELETE,
    }),
    (0, class_validator_1.IsEnum)(AttachmentDeleteMode),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DeleteTaskAttachmentRequestDto.prototype, "deleteMode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the user who is deleting the attachment',
        example: 'user-123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeleteTaskAttachmentRequestDto.prototype, "deletedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for deleting the attachment',
        example: 'File contains outdated information',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DeleteTaskAttachmentRequestDto.prototype, "deleteReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to permanently delete the physical file from storage',
        default: false,
        example: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DeleteTaskAttachmentRequestDto.prototype, "deletePhysicalFile", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to create a backup of the file before deletion',
        default: true,
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DeleteTaskAttachmentRequestDto.prototype, "createBackup", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to notify task watchers about attachment deletion',
        default: true,
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DeleteTaskAttachmentRequestDto.prototype, "notifyWatchers", void 0);
//# sourceMappingURL=delete-task-attachment.request.dto.js.map