import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExecuteTasksService } from './execute-tasks.service';
import { ExecuteTasksResponse } from './execute-tasks.interface';

@ApiTags('ai-agent')
@Controller('ai-agent')
export class ExecuteTasksController {
  constructor(private readonly executeTasksService: ExecuteTasksService) {}

  /**
   * Выполнить задачи из колонки In Progress
   */
  @Post('execute-tasks')
  @ApiOperation({
    summary: 'Выполнить задачи',
    description:
      'Выполняет все задачи из колонки In Progress. Агент анализирует задачи и выполняет их (создает файлы, код и т.д.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Результат выполнения задач',
    schema: {
      example: {
        tasksExecuted: 2,
        successfulExecutions: 1,
        results: [
          {
            taskKey: 'KAN-5',
            executed: true,
            success: true,
            reason:
              'Entity Order created with fields: id, userId, totalAmount, status',
            filesCreated: ['/path/to/order.entity.ts'],
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Ошибка выполнения',
  })
  async executeTasks(): Promise<ExecuteTasksResponse> {
    return this.executeTasksService.executeTasks();
  }
}
