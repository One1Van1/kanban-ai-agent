import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JiraConfig } from '../config/jira.config';
import { TaskStatus } from '../types/enums';

export interface TaskUpdateRequest {
  taskKey: string;
  newStatus: TaskStatus;
  comment?: string;
}

export interface JiraTransition {
  id: string;
  name: string;
  to: {
    id: string;
    name: string;
  };
}

@Injectable()
export class KanbanService {
  private readonly logger = new Logger(KanbanService.name);
  private readonly jiraConfig: JiraConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.jiraConfig = this.configService.get<JiraConfig>('jira')!;
  }

  /**
   * Обновляет статус задачи в Jira
   */
  async updateTaskStatus(request: TaskUpdateRequest): Promise<boolean> {
    try {
      this.logger.log(
        `Обновление статуса задачи ${request.taskKey} → ${request.newStatus}`,
      );

      // 1. Получаем доступные переходы для задачи
      const transitions = await this.getAvailableTransitions(request.taskKey);

      // 2. Находим нужный переход по статусу
      const targetTransition = this.findTransitionByStatus(
        transitions,
        request.newStatus,
      );

      if (!targetTransition) {
        this.logger.warn(
          `Переход к статусу ${request.newStatus} недоступен для задачи ${request.taskKey}`,
        );
        return false;
      }

      // 3. Выполняем переход
      await this.executeTransition(
        request.taskKey,
        targetTransition.id,
        request.comment,
      );

      this.logger.log(
        `✅ Статус задачи ${request.taskKey} успешно обновлен на ${request.newStatus}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `❌ Ошибка обновления статуса задачи ${request.taskKey}:`,
        error,
      );
      return false;
    }
  }

  /**
   * Получает доступные переходы для задачи
   */
  private async getAvailableTransitions(
    taskKey: string,
  ): Promise<JiraTransition[]> {
    const url = `${this.jiraConfig.baseUrl}/rest/api/3/issue/${taskKey}/transitions`;

    const response = await firstValueFrom(
      this.httpService.get(url, {
        headers: this.getJiraHeaders(),
      }),
    );

    return response.data.transitions || [];
  }

  /**
   * Находит переход по целевому статусу
   */
  private findTransitionByStatus(
    transitions: JiraTransition[],
    targetStatus: TaskStatus,
  ): JiraTransition | null {
    // Маппинг наших статусов к точным названиям переходов в Jira
    const statusMapping: Record<TaskStatus, string[]> = {
      [TaskStatus.NEW]: ['NEW', 'New'],
      [TaskStatus.QUESTIONS]: ['QUESTIONS', 'Questions'],
      [TaskStatus.IN_PROGRESS]: ['IN PROGRESS', 'In Progress'],
      [TaskStatus.REVIEW]: ['REVIEW', 'Review', 'Проверка'],
      [TaskStatus.DONE]: ['DONE', 'Done'],
    };

    const possibleNames = statusMapping[targetStatus] || [];

    return (
      transitions.find((transition) =>
        possibleNames.some((name) =>
          transition.to.name.toLowerCase().includes(name.toLowerCase()),
        ),
      ) || null
    );
  }

  /**
   * Выполняет переход задачи
   */
  private async executeTransition(
    taskKey: string,
    transitionId: string,
    comment?: string,
  ): Promise<void> {
    const url = `${this.jiraConfig.baseUrl}/rest/api/3/issue/${taskKey}/transitions`;

    const body: any = {
      transition: { id: transitionId },
    };

    // Добавляем комментарий если есть
    if (comment) {
      body.update = {
        comment: [
          {
            add: {
              body: {
                type: 'doc',
                version: 1,
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        text: comment,
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
      };
    }

    await firstValueFrom(
      this.httpService.post(url, body, {
        headers: this.getJiraHeaders(),
      }),
    );
  }

  /**
   * Генерирует заголовки для запросов к Jira API
   */
  private getJiraHeaders() {
    const auth = Buffer.from(
      `${this.jiraConfig.email}:${this.jiraConfig.apiToken}`,
    ).toString('base64');

    return {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }

  /**
   * Проверяет подключение к Jira
   */
  async testConnection(): Promise<boolean> {
    try {
      const url = `${this.jiraConfig.baseUrl}/rest/api/3/myself`;

      await firstValueFrom(
        this.httpService.get(url, {
          headers: this.getJiraHeaders(),
        }),
      );

      this.logger.log('✅ Подключение к Jira успешно');
      return true;
    } catch (error) {
      this.logger.error('❌ Ошибка подключения к Jira:', error.message);
      return false;
    }
  }
}
