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
exports.TimeValidationWebhookResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class TimeValidationWebhookResponseDto {
    status;
    issueKey;
    isValid;
    processedAt;
    validationDetails;
    constructor(status, issueKey, isValid, validationDetails) {
        this.status = status;
        this.issueKey = issueKey;
        this.isValid = isValid;
        this.validationDetails = validationDetails;
        this.processedAt = new Date().toISOString();
    }
}
exports.TimeValidationWebhookResponseDto = TimeValidationWebhookResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Статус валидации времени',
        example: 'validated',
    }),
    __metadata("design:type", String)
], TimeValidationWebhookResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ключ задачи',
        example: 'KAN-5',
    }),
    __metadata("design:type", String)
], TimeValidationWebhookResponseDto.prototype, "issueKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Результат валидации',
        example: true,
    }),
    __metadata("design:type", Boolean)
], TimeValidationWebhookResponseDto.prototype, "isValid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Время обработки',
        example: '2024-01-20T12:00:00Z',
    }),
    __metadata("design:type", String)
], TimeValidationWebhookResponseDto.prototype, "processedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Детали валидации',
        example: {
            timeSpent: 3600,
            timeEstimate: 7200,
            efficiency: 50,
        },
    }),
    __metadata("design:type", Object)
], TimeValidationWebhookResponseDto.prototype, "validationDetails", void 0);
//# sourceMappingURL=time-validation-webhook.response.dto.js.map