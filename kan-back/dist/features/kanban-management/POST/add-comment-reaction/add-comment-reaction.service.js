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
exports.AddCommentReactionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
const add_comment_reaction_request_dto_1 = require("./add-comment-reaction.request.dto");
let AddCommentReactionService = class AddCommentReactionService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async execute(commentId, requestDto) {
        const commentRecord = await this.getCommentRecord(commentId);
        if (!commentRecord) {
            throw new common_1.NotFoundException(`Comment with ID ${commentId} not found`);
        }
        const existingReaction = await this.findExistingReaction(commentId, requestDto.userId, requestDto.reactionType);
        if (existingReaction) {
            throw new common_1.ConflictException(`User already has a ${requestDto.reactionType} reaction on this comment`);
        }
        const reactionId = `reaction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const reactionEntry = await this.createReactionHistoryLog(commentId, reactionId, requestDto, commentRecord);
        const userName = await this.getUserDisplayName(requestDto.userId);
        const { totalReactions, reactionTypeCount } = await this.countReactions(commentId, requestDto.reactionType);
        const emojiDisplay = this.getEmojiDisplay(requestDto.reactionType, requestDto.customEmoji);
        return {
            commentId,
            reactionId,
            reactionType: requestDto.reactionType,
            userId: requestDto.userId,
            userName,
            customEmoji: requestDto.customEmoji,
            reactionNote: requestDto.reactionNote,
            createdAt: reactionEntry.createdAt,
            totalReactions: totalReactions + 1,
            reactionTypeCount: reactionTypeCount + 1,
            success: true,
            historyLogId: reactionEntry.id,
            emojiDisplay,
        };
    }
    async getCommentRecord(commentId) {
        return await this.taskHistoryRepository.findOne({
            where: {
                context: {
                    commentId,
                },
                action: 'COMMENT_ADDED',
            },
            order: { createdAt: 'DESC' },
        });
    }
    async findExistingReaction(commentId, userId, reactionType) {
        return await this.taskHistoryRepository.findOne({
            where: {
                agentId: userId,
                action: 'REACTION_ADDED',
                context: {
                    commentId,
                    reactionType,
                },
            },
        });
    }
    async createReactionHistoryLog(commentId, reactionId, requestDto, commentRecord) {
        const reactionEntry = this.taskHistoryRepository.create({
            agentId: requestDto.userId,
            taskId: commentRecord.taskId,
            taskKey: commentRecord.taskKey,
            taskTitle: `Reaction on Comment`,
            action: 'REACTION_ADDED',
            context: {
                operation: 'add_comment_reaction',
                commentId,
                reactionId,
                reactionType: requestDto.reactionType,
                customEmoji: requestDto.customEmoji,
                reactionNote: requestDto.reactionNote,
                originalCommentContent: commentRecord.context?.content?.substring(0, 100) || '',
            },
            status: 'completed',
        });
        return await this.taskHistoryRepository.save(reactionEntry);
    }
    async getUserDisplayName(userId) {
        if (userId.startsWith('user-')) {
            return `User ${userId.slice(-8)}`;
        }
        return `User ${userId.substring(0, 8)}`;
    }
    async countReactions(commentId, reactionType) {
        const allReactions = await this.taskHistoryRepository.find({
            where: {
                action: 'REACTION_ADDED',
                context: {
                    commentId,
                },
            },
        });
        const totalReactions = allReactions.length;
        const reactionTypeCount = allReactions.filter((reaction) => {
            const context = reaction.context || {};
            return context.reactionType === reactionType;
        }).length;
        return { totalReactions, reactionTypeCount };
    }
    getEmojiDisplay(reactionType, customEmoji) {
        if (customEmoji) {
            return customEmoji;
        }
        const emojiMap = {
            [add_comment_reaction_request_dto_1.ReactionType.LIKE]: '👍',
            [add_comment_reaction_request_dto_1.ReactionType.DISLIKE]: '👎',
            [add_comment_reaction_request_dto_1.ReactionType.HEART]: '❤️',
            [add_comment_reaction_request_dto_1.ReactionType.LAUGH]: '😂',
            [add_comment_reaction_request_dto_1.ReactionType.SURPRISED]: '😮',
            [add_comment_reaction_request_dto_1.ReactionType.ANGRY]: '😠',
            [add_comment_reaction_request_dto_1.ReactionType.THUMBS_UP]: '👍',
            [add_comment_reaction_request_dto_1.ReactionType.THUMBS_DOWN]: '👎',
            [add_comment_reaction_request_dto_1.ReactionType.CELEBRATE]: '🎉',
            [add_comment_reaction_request_dto_1.ReactionType.CONFUSED]: '😕',
        };
        return emojiMap[reactionType] || '👍';
    }
};
exports.AddCommentReactionService = AddCommentReactionService;
exports.AddCommentReactionService = AddCommentReactionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AddCommentReactionService);
//# sourceMappingURL=add-comment-reaction.service.js.map