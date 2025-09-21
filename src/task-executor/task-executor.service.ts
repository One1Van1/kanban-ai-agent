import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JiraService } from '../jira/jira.service';
import { TaskStatusManagerService } from '../jira/task-status-manager.service';
import {
  AIAnalysisService,
  ExecutionPlan,
  ExecutionStep,
  TaskAnalysisResult,
} from '../ai-analysis/ai-analysis.service';
import { JiraTask } from '../jira/types/jira-task.interface';
import { KanbanTaskSummary } from '../jira/types/kanban-column.interface';

export interface TaskExecutionResult {
  taskKey: string;
  success: boolean;
  completedSteps: number;
  totalSteps: number;
  timeSpent: number; // в минутах
  errors: string[];
  results: string[];
  finalStatus?: string;
}

export interface ExecutionOptions {
  dryRun?: boolean;
  autoMoveOnSuccess?: boolean;
  targetStatusOnSuccess?: string;
  maxExecutionTime?: number; // в минутах
  requireApproval?: boolean;
}

@Injectable()
export class TaskExecutorService {
  private readonly logger = new Logger(TaskExecutorService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jiraService: JiraService,
    private readonly statusManager: TaskStatusManagerService,
    private readonly aiAnalysis: AIAnalysisService,
  ) {}

  /**
   * Выполнить задачу автоматически
   */
  async executeTask(
    task: JiraTask | KanbanTaskSummary,
    options: ExecutionOptions = {},
  ): Promise<TaskExecutionResult> {
    const startTime = Date.now();
    const result: TaskExecutionResult = {
      taskKey: task.key,
      success: false,
      completedSteps: 0,
      totalSteps: 0,
      timeSpent: 0,
      errors: [],
      results: [],
    };

    try {
      this.logger.log(`Starting execution of task ${task.key}`);

      // 1. Анализ задачи
      const analysis = await this.aiAnalysis.analyzeTask(task);

      if (!analysis.canAutoExecute && !options.dryRun) {
        throw new Error(
          'Task cannot be auto-executed according to AI analysis',
        );
      }

      // 2. Создание плана выполнения
      const plan = await this.aiAnalysis.createExecutionPlan(task);
      result.totalSteps = plan.steps.length;

      // 3. Проверка лимитов времени
      if (
        options.maxExecutionTime &&
        plan.totalEstimatedTime > options.maxExecutionTime
      ) {
        throw new Error(
          `Task execution time (${plan.totalEstimatedTime}min) exceeds limit (${options.maxExecutionTime}min)`,
        );
      }

      // 4. Запрос одобрения если требуется
      if (plan.requiresHumanApproval && options.requireApproval) {
        await this.requestHumanApproval(task, plan);
      }

      // 5. Выполнение шагов
      for (const step of plan.steps) {
        try {
          this.logger.log(`Executing step ${step.id}: ${step.description}`);

          const stepResult = await this.executeStep(step, options);
          result.results.push(`Step ${step.id}: ${stepResult}`);
          result.completedSteps++;

          // Добавляем комментарий о прогрессе
          if (!options.dryRun && result.completedSteps % 3 === 0) {
            await this.addProgressComment(
              task.key,
              result.completedSteps,
              result.totalSteps,
            );
          }
        } catch (error) {
          const errorMsg = `Step ${step.id} failed: ${error.message}`;
          this.logger.error(errorMsg);
          result.errors.push(errorMsg);

          // Останавливаемся при ошибке
          break;
        }
      }

      // 6. Определение успешности
      result.success =
        result.completedSteps === result.totalSteps &&
        result.errors.length === 0;

      // 7. Перемещение задачи при успехе
      if (
        result.success &&
        options.autoMoveOnSuccess &&
        options.targetStatusOnSuccess
      ) {
        const moveResult = await this.statusManager.moveTaskToColumn(
          task.key,
          options.targetStatusOnSuccess,
          `Task completed automatically. Executed ${result.completedSteps} steps successfully.`,
        );

        if (moveResult.success) {
          result.finalStatus = options.targetStatusOnSuccess;
        } else {
          result.errors.push(
            `Failed to move task to ${options.targetStatusOnSuccess}: ${moveResult.error}`,
          );
        }
      }

      result.timeSpent = Math.round((Date.now() - startTime) / (1000 * 60));

      this.logger.log(
        `Task ${task.key} execution completed: ${result.success ? 'SUCCESS' : 'FAILED'} (${result.timeSpent}min)`,
      );
    } catch (error) {
      result.errors.push(error.message);
      result.timeSpent = Math.round((Date.now() - startTime) / (1000 * 60));

      this.logger.error(`Task ${task.key} execution failed:`, error.message);
    }

    return result;
  }

