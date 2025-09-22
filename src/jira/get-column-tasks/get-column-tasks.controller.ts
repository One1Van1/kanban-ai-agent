import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetColumnTasksService } from './get-column-tasks.service';
import { GetColumnTasksResponse } from './get-column-tasks.interface';
import { TaskFilterOptions } from '../types/kanban-column.interface';

@Controller('jira')
export class GetColumnTasksController {
  constructor(private readonly getColumnTasksService: GetColumnTasksService) {}

  /**
   * Получить задачи из колонки
   */
  @Get('columns/:columnName/tasks')
  async getTasksFromColumn(
    @Param('columnName') columnName: string,
    @Query('maxResults') maxResults?: number,
    @Query('assignee') assigneeId?: string,
    @Query('priority') priority?: string,
  ): Promise<GetColumnTasksResponse> {
    const options: TaskFilterOptions = {
      maxResults: maxResults ? parseInt(maxResults.toString()) : 10,
      assigneeId,
      priority,
    };

    return this.getColumnTasksService.getTasksFromColumn(columnName, options);
  }
}
