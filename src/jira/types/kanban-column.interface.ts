/**
 * Дополнительные типы для работы с колонками Kanban
 * Используются для упрощения работы с досками и статусами
 */

export interface KanbanColumnFilter {
  columnName: string;
  statusNames?: string[];
  statusIds?: string[];
  excludeStatuses?: string[];
}

export interface TaskFilterOptions {
  projectKey?: string;
  boardId?: number;
  assigneeId?: string;
  assigneeDisplayName?: string;
  priority?: string;
  issueType?: string;
  labels?: string[];
  maxResults?: number;
  startAt?: number;
  orderBy?: 'created' | 'updated' | 'priority' | 'duedate';
  orderDirection?: 'ASC' | 'DESC';
}

export interface KanbanTaskSummary {
  id: string;
  key: string;
  summary: string;
  status: {
    id: string;
    name: string;
    categoryKey: string;
  };
  assignee?: {
    accountId: string;
    displayName: string;
  };
  priority: {
    id: string;
    name: string;
  };
  issueType: {
    id: string;
    name: string;
  };
  created: string;
  updated: string;
  duedate?: string;
  labels: string[];
}

export interface ColumnTasksResult {
  columnName: string;
  tasks: KanbanTaskSummary[];
  totalCount: number;
  hasMore: boolean;
  nextStartAt?: number;
}

export interface StatusTransition {
  id: string;
  name: string;
  fromStatusId: string;
  fromStatusName: string;
  toStatusId: string;
  toStatusName: string;
  isAvailable: boolean;
}

export interface TaskTransitionOptions {
  taskKey: string;
  targetStatusName: string;
  targetColumnName?: string;
  comment?: string;
  skipValidation?: boolean;
}

export interface TransitionResult {
  success: boolean;
  taskKey: string;
  fromStatus: string;
  toStatus: string;
  transitionId?: string;
  error?: string;
  message?: string;
  warning?: string;
}

export interface ColumnConfiguration {
  name: string;
  jiraStatusNames: string[];
  allowedTransitions: string[];
  maxTasksLimit?: number;
  autoAssignTo?: string; // accountId
  requiredLabels?: string[];
  blockedLabels?: string[];
}

export interface BoardColumnMapping {
  [columnName: string]: ColumnConfiguration;
}

export interface KanbanBoardState {
  boardId: number;
  boardName: string;
  columns: {
    [columnName: string]: {
      tasks: KanbanTaskSummary[];
      taskCount: number;
      hasLimit: boolean;
      limitValue?: number;
      isOverLimit: boolean;
    };
  };
  lastUpdated: string;
  totalTasks: number;
}

export interface TaskMovementRule {
  fromColumn: string;
  toColumn: string;
  requiredConditions?: {
    hasAssignee?: boolean;
    hasDescription?: boolean;
    hasLabels?: string[];
    minAge?: number; // в часах
  };
  automaticActions?: {
    addComment?: string;
    assignTo?: string;
    addLabels?: string[];
    removeLabels?: string[];
  };
}
