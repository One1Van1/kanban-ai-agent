import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { GetTaskService } from './get-task.service';
import { GetTaskResponse } from './get-task.interface';

@ApiTags('tasks')
@Controller('jira')
export class GetTaskController {
  constructor(private readonly getTaskService: GetTaskService) {}

  /**
   * Получить конкретную задачу
   */
  @Get('tasks/:taskKey')
  @ApiOperation({
    summary: 'Получить информацию о задаче',
    description: 'Возвращает подробную информацию о задаче по её ключу',
  })
  @ApiParam({
    name: 'taskKey',
    description: 'Ключ задачи в Jira',
    example: 'KAN-5',
  })
  @ApiResponse({
    status: 200,
    description: 'Информация о задаче получена',
    schema: {
      example: {
        key: 'KAN-5',
        fields: {
          summary: 'Название задачи',
          status: { name: 'Done' },
          assignee: { displayName: 'John Doe' },
        },
      },
    },
  })
  async getTask(@Param('taskKey') taskKey: string): Promise<GetTaskResponse> {
    return this.getTaskService.getTaskByKey(taskKey);
  }
}
