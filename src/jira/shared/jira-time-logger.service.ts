import axios from 'axios';

/**
 * Автоматическое логирование времени в Jira
 */
export class JiraTimeLogger {
  private readonly jiraConfig: any;

  constructor(jiraConfig: any) {
    this.jiraConfig = jiraConfig;
  }

  /**
   * Логирует время выполнения задачи
   */
  async logWorkTime(
    issueKey: string,
    timeSpentMinutes: number,
    comment: string,
  ): Promise<boolean> {
    try {
      const timeSpentSeconds = timeSpentMinutes * 60;

      const response = await axios.post(
        `${this.jiraConfig.baseUrl}/rest/api/3/issue/${issueKey}/worklog`,
        {
          timeSpentSeconds: timeSpentSeconds,
          started: new Date().toISOString(),
          comment: `🤖 AI Agent: ${comment}`,
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${this.jiraConfig.email}:${this.jiraConfig.apiToken}`,
            ).toString('base64')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(`✅ Time logged for ${issueKey}: ${timeSpentMinutes}m`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to log time for ${issueKey}:`, error);
      return false;
    }
  }

  /**
   * Обновляет существующую запись времени
   */
  async updateWorklog(
    issueKey: string,
    worklogId: string,
    newTimeMinutes: number,
  ): Promise<boolean> {
    try {
      await axios.put(
        `${this.jiraConfig.baseUrl}/rest/api/3/issue/${issueKey}/worklog/${worklogId}`,
        {
          timeSpentSeconds: newTimeMinutes * 60,
          comment: '🔄 AI Agent: Время скорректировано после анализа',
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${this.jiraConfig.email}:${this.jiraConfig.apiToken}`,
            ).toString('base64')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return true;
    } catch (error) {
      console.error(`❌ Failed to update worklog:`, error);
      return false;
    }
  }
}
