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
var SendTelegramService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendTelegramService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const telegraf_1 = require("telegraf");
const send_telegram_response_dto_1 = require("./send-telegram.response.dto");
let SendTelegramService = SendTelegramService_1 = class SendTelegramService {
    configService;
    logger = new common_1.Logger(SendTelegramService_1.name);
    bot;
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        this.initializeBot();
    }
    initializeBot() {
        const telegramConfig = this.configService.get('notifications.telegram');
        if (!telegramConfig.botToken) {
            this.logger.warn('Telegram bot token not configured. Telegram notifications will be disabled.');
            return;
        }
        this.bot = new telegraf_1.Telegraf(telegramConfig.botToken);
        this.logger.log('Telegram bot initialized successfully');
    }
    async execute(request) {
        try {
            if (!this.bot) {
                throw new Error('Telegram bot is not configured');
            }
            const chatId = await this.resolveChatId(request.chatId);
            const options = {
                parse_mode: request.parseMode,
                disable_web_page_preview: request.disableWebPagePreview,
                disable_notification: request.disableNotification,
            };
            Object.keys(options).forEach((key) => {
                if (options[key] === undefined) {
                    delete options[key];
                }
            });
            const result = await this.bot.telegram.sendMessage(chatId, request.text, options);
            this.logger.log(`Telegram message sent successfully to chat ${chatId}. MessageId: ${result.message_id}`);
            return new send_telegram_response_dto_1.SendTelegramResponseDto(true, 'Telegram message sent successfully', result.message_id, chatId);
        }
        catch (error) {
            this.logger.error(`Failed to send Telegram message to chat ${request.chatId}:`, error);
            return new send_telegram_response_dto_1.SendTelegramResponseDto(false, `Failed to send Telegram message: ${error.message}`);
        }
    }
    async resolveChatId(input) {
        if (/^\d+$/.test(input) || /^-\d+$/.test(input)) {
            return input;
        }
        if (input.startsWith('@') || /^[a-zA-Z0-9_]+$/.test(input)) {
            const usernameWithAt = input.startsWith('@') ? input : `@${input}`;
            this.logger.log(`📱 Sending to username: ${usernameWithAt}`);
            return usernameWithAt;
        }
        return input;
    }
};
exports.SendTelegramService = SendTelegramService;
exports.SendTelegramService = SendTelegramService = SendTelegramService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SendTelegramService);
//# sourceMappingURL=send-telegram.service.js.map