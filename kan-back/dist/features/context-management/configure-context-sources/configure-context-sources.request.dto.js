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
exports.ConfigureContextSourcesRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const context_interface_1 = require("../../../types/context.interface");
class ConfigureContextSourcesRequestDto {
    agentId;
    name;
    description;
    type;
    priority;
    enabled;
    config;
}
exports.ConfigureContextSourcesRequestDto = ConfigureContextSourcesRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'agent_123',
        description: 'ID of the AI agent',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfigureContextSourcesRequestDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Task Details Source',
        description: 'Name of the context source',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfigureContextSourcesRequestDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Fetches detailed task information including description, status, assignee',
        description: 'Description of what this context source provides',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfigureContextSourcesRequestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: context_interface_1.ContextSourceType,
        enumName: 'ContextSourceType',
        example: context_interface_1.ContextSourceType.TASK_DETAILS,
        description: 'Type of context source',
    }),
    (0, class_validator_1.IsEnum)(context_interface_1.ContextSourceType),
    __metadata("design:type", String)
], ConfigureContextSourcesRequestDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: context_interface_1.ContextPriority,
        enumName: 'ContextPriority',
        example: context_interface_1.ContextPriority.HIGH,
        description: 'Priority level of this context source',
    }),
    (0, class_validator_1.IsEnum)(context_interface_1.ContextPriority),
    __metadata("design:type", String)
], ConfigureContextSourcesRequestDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether this context source is enabled',
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ConfigureContextSourcesRequestDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: { maxResults: 10, includeComments: true },
        description: 'Configuration object for the context source',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ConfigureContextSourcesRequestDto.prototype, "config", void 0);
//# sourceMappingURL=configure-context-sources.request.dto.js.map