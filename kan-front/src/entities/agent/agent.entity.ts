/**
 * Agent Entity
 *
 * Represents an AI agent with its configuration and execution capabilities.
 * Corresponds to backend Agent entity.
 */

export interface Agent {
  id: string;
  name: string;
  description?: string;
  type: AgentType;
  status: AgentStatus;
  configuration: AgentConfiguration;
  createdAt: Date;
  updatedAt: Date;
  lastExecutedAt?: Date;
  executionCount: number;
  successRate?: number;
}

export enum AgentType {
  FLOW_EXECUTOR = 'flow_executor',
  TASK_ANALYZER = 'task_analyzer',
  JIRA_INTEGRATOR = 'jira_integrator',
  REPORTER = 'reporter',
  CUSTOM = 'custom',
}

export enum AgentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PAUSED = 'paused',
  ERROR = 'error',
}

export interface AgentConfiguration {
  flowId?: string;
  triggerType?: TriggerType;
  schedule?: string; // Cron expression for scheduled agents
  parameters?: Record<string, any>;
  maxRetries?: number;
  timeout?: number;
  notificationSettings?: NotificationSettings;
}

export enum TriggerType {
  MANUAL = 'manual',
  SCHEDULED = 'scheduled',
  EVENT = 'event',
  WEBHOOK = 'webhook',
}

export interface NotificationSettings {
  onSuccess?: boolean;
  onError?: boolean;
  channels?: NotificationChannel[];
  recipients?: string[];
}

export enum NotificationChannel {
  EMAIL = 'email',
  SLACK = 'slack',
  WEBHOOK = 'webhook',
}

export interface AgentActivity {
  id: string;
  agentId: string;
  executionId: string;
  status: ExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  input?: any;
  output?: any;
  error?: string;
  logs?: string[];
}

export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}
