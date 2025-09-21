import {
  EnhancedTaskStatus,
  TransitionType,
  EnhancedAIDecision,
  WorkflowEventType,
} from './enhanced-workflow.enums';

/**
 * Интерфейсы для расширенного Kanban workflow
 */

/**
 * Расширенная информация о задаче
 */
export interface EnhancedTaskInfo {
  taskKey: string;
  title: string;
  description: string;
  currentStatus: EnhancedTaskStatus;
  priority: string;
  assignee?: string;
  labels?: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Результат расширенного AI анализа
 */
export interface EnhancedAIAnalysisResult {
  decision: EnhancedAIDecision;
  reasoning: string;
  confidence: number; // 0-100%
  suggestedAction: string;
  estimatedComplexity: 'simple' | 'medium' | 'complex';
  requiredClarifications?: string[];
  canExecuteAutomatically: boolean;
}

/**
 * Информация о переходе между статусами
 */
export interface StatusTransition {
  taskKey: string;
  fromStatus: EnhancedTaskStatus;
  toStatus: EnhancedTaskStatus;
  transitionType: TransitionType;
  reason: string;
  timestamp: Date;
  triggeredBy: 'ai' | 'user' | 'system';
  metadata?: Record<string, any>;
}

/**
 * План выполнения в расширенном workflow
 */
export interface EnhancedExecutionPlan {
  taskKey: string;
  taskInfo: EnhancedTaskInfo;
  aiAnalysis: EnhancedAIAnalysisResult;
  plannedSteps: ExecutionStep[];
  estimatedDuration: number; // в минутах
  riskLevel: 'low' | 'medium' | 'high';
}

/**
 * Шаг выполнения задачи
 */
export interface ExecutionStep {
  stepId: string;
  description: string;
  type:
    | 'analysis'
    | 'code_generation'
    | 'file_operation'
    | 'command'
    | 'validation';
  estimatedTime: number; // в минутах
  dependencies?: string[]; // ID других шагов
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

/**
 * Результат выполнения в расширенном workflow
 */
export interface EnhancedExecutionResult {
  taskKey: string;
  success: boolean;
  completedSteps: ExecutionStep[];
  failedSteps: ExecutionStep[];
  summary: string;
  filesCreated: string[];
  commandsExecuted: string[];
  nextRecommendedAction: string;
  shouldMoveToReview: boolean;
}

/**
 * Событие в workflow
 */
export interface WorkflowEvent {
  eventId: string;
  eventType: WorkflowEventType;
  taskKey: string;
  timestamp: Date;
  details: Record<string, any>;
  source: 'enhanced-workflow' | 'ai-analysis' | 'task-executor' | 'user';
}

/**
 * Конфигурация расширенного workflow
 */
export interface EnhancedWorkflowConfig {
  autoExecuteSimpleTasks: boolean;
  requireManualReviewForComplex: boolean;
  maxExecutionTimeMinutes: number;
  enableAutomaticStatusTransitions: boolean;
  notificationWebhookUrl?: string;
}

/**
 * Статистика workflow
 */
export interface WorkflowStatistics {
  totalTasksProcessed: number;
  autoExecutedTasks: number;
  tasksNeedingClarification: number;
  averageExecutionTime: number;
  successRate: number;
  lastUpdated: Date;
}
