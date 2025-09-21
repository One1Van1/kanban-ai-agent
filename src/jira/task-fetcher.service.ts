import { Injectable, Logger } from '@nestjs/common';
import { JiraService } from './jira.service';
import { JiraTask, JiraTaskSearchResult } from './types/jira-task.interface';
import {
  KanbanColumnFilter,
  TaskFilterOptions,
  KanbanTaskSummary,
  ColumnTasksResult,
  KanbanBoardState,
  BoardColumnMapping,
} from './types/kanban-column.interface';

@Injectable()
export class TaskFetcherService {
  private readonly logger = new Logger(TaskFetcherService.name);

  constructor(private readonly jiraService: JiraService) {}

  /**
   * Получить задачи из конкретной колонки по имени статуса
   */
  async getTasksFromColumn(
    columnName: string,
    options: TaskFilterOptions = {},
  ): Promise<ColumnTasksResult> {
    try {
      const jql = this.buildJQLQuery(columnName, options);
      const searchResult = await this.jiraService.searchTasks(
        jql,
        options.maxResults || 50,
        options.startAt || 0,
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
   * Получить задачи из нескольких колонок одновременно
   */
  async getTasksFromMultipleColumns(
    columns: KanbanColumnFilter[],
    options: TaskFilterOptions = {},
  ): Promise<ColumnTasksResult[]> {
    const results = await Promise.allSettled(
      columns.map((column) =>
        this.getTasksByStatusNames(
          column.statusNames || [column.columnName],
          options,
        ),
      ),
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return {
          columnName: columns[index].columnName,
          ...result.value,
        };
      } else {
        this.logger.error(
          `Failed to fetch tasks from column "${columns[index].columnName}":`,
          result.reason,
        );
        return {
          columnName: columns[index].columnName,
          tasks: [],
          totalCount: 0,
          hasMore: false,
        };
      }
    });
  }

  /**
   * Получить полное состояние Kanban доски
   */
  async getBoardState(
    boardId: number,
    columnMapping: BoardColumnMapping,
  ): Promise<KanbanBoardState> {
    try {
      const columnNames = Object.keys(columnMapping);
      const columnFilters: KanbanColumnFilter[] = columnNames.map((name) => ({
        columnName: name,
        statusNames: columnMapping[name].jiraStatusNames,
      }));

      const columnResults =
        await this.getTasksFromMultipleColumns(columnFilters);

      const columns: KanbanBoardState['columns'] = {};
      let totalTasks = 0;

      for (const result of columnResults) {
        const config = columnMapping[result.columnName];
        const taskCount = result.tasks.length;
        totalTasks += taskCount;

        columns[result.columnName] = {
          tasks: result.tasks,
          taskCount,
          hasLimit: !!config.maxTasksLimit,
          limitValue: config.maxTasksLimit,
          isOverLimit: config.maxTasksLimit
            ? taskCount > config.maxTasksLimit
            : false,
        };
      }

      return {
        boardId,
        boardName: `Board ${boardId}`, // TODO: получать реальное имя доски
        columns,
        lastUpdated: new Date().toISOString(),
        totalTasks,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get board state for board ${boardId}:`,
        error.message,
      );
      throw error;
    }
  }

  /**
   * Найти задачи по JQL запросу с упрощенным результатом
   */
  async searchTasksSimple(
    jql: string,
    options: TaskFilterOptions = {},
  ): Promise<KanbanTaskSummary[]> {
    try {
      const searchResult = await this.jiraService.searchTasks(
        jql,
        options.maxResults || 50,
        options.startAt || 0,
      );

      return this.convertToKanbanSummary(searchResult.issues);
    } catch (error) {
      this.logger.error(
        `Failed to search tasks with JQL "${jql}":`,
        error.message,
      );
      throw error;
    }
  }

  /**
   * Получить задачи конкретного пользователя из определенных колонок
   */
  async getUserTasksFromColumns(
    assigneeId: string,
    statusNames: string[],
    options: TaskFilterOptions = {},
  ): Promise<KanbanTaskSummary[]> {
    const statusFilter = statusNames.map((status) => `"${status}"`).join(', ');
    const jql = `assignee = "${assigneeId}" AND status IN (${statusFilter}) ${this.buildJQLFilters(options)}`;

    return this.searchTasksSimple(jql, options);
  }

  /**
   * Получить задачи по приоритету из колонок
   */
  async getTasksByPriority(
    priority: string,
    statusNames: string[],
    options: TaskFilterOptions = {},
  ): Promise<KanbanTaskSummary[]> {
    const statusFilter = statusNames.map((status) => `"${status}"`).join(', ');
    const jql = `priority = "${priority}" AND status IN (${statusFilter}) ${this.buildJQLFilters(options)}`;

    return this.searchTasksSimple(jql, options);
  }

  /**
   * Получить просроченные задачи
   */
  async getOverdueTasks(
    statusNames: string[],
    options: TaskFilterOptions = {},
  ): Promise<KanbanTaskSummary[]> {
    const statusFilter = statusNames.map((status) => `"${status}"`).join(', ');
    const jql = `duedate < now() AND status IN (${statusFilter}) ${this.buildJQLFilters(options)}`;

    return this.searchTasksSimple(jql, options);
  }

  // Приватные методы

  private async getTasksByStatusNames(
    statusNames: string[],
    options: TaskFilterOptions = {},
  ): Promise<Omit<ColumnTasksResult, 'columnName'>> {
    const statusFilter = statusNames.map((status) => `"${status}"`).join(', ');
    const jql = `status IN (${statusFilter}) ${this.buildJQLFilters(options)}`;

    const searchResult = await this.jiraService.searchTasks(
      jql,
      options.maxResults || 50,
      options.startAt || 0,
    );

    const tasks = this.convertToKanbanSummary(searchResult.issues);

    return {
      tasks,
      totalCount: searchResult.total,
      hasMore:
        searchResult.startAt + searchResult.maxResults < searchResult.total,
      nextStartAt: searchResult.startAt + searchResult.maxResults,
    };
  }

  private buildJQLQuery(
    columnName: string,
    options: TaskFilterOptions,
  ): string {
    let jql = `status = "${columnName}"`;
    jql += this.buildJQLFilters(options);

    const orderBy = options.orderBy || 'created';
    const direction = options.orderDirection || 'ASC';
    jql += ` ORDER BY ${orderBy} ${direction}`;

    return jql;
  }

  private buildJQLFilters(options: TaskFilterOptions): string {
    const filters: string[] = [];

    if (options.projectKey) {
      filters.push(`project = "${options.projectKey}"`);
    }

    if (options.assigneeId) {
      filters.push(`assignee = "${options.assigneeId}"`);
    }

    if (options.priority) {
      filters.push(`priority = "${options.priority}"`);
    }

    if (options.issueType) {
      filters.push(`issuetype = "${options.issueType}"`);
    }

    if (options.labels && options.labels.length > 0) {
      const labelFilter = options.labels
        .map((label) => `"${label}"`)
        .join(', ');
      filters.push(`labels IN (${labelFilter})`);
    }

    return filters.length > 0 ? ` AND ${filters.join(' AND ')}` : '';
  }

  private convertToKanbanSummary(tasks: JiraTask[]): KanbanTaskSummary[] {
    return tasks.map((task) => ({
      id: task.id,
      key: task.key,
      summary: task.fields.summary,
      status: {
        id: task.fields.status.id,
        name: task.fields.status.name,
        categoryKey: task.fields.status.statusCategory.key,
      },
      assignee: task.fields.assignee
        ? {
            accountId: task.fields.assignee.accountId,
            displayName: task.fields.assignee.displayName,
          }
        : undefined,
      priority: {
        id: task.fields.priority.id,
        name: task.fields.priority.name,
      },
      issueType: {
        id: task.fields.issuetype.id,
        name: task.fields.issuetype.name,
      },
      created: task.fields.created,
      updated: task.fields.updated,
      duedate: task.fields.duedate,
      labels: task.fields.labels,
    }));
  }
}
