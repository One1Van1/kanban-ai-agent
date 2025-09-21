import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { TaskFetcherService } from '../jira/task-fetcher.service';
import { TaskStatusManagerService } from '../jira/task-status-manager.service';
import {
  AIAnalysisService,
  TaskAnalysisResult,
} from '../ai-analysis/ai-analysis.service';
import { TaskExecutorService } from '../task-executor/task-executor.service';
import { KanbanTaskSummary } from '../jira/types/kanban-column.interface';

export interface AgentConfig {
  monitoringInterval: number; // в минутах
  columnsToMonitor: string[];
  maxTasksPerCycle: number;
  autoExecuteMode: boolean;
  requiredApprovalTypes: string[];
}

export interface AgentStatus {
  isRunning: boolean;
  lastCycleTime: Date | null;
  cyclesCompleted: number;
  tasksProcessed: number;
  tasksExecuted: number;
  currentTasks: string[];
  errors: string[];
}

export interface CycleResult {
  cycleId: string;
  startTime: Date;
  endTime: Date;
  tasksFound: number;
  tasksAnalyzed: number;
  tasksExecuted: number;
  tasksMoved: number;
  errors: string[];
  details: {
    [taskKey: string]: {
      analysis: TaskAnalysisResult;
      executed: boolean;
      moved: boolean;
      error?: string;
    };
  };
}