  /**
   * Выполнить несколько задач в пакетном режиме
   */
  async executeBatch(
    tasks: (JiraTask | KanbanTaskSummary)[],
    options: ExecutionOptions = {},
  ): Promise<TaskExecutionResult[]> {
    this.logger.log(`Starting batch execution of ${tasks.length} tasks`);

    const results: TaskExecutionResult[] = [];

    for (const task of tasks) {
      try {
        const result = await this.executeTask(task, options);
        results.push(result);

        // Пауза между задачами
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        this.logger.error(
          `Batch execution failed for task ${task.key}:`,
          error.message,
        );
        results.push({
          taskKey: task.key,
          success: false,
          completedSteps: 0,
          totalSteps: 0,
          timeSpent: 0,
          errors: [error.message],
          results: [],
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    this.logger.log(
      `Batch execution completed: ${successCount}/${tasks.length} tasks successful`,
    );

    return results;
  }

  /**
   * Получить предварительный анализ задачи без выполнения
   */
  async previewTaskExecution(task: JiraTask | KanbanTaskSummary): Promise<{
    analysis: TaskAnalysisResult;
    plan: ExecutionPlan;
    canExecute: boolean;
    warnings: string[];
  }> {
    try {
      const analysis = await this.aiAnalysis.analyzeTask(task);
      const plan = await this.aiAnalysis.createExecutionPlan(task);

      const warnings: string[] = [];

      if (plan.riskLevel === 'high') {
        warnings.push('High risk execution - requires careful review');
      }

      if (plan.totalEstimatedTime > 60) {
        warnings.push(
          'Long execution time - consider breaking into smaller tasks',
        );
      }

      if (plan.requiresHumanApproval) {
        warnings.push('Requires human approval before execution');
      }

      return {
        analysis,
        plan,
        canExecute: analysis.canAutoExecute,
        warnings,
      };
    } catch (error) {
      this.logger.error(`Failed to preview task ${task.key}:`, error.message);
      throw error;
    }
  }

  // Приватные методы

  private async executeStep(
    step: ExecutionStep,
    options: ExecutionOptions,
  ): Promise<string> {
    if (options.dryRun) {
      return `DRY RUN: Would execute ${step.type} - ${step.description}`;
    }

    switch (step.type) {
      case 'file_creation':
        return this.executeFileCreation(step);

      case 'file_modification':
        return this.executeFileModification(step);

      case 'command_execution':
        return this.executeCommand(step);

      case 'api_call':
        return this.executeAPICall(step);

      case 'manual_review':
        return this.executeManualReview(step);

      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }

  private async executeFileCreation(step: ExecutionStep): Promise<string> {
    if (!step.filePath || !step.content) {
      throw new Error('File creation requires filePath and content');
    }

    // Здесь будет реальное создание файла
    this.logger.log(`Would create file: ${step.filePath}`);

    return `File created: ${step.filePath}`;
  }

  private async executeFileModification(step: ExecutionStep): Promise<string> {
    if (!step.filePath) {
      throw new Error('File modification requires filePath');
    }

    // Здесь будет реальная модификация файла
    this.logger.log(`Would modify file: ${step.filePath}`);

    return `File modified: ${step.filePath}`;
  }

  private async executeCommand(step: ExecutionStep): Promise<string> {
    if (!step.command) {
      throw new Error('Command execution requires command');
    }

    // Здесь будет реальное выполнение команды
    this.logger.log(`Would execute command: ${step.command}`);

    return `Command executed: ${step.command}`;
  }

  private async executeAPICall(step: ExecutionStep): Promise<string> {
    // Здесь будут API вызовы
    this.logger.log(`Would make API call: ${step.description}`);

    return `API call completed: ${step.description}`;
  }

  private async executeManualReview(step: ExecutionStep): Promise<string> {
    // Создаем запрос на ручную проверку
    this.logger.log(`Manual review required: ${step.description}`);

    return `Manual review step logged: ${step.description}`;
  }

  private async requestHumanApproval(
    task: JiraTask | KanbanTaskSummary,
    plan: ExecutionPlan,
  ): Promise<void> {
    const comment = `
🤖 AI Agent Request for Approval

Task: ${task.key}
Execution Plan: ${plan.steps.length} steps
Estimated Time: ${plan.totalEstimatedTime} minutes
Risk Level: ${plan.riskLevel}

Steps:
${plan.steps.map((step, i) => `${i + 1}. ${step.description} (${step.estimatedTime}min)`).join('\n')}

Reply with "APPROVED" to proceed with automatic execution.
    `;

    await this.jiraService.addComment(task.key, { body: comment });

    // В реальной реализации здесь будет ожидание одобрения
    this.logger.log(`Approval requested for task ${task.key}`);
  }

  private async addProgressComment(
    taskKey: string,
    completed: number,
    total: number,
  ): Promise<void> {
    const progress = Math.round((completed / total) * 100);
    const comment = `🤖 Execution Progress: ${completed}/${total} steps completed (${progress}%)`;

    try {
      await this.jiraService.addComment(taskKey, { body: comment });
    } catch (error) {
      this.logger.warn(
        `Failed to add progress comment to ${taskKey}:`,
        error.message,
      );
    }
  }
}
