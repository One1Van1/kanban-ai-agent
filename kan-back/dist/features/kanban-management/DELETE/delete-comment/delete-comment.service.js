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
exports.DeleteCommentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const delete_comment_request_dto_1 = require("./delete-comment.request.dto");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
let DeleteCommentService = class DeleteCommentService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async execute(commentId, requestDto) {
        const comment = await this.getCommentRecord(commentId);
        if (!comment) {
            throw new common_1.NotFoundException(`Comment with ID ${commentId} not found`);
        }
        await this.validateDeletionPermissions(comment, requestDto.deletedBy);
        const commentContent = this.extractCommentContent(comment);
        const remainingCount = await this.getRemainingCommentsCount(comment.taskId, commentId);
        const historyLog = await this.createDeletionHistoryLog(comment, requestDto);
        return {
            commentId,
            taskId: comment.taskId,
            content: commentContent,
            deleteMode: requestDto.deleteMode || delete_comment_request_dto_1.CommentDeleteMode.SOFT_DELETE,
            originalAuthor: comment.agentId,
            deletedBy: requestDto.deletedBy,
            originalCreatedAt: comment.createdAt,
            deletedAt: historyLog.createdAt,
            deleteReason: requestDto.deleteReason,
            canBeRestored: requestDto.deleteMode === delete_comment_request_dto_1.CommentDeleteMode.SOFT_DELETE,
            remainingCommentsCount: remainingCount,
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
    async validateDeletionPermissions(comment, deletedBy) {
        if (deletedBy && comment.agentId !== deletedBy) {
        }
    }
    extractCommentContent(comment) {
        return (comment.context?.commentData?.content ||
            comment.agentResponse?.content ||
            comment.taskTitle ||
            'No content available');
    }
    async getRemainingCommentsCount(taskId, excludeCommentId) {
        const totalComments = await this.taskHistoryRepository.count({
            where: {
                taskId,
                action: 'comment_added',
            },
        });
        return Math.max(0, totalComments - 1);
    }
    async createDeletionHistoryLog(originalComment, requestDto) {
        const commentContent = this.extractCommentContent(originalComment);
        const historyLog = this.taskHistoryRepository.create({
            agentId: requestDto.deletedBy || 'system',
            taskId: originalComment.taskId,
            taskKey: originalComment.taskKey,
            taskTitle: `Deleted comment: ${commentContent.substring(0, 50)}...`,
            action: 'comment_deleted',
            fromStatus: originalComment.fromStatus || originalComment.toStatus,
            toStatus: originalComment.toStatus,
            fromColumn: originalComment.fromColumn || originalComment.toColumn,
            toColumn: originalComment.toColumn,
            status: 'completed',
            context: {
                commentId: originalComment.agentResponse?.commentId,
                deletedContent: commentContent,
                deleteMode: requestDto.deleteMode,
                deleteReason: requestDto.deleteReason,
                originalAuthor: originalComment.agentId,
                originalCreatedAt: originalComment.createdAt,
            },
            agentResponse: {
                success: true,
                commentDeleted: true,
                commentId: originalComment.agentResponse?.commentId,
                deleteMode: requestDto.deleteMode,
                canBeRestored: requestDto.deleteMode === delete_comment_request_dto_1.CommentDeleteMode.SOFT_DELETE,
                timestamp: new Date().toISOString(),
            },
        });
        return await this.taskHistoryRepository.save(historyLog);
    }
};
exports.DeleteCommentService = DeleteCommentService;
exports.DeleteCommentService = DeleteCommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DeleteCommentService);
//# sourceMappingURL=delete-comment.service.js.map