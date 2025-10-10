"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const send_email_controller_1 = require("../features/notifications/send-email/send-email.controller");
const send_email_service_1 = require("../features/notifications/send-email/send-email.service");
const send_telegram_controller_1 = require("../features/notifications/send-telegram/send-telegram.controller");
const send_telegram_service_1 = require("../features/notifications/send-telegram/send-telegram.service");
const notifications_config_1 = require("../config/notifications.config");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forFeature(notifications_config_1.default)],
        controllers: [send_email_controller_1.SendEmailController, send_telegram_controller_1.SendTelegramController],
        providers: [send_email_service_1.SendEmailService, send_telegram_service_1.SendTelegramService],
        exports: [send_email_service_1.SendEmailService, send_telegram_service_1.SendTelegramService],
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map