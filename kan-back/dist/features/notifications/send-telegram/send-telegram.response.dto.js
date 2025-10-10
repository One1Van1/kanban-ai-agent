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
exports.SendTelegramResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class SendTelegramResponseDto {
    success;
    messageId;
    message;
    chatId;
    constructor(success, message, messageId, chatId) {
        this.success = success;
        this.message = message;
        this.messageId = messageId;
        this.chatId = chatId;
    }
}
exports.SendTelegramResponseDto = SendTelegramResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Success status',
        example: true,
    }),
    __metadata("design:type", Boolean)
], SendTelegramResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Message ID from Telegram',
        example: 123,
    }),
    __metadata("design:type", Number)
], SendTelegramResponseDto.prototype, "messageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response message',
        example: 'Telegram message sent successfully',
    }),
    __metadata("design:type", String)
], SendTelegramResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Chat ID where message was sent',
        example: '123456789',
    }),
    __metadata("design:type", String)
], SendTelegramResponseDto.prototype, "chatId", void 0);
//# sourceMappingURL=send-telegram.response.dto.js.map