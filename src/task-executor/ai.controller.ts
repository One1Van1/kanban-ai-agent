import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { AIAnalysisService } from '../ai-analysis/ai-analysis.service';
import { TaskExecutorService, ExecutionOptions } from './task-executor.service';
import { JiraService } from '../jira/jira.service';
import { TaskFetcherService } from '../jira/task-fetcher.service';

@Controller('ai')
export class AIController {
  constructor(
    private readonly aiAnalysis: AIAnalysisService,
    private readonly taskExecutor: TaskExecutorService,
    private readonly jiraService: JiraService,
    private readonly taskFetcher: TaskFetcherService,
  ) {}

  /**
   * Анализировать конкретную задачу
   */
  @Get('analyze/:taskKey')
  async analyzeTask(@Param('taskKey') taskKey: string) {
    const task = await this.jiraService.getTask(taskKey);
    return this.aiAnalysis.analyzeTask(task);
  }

  /**
   * Создать план выполнения для задачи
   */
  @Get('plan/:taskKey')
  async createExecutionPlan(@Param('taskKey') taskKey: string) {
    const task = await this.jiraService.getTask(taskKey);
    return this.aiAnalysis.createExecutionPlan(task);
  }

  /**
   * Получить предварительный анализ задачи
   */
  @Get('preview/:taskKey')
  async previewExecution(@Param('taskKey') taskKey: string) {
    const task = await this.jiraService.getTask(taskKey);
    return this.taskExecutor.previewTaskExecution(task);
  }

  /**
   * Выполнить задачу автоматически
   */
  @Post('execute/:taskKey')
  async executeTask(
    @Param('taskKey') taskKey: string,
    @Body() options: ExecutionOptions = {},
  ) {
    const task = await this.jiraService.getTask(taskKey);
    return this.taskExecutor.executeTask(task, options);
  }

  /**
   * Анализ и приоритизация задач из колонки
   */
  @Get('prioritize/:columnName')
  async prioritizeTasks(
    @Param('columnName') columnName: string,
    @Query('maxResults') maxResults?: number,
  ) {
    const columnResult = await this.taskFetcher.getTasksFromColumn(columnName, {
      maxResults: maxResults ? parseInt(maxResults.toString()) : 10,
    });

    const prioritizedTasks = await this.aiAnalysis.analyzePriority(
      columnResult.tasks,
    );

    return {
      columnName,
      totalTasks: columnResult.totalCount,
      prioritizedTasks: prioritizedTasks.map((task: any, index: number) => ({
        rank: index + 1,
        task,
      })),
    };
  }

  /**
   * Пакетное выполнение задач из колонки
   */
  @Post('execute-batch/:columnName')
  async executeBatch(
    @Param('columnName') columnName: string,
    @Body()
    body: {
      maxTasks?: number;
      options?: ExecutionOptions;
    } = {},
  ) {
    const columnResult = await this.taskFetcher.getTasksFromColumn(columnName, {
      maxResults: body.maxTasks || 3,
    });

    if (columnResult.tasks.length === 0) {
      return {
        message: `No tasks found in column ${columnName}`,
        results: [],
      };
    }

    const results = await this.taskExecutor.executeBatch(
      columnResult.tasks,
      body.options || { dryRun: true },
    );

    return {
      columnName,
      totalTasks: columnResult.tasks.length,
      results,
      summary: {
        successful: results.filter((r: any) => r.success).length,
        failed: results.filter((r: any) => !r.success).length,
        totalTimeSpent: results.reduce(
          (sum: number, r: any) => sum + r.timeSpent,
          0,
        ),
      },
    };
  }

  /**
   * Проверить готовность задачи к автоматическому выполнению
   */
  @Get('readiness/:taskKey')
  async checkReadiness(@Param('taskKey') taskKey: string) {
    const task = await this.jiraService.getTask(taskKey);
    return this.aiAnalysis.checkTaskReadiness(task);
  }

  /**
   * Получить статистику AI анализа по проекту
   */
  @Get('stats')
  async getAnalysisStats() {
    // Получаем несколько задач для анализа
    const newTasks = await this.taskFetcher.getTasksFromColumn('New', {
      maxResults: 5,
    });

    const analyses = await Promise.allSettled(
      newTasks.tasks.map((task) => this.aiAnalysis.analyzeTask(task)),
    );

    const successful = analyses
      .filter((result) => result.status === 'fulfilled')
      .map((result) => (result as any).value);

    const typeDistribution = successful.reduce(
      (acc, analysis) => {
        acc[analysis.analysisType] = (acc[analysis.analysisType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const complexityDistribution = successful.reduce(
      (acc, analysis) => {
        acc[analysis.complexity] = (acc[analysis.complexity] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalAnalyzed: successful.length,
      typeDistribution,
      complexityDistribution,
      autoExecutableCount: successful.filter((a) => a.canAutoExecute).length,
      averageEstimatedTime: Math.round(
        successful.reduce((sum, a) => sum + a.estimatedTime, 0) /
          successful.length,
      ),
    };
  }
}
