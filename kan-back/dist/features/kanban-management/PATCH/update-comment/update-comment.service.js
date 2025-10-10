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
exports.UpdateCommentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
let UpdateCommentService = class UpdateCommentService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async execute(commentId, requestDto) {
        const comment = await this.getCommentRecord(commentId);
        if (!comment) {
            throw new common_1.NotFoundException(`Comment with ID ${commentId} not found`);
        }
        await this.validateUpdatePermissions(comment, requestDto.updatedBy);
        const originalContent = this.extractCommentContent(comment);
        const editCount = await this.getCommentEditCount(commentId);
        const historyLog = await this.createUpdateHistoryLog(comment, requestDto, originalContent, editCount + 1);
        return {
            commentId,
            taskId: comment.taskId,
            content: requestDto.content,
            originalContent,
            originalAuthor: comment.agentId,
            updatedBy: requestDto.updatedBy,
            originalCreatedAt: comment.createdAt,
            updatedAt: historyLog.createdAt,
            updateReason: requestDto.updateReason,
            isEdited: true,
            editCount: editCount + 1,
            contentLength: requestDto.content.length,
            success: true,
            historyLogId: historyLog.id,
        };
    }
    async getCommentRecord(commentId) {
        return await this.taskHistoryRepository.findOne({
            where: {
                action: 'comment_added',
                agentResponse: {
                    commentId,
                },
            },
            order: { createdAt: 'DESC' },
        });
    }
    async validateUpdatePermissions(comment, updatedBy) {
        if (updatedBy && comment.agentId !== updatedBy) {
        }
    }
    extractCommentContent(comment) {
        return (comment.context?.commentData?.content ||
            comment.agentResponse?.content ||
            comment.taskTitle ||
            'No content available');
    }
    async getCommentEditCount(commentId) {
        return await this.taskHistoryRepository.count({
            where: {
                action: 'comment_updated',
                context: {
                    commentId,
                },
            },
        });
    }
    async createUpdateHistoryLog(originalComment, requestDto, originalContent, editCount) {
        const historyLog = this.taskHistoryRepository.create({
            agentId: requestDto.updatedBy || 'system',
            taskId: originalComment.taskId,
            taskKey: originalComment.taskKey,
            taskTitle: `Updated comment: ${requestDto.content.substring(0, 50)}...`,
            action: 'comment_updated',
            fromStatus: originalComment.fromStatus || originalComment.toStatus,
            toStatus: originalComment.toStatus,
            fromColumn: originalComment.fromColumn || originalComment.toColumn,
            toColumn: originalComment.toColumn,
            status: 'completed',
            context: {
                commentId: originalComment.agentResponse?.commentId,
                originalContent,
                updatedContent: requestDto.content,
                updateReason: requestDto.updateReason,
                editCount,
                commentData: {
                    content: requestDto.content,
                    editCount,
                    lastEditedBy: requestDto.updatedBy,
                    lastEditedAt: new Date(),
                },
            },
            agentResponse: {
                success: true,
                commentUpdated: true,
                commentId: originalComment.agentResponse?.commentId,
                content: requestDto.content,
                originalContent,
                editCount,
                timestamp: new Date().toISOString(),
            },
        });
        return await this.taskHistoryRepository.save(historyLog);
    }
};
exports.UpdateCommentService = UpdateCommentService;
exports.UpdateCommentService = UpdateCommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UpdateCommentService);
//# sourceMappingURL=update-comment.service.js.map