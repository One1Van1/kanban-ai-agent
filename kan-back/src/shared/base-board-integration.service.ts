import {
  BoardType,
  BoardConfig,
  TaskMapping,
  BoardSyncResult,
} from '../types/board-integration.interface';
import {
  IBoardIntegrationService,
  Task,
  Board,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskComment,
} from '../types/board-service.interface';

export abstract class BaseBoardIntegrationService
  implements IBoardIntegrationService
{
  abstract readonly supportedBoardType: BoardType;

  /**
   * Базовая валидация конфигурации
   */
  async validateConfig(
    config: BoardConfig,
  ): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!config) {
      errors.push('Configuration is required');
      return { valid: false, errors };
    }

    // Дополнительная валидация будет выполнена в наследниках
    const specificValidation = await this.validateSpecificConfig(config);
    errors.push(...specificValidation.errors);

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Специфичная для типа доски валидация конфигурации
   * Должна быть реализована в наследниках
   */
  protected abstract validateSpecificConfig(
    config: BoardConfig,
  ): Promise<{ valid: boolean; errors: string[] }>;

  /**
   * Базовый маппинг полей задач
   * Может быть переопределен в наследниках
   */
  getTaskMapping(): TaskMapping {
    return {
      boardType: this.supportedBoardType,
      fieldMappings: {
        id: 'id',
        title: 'title',
        description: 'description',
        status: 'status',
        assignee: 'assignee',
        priority: 'priority',
        dueDate: 'dueDate',
        labels: 'labels',
        comments: 'comments',
      },
      statusMappings: {
        'to-do': 'To Do',
        'in-progress': 'In Progress',
        review: 'Review',
        done: 'Done',
      },
    };
  }

  /**
   * Базовый обработчик ошибок API
   */
  protected handleApiError(error: any, operation: string): never {
    const message =
      error.response?.data?.message || error.message || 'Unknown error';
    throw new Error(
      `${this.supportedBoardType} API Error (${operation}): ${message}`,
    );
  }

  /**
   * Логирование операций
   */
  protected logOperation(operation: string, details?: any): void {
    console.log(
      `[${this.supportedBoardType}] ${operation}`,
      details ? JSON.stringify(details, null, 2) : '',
    );
  }

  /**
   * Нормализация задачи из внешнего формата в наш внутренний формат
   */
  protected abstract normalizeTask(externalTask: any): Task;

  /**
   * Преобразование нашей задачи во внешний формат
   */
  protected abstract denormalizeTask(
    task: CreateTaskRequest | UpdateTaskRequest,
  ): any;

  // Абстрактные методы, которые должны быть реализованы в наследниках
  abstract testConnection(config: BoardConfig): Promise<boolean>;
  abstract getBoards(config: BoardConfig): Promise<Board[]>;
  abstract getBoard(config: BoardConfig, boardId: string): Promise<Board>;
  abstract getTasks(config: BoardConfig, boardId?: string): Promise<Task[]>;
  abstract getTask(config: BoardConfig, taskId: string): Promise<Task>;
  abstract createTask(
    config: BoardConfig,
    task: CreateTaskRequest,
  ): Promise<Task>;
  abstract updateTask(
    config: BoardConfig,
    task: UpdateTaskRequest,
  ): Promise<Task>;
  abstract deleteTask(config: BoardConfig, taskId: string): Promise<boolean>;
  abstract moveTask(
    config: BoardConfig,
    taskId: string,
    newStatus: string,
  ): Promise<Task>;
  abstract addComment(
    config: BoardConfig,
    taskId: string,
    comment: string,
  ): Promise<TaskComment>;
  abstract syncData(
    config: BoardConfig,
    boardId?: string,
  ): Promise<BoardSyncResult>;
}
