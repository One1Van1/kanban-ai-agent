import { Injectable } from '@nestjs/common';
import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { GetColumnTasksResponse } from './get-column-tasks.interface';
import {
  TaskFilterOptions,
  KanbanTaskSummary,
} from '../../../types/kanban-column.interface';
import { JiraTask } from '../../../types/jira-task.interface';

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
      description: this.extractDescription(task.fields.description),
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

  /**
   * Извлекает текстовое описание из Jira description объекта
   */
  private extractDescription(descriptionObj: any): string | undefined {
    console.log('=== DESCRIPTION DEBUG ===');
    console.log(
      'Raw description object:',
      JSON.stringify(descriptionObj, null, 2),
    );

    if (!descriptionObj || !descriptionObj.content) {
      console.log('No description content found');
      return undefined;
    }

    let text = '';
    for (const contentItem of descriptionObj.content) {
      if (contentItem.type === 'paragraph' && contentItem.content) {
        for (const textItem of contentItem.content) {
          if (textItem.type === 'text' && textItem.text) {
            text += textItem.text + ' ';
          }
        }
      }
    }

    const result = text.trim() || undefined;
    console.log('Extracted text:', result);
    console.log('=== END DESCRIPTION DEBUG ===');
    return result;
  }
}
