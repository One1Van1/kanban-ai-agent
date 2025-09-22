import { Injectable } from '@nestjs/common';
import { JiraBaseService } from '../shared/jira-base.service';
import { GetColumnTasksResponse } from './get-column-tasks.interface';
import {
  TaskFilterOptions,
  KanbanTaskSummary,
} from '../types/kanban-column.interface';
import { JiraTask } from '../types/jira-task.interface';

@Injectable()
export class GetColumnTasksService extends JiraBaseService {
  async getTasksFromColumn(
    columnName: string,
    options: TaskFilterOptions = {},
  ): Promise<GetColumnTasksResponse> {
    try {
      const jql = this.buildJQLQuery(columnName, options);
      const searchResult = await this.searchTasks(
        jql,
        options.startAt || 0,
        options.maxResults || 50,
      );

      const tasks = this.convertToKanbanSummary(searchResult.issues);

      return {
        columnName,
        tasks,
        totalCount: searchResult.total,
        hasMore:
          searchResult.startAt + searchResult.maxResults < searchResult.total,
        nextStartAt: searchResult.startAt + searchResult.maxResults,
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch tasks from column "${columnName}":`,
        error.message,
      );
      throw error;
    }
  }

  /**
   * Построить JQL запрос для получения задач из колонки
   */
  private buildJQLQuery(
    columnName: string,
    options: TaskFilterOptions = {},
  ): string {
    const config = this.getConfig();
    let jql = `project = "${config.projectKey}" AND status = "${columnName}"`;

    if (options.assigneeId) {
      jql += ` AND assignee = "${options.assigneeId}"`;
    }

    if (options.priority) {
      jql += ` AND priority = "${options.priority}"`;
    }

    jql += ' ORDER BY created DESC';

    this.logger.debug(`Built JQL query: ${jql}`);
    return jql;
  }

  /**
   * Конвертировать Jira задачи в Kanban формат
   */
  private convertToKanbanSummary(jiraTasks: JiraTask[]): KanbanTaskSummary[] {
    return jiraTasks.map((task) => ({
      id: task.id,
      key: task.key,
      summary: task.fields.summary,
      status: {
        id: task.fields.status.id,
        name: task.fields.status.name,
        categoryKey: task.fields.status.statusCategory?.key || 'unknown',
      },
      assignee: task.fields.assignee
        ? {
            accountId: task.fields.assignee.accountId,
            displayName: task.fields.assignee.displayName,
          }
        : undefined,
      priority: {
        id: task.fields.priority?.id || 'unknown',
        name: task.fields.priority?.name || 'Unknown',
      },
      issueType: {
        id: task.fields.issuetype.id,
        name: task.fields.issuetype.name,
      },
      created: task.fields.created,
      updated: task.fields.updated,
      duedate: task.fields.duedate,
      labels: task.fields.labels || [],
    }));
  }
}
