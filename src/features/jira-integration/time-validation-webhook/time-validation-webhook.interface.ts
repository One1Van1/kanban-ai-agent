export interface TimeValidationResponse {
  validated: boolean;
  timeFound: boolean;
  totalTimeSeconds?: number;
  action?: 'approved' | 'rejected' | 'notification_sent';
  message?: string;
  taskKey?: string;
  masterName?: string;
  nextSteps?: string[];
}

export interface WorklogEntry {
  timeSpentSeconds: number;
  started: string;
  author?: {
    displayName: string;
  };
  comment?: string;
}

export interface TaskTransitionData {
  taskKey: string;
  fromStatus: string;
  toStatus: string;
  masterName?: string;
  totalWorklogTime: number;
  worklogEntries: WorklogEntry[];
}

export interface JiraTransitionRequest {
  transition: {
    id: string;
  };
  fields?: {
    comment?: {
      body: string;
    };
  };
}

export enum TaskStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  DONE = 'Done',
}

export enum WebhookEvent {
  ISSUE_UPDATED = 'jira:issue_updated',
  ISSUE_CREATED = 'jira:issue_created',
  COMMENT_CREATED = 'comment_created',
}

export enum NotificationLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export interface NotificationData {
  taskKey: string;
  masterName: string;
  masterEmail?: string;
  level: NotificationLevel;
  title: string;
  message: string;
  suggestedActions: string[];
}
