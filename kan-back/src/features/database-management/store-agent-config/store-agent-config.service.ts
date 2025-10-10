import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '../../../entities/agent.entity';
import { AgentInstruction } from '../../../entities/agent-instruction.entity';
import { StoreAgentConfigRequestDto } from './store-agent-config.request.dto';
import { StoreAgentConfigResponseDto } from './store-agent-config.response.dto';

@Injectable()
export class StoreAgentConfigService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    @InjectRepository(AgentInstruction)
    private readonly instructionRepository: Repository<AgentInstruction>,
  ) {}

  async execute(
    dto: StoreAgentConfigRequestDto,
  ): Promise<StoreAgentConfigResponseDto> {
    // Если agentId указан, обновляем существующего агента
    if (dto.agentId) {
      const existingAgent = await this.agentRepository.findOne({
        where: { id: dto.agentId },
        relations: ['instructions'],
      });

      if (!existingAgent) {
        throw new NotFoundException(`Agent with ID ${dto.agentId} not found`);
      }

      return await this.updateExistingAgent(existingAgent, dto);
    }

    // Иначе создаем нового агента
    return await this.createNewAgent(dto);
  }

  private async createNewAgent(
    dto: StoreAgentConfigRequestDto,
  ): Promise<StoreAgentConfigResponseDto> {
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

    // Сохраняем инструкции, если они есть
    if (dto.instructions && dto.instructions.length > 0) {
      const instructions = dto.instructions.map((instruction) =>
        this.instructionRepository.create({
          ...instruction,
          agentId: savedAgent.id,
        }),
      );

      await this.instructionRepository.save(instructions);
    }

    return new StoreAgentConfigResponseDto(
      savedAgent.id,
      'Agent configuration created successfully',
    );
  }

  private async updateExistingAgent(
    existingAgent: Agent,
    dto: StoreAgentConfigRequestDto,
  ): Promise<StoreAgentConfigResponseDto> {
    // Обновляем основную информацию агента
    if (dto.name) existingAgent.name = dto.name;
    if (dto.description !== undefined)
      existingAgent.description = dto.description;
    if (dto.status) existingAgent.status = dto.status;
    if (dto.config) existingAgent.config = dto.config;
    if (dto.jiraInstanceUrl !== undefined)
      existingAgent.jiraInstanceUrl = dto.jiraInstanceUrl;
    if (dto.jiraProjectKey !== undefined)
      existingAgent.jiraProjectKey = dto.jiraProjectKey;
    if (dto.jiraApiToken !== undefined)
      existingAgent.jiraApiToken = dto.jiraApiToken;
    if (dto.contextSources) existingAgent.contextSources = dto.contextSources;
    if (dto.notificationSettings)
      existingAgent.notificationSettings = dto.notificationSettings;

    await this.agentRepository.save(existingAgent);

    // Обновляем инструкции, если они переданы
    if (dto.instructions && dto.instructions.length > 0) {
      // Удаляем старые инструкции
      await this.instructionRepository.delete({ agentId: existingAgent.id });

      // Создаем новые инструкции
      const instructions = dto.instructions.map((instruction) =>
        this.instructionRepository.create({
          ...instruction,
          agentId: existingAgent.id,
        }),
      );

      await this.instructionRepository.save(instructions);
    }

    return new StoreAgentConfigResponseDto(
      existingAgent.id,
      'Agent configuration updated successfully',
    );
  }
}
