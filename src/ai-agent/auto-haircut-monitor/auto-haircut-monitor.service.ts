import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AnalyzeHaircutTasksService } from '../analyze-haircut-tasks/analyze-haircut-tasks.service';
import {
  StartAutoHaircutMonitorDto,
  UpdateMonitorSettingsDto,
} from './auto-haircut-monitor.dto';
import {
  AutoHaircutMonitorResponse,
  AutoHaircutMonitorStatusResponse,
  HaircutMonitorSettings,
} from './auto-haircut-monitor.interface';

@Injectable()
export class AutoHaircutMonitorService {
  private readonly logger = new Logger(AutoHaircutMonitorService.name);
  private isMonitoring = false;
  private settings: HaircutMonitorSettings = {
    checkIntervalSeconds: 30,
    enabled: false,
  };
  private totalChecks = 0;
  private totalTasksProcessed = 0;
  private lastCheckTime?: Date;
  private monitorInterval?: NodeJS.Timeout;

  constructor(
    private readonly analyzeHaircutTasksService: AnalyzeHaircutTasksService,
  ) {}

  async startMonitoring(
    dto: StartAutoHaircutMonitorDto,
  ): Promise<AutoHaircutMonitorResponse> {
    this.logger.log('🔄 Starting auto haircut monitor...');

    // Обновляем настройки
    this.settings = {
      checkIntervalSeconds: dto.checkIntervalSeconds || 30,
      enabled: true,
    };

    // Останавливаем предыдущий мониторинг если он был
    this.stopMonitoring();

    // Запускаем новый мониторинг
    this.isMonitoring = true;
    this.startPeriodicCheck();

    this.logger.log(
      `✅ Auto haircut monitor started with ${this.settings.checkIntervalSeconds}s interval`,
    );

    return {
      monitoringStarted: true,
      message: 'Auto haircut monitoring started successfully',
      checkIntervalSeconds: this.settings.checkIntervalSeconds,
    };
  }

  async stopMonitoring(): Promise<void> {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = undefined;
    }
    this.isMonitoring = false;
    this.settings.enabled = false;
    this.logger.log('🛑 Auto haircut monitor stopped');
  }

  async getStatus(): Promise<AutoHaircutMonitorStatusResponse> {
    return {
      isRunning: this.isMonitoring,
      lastCheckTime: this.lastCheckTime?.toISOString(),
      totalChecks: this.totalChecks,
      totalTasksProcessed: this.totalTasksProcessed,
    };
  }

  async updateSettings(
    dto: UpdateMonitorSettingsDto,
  ): Promise<AutoHaircutMonitorResponse> {
    if (dto.enabled !== undefined) {
      this.settings.enabled = dto.enabled;
    }

    if (dto.checkIntervalSeconds !== undefined) {
      this.settings.checkIntervalSeconds = dto.checkIntervalSeconds;
    }

    // Если мониторинг был включен и настройки изменились, перезапускаем
    if (this.settings.enabled && this.isMonitoring) {
      await this.stopMonitoring();
      await this.startMonitoring({
        checkIntervalSeconds: this.settings.checkIntervalSeconds,
      });
    } else if (!this.settings.enabled) {
      await this.stopMonitoring();
    }

    return {
      monitoringStarted: this.isMonitoring,
      message: 'Monitor settings updated successfully',
      checkIntervalSeconds: this.settings.checkIntervalSeconds,
    };
  }

  private startPeriodicCheck(): void {
    this.monitorInterval = setInterval(async () => {
      if (this.settings.enabled) {
        await this.checkNewTasksAndProcess();
      }
    }, this.settings.checkIntervalSeconds * 1000);

    // Делаем первую проверку сразу
    this.checkNewTasksAndProcess();
  }

  private async checkNewTasksAndProcess(): Promise<void> {
    try {
      this.logger.log('🔍 Checking New column for haircut tasks...');
      this.totalChecks++;
      this.lastCheckTime = new Date();

      // Запускаем анализ задач о стрижках
      const result = await this.analyzeHaircutTasksService.execute({
        sourceColumn: 'New',
      });

      if (result.tasksAnalyzed > 0) {
        this.totalTasksProcessed += result.tasksMoved;
        this.logger.log(
          `✨ Processed ${result.tasksMoved}/${result.tasksAnalyzed} haircut tasks from New column`,
        );
      } else {
        this.logger.debug('💤 No tasks found in New column');
      }
    } catch (error) {
      this.logger.error(
        '❌ Error during automatic haircut task processing:',
        error,
      );
    }
  }

  // Дополнительная cron-задача для резервного мониторинга (каждые 5 минут)
  // ВРЕМЕННО ОТКЛЮЧЕН для тестирования
  // @Cron(CronExpression.EVERY_5_MINUTES)
  async handleBackupMonitoring(): Promise<void> {
    if (this.settings.enabled && !this.isMonitoring) {
      this.logger.warn(
        '🔄 Backup cron detected stopped monitoring, restarting...',
      );
      await this.startMonitoring({
        checkIntervalSeconds: this.settings.checkIntervalSeconds,
      });
    }
  }
}
