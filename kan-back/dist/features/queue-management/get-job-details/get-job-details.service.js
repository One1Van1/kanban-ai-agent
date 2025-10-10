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
var GetJobDetailsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetJobDetailsService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
let GetJobDetailsService = GetJobDetailsService_1 = class GetJobDetailsService {
    aiAgentQueue;
    logger = new common_1.Logger(GetJobDetailsService_1.name);
    constructor(aiAgentQueue) {
        this.aiAgentQueue = aiAgentQueue;
    }
    async getJobDetails(jobId) {
        try {
            const job = await this.aiAgentQueue.getJob(jobId);
            if (!job) {
                return null;
            }
            return {
                id: job.id.toString(),
                name: job.name,
                data: job.data,
                progress: job.progress(),
                attemptsMade: job.attemptsMade,
                processedOn: job.processedOn,
                finishedOn: job.finishedOn,
                failedReason: job.failedReason,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get job ${jobId} details:`, error);
            throw error;
        }
    }
};
exports.GetJobDetailsService = GetJobDetailsService;
exports.GetJobDetailsService = GetJobDetailsService = GetJobDetailsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('ai-agent-tasks')),
    __metadata("design:paramtypes", [Object])
], GetJobDetailsService);
//# sourceMappingURL=get-job-details.service.js.map