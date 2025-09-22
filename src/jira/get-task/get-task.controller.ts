import { Controller, Get, Param } from '@nestjs/common';
import { GetTaskService } from './get-task.service';
import { GetTaskResponse } from './get-task.interface';

@Controller('jira')
export class GetTaskController {
  constructor(private readonly getTaskService: GetTaskService) {}

  /**
   * Получить конкретную задачу
   */
  @Get('tasks/:taskKey')
  async getTask(@Param('taskKey') taskKey: string): Promise<GetTaskResponse> {
    return this.getTaskService.getTaskByKey(taskKey);
  }
}
