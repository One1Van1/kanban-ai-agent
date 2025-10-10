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
exports.JiraWebhookHandlerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jira_webhook_handler_service_1 = require("./jira-webhook-handler.service");
const jira_webhook_handler_request_dto_1 = require("./jira-webhook-handler.request.dto");
const openapi_decorator_1 = require("./openapi.decorator");
let JiraWebhookHandlerController = class JiraWebhookHandlerController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(requestDto) {
        return this.service.execute(requestDto);
    }
};
exports.JiraWebhookHandlerController = JiraWebhookHandlerController;
__decorate([
    (0, common_1.Post)(),
    (0, openapi_decorator_1.ApiJiraWebhookHandler)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jira_webhook_handler_request_dto_1.JiraWebhookHandlerRequestDto]),
    __metadata("design:returntype", Promise)
], JiraWebhookHandlerController.prototype, "handle", null);
exports.JiraWebhookHandlerController = JiraWebhookHandlerController = __decorate([
    (0, common_1.Controller)('jira/webhook'),
    (0, swagger_1.ApiTags)('JiraWebhookHandler'),
    __metadata("design:paramtypes", [jira_webhook_handler_service_1.JiraWebhookHandlerService])
], JiraWebhookHandlerController);
//# sourceMappingURL=jira-webhook-handler.controller.js.map