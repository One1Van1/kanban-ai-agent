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
exports.GetBoardSummaryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
let GetBoardSummaryService = class GetBoardSummaryService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async execute(query) {
        const { boardId, includeDetails } = query;
        const whereCondition = boardId ? { context: { boardId } } : {};
        const columnStats = await this.getColumnStatistics(whereCondition);
        const priorityStats = await this.getPriorityStatistics(whereCondition);
        const totalTasks = columnStats.reduce((sum, col) => sum + col.taskCount, 0);
        const activeTasks = columnStats
            .filter((col) => !['done', 'completed'].includes(col.columnId))
            .reduce((sum, col) => sum + col.taskCount, 0);
        const response = {
            success: true,
            data: {
                boardId: boardId || 'default',
                totalTasks,
                activeTasks,
                completedTasks: totalTasks - activeTasks,
                columns: columnStats,
                priorities: priorityStats,
                lastUpdated: new Date(),
            },
            message: 'Board summary retrieved successfully',
        };
        if (includeDetails) {
            const detailedStats = await this.getDetailedStatistics(whereCondition);
            response.data = {
                ...response.data,
                ...detailedStats,
            };
        }
        return response;
    }
    async getColumnStatistics(whereCondition) {
        const columns = [
            { columnId: 'todo', name: 'To Do', taskCount: 8, color: '#42526E' },
            {
                columnId: 'in_progress',
                name: 'In Progress',
                taskCount: 5,
                color: '#0052CC',
            },
            {
                columnId: 'in_review',
                name: 'In Review',
                taskCount: 3,
                color: '#FF8B00',
            },
            { columnId: 'done', name: 'Done', taskCount: 12, color: '#36B37E' },
            { columnId: 'blocked', name: 'Blocked', taskCount: 2, color: '#DE350B' },
        ];
        return columns;
    }
    async getPriorityStatistics(whereCondition) {
        const priorities = [
            { priority: 'highest', name: 'Highest', taskCount: 2, color: '#DE350B' },
            { priority: 'high', name: 'High', taskCount: 6, color: '#FF8B00' },
            { priority: 'medium', name: 'Medium', taskCount: 15, color: '#0052CC' },
            { priority: 'low', name: 'Low', taskCount: 7, color: '#36B37E' },
        ];
        return priorities;
    }
    async getDetailedStatistics(whereCondition) {
        return {
            avgTasksPerColumn: 6,
            tasksCreatedToday: 3,
            tasksCompletedToday: 4,
            overdueTasks: 2,
            blockedTasksDuration: '2.5 days',
            mostActiveColumn: 'in_progress',
            completionRate: 85.7,
        };
    }
};
exports.GetBoardSummaryService = GetBoardSummaryService;
exports.GetBoardSummaryService = GetBoardSummaryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GetBoardSummaryService);
//# sourceMappingURL=get-board-summary.service.js.map