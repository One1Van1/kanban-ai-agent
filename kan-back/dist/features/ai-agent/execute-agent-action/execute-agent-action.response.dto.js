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
exports.ExecuteAgentActionResponseDto = exports.AgentActionOutputDto = exports.AgentActionResult = void 0;
const swagger_1 = require("@nestjs/swagger");
var AgentActionResult;
(function (AgentActionResult) {
    AgentActionResult["SUCCESS"] = "success";
    AgentActionResult["ERROR"] = "error";
    AgentActionResult["PENDING"] = "pending";
    AgentActionResult["SKIPPED"] = "skipped";
})(AgentActionResult || (exports.AgentActionResult = AgentActionResult = {}));
class AgentActionOutputDto {
    actionType;
    description;
    data;
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.AgentActionOutputDto = AgentActionOutputDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'notification_sent',
        description: 'Type of action performed',
    }),
    __metadata("design:type", String)
], AgentActionOutputDto.prototype, "actionType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Notification sent to john.doe@example.com about high priority task',
        description: 'Details of what the agent did',
    }),
    __metadata("design:type", String)
], AgentActionOutputDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            emailSent: true,
            recipient: 'john.doe@example.com',
            notificationId: 'notif_123',
        },
        description: 'Additional data from the action execution',
    }),
    __metadata("design:type", Object)
], AgentActionOutputDto.prototype, "data", void 0);
class ExecuteAgentActionResponseDto {
    executionId;
    agentId;
    taskId;
    result;
    actions;
    summary;
    executionTimeMs;
    error;
    metadata;
    executedAt;
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.ExecuteAgentActionResponseDto = ExecuteAgentActionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'execution_uuid_123',
        description: 'Unique identifier of the execution',
    }),
    __metadata("design:type", String)
], ExecuteAgentActionResponseDto.prototype, "executionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'agent_123',
        description: 'ID of the AI agent that was executed',
    }),
    __metadata("design:type", String)
], ExecuteAgentActionResponseDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'task_456',
        description: 'ID of the task that triggered the action',
    }),
    __metadata("design:type", String)
], ExecuteAgentActionResponseDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: AgentActionResult,
        enumName: 'AgentActionResult',
        example: AgentActionResult.SUCCESS,
        description: 'Result of the agent execution',
    }),
    __metadata("design:type", String)
], ExecuteAgentActionResponseDto.prototype, "result", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [AgentActionOutputDto],
        description: 'List of actions performed by the agent',
    }),
    __metadata("design:type", Array)
], ExecuteAgentActionResponseDto.prototype, "actions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Task analyzed and high priority notification sent to assignee',
        description: 'Summary of what the agent accomplished',
    }),
    __metadata("design:type", String)
], ExecuteAgentActionResponseDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1250,
        description: 'Execution time in milliseconds',
    }),
    __metadata("design:type", Number)
], ExecuteAgentActionResponseDto.prototype, "executionTimeMs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Error processing task data: Invalid priority value',
        description: 'Error message if execution failed',
        required: false,
    }),
    __metadata("design:type", String)
], ExecuteAgentActionResponseDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            tokensUsed: 150,
            model: 'gpt-4',
            contextSources: ['task_details', 'related_tasks'],
        },
        description: 'Additional metadata about the execution',
        required: false,
    }),
    __metadata("design:type", Object)
], ExecuteAgentActionResponseDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-12-07T10:00:00.000Z',
        description: 'When the execution started',
    }),
    __metadata("design:type", Date)
], ExecuteAgentActionResponseDto.prototype, "executedAt", void 0);
//# sourceMappingURL=execute-agent-action.response.dto.js.map