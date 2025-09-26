import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
  Logger,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProcessBeforeAfterTaskService } from './process-before-after-task.service';
import {
  ProcessBeforeAfterTaskDto,
  ProcessBeforeAfterTaskResultDto,
  ProcessStatusDto,
  ProcessStatusResultDto,
  TaskProcessStatusDto,
} from './process-before-after-task.dto';
import {
  ProcessTaskConfig,
  ProcessServiceHealthCheck,
} from './process-before-after-task.interface';

@ApiTags('AI Agent - Process Before/After Tasks')
@Controller('ai-agent/process-before-after-task')
export class ProcessBeforeAfterTaskController {
  private readonly logger = new Logger(ProcessBeforeAfterTaskController.name);

  constructor(private readonly processService: ProcessBeforeAfterTaskService) {}

  /**
   * Запустить полный процесс анализа задачи "до и после" стрижки
   */
  @Post('/')
  @ApiOperation({
    summary: 'Запустить полный процесс анализа задачи',
    description: `
    Запускает полный процесс анализа задачи "до и после" стрижки:
    1. Анализ фотографий через Claude Vision API
    2. Анализ времени работы через Jira API
    3. Создание сводного анализа
    4. Добавление комментария в задачу (опционально)
    
    Процесс может занять до 1-2 минут в зависимости от размера фотографий.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Процесс анализа завершен успешно',
    type: ProcessBeforeAfterTaskResultDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные параметры запроса',
  })
  @ApiResponse({
    status: 404,
    description: 'Задача не найдена или нет доступа',
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервера при обработке',
  })
  async processTask(
    @Body() processDto: ProcessBeforeAfterTaskDto,
  ): Promise<ProcessBeforeAfterTaskResultDto> {
    this.logger.log(`Запрос на обработку задачи ${processDto.taskKey}`);

    try {
      const config: ProcessTaskConfig = {
        forcePhotoAnalysis: processDto.forcePhotoAnalysis || false,
        forceTimeUpdate: processDto.forceTimeUpdate || false,
        addCommentToTask: processDto.addCommentToTask !== false, // По умолчанию true
        timeoutMs: 120000, // 2 минуты
      };

      const result = await this.processService.processBeforeAfterTask(
        processDto.taskKey,
        config,
      );

      // Преобразуем в DTO формат
      const response: ProcessBeforeAfterTaskResultDto = {
        taskKey: result.taskKey,
        processedAt: result.processedAt.toISOString(),
        success: result.success,
        photoAnalysis: {
          success: result.photoAnalysis.success,
          category: result.photoAnalysis.category,
          qualityScore: result.photoAnalysis.qualityScore,
          description: result.photoAnalysis.description,
          recommendations: result.photoAnalysis.recommendations,
          error: result.photoAnalysis.error,
        },
        timeAnalysis: {
          success: result.timeAnalysis.success,
          totalMinutes: result.timeAnalysis.totalMinutes,
          efficiency: result.timeAnalysis.efficiency,
          efficiencyPercentage: result.timeAnalysis.efficiencyPercentage,
          expectedRange: result.timeAnalysis.expectedRange,
          recommendations: result.timeAnalysis.recommendations,
          error: result.timeAnalysis.error,
        },
        combinedAnalysis: result.combinedAnalysis,
        commentId: result.commentId,
        errors: result.errors,
      };

      this.logger.log(
        `Обработка задачи ${processDto.taskKey} завершена, успех: ${result.success}`,
      );
      return response;
    } catch (error) {
      this.logger.error(
        `Ошибка обработки задачи ${processDto.taskKey}: ${error.message}`,
        error.stack,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Не удалось обработать задачу: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Запустить обработку одной задачи по ключу (упрощенный метод)
   */
  @Post('/:taskKey')
  @ApiOperation({
    summary: 'Запустить обработку задачи по ключу',
    description:
      'Упрощенный метод для запуска обработки конкретной задачи с параметрами по умолчанию',
  })
  @ApiParam({
    name: 'taskKey',
    description: 'Ключ задачи в Jira',
    example: 'HAIR-123',
  })
  @ApiQuery({
    name: 'forcePhoto',
    description: 'Принудительно обновить анализ фотографий',
    required: false,
    type: Boolean,
  })
  @ApiQuery({
    name: 'forceTime',
    description: 'Принудительно обновить анализ времени',
    required: false,
    type: Boolean,
  })
  @ApiQuery({
    name: 'addComment',
    description: 'Добавить комментарий в задачу',
    required: false,
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'Обработка задачи завершена',
    type: ProcessBeforeAfterTaskResultDto,
  })
  async processTaskByKey(
    @Param('taskKey') taskKey: string,
    @Query('forcePhoto') forcePhoto?: boolean,
    @Query('forceTime') forceTime?: boolean,
    @Query('addComment') addComment?: boolean,
  ): Promise<ProcessBeforeAfterTaskResultDto> {
    this.logger.log(
      `Запрос на обработку задачи ${taskKey} через упрощенный метод`,
    );

    const processDto: ProcessBeforeAfterTaskDto = {
      taskKey,
      forcePhotoAnalysis: forcePhoto || false,
      forceTimeUpdate: forceTime || false,
      addCommentToTask: addComment !== false,
    };

    return this.processTask(processDto);
  }

  /**
   * Получить статус обработки задач
   */
  @Post('/status')
  @ApiOperation({
    summary: 'Получить статус обработки задач',
    description:
      'Возвращает текущий статус обработки для указанного списка задач',
  })
  @ApiResponse({
    status: 200,
    description: 'Статус обработки получен успешно',
    type: ProcessStatusResultDto,
  })
  async getProcessStatus(
    @Body() statusDto: ProcessStatusDto,
  ): Promise<ProcessStatusResultDto> {
    this.logger.log(`Запрос статуса для ${statusDto.taskKeys.length} задач`);

    try {
      const states = this.processService.getProcessingStatus(
        statusDto.taskKeys,
      );

      const tasks: TaskProcessStatusDto[] = states.map((state) => ({
        taskKey: state.taskKey,
        status: state.status,
        lastProcessedAt: state.lastProcessedAt?.toISOString(),
        lastResult: state.result
          ? `${state.result.success ? 'Успешно' : 'С ошибками'}: качество ${state.result.photoAnalysis.qualityScore}/10, эффективность ${state.result.timeAnalysis.efficiency}`
          : undefined,
        lastError:
          state.errors.length > 0
            ? state.errors[state.errors.length - 1]
            : undefined,
      }));

      const result: ProcessStatusResultDto = {
        totalTasks: tasks.length,
        completedTasks: tasks.filter((t) => t.status === 'completed').length,
        failedTasks: tasks.filter((t) => t.status === 'failed').length,
        notProcessedTasks: tasks.filter((t) => t.status === 'not_processed')
          .length,
        tasks,
      };

      return result;
    } catch (error) {
      this.logger.error(`Ошибка получения статуса: ${error.message}`);
      throw new HttpException(
        'Не удалось получить статус обработки',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Получить статус одной задачи
   */
  @Get('/:taskKey/status')
  @ApiOperation({
    summary: 'Получить статус обработки одной задачи',
    description: 'Возвращает детальный статус обработки конкретной задачи',
  })
  @ApiParam({
    name: 'taskKey',
    description: 'Ключ задачи в Jira',
    example: 'HAIR-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Статус задачи получен успешно',
    type: TaskProcessStatusDto,
  })
  async getTaskStatus(
    @Param('taskKey') taskKey: string,
  ): Promise<TaskProcessStatusDto> {
    this.logger.log(`Запрос статуса задачи ${taskKey}`);

    const states = this.processService.getProcessingStatus([taskKey]);
    const state = states[0];

    return {
      taskKey: state.taskKey,
      status: state.status,
      lastProcessedAt: state.lastProcessedAt?.toISOString(),
      lastResult: state.result
        ? `${state.result.success ? 'Успешно' : 'С ошибками'}: качество ${state.result.photoAnalysis.qualityScore}/10, эффективность ${state.result.timeAnalysis.efficiency}`
        : undefined,
      lastError:
        state.errors.length > 0
          ? state.errors[state.errors.length - 1]
          : undefined,
    };
  }

  /**
   * Проверка здоровья сервиса
   */
  @Get('/health')
  @ApiOperation({
    summary: 'Проверка здоровья сервиса обработки задач',
    description: 'Возвращает статус здоровья сервиса и всех его зависимостей',
  })
  @ApiResponse({
    status: 200,
    description: 'Статус здоровья получен успешно',
  })
  async healthCheck(): Promise<ProcessServiceHealthCheck> {
    return this.processService.healthCheck();
  }

  /**
   * Получить метрики производительности сервиса
   */
  @Get('/metrics')
  @ApiOperation({
    summary: 'Получить метрики производительности',
    description:
      'Возвращает метрики производительности сервиса обработки задач',
  })
  @ApiResponse({
    status: 200,
    description: 'Метрики получены успешно',
  })
  async getMetrics(): Promise<any> {
    const health = await this.processService.healthCheck();
    return {
      metrics: health.metrics,
      cache: health.cache,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Очистить кэш обработанных задач
   */
  @Post('/cache/clear')
  @ApiOperation({
    summary: 'Очистить кэш обработанных задач',
    description:
      'Удаляет все кэшированные состояния обработки задач старше 24 часов',
  })
  @ApiResponse({
    status: 200,
    description: 'Кэш успешно очищен',
  })
  async clearCache(): Promise<{ message: string; timestamp: string }> {
    this.logger.log('Запрос на очистку кэша состояний обработки');

    this.processService.cleanupOldStates();

    return {
      message: 'Кэш состояний обработки успешно очищен',
      timestamp: new Date().toISOString(),
    };
  }
}
