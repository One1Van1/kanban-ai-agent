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
exports.ConfigureAgentRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ConfigureAgentRequestDto {
    name;
    description;
    instructions;
    model;
    temperature;
    maxTokens;
    isActive;
}
exports.ConfigureAgentRequestDto = ConfigureAgentRequestDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Agent name',
        example: 'Updated Task Analyzer Bot',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], ConfigureAgentRequestDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Agent description',
        example: 'Updated agent description',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], ConfigureAgentRequestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Agent instructions',
        example: 'Updated instructions for analyzing tasks.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], ConfigureAgentRequestDto.prototype, "instructions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'AI model to use',
        example: 'claude-3-haiku-20240307',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfigureAgentRequestDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Temperature for AI responses (0.0-1.0)',
        example: 0.5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], ConfigureAgentRequestDto.prototype, "temperature", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum tokens for AI responses',
        example: 5000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    (0, class_validator_1.Max)(10000),
    __metadata("design:type", Number)
], ConfigureAgentRequestDto.prototype, "maxTokens", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether agent is active',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ConfigureAgentRequestDto.prototype, "isActive", void 0);
//# sourceMappingURL=configure-agent.request.dto.js.map