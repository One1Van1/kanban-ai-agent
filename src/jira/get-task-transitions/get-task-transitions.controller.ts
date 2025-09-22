import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { GetTaskTransitionsService } from './get-task-transitions.service';
import { TransitionResponse } from './get-task-transitions.interface';

@ApiTags('tasks')
@Controller('jira')
export class GetTaskTransitionsController {
  constructor(
    private readonly getTaskTransitionsService: GetTaskTransitionsService,
  ) {}

  /**
   * Получить доступные переходы для задачи
   */
  @Get('tasks/:taskKey/transitions')
  @ApiOperation({
    summary: 'Получить доступные переходы для задачи',
    description:
      'Возвращает список всех возможных статусов, в которые можно переместить задачу',
  })
  @ApiParam({
    name: 'taskKey',
    description: 'Ключ задачи в Jira',
    example: 'KAN-5',
  })
  @ApiResponse({
    status: 200,
    description: 'Список доступных переходов',
    schema: {
      example: [
        {
          id: '2',
          name: 'backlog',
          toStatusName: 'backlog',
          isAvailable: true,
        },
      ],
    },
  })
  async getTaskTransitions(
    @Param('taskKey') taskKey: string,
  ): Promise<TransitionResponse[]> {
    return this.getTaskTransitionsService.getAvailableTransitions(taskKey);
  }
}
