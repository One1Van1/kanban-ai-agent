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
exports.UploadAttachmentResponseDto = exports.AttachmentDataDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class AttachmentDataDto {
    id;
    taskId;
    fileName;
    mimeType;
    fileSize;
    fileSizeFormatted;
    fileUrl;
    downloadUrl;
    uploadedBy;
    description;
    uploadedAt;
    isActive;
}
exports.AttachmentDataDto = AttachmentDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Attachment identifier',
        example: 'file_1642248000000_abc123def',
    }),
    __metadata("design:type", String)
], AttachmentDataDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Task ID this attachment belongs to',
        example: 'TASK-123',
    }),
    __metadata("design:type", String)
], AttachmentDataDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Original file name',
        example: 'requirements.pdf',
    }),
    __metadata("design:type", String)
], AttachmentDataDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'File MIME type',
        example: 'application/pdf',
    }),
    __metadata("design:type", String)
], AttachmentDataDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'File size in bytes',
        example: 1024000,
    }),
    __metadata("design:type", Number)
], AttachmentDataDto.prototype, "fileSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Human-readable file size',
        example: '1000.00 KB',
    }),
    __metadata("design:type", String)
], AttachmentDataDto.prototype, "fileSizeFormatted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'File URL for viewing',
        example: '/files/tasks/TASK-123/1642248000000_requirements.pdf',
    }),
    __metadata("design:type", String)
], AttachmentDataDto.prototype, "fileUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Download URL',
        example: '/files/tasks/TASK-123/1642248000000_requirements.pdf/download',
    }),
    __metadata("design:type", String)
], AttachmentDataDto.prototype, "downloadUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User who uploaded the file',
        example: 'agent-001',
    }),
    __metadata("design:type", String)
], AttachmentDataDto.prototype, "uploadedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional description of the attachment',
        example: 'Updated project requirements document',
        required: false,
    }),
    __metadata("design:type", String)
], AttachmentDataDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When the file was uploaded',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], AttachmentDataDto.prototype, "uploadedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the attachment is currently active',
        example: true,
    }),
    __metadata("design:type", Boolean)
], AttachmentDataDto.prototype, "isActive", void 0);
class UploadAttachmentResponseDto {
    success;
    data;
    message;
}
exports.UploadAttachmentResponseDto = UploadAttachmentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if the request was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], UploadAttachmentResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: AttachmentDataDto,
        description: 'Uploaded attachment data',
    }),
    __metadata("design:type", AttachmentDataDto)
], UploadAttachmentResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response message',
        example: 'File uploaded and attached to task successfully',
    }),
    __metadata("design:type", String)
], UploadAttachmentResponseDto.prototype, "message", void 0);
//# sourceMappingURL=upload-attachment.response.dto.js.map