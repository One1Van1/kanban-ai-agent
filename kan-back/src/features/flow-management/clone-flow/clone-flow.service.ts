import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flow, FlowStatus } from '../../../entities/flow.entity';
import { CloneFlowRequestDto } from './clone-flow.request.dto';
import { CloneFlowResponseDto } from './clone-flow.response.dto';

@Injectable()
export class CloneFlowService {
  private readonly logger = new Logger(CloneFlowService.name);

  constructor(
    @InjectRepository(Flow)
    private readonly flowRepository: Repository<Flow>,
  ) {}

  async execute(
    originalFlowId: string,
    requestDto: CloneFlowRequestDto,
  ): Promise<CloneFlowResponseDto> {
    this.logger.log(`Cloning flow with ID: ${originalFlowId}`);

    try {
      // Find original flow
      const originalFlow = await this.flowRepository.findOne({
        where: { id: originalFlowId },
      });

      if (!originalFlow) {
        throw new NotFoundException(`Flow with ID ${originalFlowId} not found`);
      }

      // Generate new IDs for blocks and edges in the cloned definition
      const clonedDefinition = this.cloneFlowDefinition(
        originalFlow.definition,
      );

      // Create cloned flow
      const clonedFlow = this.flowRepository.create({
        name: requestDto.name,
        description: requestDto.description || `Clone of ${originalFlow.name}`,
        definition: clonedDefinition,
        status: FlowStatus.DRAFT, // Always start as draft
        createdBy: requestDto.clonedBy,
        metadata: {
          ...originalFlow.metadata,
          originalFlowId: originalFlowId,
          version: 1, // Reset version for clone
        },
      });

      // Save cloned flow
      const savedFlow = await this.flowRepository.save(clonedFlow);

      this.logger.log(
        `Flow cloned successfully: ${savedFlow.name} (ID: ${savedFlow.id})`,
      );

      return new CloneFlowResponseDto({
        flowId: savedFlow.id,
        name: savedFlow.name,
        description: savedFlow.description,
        status: savedFlow.status,
        originalFlowId: originalFlowId,
        definition: savedFlow.definition,
        createdBy: savedFlow.createdBy,
        createdAt: savedFlow.createdAt,
      });
    } catch (error) {
      this.logger.error(`Failed to clone flow: ${error.message}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new Error('Failed to clone flow');
    }
  }

  private cloneFlowDefinition(originalDefinition: any): any {
    if (!originalDefinition) return originalDefinition;

    const blockIdMap = new Map<string, string>();

    // Clone blocks with new IDs
    const clonedBlocks =
      originalDefinition.blocks?.map((block: any) => {
        const newBlockId = `${block.id}-clone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        blockIdMap.set(block.id, newBlockId);

        return {
          ...block,
          id: newBlockId,
        };
      }) || [];

    // Clone edges with updated block references
    const clonedEdges =
      originalDefinition.edges?.map((edge: any) => {
        const newSourceId = blockIdMap.get(edge.source) || edge.source;
        const newTargetId = blockIdMap.get(edge.target) || edge.target;

        return {
          ...edge,
          id: `${edge.id}-clone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          source: newSourceId,
          target: newTargetId,
        };
      }) || [];

    return {
      ...originalDefinition,
      blocks: clonedBlocks,
      edges: clonedEdges,
    };
  }
}
