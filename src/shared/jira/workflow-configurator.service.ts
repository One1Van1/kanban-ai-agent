/**
 * Автоматическая настройка Workflow для логирования времени
 * через Jira REST API
 */

import axios from 'axios';

interface JiraWorkflowConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
  projectKey: string;
}

export class JiraWorkflowConfigurator {
  private config: JiraWorkflowConfig;

  constructor(config: JiraWorkflowConfig) {
    this.config = config;
  }

  /**
   * Создает Screen для логирования времени
   */
  async createTimeLoggingScreen(): Promise<string> {
    const screenData = {
      name: 'Haircut Time Logging Screen',
      description: 'Screen for logging haircut work time',
      tabs: [
        {
          name: 'Log Work',
          fields: [
            'timetracking', // Time Spent field
            'comment', // Work description
            'worklog', // Work log details
          ],
        },
      ],
    };

    const response = await this.makeJiraRequest(
      'POST',
      '/rest/api/3/screens',
      screenData,
    );

    console.log(`✅ Created screen: ${response.data.id}`);
    return response.data.id;
  }

  /**
   * Настраивает переход с обязательным логированием времени
   */
  async configureTransition(
    workflowName: string,
    transitionId: string,
    screenId: string,
  ) {
    // 1. Добавляем Screen к переходу
    await this.addScreenToTransition(workflowName, transitionId, screenId);

    // 2. Добавляем Post Function для логирования
    await this.addLogWorkPostFunction(workflowName, transitionId);

    // 3. Добавляем валидаторы
    await this.addTimeValidators(workflowName, transitionId);
  }

  /**
   * Добавляет Screen к переходу
   */
  private async addScreenToTransition(
    workflowName: string,
    transitionId: string,
    screenId: string,
  ) {
    const transitionData = {
      screen: {
        id: screenId,
      },
    };

    await this.makeJiraRequest(
      'PUT',
      `/rest/api/3/workflow/transitions/${workflowName}/${transitionId}`,
      transitionData,
    );

    console.log(`✅ Added screen to transition ${transitionId}`);
  }

  /**
   * Добавляет Post Function для автоматического логирования времени
   */
  private async addLogWorkPostFunction(
    workflowName: string,
    transitionId: string,
  ) {
    const postFunctionData = {
      type: 'com.atlassian.jira.workflow.function.issue.UpdateIssueFunction',
      configuration: {
        logWork: {
          enabled: true,
          timeSpentField: 'timetracking',
          commentField: 'comment',
          dateField: 'started',
        },
      },
    };

    await this.makeJiraRequest(
      'POST',
      `/rest/api/3/workflow/${workflowName}/transitions/${transitionId}/postfunctions`,
      postFunctionData,
    );

    console.log(
      `✅ Added log work post function to transition ${transitionId}`,
    );
  }

  /**
   * Добавляет валидаторы для проверки времени
   */
  private async addTimeValidators(workflowName: string, transitionId: string) {
    const validators = [
      {
        type: 'com.atlassian.jira.workflow.validator.FieldRequiredValidator',
        configuration: {
          fieldId: 'timetracking',
          errorMessage: 'Время выполнения обязательно для заполнения',
        },
      },
      {
        type: 'com.atlassian.jira.workflow.validator.FieldRequiredValidator',
        configuration: {
          fieldId: 'comment',
          errorMessage: 'Описание работы обязательно для заполнения',
        },
      },
    ];

    for (const validator of validators) {
      await this.makeJiraRequest(
        'POST',
        `/rest/api/3/workflow/${workflowName}/transitions/${transitionId}/validators`,
        validator,
      );
    }

    console.log(`✅ Added validators to transition ${transitionId}`);
  }

  /**
   * Публикует изменения workflow
   */
  async publishWorkflow(workflowName: string) {
    await this.makeJiraRequest(
      'POST',
      `/rest/api/3/workflow/${workflowName}/publish`,
      {},
    );

    console.log(`✅ Published workflow: ${workflowName}`);
  }

  /**
   * Вспомогательный метод для запросов к Jira API
   */
  private async makeJiraRequest(method: string, endpoint: string, data: any) {
    const auth = Buffer.from(
      `${this.config.email}:${this.config.apiToken}`,
    ).toString('base64');

    return await axios({
      method,
      url: `${this.config.baseUrl}${endpoint}`,
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data,
    });
  }
}

/**
 * Пример использования
 */
async function setupHaircutWorkflow() {
  const configurator = new JiraWorkflowConfigurator({
    baseUrl: 'https://your-domain.atlassian.net',
    email: 'admin@company.com',
    apiToken: 'your-api-token',
    projectKey: 'HAIR',
  });

  try {
    // 1. Создаем Screen
    const screenId = await configurator.createTimeLoggingScreen();

    // 2. Настраиваем переход
    await configurator.configureTransition(
      'Haircut Workflow',
      'In Progress_Review', // ID перехода
      screenId,
    );

    // 3. Публикуем изменения
    await configurator.publishWorkflow('Haircut Workflow');

    console.log('🎉 Workflow configured successfully!');
  } catch (error) {
    console.error('❌ Failed to configure workflow:', error);
  }
}

export { setupHaircutWorkflow };
