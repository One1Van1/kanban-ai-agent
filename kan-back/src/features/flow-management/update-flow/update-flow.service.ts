import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flow } from '../../../entities/flow.entity';
import { Agent } from '../../../entities/agent.entity';
import { UpdateFlowRequestDto } from './update-flow.request.dto';
import { UpdateFlowResponseDto } from './update-flow.response.dto';

@Injectable()
export class UpdateFlowService {
  private readonly logger = new Logger(UpdateFlowService.name);

  constructor(
    @InjectRepository(Flow)
    private readonly flowRepository: Repository<Flow>,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
  ) {}

  async execute(
    flowId: string,
    requestDto: UpdateFlowRequestDto,
  ): Promise<UpdateFlowResponseDto> {
    this.logger.log(`Updating flow with ID: ${flowId}`);

    try {
      // Find existing flow
      const existingFlow = await this.flowRepository.findOne({
        where: { id: flowId },
      });

      if (!existingFlow) {
        throw new NotFoundException(`Flow with ID ${flowId} not found`);
      }

      // Validate flow definition if provided
      if (requestDto.definition) {
        this.validateFlowDefinition(requestDto.definition);
      }

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

      // Merge metadata if provided
      let updatedMetadata = existingFlow.metadata;
      if (requestDto.metadata) {
        updatedMetadata = {
          ...existingFlow.metadata,
          ...requestDto.metadata,
          // Increment version if definition changed
          version: requestDto.definition
            ? (existingFlow.metadata?.version || 0) + 1
            : existingFlow.metadata?.version || 1,
        };
      }

      // Update flow fields
      Object.assign(existingFlow, {
        ...(requestDto.name !== undefined && { name: requestDto.name }),
        ...(requestDto.description !== undefined && {
          description: requestDto.description,
        }),
        ...(requestDto.definition !== undefined && {
          definition: requestDto.definition,
        }),
        ...(requestDto.status !== undefined && { status: requestDto.status }),
        ...(requestDto.agentId !== undefined && {
          agentId: requestDto.agentId,
        }),
        ...(requestDto.metadata !== undefined && { metadata: updatedMetadata }),
        updatedBy: requestDto.updatedBy,
      });

      // Save updated flow
      const savedFlow = await this.flowRepository.save(existingFlow);

      this.logger.log(`Flow updated successfully: ${savedFlow.name}`);

      return new UpdateFlowResponseDto({
        flowId: savedFlow.id,
        name: savedFlow.name,
        description: savedFlow.description,
        status: savedFlow.status,
        definition: savedFlow.definition,
        agentId: savedFlow.agentId,
        metadata: savedFlow.metadata,
        createdBy: savedFlow.createdBy,
        updatedBy: savedFlow.updatedBy,
        createdAt: savedFlow.createdAt,
        updatedAt: savedFlow.updatedAt,
      });
    } catch (error) {
      this.logger.error(`Failed to update flow: ${error.message}`, error.stack);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new BadRequestException('Failed to update flow');
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
