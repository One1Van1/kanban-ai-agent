/**
 * Типы для блока Flows
 */

/**
 * Статус флоу
 */
export type FlowStatus = 'draft' | 'active' | 'archived';

/**
 * Флоу (поток)
 */
export interface Flow {
  id: string;
  name: string;
  description?: string;
  status: FlowStatus;
  definition: any; // JSON определение флоу
  metadata?: FlowMetadata;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  version?: number;
}

/**
 * Метаданные флоу
 */
export interface FlowMetadata {
  category?: string;
  tags?: string[];
  icon?: string;
  color?: string;
  estimatedDuration?: number;
  complexity?: 'simple' | 'medium' | 'complex';
  [key: string]: any;
}

/**
 * Данные для создания флоу
 */
export interface CreateFlowData {
  name: string;
  description?: string;
  definition: any;
  createdBy: string;
  metadata?: FlowMetadata;
}

/**
 * Данные для обновления флоу
 */
export interface UpdateFlowData {
  name?: string;
  description?: string;
  definition?: any;
  status?: FlowStatus;
  metadata?: FlowMetadata;
  updatedBy: string;
}

/**
 * Данные для клонирования флоу
 */
export interface CloneFlowData {
  name: string;
  description?: string;
  clonedBy: string;
}

/**
 * Данные для выполнения флоу
 */
export interface ExecuteFlowData {
  context?: any;
  executedBy: string;
}

/**
 * Результат выполнения флоу
 */
export interface FlowExecutionResult {
  success: boolean;
  executionId: string;
  result?: any;
  instructions?: any[];
  error?: string;
  duration?: number;
  startedAt: string;
  completedAt?: string;
}

/**
 * Параметры для получения списка флоу
 */
export interface ListFlowsParams {
  page?: number;
  limit?: number;
  status?: string;
  createdBy?: string;
  category?: string;
  search?: string;
}

/**
 * Ответ API при получении списка флоу
 */
export interface ListFlowsResponse {
  flows: Flow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Ответ API при операциях с флоу
 */
export interface FlowManagementResponse {
  success: boolean;
  message?: string;
  flow?: Flow;
  flowId?: string;
}

/**
 * Ответ API при клонировании флоу
 */
export interface FlowCloneResponse {
  success: boolean;
  message: string;
  originalFlowId: string;
  clonedFlowId: string;
  clonedFlow: Flow;
}

/**
 * Данные для деплоя в агента
 */
export interface DeployToAgentData {
  userId: string;
  agentName?: string;
  agentDescription?: string;
}

/**
 * Результат деплоя в агента
 */
export interface DeployToAgentResponse {
  success: boolean;
  message: string;
  flowId: string;
  agentId: string;
  createdAgent: {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
  };
  createdInstructions: any[];
}

/**
 * Данные для импорта флоу
 */
export interface ImportFlowData {
  version: string;
  name: string;
  description?: string;
  status: string;
  definition: any;
  metadata?: FlowMetadata;
  importMode?: 'create_new' | 'replace_existing';
  flowIdToReplace?: string;
  createdBy?: string;
}

/**
 * Результат импорта флоу
 */
export interface ImportFlowResponse {
  status: string;
  message: string;
  flowId: string;
  flowName: string;
  importMode: string;
  isNewFlow: boolean;
}
