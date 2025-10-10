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
exports.ExecuteAgentActionRequestDto = exports.AgentActionTrigger = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var AgentActionTrigger;
(function (AgentActionTrigger) {
    AgentActionTrigger["TASK_MOVED_TO_COLUMN"] = "task_moved_to_column";
    AgentActionTrigger["TASK_ASSIGNED"] = "task_assigned";
    AgentActionTrigger["TASK_PRIORITY_CHANGED"] = "task_priority_changed";
    AgentActionTrigger["TASK_DUE_DATE_APPROACHING"] = "task_due_date_approaching";
    AgentActionTrigger["MANUAL_TRIGGER"] = "manual_trigger";
})(AgentActionTrigger || (exports.AgentActionTrigger = AgentActionTrigger = {}));
class ExecuteAgentActionRequestDto {
    agentId;
    taskId;
    boardId;
    columnId;
    columnName;
    triggerType;
    taskData;
    additionalContext;
}
exports.ExecuteAgentActionRequestDto = ExecuteAgentActionRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'agent_123',
        description: 'ID of the AI agent to execute',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExecuteAgentActionRequestDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'task_456',
        description: 'ID of the task that triggered the action',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExecuteAgentActionRequestDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'board_789',
        description: 'ID of the Kanban board',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExecuteAgentActionRequestDto.prototype, "boardId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'column_123',
        description: 'ID of the current column',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExecuteAgentActionRequestDto.prototype, "columnId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'In Progress',
        description: 'Name of the current column',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExecuteAgentActionRequestDto.prototype, "columnName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: AgentActionTrigger,
        enumName: 'AgentActionTrigger',
        example: AgentActionTrigger.TASK_MOVED_TO_COLUMN,
        description: 'What triggered this agent action',
    }),
    (0, class_validator_1.IsEnum)(AgentActionTrigger),
    __metadata("design:type", String)
], ExecuteAgentActionRequestDto.prototype, "triggerType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            taskTitle: 'Fix login bug',
            taskDescription: 'Users cannot login after the recent update',
            priority: 'high',
            assignee: 'john.doe@example.com',
            previousColumn: 'To Do',
        },
        description: 'Task data and context information',
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ExecuteAgentActionRequestDto.prototype, "taskData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            userProfile: { name: 'John Doe', role: 'developer' },
            relatedTasks: ['task_111', 'task_222'],
            projectSettings: { autoAssignReviewer: true },
        },
        description: 'Additional context for the AI agent',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ExecuteAgentActionRequestDto.prototype, "additionalContext", void 0);
//# sourceMappingURL=execute-agent-action.request.dto.js.map