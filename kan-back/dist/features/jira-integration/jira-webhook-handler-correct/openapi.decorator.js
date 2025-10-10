"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiJiraWebhookHandler = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jira_webhook_handler_request_dto_1 = require("./jira-webhook-handler.request.dto");
const jira_webhook_handler_response_dto_1 = require("./jira-webhook-handler.response.dto");
const ApiJiraWebhookHandler = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Обработка вебхуков от Jira',
    description: 'Принимает и обрабатывает события от Jira через webhook',
}), (0, swagger_1.ApiBody)({ type: jira_webhook_handler_request_dto_1.JiraWebhookHandlerRequestDto }), (0, swagger_1.ApiOkResponse)({
    description: 'Статус обработки вебхука',
    type: jira_webhook_handler_response_dto_1.JiraWebhookHandlerResponseDto,
}));
exports.ApiJiraWebhookHandler = ApiJiraWebhookHandler;
//# sourceMappingURL=openapi.decorator.js.map