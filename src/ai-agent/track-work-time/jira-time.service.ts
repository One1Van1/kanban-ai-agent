import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { IJiraTimeService } from './track-work-time.interface';

/**
 * Локальный Jira сервис для работы с временем
 * Изолированный в эндпоинте согласно архитектурным правилам
 */
@Injectable()
export class JiraTimeService implements IJiraTimeService {
  private readonly logger = new Logger(JiraTimeService.name);
  private readonly axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    const baseURL = this.configService.get<string>('jira.baseUrl');
    const email = this.configService.get<string>('jira.email');
    const apiToken = this.configService.get<string>('jira.apiToken');

    if (!baseURL || !email || !apiToken) {
      this.logger.error('❌ Missing Jira configuration');
      throw new Error('Jira configuration is required');
    }

    // Создаем настроенный HTTP клиент для Jira API
    this.axiosInstance = axios.create({
      baseURL: `${baseURL}/rest/api/3`,
      auth: {
        username: email,
        password: apiToken,
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 30000, // 30 seconds
    });

    this.logger.log('✅ Jira Time Service initialized');
  }

  /**
   * Получить changelog задачи для анализа статусов
   */
  async getTaskChangelog(taskKey: string): Promise<any[]> {
    try {
      this.logger.log(`📋 Fetching changelog for task: ${taskKey}`);

      const response = await this.axiosInstance.get(
        `/issue/${taskKey}/changelog`,
        {
          params: {
            expand: 'changelog',
            maxResults: 100, // Получаем достаточно истории
          },
        },
      );

      const changelog = response.data.values || [];

      this.logger.log(
        `✅ Retrieved ${changelog.length} changelog entries for ${taskKey}`,
      );
      return changelog;
    } catch (error) {
      this.logger.error(
        `❌ Failed to get changelog for ${taskKey}:`,
        error.message,
      );
      throw new Error(`Failed to retrieve task changelog: ${error.message}`);
    }
  }

  /**
   * Получить worklog задачи
   */
  async getTaskWorklog(taskKey: string): Promise<any[]> {
    try {
      this.logger.log(`⏰ Fetching worklog for task: ${taskKey}`);

      const response = await this.axiosInstance.get(
        `/issue/${taskKey}/worklog`,
        {
          params: {
            maxResults: 100,
          },
        },
      );

      const worklogs = response.data.worklogs || [];

      this.logger.log(
        `✅ Retrieved ${worklogs.length} worklog entries for ${taskKey}`,
      );
      return worklogs;
    } catch (error) {
      this.logger.error(
        `❌ Failed to get worklog for ${taskKey}:`,
        error.message,
      );
      throw new Error(`Failed to retrieve task worklog: ${error.message}`);
    }
  }

  /**
   * Получить информацию о задаче
   */
  async getTaskInfo(taskKey: string): Promise<{
    summary: string;
    created: string;
    updated: string;
    status: { name: string; id: string };
  }> {
    try {
      this.logger.log(`ℹ️ Fetching task info for: ${taskKey}`);

      const response = await this.axiosInstance.get(`/issue/${taskKey}`, {
        params: {
          fields: 'summary,created,updated,status',
        },
      });

      const issue = response.data;
      const taskInfo = {
        summary: issue.fields.summary,
        created: issue.fields.created,
        updated: issue.fields.updated,
        status: {
          name: issue.fields.status.name,
          id: issue.fields.status.id,
        },
      };

      this.logger.log(
        `✅ Retrieved task info for ${taskKey}: ${taskInfo.summary}`,
      );
      return taskInfo;
    } catch (error) {
      this.logger.error(
        `❌ Failed to get task info for ${taskKey}:`,
        error.message,
      );
      throw new Error(`Failed to retrieve task information: ${error.message}`);
    }
  }

  /**
   * Получить детальную информацию о переходах между статусами
   */
  async getStatusTransitions(taskKey: string): Promise<
    {
      statusId: string;
      statusName: string;
      timestamp: string;
      author: string;
    }[]
  > {
    try {
      const changelog = await this.getTaskChangelog(taskKey);
      const statusTransitions: {
        statusId: string;
        statusName: string;
        timestamp: string;
        author: string;
      }[] = [];

      // Анализируем changelog для поиска изменений статуса
      for (const entry of changelog) {
        if (entry.items) {
          for (const item of entry.items) {
            if (item.field === 'status') {
              statusTransitions.push({
                statusId: item.to,
                statusName: item.toString,
                timestamp: entry.created,
                author: entry.author?.displayName || 'Unknown',
              });
            }
          }
        }
      }

      // Сортируем по времени
      statusTransitions.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );

      this.logger.log(
        `📊 Found ${statusTransitions.length} status transitions for ${taskKey}`,
      );
      return statusTransitions;
    } catch (error) {
      this.logger.error(
        `❌ Failed to get status transitions for ${taskKey}:`,
        error.message,
      );
      throw new Error(
        `Failed to retrieve status transitions: ${error.message}`,
      );
    }
  }

  /**
   * Проверка доступности Jira API
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Простой запрос для проверки подключения
      await this.axiosInstance.get('/myself');
      return true;
    } catch (error) {
      this.logger.error('❌ Jira API health check failed:', error.message);
      return false;
    }
  }
}
