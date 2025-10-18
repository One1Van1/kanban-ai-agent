import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAgentRequestDto } from './create-agent.request.dto';
import { CreateAgentResponseDto } from './create-agent.response.dto';
import { Agent } from '@/entities/agent.entity';
import { AgentInstruction } from '@/entities/agent-instruction.entity';

@Injectable()
export class CreateAgentService {
  private readonly logger = new Logger(CreateAgentService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    @InjectRepository(AgentInstruction)
    private readonly agentInstructionRepository: Repository<AgentInstruction>,
  ) {}

  async execute(
    requestDto: CreateAgentRequestDto,
  ): Promise<CreateAgentResponseDto> {
    try {
      this.logger.log(`Creating new AI agent: ${requestDto.name}`);

      // Создаем агента в базе данных
      const agent = this.agentRepository.create({
        name: requestDto.name,
        description: requestDto.description,
        status: 'active',
        config: {
          instructions: requestDto.instructions,
          model:
            requestDto.model ||
            this.configService.get('ai-agent.defaultModel') ||
            'claude-3-haiku-20240307',
          temperature:
            requestDto.temperature ??
            this.configService.get('ai-agent.temperature') ??
            0.3,
          maxTokens:
            requestDto.maxTokens ||
            this.configService.get('ai-agent.maxTokens') ||
            4000,
          isActive: requestDto.isActive ?? true,
        },
        createdBy: requestDto.userId,
      });

      // Сохраняем в базу данных
      const savedAgent = await this.agentRepository.save(agent);

      // Создаем базовую инструкцию в таблице agent_instructions
      if (requestDto.instructions) {
        const agentInstruction = this.agentInstructionRepository.create({
          agentId: savedAgent.id,
          columnId: requestDto.triggerColumnId || 'all', // Используем переданную колонку или 'all'
          columnName: requestDto.triggerColumnName || 'All Columns',
          instruction: requestDto.instructions,
          triggerEvent: requestDto.triggerEvent || 'on_enter', // Используем переданное событие или по умолчанию
          conditions: {
            description: requestDto.triggerColumnId
              ? `Triggered when task enters "${requestDto.triggerColumnName}" column`
              : 'Default instruction for all columns',
            applyToAll: !requestDto.triggerColumnId, // true если колонка не указана
          },
          actions: {
            type: 'comment',
            template: requestDto.instructions,
          },
          isActive: true,
          priority: 1,
        });

        await this.agentInstructionRepository.save(agentInstruction);
        this.logger.log(
          `Agent instruction created for agent: ${savedAgent.id}`,
        );
      }

      this.logger.log(
        `AI agent created successfully with ID: ${savedAgent.id}`,
      );

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
    } catch (error) {
      this.logger.error(`Failed to create AI agent: ${error.message}`, error);
      throw error;
    }
  }

  async findById(agentId: string): Promise<Agent | null> {
    return await this.agentRepository.findOne({ where: { id: agentId } });
  }

  async findAll(): Promise<Agent[]> {
    return await this.agentRepository.find();
  }
}
