import { Injectable, Logger } from '@nestjs/common';
import { EnhancedWorkflowService } from '../enhanced-workflow/enhanced-workflow.service';
import { StatusTransitionService } from '../status-transitions/status-transition.service';
import { JiraWebhookDto } from '../dto/webhook.dto';
import {
  EnhancedTaskInfo,
  EnhancedTaskStatus,
  WorkflowEvent,
  WorkflowEventType,
  WorkflowStatistics,
} from '../enhanced-workflow/types';

@Injectable()
export class WorkflowOrchestratorService {
  private readonly logger = new Logger(WorkflowOrchestratorService.name);
  private workflowStats: WorkflowStatistics = {
    totalTasksProcessed: 0,
    autoExecutedTasks: 0,
    tasksNeedingClarification: 0,
    averageExecutionTime: 0,
    successRate: 0,
    lastUpdated: new Date(),
  };

  constructor(
    private readonly enhancedWorkflowService: EnhancedWorkflowService,
    private readonly statusTransitionService: StatusTransitionService,
  ) {}

  /**
   * Главная точка входа для обработки Jira webhook'ов в рамках расширенного workflow
   */
  async handleJiraWebhook(payload: JiraWebhookDto): Promise<void> {
    this.logger.log(
      `🎯 Orchestrator: Processing Jira webhook for ${payload.issue.key}`,
    );

    try {
      // Определяем тип события
      const eventType = this.determineEventType(payload);

      if (!eventType) {
        this.logger.log(
          `⏭️ Skipping irrelevant event: ${payload.webhookEvent}`,
        );
        return;
      }

      // Извлекаем информацию о задаче
      const taskInfo = this.extractEnhancedTaskInfo(payload);

      // Обрабатываем событие
      await this.processWorkflowEvent(eventType, taskInfo);

      // Обновляем статистику
      this.updateStatistics();
    } catch (error) {
      this.logger.error(
        `❌ Orchestrator error for ${payload.issue.key}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Определяет тип события для расширенного workflow
   */
  private determineEventType(
    payload: JiraWebhookDto,
  ): WorkflowEventType | null {
    // Проверяем тип события и статус задачи
    const webhookEvent = payload.webhookEvent;
    const currentStatus = this.mapJiraStatusToEnhanced(
      payload.issue.fields.status.name,
    );

    if (
      webhookEvent === 'jira:issue_created' &&
      currentStatus === EnhancedTaskStatus.NEW
    ) {
      return WorkflowEventType.TASK_MOVED_TO_NEW;
    }

    if (webhookEvent === 'jira:issue_updated') {
      // Проверяем, изменился ли статус
      const changelog = (payload as any).changelog;
      if (changelog?.items?.some((item: any) => item.field === 'status')) {
        // Если задача переместилась в NEW из Backlog
        if (currentStatus === EnhancedTaskStatus.NEW) {
          return WorkflowEventType.TASK_MOVED_TO_NEW;
        }
      }
    }

    return null; // Событие не относится к нашему workflow
  }

  /**
   * Извлекает расширенную информацию о задаче
   */
  private extractEnhancedTaskInfo(payload: JiraWebhookDto): EnhancedTaskInfo {
    const now = new Date();

    return {
      taskKey: payload.issue.key,
      title: payload.issue.fields.summary,
      description: payload.issue.fields.description || '',
      currentStatus: this.mapJiraStatusToEnhanced(
        payload.issue.fields.status.name,
      ),
      priority: payload.issue.fields.priority?.name || 'Medium',
      assignee: payload.issue.fields.assignee?.displayName,
      labels: payload.issue.fields.labels || [],
      createdAt: now, // Используем текущее время, так как поля нет в DTO
      updatedAt: now, // Используем текущее время, так как поля нет в DTO
    };
  }

  /**
   * Маппит статусы Jira к расширенным статусам
   */
  private mapJiraStatusToEnhanced(jiraStatus: string): EnhancedTaskStatus {
    const statusMap: Record<string, EnhancedTaskStatus> = {
      Backlog: EnhancedTaskStatus.BACKLOG,
      'To Do': EnhancedTaskStatus.NEW,
      Open: EnhancedTaskStatus.NEW,
      New: EnhancedTaskStatus.NEW,
      Questions: EnhancedTaskStatus.QUESTIONS,
      'In Progress': EnhancedTaskStatus.IN_PROGRESS,
      Review: EnhancedTaskStatus.REVIEW,
      Done: EnhancedTaskStatus.DONE,
      Closed: EnhancedTaskStatus.DONE,
    };

    return statusMap[jiraStatus] || EnhancedTaskStatus.NEW;
  }

  /**
   * Обрабатывает событие workflow
   */
  private async processWorkflowEvent(
    eventType: WorkflowEventType,
    taskInfo: EnhancedTaskInfo,
  ): Promise<void> {
    this.logger.log(
      `🔄 Processing workflow event: ${eventType} for ${taskInfo.taskKey}`,
    );

    switch (eventType) {
      case WorkflowEventType.TASK_MOVED_TO_NEW:
        await this.handleTaskMovedToNew(taskInfo);
        break;

      default:
        this.logger.warn(`🤷 Unknown workflow event type: ${eventType}`);
    }
  }

  /**
   * Обрабатывает перемещение задачи в NEW
   */
  private async handleTaskMovedToNew(
    taskInfo: EnhancedTaskInfo,
  ): Promise<void> {
    this.logger.log(`📥 Handling task moved to NEW: ${taskInfo.taskKey}`);

    try {
      const startTime = Date.now();

      // Передаем управление в EnhancedWorkflowService
      await this.enhancedWorkflowService.processTaskMovedToNew(taskInfo);

      const executionTime = Date.now() - startTime;
      this.updateExecutionStats(executionTime);

      this.logger.log(
        `✅ Task ${taskInfo.taskKey} processed successfully in ${executionTime}ms`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to process task ${taskInfo.taskKey}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Интеграция с StatusTransitionService для выполнения переходов
   */
  async performStatusTransition(
    taskKey: string,
    fromStatus: EnhancedTaskStatus,
    toStatus: EnhancedTaskStatus,
    reason: string,
    triggeredBy: 'ai' | 'user' | 'system' = 'system',
  ): Promise<void> {
    this.logger.log(
      `🔄 Orchestrating status transition: ${taskKey} ${fromStatus} → ${toStatus}`,
    );

    try {
      const transition = await this.statusTransitionService.performTransition(
        taskKey,
        fromStatus,
        toStatus,
        reason,
        triggeredBy,
      );

      this.logger.log(
        `✅ Status transition completed: ${transition.transitionType}`,
      );
    } catch (error) {
      this.logger.error(`❌ Status transition failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Получает статистику workflow
   */
  getWorkflowStatistics(): WorkflowStatistics {
    return { ...this.workflowStats };
  }

  /**
   * Сбрасывает статистику workflow
   */
  resetStatistics(): void {
    this.workflowStats = {
      totalTasksProcessed: 0,
      autoExecutedTasks: 0,
      tasksNeedingClarification: 0,
      averageExecutionTime: 0,
      successRate: 0,
      lastUpdated: new Date(),
    };
    this.logger.log('📊 Workflow statistics reset');
  }

  /**
   * Обновляет общую статистику
   */
  private updateStatistics(): void {
    this.workflowStats.totalTasksProcessed++;
    this.workflowStats.lastUpdated = new Date();
  }

  /**
   * Обновляет статистику выполнения
   */
  private updateExecutionStats(executionTime: number): void {
    const currentAvg = this.workflowStats.averageExecutionTime;
    const totalTasks = this.workflowStats.totalTasksProcessed;

    // Обновляем среднее время выполнения
    this.workflowStats.averageExecutionTime =
      (currentAvg * (totalTasks - 1) + executionTime) / totalTasks;
  }

  /**
   * Увеличивает счетчик автоматически выполненных задач
   */
  incrementAutoExecutedTasks(): void {
    this.workflowStats.autoExecutedTasks++;
    this.updateSuccessRate();
  }

  /**
   * Увеличивает счетчик задач, требующих уточнений
   */
  incrementTasksNeedingClarification(): void {
    this.workflowStats.tasksNeedingClarification++;
  }

  /**
   * Обновляет процент успешности
   */
  private updateSuccessRate(): void {
    if (this.workflowStats.totalTasksProcessed > 0) {
      this.workflowStats.successRate =
        (this.workflowStats.autoExecutedTasks /
          this.workflowStats.totalTasksProcessed) *
        100;
    }
  }

  /**
   * Проверяет здоровье системы workflow
   */
  async performHealthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: Record<string, any>;
  }> {
    const stats = this.getWorkflowStatistics();

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    const details: Record<string, any> = {
      totalTasksProcessed: stats.totalTasksProcessed,
      successRate: stats.successRate,
      averageExecutionTime: stats.averageExecutionTime,
    };

    // Определяем состояние системы
    if (stats.successRate < 50) {
      status = 'unhealthy';
      details.reason = 'Low success rate';
    } else if (stats.successRate < 80) {
      status = 'degraded';
      details.reason = 'Below optimal success rate';
    }

    if (stats.averageExecutionTime > 30000) {
      // 30 секунд
      status = status === 'healthy' ? 'degraded' : 'unhealthy';
      details.reason = `High execution time: ${stats.averageExecutionTime}ms`;
    }

    this.logger.log(`🏥 Health check: ${status}`);
    return { status, details };
  }
}
