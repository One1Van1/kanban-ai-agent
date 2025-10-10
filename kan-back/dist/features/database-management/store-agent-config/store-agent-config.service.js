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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreAgentConfigService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const agent_entity_1 = require("../../../entities/agent.entity");
const agent_instruction_entity_1 = require("../../../entities/agent-instruction.entity");
const store_agent_config_response_dto_1 = require("./store-agent-config.response.dto");
let StoreAgentConfigService = class StoreAgentConfigService {
    agentRepository;
    instructionRepository;
    constructor(agentRepository, instructionRepository) {
        this.agentRepository = agentRepository;
        this.instructionRepository = instructionRepository;
    }
    async execute(dto) {
        if (dto.agentId) {
            const existingAgent = await this.agentRepository.findOne({
                where: { id: dto.agentId },
                relations: ['instructions'],
            });
            if (!existingAgent) {
                throw new common_1.NotFoundException(`Agent with ID ${dto.agentId} not found`);
            }
            return await this.updateExistingAgent(existingAgent, dto);
        }
        return await this.createNewAgent(dto);
    }
    async createNewAgent(dto) {
        const agent = this.agentRepository.create({
            name: dto.name,
            description: dto.description,
            status: dto.status || 'active',
            config: dto.config,
            jiraInstanceUrl: dto.jiraInstanceUrl,
            jiraProjectKey: dto.jiraProjectKey,
            jiraApiToken: dto.jiraApiToken,
            contextSources: dto.contextSources,
            notificationSettings: dto.notificationSettings,
            createdBy: dto.createdBy,
        });
        const savedAgent = await this.agentRepository.save(agent);
        if (dto.instructions && dto.instructions.length > 0) {
            const instructions = dto.instructions.map((instruction) => this.instructionRepository.create({
                ...instruction,
                agentId: savedAgent.id,
            }));
            await this.instructionRepository.save(instructions);
        }
        return new store_agent_config_response_dto_1.StoreAgentConfigResponseDto(savedAgent.id, 'Agent configuration created successfully');
    }
    async updateExistingAgent(existingAgent, dto) {
        if (dto.name)
            existingAgent.name = dto.name;
        if (dto.description !== undefined)
            existingAgent.description = dto.description;
        if (dto.status)
            existingAgent.status = dto.status;
        if (dto.config)
            existingAgent.config = dto.config;
        if (dto.jiraInstanceUrl !== undefined)
            existingAgent.jiraInstanceUrl = dto.jiraInstanceUrl;
        if (dto.jiraProjectKey !== undefined)
            existingAgent.jiraProjectKey = dto.jiraProjectKey;
        if (dto.jiraApiToken !== undefined)
            existingAgent.jiraApiToken = dto.jiraApiToken;
        if (dto.contextSources)
            existingAgent.contextSources = dto.contextSources;
        if (dto.notificationSettings)
            existingAgent.notificationSettings = dto.notificationSettings;
        await this.agentRepository.save(existingAgent);
        if (dto.instructions && dto.instructions.length > 0) {
            await this.instructionRepository.delete({ agentId: existingAgent.id });
            const instructions = dto.instructions.map((instruction) => this.instructionRepository.create({
                ...instruction,
                agentId: existingAgent.id,
            }));
            await this.instructionRepository.save(instructions);
        }
        return new store_agent_config_response_dto_1.StoreAgentConfigResponseDto(existingAgent.id, 'Agent configuration updated successfully');
    }
};
exports.StoreAgentConfigService = StoreAgentConfigService;
exports.StoreAgentConfigService = StoreAgentConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agent_entity_1.Agent)),
    __param(1, (0, typeorm_1.InjectRepository)(agent_instruction_entity_1.AgentInstruction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], StoreAgentConfigService);
//# sourceMappingURL=store-agent-config.service.js.map