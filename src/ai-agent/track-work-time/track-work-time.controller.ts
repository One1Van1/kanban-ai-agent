import {
  Controller,
  Get,
  Param,
  Query,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TrackWorkTimeService } from './track-work-time.service';
import { TrackWorkTimeResultDto } from './track-work-time.dto';

@ApiTags('AI Agent - Work Time Tracking')
@Controller('ai-agent/track-work-time')
export class TrackWorkTimeController {
  private readonly logger = new Logger(TrackWorkTimeController.name);

  constructor(private readonly trackWorkTimeService: TrackWorkTimeService) {}

  @Get(':taskKey')
  @ApiOperation({
    summary: 'Трекинг времени работы над задачей',
    description:
      'Анализирует время работы над задачей на основе статусов Jira и worklog записей',
  })
  @ApiParam({
    name: 'taskKey',
    description: 'Ключ задачи в Jira',
    example: 'KAN-123',
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Начальная дата для расчета (ISO format)',
    example: '2025-09-26T08:00:00.000Z',
    required: false,
  })
  @ApiQuery({
    name: 'endDate',
    description: 'Конечная дата для расчета (ISO format)',
    example: '2025-09-26T17:00:00.000Z',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Анализ времени работы успешно выполнен',
    type: TrackWorkTimeResultDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Задача не найдена',
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервера или недоступность Jira API',
  })
  async trackWorkTime(
    @Param('taskKey') taskKey: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<TrackWorkTimeResultDto> {
    try {
      this.logger.log(
        `⏰ Received work time tracking request for task: ${taskKey}`,
      );

      // Валидация параметров
      if (!taskKey || taskKey.trim().length === 0) {
        throw new Error('Task key is required');
      }

      // Валидация дат если предоставлены
      if (startDate && !this.isValidISODate(startDate)) {
        throw new Error('Invalid startDate format. Use ISO 8601 format');
      }

      if (endDate && !this.isValidISODate(endDate)) {
        throw new Error('Invalid endDate format. Use ISO 8601 format');
      }

      // Получаем трекинг времени
      const tracking = await this.trackWorkTimeService.getWorkTimeTracking(
        taskKey,
        startDate,
        endDate,
      );

      // Формируем успешный ответ
      const result: TrackWorkTimeResultDto = {
        success: true,
        taskKey: tracking.taskKey,
        totalMinutes: tracking.totalMinutes,
        statusHistory: tracking.statusHistory,
        worklogEntries: tracking.worklogEntries,
        efficiency: tracking.efficiency,
        createdAt: tracking.createdAt,
        updatedAt: tracking.updatedAt,
        currentStatus: tracking.currentStatus,
      };

      this.logger.log(
        `✅ Work time tracking completed for ${taskKey}: ${tracking.totalMinutes} minutes, efficiency: ${tracking.efficiency.efficiency}`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `❌ Work time tracking failed for ${taskKey}:`,
        error.message,
      );

      // Возвращаем структурированную ошибку
      const errorResult: TrackWorkTimeResultDto = {
        success: false,
        taskKey,
        totalMinutes: 0,
        statusHistory: [],
        worklogEntries: [],
        efficiency: {
          totalWorkMinutes: 0,
          expectedRange: 'Неизвестно',
          efficiency: 'acceptable',
          efficiencyPercentage: 0,
          recommendations: ['Анализ недоступен из-за ошибки'],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentStatus: 'Unknown',
        error: error.message,
      };

      // Определяем HTTP статус по типу ошибки
      if (
        error.message.includes('not found') ||
        error.message.includes('404')
      ) {
        throw new HttpException(errorResult, HttpStatus.NOT_FOUND);
      } else if (
        error.message.includes('Invalid') ||
        error.message.includes('required') ||
        error.message.includes('format')
      ) {
        throw new HttpException(errorResult, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(errorResult, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Get('health')
  @ApiOperation({
    summary: 'Проверка состояния сервиса трекинга времени',
    description: 'Проверяет доступность Jira API и готовность сервиса к работе',
  })
  @ApiResponse({
    status: 200,
    description: 'Статус сервиса',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'healthy' },
        jira: { type: 'boolean', example: true },
        timestamp: { type: 'string', example: '2025-09-26T02:00:00.000Z' },
      },
    },
  })
  async healthCheck() {
    try {
      const health = await this.trackWorkTimeService.healthCheck();

      return {
        ...health,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('❌ Health check endpoint failed:', error.message);

      return {
        status: 'error',
        jira: false,
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  @Get(':taskKey/status-history')
  @ApiOperation({
    summary: 'История статусов задачи',
    description: 'Получает детальную информацию о времени в каждом статусе',
  })
  @ApiParam({
    name: 'taskKey',
    description: 'Ключ задачи в Jira',
    example: 'KAN-123',
  })
  @ApiResponse({
    status: 200,
    description: 'История статусов получена',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          statusName: { type: 'string', example: 'In Progress' },
          statusId: { type: 'string', example: '10002' },
          enteredAt: { type: 'string', example: '2025-09-26T08:00:00.000Z' },
          exitedAt: {
            type: 'string',
            example: '2025-09-26T09:30:00.000Z',
            nullable: true,
          },
          durationMinutes: { type: 'number', example: 90 },
        },
      },
    },
  })
  async getStatusHistory(@Param('taskKey') taskKey: string) {
    try {
      this.logger.log(`📋 Getting status history for task: ${taskKey}`);

      const statusHistory =
        await this.trackWorkTimeService.getStatusHistory(taskKey);

      this.logger.log(
        `✅ Retrieved ${statusHistory.length} status periods for ${taskKey}`,
      );
      return statusHistory;
    } catch (error) {
      this.logger.error(
        `❌ Failed to get status history for ${taskKey}:`,
        error.message,
      );
      throw new HttpException(
        { error: error.message, taskKey },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':taskKey/worklog')
  @ApiOperation({
    summary: 'Worklog записи задачи',
    description: 'Получает все worklog записи для задачи',
  })
  @ApiParam({
    name: 'taskKey',
    description: 'Ключ задачи в Jira',
    example: 'KAN-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Worklog записи получены',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '12345' },
          author: { type: 'string', example: 'john.doe' },
          started: { type: 'string', example: '2025-09-26T08:00:00.000Z' },
          timeSpentSeconds: { type: 'number', example: 5400 },
          timeSpentMinutes: { type: 'number', example: 90 },
          comment: {
            type: 'string',
            example: 'Работал над задачей',
            nullable: true,
          },
        },
      },
    },
  })
  async getWorklog(@Param('taskKey') taskKey: string) {
    try {
      this.logger.log(`⏰ Getting worklog for task: ${taskKey}`);

      const worklog =
        await this.trackWorkTimeService.getWorklogEntries(taskKey);

      this.logger.log(
        `✅ Retrieved ${worklog.length} worklog entries for ${taskKey}`,
      );
      return worklog;
    } catch (error) {
      this.logger.error(
        `❌ Failed to get worklog for ${taskKey}:`,
        error.message,
      );
      throw new HttpException(
        { error: error.message, taskKey },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Валидация ISO даты
   */
  private isValidISODate(dateString: string): boolean {
    const date = new Date(dateString);
    return (
      date instanceof Date && !isNaN(date.getTime()) && dateString.includes('T')
    );
  }
}
