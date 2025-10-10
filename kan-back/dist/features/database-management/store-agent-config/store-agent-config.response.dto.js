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
exports.StoreAgentConfigResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class StoreAgentConfigResponseDto {
    agentId;
    message;
    success;
    timestamp;
    constructor(agentId, message) {
        this.agentId = agentId;
        this.message = message;
        this.success = true;
        this.timestamp = new Date().toISOString();
    }
}
exports.StoreAgentConfigResponseDto = StoreAgentConfigResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'uuid-string',
        description: 'ID сохраненного агента',
    }),
    __metadata("design:type", String)
], StoreAgentConfigResponseDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Agent configuration saved successfully',
        description: 'Сообщение о результате',
    }),
    __metadata("design:type", String)
], StoreAgentConfigResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Успешность операции' }),
    __metadata("design:type", Boolean)
], StoreAgentConfigResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-01T00:00:00.000Z',
        description: 'Время сохранения',
    }),
    __metadata("design:type", String)
], StoreAgentConfigResponseDto.prototype, "timestamp", void 0);
//# sourceMappingURL=store-agent-config.response.dto.js.map