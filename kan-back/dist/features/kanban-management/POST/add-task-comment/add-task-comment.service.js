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
exports.AddTaskCommentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const add_task_comment_response_dto_1 = require("./add-task-comment.response.dto");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
let AddTaskCommentService = class AddTaskCommentService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async execute(taskId, commentDto) {
        const existingTask = await this.taskHistoryRepository.findOne({
            where: { taskId },
            order: { createdAt: 'DESC' },
        });
        if (!existingTask) {
            throw new common_1.NotFoundException(`Task with ID ${taskId} not found`);
        }
        const commentHistory = this.taskHistoryRepository.create({
            taskId: taskId,
            taskKey: existingTask.taskKey,
            taskTitle: existingTask.taskTitle,
            action: 'comment_added',
            fromColumn: existingTask.toColumn,
            toColumn: existingTask.toColumn,
            fromStatus: existingTask.toStatus,
            toStatus: existingTask.toStatus,
            status: 'completed',
            context: {
                ...existingTask.context,
                ...commentDto.context,
                comment: {
                    text: commentDto.comment,
                    author: commentDto.authorName || commentDto.authorEmail || 'Anonymous',
                    authorEmail: commentDto.authorEmail || '',
                    timestamp: new Date().toISOString(),
                    type: commentDto.context?.commentType || 'general',
                },
            },
            agentId: commentDto.agentId || existingTask.agentId || 'system',
            agentResponse: {
                success: true,
                message: `Comment added to task ${taskId}`,
                timestamp: new Date().toISOString(),
                triggerType: commentDto.triggerType || 'manual',
                commentLength: commentDto.comment.length,
            },
        });
        const savedComment = await this.taskHistoryRepository.save(commentHistory);
        return new add_task_comment_response_dto_1.AddTaskCommentResponseDto(savedComment, commentDto);
    }
};
exports.AddTaskCommentService = AddTaskCommentService;
exports.AddTaskCommentService = AddTaskCommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AddTaskCommentService);
//# sourceMappingURL=add-task-comment.service.js.map