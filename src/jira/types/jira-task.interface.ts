/**
 * Интерфейсы для работы с задачами Jira
 * Основаны на Jira REST API v3
 */

export interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress?: string;
}

export interface JiraStatus {
  id: string;
  name: string;
  statusCategory: {
    id: number;
    key: string;
    colorName: string;
    name: string;
  };
}

export interface JiraPriority {
  id: string;
  name: string;
  iconUrl: string;
}

export interface JiraIssueType {
  id: string;
  name: string;
  iconUrl: string;
  subtask: boolean;
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
}

export interface JiraTaskFields {
  summary: string;
  description?: string;
  status: JiraStatus;
  assignee?: JiraUser;
  reporter: JiraUser;
  priority: JiraPriority;
  issuetype: JiraIssueType;
  project: JiraProject;
  created: string;
  updated: string;
  duedate?: string;
  labels: string[];
  components: Array<{
    id: string;
    name: string;
  }>;
}

export interface JiraTask {
  id: string;
  key: string;
  self: string;
  fields: JiraTaskFields;
}

export interface JiraTaskSearchResult {
  expand: string;
  startAt: number;
  maxResults: number;
  total: number;
  issues: JiraTask[];
}

export interface JiraTaskTransition {
  id: string;
  name: string;
  to: {
    id: string;
    name: string;
    statusCategory: {
      id: number;
      key: string;
      colorName: string;
    };
  };
}

export interface JiraTaskTransitionsResponse {
  expand: string;
  transitions: JiraTaskTransition[];
}

export interface CreateJiraTaskRequest {
  fields: {
    project: {
      key: string;
    };
    summary: string;
    description?: string;
    issuetype: {
      name: string;
    };
    assignee?: {
      accountId: string;
    };
    priority?: {
      name: string;
    };
    labels?: string[];
  };
}

export interface UpdateJiraTaskRequest {
  fields?: Partial<{
    summary: string;
    description: string;
    assignee: {
      accountId: string;
    };
    priority: {
      name: string;
    };
    labels: string[];
  }>;
}

export interface JiraTaskComment {
  id: string;
  author: JiraUser;
  body: string;
  created: string;
  updated: string;
}

export interface JiraTaskCommentsResponse {
  startAt: number;
  maxResults: number;
  total: number;
  comments: JiraTaskComment[];
}

export interface AddJiraCommentRequest {
  body:
    | string
    | {
        version: number;
        type: string;
        content: Array<{
          type: string;
          content?: Array<{
            type: string;
            text: string;
          }>;
        }>;
      };
}
