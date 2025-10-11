export enum BoardType {
  JIRA = 'jira',
  TRELLO = 'trello',
  LINEAR = 'linear',
  ASANA = 'asana',
  NOTION = 'notion',
  GITHUB_PROJECTS = 'github_projects',
  CUSTOM = 'custom',
}

export interface BaseBoardConfig {
  boardId?: string;
  boardName?: string;
  projectKey?: string;
  workspaceId?: string;
}

export interface JiraBoardConfig extends BaseBoardConfig {
  instanceUrl: string;
  projectKey: string;
  apiToken: string;
  email?: string;
}

export interface TrelloBoardConfig extends BaseBoardConfig {
  boardId: string;
  apiKey: string;
  token: string;
  organizationId?: string;
}

export interface LinearBoardConfig extends BaseBoardConfig {
  apiKey: string;
  teamId?: string;
  organizationId?: string;
}

export interface AsanaBoardConfig extends BaseBoardConfig {
  accessToken: string;
  workspaceId: string;
  projectId?: string;
}

export interface NotionBoardConfig extends BaseBoardConfig {
  integrationToken: string;
  databaseId: string;
  pageId?: string;
}

export interface GitHubProjectsConfig extends BaseBoardConfig {
  accessToken: string;
  owner: string;
  repo: string;
  projectNumber?: number;
}

export interface CustomBoardConfig extends BaseBoardConfig {
  baseUrl: string;
  authConfig: {
    type: 'api_key' | 'bearer_token' | 'basic_auth' | 'oauth';
    credentials: Record<string, string>;
  };
  endpoints: {
    getTasks?: string;
    createTask?: string;
    updateTask?: string;
    deleteTask?: string;
    getBoards?: string;
  };
}

export type BoardConfig =
  | JiraBoardConfig
  | TrelloBoardConfig
  | LinearBoardConfig
  | AsanaBoardConfig
  | NotionBoardConfig
  | GitHubProjectsConfig
  | CustomBoardConfig;

export interface BoardIntegration {
  id: string;
  agentId: string;
  boardType: BoardType;
  config: BoardConfig;
  isActive: boolean;
  lastSyncAt?: Date;
  syncErrors?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BoardCredentials {
  type: BoardType;
  credentials: Record<string, string>;
  testConnection?: boolean;
}

export interface TaskMapping {
  boardType: BoardType;
  fieldMappings: {
    // Маппинг полей между нашей системой и внешней доской
    id: string;
    title: string;
    description: string;
    status: string;
    assignee?: string;
    priority?: string;
    dueDate?: string;
    labels?: string;
    comments?: string;
  };
  statusMappings: {
    // Маппинг статусов
    [ourStatus: string]: string; // наш статус -> статус внешней доски
  };
}

export interface BoardSyncResult {
  success: boolean;
  tasksImported: number;
  tasksUpdated: number;
  tasksSkipped: number;
  errors: string[];
  lastSyncAt: Date;
}
