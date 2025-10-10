"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiSendTelegram = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const send_telegram_response_dto_1 = require("./send-telegram.response.dto");
const ApiSendTelegram = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Send Telegram notification',
    description: 'Send a message notification to specified Telegram chat',
}), (0, swagger_1.ApiCreatedResponse)({
    description: 'Telegram message sent successfully',
    type: send_telegram_response_dto_1.SendTelegramResponseDto,
}), (0, swagger_1.ApiBadRequestResponse)({
    description: 'Invalid telegram data or bot configuration error',
}));
exports.ApiSendTelegram = ApiSendTelegram;
//# sourceMappingURL=openapi.decorator.js.map