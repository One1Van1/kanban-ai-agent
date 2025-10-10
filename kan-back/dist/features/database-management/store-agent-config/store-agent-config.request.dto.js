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
exports.StoreAgentConfigRequestDto = exports.InstructionDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class InstructionDto {
    columnId;
    columnName;
    instruction;
    triggerEvent;
    conditions;
    actions;
    isActive;
    priority;
}
exports.InstructionDto = InstructionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'COLUMN_TODO', description: 'ID колонки' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InstructionDto.prototype, "columnId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'To Do', description: 'Название колонки' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InstructionDto.prototype, "columnName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Analyze task requirements and add estimates',
        description: 'Инструкция для выполнения',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InstructionDto.prototype, "instruction", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'on_enter', description: 'Событие-триггер' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InstructionDto.prototype, "triggerEvent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {},
        description: 'Условия выполнения',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], InstructionDto.prototype, "conditions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {},
        description: 'Действия для выполнения',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], InstructionDto.prototype, "actions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Активна ли инструкция',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], InstructionDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Приоритет выполнения',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], InstructionDto.prototype, "priority", void 0);
class StoreAgentConfigRequestDto {
    agentId;
    name;
    description;
    status;
    config;
    jiraInstanceUrl;
    jiraProjectKey;
    jiraApiToken;
    contextSources;
    notificationSettings;
    createdBy;
    instructions;
}
exports.StoreAgentConfigRequestDto = StoreAgentConfigRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'uuid-string',
        description: 'ID агента для обновления',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StoreAgentConfigRequestDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Task Analyzer Agent',
        description: 'Название агента',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreAgentConfigRequestDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Agent for analyzing and processing tasks',
        description: 'Описание агента',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreAgentConfigRequestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'active',
        description: 'Статус агента',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreAgentConfigRequestDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {},
        description: 'Конфигурация агента',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], StoreAgentConfigRequestDto.prototype, "config", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://company.atlassian.net',
        description: 'URL Jira инстанса',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreAgentConfigRequestDto.prototype, "jiraInstanceUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'PROJ',
        description: 'Ключ проекта в Jira',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreAgentConfigRequestDto.prototype, "jiraProjectKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'api-token',
        description: 'API токен для Jira',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreAgentConfigRequestDto.prototype, "jiraApiToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {},
        description: 'Источники контекста',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], StoreAgentConfigRequestDto.prototype, "contextSources", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {},
        description: 'Настройки уведомлений',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], StoreAgentConfigRequestDto.prototype, "notificationSettings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user123',
        description: 'Кто создал агента',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreAgentConfigRequestDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [InstructionDto],
        description: 'Инструкции агента',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => InstructionDto),
    __metadata("design:type", Array)
], StoreAgentConfigRequestDto.prototype, "instructions", void 0);
//# sourceMappingURL=store-agent-config.request.dto.js.map