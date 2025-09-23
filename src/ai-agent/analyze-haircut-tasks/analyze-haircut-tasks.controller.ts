import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyzeHaircutTasksService } from './analyze-haircut-tasks.service';
import { AnalyzeHaircutTasksDto } from './analyze-haircut-tasks.dto';
import { AnalyzeHaircutTasksResponse } from './analyze-haircut-tasks.interface';

@ApiTags('ai-agent')
@Controller('ai-agent')
export class AnalyzeHaircutTasksController {
  constructor(
    private readonly analyzeHaircutTasksService: AnalyzeHaircutTasksService,
  ) {}

  @Post('analyze-haircut-tasks')
  @ApiOperation({
    summary: 'Анализ задач о стрижках',
    description: `
      AI анализирует задачи в колонке "New", связанные с парикмахерскими услугами.
      
      Полные задачи (название + описание + фото) → перемещаются в "In Progress"
      Неполные задачи (только название) → перемещаются в "Questions" с комментарием
      
      Логика работы:
      - Проверяет наличие ключевых слов, связанных со стрижкой
      - Анализирует полноту информации (название, описание, вложения)
      - Автоматически перемещает задачи в соответствующие колонки
      - Добавляет комментарии к неполным задачам
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Анализ задач о стрижках выполнен успешно',
    schema: {
      example: {
        tasksAnalyzed: 2,
        tasksMoved: 2,
        results: [
          {
            taskKey: 'KAN-13',
            decision: 'move_to_progress',
            reason: 'Task has title, description and photo attachment',
            moved: true,
          },
          {
            taskKey: 'KAN-14',
            decision: 'move_to_questions',
            reason: 'Task has only title, missing description and/or photo',
            moved: true,
            commentAdded: 'Какую именно стрижку ты хочешь?',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Ошибка при анализе задач о стрижках',
  })
  async analyzeHaircutTasks(
    @Body() dto: AnalyzeHaircutTasksDto,
  ): Promise<AnalyzeHaircutTasksResponse> {
    return this.analyzeHaircutTasksService.execute(dto);
  }
}
