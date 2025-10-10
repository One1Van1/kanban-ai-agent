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
var CreateTaskQueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTaskQueueService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const create_task_queue_dto_1 = require("./create-task-queue.dto");
let CreateTaskQueueService = CreateTaskQueueService_1 = class CreateTaskQueueService {
    aiAgentQueue;
    logger = new common_1.Logger(CreateTaskQueueService_1.name);
    constructor(aiAgentQueue) {
        this.aiAgentQueue = aiAgentQueue;
    }
    async addTaskToQueue(requestDto) {
        try {
            this.logger.log(`Adding task ${requestDto.taskId} to queue with type: ${requestDto.taskType}`);
            const jobOptions = {
                priority: this.getPriorityValue(requestDto.priority || create_task_queue_dto_1.TaskPriority.NORMAL),
                delay: requestDto.delay || 0,
                attempts: requestDto.attempts || 3,
                removeOnComplete: 100,
                removeOnFail: 50,
            };
            const job = await this.aiAgentQueue.add(requestDto.taskType, {
                taskId: requestDto.taskId,
                taskType: requestDto.taskType,
                data: requestDto.data,
                createdAt: new Date().toISOString(),
            }, jobOptions);
            this.logger.log(`Task ${requestDto.taskId} added to queue with job ID: ${job.id}`);
            return {
                success: true,
                jobId: job.id.toString(),
                taskId: requestDto.taskId,
                queueName: 'ai-agent-tasks',
                message: `Task ${requestDto.taskId} successfully added to queue`,
            };
        }
        catch (error) {
            this.logger.error(`Failed to add task ${requestDto.taskId} to queue:`, error);
            throw error;
        }
    }
    getPriorityValue(priority) {
        const priorityMap = {
            [create_task_queue_dto_1.TaskPriority.LOW]: 1,
            [create_task_queue_dto_1.TaskPriority.NORMAL]: 5,
            [create_task_queue_dto_1.TaskPriority.HIGH]: 10,
            [create_task_queue_dto_1.TaskPriority.CRITICAL]: 20,
        };
        return priorityMap[priority];
    }
};
exports.CreateTaskQueueService = CreateTaskQueueService;
exports.CreateTaskQueueService = CreateTaskQueueService = CreateTaskQueueService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('ai-agent-tasks')),
    __metadata("design:paramtypes", [Object])
], CreateTaskQueueService);
//# sourceMappingURL=create-task-queue.service.js.map