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
import { ConvertFlowToAgentService } from '../../flow-conversion/convert-flow-to-agent.service';
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
    private readonly convertFlowToAgentService: ConvertFlowToAgentService,
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
      this.logger.log('🔄 Converting Flow to Agent configuration...');

      // Конвертируем Flow в Agent конфигурацию
      const conversion =
        await this.convertFlowToAgentService.convertFlowToAgent(flow);

      this.logger.log(
        `✅ Conversion successful. Generated complete instruction for agent.`,
      );

      // Создаем нового агента с полной инструкцией из Flow
      const createAgentResponse = await this.createAgentService.execute({
        name: requestDto.agentName || conversion.agentName,
        description: requestDto.agentDescription || conversion.agentDescription,
        instructions: conversion.instructionText, // Полная инструкция из всего Flow
        model: 'claude-3-haiku-20240307',
        temperature: 0.3,
        isActive: true,
        boardType: conversion.triggerConfig.type as any,
        // Передаем trigger configuration из Flow
        triggerColumnId: conversion.triggerConfig.columnId,
        triggerColumnName: conversion.triggerConfig.columnName,
        triggerEvent: conversion.triggerConfig.event,
      });

      // Связываем Flow с Agent
      await this.flowRepository.update(flow.id, {
        agentId: createAgentResponse.agentId,
        status: FlowStatus.ACTIVE,
      });

      this.logger.log(
        `✅ Successfully deployed flow ${flow.id} to agent ${createAgentResponse.agentId}`,
      );

      return new DeployToAgentResponseDto({
        success: true,
        message: `Flow "${flow.name}" successfully deployed as Agent`,
        flowId: flow.id,
        agentId: createAgentResponse.agentId,
        createdAgent: {
          id: createAgentResponse.agentId,
          name: createAgentResponse.name,
          description:
            requestDto.agentDescription || conversion.agentDescription,
          isActive: true,
        },
        createdInstructions: [], // TODO: Return created instructions
      });
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
