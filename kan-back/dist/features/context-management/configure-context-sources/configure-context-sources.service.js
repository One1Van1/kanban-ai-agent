"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ConfigureContextSourcesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigureContextSourcesService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const configure_context_sources_response_dto_1 = require("./configure-context-sources.response.dto");
const context_interface_1 = require("../../../types/context.interface");
let ConfigureContextSourcesService = ConfigureContextSourcesService_1 = class ConfigureContextSourcesService {
    logger = new common_1.Logger(ConfigureContextSourcesService_1.name);
    contextSources = new Map();
    async execute(request) {
        this.logger.log(`Configuring context source for agent: ${request.agentId}`);
        try {
            this.validateConfig(request.type, request.config);
            const contextSource = {
                id: (0, crypto_1.randomUUID)(),
                type: request.type,
                name: request.name,
                description: request.description,
                priority: request.priority,
                enabled: request.enabled,
                config: request.config || {},
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const sourceKey = `${request.agentId}:${contextSource.id}`;
            this.contextSources.set(sourceKey, contextSource);
            this.logger.log(`Context source configured successfully: ${contextSource.id}`);
            const responseDto = new configure_context_sources_response_dto_1.ContextSourceResponseDto({
                id: contextSource.id,
                agentId: request.agentId,
                name: contextSource.name,
                description: contextSource.description,
                type: contextSource.type,
                priority: contextSource.priority,
                enabled: contextSource.enabled,
                config: contextSource.config,
                createdAt: contextSource.createdAt,
                updatedAt: contextSource.updatedAt,
            });
            return new configure_context_sources_response_dto_1.ConfigureContextSourcesResponseDto(responseDto, 'Context source configured successfully');
        }
        catch (error) {
            this.logger.error(`Failed to configure context source: ${error.message}`, error.stack);
            throw error;
        }
    }
    validateConfig(type, config) {
        switch (type) {
            case context_interface_1.ContextSourceType.EXTERNAL_API:
                if (!config?.url) {
                    throw new Error('External API context source requires URL configuration');
                }
                break;
            case context_interface_1.ContextSourceType.RELATED_TASKS:
                if (config?.maxResults && config.maxResults > 100) {
                    throw new Error('Related tasks maxResults cannot exceed 100');
                }
                break;
            case context_interface_1.ContextSourceType.TASK_DETAILS:
            case context_interface_1.ContextSourceType.TASK_COMMENTS:
            case context_interface_1.ContextSourceType.TASK_HISTORY:
            case context_interface_1.ContextSourceType.FILE_ATTACHMENTS:
            case context_interface_1.ContextSourceType.USER_PROFILE:
            case context_interface_1.ContextSourceType.PROJECT_SETTINGS:
                break;
            default:
                throw new Error(`Unsupported context source type: ${type}`);
        }
    }
    async getContextSourcesByAgent(agentId) {
        const sources = [];
        for (const [key, source] of this.contextSources) {
            if (key.startsWith(`${agentId}:`)) {
                sources.push(source);
            }
        }
        return sources;
    }
    async getContextSource(agentId, sourceId) {
        const key = `${agentId}:${sourceId}`;
        return this.contextSources.get(key) || null;
    }
};
exports.ConfigureContextSourcesService = ConfigureContextSourcesService;
exports.ConfigureContextSourcesService = ConfigureContextSourcesService = ConfigureContextSourcesService_1 = __decorate([
    (0, common_1.Injectable)()
], ConfigureContextSourcesService);
//# sourceMappingURL=configure-context-sources.service.js.map