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
      const agentResult = await this.createAgentService.execute({
        name: requestDto.agentName || `${flow.name} Agent`,
        description:
          requestDto.agentDescription ||
          `Agent created from flow: ${flow.name}`,
        instructions: this.generateAgentInstructions(
          flow.definition.blocks || [],
          flow.definition.edges || [],
        ),
        model: 'claude-3-5-sonnet-20241022',
        isActive: true,
        userId: requestDto.userId,
      });

      const agent = agentResult.agent;

      // 5. Create column instructions for each trigger
      const instructions = [];
      for (const trigger of flow.definition?.triggers || []) {
        if (trigger.type === 'board_move') {
          const instructionResult =
            await this.configureColumnInstructionsService.execute({
              agentId: agent.id,
              boardId: trigger.config.boardId || 'default',
              columnId: trigger.config.targetColumn,
              columnName: trigger.config.targetColumn,
              instructions: this.generateColumnInstruction(
                flow.definition.blocks,
              ),
              triggerConditions: [],
              isActive: true,
            });
          instructions.push(instructionResult);
        }
      }

      // 6. Update flow with agent connection
      await this.flowRepository.update(flowId, {
        agentId: agent.id,
        status: FlowStatus.ACTIVE, // Mark as active when deployed
      });

      this.logger.log(`✅ Flow "${flow.name}" deployed to agent successfully`);

      return new DeployToAgentResponseDto({
        success: true,
        message: `Flow "${flow.name}" deployed to agent successfully`,
        flowId: flow.id,
        agentId: agent.id,
        createdAgent: {
          id: agent.id,
          name: agent.name,
          description: agent.description || '',
          isActive: agent.isActive,
        },
        createdInstructions: instructions.map((inst) => ({
          id: inst.columnInstruction.id,
          agentId: inst.columnInstruction.agentId,
          boardId: inst.columnInstruction.boardId,
          columnId: inst.columnInstruction.columnId,
          columnName: inst.columnInstruction.columnName,
          instructions: inst.columnInstruction.instructions,
          isActive: inst.columnInstruction.isActive,
        })),
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

  private generateAgentInstructions(
    blocks: any[] = [],
    edges: any[] = [],
  ): string {
    const instructions = [
      'Ты - AI агент для автоматического выполнения задач в Kanban досках.',
    ];

    if (!Array.isArray(blocks)) {
      this.logger.warn('Blocks is not an array, using empty array');
      blocks = [];
    }

    // Sort blocks by flow sequence
    const sortedBlocks = this.sortBlocksByFlow(blocks, edges);

    if (sortedBlocks.length > 0) {
      instructions.push('\n📋 Последовательность действий:');
    }

    sortedBlocks.forEach((block, index) => {
      switch (block.type) {
        case 'extract_files':
          const fileTypes = block.config?.fileTypes || ['все файлы'];
          const analysisType =
            block.config?.analysisType || 'анализируй содержимое';
          instructions.push(
            `${index + 1}. Извлекай ${fileTypes.join(', ')} и ${analysisType}`,
          );
          break;
        case 'ai_request':
          const prompt = block.config?.prompt || 'Выполни AI анализ';
          instructions.push(`${index + 1}. Выполняй AI анализ: "${prompt}"`);
          break;
        case 'comment':
          const message =
            block.config?.message || 'Добавь комментарий с результатами';
          instructions.push(`${index + 1}. Добавляй комментарии: "${message}"`);
          break;
        case 'move_card':
          const targetColumn =
            block.config?.targetColumn || 'следующую колонку';
          instructions.push(
            `${index + 1}. Перемещай карточки в колонку: "${targetColumn}"`,
          );
          break;
        case 'update_field':
          if (block.config?.field && block.config?.value) {
            instructions.push(
              `${index + 1}. Обновляй поле "${block.config.field}" значением "${block.config.value}"`,
            );
          } else {
            instructions.push(
              `${index + 1}. Обновляй поля задач (приоритет, статус, метки, описание)`,
            );
          }
          break;
        case 'if_condition':
          const ifCondition = block.config?.condition || 'условие выполнено';
          const thenAction =
            block.config?.thenAction || 'выполни следующие действия';
          const elseAction = block.config?.elseAction
            ? `, иначе ${block.config.elseAction}`
            : '';
          instructions.push(
            `- Если ${ifCondition}, то ${thenAction}${elseAction}`,
          );
          break;
        default:
          this.logger.warn(`Unknown block type: ${block.type}`);
          instructions.push(
            `${index + 1}. Обработай блок типа "${block.type}" (требует уточнения)`,
          );
      }
    });

    return instructions.join('\n');
  }

  private generateColumnInstruction(blocks: any[] = []): string {
    const instructions: string[] = [];

    blocks.forEach((block) => {
      switch (block.type) {
        case 'extract_files':
          const fileTypes = block.config?.fileTypes || ['pdf', 'doc'];
          instructions.push(`Извлеки ${fileTypes.join(', ')} из задачи`);
          break;
        case 'ai_request':
          const prompt = block.config?.prompt || 'Анализируй содержимое';
          instructions.push(`Выполни AI анализ с промптом: "${prompt}"`);
          break;
        case 'if_condition':
          const condition = block.config?.condition || 'условие';
          instructions.push(`Проверь условие: ${condition}`);
          break;
        case 'move_card':
          const targetColumn =
            block.config?.targetColumn || 'следующая колонка';
          instructions.push(`Перемести карточку в колонку: ${targetColumn}`);
          break;
      }
    });

    return instructions.join('\n');
  }

  private sortBlocksByFlow(blocks: any[], edges: any[]): any[] {
    if (!edges || edges.length === 0) {
      return blocks;
    }

    // Create graph of connections
    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    // Initialize graph
    blocks.forEach((block) => {
      graph.set(block.id, []);
      inDegree.set(block.id, 0);
    });

    // Build graph from edges
    edges.forEach((edge) => {
      if (graph.has(edge.source) && graph.has(edge.target)) {
        graph.get(edge.source)!.push(edge.target);
        inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
      }
    });

    // Topological sort
    const queue: string[] = [];
    const result: any[] = [];

    // Find nodes with no incoming edges
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId);
      }
    });

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const currentBlock = blocks.find((block) => block.id === currentId);
      if (currentBlock) {
        result.push(currentBlock);
      }

      // Process neighbors
      graph.get(currentId)?.forEach((neighborId) => {
        inDegree.set(neighborId, inDegree.get(neighborId)! - 1);
        if (inDegree.get(neighborId) === 0) {
          queue.push(neighborId);
        }
      });
    }

    // If not all blocks are processed, return original order
    return result.length === blocks.length ? result : blocks;
  }
}
