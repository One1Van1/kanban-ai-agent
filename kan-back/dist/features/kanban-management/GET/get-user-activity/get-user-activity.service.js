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
exports.GetUserActivityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
let GetUserActivityService = class GetUserActivityService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async execute(userId, query) {
        const { page = 1, limit = 20, type } = query;
        const whereCondition = { agentId: userId };
        if (type && type !== 'all') {
            whereCondition.action = type;
        }
        const [activities, total] = await this.taskHistoryRepository.findAndCount({
            where: whereCondition,
            order: {
                createdAt: 'DESC',
            },
            take: limit,
            skip: (page - 1) * limit,
        });
        const items = activities.map((history) => ({
            id: history.id,
            type: history.action,
            taskId: history.taskId,
            taskTitle: history.taskTitle,
            description: this.getActivityDescription(history),
            timestamp: history.createdAt,
            details: {
                fromStatus: history.fromStatus,
                toStatus: history.toStatus,
                fromColumn: history.fromColumn,
                toColumn: history.toColumn,
            },
        }));
        return {
            success: true,
            data: {
                userId,
                items,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            message: 'User activity retrieved successfully',
        };
    }
    getActivityDescription(history) {
        switch (history.action) {
            case 'created':
                return `Created task "${history.taskTitle}"`;
            case 'updated':
                return `Updated task "${history.taskTitle}"`;
            case 'assigned':
                return `Was assigned to task "${history.taskTitle}"`;
            case 'status_changed':
                return `Changed status of "${history.taskTitle}" from ${history.fromStatus} to ${history.toStatus}`;
            case 'comment_added':
                return `Added comment to "${history.taskTitle}"`;
            default:
                return `Performed action "${history.action}" on "${history.taskTitle}"`;
        }
    }
};
exports.GetUserActivityService = GetUserActivityService;
exports.GetUserActivityService = GetUserActivityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GetUserActivityService);
//# sourceMappingURL=get-user-activity.service.js.map