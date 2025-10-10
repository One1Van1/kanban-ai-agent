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
exports.CreateAgentRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateAgentRequestDto {
    name;
    description;
    instructions;
    model;
    temperature;
    maxTokens;
    isActive;
    userId;
}
exports.CreateAgentRequestDto = CreateAgentRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Agent name', example: 'Task Analyzer Bot' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateAgentRequestDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Agent description',
        example: 'Analyzes tasks and provides recommendations',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateAgentRequestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Agent instructions',
        example: 'Analyze incoming tasks in the "To Do" column and suggest priorities based on urgency and complexity.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateAgentRequestDto.prototype, "instructions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'AI model to use',
        example: 'claude-3-haiku-20240307',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAgentRequestDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Temperature for AI responses (0.0-1.0)',
        example: 0.3,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], CreateAgentRequestDto.prototype, "temperature", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum tokens for AI responses',
        example: 4000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    (0, class_validator_1.Max)(10000),
    __metadata("design:type", Number)
], CreateAgentRequestDto.prototype, "maxTokens", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether agent is active',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAgentRequestDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User ID who owns this agent' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAgentRequestDto.prototype, "userId", void 0);
//# sourceMappingURL=create-agent.request.dto.js.map