// Types for Visual Flow Builder

// ===========================
// SHARED INTERFACES
// ===========================

/**
 * Universal interface for blocks that can save their output to a variable
 * Can be embedded in any block type (Trigger, Context, Logic, Action, Wait)
 */
export interface WithVariableStorage {
  saveToVariable?: boolean;
  variableName?: string;
}

/**
 * Universal interface for async operations (AI, API, MCP)
 * Controls waiting behavior and timeout handling
 */
export interface WithAsyncControl {
  waitForResponse?: boolean; // Default: true
  timeout?: number; // Default: 30
  timeoutUnit?: 'seconds' | 'minutes' | 'hours'; // Default: 'seconds'
  onTimeout?: 'fail' | 'continue' | 'retry'; // Default: 'fail'
}

// ===========================
// FLOW NODE TYPES
// ===========================

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
  type: // UNIVERSAL TRIGGERS - removed board-specific triggers
  | 'webhook' // HTTP webhook trigger
    | 'schedule' // Time-based trigger (cron/interval)
    | 'event_listener' // Generic event listener
    | 'manual_trigger'; // Manual flow execution
  name: string;
  config: {
    // ===========================
    // WEBHOOK TRIGGER CONFIG
    // ===========================
    webhookUrl?: string;
    webhookSecret?: string;
    webhookMethod?: 'POST' | 'GET' | 'PUT' | 'PATCH';
    webhookHeaders?: Record<string, string>;
    webhookPayloadSchema?: string; // JSON schema for validation

    // ===========================
    // SCHEDULE TRIGGER CONFIG
    // ===========================
    schedule?: {
      type: 'interval' | 'cron' | 'once';
      expression: string; // cron expression or interval (e.g., "*/5 * * * *" or "5m")
      timezone?: string;
      startDate?: Date;
      endDate?: Date;
    };

    // ===========================
    // EVENT LISTENER CONFIG
    // ===========================
    // Universal event listener - can listen to ANY event source
    eventSource?: 'board' | 'user' | 'system' | 'custom';
    eventType?: string; // Generic event type (e.g., 'card_moved', 'user_created', 'file_uploaded')

    // Event filters - flexible filtering system
    eventFilters?: {
      // For board events (backward compatibility)
      boardType?:
        | 'jira'
        | 'trello'
        | 'asana'
        | 'notion'
        | 'monday'
        | 'clickup'
        | 'generic';
      boardConnection?: string;
      sourceColumn?: string;
      targetColumn?: string;
      assignee?: string;
      priority?: string;
      labels?: string[];
      cardType?: string;

      // For any custom filters
      customFilters?: Record<string, any>;
    };

    // ===========================
    // MANUAL TRIGGER CONFIG
    // ===========================
    allowedUsers?: string[]; // User IDs who can trigger
    requireConfirmation?: boolean; // Require confirmation before execution
    confirmationMessage?: string; // Custom confirmation message

    // ===========================
    // COMMON TRIGGER SETTINGS
    // ===========================
    enabled?: boolean; // Enable/disable trigger
    rateLimit?: {
      maxExecutions: number; // Max executions per period
      period: 'minute' | 'hour' | 'day';
    };
  } & WithVariableStorage;
}

// Context Block Types
export interface ContextBlock {
  id: string;
  type: // Existing types
  | 'extract_files'
    | 'external_api'
    | 'variable'
    // NEW TYPES - Universal context extraction
    | 'extract_text' // Extract text from documents/images (OCR)
    | 'extract_media' // Extract images/videos from sources
    | 'get_data' // Get data from any source
    | 'rag_processing' // RAG - Retrieval Augmented Generation
    | 'transform_data'; // Transform/format data
  name: string;
  config: {
    variableName: string;
    source:
      | 'card_attachments'
      | 'card_fields'
      | 'api_call'
      | 'file'
      | 'url'
      | 'database';
    filter?: {
      uploadedBy?: string;
      fileType?: string[];
      dateRange?: [Date, Date];
    };

    // For extract_text
    ocrEnabled?: boolean;
    language?: string;

    // For extract_media
    mediaType?: 'image' | 'video' | 'audio' | 'all';

    // For rag_processing
    vectorDb?: string;
    embeddingModel?: string;
    topK?: number;

    // For transform_data
    transformationType?: 'format' | 'filter' | 'aggregate' | 'map';
    transformationScript?: string;
  } & WithVariableStorage;
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
  } & WithVariableStorage;
}

// Action Block Types
export interface ActionBlock {
  id: string;
  type: // Existing types (some renamed)
  | 'comment'
    | 'ai_request'
    | 'generate_file' // RENAMED from 'create_file'
    | 'attach_file'
    | 'send_message' // RENAMED from 'send_notification'
    // NEW TYPES - Universal actions
    | 'api_call' // Make HTTP API request
    | 'mcp_operation' // Model Context Protocol operation
    | 'store_data'; // Store data in database/storage
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

    // Для файлов (generate_file)
    fileName?: string;
    fileContent?: string;
    fileFormat?: 'docx' | 'pdf' | 'txt' | 'xlsx';
    template?: string; // NEW: Template for file generation
    templateVariables?: Record<string, string>; // NEW: Variables for template

    // Для уведомлений (send_message)
    recipient?: string;
    message?: string;
    channel?: 'email' | 'sms' | 'slack' | 'telegram'; // NEW: Channel type

    // Для API запросов (api_call)
    apiUrl?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers?: Record<string, string>;
    body?: string | Record<string, any>;
    authType?: 'none' | 'bearer' | 'basic' | 'api_key';
    authToken?: string;

    // Для MCP операций (mcp_operation)
    mcpServer?: string;
    mcpOperation?: string;
    mcpParams?: Record<string, any>;

    // Для сохранения данных (store_data)
    storageType?: 'database' | 's3' | 'local';
    storagePath?: string;
    dataFormat?: 'json' | 'csv' | 'xml';
  } & WithVariableStorage &
    WithAsyncControl;
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
  } & WithVariableStorage;
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
  // Support both legacy format (from/to) and new format (source/target)
  from?: string; // Legacy support
  to?: string; // Legacy support
  source?: string; // New format - matches backend
  target?: string; // New format - matches backend
  sourceHandle?: string;
  targetHandle?: string;
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
