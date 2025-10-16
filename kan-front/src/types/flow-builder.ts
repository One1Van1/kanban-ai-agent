// Types for Visual Flow Builder
export interface FlowNodeData {
  type: string;
  name: string;
  config: Record<string, any>;
}

export interface FlowNode {
  id: string;
  type: 'trigger' | 'context' | 'logic' | 'action' | 'wait';
  position: { x: number; y: number };
  data: FlowNodeData;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: any;
}

// Trigger Block Types
export interface TriggerBlock {
  id: string;
  type:
    | 'board_move'
    | 'board_create'
    | 'board_update'
    | 'webhook'
    | 'time_based';
  name: string;
  config: {
    // Универсальные настройки досок
    boardType:
      | 'jira'
      | 'trello'
      | 'asana'
      | 'notion'
      | 'monday'
      | 'clickup'
      | 'generic';
    boardConnection?: string; // ID подключения к доске

    // События
    event:
      | 'card_moved'
      | 'card_created'
      | 'card_updated'
      | 'card_assigned'
      | 'card_completed';

    // Условия триггера
    sourceColumn?: string; // Из какой колонки
    targetColumn?: string; // В какую колонку

    // Дополнительные условия
    conditions?: {
      assignee?: string;
      priority?: string;
      labels?: string[];
      cardType?: string;
      customFields?: Record<string, any>;
    };

    // Для webhook триггеров
    webhookUrl?: string;
    webhookSecret?: string;

    // Для time-based триггеров
    schedule?: {
      type: 'interval' | 'cron' | 'once';
      expression: string; // cron expression или interval
      timezone?: string;
    };
  };
}

// Context Block Types
export interface ContextBlock {
  id: string;
  type: 'extract_files' | 'get_card_data' | 'external_api' | 'variable';
  name: string;
  config: {
    variableName: string;
    source: 'card_attachments' | 'card_fields' | 'api_call';
    filter?: {
      uploadedBy?: string;
      fileType?: string[];
      dateRange?: [Date, Date];
    };
  };
}

// Logic Block Types
export interface LogicBlock {
  id: string;
  type: 'if_else' | 'switch' | 'loop' | 'try_catch' | 'ai_result';
  name: string;
  config: {
    condition: {
      variable: string;
      operator: 'exists' | 'empty' | 'equals' | 'contains' | 'greater' | 'less';
      value?: any;
    };
    trueBranch?: string[]; // IDs следующих блоков
    falseBranch?: string[]; // IDs следующих блоков
    // For ai_result type
    responseVariable?: string;
  };
}

// Action Block Types
export interface ActionBlock {
  id: string;
  type:
    | 'comment'
    | 'ai_request'
    | 'create_file'
    | 'attach_file'
    | 'send_notification';
  name: string;
  config: {
    // Для комментариев
    commentText?: string;

    // Для AI запросов
    aiModel?: 'claude' | 'gpt' | 'gemini';
    prompt?: string;
    // attachments references variable names that contain file lists (e.g. extracted card attachments)
    attachments?: string[]; // variable names with files
    // name of variable where AI response (text) will be stored
    outputVariable?: string;

    // Для файлов
    fileName?: string;
    fileContent?: string;
    fileFormat?: 'docx' | 'pdf' | 'txt' | 'xlsx';

    // Для уведомлений
    recipient?: string;
    message?: string;
  };
}

// Wait Block Types
export interface WaitBlock {
  id: string;
  type: 'wait_response' | 'wait_time' | 'wait_condition';
  name: string;
  config: {
    waitFor: 'ai_response' | 'user_action' | 'time_delay';
    timeout?: number;
    onSuccess?: string[]; // IDs следующих блоков
    onError?: string[]; // IDs следующих блоков
    onTimeout?: string[]; // IDs следующих блоков
    // variable containing awaited data (e.g. AI response text) for subsequent branching
    responseVariable?: string;
  };
}

// Flow Definition
export interface FlowDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  created: Date;
  updated: Date;
  agentId?: string; // ID связанного агента
  triggers: TriggerBlock[];
  blocks: (ContextBlock | LogicBlock | ActionBlock | WaitBlock)[];
  connections: FlowConnection[];
  variables: FlowVariable[];
  settings: FlowSettings;
}

// Flow Connections
export interface FlowConnection {
  id: string;
  from: string;
  to: string;
  // condition identifies which output path of the source block this connection represents
  // For logic blocks: 'true' | 'false'
  // For wait/AI blocks: 'success' | 'error' | 'timeout' | 'text' | 'empty'
  // 'text' / 'empty' allow branching based on AI response content presence
  condition?:
    | 'true'
    | 'false'
    | 'success'
    | 'error'
    | 'timeout'
    | 'text'
    | 'empty';
  label?: string;
}

// Flow Variables
export interface FlowVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'file';
  defaultValue?: any;
  description?: string;
}

// Flow Settings
export interface FlowSettings {
  timeout: number;
  retryAttempts: number;
  errorHandling: 'stop' | 'continue' | 'retry';
  logging: 'minimal' | 'detailed' | 'debug';
}

// Flow Execution
export interface FlowExecution {
  id: string;
  flowId: string;
  status: 'running' | 'completed' | 'failed' | 'paused' | 'cancelled';
  currentBlock: string;
  variables: Record<string, any>;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  logs: FlowExecutionLog[];
}

export interface FlowExecutionLog {
  timestamp: Date;
  blockId: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
}

// Block Palette
export interface BlockPaletteItem {
  type: string;
  category: 'trigger' | 'context' | 'logic' | 'action' | 'wait';
  name: string;
  description: string;
  icon: string;
  color: string;
  defaultConfig: any;
}

// Flow Builder State
export interface FlowBuilderState {
  flow: FlowDefinition | null;
  selectedBlock: string | null;
  isPropertiesPanelOpen: boolean;
  isSidebarOpen: boolean;
  executionHistory: FlowExecution[];
  variables: Record<string, any>;
}
