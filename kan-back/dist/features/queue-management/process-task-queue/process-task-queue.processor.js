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
var ProcessTaskQueueProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessTaskQueueProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
let ProcessTaskQueueProcessor = ProcessTaskQueueProcessor_1 = class ProcessTaskQueueProcessor {
    logger = new common_1.Logger(ProcessTaskQueueProcessor_1.name);
    async handleTask(job) {
        const { taskId, taskType, data } = job.data;
        this.logger.log(`Processing task ${taskId} of type: ${taskType}`);
        this.logger.debug(`Task data:`, data);
        try {
            await this.processTaskByType(taskType, data);
            this.logger.log(`Task ${taskId} completed successfully`);
            return { success: true, taskId, completedAt: new Date().toISOString() };
        }
        catch (error) {
            this.logger.error(`Task ${taskId} failed:`, error);
            throw error;
        }
    }
    async processTaskByType(taskType, data) {
        const processingMap = {
            'ai-analysis': 3000,
            'send-notification': 1000,
            'generate-report': 5000,
            default: 2000,
        };
        const delay = processingMap[taskType] || processingMap['default'];
        this.logger.log(`Processing ${taskType} task for ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        this.logger.log(`Finished processing ${taskType} task`);
    }
};
exports.ProcessTaskQueueProcessor = ProcessTaskQueueProcessor;
__decorate([
    (0, bull_1.Process)('*'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProcessTaskQueueProcessor.prototype, "handleTask", null);
exports.ProcessTaskQueueProcessor = ProcessTaskQueueProcessor = ProcessTaskQueueProcessor_1 = __decorate([
    (0, bull_1.Processor)('ai-agent-tasks')
], ProcessTaskQueueProcessor);
//# sourceMappingURL=process-task-queue.processor.js.map