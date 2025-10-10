"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiTimeValidationWebhook = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const time_validation_webhook_request_dto_1 = require("./time-validation-webhook.request.dto");
const time_validation_webhook_response_dto_1 = require("./time-validation-webhook.response.dto");
const ApiTimeValidationWebhook = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Валидация временных затрат по вебхуку',
    description: 'Обрабатывает webhook события и валидирует временные затраты на задачу',
}), (0, swagger_1.ApiBody)({ type: time_validation_webhook_request_dto_1.TimeValidationWebhookRequestDto }), (0, swagger_1.ApiOkResponse)({
    description: 'Результат валидации временных затрат',
    type: time_validation_webhook_response_dto_1.TimeValidationWebhookResponseDto,
}));
exports.ApiTimeValidationWebhook = ApiTimeValidationWebhook;
//# sourceMappingURL=openapi.decorator.js.map