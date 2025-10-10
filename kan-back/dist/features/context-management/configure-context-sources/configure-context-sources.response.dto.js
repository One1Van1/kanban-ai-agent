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
exports.ConfigureContextSourcesResponseDto = exports.ContextSourceResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const context_interface_1 = require("../../../types/context.interface");
class ContextSourceResponseDto {
    id;
    agentId;
    name;
    description;
    type;
    priority;
    enabled;
    config;
    createdAt;
    updatedAt;
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.ContextSourceResponseDto = ContextSourceResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'source_uuid_123',
        description: 'Unique identifier of the context source',
    }),
    __metadata("design:type", String)
], ContextSourceResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'agent_123',
        description: 'ID of the AI agent this source belongs to',
    }),
    __metadata("design:type", String)
], ContextSourceResponseDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Task Details Source',
        description: 'Name of the context source',
    }),
    __metadata("design:type", String)
], ContextSourceResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Fetches detailed task information including description, status, assignee',
        description: 'Description of what this context source provides',
    }),
    __metadata("design:type", String)
], ContextSourceResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: context_interface_1.ContextSourceType,
        enumName: 'ContextSourceType',
        example: context_interface_1.ContextSourceType.TASK_DETAILS,
        description: 'Type of context source',
    }),
    __metadata("design:type", String)
], ContextSourceResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: context_interface_1.ContextPriority,
        enumName: 'ContextPriority',
        example: context_interface_1.ContextPriority.HIGH,
        description: 'Priority level of this context source',
    }),
    __metadata("design:type", String)
], ContextSourceResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether this context source is enabled',
    }),
    __metadata("design:type", Boolean)
], ContextSourceResponseDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: { maxResults: 10, includeComments: true },
        description: 'Configuration object for the context source',
    }),
    __metadata("design:type", Object)
], ContextSourceResponseDto.prototype, "config", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-12-07T10:00:00.000Z',
        description: 'When the context source was created',
    }),
    __metadata("design:type", Date)
], ContextSourceResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-12-07T10:00:00.000Z',
        description: 'When the context source was last updated',
    }),
    __metadata("design:type", Date)
], ContextSourceResponseDto.prototype, "updatedAt", void 0);
class ConfigureContextSourcesResponseDto {
    contextSource;
    message;
    constructor(contextSource, message) {
        this.contextSource = contextSource;
        this.message = message;
    }
}
exports.ConfigureContextSourcesResponseDto = ConfigureContextSourcesResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: ContextSourceResponseDto,
        description: 'The configured context source',
    }),
    __metadata("design:type", ContextSourceResponseDto)
], ConfigureContextSourcesResponseDto.prototype, "contextSource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Context source configured successfully',
        description: 'Success message',
    }),
    __metadata("design:type", String)
], ConfigureContextSourcesResponseDto.prototype, "message", void 0);
//# sourceMappingURL=configure-context-sources.response.dto.js.map