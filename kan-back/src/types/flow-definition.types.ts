/**
 * Типы для Flow Definition
 * Используются для строгой типизации JSONB полей в Flow Entity
 */

// ============================================
// BLOCKS - Типы блоков
// ============================================

/**
 * Базовый интерфейс для всех блоков
 */
export interface BaseBlockData {
  id: string;
  type: 'trigger' | 'context' | 'logic' | 'action' | 'wait';
  blockType: string; // Конкретный тип блока (board_move, ai_request, etc.)
  position: {
    x: number;
    y: number;
  };
  name: string;
  config: Record<string, any>;
}

/**
 * Trigger блоки - запуск flow
 */
export interface TriggerBlockData extends BaseBlockData {
  type: 'trigger';
  blockType:
    | 'board_move'
    | 'board_create'
    | 'board_update'
    | 'webhook'
    | 'time_based';
  config: {
    boardType?:
      | 'jira'
      | 'trello'
      | 'asana'
      | 'notion'
      | 'monday'
      | 'clickup'
      | 'generic';
    boardConnection?: string;
    event?:
      | 'card_moved'
      | 'card_created'
      | 'card_updated'
      | 'card_assigned'
      | 'card_completed';
    sourceColumn?: string;
    targetColumn?: string;
    columnName?: string; // Legacy support
    conditions?: {
      assignee?: string;
      priority?: string;
      labels?: string[];
      cardType?: string;
      customFields?: Record<string, any>;
    };
    webhookUrl?: string;
    webhookSecret?: string;
    schedule?: {
      type: 'interval' | 'cron' | 'once';
      expression: string;
      timezone?: string;
    };
    [key: string]: any;
  };
}

/**
 * Context блоки - получение данных
 */
export interface ContextBlockData extends BaseBlockData {
  type: 'context';
  blockType: 'extract_files' | 'get_card_data' | 'external_api' | 'variable';
  config: {
    variableName?: string;
    source?: 'card_attachments' | 'card_fields' | 'api_call';
    filter?: {
      uploadedBy?: string;
      fileType?: string[];
      dateRange?: [Date, Date];
    };
    [key: string]: any;
  };
}

/**
 * Logic блоки - условия и ветвления
 */
export interface LogicBlockData extends BaseBlockData {
  type: 'logic';
  blockType: 'if_else' | 'switch' | 'loop' | 'try_catch' | 'ai_result';
  config: {
    condition?: {
      variable: string;
      operator: 'exists' | 'empty' | 'equals' | 'contains' | 'greater' | 'less';
      value?: any;
    };
    trueBranch?: string[];
    falseBranch?: string[];
    responseVariable?: string;
    [key: string]: any;
  };
}

/**
 * Action блоки - действия
 */
export interface ActionBlockData extends BaseBlockData {
  type: 'action';
  blockType:
    | 'comment'
    | 'ai_request'
    | 'create_file'
    | 'attach_file'
    | 'send_notification'
    | 'update_card'
    | 'move_card';
  config: {
    // Комментарии
    commentText?: string;
    message?: string;

    // AI запросы
    aiModel?: 'claude' | 'gpt' | 'gemini';
    prompt?: string;
    attachments?: string[];
    outputVariable?: string;

    // Файлы
    fileName?: string;
    fileContent?: string;
    fileFormat?: 'docx' | 'pdf' | 'txt' | 'xlsx';

    // Уведомления
    recipient?: string;
    channel?: 'email' | 'telegram' | 'slack';

    // Обновление карточек
    field?: string;
    value?: any;

    [key: string]: any;
  };
}

/**
 * Wait блоки - ожидание
 */
export interface WaitBlockData extends BaseBlockData {
  type: 'wait';
  blockType: 'wait_response' | 'wait_time' | 'wait_condition';
  config: {
    waitFor?: 'ai_response' | 'user_action' | 'time_delay';
    timeout?: number;
    onSuccess?: string[];
    onError?: string[];
    onTimeout?: string[];
    responseVariable?: string;
    [key: string]: any;
  };
}

/**
 * Union тип для всех блоков
 */
export type FlowBlockData =
  | TriggerBlockData
  | ContextBlockData
  | LogicBlockData
  | ActionBlockData
  | WaitBlockData;

