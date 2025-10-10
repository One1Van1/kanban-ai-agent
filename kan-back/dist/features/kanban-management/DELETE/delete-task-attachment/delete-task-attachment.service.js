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
exports.DeleteTaskAttachmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const delete_task_attachment_request_dto_1 = require("./delete-task-attachment.request.dto");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
let DeleteTaskAttachmentService = class DeleteTaskAttachmentService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async deleteAttachment(taskId, attachmentId, requestDto) {
        const task = await this.validateTaskExists(taskId);
        const attachment = await this.getAttachmentRecord(taskId, attachmentId);
        if (!attachment) {
            throw new common_1.NotFoundException(`Attachment with ID ${attachmentId} not found in task ${taskId}`);
        }
        await this.validateDeletionPermissions(attachment, requestDto.deletedBy);
        const attachmentMetadata = await this.getAttachmentMetadata(attachment);
        const deletionSummary = await this.performAttachmentDeletion(attachment, requestDto);
        const notifiedWatchers = requestDto.notifyWatchers
            ? await this.notifyTaskWatchers(taskId, attachmentMetadata)
            : [];
        const historyLog = await this.createDeletionHistoryLog(taskId, attachment, requestDto, deletionSummary);
        return {
            taskId,
            attachmentId,
            fileName: attachmentMetadata.fileName,
            mimeType: attachmentMetadata.mimeType,
            fileSize: attachmentMetadata.fileSize,
            deleteMode: requestDto.deleteMode || delete_task_attachment_request_dto_1.AttachmentDeleteMode.SOFT_DELETE,
            deletedBy: requestDto.deletedBy,
            deletedAt: historyLog.createdAt,
            deleteReason: requestDto.deleteReason,
            originalUploadDate: attachmentMetadata.uploadedAt,
            originalUploader: attachmentMetadata.uploadedBy,
            physicalFileDeleted: deletionSummary.physicalFileDeleted,
            backupCreated: deletionSummary.backupCreated,
            backupPath: deletionSummary.backupPath,
            storageSpaceFreed: deletionSummary.storageSpaceFreed,
            notifiedWatchers,
            success: true,
            canBeRestored: requestDto.deleteMode === delete_task_attachment_request_dto_1.AttachmentDeleteMode.SOFT_DELETE ||
                requestDto.deleteMode === delete_task_attachment_request_dto_1.AttachmentDeleteMode.MOVE_TO_TRASH,
            remainingAttachmentsCount: await this.getRemainingAttachmentsCount(taskId),
            fileChecksum: attachmentMetadata.checksum,
            historyLogId: historyLog.id,
        };
    }
    async validateTaskExists(taskId) {
        const task = await this.taskHistoryRepository.findOne({
            where: {
                taskId,
                action: 'task_created',
            },
            order: { createdAt: 'DESC' },
        });
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${taskId} not found`);
        }
        return task;
    }
    async getAttachmentRecord(taskId, attachmentId) {
        return await this.taskHistoryRepository.findOne({
            where: {
                taskId,
                action: 'file_uploaded',
                agentResponse: {
                    attachmentId,
                },
            },
            order: { createdAt: 'DESC' },
        });
    }
    async validateDeletionPermissions(attachment, deletedBy) {
        const attachmentData = attachment.context?.attachmentData || {};
        const originalUploader = attachmentData.uploadedBy || attachment.agentId;
        if (originalUploader !== deletedBy) {
        }
    }
    async getAttachmentMetadata(attachment) {
        const attachmentData = attachment.context?.attachmentData || {};
        const agentResponse = attachment.agentResponse || {};
        return {
            fileName: attachmentData.fileName || agentResponse.fileName || 'unknown_file',
            fileSize: attachmentData.fileSize || agentResponse.fileSize || 0,
            mimeType: attachmentData.mimeType ||
                agentResponse.mimeType ||
                'application/octet-stream',
            uploadedAt: attachment.createdAt,
            uploadedBy: attachmentData.uploadedBy || attachment.agentId,
            filePath: attachmentData.filePath || agentResponse.filePath || '',
            checksum: attachmentData.checksum || agentResponse.checksum,
        };
    }
    async performAttachmentDeletion(attachment, requestDto) {
        const attachmentData = attachment.context?.attachmentData || {};
        const fileSize = attachmentData.fileSize || 0;
        let physicalFileDeleted = false;
        let backupCreated = false;
        let backupPath;
        let storageSpaceFreed = 0;
        if (requestDto.createBackup &&
            requestDto.deleteMode !== delete_task_attachment_request_dto_1.AttachmentDeleteMode.HARD_DELETE) {
            backupPath = await this.createAttachmentBackup(attachment);
            backupCreated = !!backupPath;
        }
        switch (requestDto.deleteMode) {
            case delete_task_attachment_request_dto_1.AttachmentDeleteMode.SOFT_DELETE:
                break;
            case delete_task_attachment_request_dto_1.AttachmentDeleteMode.MOVE_TO_TRASH:
                if (requestDto.deletePhysicalFile) {
                    physicalFileDeleted = await this.moveFileToTrash(attachmentData.filePath);
                    storageSpaceFreed = physicalFileDeleted ? fileSize : 0;
                }
                break;
            case delete_task_attachment_request_dto_1.AttachmentDeleteMode.HARD_DELETE:
                if (requestDto.deletePhysicalFile) {
                    physicalFileDeleted = await this.deletePhysicalFile(attachmentData.filePath);
                    storageSpaceFreed = physicalFileDeleted ? fileSize : 0;
                }
                break;
        }
        return {
            physicalFileDeleted,
            backupCreated,
            backupPath,
            storageSpaceFreed,
        };
    }
    async createAttachmentBackup(attachment) {
        const attachmentData = attachment.context?.attachmentData || {};
        const fileName = attachmentData.fileName || 'unknown_file';
        const timestamp = new Date().toISOString().split('T')[0];
        return `/backups/attachments/${attachment.agentResponse?.attachmentId || 'unknown'}_${timestamp}_${fileName}`;
    }
    async moveFileToTrash(filePath) {
        return filePath ? true : false;
    }
    async deletePhysicalFile(filePath) {
        return filePath ? true : false;
    }
    async notifyTaskWatchers(taskId, attachmentMetadata) {
        const taskData = await this.taskHistoryRepository.findOne({
            where: { taskId, action: 'task_created' },
            order: { createdAt: 'DESC' },
        });
        const watchers = new Set();
        if (taskData?.context?.assignmentData) {
            const assignmentData = taskData.context.assignmentData;
            if (assignmentData.assignee) {
                watchers.add(assignmentData.assignee);
            }
            if (Array.isArray(assignmentData.watchers)) {
                assignmentData.watchers.forEach((watcher) => watchers.add(watcher));
            }
        }
        return Array.from(watchers);
    }
    async getRemainingAttachmentsCount(taskId) {
        return ((await this.taskHistoryRepository.count({
            where: {
                taskId,
                action: 'file_uploaded',
                status: 'completed',
            },
        })) - 1);
    }
    async createDeletionHistoryLog(taskId, attachment, requestDto, deletionSummary) {
        const attachmentData = attachment.context?.attachmentData || {};
        const historyLog = this.taskHistoryRepository.create({
            agentId: 'system',
            taskId,
            taskKey: attachment.taskKey,
            taskTitle: `Deleted attachment: ${attachmentData.fileName || 'unknown'}`,
            action: 'attachment_deleted',
            fromStatus: 'active',
            toStatus: requestDto.deleteMode === delete_task_attachment_request_dto_1.AttachmentDeleteMode.SOFT_DELETE
                ? 'deleted'
                : requestDto.deleteMode === delete_task_attachment_request_dto_1.AttachmentDeleteMode.MOVE_TO_TRASH
                    ? 'trashed'
                    : 'removed',
            fromColumn: attachment.fromColumn,
            toColumn: attachment.toColumn,
            status: 'completed',
            context: {
                deletionType: 'attachment_deletion',
                deleteMode: requestDto.deleteMode,
                deleteReason: requestDto.deleteReason,
                attachmentId: attachment.agentResponse?.attachmentId,
                originalAttachmentData: attachmentData,
                deletionSummary,
            },
            agentResponse: {
                success: true,
                attachmentDeleted: true,
                deleteMode: requestDto.deleteMode,
                timestamp: new Date().toISOString(),
            },
        });
        return await this.taskHistoryRepository.save(historyLog);
    }
};
exports.DeleteTaskAttachmentService = DeleteTaskAttachmentService;
exports.DeleteTaskAttachmentService = DeleteTaskAttachmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DeleteTaskAttachmentService);
//# sourceMappingURL=delete-task-attachment.service.js.map