/**
 * Интерфейсы для обработки Jira вебхуков
 */

export interface JiraWebhookUser {
  accountId: string;
  displayName: string;
  emailAddress: string;
  avatarUrls?: {
    '16x16': string;
    '24x24': string;
    '32x32': string;
    '48x48': string;
  };
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
  reporter?: JiraWebhookUser;
  created: string;
  updated: string;
  labels?: string[];
  components?: Array<{
    id: string;
    name: string;
  }>;
  priority?: {
    id: string;
    name: string;
  };
  issuetype: {
    id: string;
    name: string;
    iconUrl: string;
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
  fieldId?: string;
  from?: string;
  fromString?: string;
  to?: string;
  toString?: string;
}

export interface JiraWebhookChangelog {
  id: string;
  items: JiraWebhookChangelogItem[];
}

export interface JiraWebhookComment {
  id: string;
  author: JiraWebhookUser;
  body: string;
  created: string;
  updated: string;
}

/**
 * Основная структура Jira вебхука
 */
export interface JiraWebhookPayload {
  // Основная информация о событии
  webhookEvent: string; // например: "jira:issue_created", "jira:issue_updated"
  issue_event_type_name?: string; // например: "issue_created", "issue_updated"

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
 * Ответ от обработчика вебхука
 */
export interface WebhookResponse {
  success: boolean;
  message: string;
  triggeredActions: string[];
  timestamp: string;
  issueKey?: string;
  processingTimeMs?: number;
}

/**
 * Конфигурация для обработки вебхуков
 */
export interface WebhookProcessingConfig {
  enableAiAnalysis: boolean;
  enableNotifications: boolean;
  enableAutoAssignment: boolean;
  haircutKeywords: string[];
  delayMs: number; // Задержка перед обработкой
}

/**
 * Результат анализа задачи AI агентом
 */
export interface AiAnalysisResult {
  isHaircutTask: boolean;
  confidence: number;
  recommendedActions: string[];
  suggestedAssignee?: string;
  estimatedDuration?: string;
  tags: string[];
}

/**
 * События, которые могут быть обработаны
 */
export enum JiraWebhookEvent {
  ISSUE_CREATED = 'jira:issue_created',
  ISSUE_UPDATED = 'jira:issue_updated',
  ISSUE_DELETED = 'jira:issue_deleted',
  COMMENT_CREATED = 'comment_created',
  COMMENT_UPDATED = 'comment_updated',
  COMMENT_DELETED = 'comment_deleted',
  WORKLOG_UPDATED = 'worklog_updated',
}

/**
 * Типы действий, которые может выполнить AI агент
 */
export enum AIAgentAction {
  ANALYZE_NEW_TASK = 'analyze-new-task',
  ANALYZE_HAIRCUT_TASK = 'analyze-haircut-task',
  CHECK_PROGRESS = 'check-progress',
  AUTO_ASSIGNMENT = 'auto-assignment',
  SEND_NOTIFICATION = 'send-notification',
  UPDATE_TASK_METADATA = 'update-task-metadata',
}
