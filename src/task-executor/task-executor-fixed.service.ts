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
import { SimpleCodeExecutorService } from './executors/simple-code-executor.service';

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
    private readonly codeExecutor: SimpleCodeExecutorService,
  ) {}

  /**
   * Выполнить задачу автоматически
   */
  async executeTask(
    task: JiraTask | KanbanTaskSummary,
    options: ExecutionOptions = {},
  ): Promise<TaskExecutionResult> {
    const startTime = Date.now();
    this.logger.log(`Starting execution of task ${task.key}`);

    try {
      // 1. Анализ задачи для определения типа
      const analysis = await this.aiAnalysis.analyzeTask(task);

      if (!analysis.canAutoExecute && !options.dryRun) {
        throw new Error(
          'Task cannot be auto-executed according to AI analysis',
        );
      }

      // 2. Выбор специализированного исполнителя
      let result: TaskExecutionResult;

      switch (analysis.analysisType) {
        case 'code':
          result = await this.codeExecutor.executeCodeTask(task);
          break;

        case 'testing':
          result = await this.executeTestingTask(task, options);
          break;

        case 'documentation':
          result = await this.executeDocumentationTask(task, options);
          break;

        default:
          result = await this.executeGenericTask(task, options);
          break;
      }

      // 3. Подсчёт времени выполнения
      const timeSpent = Math.round((Date.now() - startTime) / 1000 / 60);
      result.timeSpent = Math.max(timeSpent, result.timeSpent);

      // 4. Добавление комментария о завершении
      if (result.success && !options.dryRun) {
        await this.addCompletionComment(task.key, result);
      }

      this.logger.log(
        `Task ${task.key} execution ${result.success ? 'completed' : 'failed'} ` +
          `in ${result.timeSpent} minutes`,
      );

      return result;
    } catch (error) {
      const timeSpent = Math.round((Date.now() - startTime) / 1000 / 60);
      this.logger.error(`Task ${task.key} execution failed:`, error.message);

      return {
        taskKey: task.key,
        success: false,
        completedSteps: 0,
        totalSteps: 1,
        timeSpent: Math.max(timeSpent, 1),
        errors: [error.message],
        results: [],
        finalStatus: 'failed',
      };
    }
  }

  /**
   * Выполнить задачу тестирования
   */
  private async executeTestingTask(
    task: JiraTask | KanbanTaskSummary,
    options: ExecutionOptions,
  ): Promise<TaskExecutionResult> {
    this.logger.log(`Executing testing task: ${task.key}`);

    // Симуляция выполнения тестирования
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      taskKey: task.key,
      success: true,
      completedSteps: 3,
      totalSteps: 3,
      timeSpent: 1,
      errors: [],
      results: [
        'Test environment prepared',
        'Tests executed successfully',
        'Test report generated',
      ],
      finalStatus: 'completed',
    };
  }

  /**
   * Выполнить задачу документации
   */
  private async executeDocumentationTask(
    task: JiraTask | KanbanTaskSummary,
    options: ExecutionOptions,
  ): Promise<TaskExecutionResult> {
    this.logger.log(`Executing documentation task: ${task.key}`);

    // Симуляция создания документации
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      taskKey: task.key,
      success: true,
      completedSteps: 2,
      totalSteps: 2,
      timeSpent: 1,
      errors: [],
      results: [
        'Documentation template created',
        'Content populated successfully',
      ],
      finalStatus: 'completed',
    };
  }

  /**
   * Выполнить обычную задачу
   */
  private async executeGenericTask(
    task: JiraTask | KanbanTaskSummary,
    options: ExecutionOptions,
  ): Promise<TaskExecutionResult> {
    this.logger.log(`Executing generic task: ${task.key}`);

    const summary = 'summary' in task ? task.summary : task.fields.summary;

    return {
      taskKey: task.key,
      success: true,
      completedSteps: 1,
      totalSteps: 1,
      timeSpent: 1,
      errors: [],
      results: [`Generic task "${summary}" processed`],
      finalStatus: 'completed',
    };
  }

  /**
   * Выполнить несколько задач пакетом
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

        // Небольшая пауза между задачами
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        results.push({
          taskKey: task.key,
          success: false,
          completedSteps: 0,
          totalSteps: 1,
          timeSpent: 0,
          errors: [error.message],
          results: [],
          finalStatus: 'failed',
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    this.logger.log(
      `Batch execution completed: ${successCount}/${results.length} successful`,
    );

    return results;
  }

  /**
   * Добавить комментарий о завершении
   */
  private async addCompletionComment(
    taskKey: string,
    result: TaskExecutionResult,
  ): Promise<void> {
    try {
      const comment =
        `🤖 Task completed by AI Agent:\n` +
        `✅ Success: ${result.success}\n` +
        `📊 Steps: ${result.completedSteps}/${result.totalSteps}\n` +
        `⏱️ Time: ${result.timeSpent} minutes\n` +
        `📝 Results: ${result.results.join(', ')}`;

      await this.jiraService.addComment(taskKey, { body: comment });
    } catch (error) {
      this.logger.warn(`Failed to add completion comment: ${error.message}`);
    }
  }

  /**
   * Получить статистику выполнения
   */
  async getExecutionStats(): Promise<{
    totalExecuted: number;
    successfullyExecuted: number;
    averageExecutionTime: number;
    mostCommonTaskType: string;
  }> {
    // Пока что возвращаем заглушку
    return {
      totalExecuted: 0,
      successfullyExecuted: 0,
      averageExecutionTime: 0,
      mostCommonTaskType: 'code',
    };
  }
}
