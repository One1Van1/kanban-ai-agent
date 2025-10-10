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
var GetQueueStatusService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetQueueStatusService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
let GetQueueStatusService = GetQueueStatusService_1 = class GetQueueStatusService {
    aiAgentQueue;
    logger = new common_1.Logger(GetQueueStatusService_1.name);
    constructor(aiAgentQueue) {
        this.aiAgentQueue = aiAgentQueue;
    }
    async getQueueStatus() {
        try {
            this.logger.log('Getting queue status for ai-agent-tasks');
            const [waiting, active, completed, failed, delayed] = await Promise.all([
                this.aiAgentQueue.getWaiting(),
                this.aiAgentQueue.getActive(),
                this.aiAgentQueue.getCompleted(),
                this.aiAgentQueue.getFailed(),
                this.aiAgentQueue.getDelayed(),
            ]);
            const isPaused = await this.aiAgentQueue.isPaused();
            const status = {
                queueName: 'ai-agent-tasks',
                waiting: waiting.length,
                active: active.length,
                completed: completed.length,
                failed: failed.length,
                delayed: delayed.length,
                paused: isPaused,
            };
            this.logger.log(`Queue status: ${JSON.stringify(status)}`);
            return status;
        }
        catch (error) {
            this.logger.error('Failed to get queue status:', error);
            throw error;
        }
    }
};
exports.GetQueueStatusService = GetQueueStatusService;
exports.GetQueueStatusService = GetQueueStatusService = GetQueueStatusService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('ai-agent-tasks')),
    __metadata("design:paramtypes", [Object])
], GetQueueStatusService);
//# sourceMappingURL=get-queue-status.service.js.map