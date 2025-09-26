import { Injectable, Logger } from '@nestjs/common';
import { JiraTimeService } from './jira-time.service';
import {
  ITrackWorkTimeService,
  IWorkTimeTracking,
  IStatusTime,
  IWorklogEntry,
  ITimeEfficiency,
  TIME_STANDARDS,
  EFFICIENCY_THRESHOLDS,
  WORK_STATUSES,
  TimeUtils,
} from './track-work-time.interface';

@Injectable()
export class TrackWorkTimeService implements ITrackWorkTimeService {
  private readonly logger = new Logger(TrackWorkTimeService.name);

  constructor(private readonly jiraTimeService: JiraTimeService) {}

  /**
   * Получить полную информацию о времени работы над задачей
   */
  async getWorkTimeTracking(
    taskKey: string,
    startDate?: string,
    endDate?: string,
  ): Promise<IWorkTimeTracking> {
    try {
      this.logger.log(`⏰ Starting work time tracking for task: ${taskKey}`);

      // Получаем базовую информацию о задаче
      const taskInfo = await this.jiraTimeService.getTaskInfo(taskKey);

      // Получаем историю статусов и worklog параллельно
      const [statusHistory, worklogEntries] = await Promise.all([
        this.getStatusHistory(taskKey),
        this.getWorklogEntries(taskKey),
      ]);

      // Рассчитываем общее время работы
      const totalMinutes = this.calculateTotalWorkTime(
        statusHistory,
        worklogEntries,
      );

      // Анализируем эффективность
      const efficiency = await this.analyzeTimeEfficiency(
        totalMinutes,
        taskInfo.summary,
      );

      const result: IWorkTimeTracking = {
        taskKey,
        totalMinutes,
        statusHistory,
        worklogEntries,
        efficiency,
        createdAt: taskInfo.created,
        updatedAt: taskInfo.updated,
        currentStatus: taskInfo.status.name,
      };

      this.logger.log(
        `✅ Work time tracking completed for ${taskKey}: ${totalMinutes} minutes total`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `❌ Failed to track work time for ${taskKey}:`,
        error.message,
      );
      throw error;
    }
  }

  /**
   * Получить историю статусов задачи
   */
  async getStatusHistory(taskKey: string): Promise<IStatusTime[]> {
    try {
      this.logger.log(`📋 Analyzing status history for: ${taskKey}`);

      const taskInfo = await this.jiraTimeService.getTaskInfo(taskKey);
      const transitions =
        await this.jiraTimeService.getStatusTransitions(taskKey);

      const statusHistory: IStatusTime[] = [];

      // Добавляем начальный статус (при создании задачи)
      if (transitions.length === 0) {
        // Если нет переходов, задача осталась в исходном статусе
        statusHistory.push({
          statusName: taskInfo.status.name,
          statusId: taskInfo.status.id,
          enteredAt: taskInfo.created,
          exitedAt: null,
          durationMinutes: TimeUtils.getMinutesBetween(
            taskInfo.created,
            new Date().toISOString(),
          ),
        });
      } else {
        // Обрабатываем все переходы
        for (let i = 0; i < transitions.length; i++) {
          const transition = transitions[i];
          const nextTransition = transitions[i + 1];

          const enteredAt = i === 0 ? taskInfo.created : transition.timestamp;
          const exitedAt = nextTransition ? nextTransition.timestamp : null;

          const durationMinutes = exitedAt
            ? TimeUtils.getMinutesBetween(enteredAt, exitedAt)
            : TimeUtils.getMinutesBetween(enteredAt, new Date().toISOString());

          statusHistory.push({
            statusName: transition.statusName,
            statusId: transition.statusId,
            enteredAt,
            exitedAt,
            durationMinutes,
          });
        }
      }

      this.logger.log(
        `📊 Analyzed ${statusHistory.length} status periods for ${taskKey}`,
      );
      return statusHistory;
    } catch (error) {
      this.logger.error(
        `❌ Failed to get status history for ${taskKey}:`,
        error.message,
      );
      throw error;
    }
  }

  /**
   * Получить worklog записи задачи
   */
  async getWorklogEntries(taskKey: string): Promise<IWorklogEntry[]> {
    try {
      this.logger.log(`⏰ Processing worklog entries for: ${taskKey}`);

      const rawWorklogs = await this.jiraTimeService.getTaskWorklog(taskKey);

      const worklogEntries: IWorklogEntry[] = rawWorklogs.map((worklog) => ({
        id: worklog.id,
        author: worklog.author?.displayName || 'Unknown',
        started: worklog.started,
        timeSpentSeconds: worklog.timeSpentSeconds,
        timeSpentMinutes: TimeUtils.secondsToMinutes(worklog.timeSpentSeconds),
        comment: worklog.comment || null,
      }));

      this.logger.log(
        `⏰ Processed ${worklogEntries.length} worklog entries for ${taskKey}`,
      );
      return worklogEntries;
    } catch (error) {
      this.logger.error(
        `❌ Failed to get worklog entries for ${taskKey}:`,
        error.message,
      );
      throw error;
    }
  }

