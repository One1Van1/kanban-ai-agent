import { Controller, Post, Get, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AutoHaircutMonitorService } from './auto-haircut-monitor.service';
import {
  StartAutoHaircutMonitorDto,
  UpdateMonitorSettingsDto,
} from './auto-haircut-monitor.dto';
import {
  AutoHaircutMonitorResponse,
  AutoHaircutMonitorStatusResponse,
} from './auto-haircut-monitor.interface';

@ApiTags('ai-agent')
@Controller('ai-agent')
export class AutoHaircutMonitorController {
  constructor(
    private readonly autoHaircutMonitorService: AutoHaircutMonitorService,
  ) {}

  @Post('auto-haircut-monitor/start')
  @ApiOperation({
    summary: 'Запуск автоматического мониторинга задач о стрижках',
    description: `
      Запускает автоматический мониторинг колонки "New" для задач о стрижках.
      
      Функциональность:
      - Периодически проверяет колонку "New" на наличие новых задач
      - Автоматически запускает анализ задач о стрижках
      - Перемещает задачи в соответствующие колонки с комментариями
      
      Настройки:
      - Минимальный интервал проверки: 10 секунд
      - По умолчанию: 30 секунд
      - Резервный cron каждые 5 минут для восстановления мониторинга
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Автоматический мониторинг запущен успешно',
    schema: {
      example: {
        monitoringStarted: true,
        message: 'Auto haircut monitoring started successfully',
        checkIntervalSeconds: 30,
      },
    },
  })
  async startMonitoring(
    @Body() dto: StartAutoHaircutMonitorDto,
  ): Promise<AutoHaircutMonitorResponse> {
    return this.autoHaircutMonitorService.startMonitoring(dto);
  }

  @Post('auto-haircut-monitor/stop')
  @ApiOperation({
    summary: 'Остановка автоматического мониторинга',
    description: 'Останавливает автоматический мониторинг задач о стрижках',
  })
  @ApiResponse({
    status: 200,
    description: 'Мониторинг остановлен успешно',
  })
  async stopMonitoring(): Promise<{ message: string }> {
    await this.autoHaircutMonitorService.stopMonitoring();
    return { message: 'Auto haircut monitoring stopped successfully' };
  }

  @Get('auto-haircut-monitor/status')
  @ApiOperation({
    summary: 'Статус автоматического мониторинга',
    description: 'Получить текущий статус мониторинга задач о стрижках',
  })
  @ApiResponse({
    status: 200,
    description: 'Статус мониторинга получен успешно',
    schema: {
      example: {
        isRunning: true,
        lastCheckTime: '2025-09-22T22:50:00.000Z',
        totalChecks: 15,
        totalTasksProcessed: 3,
      },
    },
  })
  async getStatus(): Promise<AutoHaircutMonitorStatusResponse> {
    return this.autoHaircutMonitorService.getStatus();
  }

  @Patch('auto-haircut-monitor/settings')
  @ApiOperation({
    summary: 'Обновление настроек мониторинга',
    description:
      'Обновить настройки автоматического мониторинга (интервал, включение/выключение)',
  })
  @ApiResponse({
    status: 200,
    description: 'Настройки обновлены успешно',
  })
  async updateSettings(
    @Body() dto: UpdateMonitorSettingsDto,
  ): Promise<AutoHaircutMonitorResponse> {
    return this.autoHaircutMonitorService.updateSettings(dto);
  }
}
