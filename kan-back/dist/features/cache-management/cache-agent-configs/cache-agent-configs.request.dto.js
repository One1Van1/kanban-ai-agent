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
exports.CacheAgentConfigsRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CacheAgentConfigsRequestDto {
    agentId;
    configData;
    ttl;
}
exports.CacheAgentConfigsRequestDto = CacheAgentConfigsRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Agent ID to cache configuration for',
        example: 'agent-uuid-123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CacheAgentConfigsRequestDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Agent configuration data to cache',
        example: {
            name: 'Task Processor Agent',
            instructions: {
                'To Do': 'Analyze task and add initial comments',
                'In Progress': 'Monitor progress and send updates',
                Done: 'Generate completion report',
            },
            settings: {
                autoAssign: true,
                notifyOnChange: true,
                contextSources: ['jira', 'confluence'],
            },
        },
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CacheAgentConfigsRequestDto.prototype, "configData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'TTL in seconds (optional, uses default if not provided)',
        example: 1800,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CacheAgentConfigsRequestDto.prototype, "ttl", void 0);
//# sourceMappingURL=cache-agent-configs.request.dto.js.map