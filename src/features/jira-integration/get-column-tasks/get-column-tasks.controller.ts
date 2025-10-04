import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { GetColumnTasksService } from './get-column-tasks.service';
import { GetColumnTasksResponse } from './get-column-tasks.interface';
import { TaskFilterOptions } from '../../../types/kanban-column.interface';

@ApiTags('columns')
@Controller('jira')
export class GetColumnTasksController {
  constructor(private readonly getColumnTasksService: GetColumnTasksService) {}

  /**
   * Получить задачи из колонки
   */
  @Get('columns/:columnName/tasks')
  @ApiOperation({
    summary: 'Получить задачи из колонки',
    description:
      'Возвращает список задач находящихся в указанной колонке (статусе)',
  })
  @ApiParam({
    name: 'columnName',
    description: 'Название колонки (статуса)',
    example: 'In Progress',
    enum: ['New', 'backlog', 'Questions', 'In Progress', 'Review', 'Done'],
  })
  @ApiQuery({
    name: 'maxResults',
    description: 'Максимальное количество задач',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'assignee',
    description: 'ID исполнителя для фильтрации',
    required: false,
  })
  @ApiQuery({
    name: 'priority',
    description: 'Приоритет для фильтрации',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Список задач из колонки',
    schema: {
      example: {
        columnName: 'In Progress',
        tasks: [
          {
            key: 'KAN-5',
            summary: 'Название задачи',
            status: { name: 'In Progress' },
          },
        ],
        totalCount: 1,
        hasMore: false,
      },
    },
  })
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
