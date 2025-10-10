import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistory } from '@/entities/task-history.entity';
import {
  ExecuteTaskTransitionRequestDto,
  TransitionAction,
} from './execute-task-transition.request.dto';
import {
  ExecuteTaskTransitionResponseDto,
  TransitionMetadata,
} from './execute-task-transition.response.dto';

@Injectable()
export class ExecuteTaskTransitionService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async executeTransition(
    taskId: string,
    requestDto: ExecuteTaskTransitionRequestDto,
  ): Promise<ExecuteTaskTransitionResponseDto> {
    // Get current task state
    const currentTask = await this.taskHistoryRepository.findOne({
      where: { taskId },
      order: { createdAt: 'DESC' },
    });

    if (!currentTask) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Validate transition
    await this.validateTransition(currentTask, requestDto);

    // Execute transition
    const transitionMetadata: TransitionMetadata = {
      fromStatus: currentTask.status,
      toStatus: requestDto.toStatus,
      fromColumn: currentTask.fromColumn,
      toColumn: requestDto.toColumn,
      action: requestDto.action,
      comment: requestDto.comment,
      resolution: requestDto.resolution,
      executedBy: requestDto.executedBy,
      executedAt: new Date(),
    };

    // Create history log entry
    const historyLog = this.taskHistoryRepository.create({
      agentId: 'system', // Default system agent for transitions
      taskId,
      taskKey: currentTask.taskKey,
      taskTitle: currentTask.taskTitle,
      action: 'task_transition',
      fromStatus: currentTask.status,
      toStatus: requestDto.toStatus,
      fromColumn: currentTask.fromColumn,
      toColumn: requestDto.toColumn || currentTask.toColumn,
      status: 'completed',
      context: {
        ...transitionMetadata,
        transitionValidated: true,
        automatedTransition: false,
      },
      agentResponse: {
        success: true,
        transitionExecuted: requestDto.action,
        timestamp: new Date().toISOString(),
      },
    });

    const savedLog = await this.taskHistoryRepository.save(historyLog);

    return {
      taskId,
      action: requestDto.action,
      fromStatus: transitionMetadata.fromStatus,
      toStatus: transitionMetadata.toStatus,
      fromColumn: transitionMetadata.fromColumn,
      toColumn: transitionMetadata.toColumn,
      executedBy: requestDto.executedBy,
      executedAt: transitionMetadata.executedAt,
      comment: requestDto.comment,
      resolution: requestDto.resolution,
      success: true,
      historyLogId: savedLog.id,
    };
  }

  private async validateTransition(
    currentTask: TaskHistory,
    requestDto: ExecuteTaskTransitionRequestDto,
  ): Promise<void> {
    const { action, toStatus } = requestDto;
    const fromStatus = currentTask.status;

    // Define valid transitions
    const validTransitions = this.getValidTransitions();

    if (!validTransitions[action]) {
      throw new BadRequestException(`Invalid transition action: ${action}`);
    }

    const allowedFromStatuses = validTransitions[action].from;
    const allowedToStatuses = validTransitions[action].to;

    if (!allowedFromStatuses.includes(fromStatus)) {
      throw new BadRequestException(
        `Cannot execute ${action} from status ${fromStatus}. Allowed from: ${allowedFromStatuses.join(', ')}`,
      );
    }

    if (!allowedToStatuses.includes(toStatus)) {
      throw new BadRequestException(
        `Cannot execute ${action} to status ${toStatus}. Allowed to: ${allowedToStatuses.join(', ')}`,
      );
    }

    // Special validations
    if (action === TransitionAction.COMPLETE && !requestDto.resolution) {
      throw new BadRequestException(
        'Resolution is required when completing a task',
      );
    }
  }

  private getValidTransitions() {
    return {
      [TransitionAction.START_PROGRESS]: {
        from: ['todo', 'blocked'],
        to: ['in_progress'],
      },
      [TransitionAction.SUBMIT_FOR_REVIEW]: {
        from: ['in_progress'],
        to: ['in_review'],
      },
      [TransitionAction.APPROVE]: {
        from: ['in_review'],
        to: ['approved', 'done'],
      },
      [TransitionAction.REQUEST_CHANGES]: {
        from: ['in_review'],
        to: ['in_progress', 'todo'],
      },
      [TransitionAction.COMPLETE]: {
        from: ['approved', 'in_progress', 'in_review'],
        to: ['done', 'completed'],
      },
      [TransitionAction.BLOCK]: {
        from: ['todo', 'in_progress', 'in_review'],
        to: ['blocked'],
      },
      [TransitionAction.UNBLOCK]: {
        from: ['blocked'],
        to: ['todo', 'in_progress'],
      },
      [TransitionAction.REOPEN]: {
        from: ['done', 'completed', 'closed'],
        to: ['todo', 'in_progress'],
      },
      [TransitionAction.CLOSE]: {
        from: ['done', 'completed'],
        to: ['closed'],
      },
    };
  }

  async getAvailableTransitions(taskId: string): Promise<TransitionAction[]> {
    const currentTask = await this.taskHistoryRepository.findOne({
      where: { taskId },
      order: { createdAt: 'DESC' },
    });

    if (!currentTask) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const validTransitions = this.getValidTransitions();
    const availableActions: TransitionAction[] = [];

    Object.entries(validTransitions).forEach(([action, transition]) => {
      if (transition.from.includes(currentTask.status)) {
        availableActions.push(action as TransitionAction);
      }
    });

    return availableActions;
  }
}
