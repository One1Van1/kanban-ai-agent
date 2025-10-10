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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CreateAgentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAgentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const agent_entity_1 = require("../../../entities/agent.entity");
let CreateAgentService = CreateAgentService_1 = class CreateAgentService {
    configService;
    agentRepository;
    logger = new common_1.Logger(CreateAgentService_1.name);
    constructor(configService, agentRepository) {
        this.configService = configService;
        this.agentRepository = agentRepository;
    }
    async execute(requestDto) {
        try {
            this.logger.log(`Creating new AI agent: ${requestDto.name}`);
            const agent = this.agentRepository.create({
                name: requestDto.name,
                description: requestDto.description,
                status: 'active',
                config: {
                    instructions: requestDto.instructions,
                    model: requestDto.model ||
                        this.configService.get('ai-agent.defaultModel') ||
                        'claude-3-haiku-20240307',
                    temperature: requestDto.temperature ??
                        this.configService.get('ai-agent.temperature') ??
                        0.3,
                    maxTokens: requestDto.maxTokens ||
                        this.configService.get('ai-agent.maxTokens') ||
                        4000,
                    isActive: requestDto.isActive ?? true,
                },
                createdBy: requestDto.userId,
            });
            const savedAgent = await this.agentRepository.save(agent);
            this.logger.log(`AI agent created successfully with ID: ${savedAgent.id}`);
            return {
                success: true,
                agentId: savedAgent.id,
                name: savedAgent.name,
                message: `AI agent "${savedAgent.name}" created successfully`,
                agent: {
                    id: savedAgent.id,
                    name: savedAgent.name,
                    description: savedAgent.description,
                    instructions: savedAgent.config?.instructions,
                    model: savedAgent.config?.model,
                    temperature: savedAgent.config?.temperature,
                    maxTokens: savedAgent.config?.maxTokens,
                    isActive: savedAgent.config?.isActive,
                    createdAt: savedAgent.createdAt.toISOString(),
                },
            };
        }
        catch (error) {
            this.logger.error(`Failed to create AI agent: ${error.message}`, error);
            throw error;
        }
    }
    async findById(agentId) {
        return await this.agentRepository.findOne({ where: { id: agentId } });
    }
    async findAll() {
        return await this.agentRepository.find();
    }
};
exports.CreateAgentService = CreateAgentService;
exports.CreateAgentService = CreateAgentService = CreateAgentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(agent_entity_1.Agent)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository])
], CreateAgentService);
//# sourceMappingURL=create-agent.service.js.map