import {
  BoardType,
  BoardConfig,
  TaskMapping,
  BoardSyncResult,
} from './board-integration.interface';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  assignee?: string;
  priority?: string;
  dueDate?: Date;
  labels?: string[];
  comments?: TaskComment[];
  createdAt: Date;
  updatedAt: Date;
  externalId?: string; // ID во внешней системе
  externalUrl?: string; // Ссылка на задачу во внешней системе
}

export interface TaskComment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  columns: BoardColumn[];
  externalId?: string;
  externalUrl?: string;
}

export interface BoardColumn {
  id: string;
  name: string;
  position: number;
  tasks?: Task[];
  externalId?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  assignee?: string;
  priority?: string;
  dueDate?: Date;
  labels?: string[];
  columnId?: string;
}

export interface UpdateTaskRequest {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  assignee?: string;
  priority?: string;
  dueDate?: Date;
  labels?: string[];
}

/**
 * Базовый интерфейс для всех интеграций с досками
 * Каждая интеграция (Jira, Trello, Linear и т.д.) должна реализовать этот интерфейс
 */
export interface IBoardIntegrationService {
  /**
   * Тип доски, который поддерживает этот сервис
   */
  readonly supportedBoardType: BoardType;

  /**
   * Проверка подключения к внешней системе
   */
  testConnection(config: BoardConfig): Promise<boolean>;

  /**
   * Получение списка досок/проектов
   */
  getBoards(config: BoardConfig): Promise<Board[]>;

  /**
   * Получение конкретной доски с колонками
   */
  getBoard(config: BoardConfig, boardId: string): Promise<Board>;

  /**
   * Получение всех задач с доски
   */
  getTasks(config: BoardConfig, boardId?: string): Promise<Task[]>;

  /**
   * Получение конкретной задачи
   */
  getTask(config: BoardConfig, taskId: string): Promise<Task>;

  /**
   * Создание новой задачи
   */
  createTask(config: BoardConfig, task: CreateTaskRequest): Promise<Task>;

  /**
   * Обновление существующей задачи
   */
  updateTask(config: BoardConfig, task: UpdateTaskRequest): Promise<Task>;

  /**
   * Удаление задачи
   */
  deleteTask(config: BoardConfig, taskId: string): Promise<boolean>;

  /**
   * Перемещение задачи между колонками/статусами
   */
  moveTask(
    config: BoardConfig,
    taskId: string,
    newStatus: string,
  ): Promise<Task>;

  /**
   * Добавление комментария к задаче
   */
  addComment(
    config: BoardConfig,
    taskId: string,
    comment: string,
  ): Promise<TaskComment>;

  /**
   * Синхронизация данных с внешней системой
   */
  syncData(config: BoardConfig, boardId?: string): Promise<BoardSyncResult>;

  /**
   * Получение маппинга полей для данного типа доски
   */
  getTaskMapping(): TaskMapping;

  /**
   * Валидация конфигурации для данного типа доски
   */
  validateConfig(
    config: BoardConfig,
  ): Promise<{ valid: boolean; errors: string[] }>;
}
