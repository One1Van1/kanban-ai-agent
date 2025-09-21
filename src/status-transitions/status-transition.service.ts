import { Injectable, Logger } from '@nestjs/common';
import { KanbanService } from '../kanban/kanban.service';
import { TaskStatus } from '../types/enums';
import {
  EnhancedTaskStatus,
  TransitionType,
  StatusTransition,
  EnhancedTaskInfo,
} from '../enhanced-workflow/types';

@Injectable()
export class StatusTransitionService {
  private readonly logger = new Logger(StatusTransitionService.name);

  constructor(private readonly kanbanService: KanbanService) {}

  /**
   * Выполняет переход задачи между статусами
   */
  async performTransition(
    taskKey: string,
    fromStatus: EnhancedTaskStatus,
    toStatus: EnhancedTaskStatus,
    reason: string,
    triggeredBy: 'ai' | 'user' | 'system' = 'ai',
    metadata?: Record<string, any>,
  ): Promise<StatusTransition> {
    this.logger.log(
      `🔄 Performing transition for ${taskKey}: ${fromStatus} → ${toStatus}`,
    );

    // Валидируем переход
    const transitionType = this.validateAndGetTransitionType(
      fromStatus,
      toStatus,
    );
    if (!transitionType) {
      throw new Error(`Invalid transition: ${fromStatus} → ${toStatus}`);
    }

    try {
      // Выполняем переход в Jira через существующий KanbanService
      await this.executeJiraTransition(taskKey, toStatus, reason);

      // Создаем запись о переходе
      const transition: StatusTransition = {
        taskKey,
        fromStatus,
        toStatus,
        transitionType,
        reason,
        timestamp: new Date(),
        triggeredBy,
        metadata,
      };

      this.logger.log(
        `✅ Transition completed for ${taskKey}: ${fromStatus} → ${toStatus}`,
      );
      return transition;
    } catch (error) {
      this.logger.error(
        `❌ Transition failed for ${taskKey}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Перемещает задачу в Questions с пояснением
   */
  async moveToQuestions(
    taskKey: string,
    currentStatus: EnhancedTaskStatus,
    clarifications: string[],
    triggeredBy: 'ai' | 'user' | 'system' = 'ai',
  ): Promise<StatusTransition> {
    const reason = `Требуется уточнение: ${clarifications.join(', ')}`;

    return this.performTransition(
      taskKey,
      currentStatus,
      EnhancedTaskStatus.QUESTIONS,
      reason,
      triggeredBy,
      { clarifications },
    );
  }

  /**
   * Перемещает задачу в In Progress после выполнения
   */
  async moveToInProgress(
    taskKey: string,
    currentStatus: EnhancedTaskStatus,
    executionSummary: string,
    triggeredBy: 'ai' | 'user' | 'system' = 'ai',
  ): Promise<StatusTransition> {
    const reason = `Задача выполнена AI: ${executionSummary}`;

    return this.performTransition(
      taskKey,
      currentStatus,
      EnhancedTaskStatus.IN_PROGRESS,
      reason,
      triggeredBy,
      { executionSummary },
    );
  }

  /**
   * Перемещает задачу в Review после завершения выполнения
   */
  async moveToReview(
    taskKey: string,
    currentStatus: EnhancedTaskStatus,
    executionResults: any[],
    triggeredBy: 'ai' | 'user' | 'system' = 'ai',
  ): Promise<StatusTransition> {
    const successfulSteps = executionResults.filter((r) => r.success).length;
    const totalSteps = executionResults.length;
    const reason = `Выполнение завершено. Успешно: ${successfulSteps}/${totalSteps} шагов`;

    return this.performTransition(
      taskKey,
      currentStatus,
      EnhancedTaskStatus.REVIEW,
      reason,
      triggeredBy,
      { executionResults, successfulSteps, totalSteps },
    );
  }

  /**
   * Перемещает задачу в Done после проверки
   */
  async moveToDone(
    taskKey: string,
    currentStatus: EnhancedTaskStatus,
    reviewComment: string,
    triggeredBy: 'ai' | 'user' | 'system' = 'user',
  ): Promise<StatusTransition> {
    const reason = `Проверка завершена: ${reviewComment}`;

    return this.performTransition(
      taskKey,
      currentStatus,
      EnhancedTaskStatus.DONE,
      reason,
      triggeredBy,
      { reviewComment },
    );
  }

  /**
   * Возвращает задачу обратно на доработку
   */
  async returnForRework(
    taskKey: string,
    currentStatus: EnhancedTaskStatus,
    reworkReason: string,
    triggeredBy: 'ai' | 'user' | 'system' = 'user',
  ): Promise<StatusTransition> {
    const targetStatus =
      currentStatus === EnhancedTaskStatus.REVIEW
        ? EnhancedTaskStatus.IN_PROGRESS
        : EnhancedTaskStatus.NEW;

    const reason = `Возврат на доработку: ${reworkReason}`;

    return this.performTransition(
      taskKey,
      currentStatus,
      targetStatus,
      reason,
      triggeredBy,
      { reworkReason },
    );
  }

  /**
   * Проверяет, можно ли выполнить переход и возвращает его тип
   */
  private validateAndGetTransitionType(
    fromStatus: EnhancedTaskStatus,
    toStatus: EnhancedTaskStatus,
  ): TransitionType | null {
    const transitions: Record<string, TransitionType> = {
      [`${EnhancedTaskStatus.BACKLOG}-${EnhancedTaskStatus.NEW}`]:
        TransitionType.BACKLOG_TO_NEW,
      [`${EnhancedTaskStatus.NEW}-${EnhancedTaskStatus.QUESTIONS}`]:
        TransitionType.NEW_TO_QUESTIONS,
      [`${EnhancedTaskStatus.NEW}-${EnhancedTaskStatus.IN_PROGRESS}`]:
        TransitionType.NEW_TO_IN_PROGRESS,
      [`${EnhancedTaskStatus.QUESTIONS}-${EnhancedTaskStatus.NEW}`]:
        TransitionType.QUESTIONS_TO_NEW,
      [`${EnhancedTaskStatus.IN_PROGRESS}-${EnhancedTaskStatus.REVIEW}`]:
        TransitionType.IN_PROGRESS_TO_REVIEW,
      [`${EnhancedTaskStatus.REVIEW}-${EnhancedTaskStatus.DONE}`]:
        TransitionType.REVIEW_TO_DONE,
      [`${EnhancedTaskStatus.REVIEW}-${EnhancedTaskStatus.IN_PROGRESS}`]:
        TransitionType.REVIEW_TO_IN_PROGRESS,
    };

    return transitions[`${fromStatus}-${toStatus}`] || null;
  }

  /**
   * Выполняет переход в Jira через существующий KanbanService
   */
  private async executeJiraTransition(
    taskKey: string,
    toStatus: EnhancedTaskStatus,
    reason: string,
  ): Promise<void> {
    try {
      // Маппим наши статусы к статусам Jira
      const jiraStatus = this.mapToJiraStatus(toStatus);

      // Используем существующий KanbanService для обновления статуса
      await this.kanbanService.updateTaskStatus({
        taskKey,
        newStatus: this.mapToExistingTaskStatus(toStatus),
        comment: reason,
      });

      this.logger.log(
        `✅ Jira transition completed for ${taskKey} to ${jiraStatus}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Jira transition failed for ${taskKey}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Маппит наши расширенные статусы к существующим TaskStatus
   */
  private mapToExistingTaskStatus(
    enhancedStatus: EnhancedTaskStatus,
  ): TaskStatus {
    const statusMapping: Record<EnhancedTaskStatus, TaskStatus> = {
      [EnhancedTaskStatus.BACKLOG]: TaskStatus.NEW,
      [EnhancedTaskStatus.NEW]: TaskStatus.NEW,
      [EnhancedTaskStatus.QUESTIONS]: TaskStatus.QUESTIONS,
      [EnhancedTaskStatus.IN_PROGRESS]: TaskStatus.IN_PROGRESS,
      [EnhancedTaskStatus.REVIEW]: TaskStatus.REVIEW,
      [EnhancedTaskStatus.DONE]: TaskStatus.DONE,
    };

    return statusMapping[enhancedStatus] || TaskStatus.NEW;
  }

  /**
   * Маппит наши расширенные статусы к статусам Jira
   */
  private mapToJiraStatus(enhancedStatus: EnhancedTaskStatus): string {
    const statusMapping: Record<EnhancedTaskStatus, string> = {
      [EnhancedTaskStatus.BACKLOG]: 'Backlog',
      [EnhancedTaskStatus.NEW]: 'To Do',
      [EnhancedTaskStatus.QUESTIONS]: 'Questions',
      [EnhancedTaskStatus.IN_PROGRESS]: 'In Progress',
      [EnhancedTaskStatus.REVIEW]: 'Review',
      [EnhancedTaskStatus.DONE]: 'Done',
    };

    return statusMapping[enhancedStatus] || 'To Do';
  }

  /**
   * Получает все возможные переходы для текущего статуса
   */
  getPossibleTransitions(
    currentStatus: EnhancedTaskStatus,
  ): EnhancedTaskStatus[] {
    const possibleTransitions: Record<
      EnhancedTaskStatus,
      EnhancedTaskStatus[]
    > = {
      [EnhancedTaskStatus.BACKLOG]: [EnhancedTaskStatus.NEW],
      [EnhancedTaskStatus.NEW]: [
        EnhancedTaskStatus.QUESTIONS,
        EnhancedTaskStatus.IN_PROGRESS,
      ],
      [EnhancedTaskStatus.QUESTIONS]: [EnhancedTaskStatus.NEW],
      [EnhancedTaskStatus.IN_PROGRESS]: [EnhancedTaskStatus.REVIEW],
      [EnhancedTaskStatus.REVIEW]: [
        EnhancedTaskStatus.DONE,
        EnhancedTaskStatus.IN_PROGRESS,
      ],
      [EnhancedTaskStatus.DONE]: [], // Финальный статус
    };

    return possibleTransitions[currentStatus] || [];
  }

  /**
   * Проверяет, является ли переход валидным
   */
  isTransitionValid(
    fromStatus: EnhancedTaskStatus,
    toStatus: EnhancedTaskStatus,
  ): boolean {
    const possibleTransitions = this.getPossibleTransitions(fromStatus);
    return possibleTransitions.includes(toStatus);
  }
}
