/**
 * Интерфейсы для нового webhook обработчика анализа отчётов по стрижкам
 */

export interface JiraWebhookUser {
  accountId: string;
  displayName: string;
  emailAddress: string;
}

export interface JiraWebhookStatus {
  id: string;
  name: string;
  statusCategory: {
    id: number;
    key: string;
    name: string;
  };
}

export interface JiraWebhookIssueFields {
  summary: string;
  description?: string;
  status: JiraWebhookStatus;
  assignee?: JiraWebhookUser;
  created: string;
  updated: string;
  timetracking?: {
    timeSpentSeconds: number;
    remainingEstimateSeconds?: number;
  };
  worklog?: {
    worklogs: Array<{
      id: string;
      timeSpentSeconds: number;
      started: string;
      comment?: string;
    }>;
  };
  comment?: {
    comments: Array<{
      id: string;
      body: string;
      created: string;
      updated: string;
      author: JiraWebhookUser;
    }>;
  };
}

export interface JiraWebhookIssue {
  id: string;
  key: string;
  self: string;
  fields: JiraWebhookIssueFields;
}

export interface JiraWebhookChangelogItem {
  field: string;
  fieldtype: string;
  fromString?: string;
  toString?: string;
}

export interface JiraWebhookChangelog {
  id: string;
  items: JiraWebhookChangelogItem[];
}

export interface JiraWebhookComment {
  id: string;
  body: string;
  created: string;
  updated: string;
  author: JiraWebhookUser;
}

/**
 * Основная структура Jira вебхука для анализа отчётов
 */
export interface HaircutReportWebhookPayload {
  // Основная информация о событии
  webhookEvent: string;
  issue_event_type_name?: string;

  // Пользователь, инициировавший событие
  user?: JiraWebhookUser;

  // Информация о задаче
  issue?: JiraWebhookIssue;

  // История изменений (для событий обновления)
  changelog?: JiraWebhookChangelog;

  // Комментарий (для событий комментирования)
  comment?: JiraWebhookComment;

  // Метаданные
  timestamp: number;
}

/**
 * Ответ от обработчика webhook'а для анализа отчётов
 */
export interface HaircutReportWebhookResponse {
  success: boolean;
  message: string;
  issueKey?: string;
  actions: string[]; // действия, которые были выполнены
  analysisResult?: {
    success: boolean;
    requiresQuestion: boolean;
    finalReport?: string;
    agentComment?: string;
    price?: {
      finalPrice: number;
      category: string;
    };
  };
  processingTimeMs: number;
  timestamp: string;
}

/**
 * События, которые обрабатывает webhook
 */
export enum HaircutWebhookEvent {
  ISSUE_UPDATED = 'jira:issue_updated',
  COMMENT_CREATED = 'comment_created',
  COMMENT_UPDATED = 'comment_updated',
}

/**
 * Статусы задач, которые нас интересуют
 */
export enum TaskStatus {
  REVIEW = 'Review',
  QUESTIONS = 'Questions',
  DONE = 'Done',
}

/**
 * Типы изменений в задаче
 */
export enum ChangeType {
  STATUS_CHANGE = 'status',
  COMMENT_ADDED = 'comment',
  WORKLOG_UPDATED = 'worklog',
}

/**
 * Конфигурация для обработки webhook'ов
 */
export interface HaircutWebhookConfig {
  enableSignatureValidation: boolean;
  webhookSecret?: string;
  targetStatuses: TaskStatus[];
  haircutKeywords: string[];
  delayMs: number;
}

/**
 * Простой интерфейс ответа webhook
 */
export interface WebhookResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

/**
 * Специфичный интерфейс для анализа стрижек
 */
export interface HaircutAnalysisData {
  taskKey: string;
  category?: string;
  timeSpent?: number;
  price?: number;
  questions?: string[];
  masterName?: string;
}
