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
exports.SendEmailController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const send_email_service_1 = require("./send-email.service");
const send_email_request_dto_1 = require("./send-email.request.dto");
const openapi_decorator_1 = require("./openapi.decorator");
let SendEmailController = class SendEmailController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(request) {
        return this.service.execute(request);
    }
};
exports.SendEmailController = SendEmailController;
__decorate([
    (0, common_1.Post)('email'),
    (0, openapi_decorator_1.ApiSendEmail)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_email_request_dto_1.SendEmailRequestDto]),
    __metadata("design:returntype", Promise)
], SendEmailController.prototype, "handle", null);
exports.SendEmailController = SendEmailController = __decorate([
    (0, common_1.Controller)('notifications'),
    (0, swagger_1.ApiTags)('SendEmail'),
    __metadata("design:paramtypes", [send_email_service_1.SendEmailService])
], SendEmailController);
//# sourceMappingURL=send-email.controller.js.map