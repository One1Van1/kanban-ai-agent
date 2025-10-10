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
exports.CreateAgentResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateAgentResponseDto {
    success;
    agentId;
    name;
    message;
    agent;
}
exports.CreateAgentResponseDto = CreateAgentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Success status' }),
    __metadata("design:type", Boolean)
], CreateAgentResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Agent ID' }),
    __metadata("design:type", String)
], CreateAgentResponseDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Agent name' }),
    __metadata("design:type", String)
], CreateAgentResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Response message' }),
    __metadata("design:type", String)
], CreateAgentResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Agent configuration' }),
    __metadata("design:type", Object)
], CreateAgentResponseDto.prototype, "agent", void 0);
//# sourceMappingURL=create-agent.response.dto.js.map