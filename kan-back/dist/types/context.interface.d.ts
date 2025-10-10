export declare enum ContextSourceType {
    TASK_DETAILS = "task_details",
    RELATED_TASKS = "related_tasks",
    TASK_COMMENTS = "task_comments",
    TASK_HISTORY = "task_history",
    EXTERNAL_API = "external_api",
    FILE_ATTACHMENTS = "file_attachments",
    USER_PROFILE = "user_profile",
    PROJECT_SETTINGS = "project_settings"
}
export declare enum ContextPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export interface ContextSource {
    id: string;
    type: ContextSourceType;
    name: string;
    description: string;
    priority: ContextPriority;
    enabled: boolean;
    config: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface ContextData {
    sourceId: string;
    sourceType: ContextSourceType;
    data: any;
    fetchedAt: Date;
    ttl?: number;
}
export interface ContextRequest {
    taskId: string;
    agentId: string;
    sources: string[];
    includeCache?: boolean;
}
export interface ContextResponse {
    taskId: string;
    agentId: string;
    contexts: ContextData[];
    fetchedAt: Date;
    errors?: ContextError[];
}
export interface ContextError {
    sourceId: string;
    sourceType: ContextSourceType;
    error: string;
    timestamp: Date;
}
export interface ExternalApiConfig {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers: Record<string, string>;
    params?: Record<string, any>;
    body?: any;
    timeout?: number;
}
export interface RelatedTasksConfig {
    searchCriteria: {
        assignee?: boolean;
        labels?: boolean;
        component?: boolean;
        epic?: boolean;
        sprint?: boolean;
    };
    maxResults: number;
}
