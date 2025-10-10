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
exports.JiraWebhookHandlerResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class JiraWebhookHandlerResponseDto {
    status;
    issueKey;
    eventType;
    processedAt;
    details;
    constructor(status, issueKey, eventType, details) {
        this.status = status;
        this.issueKey = issueKey;
        this.eventType = eventType;
        this.processedAt = new Date().toISOString();
        this.details = details;
    }
}
exports.JiraWebhookHandlerResponseDto = JiraWebhookHandlerResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Статус обработки вебхука',
        example: 'processed',
    }),
    __metadata("design:type", String)
], JiraWebhookHandlerResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ключ обработанной задачи',
        example: 'KAN-5',
    }),
    __metadata("design:type", String)
], JiraWebhookHandlerResponseDto.prototype, "issueKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Тип обработанного события',
        example: 'issue_updated',
    }),
    __metadata("design:type", String)
], JiraWebhookHandlerResponseDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Время обработки',
        example: '2024-01-20T12:00:00Z',
    }),
    __metadata("design:type", String)
], JiraWebhookHandlerResponseDto.prototype, "processedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дополнительная информация',
        required: false,
    }),
    __metadata("design:type", Object)
], JiraWebhookHandlerResponseDto.prototype, "details", void 0);
//# sourceMappingURL=jira-webhook-handler.response.dto.js.map