import { TaskStatus, Priority, AIDecision } from './enums';

/**
 * Основная модель задачи
 */
export interface Task {
  /** Уникальный ID задачи в нашей системе */
  id: string;

  /** Название задачи */
  title: string;

  /** Описание задачи */
  description: string;

  /** Текущий статус задачи */
  status: TaskStatus;

  /** Приоритет задачи */
  priority?: Priority;

  /** Метки/теги задачи */
  labels?: string[];

  /** Исполнитель задачи */
  assignee?: string;

  /** Дата создания */
  createdAt: Date;

  /** Дата последнего обновления */
  updatedAt: Date;

  /** ID канбан-системы (Jira instance) */
  kanbanSystemId: string;

  /** ID задачи в канбан-системе */
  kanbanTaskId: string;

  /** URL задачи в канбан-системе */
  kanbanUrl?: string;
}

/**
 * Данные для анализа AI
 */
export interface TaskAnalysisRequest {
  /** Название задачи */
  title: string;

  /** Описание задачи */
  description: string;

  /** Дополнительный контекст */
  context?: string;

  /** Приоритет (если указан) */
  priority?: Priority;

  /** Метки задачи */
  labels?: string[];
}

/**
 * Результат анализа AI
 */
export interface AIAnalysisResult {
  /** Принятое решение */
  decision: AIDecision;

  /** Обоснование решения */
  reasoning: string;

  /** Вопросы для уточнения (если decision = QUESTIONS) */
  questions?: string[];

  /** Уровень уверенности (0-1) */
  confidence: number;

  /** Предлагаемые действия */
  suggestedActions?: string[];
}

/**
 * Конфигурация канбан-системы
 */
export interface KanbanConfig {
  /** Тип системы */
  type: 'jira';

  /** URL инстанса */
  baseUrl: string;

  /** Учетные данные */
  credentials: {
    email: string;
    apiToken: string;
  };

  /** ID проекта */
  projectId: string;

  /** Маппинг статусов */
  statusMapping: {
    [key in TaskStatus]: string;
  };
}
