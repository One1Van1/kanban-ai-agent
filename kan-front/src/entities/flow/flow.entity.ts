/**
 * Flow Entity
 *
 * Represents an automation flow with its nodes, edges, and execution metadata.
 * Corresponds to backend Flow entity.
 */

export interface Flow {
  id: string;
  name: string;
  description?: string;
  status: FlowStatus;
  nodes: FlowNode[];
  edges: FlowEdge[];
  variables?: Record<string, any>;
  settings?: FlowSettings;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  tags?: string[];
  version?: number;
  isTemplate?: boolean;
}

export enum FlowStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
  ERROR = 'error',
}

export interface FlowNode {
  id: string;
  type: FlowNodeType;
  position: { x: number; y: number };
  data: FlowNodeData;
  parentNode?: string;
  extent?: 'parent';
}

export enum FlowNodeType {
  TRIGGER = 'trigger',
  ACTION = 'action',
  LOGIC = 'logic',
  WAIT = 'wait',
  CONTEXT = 'context',
  SUBFLOW = 'subflow',
}

export interface FlowNodeData {
  label: string;
  blockType?: string;
  config?: Record<string, any>;
  description?: string;
  icon?: string;
  color?: string;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  data?: {
    condition?: string;
    priority?: number;
  };
}

export interface FlowSettings {
  timeout?: number;
  maxRetries?: number;
  errorHandling?: ErrorHandlingStrategy;
  logging?: LoggingSettings;
  concurrency?: number;
}

export enum ErrorHandlingStrategy {
  STOP = 'stop',
  CONTINUE = 'continue',
  RETRY = 'retry',
  ROLLBACK = 'rollback',
}

export interface LoggingSettings {
  level: LogLevel;
  includeInput?: boolean;
  includeOutput?: boolean;
  includeErrors?: boolean;
}

export enum LogLevel {
  NONE = 'none',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export interface FlowExecution {
  id: string;
  flowId: string;
  status: FlowExecutionStatus;
  input?: any;
  output?: any;
  error?: string;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  executedNodes?: string[];
  logs?: FlowExecutionLog[];
}

export enum FlowExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  TIMEOUT = 'timeout',
}

export interface FlowExecutionLog {
  timestamp: Date;
  nodeId: string;
  level: LogLevel;
  message: string;
  data?: any;
}

export interface FlowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  flow: Omit<Flow, 'id' | 'createdAt' | 'updatedAt'>;
  previewImage?: string;
  tags?: string[];
  usageCount?: number;
}
