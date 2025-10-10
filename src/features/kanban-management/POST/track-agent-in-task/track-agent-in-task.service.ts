import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TrackAgentInTaskRequestDto } from './track-agent-in-task.request.dto';
import { TrackAgentInTaskResponseDto } from './track-agent-in-task.response.dto';
import { CreateAgentService } from 'src/features/ai-agent/create-agent/create-agent.service';

interface TaskTracking {
  agentId: string;
  taskId: string;
  boardId: string;
  columnId: string;
  columnName?: string;
  isActive: boolean;
  startedAt: Date;
  triggerType?: string;
  taskData?: any;
}

@Injectable()
export class TrackAgentInTaskService {
  private readonly logger = new Logger(TrackAgentInTaskService.name);
  private readonly taskTrackings = new Map<string, TaskTracking[]>(); // agentId -> trackings

  constructor(private readonly createAgentService: CreateAgentService) {}

  async execute(
    agentId: string,
    requestDto: TrackAgentInTaskRequestDto,
  ): Promise<TrackAgentInTaskResponseDto> {
    try {
      this.logger.log(
        `Starting task tracking for agent ${agentId} and task ${requestDto.taskId}`,
      );

      // Verify agent exists
      const agent = await this.createAgentService.findById(agentId);
      if (!agent) {
        throw new NotFoundException(`Agent with ID ${agentId} not found`);
      }

      if (!agent.config?.isActive && agent.status !== 'active') {
        throw new Error(
          `Agent ${agentId} is not active and cannot track tasks`,
        );
      }

      // Create tracking record
      const tracking: TaskTracking = {
        agentId,
        taskId: requestDto.taskId,
        boardId: requestDto.boardId,
        columnId: requestDto.columnId,
        columnName: requestDto.columnName,
        isActive: true,
        startedAt: new Date(),
        triggerType: requestDto.triggerType,
        taskData: requestDto.taskData,
      };

      // Store tracking (in real implementation, this would be in database)
      if (!this.taskTrackings.has(agentId)) {
        this.taskTrackings.set(agentId, []);
      }

      const agentTrackings = this.taskTrackings.get(agentId);
      agentTrackings?.push(tracking);

      // Determine next actions based on agent configuration and task state
      const nextActions = this.determineNextActions(agent, tracking);

      this.logger.log(
        `Task tracking started for agent ${agentId} and task ${requestDto.taskId}`,
      );

      return {
        success: true,
        agentId,
        taskId: requestDto.taskId,
        message: `Agent "${agent.name}" is now tracking task ${requestDto.taskId}`,
        tracking: {
          agentId: tracking.agentId,
          taskId: tracking.taskId,
          boardId: tracking.boardId,
          columnId: tracking.columnId,
          columnName: tracking.columnName,
          isActive: tracking.isActive,
          startedAt: tracking.startedAt.toISOString(),
        },
        nextActions,
      };
    } catch (error) {
      this.logger.error(
        `Failed to start task tracking for agent ${agentId}: ${error.message}`,
        error,
      );
      throw error;
    }
  }

  private determineNextActions(agent: any, tracking: TaskTracking): string[] {
    const actions: string[] = [];

    // Based on column and trigger type, determine what actions the agent should take
    if (tracking.triggerType === 'task_moved_to_column') {
      actions.push(`Analyze task in column "${tracking.columnName}"`);
      actions.push('Apply column-specific instructions');
    }

    if (tracking.columnName?.toLowerCase().includes('todo')) {
      actions.push('Assess task priority and complexity');
      actions.push('Check for missing requirements');
    }

    if (tracking.columnName?.toLowerCase().includes('progress')) {
      actions.push('Monitor task progress');
      actions.push('Check for blockers');
    }

    if (tracking.columnName?.toLowerCase().includes('review')) {
      actions.push('Prepare for review checklist');
      actions.push('Validate completion criteria');
    }

    actions.push('Send status notification');

    return actions;
  }

  async getTrackingsByAgent(agentId: string): Promise<TaskTracking[]> {
    return this.taskTrackings.get(agentId) || [];
  }

  async stopTracking(agentId: string, taskId: string): Promise<boolean> {
    const trackings = this.taskTrackings.get(agentId);
    if (!trackings) return false;

    const trackingIndex = trackings.findIndex(
      (t) => t.taskId === taskId && t.isActive,
    );
    if (trackingIndex === -1) return false;

    trackings[trackingIndex].isActive = false;
    this.logger.log(`Stopped tracking task ${taskId} for agent ${agentId}`);

    return true;
  }
}
