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
exports.DeleteTaskAttachmentResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const delete_task_attachment_request_dto_1 = require("./delete-task-attachment.request.dto");
class DeleteTaskAttachmentResponseDto {
    taskId;
    attachmentId;
    fileName;
    mimeType;
    fileSize;
    deleteMode;
    deletedBy;
    deletedAt;
    deleteReason;
    originalUploadDate;
    originalUploader;
    physicalFileDeleted;
    backupCreated;
    backupPath;
    storageSpaceFreed;
    notifiedWatchers;
    success;
    canBeRestored;
    remainingAttachmentsCount;
    fileChecksum;
    historyLogId;
}
exports.DeleteTaskAttachmentResponseDto = DeleteTaskAttachmentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the task containing the attachment',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeleteTaskAttachmentResponseDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the deleted attachment',
        example: 'att-456e7890-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeleteTaskAttachmentResponseDto.prototype, "attachmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the deleted attachment file',
        example: 'requirements-document.pdf',
    }),
    __metadata("design:type", String)
], DeleteTaskAttachmentResponseDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'MIME type of the deleted attachment',
        example: 'application/pdf',
    }),
    __metadata("design:type", String)
], DeleteTaskAttachmentResponseDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Size of the deleted file in bytes',
        example: 2048576,
    }),
    __metadata("design:type", Number)
], DeleteTaskAttachmentResponseDto.prototype, "fileSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Deletion mode used',
        enum: delete_task_attachment_request_dto_1.AttachmentDeleteMode,
        enumName: 'AttachmentDeleteMode',
        example: delete_task_attachment_request_dto_1.AttachmentDeleteMode.SOFT_DELETE,
    }),
    __metadata("design:type", String)
], DeleteTaskAttachmentResponseDto.prototype, "deleteMode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the user who deleted the attachment',
        example: 'user-123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeleteTaskAttachmentResponseDto.prototype, "deletedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when the attachment was deleted',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], DeleteTaskAttachmentResponseDto.prototype, "deletedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for attachment deletion',
        example: 'File contains outdated information',
    }),
    __metadata("design:type", String)
], DeleteTaskAttachmentResponseDto.prototype, "deleteReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Original upload timestamp of the attachment',
        example: '2024-01-10T08:15:00.000Z',
    }),
    __metadata("design:type", Date)
], DeleteTaskAttachmentResponseDto.prototype, "originalUploadDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the user who originally uploaded the attachment',
        example: 'user-789e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeleteTaskAttachmentResponseDto.prototype, "originalUploader", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the physical file was deleted from storage',
        example: false,
    }),
    __metadata("design:type", Boolean)
], DeleteTaskAttachmentResponseDto.prototype, "physicalFileDeleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether a backup was created before deletion',
        example: true,
    }),
    __metadata("design:type", Boolean)
], DeleteTaskAttachmentResponseDto.prototype, "backupCreated", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Path to the backup file if created',
        example: '/backups/attachments/att-456_2024-01-15.pdf',
    }),
    __metadata("design:type", String)
], DeleteTaskAttachmentResponseDto.prototype, "backupPath", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount of storage space freed in bytes',
        example: 2048576,
    }),
    __metadata("design:type", Number)
], DeleteTaskAttachmentResponseDto.prototype, "storageSpaceFreed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of users who were notified about the deletion',
        type: 'array',
        items: { type: 'string' },
        example: ['user-456', 'user-789'],
    }),
    __metadata("design:type", Array)
], DeleteTaskAttachmentResponseDto.prototype, "notifiedWatchers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the operation was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], DeleteTaskAttachmentResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the attachment can be restored',
        example: true,
    }),
    __metadata("design:type", Boolean)
], DeleteTaskAttachmentResponseDto.prototype, "canBeRestored", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of remaining attachments on the task',
        example: 3,
    }),
    __metadata("design:type", Number)
], DeleteTaskAttachmentResponseDto.prototype, "remainingAttachmentsCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'File checksum for verification purposes',
        example: 'sha256:a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
    }),
    __metadata("design:type", String)
], DeleteTaskAttachmentResponseDto.prototype, "fileChecksum", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'History log entry ID for audit trail',
        example: 'hist-789e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeleteTaskAttachmentResponseDto.prototype, "historyLogId", void 0);
//# sourceMappingURL=delete-task-attachment.response.dto.js.map