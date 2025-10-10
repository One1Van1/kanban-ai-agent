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
exports.AttachFileResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class AttachFileResponseDto {
    success;
    taskKey;
    message;
    error;
    constructor(success, taskKey, message, error) {
        this.success = success;
        this.taskKey = taskKey;
        this.message = message;
        this.error = error;
    }
}
exports.AttachFileResponseDto = AttachFileResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Статус успешности операции',
        example: true,
    }),
    __metadata("design:type", Boolean)
], AttachFileResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ключ задачи в Jira',
        example: 'KAN-5',
    }),
    __metadata("design:type", String)
], AttachFileResponseDto.prototype, "taskKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Сообщение о результате',
        example: 'File attached successfully',
    }),
    __metadata("design:type", String)
], AttachFileResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Сообщение об ошибке (если есть)',
        required: false,
        example: 'File not found',
    }),
    __metadata("design:type", String)
], AttachFileResponseDto.prototype, "error", void 0);
//# sourceMappingURL=attach-file.response.dto.js.map