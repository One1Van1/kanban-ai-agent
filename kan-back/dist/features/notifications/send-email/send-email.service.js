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
var SendEmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendEmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
const send_email_response_dto_1 = require("./send-email.response.dto");
let SendEmailService = SendEmailService_1 = class SendEmailService {
    configService;
    logger = new common_1.Logger(SendEmailService_1.name);
    transporter;
    constructor(configService) {
        this.configService = configService;
        this.initializeTransporter();
    }
    initializeTransporter() {
        const emailConfig = this.configService.get('notifications.email');
        this.transporter = nodemailer.createTransport({
            host: emailConfig.host,
            port: emailConfig.port,
            secure: emailConfig.secure,
            auth: {
                user: emailConfig.auth.user,
                pass: emailConfig.auth.pass,
            },
        });
    }
    async execute(request) {
        try {
            const emailConfig = this.configService.get('notifications.email');
            const mailOptions = {
                from: emailConfig.from,
                to: request.to,
                subject: request.subject,
                text: request.text,
                html: request.html,
                cc: request.cc,
                bcc: request.bcc,
            };
            const info = await this.transporter.sendMail(mailOptions);
            this.logger.log(`Email sent successfully to ${request.to}. MessageId: ${info.messageId}`);
            return new send_email_response_dto_1.SendEmailResponseDto(true, info.messageId, 'Email sent successfully');
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${request.to}:`, error);
            return new send_email_response_dto_1.SendEmailResponseDto(false, '', `Failed to send email: ${error.message}`);
        }
    }
};
exports.SendEmailService = SendEmailService;
exports.SendEmailService = SendEmailService = SendEmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SendEmailService);
//# sourceMappingURL=send-email.service.js.map