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
exports.GetTaskCommentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
let GetTaskCommentsService = class GetTaskCommentsService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async execute(taskId, query) {
        const { page = 1, limit = 20, sortOrder = 'DESC' } = query;
        const [comments, total] = await this.taskHistoryRepository.findAndCount({
            where: {
                taskId,
                action: 'comment_added',
            },
            order: {
                createdAt: sortOrder,
            },
            take: limit,
            skip: (page - 1) * limit,
        });
        const items = comments.map((history) => ({
            id: history.id,
            taskId: history.taskId,
            content: history.executedInstruction || `Action: ${history.action}`,
            authorId: history.agentId,
            createdAt: history.createdAt,
            updatedAt: history.createdAt,
        }));
        return {
            success: true,
            data: {
                items,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            message: 'Task comments retrieved successfully',
        };
    }
};
exports.GetTaskCommentsService = GetTaskCommentsService;
exports.GetTaskCommentsService = GetTaskCommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GetTaskCommentsService);
//# sourceMappingURL=get-task-comments.service.js.map