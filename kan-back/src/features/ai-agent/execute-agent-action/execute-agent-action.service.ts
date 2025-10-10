import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import {
  ExecuteAgentActionRequestDto,
  AgentActionTrigger,
} from './execute-agent-action.request.dto';
import {
  ExecuteAgentActionResponseDto,
  AgentActionResult,
  AgentActionOutputDto,
} from './execute-agent-action.response.dto';
import { AgentActivity } from '../../../types/ai-agent.interface';
import { Agent } from '../../../entities/agent.entity';
import { AgentInstruction } from '../../../entities/agent-instruction.entity';
import { InstructionExecutorService } from '../instruction-executor/instruction-executor.service';

@Injectable()
export class ExecuteAgentActionService {
  private readonly logger = new Logger(ExecuteAgentActionService.name);
  private readonly agentActivities = new Map<string, AgentActivity>();

  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    @InjectRepository(AgentInstruction)
    private readonly agentInstructionRepository: Repository<AgentInstruction>,
    private readonly instructionExecutorService: InstructionExecutorService,
  ) {}

  async execute(
    request: ExecuteAgentActionRequestDto,
  ): Promise<ExecuteAgentActionResponseDto> {
    const startTime = Date.now();
    const executionId = randomUUID();

    this.logger.log(
      `Executing agent action - Agent: ${request.agentId}, Task: ${request.taskId}, Trigger: ${request.triggerType}`,
    );

    try {
      // Validate input
      await this.validateRequest(request);

      // Get agent configuration and column instructions
      const agentConfig = await this.getAgentConfig(request.agentId);
      const columnInstructions = await this.getColumnInstructions(
        request.agentId,
        request.boardId,
        request.columnId,
      );

      // Check if agent should act based on trigger conditions
      const shouldExecute = this.shouldExecuteAgent(
        request,
        columnInstructions,
      );

      if (!shouldExecute || !columnInstructions) {
        return this.createSkippedResponse(executionId, request, startTime);
      }

      // Execute agent actions
      const actions = await this.performAgentActions(
        request,
        columnInstructions,
        agentConfig,
      );

      // Calculate execution time
      const executionTime = Date.now() - startTime;

      // Create activity record
      const activity: AgentActivity = {
        id: executionId,
        agentId: request.agentId,
        taskId: request.taskId,
        action: `${request.triggerType}_executed`,
        result: 'success',
        input: request,
        output: actions,
        executionTime,
        createdAt: new Date(),
      };

      // Store activity (in real implementation this would go to database)
      this.agentActivities.set(executionId, activity);

      this.logger.log(
        `Agent action executed successfully: ${executionId} in ${executionTime}ms`,
      );

      return new ExecuteAgentActionResponseDto({
        executionId,
        agentId: request.agentId,
        taskId: request.taskId,
        result: AgentActionResult.SUCCESS,
        actions,
        summary: this.generateSummary(actions),
        executionTimeMs: executionTime,
        metadata: {
          triggerType: request.triggerType,
          columnName: request.columnName,
          actionsCount: actions.length,
        },
        executedAt: new Date(),
      });
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.logger.error(
        `Failed to execute agent action: ${error.message}`,
        error.stack,
      );

      // Record failed activity
      const activity: AgentActivity = {
        id: executionId,
        agentId: request.agentId,
        taskId: request.taskId,
        action: `${request.triggerType}_failed`,
        result: 'error',
        input: request,
        error: error.message,
        executionTime,
        createdAt: new Date(),
      };

      this.agentActivities.set(executionId, activity);

      return new ExecuteAgentActionResponseDto({
        executionId,
        agentId: request.agentId,
        taskId: request.taskId,
        result: AgentActionResult.ERROR,
        actions: [],
        summary: 'Agent execution failed',
        executionTimeMs: executionTime,
        error: error.message,
        executedAt: new Date(),
      });
    }
  }

  private async validateRequest(
    request: ExecuteAgentActionRequestDto,
  ): Promise<void> {
    if (!request.agentId || request.agentId.trim().length === 0) {
      throw new BadRequestException('Agent ID is required');
    }

    if (!request.taskId || request.taskId.trim().length === 0) {
      throw new BadRequestException('Task ID is required');
    }

    if (!request.boardId || request.boardId.trim().length === 0) {
      throw new BadRequestException('Board ID is required');
    }

    if (!request.columnId || request.columnId.trim().length === 0) {
      throw new BadRequestException('Column ID is required');
    }

    if (!request.taskData || Object.keys(request.taskData).length === 0) {
      throw new BadRequestException('Task data is required');
    }
  }

  private async getAgentConfig(agentId: string): Promise<Agent> {
    const agent = await this.agentRepository.findOne({
      where: { id: agentId },
    });

    if (!agent) {
      throw new NotFoundException(`Agent with ID ${agentId} not found`);
    }

    if (agent.status !== 'active') {
      throw new BadRequestException(
        `Agent ${agentId} is not active (status: ${agent.status})`,
      );
    }

    return agent;
  }

  private async getColumnInstructions(
    agentId: string,
    boardId: string,
    columnId: string,
  ): Promise<AgentInstruction | null> {
    this.logger.log(
      `🔍 Searching for instructions: agentId=${agentId}, columnId=${columnId}`,
    );

    const instruction = await this.agentInstructionRepository.findOne({
      where: {
        agentId,
        columnId,
      },
    });

    if (instruction) {
      this.logger.log(
        `✅ Found instruction: ${instruction.id} - ${instruction.instruction} (triggerEvent: ${instruction.triggerEvent}, isActive: ${instruction.isActive})`,
      );
    } else {
      this.logger.warn(
        `❌ No instructions found for agent ${agentId} in column ${columnId}`,
      );

      // Попробуем найти все инструкции для этого агента для отладки
      const allInstructions = await this.agentInstructionRepository.find({
        where: { agentId },
      });

      this.logger.warn(
        `📋 All instructions for agent ${agentId}:`,
        allInstructions.map(
          (i) =>
            `columnId=${i.columnId}, triggerEvent=${i.triggerEvent}, isActive=${i.isActive}`,
        ),
      );
    }

    return instruction;
  }

  private shouldExecuteAgent(
    request: ExecuteAgentActionRequestDto,
    columnInstructions: AgentInstruction | null,
  ): boolean {
    if (!columnInstructions || !columnInstructions.isActive) {
      this.logger.log('Agent execution skipped: no active instructions found');
      return false;
    }

    // Check if trigger type matches the instruction's trigger event
    const shouldExecute =
      columnInstructions.triggerEvent === 'on_enter' &&
      request.triggerType === AgentActionTrigger.TASK_MOVED_TO_COLUMN;

    this.logger.log(
      `Trigger check: ${request.triggerType} matches ${columnInstructions.triggerEvent} = ${shouldExecute}`,
    );

    return shouldExecute;
  }

  private async performAgentActions(
    request: ExecuteAgentActionRequestDto,
    columnInstructions: AgentInstruction,
    agentConfig: Agent,
  ): Promise<AgentActionOutputDto[]> {
    this.logger.log(
      `🤖 AI Agent executing instruction: "${columnInstructions.instruction}"`,
    );

    // 🚀 Используем универсальный AI-движок для выполнения инструкций!
    return await this.instructionExecutorService.executeInstruction(
      columnInstructions,
      agentConfig,
      request,
    );
  }

  private createSkippedResponse(
    executionId: string,
    request: ExecuteAgentActionRequestDto,
    startTime: number,
  ): ExecuteAgentActionResponseDto {
    const executionTime = Date.now() - startTime;

    return new ExecuteAgentActionResponseDto({
      executionId,
      agentId: request.agentId,
      taskId: request.taskId,
      result: AgentActionResult.SKIPPED,
      actions: [],
      summary: 'Agent execution skipped - no matching trigger conditions',
      executionTimeMs: executionTime,
      metadata: {
        reason: 'no_matching_triggers',
        triggerType: request.triggerType,
      },
      executedAt: new Date(),
    });
  }

  private generateSummary(actions: AgentActionOutputDto[]): string {
    if (actions.length === 0) {
      return 'No actions performed';
    }

    const actionTypes = actions.map((action) => action.actionType);
    return `Performed ${actions.length} action(s): ${actionTypes.join(', ')}`;
  }

  async getAgentActivity(executionId: string): Promise<AgentActivity | null> {
    return this.agentActivities.get(executionId) || null;
  }

  async getAgentActivitiesByAgent(agentId: string): Promise<AgentActivity[]> {
    const activities: AgentActivity[] = [];
    for (const activity of this.agentActivities.values()) {
      if (activity.agentId === agentId) {
        activities.push(activity);
      }
    }
    return activities.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }
}
