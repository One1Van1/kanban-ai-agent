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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadAttachmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
let UploadAttachmentService = class UploadAttachmentService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async execute(taskId, requestDto) {
        const { fileName, mimeType, fileSize, fileContent, uploadedBy, description, } = requestDto;
        this.validateFile(fileName, mimeType, fileSize, fileContent);
        const fileUrl = this.generateFileUrl(taskId, fileName);
        const fileId = this.generateFileId();
        const attachmentEntry = this.taskHistoryRepository.create({
            taskId,
            taskKey: taskId,
            taskTitle: `File attached: ${fileName}`,
            action: 'file_attached',
            agentId: uploadedBy,
            status: 'completed',
            context: {
                fileName,
                mimeType,
                fileSize,
                fileId,
                fileUrl,
                description,
                uploadedBy,
            },
        });
        const savedEntry = await this.taskHistoryRepository.save(attachmentEntry);
        const attachmentData = {
            id: fileId,
            taskId,
            fileName,
            mimeType,
            fileSize,
            fileSizeFormatted: this.formatFileSize(fileSize),
            fileUrl,
            downloadUrl: `${fileUrl}/download`,
            uploadedBy,
            description,
            uploadedAt: savedEntry.createdAt,
            isActive: true,
        };
        return {
            success: true,
            data: attachmentData,
            message: 'File uploaded and attached to task successfully',
        };
    }
    validateFile(fileName, mimeType, fileSize, fileContent) {
        const allowedExtensions = [
            '.pdf',
            '.doc',
            '.docx',
            '.txt',
            '.jpg',
            '.jpeg',
            '.png',
            '.gif',
        ];
        const fileExtension = fileName
            .toLowerCase()
            .substring(fileName.lastIndexOf('.'));
        if (!allowedExtensions.includes(fileExtension)) {
            throw new Error(`File type ${fileExtension} is not allowed`);
        }
        const allowedMimeTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'image/jpeg',
            'image/png',
            'image/gif',
        ];
        if (!allowedMimeTypes.includes(mimeType)) {
            throw new Error(`MIME type ${mimeType} is not allowed`);
        }
        if (!this.isValidBase64(fileContent)) {
            throw new Error('Invalid file content format');
        }
    }
    isValidBase64(str) {
        try {
            return btoa(atob(str)) === str;
        }
        catch (err) {
            return false;
        }
    }
    generateFileUrl(taskId, fileName) {
        const timestamp = Date.now();
        return `/files/tasks/${taskId}/${timestamp}_${fileName}`;
    }
    generateFileId() {
        return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    formatFileSize(bytes) {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};
exports.UploadAttachmentService = UploadAttachmentService;
exports.UploadAttachmentService = UploadAttachmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UploadAttachmentService);
//# sourceMappingURL=upload-attachment.service.js.map