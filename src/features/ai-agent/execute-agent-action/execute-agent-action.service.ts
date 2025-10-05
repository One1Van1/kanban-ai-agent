import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

@Injectable()
export class ExecuteAgentActionService {
  private readonly logger = new Logger(ExecuteAgentActionService.name);
  private readonly agentActivities = new Map<string, AgentActivity>();

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

      if (!shouldExecute) {
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

  private async getAgentConfig(agentId: string): Promise<any> {
    // In real implementation, this would fetch from database
    return {
      id: agentId,
      name: 'Test Agent',
      model: 'gpt-4',
      temperature: 0.7,
      isActive: true,
    };
  }

  private async getColumnInstructions(
    agentId: string,
    boardId: string,
    columnId: string,
  ): Promise<any> {
    // In real implementation, this would fetch from database
    return {
      agentId,
      boardId,
      columnId,
      instructions:
        'Analyze task and take appropriate actions based on priority and assignment',
      triggerConditions: [{ type: 'task_moved_to_column' }],
      isActive: true,
    };
  }

  private shouldExecuteAgent(
    request: ExecuteAgentActionRequestDto,
    columnInstructions: any,
  ): boolean {
    if (!columnInstructions || !columnInstructions.isActive) {
      return false;
    }

    // Check if trigger type matches any condition
    const triggerConditions = columnInstructions.triggerConditions || [];
    return triggerConditions.some(
      (condition: any) => condition.type === request.triggerType,
    );
  }

  private async performAgentActions(
    request: ExecuteAgentActionRequestDto,
    columnInstructions: any,
    agentConfig: any,
  ): Promise<AgentActionOutputDto[]> {
    const actions: AgentActionOutputDto[] = [];

    // Simulate different actions based on task data and trigger
    if (request.triggerType === AgentActionTrigger.TASK_MOVED_TO_COLUMN) {
      // Check priority and send notification if needed
      if (
        request.taskData.priority === 'high' ||
        request.taskData.priority === 'urgent'
      ) {
        actions.push(
          new AgentActionOutputDto({
            actionType: 'priority_notification',
            description: `High priority task notification sent to assignee`,
            data: {
              priority: request.taskData.priority,
              assignee: request.taskData.assignee,
              notificationSent: true,
            },
          }),
        );
      }

      // Check if task has all required fields
      const requiredFields = ['title', 'description', 'assignee'];
      const missingFields = requiredFields.filter(
        (field) => !request.taskData[field],
      );

      if (missingFields.length > 0) {
        actions.push(
          new AgentActionOutputDto({
            actionType: 'validation_warning',
            description: `Task is missing required fields: ${missingFields.join(', ')}`,
            data: {
              missingFields,
              taskId: request.taskId,
              warningIssued: true,
            },
          }),
        );
      }
    }

    if (request.triggerType === AgentActionTrigger.TASK_ASSIGNED) {
      actions.push(
        new AgentActionOutputDto({
          actionType: 'assignment_notification',
          description: `Task assignment notification sent`,
          data: {
            assignee: request.taskData.assignee,
            taskTitle: request.taskData.title,
            notificationSent: true,
          },
        }),
      );
    }

    return actions;
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
