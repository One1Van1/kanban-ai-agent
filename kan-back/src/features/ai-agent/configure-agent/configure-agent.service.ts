import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigureAgentRequestDto } from './configure-agent.request.dto';
import { ConfigureAgentResponseDto } from './configure-agent.response.dto';
import { CreateAgentService } from '../create-agent/create-agent.service';

@Injectable()
export class ConfigureAgentService {
  private readonly logger = new Logger(ConfigureAgentService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly createAgentService: CreateAgentService,
  ) {}

  async execute(
    agentId: string,
    requestDto: ConfigureAgentRequestDto,
  ): Promise<ConfigureAgentResponseDto> {
    try {
      this.logger.log(`Configuring AI agent: ${agentId}`);

      // Get existing agent
      const existingAgent = await this.createAgentService.findById(agentId);
      if (!existingAgent) {
        throw new NotFoundException(`Agent with ID ${agentId} not found`);
      }

      // Update agent with provided values or keep existing ones
      const updatedAgent = {
        ...existingAgent,
        name: requestDto.name ?? existingAgent.name,
        description: requestDto.description ?? existingAgent.description,
        config: {
          ...existingAgent.config,
          instructions:
            requestDto.instructions ?? existingAgent.config?.instructions,
          model: requestDto.model ?? existingAgent.config?.model,
          temperature:
            requestDto.temperature ?? existingAgent.config?.temperature,
          maxTokens: requestDto.maxTokens ?? existingAgent.config?.maxTokens,
          isActive: requestDto.isActive ?? existingAgent.config?.isActive,
        },
        updatedAt: new Date(),
      };

      // Save updated agent (in real implementation, this would update in database)
      // For now, we update the in-memory storage in CreateAgentService
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
    } catch (error) {
      this.logger.error(
        `Failed to configure AI agent ${agentId}: ${error.message}`,
        error,
      );
      throw error;
    }
  }
}
