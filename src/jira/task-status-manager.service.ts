import { Injectable, Logger } from '@nestjs/common';
import { JiraService } from './jira.service';
import { JiraTaskTransitionsResponse } from './types/jira-task.interface';
import {
  StatusTransition,
  TaskTransitionOptions,
  TransitionResult,
  TaskMovementRule,
  BoardColumnMapping,
} from './types/kanban-column.interface';

@Injectable()
export class TaskStatusManagerService {
  private readonly logger = new Logger(TaskStatusManagerService.name);

  constructor(private readonly jiraService: JiraService) {}

  /**
   * Переместить задачу в другую колонку по имени статуса
   */
  async moveTaskToColumn(
    taskKey: string,
    targetStatusName: string,
    comment?: string,
  ): Promise<TransitionResult> {
    try {
      // Получить текущую задачу для определения исходного статуса
      const currentTask = await this.jiraService.getTask(taskKey);
      const fromStatus = currentTask.fields.status.name;

      // Проверить, не находится ли задача уже в целевом статусе
      if (fromStatus.toLowerCase() === targetStatusName.toLowerCase()) {
        this.logger.log(
          `Task ${taskKey} is already in status "${targetStatusName}"`,
        );
        return {
          success: true,
          taskKey,
          fromStatus,
          toStatus: targetStatusName,
          message: 'Task already in target status',
        };
      }

      // Получить доступные переходы
      const transitions = await this.getAvailableTransitions(taskKey);

      // Найти переход к целевому статусу
      const targetTransition = transitions.find(
        (t) => t.toStatusName.toLowerCase() === targetStatusName.toLowerCase(),
      );

      if (!targetTransition) {
        const availableStatuses = transitions
          .map((t) => t.toStatusName)
          .join(', ');
        throw new Error(
          `Cannot transition from "${fromStatus}" to "${targetStatusName}". Available transitions: ${availableStatuses}`,
        );
      }

      // Выполнить переход (может вернуть ошибку, но задача может переместиться)
      let transitionError = null;
      try {
        await this.jiraService.transitionTask(taskKey, targetTransition.id);
      } catch (error) {
        transitionError = error;
        this.logger.warn(
          `Transition API returned error, but checking if task actually moved: ${error.message}`,
        );
      }

      // Проверить, действительно ли задача переместилась
      const updatedTask = await this.jiraService.getTask(taskKey);
      const actualStatus = updatedTask.fields.status.name;

      // Добавить комментарий если указан и переход успешен
      if (
        comment &&
        actualStatus.toLowerCase() === targetStatusName.toLowerCase()
      ) {
        try {
          await this.jiraService.addComment(taskKey, { body: comment });
        } catch (commentError) {
          this.logger.warn(`Failed to add comment: ${commentError.message}`);
        }
      }

      // Определить успешность по фактическому статусу
      const isSuccess =
        actualStatus.toLowerCase() === targetStatusName.toLowerCase();

      if (isSuccess) {
        this.logger.log(
          `Task ${taskKey} successfully moved from "${fromStatus}" to "${actualStatus}"`,
        );
        return {
          success: true,
          taskKey,
          fromStatus,
          toStatus: actualStatus,
          transitionId: targetTransition.id,
          warning: transitionError
            ? 'Transition API returned error, but task moved successfully'
            : undefined,
        };
      } else {
        this.logger.error(
          `Task ${taskKey} failed to move. Expected: "${targetStatusName}", Actual: "${actualStatus}"`,
        );
        return {
          success: false,
          taskKey,
          fromStatus,
          toStatus: targetStatusName,
          error:
            transitionError?.message || `Task didn't move to expected status`,
        };
      }
    } catch (error) {
      this.logger.error(
        `Failed to move task ${taskKey} to "${targetStatusName}":`,
        error.message,
      );
      return {
        success: false,
        taskKey,
        fromStatus: 'unknown',
        toStatus: targetStatusName,
        error: error.message,
      };
    }
  }

