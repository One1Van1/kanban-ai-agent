/**
 * Интерфейсы для обработки Jira вебхуков с фото "ДО/ПОСЛЕ"
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

export interface JiraWebhookAttachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  content: string; // URL для скачивания
  thumbnail?: string;
  created: string;
  author: JiraWebhookUser;
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
  attachment?: JiraWebhookAttachment[];
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
 * Основная структура Jira вебхука для новой системы
 */
export interface JiraWebhookPayload {
  // Основная информация о событии
  webhookEvent: string; // например: "jira:issue_updated"
  issue_event_type_name?: string; // например: "issue_updated"

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
 * Конфигурация обработки webhook'ов для новой системы
 */
export interface WebhookProcessingConfig {
  // Основные настройки
  enableBeforeAfterAnalysis: boolean; // Включить анализ фото ДО/ПОСЛЕ
  enableTimeTracking: boolean; // Включить анализ времени работы
  enableAutoComments: boolean; // Автоматические комментарии

  // Статусы для обработки
  triggerStatuses: string[]; // Статусы, которые запускают обработку
  completionStatuses: string[]; // Статусы завершения работы

  // Ключевые слова для определения задач стрижки
  haircutKeywords: string[];

  // Временные настройки
  processingDelayMs: number; // Задержка перед обработкой
  timeoutMs: number; // Таймаут обработки одной задачи

  // Настройки фотографий
  photoAnalysis: {
    minPhotos: number; // Минимум фото для анализа
    maxPhotos: number; // Максимум фото для анализа
    supportedFormats: string[]; // Поддерживаемые форматы
    maxFileSize: number; // Максимальный размер файла в байтах
  };
}

/**
 * Результат обработки webhook'а
 */
export interface WebhookProcessingResult {
  success: boolean;
  message: string;
  taskKey: string;
  triggeredActions: string[];
  processingTimeMs: number;
  timestamp: string;

  // Детали обработки
  photoAnalysis?: {
    processed: boolean;
    photosFound: number;
    analysisResult?: any;
    error?: string;
  };

  timeTracking?: {
    processed: boolean;
    totalMinutes: number;
    efficiency: string;
    error?: string;
  };

  combinedAnalysis?: {
    processed: boolean;
    overallScore: number;
    summary: string;
    error?: string;
  };

  jiraComment?: {
    added: boolean;
    commentId?: string;
    error?: string;
  };

  errors: string[];
}

/**
 * Типы событий для обработки
 */
export enum WebhookEventType {
  ISSUE_UPDATED = 'jira:issue_updated',
  ATTACHMENT_ADDED = 'attachment_created',
  STATUS_CHANGED = 'status_changed',
  COMMENT_CREATED = 'comment_created',
}

/**
 * Типы действий системы
 */
export enum ProcessingAction {
  ANALYZE_PHOTOS = 'analyze_photos',
  TRACK_TIME = 'track_time',
  COMBINED_ANALYSIS = 'combined_analysis',
  ADD_COMMENT = 'add_comment',
  SKIP_PROCESSING = 'skip_processing',
}

/**
 * Условия для запуска обработки
 */
export interface ProcessingTriggerConditions {
  hasHaircutKeywords: boolean; // Содержит ключевые слова стрижки
  hasRequiredStatus: boolean; // Нужный статус
  hasPhotos: boolean; // Есть прикрепленные фото
  hasMinimumPhotos: boolean; // Достаточно фото для анализа
  isValidTask: boolean; // Валидная задача для обработки
}

/**
 * Метрики производительности webhook'ов
 */
export interface WebhookMetrics {
  totalProcessed: number;
  successfulProcessed: number;
  failedProcessed: number;
  averageProcessingTimeMs: number;

  // Детальные метрики
  triggerConditions: {
    haircutTasksDetected: number;
    statusTriggersMatched: number;
    photoRequirementsMet: number;
    skippedTasks: number;
  };

  processingResults: {
    photoAnalysisSuccess: number;
    timeTrackingSuccess: number;
    combinedAnalysisSuccess: number;
    jiraCommentsAdded: number;
  };

  errors: {
    validationErrors: number;
    processingErrors: number;
    externalServiceErrors: number;
    timeoutErrors: number;
  };

  lastProcessedAt?: Date;
}

/**
 * Состояние обработки webhook'а
 */
export interface WebhookProcessingState {
  taskKey: string;
  webhookId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;

  steps: {
    validation: 'pending' | 'processing' | 'completed' | 'failed';
    photoAnalysis:
      | 'pending'
      | 'processing'
      | 'completed'
      | 'failed'
      | 'skipped';
    timeTracking: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
    combinedAnalysis:
      | 'pending'
      | 'processing'
      | 'completed'
      | 'failed'
      | 'skipped';
    commentAdding:
      | 'pending'
      | 'processing'
      | 'completed'
      | 'failed'
      | 'skipped';
  };

  triggerConditions: ProcessingTriggerConditions;
  result?: WebhookProcessingResult;
  errors: string[];
}

/**
 * Health check для webhook сервиса
 */
export interface WebhookHealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;

  services: {
    jiraApi: boolean;
    photoAnalysis: boolean;
    timeTracking: boolean;
    processBeforeAfter: boolean;
  };

  metrics: WebhookMetrics;

  configuration: {
    triggerStatuses: string[];
    haircutKeywords: number;
    photoRequirements: {
      minPhotos: number;
      maxFileSize: string;
    };
  };

  recentActivity: {
    lastWebhookReceived?: Date;
    lastSuccessfulProcessing?: Date;
    activeProcessingCount: number;
    queuedWebhooksCount: number;
  };

  errors: string[];
}
