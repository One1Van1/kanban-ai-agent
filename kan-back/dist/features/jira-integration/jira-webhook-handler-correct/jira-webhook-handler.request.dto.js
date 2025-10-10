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
exports.JiraWebhookHandlerRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class JiraWebhookHandlerRequestDto {
    webhookEvent;
    issue_event_type_name;
    eventType;
    issue;
    user;
    changelog;
    timestamp;
    comment;
    matchedConditions;
    project;
    transition;
}
exports.JiraWebhookHandlerRequestDto = JiraWebhookHandlerRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Тип события вебхука',
        example: 'jira:issue_updated',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JiraWebhookHandlerRequestDto.prototype, "webhookEvent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Название типа события',
        example: 'issue_updated',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JiraWebhookHandlerRequestDto.prototype, "issue_event_type_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JiraWebhookHandlerRequestDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Данные о задаче',
        example: {
            key: 'KAN-5',
            fields: {
                summary: 'Test task',
            },
        },
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], JiraWebhookHandlerRequestDto.prototype, "issue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Данные о пользователе',
        example: {
            accountId: 'user123',
            displayName: 'John Doe',
        },
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], JiraWebhookHandlerRequestDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Лог изменений',
        example: {
            items: [
                {
                    field: 'status',
                    from: '10001',
                    to: '10002',
                },
            ],
        },
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], JiraWebhookHandlerRequestDto.prototype, "changelog", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], JiraWebhookHandlerRequestDto.prototype, "timestamp", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], JiraWebhookHandlerRequestDto.prototype, "comment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], JiraWebhookHandlerRequestDto.prototype, "matchedConditions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], JiraWebhookHandlerRequestDto.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], JiraWebhookHandlerRequestDto.prototype, "transition", void 0);
//# sourceMappingURL=jira-webhook-handler.request.dto.js.map