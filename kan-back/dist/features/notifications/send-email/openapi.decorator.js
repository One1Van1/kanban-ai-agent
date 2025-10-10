"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiSendEmail = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const send_email_response_dto_1 = require("./send-email.response.dto");
const ApiSendEmail = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Send email notification',
    description: 'Send an email notification to specified recipient with optional CC and BCC'
}), (0, swagger_1.ApiCreatedResponse)({
    description: 'Email sent successfully',
    type: send_email_response_dto_1.SendEmailResponseDto,
}), (0, swagger_1.ApiBadRequestResponse)({
    description: 'Invalid email data or configuration error',
}));
exports.ApiSendEmail = ApiSendEmail;
//# sourceMappingURL=openapi.decorator.js.map