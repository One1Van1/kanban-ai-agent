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
var GetAgentActivityService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAgentActivityService = void 0;
const common_1 = require("@nestjs/common");
const get_agent_activity_request_dto_1 = require("./get-agent-activity.request.dto");
const get_agent_activity_response_dto_1 = require("./get-agent-activity.response.dto");
let GetAgentActivityService = GetAgentActivityService_1 = class GetAgentActivityService {
    logger = new common_1.Logger(GetAgentActivityService_1.name);
    mockActivities = new Map();
    constructor() {
        this.initializeMockData();
    }
    async execute(request) {
        this.logger.log(`Getting activity for agent: ${request.agentId}`);
        try {
            this.validateRequest(request);
            let activities = this.mockActivities.get(request.agentId) || [];
            activities = this.applyFilters(activities, request);
            activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            const total = activities.length;
            const paginatedActivities = activities.slice(request.offset, request.offset + request.limit);
            const activityDtos = paginatedActivities.map((activity) => new get_agent_activity_response_dto_1.AgentActivityResponseDto({
                id: activity.id,
                agentId: activity.agentId,
                taskId: activity.taskId,
                action: activity.action,
                result: activity.result,
                input: activity.input,
                output: activity.output,
                error: activity.error,
                executionTime: activity.executionTime,
                createdAt: activity.createdAt,
            }));
            const allAgentActivities = this.mockActivities.get(request.agentId) || [];
            const summary = this.calculateSummary(allAgentActivities);
            this.logger.log(`Retrieved ${activityDtos.length} activities for agent: ${request.agentId}`);
            return new get_agent_activity_response_dto_1.GetAgentActivityResponseDto({
                activities: activityDtos,
                total,
                count: activityDtos.length,
                offset: request.offset,
                limit: request.limit,
                summary,
            });
        }
        catch (error) {
            this.logger.error(`Failed to get agent activity: ${error.message}`, error.stack);
            throw error;
        }
    }
    validateRequest(request) {
        if (!request.agentId || request.agentId.trim().length === 0) {
            throw new common_1.BadRequestException('Agent ID is required');
        }
        if (request.limit && (request.limit < 1 || request.limit > 100)) {
            throw new common_1.BadRequestException('Limit must be between 1 and 100');
        }
        if (request.offset && request.offset < 0) {
            throw new common_1.BadRequestException('Offset must be non-negative');
        }
        if (request.fromDate && !this.isValidDateString(request.fromDate)) {
            throw new common_1.BadRequestException('fromDate must be in YYYY-MM-DD format');
        }
        if (request.toDate && !this.isValidDateString(request.toDate)) {
            throw new common_1.BadRequestException('toDate must be in YYYY-MM-DD format');
        }
    }
    applyFilters(activities, request) {
        let filtered = activities;
        if (request.result && request.result !== get_agent_activity_request_dto_1.ActivityResultFilter.ALL) {
            filtered = filtered.filter((activity) => activity.result === request.result);
        }
        if (request.taskId) {
            filtered = filtered.filter((activity) => activity.taskId === request.taskId);
        }
        if (request.fromDate) {
            const fromDate = new Date(request.fromDate);
            filtered = filtered.filter((activity) => activity.createdAt >= fromDate);
        }
        if (request.toDate) {
            const toDate = new Date(request.toDate);
            toDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter((activity) => activity.createdAt <= toDate);
        }
        return filtered;
    }
    calculateSummary(activities) {
        const successCount = activities.filter((a) => a.result === 'success').length;
        const errorCount = activities.filter((a) => a.result === 'error').length;
        const pendingCount = activities.filter((a) => a.result === 'pending').length;
        const totalExecutionTime = activities.reduce((sum, a) => sum + a.executionTime, 0);
        const avgExecutionTime = activities.length > 0
            ? Math.round(totalExecutionTime / activities.length)
            : 0;
        return {
            successCount,
            errorCount,
            pendingCount,
            avgExecutionTime,
        };
    }
    isValidDateString(dateString) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) {
            return false;
        }
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime());
    }
    initializeMockData() {
        const agent123Activities = [
            {
                id: 'activity_001',
                agentId: 'agent_123',
                taskId: 'task_456',
                action: 'task_moved_to_column_executed',
                result: 'success',
                input: {
                    triggerType: 'task_moved_to_column',
                    taskData: { title: 'Fix login bug', priority: 'high' },
                },
                output: [
                    {
                        actionType: 'priority_notification',
                        description: 'High priority notification sent',
                        data: { notificationSent: true },
                    },
                ],
                executionTime: 1250,
                createdAt: new Date('2023-12-07T10:00:00.000Z'),
            },
            {
                id: 'activity_002',
                agentId: 'agent_123',
                taskId: 'task_789',
                action: 'task_assigned_executed',
                result: 'success',
                input: {
                    triggerType: 'task_assigned',
                    taskData: {
                        title: 'Update documentation',
                        assignee: 'john.doe@example.com',
                    },
                },
                output: [
                    {
                        actionType: 'assignment_notification',
                        description: 'Assignment notification sent',
                        data: { notificationSent: true },
                    },
                ],
                executionTime: 980,
                createdAt: new Date('2023-12-07T09:30:00.000Z'),
            },
            {
                id: 'activity_003',
                agentId: 'agent_123',
                taskId: 'task_111',
                action: 'task_moved_to_column_failed',
                result: 'error',
                input: {
                    triggerType: 'task_moved_to_column',
                    taskData: { title: 'Invalid task' },
                },
                error: 'Missing required field: assignee',
                executionTime: 450,
                createdAt: new Date('2023-12-07T08:15:00.000Z'),
            },
        ];
        this.mockActivities.set('agent_123', agent123Activities);
        const agent456Activities = [
            {
                id: 'activity_004',
                agentId: 'agent_456',
                taskId: 'task_222',
                action: 'task_priority_changed_executed',
                result: 'success',
                input: {
                    triggerType: 'task_priority_changed',
                    taskData: { title: 'Database optimization', priority: 'urgent' },
                },
                output: [
                    {
                        actionType: 'priority_escalation',
                        description: 'Priority escalation notification sent',
                        data: { escalated: true },
                    },
                ],
                executionTime: 1100,
                createdAt: new Date('2023-12-06T16:20:00.000Z'),
            },
        ];
        this.mockActivities.set('agent_456', agent456Activities);
    }
    async addActivity(activity) {
        const activities = this.mockActivities.get(activity.agentId) || [];
        activities.push(activity);
        this.mockActivities.set(activity.agentId, activities);
    }
};
exports.GetAgentActivityService = GetAgentActivityService;
exports.GetAgentActivityService = GetAgentActivityService = GetAgentActivityService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GetAgentActivityService);
//# sourceMappingURL=get-agent-activity.service.js.map