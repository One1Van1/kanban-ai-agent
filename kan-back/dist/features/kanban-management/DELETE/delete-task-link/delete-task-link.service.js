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
exports.DeleteTaskLinkService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
let DeleteTaskLinkService = class DeleteTaskLinkService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async execute(taskId, linkId, requestDto) {
        const taskLinkRecord = await this.getTaskLinkRecord(taskId, linkId);
        if (!taskLinkRecord) {
            throw new common_1.NotFoundException(`Link with ID ${linkId} not found on task ${taskId}`);
        }
        const linkInfo = this.extractLinkInfo(taskLinkRecord);
        const linkedTaskInfo = await this.getLinkedTaskInfo(linkInfo.linkedTaskId);
        if (requestDto.deletedBy) {
            await this.validateDeletePermissions(taskLinkRecord, requestDto.deletedBy);
        }
        const historyEntry = await this.createDeletionHistoryLog(taskId, linkInfo, linkedTaskInfo, requestDto);
        const remainingLinksCount = await this.countRemainingLinks(taskId, linkId);
        return {
            taskId,
            linkId,
            linkedTaskId: linkInfo.linkedTaskId,
            linkType: linkInfo.linkType,
            linkDirection: linkInfo.linkDirection,
            deletedBy: requestDto.deletedBy,
            deletedAt: historyEntry.createdAt,
            deleteReason: requestDto.deleteReason,
            linkedTaskTitle: linkedTaskInfo.title,
            remainingLinksCount,
            success: true,
            historyLogId: historyEntry.id,
        };
    }
    async getTaskLinkRecord(taskId, linkId) {
        return await this.taskHistoryRepository.findOne({
            where: {
                taskId,
                action: 'LINK_CREATED',
                context: {
                    linkId,
                },
            },
            order: { createdAt: 'DESC' },
        });
    }
    extractLinkInfo(taskLinkRecord) {
        const context = taskLinkRecord.context || {};
        return {
            linkedTaskId: context.linkedTaskId || 'unknown',
            linkType: context.linkType || 'unknown',
            linkDirection: context.linkDirection || 'outbound',
        };
    }
    async getLinkedTaskInfo(linkedTaskId) {
        const linkedTaskRecord = await this.taskHistoryRepository.findOne({
            where: {
                taskId: linkedTaskId,
                action: 'created',
            },
            order: { createdAt: 'DESC' },
        });
        return {
            title: linkedTaskRecord?.taskTitle || 'Unknown Task',
        };
    }
    async validateDeletePermissions(taskLinkRecord, deletedBy) {
        const canModifyLinks = await this.checkTaskLinkPermissions(taskLinkRecord, deletedBy);
        if (!canModifyLinks) {
            throw new common_1.ForbiddenException('Insufficient permissions to delete task links');
        }
    }
    async checkTaskLinkPermissions(taskLinkRecord, userId) {
        if (taskLinkRecord.agentId === userId) {
            return true;
        }
        return true;
    }
    async createDeletionHistoryLog(taskId, linkInfo, linkedTaskInfo, requestDto) {
        const historyEntry = this.taskHistoryRepository.create({
            agentId: requestDto.deletedBy || 'system',
            taskId,
            taskKey: `TASK-${taskId.slice(-8)}`,
            taskTitle: 'Task Link Deletion',
            action: 'LINK_DELETED',
            context: {
                operation: 'delete_task_link',
                deletedLink: {
                    linkId: linkInfo.linkId,
                    linkedTaskId: linkInfo.linkedTaskId,
                    linkedTaskTitle: linkedTaskInfo.title,
                    linkType: linkInfo.linkType,
                    linkDirection: linkInfo.linkDirection,
                    deleteReason: requestDto.deleteReason,
                },
            },
            status: 'completed',
        });
        return await this.taskHistoryRepository.save(historyEntry);
    }
    async countRemainingLinks(taskId, excludeLinkId) {
        const linkRecords = await this.taskHistoryRepository.find({
            where: {
                taskId,
                action: 'LINK_CREATED',
            },
        });
        const remainingLinks = linkRecords.filter((record) => {
            const context = record.context || {};
            return context.linkId !== excludeLinkId;
        });
        return remainingLinks.length;
    }
};
exports.DeleteTaskLinkService = DeleteTaskLinkService;
exports.DeleteTaskLinkService = DeleteTaskLinkService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DeleteTaskLinkService);
//# sourceMappingURL=delete-task-link.service.js.map