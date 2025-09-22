import { Controller, Get, Param } from '@nestjs/common';
import { GetTaskTransitionsService } from './get-task-transitions.service';
import { TransitionResponse } from './get-task-transitions.interface';

@Controller('jira')
export class GetTaskTransitionsController {
  constructor(
    private readonly getTaskTransitionsService: GetTaskTransitionsService,
  ) {}

  /**
   * Получить доступные переходы для задачи
   */
  @Get('tasks/:taskKey/transitions')
  async getTaskTransitions(
    @Param('taskKey') taskKey: string,
  ): Promise<TransitionResponse[]> {
    return this.getTaskTransitionsService.getAvailableTransitions(taskKey);
  }
}
