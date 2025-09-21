/**
 * Расширенные типы для улучшенного Kanban workflow
 * Дополняют существующие типы БЕЗ их изменения
 */

/**
 * Расширенные статусы задач для полного workflow
 */
export enum EnhancedTaskStatus {
  BACKLOG = 'backlog',
  NEW = 'new',
  QUESTIONS = 'questions',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done',
}

/**
 * Типы переходов между статусами
 */
export enum TransitionType {
  BACKLOG_TO_NEW = 'backlog_to_new',
  NEW_TO_QUESTIONS = 'new_to_questions',
  NEW_TO_IN_PROGRESS = 'new_to_in_progress',
  QUESTIONS_TO_NEW = 'questions_to_new',
  IN_PROGRESS_TO_REVIEW = 'in_progress_to_review',
  REVIEW_TO_DONE = 'review_to_done',
  REVIEW_TO_IN_PROGRESS = 'review_to_in_progress', // возврат на доработку
}

/**
 * Результат анализа задачи для расширенного workflow
 */
export enum EnhancedAIDecision {
  EXECUTABLE = 'executable', // можно выполнить автоматически
  NEEDS_CLARIFICATION = 'needs_clarification', // нужны уточнения
  MANUAL_REVIEW = 'manual_review', // требует ручной проверки
}

/**
 * Типы событий в расширенном workflow
 */
export enum WorkflowEventType {
  TASK_MOVED_TO_NEW = 'task_moved_to_new',
  TASK_ANALYZED = 'task_analyzed',
  TASK_EXECUTED = 'task_executed',
  TASK_MOVED_TO_REVIEW = 'task_moved_to_review',
  TASK_COMPLETED = 'task_completed',
  TASK_NEEDS_CLARIFICATION = 'task_needs_clarification',
}

/**
 * Приоритеты для расширенного workflow
 */
export enum EnhancedPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}