  /**
   * Переместить несколько задач в колонку
   */
  async moveMultipleTasksToColumn(
    taskKeys: string[],
    targetStatusName: string,
    comment?: string,
  ): Promise<TransitionResult[]> {
    const results = await Promise.allSettled(
      taskKeys.map((taskKey) =>
        this.moveTaskToColumn(taskKey, targetStatusName, comment),
      ),
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        this.logger.error(
          `Failed to move task ${taskKeys[index]}:`,
          result.reason,
        );
        return {
          success: false,
          taskKey: taskKeys[index],
          fromStatus: 'unknown',
          toStatus: targetStatusName,
          error: result.reason?.message || 'Unknown error',
        };
      }
    });
  }

  /**
   * Получить все доступные переходы для задачи
   */
  async getAvailableTransitions(taskKey: string): Promise<StatusTransition[]> {
    try {
      const currentTask = await this.jiraService.getTask(taskKey);
      const transitionsResponse =
        await this.jiraService.getTaskTransitions(taskKey);

      return transitionsResponse.transitions.map((transition) => ({
        id: transition.id,
        name: transition.name,
        fromStatusId: currentTask.fields.status.id,
        fromStatusName: currentTask.fields.status.name,
        toStatusId: transition.to.id,
        toStatusName: transition.to.name,
        isAvailable: true,
      }));
    } catch (error) {
      this.logger.error(
        `Failed to get transitions for task ${taskKey}:`,
        error.message,
      );
      throw error;
    }
  }

  /**
   * Проверить возможность перехода между статусами
   */
  async canTransitionToStatus(
    taskKey: string,
    targetStatusName: string,
  ): Promise<boolean> {
    try {
      const transitions = await this.getAvailableTransitions(taskKey);
      return transitions.some(
        (t) => t.toStatusName.toLowerCase() === targetStatusName.toLowerCase(),
      );
    } catch (error) {
      this.logger.error(
        `Failed to check transition possibility for task ${taskKey}:`,
        error.message,
      );
      return false;
    }
  }

  /**
   * Переместить задачу с проверкой правил
   */
  async moveTaskWithRules(
    options: TaskTransitionOptions,
    rules: TaskMovementRule[] = [],
  ): Promise<TransitionResult> {
    try {
      // Получить текущую задачу
      const currentTask = await this.jiraService.getTask(options.taskKey);
      const fromStatus = currentTask.fields.status.name;

      // Найти подходящее правило
      const applicableRule = rules.find(
        (rule) =>
          rule.fromColumn.toLowerCase() === fromStatus.toLowerCase() &&
          rule.toColumn.toLowerCase() ===
            options.targetStatusName.toLowerCase(),
      );

      // Проверить условия если есть правило
      if (applicableRule && applicableRule.requiredConditions) {
        const validationResult = await this.validateTransitionConditions(
          currentTask,
          applicableRule.requiredConditions,
        );

        if (!validationResult.isValid) {
          throw new Error(
            `Transition validation failed: ${validationResult.reason}`,
          );
        }
      }

      // Выполнить переход
      const transitionResult = await this.moveTaskToColumn(
        options.taskKey,
        options.targetStatusName,
        options.comment,
      );

      // Выполнить автоматические действия если есть правило
      if (
        applicableRule &&
        applicableRule.automaticActions &&
        transitionResult.success
      ) {
        await this.executeAutomaticActions(
          options.taskKey,
          applicableRule.automaticActions,
        );
      }

      return transitionResult;
    } catch (error) {
      this.logger.error(
        `Failed to move task with rules ${options.taskKey}:`,
        error.message,
      );
      return {
        success: false,
        taskKey: options.taskKey,
        fromStatus: 'unknown',
        toStatus: options.targetStatusName,
        error: error.message,
      };
    }
  }

  /**
   * Автоматически переместить готовые задачи в следующую колонку
   */
  async autoProgressReadyTasks(
    fromStatusName: string,
    toStatusName: string,
    columnMapping: BoardColumnMapping,
    maxTasks: number = 5,
  ): Promise<TransitionResult[]> {
    try {
      // Получить задачи из исходной колонки
      const fromConfig = Object.values(columnMapping).find((config) =>
        config.jiraStatusNames.includes(fromStatusName),
      );

      if (!fromConfig) {
        throw new Error(
          `Configuration not found for status: ${fromStatusName}`,
        );
      }

      // Найти задачи готовые к переходу (например, с определенными лейблами)
      const jql = `status = "${fromStatusName}" AND labels IN ("ready-for-next") ORDER BY created ASC`;
      const searchResult = await this.jiraService.searchTasks(jql, maxTasks);

      const taskKeys = searchResult.issues.map((issue) => issue.key);

      if (taskKeys.length === 0) {
        this.logger.log(`No ready tasks found in status "${fromStatusName}"`);
        return [];
      }

      // Переместить задачи
      const results = await this.moveMultipleTasksToColumn(
        taskKeys,
        toStatusName,
        `Automatically moved from ${fromStatusName} to ${toStatusName}`,
      );

      this.logger.log(
        `Auto-progressed ${results.filter((r) => r.success).length} tasks from "${fromStatusName}" to "${toStatusName}"`,
      );

      return results;
    } catch (error) {
      this.logger.error(
        `Failed to auto-progress tasks from "${fromStatusName}" to "${toStatusName}":`,
        error.message,
      );
      throw error;
    }
  }

  // Приватные методы

  private async validateTransitionConditions(
    task: any,
    conditions: TaskMovementRule['requiredConditions'],
  ): Promise<{ isValid: boolean; reason?: string }> {
    if (!conditions) {
      return { isValid: true };
    }

    if (conditions.hasAssignee && !task.fields.assignee) {
      return { isValid: false, reason: 'Task must have an assignee' };
    }

    if (
      conditions.hasDescription &&
      (!task.fields.description || task.fields.description.trim() === '')
    ) {
      return { isValid: false, reason: 'Task must have a description' };
    }

    if (conditions.hasLabels && conditions.hasLabels.length > 0) {
      const taskLabels = task.fields.labels || [];
      const hasRequiredLabels = conditions.hasLabels.every((requiredLabel) =>
        taskLabels.includes(requiredLabel),
      );

      if (!hasRequiredLabels) {
        return {
          isValid: false,
          reason: `Task must have labels: ${conditions.hasLabels.join(', ')}`,
        };
      }
    }

    if (conditions.minAge) {
      const createdDate = new Date(task.fields.created);
      const now = new Date();
      const ageInHours =
        (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);

      if (ageInHours < conditions.minAge) {
        return {
          isValid: false,
          reason: `Task must be at least ${conditions.minAge} hours old`,
        };
      }
    }

    return { isValid: true };
  }

  private async executeAutomaticActions(
    taskKey: string,
    actions: TaskMovementRule['automaticActions'],
  ): Promise<void> {
    if (!actions) return;

    try {
      // Добавить комментарий
      if (actions.addComment) {
        await this.jiraService.addComment(taskKey, {
          body: actions.addComment,
        });
      }

      // Назначить исполнителя
      if (actions.assignTo) {
        // TODO: Реализовать обновление assignee через JiraService
        this.logger.log(`Would assign task ${taskKey} to ${actions.assignTo}`);
      }

      // Добавить/удалить лейблы
      if (actions.addLabels || actions.removeLabels) {
        // TODO: Реализовать обновление лейблов через JiraService
        this.logger.log(`Would update labels for task ${taskKey}`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to execute automatic actions for task ${taskKey}:`,
        error.message,
      );
      // Не бросаем ошибку, так как основной переход уже выполнен
    }
  }
}
