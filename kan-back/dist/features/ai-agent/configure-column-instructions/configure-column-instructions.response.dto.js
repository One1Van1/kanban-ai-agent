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
exports.ConfigureColumnInstructionsResponseDto = exports.AgentColumnInstructionResponseDto = exports.AgentTriggerConditionResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const configure_column_instructions_request_dto_1 = require("./configure-column-instructions.request.dto");
class AgentTriggerConditionResponseDto {
    type;
    value;
    operator;
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.AgentTriggerConditionResponseDto = AgentTriggerConditionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: configure_column_instructions_request_dto_1.TriggerConditionType,
        enumName: 'TriggerConditionType',
        example: configure_column_instructions_request_dto_1.TriggerConditionType.TASK_MOVED_TO_COLUMN,
        description: 'Type of trigger condition',
    }),
    __metadata("design:type", String)
], AgentTriggerConditionResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'urgent',
        description: 'Value for the trigger condition',
        required: false,
    }),
    __metadata("design:type", String)
], AgentTriggerConditionResponseDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: configure_column_instructions_request_dto_1.TriggerOperator,
        enumName: 'TriggerOperator',
        example: configure_column_instructions_request_dto_1.TriggerOperator.EQUALS,
        description: 'Operator for comparing values',
        required: false,
    }),
    __metadata("design:type", String)
], AgentTriggerConditionResponseDto.prototype, "operator", void 0);
class AgentColumnInstructionResponseDto {
    id;
    agentId;
    boardId;
    columnId;
    columnName;
    instructions;
    triggerConditions;
    isActive;
    createdAt;
    updatedAt;
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.AgentColumnInstructionResponseDto = AgentColumnInstructionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'instruction_uuid_123',
        description: 'Unique identifier of the column instruction',
    }),
    __metadata("design:type", String)
], AgentColumnInstructionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'agent_123',
        description: 'ID of the AI agent',
    }),
    __metadata("design:type", String)
], AgentColumnInstructionResponseDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'board_456',
        description: 'ID of the Kanban board',
    }),
    __metadata("design:type", String)
], AgentColumnInstructionResponseDto.prototype, "boardId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'column_789',
        description: 'ID of the column',
    }),
    __metadata("design:type", String)
], AgentColumnInstructionResponseDto.prototype, "columnId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'In Progress',
        description: 'Name of the column',
    }),
    __metadata("design:type", String)
], AgentColumnInstructionResponseDto.prototype, "columnName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'When a task moves to this column, analyze its priority and notify the assignee if it is high priority.',
        description: 'Instructions for the AI agent when tasks are in this column',
    }),
    __metadata("design:type", String)
], AgentColumnInstructionResponseDto.prototype, "instructions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [AgentTriggerConditionResponseDto],
        description: 'Trigger conditions for when the agent should act',
        required: false,
    }),
    __metadata("design:type", Array)
], AgentColumnInstructionResponseDto.prototype, "triggerConditions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether these column instructions are active',
    }),
    __metadata("design:type", Boolean)
], AgentColumnInstructionResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-12-07T10:00:00.000Z',
        description: 'When the column instruction was created',
    }),
    __metadata("design:type", Date)
], AgentColumnInstructionResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-12-07T10:00:00.000Z',
        description: 'When the column instruction was last updated',
    }),
    __metadata("design:type", Date)
], AgentColumnInstructionResponseDto.prototype, "updatedAt", void 0);
class ConfigureColumnInstructionsResponseDto {
    columnInstruction;
    message;
    constructor(columnInstruction, message) {
        this.columnInstruction = columnInstruction;
        this.message = message;
    }
}
exports.ConfigureColumnInstructionsResponseDto = ConfigureColumnInstructionsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: AgentColumnInstructionResponseDto,
        description: 'The configured column instruction',
    }),
    __metadata("design:type", AgentColumnInstructionResponseDto)
], ConfigureColumnInstructionsResponseDto.prototype, "columnInstruction", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Column instructions configured successfully',
        description: 'Success message',
    }),
    __metadata("design:type", String)
], ConfigureColumnInstructionsResponseDto.prototype, "message", void 0);
//# sourceMappingURL=configure-column-instructions.response.dto.js.map