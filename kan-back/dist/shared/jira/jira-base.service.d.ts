import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosInstance } from 'axios';
import { JiraTask, JiraTaskSearchResult, JiraTaskTransitionsResponse, AddJiraCommentRequest } from '../../types/jira-task.interface';
export interface JiraConfig {
    baseUrl: string;
    username: string;
    apiToken: string;
    projectKey: string;
    boardId?: number;
}
export declare class JiraBaseService {
    private readonly configService;
    protected readonly logger: Logger;
    private readonly httpClient;
    private readonly config;
    constructor(configService: ConfigService);
    private validateConfig;
    private createHttpClient;
    testConnection(): Promise<boolean>;
    getTask(taskKey: string): Promise<JiraTask>;
    searchTasks(jql: string, startAt?: number, maxResults?: number): Promise<JiraTaskSearchResult>;
    getTaskTransitions(taskKey: string): Promise<JiraTaskTransitionsResponse>;
    transitionTask(taskKey: string, transitionId: string): Promise<void>;
    addComment(taskKey: string, comment: AddJiraCommentRequest): Promise<void>;
    protected getHttpClient(): AxiosInstance;
    protected getConfig(): JiraConfig;
}
