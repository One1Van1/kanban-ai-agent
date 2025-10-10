/**
 * Интерфейсы для работы с досками и колонками Jira
 * Поддержка Kanban и Scrum досок
 */

export interface JiraBoardLocation {
  projectId: string;
  displayName: string;
  projectName: string;
  projectKey: string;
  projectTypeKey: string;
}

export interface JiraBoard {
  id: number;
  self: string;
  name: string;
  type: 'kanban' | 'scrum' | 'simple';
  location: JiraBoardLocation;
}

export interface JiraBoardsResponse {
  maxResults: number;
  startAt: number;
  total: number;
  isLast: boolean;
  values: JiraBoard[];
}

export interface JiraColumnStatus {
  id: string;
  name: string;
  statusCategory: {
    id: number;
    key: string;
    colorName: string;
    name: string;
  };
}

export interface JiraBoardColumn {
  name: string;
  statuses: JiraColumnStatus[];
  min?: number;
  max?: number;
}

export interface JiraBoardConfiguration {
  id: number;
  name: string;
  type: string;
  self: string;
  location: JiraBoardLocation;
  filter: {
    id: string;
    self: string;
  };
  subQuery: {
    query: string;
  };
  columnConfig: {
    columns: JiraBoardColumn[];
    constraintType: string;
  };
}

export interface KanbanColumn {
  name: string;
  statusIds: string[];
  statusNames: string[];
  taskCount?: number;
}

export interface BoardSprint {
  id: number;
  self: string;
  state: 'future' | 'active' | 'closed';
  name: string;
  startDate?: string;
  endDate?: string;
  completeDate?: string;
  originBoardId: number;
  goal?: string;
}

export interface JiraSprintsResponse {
  maxResults: number;
  startAt: number;
  isLast: boolean;
  values: BoardSprint[];
}

export interface JiraBoardFilter {
  boardId: number;
  columnName?: string;
  statusName?: string;
  assigneeId?: string;
  projectKey?: string;
  sprintId?: number;
  maxResults?: number;
  startAt?: number;
}

export interface BoardTasksInColumnResponse {
  expand: string;
  startAt: number;
  maxResults: number;
  total: number;
  issues: Array<{
    id: string;
    key: string;
    self: string;
    fields: {
      summary: string;
      status: {
        id: string;
        name: string;
        statusCategory: {
          id: number;
          key: string;
          colorName: string;
          name: string;
        };
      };
      assignee?: {
        accountId: string;
        displayName: string;
      };
      priority: {
        id: string;
        name: string;
      };
      issuetype: {
        id: string;
        name: string;
      };
    };
  }>;
}

export interface ColumnMapping {
  jiraColumnName: string;
  jiraStatusNames: string[];
  agentColumnType: 'todo' | 'in_progress' | 'review' | 'done' | 'blocked';
  canPickTasks: boolean;
  canMoveTasks: boolean;
}

export interface BoardConfiguration {
  boardId: number;
  boardName: string;
  projectKey: string;
  columnMappings: ColumnMapping[];
  autoProcessingEnabled: boolean;
  maxTasksPerRun: number;
  processingInterval: string; // cron format
}
