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
var TrackAgentInTaskService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackAgentInTaskService = void 0;
const common_1 = require("@nestjs/common");
const create_agent_service_1 = require("../../../ai-agent/create-agent/create-agent.service");
let TrackAgentInTaskService = TrackAgentInTaskService_1 = class TrackAgentInTaskService {
    createAgentService;
    logger = new common_1.Logger(TrackAgentInTaskService_1.name);
    taskTrackings = new Map();
    constructor(createAgentService) {
        this.createAgentService = createAgentService;
    }
    async execute(agentId, requestDto) {
        try {
            this.logger.log(`Starting task tracking for agent ${agentId} and task ${requestDto.taskId}`);
            const agent = await this.createAgentService.findById(agentId);
            if (!agent) {
                throw new common_1.NotFoundException(`Agent with ID ${agentId} not found`);
            }
            if (!agent.config?.isActive && agent.status !== 'active') {
                throw new Error(`Agent ${agentId} is not active and cannot track tasks`);
            }
            const tracking = {
                agentId,
                taskId: requestDto.taskId,
                boardId: requestDto.boardId,
                columnId: requestDto.columnId,
                columnName: requestDto.columnName,
                isActive: true,
                startedAt: new Date(),
                triggerType: requestDto.triggerType,
                taskData: requestDto.taskData,
            };
            if (!this.taskTrackings.has(agentId)) {
                this.taskTrackings.set(agentId, []);
            }
            const agentTrackings = this.taskTrackings.get(agentId);
            agentTrackings?.push(tracking);
            const nextActions = this.determineNextActions(agent, tracking);
            this.logger.log(`Task tracking started for agent ${agentId} and task ${requestDto.taskId}`);
            return {
                success: true,
                agentId,
                taskId: requestDto.taskId,
                message: `Agent "${agent.name}" is now tracking task ${requestDto.taskId}`,
                tracking: {
                    agentId: tracking.agentId,
                    taskId: tracking.taskId,
                    boardId: tracking.boardId,
                    columnId: tracking.columnId,
                    columnName: tracking.columnName,
                    isActive: tracking.isActive,
                    startedAt: tracking.startedAt.toISOString(),
                },
                nextActions,
            };
        }
        catch (error) {
            this.logger.error(`Failed to start task tracking for agent ${agentId}: ${error.message}`, error);
            throw error;
        }
    }
    determineNextActions(agent, tracking) {
        const actions = [];
        if (tracking.triggerType === 'task_moved_to_column') {
            actions.push(`Analyze task in column "${tracking.columnName}"`);
            actions.push('Apply column-specific instructions');
        }
        if (tracking.columnName?.toLowerCase().includes('todo')) {
            actions.push('Assess task priority and complexity');
            actions.push('Check for missing requirements');
        }
        if (tracking.columnName?.toLowerCase().includes('progress')) {
            actions.push('Monitor task progress');
            actions.push('Check for blockers');
        }
        if (tracking.columnName?.toLowerCase().includes('review')) {
            actions.push('Prepare for review checklist');
            actions.push('Validate completion criteria');
        }
        actions.push('Send status notification');
        return actions;
    }
    async getTrackingsByAgent(agentId) {
        return this.taskTrackings.get(agentId) || [];
    }
    async stopTracking(agentId, taskId) {
        const trackings = this.taskTrackings.get(agentId);
        if (!trackings)
            return false;
        const trackingIndex = trackings.findIndex((t) => t.taskId === taskId && t.isActive);
        if (trackingIndex === -1)
            return false;
        trackings[trackingIndex].isActive = false;
        this.logger.log(`Stopped tracking task ${taskId} for agent ${agentId}`);
        return true;
    }
};
exports.TrackAgentInTaskService = TrackAgentInTaskService;
exports.TrackAgentInTaskService = TrackAgentInTaskService = TrackAgentInTaskService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [create_agent_service_1.CreateAgentService])
], TrackAgentInTaskService);
//# sourceMappingURL=track-agent-in-task.service.js.map