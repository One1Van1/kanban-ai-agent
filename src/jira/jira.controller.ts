import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { TaskFetcherService } from './task-fetcher.service';
import { TaskStatusManagerService } from './task-status-manager.service';
import { JiraService } from './jira.service';
import { TaskFilterOptions } from './types/kanban-column.interface';

@Controller('jira')
export class JiraController {
  constructor(
    private readonly jiraService: JiraService,
    private readonly taskFetcher: TaskFetcherService,
    private readonly statusManager: TaskStatusManagerService,
  ) {}

  /**
   * Проверить подключение к Jira
   */
  @Get('health')
  async checkHealth() {
    const isConnected = await this.jiraService.testConnection();
    return {
      status: isConnected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Получить задачи из колонки
   */
  @Get('columns/:columnName/tasks')
  async getTasksFromColumn(
    @Param('columnName') columnName: string,
    @Query('maxResults') maxResults?: number,
    @Query('assignee') assigneeId?: string,
    @Query('priority') priority?: string,
  ) {
    const options: TaskFilterOptions = {
      maxResults: maxResults ? parseInt(maxResults.toString()) : 10,
      assigneeId,
      priority,
    };

    return this.taskFetcher.getTasksFromColumn(columnName, options);
  }

  /**
   * Получить конкретную задачу
   */
  @Get('tasks/:taskKey')
  async getTask(@Param('taskKey') taskKey: string) {
    return this.jiraService.getTask(taskKey);
  }

  /**
   * Переместить задачу в другую колонку
   */
  @Post('tasks/:taskKey/move')
  async moveTask(
    @Param('taskKey') taskKey: string,
    @Body() body: { targetStatus: string; comment?: string },
  ) {
    return this.statusManager.moveTaskToColumn(
      taskKey,
      body.targetStatus,
      body.comment,
    );
  }

  /**
   * Получить доступные переходы для задачи
   */
  @Get('tasks/:taskKey/transitions')
  async getTaskTransitions(@Param('taskKey') taskKey: string) {
    return this.statusManager.getAvailableTransitions(taskKey);
  }

  /**
   * Поиск задач по JQL
   */
  @Post('search')
  async searchTasks(@Body() body: { jql: string; maxResults?: number }) {
    return this.taskFetcher.searchTasksSimple(body.jql, {
      maxResults: body.maxResults || 20,
    });
  }
}
