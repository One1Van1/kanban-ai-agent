/**
 * Типы для блока Agents
 */

/**
 * AI Агент
 */
export interface Agent {
  id: string;
  name: string;
  description?: string;
  type?: string;
  isActive: boolean;
  configuration?: AgentConfiguration;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

/**
 * Конфигурация агента
 */
export interface AgentConfiguration {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: string[];
  systemPrompt?: string;
  [key: string]: any;
}

/**
 * Активность агента (логи действий)
 */
export interface AgentActivity {
  id: string;
  agentId: string;
  action: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  parameters?: any;
  result?: any;
  error?: string;
  startedAt: string;
  completedAt?: string;
  duration?: number;
}

/**
 * Данные для создания агента
 */
export interface CreateAgentData {
  name: string;
  description?: string;
  type?: string;
  configuration?: AgentConfiguration;
}

/**
 * Данные для обновления агента
 */
export interface UpdateAgentData {
  name?: string;
  description?: string;
  isActive?: boolean;
  configuration?: AgentConfiguration;
}

/**
 * Данные для выполнения действия агента
 */
export interface ExecuteAgentData {
  agentId: string;
  action: string;
  parameters?: any;
  context?: any;
}

/**
 * Результат выполнения действия агента
 */
export interface AgentExecutionResult {
  success: boolean;
  activityId: string;
  result?: any;
  error?: string;
  duration?: number;
}

/**
 * Ответ API при получении всех агентов
 */
export interface GetAllAgentsResponse {
  agents: Agent[];
  total: number;
}
