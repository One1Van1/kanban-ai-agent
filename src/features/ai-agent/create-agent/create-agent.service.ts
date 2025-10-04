import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateAgentRequestDto } from './create-agent.request.dto';
import { CreateAgentResponseDto } from './create-agent.response.dto';
import { AIAgent } from '../../../types/ai-agent.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateAgentService {
  private readonly logger = new Logger(CreateAgentService.name);
  private readonly agents = new Map<string, AIAgent>(); // Temporary in-memory storage

  constructor(private readonly configService: ConfigService) {}

  async execute(
    requestDto: CreateAgentRequestDto,
  ): Promise<CreateAgentResponseDto> {
    try {
      this.logger.log(`Creating new AI agent: ${requestDto.name}`);

      const agentId = randomUUID();
      const now = new Date();

      const agent: AIAgent = {
        id: agentId,
        name: requestDto.name,
        description: requestDto.description,
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
        userId: requestDto.userId,
        createdAt: now,
        updatedAt: now,
      };

      // Store agent (temporary in-memory, will be replaced with database in Sprint 3)
      this.agents.set(agentId, agent);

      this.logger.log(`AI agent created successfully with ID: ${agentId}`);

      return {
        success: true,
        agentId,
        name: agent.name,
        message: `AI agent "${agent.name}" created successfully`,
        agent: {
          id: agent.id,
          name: agent.name,
          description: agent.description,
          instructions: agent.instructions,
          model: agent.model,
          temperature: agent.temperature,
          maxTokens: agent.maxTokens,
          isActive: agent.isActive,
          createdAt: agent.createdAt.toISOString(),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to create AI agent: ${error.message}`, error);
      throw error;
    }
  }

  async findById(agentId: string): Promise<AIAgent | null> {
    return this.agents.get(agentId) || null;
  }

  async findAll(): Promise<AIAgent[]> {
    return Array.from(this.agents.values());
  }
}