@Injectable()
export class KanbanAgentService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KanbanAgentService.name);
  private isRunning = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private status: AgentStatus = {
    isRunning: false,
    lastCycleTime: null,
    cyclesCompleted: 0,
    tasksProcessed: 0,
    tasksExecuted: 0,
    currentTasks: [],
    errors: [],
  };

  private config: AgentConfig = {
    monitoringInterval: 5, // каждые 5 минут
    columnsToMonitor: ['New', 'backlog'],
    maxTasksPerCycle: 3,
    autoExecuteMode: false, // начинаем с ручного режима
    requiredApprovalTypes: ['code', 'testing'],
  };

  constructor(
    private readonly taskFetcher: TaskFetcherService,
    private readonly statusManager: TaskStatusManagerService,
    private readonly aiAnalysis: AIAnalysisService,
    private readonly taskExecutor: TaskExecutorService,
  ) {}

  async onModuleInit() {
    this.logger.log('🤖 Kanban AI Agent initialized');
    this.logger.log(`Configuration: ${JSON.stringify(this.config, null, 2)}`);
  }

  async onModuleDestroy() {
    await this.stop();
  }

  /**
   * Запустить автоматический мониторинг
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('Agent is already running');
      return;
    }

    this.logger.log('🚀 Starting Kanban AI Agent...');
    this.isRunning = true;
    this.status.isRunning = true;
    this.status.errors = [];

    // Запустить первый цикл сразу
    this.runMonitoringCycle().catch((error) => {
      this.logger.error('Error in initial monitoring cycle:', error.message);
      this.status.errors.push(`Initial cycle error: ${error.message}`);
    });

    // Настроить периодический запуск
    this.monitoringInterval = setInterval(
      () => {
        this.runMonitoringCycle().catch((error) => {
          this.logger.error('Error in monitoring cycle:', error.message);
          this.status.errors.push(`Cycle error: ${error.message}`);
        });
      },
      this.config.monitoringInterval * 60 * 1000,
    );

    this.logger.log(
      `Agent started with ${this.config.monitoringInterval} minute intervals`,
    );
  }

  /**
   * Остановить автоматический мониторинг
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn('Agent is not running');
      return;
    }

    this.logger.log('🛑 Stopping Kanban AI Agent...');
    this.isRunning = false;
    this.status.isRunning = false;

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    this.logger.log('Agent stopped');
  }

  /**
   * Выполнить один цикл мониторинга вручную
   */
  async runSingleCycle(): Promise<CycleResult> {
    return this.runMonitoringCycle();
  }

  /**
   * Основной цикл мониторинга и обработки задач
   */
  private async runMonitoringCycle(): Promise<CycleResult> {
    const cycleId = `cycle_${Date.now()}`;
    const startTime = new Date();
    this.logger.log(`🔄 Starting monitoring cycle: ${cycleId}`);

    const result: CycleResult = {
      cycleId,
      startTime,
      endTime: new Date(),
      tasksFound: 0,
      tasksAnalyzed: 0,
      tasksExecuted: 0,
      tasksMoved: 0,
      errors: [],
      details: {},
    };

    try {
      // 1. Получить задачи из мониторируемых колонок
      const allTasks: KanbanTaskSummary[] = [];

      for (const columnName of this.config.columnsToMonitor) {
        try {
          const columnTasks = await this.taskFetcher.getTasksFromColumn(
            columnName,
            {
              maxResults: this.config.maxTasksPerCycle,
            },
          );
          allTasks.push(...columnTasks.tasks);
          this.logger.log(
            `Found ${columnTasks.tasks.length} tasks in column "${columnName}"`,
          );
        } catch (error) {
          const errorMsg = `Failed to fetch tasks from column "${columnName}": ${error.message}`;
          this.logger.error(errorMsg);
          result.errors.push(errorMsg);
        }
      }

      result.tasksFound = allTasks.length;
      this.status.currentTasks = allTasks.map((t) => t.key);

      if (allTasks.length === 0) {
        this.logger.log('No tasks found in monitored columns');
        result.endTime = new Date();
        this.status.lastCycleTime = result.endTime;
        this.status.cyclesCompleted++;
        return result;
      }

      // Ограничить количество задач для обработки
      const tasksToProcess = allTasks.slice(0, this.config.maxTasksPerCycle);
      this.logger.log(`Processing ${tasksToProcess.length} tasks this cycle`);

      // 2. Анализировать каждую задачу
      for (const task of tasksToProcess) {
        try {
          this.logger.log(`🧠 Analyzing task: ${task.key} - "${task.summary}"`);

          const analysis = await this.aiAnalysis.analyzeTask(task);
          result.details[task.key] = {
            analysis,
            executed: false,
            moved: false,
          };
          result.tasksAnalyzed++;

          // 3. Решить, выполнять ли задачу автоматически
          const shouldExecute = this.shouldExecuteTask(analysis);

          this.logger.log(
            `Task ${task.key}: shouldExecute=${shouldExecute}, autoExecuteMode=${this.config.autoExecuteMode}, canAutoExecute=${analysis.canAutoExecute}, analysisType=${analysis.analysisType}`,
          );

          if (shouldExecute && this.config.autoExecuteMode) {
            this.logger.log(`🔧 Executing task: ${task.key}`);

            try {
              const executionResult = await this.taskExecutor.executeTask(task);
              result.details[task.key].executed = true;
              result.tasksExecuted++;

              if (executionResult.success) {
                // 4. Переместить задачу в следующую колонку
                const targetStatus = this.getTargetStatusForTask(analysis);
                if (targetStatus) {
                  const moveResult = await this.statusManager.moveTaskToColumn(
                    task.key,
                    targetStatus,
                    '🤖 Task completed by AI Agent',
                  );

                  if (moveResult.success) {
                    result.details[task.key].moved = true;
                    result.tasksMoved++;
                    this.logger.log(
                      `✅ Task ${task.key} completed and moved to "${targetStatus}"`,
                    );
                  } else {
                    const error = `Failed to move task: ${moveResult.error}`;
                    result.details[task.key].error = error;
                    result.errors.push(error);
                  }
                }
              }
            } catch (execError) {
              const error = `Execution failed: ${execError.message}`;
              result.details[task.key].error = error;
              result.errors.push(error);
              this.logger.error(
                `Failed to execute task ${task.key}:`,
                execError.message,
              );
            }
          } else {
            this.logger.log(
              `⏸️ Task ${task.key} requires manual approval or auto-execute is disabled`,
            );
          }
        } catch (error) {
          const errorMsg = `Failed to process task ${task.key}: ${error.message}`;
          result.errors.push(errorMsg);
          this.logger.error(errorMsg);
        }
      }

      this.status.tasksProcessed += result.tasksAnalyzed;
      this.status.tasksExecuted += result.tasksExecuted;
    } catch (error) {
      const errorMsg = `Monitoring cycle failed: ${error.message}`;
      result.errors.push(errorMsg);
      this.logger.error(errorMsg);
    }

    result.endTime = new Date();
    this.status.lastCycleTime = result.endTime;
    this.status.cyclesCompleted++;

    const duration = result.endTime.getTime() - result.startTime.getTime();
    this.logger.log(
      `🏁 Cycle ${cycleId} completed in ${duration}ms: ` +
        `${result.tasksFound} found, ${result.tasksAnalyzed} analyzed, ` +
        `${result.tasksExecuted} executed, ${result.tasksMoved} moved`,
    );

    if (result.errors.length > 0) {
      this.logger.warn(`Cycle had ${result.errors.length} errors`);
    }

    return result;
  }

  /**
   * Определить, следует ли выполнять задачу автоматически
   */
  private shouldExecuteTask(analysis: TaskAnalysisResult): boolean {
    // Не выполняем если AI считает, что нельзя
    if (!analysis.canAutoExecute) {
      return false;
    }

    // Не выполняем типы задач, требующие одобрения
    if (this.config.requiredApprovalTypes.includes(analysis.analysisType)) {
      return false;
    }

    // Не выполняем задачи высокой сложности
    if (analysis.complexity === 'high') {
      return false;
    }

    return true;
  }

  /**
   * Определить целевой статус для задачи после выполнения
   */
  private getTargetStatusForTask(analysis: TaskAnalysisResult): string | null {
    switch (analysis.analysisType) {
      case 'testing':
        return 'Done';
      case 'code':
        return 'Review';
      case 'documentation':
        return 'Done';
      case 'research':
        return 'In Progress';
      default:
        return 'In Progress';
    }
  }

  /**
   * Получить текущий статус агента
   */
  getStatus(): AgentStatus {
    return { ...this.status };
  }

  /**
   * Обновить конфигурацию агента
   */
  updateConfig(newConfig: Partial<AgentConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.logger.log(
      `Configuration updated: ${JSON.stringify(this.config, null, 2)}`,
    );
  }

  /**
   * Получить текущую конфигурацию
   */
  getConfig(): AgentConfig {
    return { ...this.config };
  }
}
