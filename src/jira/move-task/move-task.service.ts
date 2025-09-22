import { Injectable } from '@nestjs/common';
import { JiraBaseService } from '../shared/jira-base.service';
import { MoveTaskResponse } from './move-task.interface';
import { StatusTransition } from '../types/kanban-column.interface';

@Injectable()
export class MoveTaskService extends JiraBaseService {
  /**
   * Переместить задачу в другую колонку по имени статуса
   */
  async moveTaskToColumn(
    taskKey: string,
    targetStatusName: string,
    comment?: string,
  ): Promise<MoveTaskResponse> {
    try {
      // Получить текущую задачу для определения исходного статуса
      const currentTask = await this.getTask(taskKey);
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
        await this.transitionTask(taskKey, targetTransition.id);
      } catch (error) {
        transitionError = error;
        this.logger.warn(
          `Transition API returned error, but checking if task actually moved: ${error.message}`,
        );
      }

      // Проверить, действительно ли задача переместилась
      const updatedTask = await this.getTask(taskKey);
      const actualStatus = updatedTask.fields.status.name;

      // Добавить комментарий если указан и переход успешен
      if (
        comment &&
        actualStatus.toLowerCase() === targetStatusName.toLowerCase()
      ) {
        try {
          await this.addComment(taskKey, { body: comment });
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
          message:
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
        message: error.message,
      };
    }
  }

  /**
   * Получить все доступные переходы для задачи
   */
  async getAvailableTransitions(taskKey: string): Promise<StatusTransition[]> {
    try {
      const currentTask = await this.getTask(taskKey);
      const transitionsResponse = await this.getTaskTransitions(taskKey);

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
}
