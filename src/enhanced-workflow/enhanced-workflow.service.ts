import { Injectable, Logger } from '@nestjs/common';
import { WebhookService } from '../webhook/webhook.service';
import { AIAnalysisService } from '../ai-analysis/ai-analysis.service';
import { KanbanService } from '../kanban/kanban.service';
import { TaskExecutorService } from '../task-executor/task-executor.service';
import {
  EnhancedTaskInfo,
  EnhancedAIAnalysisResult,
  EnhancedExecutionPlan,
  EnhancedExecutionResult,
  EnhancedTaskStatus,
  EnhancedAIDecision,
  WorkflowEvent,
  WorkflowEventType,
} from './types';

@Injectable()
export class EnhancedWorkflowService {
  private readonly logger = new Logger(EnhancedWorkflowService.name);

  constructor(
    private readonly webhookService: WebhookService,
    private readonly aiAnalysisService: AIAnalysisService,
    private readonly kanbanService: KanbanService,
    private readonly taskExecutorService: TaskExecutorService,
  ) {}

  /**
   * Обрабатывает задачу, перемещенную в колонку NEW
   * Главная точка входа для расширенного workflow
   */
  async processTaskMovedToNew(taskInfo: EnhancedTaskInfo): Promise<void> {
    this.logger.log(
      `🎯 Enhanced Workflow: Processing task ${taskInfo.taskKey} moved to NEW`,
    );

    try {
      // Регистрируем событие
      await this.logWorkflowEvent({
        eventId: `${taskInfo.taskKey}-moved-to-new-${Date.now()}`,
        eventType: WorkflowEventType.TASK_MOVED_TO_NEW,
        taskKey: taskInfo.taskKey,
        timestamp: new Date(),
        details: { taskInfo },
        source: 'enhanced-workflow',
      });

      // Выполняем расширенный AI анализ
      const aiAnalysis = await this.performEnhancedAIAnalysis(taskInfo);

      // Логируем анализ
      await this.logWorkflowEvent({
        eventId: `${taskInfo.taskKey}-analyzed-${Date.now()}`,
        eventType: WorkflowEventType.TASK_ANALYZED,
        taskKey: taskInfo.taskKey,
        timestamp: new Date(),
        details: { aiAnalysis },
        source: 'enhanced-workflow',
      });

      // Принимаем решение на основе анализа
      await this.handleAIAnalysisResult(taskInfo, aiAnalysis);
    } catch (error) {
      this.logger.error(
        `❌ Error processing task ${taskInfo.taskKey}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Выполняет расширенный AI анализ задачи
   */
  private async performEnhancedAIAnalysis(
    taskInfo: EnhancedTaskInfo,
  ): Promise<EnhancedAIAnalysisResult> {
    this.logger.log(
      `🤖 Performing enhanced AI analysis for ${taskInfo.taskKey}`,
    );

    try {
      // Используем существующий AI сервис для базового анализа
      const basicAnalysis = await this.aiAnalysisService.analyzeTask({
        title: taskInfo.title,
        description: taskInfo.description,
        priority: taskInfo.priority,
        labels: taskInfo.labels || [],
      });

      // Расширяем анализ дополнительной логикой
      const enhancedAnalysis = await this.enhanceBasicAnalysis(
        taskInfo,
        basicAnalysis,
      );

      this.logger.log(
        `✅ Enhanced AI analysis complete for ${taskInfo.taskKey}: ${enhancedAnalysis.decision}`,
      );
      return enhancedAnalysis;
    } catch (error) {
      this.logger.warn(
        `⚠️ AI analysis failed for ${taskInfo.taskKey}, using fallback`,
      );

      // Fallback анализ
      return this.createFallbackAnalysis(taskInfo);
    }
  }

  /**
   * Расширяет базовый анализ дополнительной логикой
   */
  private async enhanceBasicAnalysis(
    taskInfo: EnhancedTaskInfo,
    basicAnalysis: any,
  ): Promise<EnhancedAIAnalysisResult> {
    // Проверяем, может ли задача быть выполнена автоматически
    const executionPlan = this.taskExecutorService.analyzeTaskForExecution(
      taskInfo.taskKey,
      taskInfo.title,
      taskInfo.description,
    );

    const canExecuteAutomatically = executionPlan !== null;

    // Определяем сложность
    const complexity = this.determineTaskComplexity(taskInfo);

    // Определяем решение
    let decision: EnhancedAIDecision;
    if (basicAnalysis.decision === 'questions') {
      decision = EnhancedAIDecision.NEEDS_CLARIFICATION;
    } else if (canExecuteAutomatically && complexity === 'simple') {
      decision = EnhancedAIDecision.EXECUTABLE;
    } else {
      decision = EnhancedAIDecision.MANUAL_REVIEW;
    }

    return {
      decision,
      reasoning: `${basicAnalysis.reasoning}. Executable: ${canExecuteAutomatically}, Complexity: ${complexity}`,
      confidence: basicAnalysis.confidence || 85,
      suggestedAction: this.getSuggestedAction(
        decision,
        canExecuteAutomatically,
      ),
      estimatedComplexity: complexity,
      canExecuteAutomatically,
      requiredClarifications:
        decision === EnhancedAIDecision.NEEDS_CLARIFICATION
          ? this.extractRequiredClarifications(taskInfo)
          : undefined,
    };
  }

  /**
   * Создает fallback анализ при недоступности AI
   */
  private createFallbackAnalysis(
    taskInfo: EnhancedTaskInfo,
  ): EnhancedAIAnalysisResult {
    const isEntityTask =
      taskInfo.title.toLowerCase().includes('сущность') ||
      taskInfo.title.toLowerCase().includes('entity');

    return {
      decision: isEntityTask
        ? EnhancedAIDecision.EXECUTABLE
        : EnhancedAIDecision.MANUAL_REVIEW,
      reasoning: 'Fallback analysis: based on keyword detection',
      confidence: 60,
      suggestedAction: isEntityTask
        ? 'Auto-execute entity creation'
        : 'Requires manual review',
      estimatedComplexity: isEntityTask ? 'simple' : 'medium',
      canExecuteAutomatically: isEntityTask,
    };
  }

  /**
   * Определяет сложность задачи
   */
  private determineTaskComplexity(
    taskInfo: EnhancedTaskInfo,
  ): 'simple' | 'medium' | 'complex' {
    const text = `${taskInfo.title} ${taskInfo.description}`.toLowerCase();

    // Простые задачи
    if (text.includes('создать сущность') || text.includes('create entity')) {
      return 'simple';
    }

    // Сложные задачи
    if (
      text.includes('интеграция') ||
      text.includes('рефакторинг') ||
      text.includes('миграция')
    ) {
      return 'complex';
    }

    return 'medium';
  }

  /**
   * Получает рекомендуемое действие
   */
  private getSuggestedAction(
    decision: EnhancedAIDecision,
    canExecute: boolean,
  ): string {
    switch (decision) {
      case EnhancedAIDecision.EXECUTABLE:
        return 'Execute automatically and move to In Progress';
      case EnhancedAIDecision.NEEDS_CLARIFICATION:
        return 'Move to Questions for clarification';
      case EnhancedAIDecision.MANUAL_REVIEW:
        return canExecute
          ? 'Review before execution'
          : 'Requires manual implementation';
      default:
        return 'Manual review required';
    }
  }

  /**
   * Извлекает требуемые уточнения
   */
  private extractRequiredClarifications(taskInfo: EnhancedTaskInfo): string[] {
    const clarifications: string[] = [];

    if (!taskInfo.description || taskInfo.description.length < 20) {
      clarifications.push('Требуется более подробное описание задачи');
    }

    if (!taskInfo.priority || taskInfo.priority === 'undefined') {
      clarifications.push('Не указан приоритет задачи');
    }

    return clarifications;
  }

  /**
   * Обрабатывает результат AI анализа
   */
  private async handleAIAnalysisResult(
    taskInfo: EnhancedTaskInfo,
    aiAnalysis: EnhancedAIAnalysisResult,
  ): Promise<void> {
    this.logger.log(
      `📋 Handling AI analysis result for ${taskInfo.taskKey}: ${aiAnalysis.decision}`,
    );

    switch (aiAnalysis.decision) {
      case EnhancedAIDecision.EXECUTABLE:
        await this.executeTaskAutomatically(taskInfo, aiAnalysis);
        break;

      case EnhancedAIDecision.NEEDS_CLARIFICATION:
        await this.moveToQuestions(taskInfo, aiAnalysis);
        break;

      case EnhancedAIDecision.MANUAL_REVIEW:
        await this.scheduleManualReview(taskInfo, aiAnalysis);
        break;
    }
  }

  /**
   * Выполняет задачу автоматически
   */
  private async executeTaskAutomatically(
    taskInfo: EnhancedTaskInfo,
    aiAnalysis: EnhancedAIAnalysisResult,
  ): Promise<void> {
    this.logger.log(`🚀 Auto-executing task ${taskInfo.taskKey}`);

    try {
      // Получаем план выполнения
      const executionPlan = this.taskExecutorService.analyzeTaskForExecution(
        taskInfo.taskKey,
        taskInfo.title,
        taskInfo.description,
      );

      if (!executionPlan) {
        this.logger.warn(
          `⚠️ No execution plan for ${taskInfo.taskKey}, moving to manual review`,
        );
        await this.scheduleManualReview(taskInfo, aiAnalysis);
        return;
      }

      // Выполняем задачу
      const executionResults =
        await this.taskExecutorService.executeTask(executionPlan);

      // Логируем выполнение
      await this.logWorkflowEvent({
        eventId: `${taskInfo.taskKey}-executed-${Date.now()}`,
        eventType: WorkflowEventType.TASK_EXECUTED,
        taskKey: taskInfo.taskKey,
        timestamp: new Date(),
        details: { executionResults, executionPlan },
        source: 'enhanced-workflow',
      });

      // Проверяем успешность
      const allSuccessful = executionResults.every((result) => result.success);

      if (allSuccessful) {
        this.logger.log(
          `✅ Task ${taskInfo.taskKey} executed successfully, moving to Review`,
        );
        await this.moveToReview(taskInfo, executionResults);
      } else {
        this.logger.warn(
          `⚠️ Task ${taskInfo.taskKey} execution failed, moving to manual review`,
        );
        await this.scheduleManualReview(taskInfo, aiAnalysis);
      }
    } catch (error) {
      this.logger.error(
        `❌ Error executing task ${taskInfo.taskKey}: ${error.message}`,
      );
      await this.scheduleManualReview(taskInfo, aiAnalysis);
    }
  }

  /**
   * Перемещает задачу в Questions
   */
  private async moveToQuestions(
    taskInfo: EnhancedTaskInfo,
    aiAnalysis: EnhancedAIAnalysisResult,
  ): Promise<void> {
    this.logger.log(`❓ Moving task ${taskInfo.taskKey} to Questions`);

    // Логируем событие
    await this.logWorkflowEvent({
      eventId: `${taskInfo.taskKey}-to-questions-${Date.now()}`,
      eventType: WorkflowEventType.TASK_NEEDS_CLARIFICATION,
      taskKey: taskInfo.taskKey,
      timestamp: new Date(),
      details: {
        reason: aiAnalysis.reasoning,
        clarifications: aiAnalysis.requiredClarifications,
      },
      source: 'enhanced-workflow',
    });

    // TODO: Интеграция с StatusTransitionService
    this.logger.log(
      `📝 Task ${taskInfo.taskKey} needs clarification: ${aiAnalysis.requiredClarifications?.join(', ')}`,
    );
  }

  /**
   * Перемещает задачу в Review
   */
  private async moveToReview(
    taskInfo: EnhancedTaskInfo,
    executionResults: any[],
  ): Promise<void> {
    this.logger.log(`📋 Moving task ${taskInfo.taskKey} to Review`);

    // Логируем событие
    await this.logWorkflowEvent({
      eventId: `${taskInfo.taskKey}-to-review-${Date.now()}`,
      eventType: WorkflowEventType.TASK_MOVED_TO_REVIEW,
      taskKey: taskInfo.taskKey,
      timestamp: new Date(),
      details: { executionResults },
      source: 'enhanced-workflow',
    });

    // TODO: Интеграция с StatusTransitionService
    this.logger.log(`✅ Task ${taskInfo.taskKey} ready for review`);
  }

  /**
   * Планирует ручную проверку
   */
  private async scheduleManualReview(
    taskInfo: EnhancedTaskInfo,
    aiAnalysis: EnhancedAIAnalysisResult,
  ): Promise<void> {
    this.logger.log(`👤 Scheduling manual review for task ${taskInfo.taskKey}`);

    // Логируем событие
    await this.logWorkflowEvent({
      eventId: `${taskInfo.taskKey}-manual-review-${Date.now()}`,
      eventType: WorkflowEventType.TASK_MOVED_TO_REVIEW,
      taskKey: taskInfo.taskKey,
      timestamp: new Date(),
      details: { reason: 'Manual review required', aiAnalysis },
      source: 'enhanced-workflow',
    });
  }

  /**
   * Логирует событие workflow
   */
  private async logWorkflowEvent(event: WorkflowEvent): Promise<void> {
    this.logger.log(
      `📊 Workflow Event: ${event.eventType} for ${event.taskKey}`,
    );
    // TODO: Сохранение в базу данных или отправка в внешние системы
  }
}