  /**
   * Анализировать эффективность времени
   */
  async analyzeTimeEfficiency(
    totalMinutes: number,
    taskSummary?: string,
  ): Promise<ITimeEfficiency> {
    try {
      // Определяем тип стрижки из summary
      const haircutType = taskSummary
        ? TimeUtils.detectHaircutType(taskSummary)
        : 'обычная стрижка';
      const standard = TIME_STANDARDS[haircutType];

      this.logger.log(
        `📊 Analyzing efficiency: ${totalMinutes}min for ${haircutType} (standard: ${standard.min}-${standard.max}min)`,
      );

      // Рассчитываем эффективность относительно оптимального времени
      const efficiencyRatio = totalMinutes / standard.optimal;

      let efficiency: 'excellent' | 'good' | 'acceptable' | 'slow';
      const recommendations: string[] = [];

      if (efficiencyRatio <= EFFICIENCY_THRESHOLDS.EXCELLENT) {
        efficiency = 'excellent';
        recommendations.push('Превосходная скорость работы!');
        recommendations.push('Работа выполнена быстрее оптимального времени');
      } else if (efficiencyRatio <= EFFICIENCY_THRESHOLDS.GOOD) {
        efficiency = 'good';
        recommendations.push('Хорошая скорость работы');
        recommendations.push('Уложился в оптимальные временные рамки');
      } else if (efficiencyRatio <= EFFICIENCY_THRESHOLDS.ACCEPTABLE) {
        efficiency = 'acceptable';
        recommendations.push('Приемлемая скорость работы');
        if (totalMinutes > standard.max) {
          recommendations.push('Время превысило максимальный норматив');
        }
      } else {
        efficiency = 'slow';
        recommendations.push('Работа выполнена медленно');
        recommendations.push('Рекомендуется проанализировать причины задержки');
        recommendations.push('Возможно, задача была сложнее ожидаемого');
      }

      const efficiencyPercentage = Math.round(
        (standard.optimal / totalMinutes) * 100,
      );

      const result: ITimeEfficiency = {
        totalWorkMinutes: totalMinutes,
        expectedRange: `${standard.min}-${standard.max} мин`,
        efficiency,
        efficiencyPercentage,
        recommendations,
      };

      this.logger.log(
        `📊 Efficiency analysis: ${efficiency} (${efficiencyPercentage}%)`,
      );
      return result;
    } catch (error) {
      this.logger.error('❌ Failed to analyze time efficiency:', error.message);

      // Возвращаем базовый анализ при ошибке
      return {
        totalWorkMinutes: totalMinutes,
        expectedRange: '30-60 мин',
        efficiency: 'acceptable',
        efficiencyPercentage: 100,
        recommendations: ['Анализ эффективности недоступен'],
      };
    }
  }

  /**
   * Рассчитать общее время работы
   */
  private calculateTotalWorkTime(
    statusHistory: IStatusTime[],
    worklogEntries: IWorklogEntry[],
  ): number {
    // Метод 1: Время из worklog (более точно, если ведется)
    const worklogTotal = worklogEntries.reduce(
      (total, entry) => total + entry.timeSpentMinutes,
      0,
    );

    // Метод 2: Время в рабочих статусах
    const statusTotal = statusHistory
      .filter((status) => WORK_STATUSES.includes(status.statusName as any))
      .reduce((total, status) => total + status.durationMinutes, 0);

    this.logger.log(
      `⏰ Time calculation: Worklog=${worklogTotal}min, Status=${statusTotal}min`,
    );

    // Используем worklog если есть записи, иначе время из статусов
    return worklogTotal > 0 ? worklogTotal : statusTotal;
  }

  /**
   * Проверка состояния сервиса
   */
  async healthCheck(): Promise<{ status: string; jira: boolean }> {
    try {
      const jiraHealth = await this.jiraTimeService.healthCheck();

      return {
        status: jiraHealth ? 'healthy' : 'degraded',
        jira: jiraHealth,
      };
    } catch (error) {
      this.logger.error('❌ Health check failed:', error.message);
      return {
        status: 'unhealthy',
        jira: false,
      };
    }
  }
}
