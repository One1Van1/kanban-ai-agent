import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Flow, FlowStatus } from '../../../entities/flow.entity';
import { ExecuteFlowRequestDto } from './execute-flow.request.dto';
import { ExecuteFlowResponseDto } from './execute-flow.response.dto';

@Injectable()
export class ExecuteFlowService {
  private readonly logger = new Logger(ExecuteFlowService.name);

  constructor(
    @InjectRepository(Flow)
    private readonly flowRepository: Repository<Flow>,
  ) {}

  async execute(
    flowId: string,
    requestDto: ExecuteFlowRequestDto,
  ): Promise<ExecuteFlowResponseDto> {
    this.logger.log(`Executing flow with ID: ${flowId}`);

    try {
      // Find flow
      const flow = await this.flowRepository.findOne({
        where: { id: flowId },
      });

      if (!flow) {
        throw new NotFoundException(`Flow with ID ${flowId} not found`);
      }

      // Check if flow is active
      if (flow.status !== FlowStatus.ACTIVE) {
        throw new BadRequestException(
          `Flow must be active to execute. Current status: ${flow.status}`,
        );
      }

      // Validate flow definition
      if (!flow.definition?.blocks?.length) {
        throw new BadRequestException(
          'Flow must have at least one block to execute',
        );
      }

      // Generate agent instructions from flow
      const instructions = this.generateInstructionsFromFlow(
        flow.definition,
        requestDto.context,
      );

      // Generate execution ID
      const executionId = randomUUID();

      this.logger.log(`Flow execution started: ${flow.name} (${executionId})`);

      return new ExecuteFlowResponseDto({
        executionId,
        flowId: flow.id,
        flowName: flow.name,
        instructions,
        status: 'queued', // In real implementation, this would track actual execution
        context: requestDto.context || {},
        executedBy: requestDto.executedBy,
        executedAt: new Date(),
      });
    } catch (error) {
      this.logger.error(
        `Failed to execute flow: ${error.message}`,
        error.stack,
      );

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new BadRequestException('Failed to execute flow');
    }
  }

  private generateInstructionsFromFlow(
    definition: any,
    context: any = {},
  ): string[] {
    if (!definition?.blocks || !definition?.edges) {
      return [];
    }

    // Sort blocks by flow sequence using topological sort
    const sortedBlocks = this.sortBlocksByFlow(
      definition.blocks,
      definition.edges,
    );

    const instructions: string[] = [];
    let stepCounter = 1;

    for (const block of sortedBlocks) {
      const instruction = this.generateBlockInstruction(
        block,
        context,
        stepCounter,
      );
      if (instruction) {
        instructions.push(instruction);
        stepCounter++;
      }
    }

    return instructions;
  }

  private sortBlocksByFlow(blocks: any[], edges: any[]): any[] {
    // Create adjacency map
    const adjacencyMap = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    // Initialize
    blocks.forEach((block) => {
      adjacencyMap.set(block.id, []);
      inDegree.set(block.id, 0);
    });

    // Build graph
    edges.forEach((edge) => {
      const sourceTargets = adjacencyMap.get(edge.source) || [];
      sourceTargets.push(edge.target);
      adjacencyMap.set(edge.source, sourceTargets);

      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    });

    // Topological sort
    const queue: string[] = [];
    const result: any[] = [];

    // Find starting nodes (no incoming edges)
    inDegree.forEach((degree, blockId) => {
      if (degree === 0) {
        queue.push(blockId);
      }
    });

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const currentBlock = blocks.find((b) => b.id === currentId);
      if (currentBlock) {
        result.push(currentBlock);
      }

      // Process neighbors
      const neighbors = adjacencyMap.get(currentId) || [];
      neighbors.forEach((neighborId) => {
        const newDegree = (inDegree.get(neighborId) || 0) - 1;
        inDegree.set(neighborId, newDegree);

        if (newDegree === 0) {
          queue.push(neighborId);
        }
      });
    }

    return result;
  }

  private generateBlockInstruction(
    block: any,
    context: any,
    stepNumber: number,
  ): string {
    const config = block.configuration || {};

    switch (block.type) {
      case 'extract_files':
        const fileTypes = config.fileTypes?.join(', ') || 'все файлы';
        return `${stepNumber}. Извлеки ${fileTypes} из ${context.taskId ? `задачи ${context.taskId}` : 'текущей задачи'}`;

      case 'ai_request':
        const prompt = config.prompt || 'выполни анализ';
        return `${stepNumber}. Выполни AI анализ с промптом: "${prompt}"`;

      case 'if_condition':
        const condition = config.condition || 'проверь условие';
        return `${stepNumber}. Проверь условие: ${condition}`;

      case 'move_card':
        const targetColumn = config.targetColumn || 'следующую колонку';
        return `${stepNumber}. Перемести карточку в колонку: ${targetColumn}`;

      case 'wait':
        const duration = config.duration || '1 минуту';
        return `${stepNumber}. Подожди ${duration}`;

      case 'api_call':
        const endpoint = config.endpoint || 'API';
        return `${stepNumber}. Выполни вызов к ${endpoint}`;

      case 'create_file':
        const fileName = config.fileName || 'новый файл';
        return `${stepNumber}. Создай файл: ${fileName}`;

      default:
        return `${stepNumber}. Выполни действие типа: ${block.type}`;
    }
  }
}
