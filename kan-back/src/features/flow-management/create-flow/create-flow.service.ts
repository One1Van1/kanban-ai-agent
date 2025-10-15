import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flow, FlowStatus } from '../../../entities/flow.entity';
import { Agent } from '../../../entities/agent.entity';
import { CreateFlowRequestDto } from './create-flow.request.dto';
import { CreateFlowResponseDto } from './create-flow.response.dto';

@Injectable()
export class CreateFlowService {
  private readonly logger = new Logger(CreateFlowService.name);

  constructor(
    @InjectRepository(Flow)
    private readonly flowRepository: Repository<Flow>,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
  ) {}

  async execute(
    requestDto: CreateFlowRequestDto,
  ): Promise<CreateFlowResponseDto> {
    this.logger.log(`Creating new flow: ${requestDto.name}`);

    try {
      // Validate flow definition structure
      this.validateFlowDefinition(requestDto.definition);

      // If agentId provided, check if agent exists
      if (requestDto.agentId) {
        const agent = await this.agentRepository.findOne({
          where: { id: requestDto.agentId },
        });
        if (!agent) {
          throw new NotFoundException(
            `Agent with ID ${requestDto.agentId} not found`,
          );
        }
      }

      // Create new flow entity
      const flow = this.flowRepository.create({
        name: requestDto.name,
        description: requestDto.description,
        definition: requestDto.definition,
        agentId: requestDto.agentId,
        status: FlowStatus.DRAFT,
        createdBy: requestDto.createdBy,
        metadata: requestDto.metadata
          ? {
              version: requestDto.metadata.version || 1,
              tags: requestDto.metadata.tags,
              category: requestDto.metadata.category,
              isTemplate: requestDto.metadata.isTemplate,
              originalFlowId: requestDto.metadata.originalFlowId,
            }
          : { version: 1 },
      });

      // Save to database
      const savedFlow = await this.flowRepository.save(flow);

      this.logger.log(`Flow created successfully with ID: ${savedFlow.id}`);

      return new CreateFlowResponseDto({
        flowId: savedFlow.id,
        name: savedFlow.name,
        description: savedFlow.description,
        status: savedFlow.status,
        definition: savedFlow.definition,
        agentId: savedFlow.agentId,
        metadata: savedFlow.metadata,
        createdBy: savedFlow.createdBy,
        createdAt: savedFlow.createdAt,
        updatedAt: savedFlow.updatedAt,
      });
    } catch (error) {
      this.logger.error(`Failed to create flow: ${error.message}`, error.stack);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new BadRequestException('Failed to create flow');
    }
  }

  private validateFlowDefinition(definition: any): void {
    if (!definition || typeof definition !== 'object') {
      throw new BadRequestException('Flow definition must be an object');
    }

    if (!Array.isArray(definition.blocks)) {
      throw new BadRequestException(
        'Flow definition must contain blocks array',
      );
    }

    if (!Array.isArray(definition.edges)) {
      throw new BadRequestException('Flow definition must contain edges array');
    }

    // Validate blocks
    for (const block of definition.blocks) {
      if (!block.id || !block.type) {
        throw new BadRequestException('Each block must have id and type');
      }
      if (
        !block.position ||
        typeof block.position.x !== 'number' ||
        typeof block.position.y !== 'number'
      ) {
        throw new BadRequestException(
          'Each block must have valid position with x and y coordinates',
        );
      }
    }

    // Validate edges
    for (const edge of definition.edges) {
      if (!edge.id || !edge.source || !edge.target) {
        throw new BadRequestException(
          'Each edge must have id, source, and target',
        );
      }

      // Check if source and target blocks exist
      const sourceExists = definition.blocks.some(
        (block: any) => block.id === edge.source,
      );
      const targetExists = definition.blocks.some(
        (block: any) => block.id === edge.target,
      );

      if (!sourceExists) {
        throw new BadRequestException(
          `Edge source block ${edge.source} not found`,
        );
      }
      if (!targetExists) {
        throw new BadRequestException(
          `Edge target block ${edge.target} not found`,
        );
      }
    }

    this.logger.log(
      `Flow definition validated: ${definition.blocks.length} blocks, ${definition.edges.length} edges`,
    );
  }
}
