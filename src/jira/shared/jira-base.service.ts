import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  JiraTask,
  JiraTaskSearchResult,
  JiraTaskTransitionsResponse,
  CreateJiraTaskRequest,
  UpdateJiraTaskRequest,
  AddJiraCommentRequest,
  JiraTaskCommentsResponse,
} from '../types/jira-task.interface';
import {
  JiraBoard,
  JiraBoardsResponse,
  JiraBoardConfiguration,
  BoardTasksInColumnResponse,
} from '../types/jira-board.interface';

export interface JiraConfig {
  baseUrl: string;
  username: string;
  apiToken: string;
  projectKey: string;
  boardId?: number;
}

@Injectable()
export class JiraBaseService {
  protected readonly logger = new Logger(JiraBaseService.name);
  private readonly httpClient: AxiosInstance;
  private readonly config: JiraConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = {
      baseUrl: this.configService.get<string>('jira.baseUrl') || '',
      username: this.configService.get<string>('jira.email') || '',
      apiToken: this.configService.get<string>('jira.apiToken') || '',
      projectKey: this.configService.get<string>('jira.projectKey') || '',
      boardId: this.configService.get<number>('jira.boardId'),
    };

    this.validateConfig();
    this.httpClient = this.createHttpClient();
  }

  private validateConfig(): void {
    const { baseUrl, username, apiToken, projectKey } = this.config;

    if (!baseUrl || !username || !apiToken || !projectKey) {
      throw new Error(
        'Jira configuration is incomplete. Please check JIRA_BASE_URL, JIRA_USERNAME, JIRA_API_TOKEN, and JIRA_PROJECT_KEY environment variables.',
      );
    }

    this.logger.log(`Jira service initialized for project: ${projectKey}`);
  }

  private createHttpClient(): AxiosInstance {
    const client = axios.create({
      baseURL: `${this.config.baseUrl}/rest/api/3`,
      timeout: 30000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      auth: {
        username: this.config.username,
        password: this.config.apiToken,
      },
    });

    // Request interceptor для логирования
    client.interceptors.request.use((config) => {
      this.logger.debug(
        `Jira API Request: ${config.method?.toUpperCase()} ${config.url}`,
      );
      return config;
    });

    // Response interceptor для обработки ошибок
    client.interceptors.response.use(
      (response) => {
        this.logger.debug(
          `Jira API Response: ${response.status} ${response.config.url}`,
        );
        return response;
      },
      (error) => {
        const message =
          error.response?.data?.errorMessages?.[0] || error.message;
        this.logger.error(
          `Jira API Error: ${error.response?.status} - ${message}`,
        );
        throw new Error(`Jira API Error: ${message}`);
      },
    );

    return client;
  }

  /**
   * Тестирование подключения к Jira
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.httpClient.get('/myself');
      this.logger.log('Jira connection test successful');
      return true;
    } catch (error) {
      this.logger.error(`Jira connection test failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Получить задачу по ключу
   */
  async getTask(taskKey: string): Promise<JiraTask> {
    try {
      const response: AxiosResponse<JiraTask> = await this.httpClient.get(
        `/issue/${taskKey}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get task ${taskKey}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Поиск задач по JQL
   */
  async searchTasks(
    jql: string,
    startAt: number = 0,
    maxResults: number = 50,
  ): Promise<JiraTaskSearchResult> {
    try {
      const response: AxiosResponse<JiraTaskSearchResult> =
        await this.httpClient.post('/search', {
          jql,
          startAt,
          maxResults,
        });
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to search tasks: ${error.message}`);
      throw error;
    }
  }

  /**
   * Получить доступные переходы для задачи
   */
  async getTaskTransitions(
    taskKey: string,
  ): Promise<JiraTaskTransitionsResponse> {
    try {
      const response: AxiosResponse<JiraTaskTransitionsResponse> =
        await this.httpClient.get(`/issue/${taskKey}/transitions`);
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to get transitions for task ${taskKey}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Выполнить переход задачи
   */
  async transitionTask(taskKey: string, transitionId: string): Promise<void> {
    try {
      await this.httpClient.post(`/issue/${taskKey}/transitions`, {
        transition: { id: transitionId },
      });
      this.logger.log(
        `Task ${taskKey} transitioned using transition ${transitionId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to transition task ${taskKey}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Добавить комментарий к задаче
   */
  async addComment(
    taskKey: string,
    comment: AddJiraCommentRequest,
  ): Promise<void> {
    try {
      await this.httpClient.post(`/issue/${taskKey}/comment`, comment);
      this.logger.log(`Comment added to task ${taskKey}`);
    } catch (error) {
      this.logger.error(
        `Failed to add comment to task ${taskKey}: ${error.message}`,
      );
      throw error;
    }
  }

  protected getHttpClient(): AxiosInstance {
    return this.httpClient;
  }

  protected getConfig(): JiraConfig {
    return this.config;
  }
}
