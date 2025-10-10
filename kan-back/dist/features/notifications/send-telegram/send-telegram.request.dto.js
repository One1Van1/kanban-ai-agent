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
exports.SendTelegramRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SendTelegramRequestDto {
    chatId;
    text;
    parseMode;
    disableWebPagePreview;
    disableNotification;
}
exports.SendTelegramRequestDto = SendTelegramRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Telegram chat ID or username',
        example: '123456789',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendTelegramRequestDto.prototype, "chatId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Message text to send',
        example: 'Task notification: Your task has been updated',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendTelegramRequestDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Parse mode for message formatting',
        example: 'HTML',
        enum: ['HTML', 'Markdown', 'MarkdownV2'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendTelegramRequestDto.prototype, "parseMode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Disable web page preview',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SendTelegramRequestDto.prototype, "disableWebPagePreview", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Send message silently',
        example: false,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SendTelegramRequestDto.prototype, "disableNotification", void 0);
//# sourceMappingURL=send-telegram.request.dto.js.map