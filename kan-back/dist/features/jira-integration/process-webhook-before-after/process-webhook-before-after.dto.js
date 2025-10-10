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
exports.ProcessWebhookBeforeAfterResponseDto = exports.ClaudeAnalysisDto = exports.ProcessWebhookBeforeAfterDto = exports.JiraIssueDto = exports.JiraIssueFieldsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class JiraIssueFieldsDto {
    summary;
    description;
    status;
    assignee;
    attachment;
}
exports.JiraIssueFieldsDto = JiraIssueFieldsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Название задачи' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JiraIssueFieldsDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Описание задачи', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JiraIssueFieldsDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Статус задачи' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], JiraIssueFieldsDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Исполнитель задачи', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], JiraIssueFieldsDto.prototype, "assignee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Вложения', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], JiraIssueFieldsDto.prototype, "attachment", void 0);
class JiraIssueDto {
    key;
    id;
    fields;
}
exports.JiraIssueDto = JiraIssueDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ключ задачи Jira', example: 'KAN-123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], JiraIssueDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID задачи' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JiraIssueDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Поля задачи' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", JiraIssueFieldsDto)
], JiraIssueDto.prototype, "fields", void 0);
class ProcessWebhookBeforeAfterDto {
    webhookEvent;
    timestamp;
    issue;
    changelog;
    issue_event_type_name;
    user;
}
exports.ProcessWebhookBeforeAfterDto = ProcessWebhookBeforeAfterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Тип webhook события',
        example: 'jira:issue_updated',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProcessWebhookBeforeAfterDto.prototype, "webhookEvent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Временная метка события', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProcessWebhookBeforeAfterDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Данные задачи Jira' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", JiraIssueDto)
], ProcessWebhookBeforeAfterDto.prototype, "issue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Changelog изменений', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ProcessWebhookBeforeAfterDto.prototype, "changelog", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Тип события задачи', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcessWebhookBeforeAfterDto.prototype, "issue_event_type_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Пользователь, инициировавший событие',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ProcessWebhookBeforeAfterDto.prototype, "user", void 0);
class ClaudeAnalysisDto {
    transformation;
    quality;
    recommendations;
}
exports.ClaudeAnalysisDto = ClaudeAnalysisDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Анализ трансформации' }),
    __metadata("design:type", Object)
], ClaudeAnalysisDto.prototype, "transformation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Оценки качества' }),
    __metadata("design:type", Object)
], ClaudeAnalysisDto.prototype, "quality", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Рекомендации' }),
    __metadata("design:type", Array)
], ClaudeAnalysisDto.prototype, "recommendations", void 0);
class ProcessWebhookBeforeAfterResponseDto {
    success;
    message;
    processed;
    taskKey;
    analysis;
    error;
    timestamp;
}
exports.ProcessWebhookBeforeAfterResponseDto = ProcessWebhookBeforeAfterResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Успешность обработки webhook' }),
    __metadata("design:type", Boolean)
], ProcessWebhookBeforeAfterResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Сообщение о результате' }),
    __metadata("design:type", String)
], ProcessWebhookBeforeAfterResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Была ли обработка выполнена' }),
    __metadata("design:type", Boolean)
], ProcessWebhookBeforeAfterResponseDto.prototype, "processed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ключ обработанной задачи', required: false }),
    __metadata("design:type", String)
], ProcessWebhookBeforeAfterResponseDto.prototype, "taskKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Результат анализа Claude', required: false }),
    __metadata("design:type", ClaudeAnalysisDto)
], ProcessWebhookBeforeAfterResponseDto.prototype, "analysis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ошибка обработки', required: false }),
    __metadata("design:type", String)
], ProcessWebhookBeforeAfterResponseDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Временная метка обработки' }),
    __metadata("design:type", String)
], ProcessWebhookBeforeAfterResponseDto.prototype, "timestamp", void 0);
//# sourceMappingURL=process-webhook-before-after.dto.js.map