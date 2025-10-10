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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramUtilsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let TelegramUtilsController = class TelegramUtilsController {
    getChatIdInstructions() {
        return {
            message: 'Чтобы узнать свой Telegram chat ID:',
            steps: [
                '1. Написать боту @userinfobot в Telegram',
                '2. Отправить команду /start',
                '3. Бот вернет ваш chat ID',
                '4. Использовать этот ID для настройки уведомлений',
            ],
            example: {
                chatId: '123456789',
                usage: 'Используйте этот ID в поле telegramField в задачах Jira',
            },
        };
    }
    async testMessage(body) {
        return {
            message: 'Test endpoint - implement actual Telegram sending here',
            chatId: body.chatId,
            messageText: body.message,
        };
    }
};
exports.TelegramUtilsController = TelegramUtilsController;
__decorate([
    (0, common_1.Get)('get-chat-id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить инструкции для получения chat ID',
        description: 'Возвращает инструкции, как узнать свой Telegram chat ID',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TelegramUtilsController.prototype, "getChatIdInstructions", null);
__decorate([
    (0, common_1.Post)('test-message'),
    (0, swagger_1.ApiOperation)({
        summary: 'Тест отправки сообщения',
        description: 'Тестовая отправка сообщения в Telegram',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUtilsController.prototype, "testMessage", null);
exports.TelegramUtilsController = TelegramUtilsController = __decorate([
    (0, swagger_1.ApiTags)('Telegram Utils'),
    (0, common_1.Controller)('telegram-utils')
], TelegramUtilsController);
//# sourceMappingURL=telegram-utils.controller.js.map