// ============================================
// CONNECTIONS - Типы соединений
// ============================================

/**
 * Соединение между блоками
 */
export interface FlowConnectionData {
  id: string;
  // Поддержка legacy и нового формата
  from?: string; // Legacy
  to?: string; // Legacy
  source: string; // Новый формат (обязательное)
  target: string; // Новый формат (обязательное)
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  condition?:
    | 'true'
    | 'false'
    | 'success'
    | 'error'
    | 'timeout'
    | 'text'
    | 'empty';
  metadata?: {
    branchType?: 'trueBranch' | 'falseBranch' | 'errorBranch' | 'successBranch';
    executionOrder?: number;
    isConditional?: boolean;
  };
}

// ============================================
// TRIGGERS - Типы триггеров
// ============================================

/**
 * Триггер для запуска flow
 */
export interface FlowTriggerData {
  id?: string;
  type:
    | 'board_move'
    | 'board_create'
    | 'board_update'
    | 'webhook'
    | 'time_based';
  config: {
    targetColumn?: string;
    columnName?: string; // Legacy
    boardId?: string;
    boardType?: string;
    event?: string;
    sourceColumn?: string;
    conditions?: Record<string, any>;
    [key: string]: any;
  };
}

// ============================================
// VARIABLES - Типы переменных
// ============================================

/**
 * Переменная flow
 */
export interface FlowVariableData {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'file';
  defaultValue?: any;
  description?: string;
}

// ============================================
// SETTINGS - Настройки flow
// ============================================

/**
 * Настройки выполнения flow
 */
export interface FlowSettingsData {
  timeout?: number;
  retryAttempts?: number;
  errorHandling?: 'stop' | 'continue' | 'retry';
  logging?: 'minimal' | 'detailed' | 'debug';
  [key: string]: any;
}

// ============================================
// METADATA - Метаданные для конвертации
// ============================================

/**
 * Метаданные для конвертации Flow → Agent
 */
export interface FlowConversionMetadata {
  // Порядок выполнения блоков (топологически отсортированный)
  executionOrder?: string[];

  // Информация о ветвлениях
  conditionalBranches?: {
    [blockId: string]: {
      trueBranch?: string[];
      falseBranch?: string[];
      errorBranch?: string[];
      successBranch?: string[];
    };
  };

  // Граф зависимостей
  dependencies?: {
    [blockId: string]: string[]; // Блоки, от которых зависит данный блок
  };

  // Уровни выполнения (для параллельного выполнения)
  executionLevels?: string[][];

  // Точки входа (обычно триггеры)
  entryPoints?: string[];

  // Точки выхода (последние блоки)
  exitPoints?: string[];

  // Дополнительная информация
  analysisVersion?: string;
  analyzedAt?: string;
}

// ============================================
// FLOW DEFINITION - Полное определение flow
// ============================================

/**
 * Полное определение Flow (хранится в JSONB)
 */
export interface FlowDefinitionData {
  // Основные данные (legacy support)
  id?: string;
  name?: string;
  description?: string;

  // Блоки
  blocks: FlowBlockData[];

  // Соединения (поддержка legacy и нового формата)
  edges?: FlowConnectionData[]; // Legacy
  connections?: FlowConnectionData[]; // Новый формат

  // Триггеры
  triggers: FlowTriggerData[];

  // Переменные
  variables?: FlowVariableData[];

  // Настройки
  settings?: FlowSettingsData;

  // Метаданные для конвертации
  metadata?: FlowConversionMetadata;
}

// ============================================
// HELPER TYPES - Вспомогательные типы
// ============================================

/**
 * Результат анализа Flow
 */
export interface FlowAnalysisResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  statistics: {
    totalBlocks: number;
    totalConnections: number;
    triggerCount: number;
    actionCount: number;
    logicCount: number;
    maxDepth: number;
    hasCycles: boolean;
  };
  executionGraph: FlowConversionMetadata;
}

/**
 * Конфигурация для конвертации
 */
export interface ConversionConfig {
  validateBeforeConvert?: boolean;
  includeMetadata?: boolean;
  preserveBlockIds?: boolean;
  generateComments?: boolean;
  optimizeInstructions?: boolean;
}
