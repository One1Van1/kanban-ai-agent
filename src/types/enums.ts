/**
 * Статусы задач в канбан-доске
 */
export enum TaskStatus {
  NEW = 'new',
  QUESTIONS = 'questions',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done',
}

/**
 * Приоритеты задач
 */
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Решения AI анализа
 */
export enum AIDecision {
  QUESTIONS = 'questions',
  IN_PROGRESS = 'in_progress',
}
