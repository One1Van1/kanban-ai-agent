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
exports.GetTaskTimelogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
let GetTaskTimelogService = class GetTaskTimelogService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async execute(taskId, query) {
        const { page = 1, limit = 20, fromDate, toDate } = query;
        const mockTimelogEntries = [
            {
                id: '1',
                taskId,
                userId: 'agent-001',
                description: 'Initial analysis and planning',
                timeSpentMinutes: 120,
                startTime: new Date('2024-01-15T09:00:00Z'),
                endTime: new Date('2024-01-15T11:00:00Z'),
                createdAt: new Date('2024-01-15T11:00:00Z'),
            },
            {
                id: '2',
                taskId,
                userId: 'agent-001',
                description: 'Implementation of core features',
                timeSpentMinutes: 180,
                startTime: new Date('2024-01-15T14:00:00Z'),
                endTime: new Date('2024-01-15T17:00:00Z'),
                createdAt: new Date('2024-01-15T17:00:00Z'),
            },
            {
                id: '3',
                taskId,
                userId: 'agent-002',
                description: 'Code review and testing',
                timeSpentMinutes: 90,
                startTime: new Date('2024-01-16T10:00:00Z'),
                endTime: new Date('2024-01-16T11:30:00Z'),
                createdAt: new Date('2024-01-16T11:30:00Z'),
            },
        ];
        let filteredEntries = mockTimelogEntries;
        if (fromDate || toDate) {
            filteredEntries = mockTimelogEntries.filter((entry) => {
                const entryDate = entry.createdAt;
                if (fromDate && entryDate < new Date(fromDate))
                    return false;
                if (toDate && entryDate > new Date(toDate))
                    return false;
                return true;
            });
        }
        const total = filteredEntries.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const items = filteredEntries.slice(startIndex, endIndex);
        const totalTimeSpent = filteredEntries.reduce((sum, entry) => sum + entry.timeSpentMinutes, 0);
        const avgTimePerEntry = filteredEntries.length > 0 ? totalTimeSpent / filteredEntries.length : 0;
        return {
            success: true,
            data: {
                taskId,
                items,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                summary: {
                    totalTimeSpentMinutes: totalTimeSpent,
                    totalTimeSpentHours: Math.round((totalTimeSpent / 60) * 100) / 100,
                    averageTimePerEntry: Math.round(avgTimePerEntry),
                    totalEntries: total,
                    uniqueUsers: [...new Set(filteredEntries.map((e) => e.userId))]
                        .length,
                },
            },
            message: 'Task timelog retrieved successfully',
        };
    }
};
exports.GetTaskTimelogService = GetTaskTimelogService;
exports.GetTaskTimelogService = GetTaskTimelogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GetTaskTimelogService);
//# sourceMappingURL=get-task-timelog.service.js.map