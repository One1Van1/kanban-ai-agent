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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAgentActivityResponseDto = exports.AgentActivityResponseDto = exports.ActivityResult = void 0;
const swagger_1 = require("@nestjs/swagger");
var ActivityResult;
(function (ActivityResult) {
    ActivityResult["SUCCESS"] = "success";
    ActivityResult["ERROR"] = "error";
    ActivityResult["PENDING"] = "pending";
})(ActivityResult || (exports.ActivityResult = ActivityResult = {}));
class AgentActivityResponseDto {
    id;
    agentId;
    taskId;
    action;
    result;
    input;
    output;
    error;
    executionTime;
    createdAt;
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.AgentActivityResponseDto = AgentActivityResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'activity_uuid_123',
        description: 'Unique identifier of the activity',
    }),
    __metadata("design:type", String)
], AgentActivityResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'agent_123',
        description: 'ID of the AI agent',
    }),
    __metadata("design:type", String)
], AgentActivityResponseDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'task_456',
        description: 'ID of the task that was processed',
    }),
    __metadata("design:type", String)
], AgentActivityResponseDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'task_moved_to_column_executed',
        description: 'Action that was performed',
    }),
    __metadata("design:type", String)
], AgentActivityResponseDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ActivityResult,
        enumName: 'ActivityResult',
        example: ActivityResult.SUCCESS,
        description: 'Result of the activity execution',
    }),
    __metadata("design:type", String)
], AgentActivityResponseDto.prototype, "result", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            agentId: 'agent_123',
            taskId: 'task_456',
            triggerType: 'task_moved_to_column',
        },
        description: 'Input data that triggered the activity',
    }),
    __metadata("design:type", Object)
], AgentActivityResponseDto.prototype, "input", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [
            {
                actionType: 'priority_notification',
                description: 'High priority task notification sent',
                data: { priority: 'high', notificationSent: true },
            },
        ],
        description: 'Output/result data from the activity',
        required: false,
    }),
    __metadata("design:type", Object)
], AgentActivityResponseDto.prototype, "output", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Task data validation failed: missing required field',
        description: 'Error message if the activity failed',
        required: false,
    }),
    __metadata("design:type", String)
], AgentActivityResponseDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1250,
        description: 'Execution time in milliseconds',
    }),
    __metadata("design:type", Number)
], AgentActivityResponseDto.prototype, "executionTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-12-07T10:00:00.000Z',
        description: 'When the activity was executed',
    }),
    __metadata("design:type", Date)
], AgentActivityResponseDto.prototype, "createdAt", void 0);
class GetAgentActivityResponseDto {
    activities;
    total;
    count;
    offset;
    limit;
    summary;
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.GetAgentActivityResponseDto = GetAgentActivityResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [AgentActivityResponseDto],
        description: 'List of agent activities',
    }),
    __metadata("design:type", Array)
], GetAgentActivityResponseDto.prototype, "activities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 25,
        description: 'Total number of activities (for pagination)',
    }),
    __metadata("design:type", Number)
], GetAgentActivityResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
        description: 'Number of activities returned',
    }),
    __metadata("design:type", Number)
], GetAgentActivityResponseDto.prototype, "count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 0,
        description: 'Number of activities skipped',
    }),
    __metadata("design:type", Number)
], GetAgentActivityResponseDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
        description: 'Maximum number of activities requested',
    }),
    __metadata("design:type", Number)
], GetAgentActivityResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            successCount: 20,
            errorCount: 3,
            pendingCount: 2,
            avgExecutionTime: 1150,
        },
        description: 'Summary statistics for the activities',
    }),
    __metadata("design:type", Object)
], GetAgentActivityResponseDto.prototype, "summary", void 0);
//# sourceMappingURL=get-agent-activity.response.dto.js.map