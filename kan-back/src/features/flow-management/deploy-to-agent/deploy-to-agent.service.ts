import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flow, FlowStatus } from '../../../entities/flow.entity';
import { Agent } from '../../../entities/agent.entity';
import { CreateAgentService } from '../../ai-agent/create-agent/create-agent.service';
import { ConfigureColumnInstructionsService } from '../../ai-agent/configure-column-instructions/configure-column-instructions.service';
import { DeployToAgentRequestDto } from './deploy-to-agent.request.dto';
import { DeployToAgentResponseDto } from './deploy-to-agent.response.dto';

@Injectable()
export class DeployToAgentService {
  private readonly logger = new Logger(DeployToAgentService.name);

  constructor(
    @InjectRepository(Flow)
    private readonly flowRepository: Repository<Flow>,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    private readonly createAgentService: CreateAgentService,
    private readonly configureColumnInstructionsService: ConfigureColumnInstructionsService,
  ) {}

  async execute(
    flowId: string,
    requestDto: DeployToAgentRequestDto,
  ): Promise<DeployToAgentResponseDto> {
    this.logger.log(`Deploying flow ${flowId} to agent`);

    try {
      // 1. Find and validate flow
      const flow = await this.flowRepository.findOne({
        where: { id: flowId },
        relations: ['agent'],
      });

      if (!flow) {
        throw new NotFoundException(`Flow with ID ${flowId} not found`);
      }

      // 2. Validate flow definition
      if (!flow.definition?.blocks?.length) {
        throw new BadRequestException(
          'Flow must have at least one block to deploy',
        );
      }

      // 3. Check if flow already has an agent
      if (flow.agentId && flow.agent) {
        this.logger.log(`Flow already has agent ${flow.agentId}, updating...`);

        // Update existing agent
        await this.updateExistingAgent(flow, requestDto);

        return new DeployToAgentResponseDto({
          success: true,
          message: `Flow "${flow.name}" updated existing agent successfully`,
          flowId: flow.id,
          agentId: flow.agentId,
          createdAgent: {
            id: flow.agent.id,
            name: flow.agent.name,
            description: flow.agent.description || '',
            isActive: flow.agent.status === 'active',
          },
          createdInstructions: [], // TODO: Return updated instructions
        });
      }

      // 4. Create new agent from flow
      // TODO: Реализовать новую логику конвертации
      throw new BadRequestException(
        'Конвертация flow в agent временно отключена. Будет переделана.',
      );
    } catch (error) {
      this.logger.error(`❌ Failed to deploy flow to agent: ${error.message}`);
      throw error;
    }
  }

  private async updateExistingAgent(
    flow: Flow,
    requestDto: DeployToAgentRequestDto,
  ) {
    if (!flow.agentId || !flow.agent) {
      throw new BadRequestException('Flow has no associated agent to update');
    }

    // Update agent basic info - we'll need to update instructions separately
    await this.agentRepository.update(flow.agentId, {
      name: requestDto.agentName || flow.agent.name,
      description: requestDto.agentDescription || flow.agent.description || '',
      // Note: instructions are managed separately via AgentInstruction entity
    });

    this.logger.log(
      `Updated existing agent ${flow.agentId} with new flow data`,
    );
  }

  // TODO: Новые методы конвертации будут добавлены здесь
}
