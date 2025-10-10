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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendEmailRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SendEmailRequestDto {
    to;
    subject;
    text;
    html;
    cc;
    bcc;
}
exports.SendEmailRequestDto = SendEmailRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Recipient email address',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SendEmailRequestDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email subject',
        example: 'Task notification',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendEmailRequestDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email body content',
        example: 'Your task has been updated',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendEmailRequestDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'HTML email content',
        example: '<p>Your task has been updated</p>',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendEmailRequestDto.prototype, "html", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'CC recipients',
        example: ['cc@example.com'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEmail)({}, { each: true }),
    __metadata("design:type", Array)
], SendEmailRequestDto.prototype, "cc", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'BCC recipients',
        example: ['bcc@example.com'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEmail)({}, { each: true }),
    __metadata("design:type", Array)
], SendEmailRequestDto.prototype, "bcc", void 0);
//# sourceMappingURL=send-email.request.dto.js.map