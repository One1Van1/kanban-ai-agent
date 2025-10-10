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
var ConfigureAgentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigureAgentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const create_agent_service_1 = require("../create-agent/create-agent.service");
let ConfigureAgentService = ConfigureAgentService_1 = class ConfigureAgentService {
    configService;
    createAgentService;
    logger = new common_1.Logger(ConfigureAgentService_1.name);
    constructor(configService, createAgentService) {
        this.configService = configService;
        this.createAgentService = createAgentService;
    }
    async execute(agentId, requestDto) {
        try {
            this.logger.log(`Configuring AI agent: ${agentId}`);
            const existingAgent = await this.createAgentService.findById(agentId);
            if (!existingAgent) {
                throw new common_1.NotFoundException(`Agent with ID ${agentId} not found`);
            }
            const updatedAgent = {
                ...existingAgent,
                name: requestDto.name ?? existingAgent.name,
                description: requestDto.description ?? existingAgent.description,
                config: {
                    ...existingAgent.config,
                    instructions: requestDto.instructions ?? existingAgent.config?.instructions,
                    model: requestDto.model ?? existingAgent.config?.model,
                    temperature: requestDto.temperature ?? existingAgent.config?.temperature,
                    maxTokens: requestDto.maxTokens ?? existingAgent.config?.maxTokens,
                    isActive: requestDto.isActive ?? existingAgent.config?.isActive,
                },
                updatedAt: new Date(),
            };
            Object.assign(existingAgent, updatedAgent);
            this.logger.log(`AI agent ${agentId} configured successfully`);
            return {
                success: true,
                agentId,
                message: `AI agent "${updatedAgent.name}" configured successfully`,
                agent: {
                    id: updatedAgent.id,
                    name: updatedAgent.name,
                    description: updatedAgent.description,
                    instructions: updatedAgent.config?.instructions,
                    model: updatedAgent.config?.model,
                    temperature: updatedAgent.config?.temperature,
                    maxTokens: updatedAgent.config?.maxTokens,
                    isActive: updatedAgent.config?.isActive,
                    updatedAt: updatedAgent.updatedAt.toISOString(),
                },
            };
        }
        catch (error) {
            this.logger.error(`Failed to configure AI agent ${agentId}: ${error.message}`, error);
            throw error;
        }
    }
};
exports.ConfigureAgentService = ConfigureAgentService;
exports.ConfigureAgentService = ConfigureAgentService = ConfigureAgentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        create_agent_service_1.CreateAgentService])
], ConfigureAgentService);
//# sourceMappingURL=configure-agent.service.js.map