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
exports.ConfigureColumnInstructionsRequestDto = exports.AgentTriggerConditionDto = exports.TriggerOperator = exports.TriggerConditionType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var TriggerConditionType;
(function (TriggerConditionType) {
    TriggerConditionType["TASK_MOVED_TO_COLUMN"] = "task_moved_to_column";
    TriggerConditionType["TASK_ASSIGNED"] = "task_assigned";
    TriggerConditionType["TASK_PRIORITY_CHANGED"] = "task_priority_changed";
    TriggerConditionType["TASK_DUE_DATE_APPROACHING"] = "task_due_date_approaching";
})(TriggerConditionType || (exports.TriggerConditionType = TriggerConditionType = {}));
var TriggerOperator;
(function (TriggerOperator) {
    TriggerOperator["EQUALS"] = "equals";
    TriggerOperator["CONTAINS"] = "contains";
    TriggerOperator["GREATER_THAN"] = "greater_than";
    TriggerOperator["LESS_THAN"] = "less_than";
})(TriggerOperator || (exports.TriggerOperator = TriggerOperator = {}));
class AgentTriggerConditionDto {
    type;
    value;
    operator;
}
exports.AgentTriggerConditionDto = AgentTriggerConditionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: TriggerConditionType,
        enumName: 'TriggerConditionType',
        example: TriggerConditionType.TASK_MOVED_TO_COLUMN,
        description: 'Type of trigger condition',
    }),
    (0, class_validator_1.IsEnum)(TriggerConditionType),
    __metadata("design:type", String)
], AgentTriggerConditionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'urgent',
        description: 'Value for the trigger condition',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AgentTriggerConditionDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: TriggerOperator,
        enumName: 'TriggerOperator',
        example: TriggerOperator.EQUALS,
        description: 'Operator for comparing values',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TriggerOperator),
    __metadata("design:type", String)
], AgentTriggerConditionDto.prototype, "operator", void 0);
class ConfigureColumnInstructionsRequestDto {
    agentId;
    boardId;
    columnId;
    columnName;
    instructions;
    triggerConditions;
    isActive;
}
exports.ConfigureColumnInstructionsRequestDto = ConfigureColumnInstructionsRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'agent_123',
        description: 'ID of the AI agent',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfigureColumnInstructionsRequestDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'board_456',
        description: 'ID of the Kanban board',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfigureColumnInstructionsRequestDto.prototype, "boardId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'column_789',
        description: 'ID of the column',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfigureColumnInstructionsRequestDto.prototype, "columnId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'In Progress',
        description: 'Name of the column',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfigureColumnInstructionsRequestDto.prototype, "columnName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'When a task moves to this column, analyze its priority and notify the assignee if it is high priority. Also check if all required fields are filled.',
        description: 'Instructions for the AI agent when tasks are in this column',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfigureColumnInstructionsRequestDto.prototype, "instructions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [AgentTriggerConditionDto],
        description: 'Trigger conditions for when the agent should act',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AgentTriggerConditionDto),
    __metadata("design:type", Array)
], ConfigureColumnInstructionsRequestDto.prototype, "triggerConditions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether these column instructions are active',
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ConfigureColumnInstructionsRequestDto.prototype, "isActive", void 0);
//# sourceMappingURL=configure-column-instructions.request.dto.js.map