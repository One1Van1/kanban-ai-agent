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
exports.AddTaskTimelogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
let AddTaskTimelogService = class AddTaskTimelogService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async execute(taskId, requestDto) {
        const { description, timeSpentMinutes, startTime, endTime, userId, notes } = requestDto;
        const start = new Date(startTime);
        const end = new Date(endTime);
        if (end <= start) {
            throw new Error('End time must be after start time');
        }
        const actualDurationMs = end.getTime() - start.getTime();
        const actualDurationMinutes = Math.round(actualDurationMs / (1000 * 60));
        if (Math.abs(actualDurationMinutes - timeSpentMinutes) > 5) {
            console.warn(`Time mismatch: reported ${timeSpentMinutes}min, actual ${actualDurationMinutes}min`);
        }
        const timelogEntry = this.taskHistoryRepository.create({
            taskId,
            taskKey: taskId,
            taskTitle: `Time logged for task ${taskId}`,
            action: 'time_logged',
            agentId: userId,
            status: 'completed',
            context: {
                timeSpentMinutes,
                startTime,
                endTime,
                description,
                notes,
                actualDurationMinutes,
            },
            processingTimeMs: timeSpentMinutes * 60 * 1000,
        });
        const savedEntry = await this.taskHistoryRepository.save(timelogEntry);
        const timelogData = {
            id: savedEntry.id,
            taskId,
            userId,
            description,
            timeSpentMinutes,
            timeSpentHours: Math.round((timeSpentMinutes / 60) * 100) / 100,
            startTime: start,
            endTime: end,
            notes,
            createdAt: savedEntry.createdAt,
        };
        return {
            success: true,
            data: timelogData,
            message: 'Task timelog entry added successfully',
        };
    }
};
exports.AddTaskTimelogService = AddTaskTimelogService;
exports.AddTaskTimelogService = AddTaskTimelogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AddTaskTimelogService);
//# sourceMappingURL=add-task-timelog.service.js.map