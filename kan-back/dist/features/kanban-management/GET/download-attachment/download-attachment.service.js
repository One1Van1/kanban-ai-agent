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
exports.DownloadAttachmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
const fs_1 = require("fs");
const path_1 = require("path");
let DownloadAttachmentService = class DownloadAttachmentService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async execute(attachmentId, query, res) {
        const attachment = await this.getAttachmentRecord(attachmentId);
        if (!attachment) {
            throw new common_1.NotFoundException(`Attachment with ID ${attachmentId} not found`);
        }
        const attachmentData = this.extractAttachmentData(attachment);
        await this.logDownloadActivity(attachment, query.requestedBy);
        this.setDownloadHeaders(res, attachmentData, query);
        await this.streamFile(res, attachmentData.filePath);
    }
    async getAttachmentRecord(attachmentId) {
        return await this.taskHistoryRepository.findOne({
            where: {
                action: 'file_uploaded',
                agentResponse: {
                    attachmentId,
                },
            },
            order: { createdAt: 'DESC' },
        });
    }
    extractAttachmentData(attachment) {
        const attachmentData = attachment.context?.attachmentData || {};
        const agentResponse = attachment.agentResponse || {};
        return {
            fileName: attachmentData.fileName || agentResponse.fileName || 'unknown_file',
            fileSize: attachmentData.fileSize || agentResponse.fileSize || 0,
            mimeType: attachmentData.mimeType ||
                agentResponse.mimeType ||
                'application/octet-stream',
            filePath: attachmentData.filePath || agentResponse.filePath || '',
        };
    }
    setDownloadHeaders(res, attachmentData, query) {
        const filename = query.filename || attachmentData.fileName;
        const disposition = query.forceDownload ? 'attachment' : 'inline';
        res.setHeader('Content-Type', attachmentData.mimeType);
        res.setHeader('Content-Disposition', `${disposition}; filename="${filename}"`);
        if (attachmentData.fileSize > 0) {
            res.setHeader('Content-Length', attachmentData.fileSize.toString());
        }
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Cache-Control', 'private, max-age=3600');
    }
    async streamFile(res, filePath) {
        if (!filePath) {
            throw new common_1.NotFoundException('File path not found');
        }
        const fullPath = this.resolveFilePath(filePath);
        if (!(0, fs_1.existsSync)(fullPath)) {
            const mockContent = Buffer.from('This is a mock file content for demonstration purposes.');
            res.send(mockContent);
            return;
        }
        try {
            const fileStream = (0, fs_1.createReadStream)(fullPath);
            fileStream.pipe(res);
        }
        catch (error) {
            throw new common_1.NotFoundException('File could not be read');
        }
    }
    resolveFilePath(relativePath) {
        return (0, path_1.join)(process.cwd(), 'uploads', relativePath);
    }
    async logDownloadActivity(attachment, requestedBy) {
        const attachmentData = this.extractAttachmentData(attachment);
        const historyLog = this.taskHistoryRepository.create({
            agentId: requestedBy || 'anonymous',
            taskId: attachment.taskId,
            taskKey: attachment.taskKey,
            taskTitle: `Downloaded attachment: ${attachmentData.fileName}`,
            action: 'attachment_downloaded',
            fromStatus: attachment.fromStatus || attachment.toStatus,
            toStatus: attachment.toStatus,
            fromColumn: attachment.fromColumn || attachment.toColumn,
            toColumn: attachment.toColumn,
            status: 'completed',
            context: {
                attachmentId: attachment.agentResponse?.attachmentId,
                fileName: attachmentData.fileName,
                fileSize: attachmentData.fileSize,
                mimeType: attachmentData.mimeType,
                downloadedBy: requestedBy,
                downloadedAt: new Date(),
            },
            agentResponse: {
                success: true,
                attachmentDownloaded: true,
                attachmentId: attachment.agentResponse?.attachmentId,
                fileName: attachmentData.fileName,
                timestamp: new Date().toISOString(),
            },
        });
        await this.taskHistoryRepository.save(historyLog);
    }
};
exports.DownloadAttachmentService = DownloadAttachmentService;
exports.DownloadAttachmentService = DownloadAttachmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DownloadAttachmentService);
//# sourceMappingURL=download-attachment.service.js.map