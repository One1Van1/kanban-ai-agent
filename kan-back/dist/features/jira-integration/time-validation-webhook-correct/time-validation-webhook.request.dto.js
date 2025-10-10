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
exports.TimeValidationWebhookRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class TimeValidationWebhookRequestDto {
    webhookEvent;
    issue;
    changelog;
    timestamp;
}
exports.TimeValidationWebhookRequestDto = TimeValidationWebhookRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Тип события вебхука',
        example: 'jira:issue_updated',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TimeValidationWebhookRequestDto.prototype, "webhookEvent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Данные о задаче',
        example: {
            key: 'KAN-5',
            fields: {
                status: { name: 'In Progress' },
                timespent: 3600,
                timeoriginalestimate: 7200,
            },
        },
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], TimeValidationWebhookRequestDto.prototype, "issue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Лог изменений',
        required: false,
        example: {
            items: [
                {
                    field: 'status',
                    from: '10001',
                    to: '10002',
                },
            ],
        },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], TimeValidationWebhookRequestDto.prototype, "changelog", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Временная метка события',
        example: 1640995200000,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TimeValidationWebhookRequestDto.prototype, "timestamp", void 0);
//# sourceMappingURL=time-validation-webhook.request.dto.js.map