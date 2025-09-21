import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
} from '@nestjs/common';
import {
  KanbanAgentService,
  AgentConfig,
  AgentStatus,
  CycleResult,
} from './kanban-agent.service';

@Controller('agent')
export class KanbanAgentController {
  constructor(private readonly kanbanAgent: KanbanAgentService) {}

  /**
   * Получить статус агента
   */
  @Get('status')
  getStatus(): AgentStatus {
    return this.kanbanAgent.getStatus();
  }

  /**
   * Получить конфигурацию агента
   */
  @Get('config')
  getConfig(): AgentConfig {
    return this.kanbanAgent.getConfig();
  }

  /**
   * Обновить конфигурацию агента
   */
  @Put('config')
  updateConfig(@Body() config: Partial<AgentConfig>) {
    this.kanbanAgent.updateConfig(config);
    return {
      success: true,
      message: 'Configuration updated',
      newConfig: this.kanbanAgent.getConfig(),
    };
  }

  /**
   * Запустить агента
   */
  @Post('start')
  async startAgent() {
    try {
      await this.kanbanAgent.start();
      return {
        success: true,
        message: 'Agent started successfully',
        status: this.kanbanAgent.getStatus(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Остановить агента
   */
  @Post('stop')
  async stopAgent() {
    try {
      await this.kanbanAgent.stop();
      return {
        success: true,
        message: 'Agent stopped successfully',
        status: this.kanbanAgent.getStatus(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Выполнить один цикл мониторинга вручную
   */
  @Post('cycle')
  async runSingleCycle(): Promise<CycleResult> {
    return this.kanbanAgent.runSingleCycle();
  }

  /**
   * Включить автоматическое выполнение задач
   */
  @Post('auto-execute/enable')
  enableAutoExecution() {
    this.kanbanAgent.updateConfig({ autoExecuteMode: true });
    return {
      success: true,
      message: 'Auto-execution enabled',
      config: this.kanbanAgent.getConfig(),
    };
  }

  /**
   * Отключить автоматическое выполнение задач
   */
  @Post('auto-execute/disable')
  disableAutoExecution() {
    this.kanbanAgent.updateConfig({ autoExecuteMode: false });
    return {
      success: true,
      message: 'Auto-execution disabled',
      config: this.kanbanAgent.getConfig(),
    };
  }

  /**
   * Изменить интервал мониторинга
   */
  @Put('interval/:minutes')
  setMonitoringInterval(@Param('minutes') minutes: string) {
    const intervalMinutes = parseInt(minutes, 10);
    if (isNaN(intervalMinutes) || intervalMinutes < 1) {
      return {
        success: false,
        error: 'Invalid interval. Must be a positive number.',
      };
    }

    this.kanbanAgent.updateConfig({ monitoringInterval: intervalMinutes });
    return {
      success: true,
      message: `Monitoring interval set to ${intervalMinutes} minutes`,
      config: this.kanbanAgent.getConfig(),
    };
  }

  /**
   * Обновить список мониторируемых колонок
   */
  @Put('columns')
  updateMonitoredColumns(@Body() body: { columns: string[] }) {
    this.kanbanAgent.updateConfig({ columnsToMonitor: body.columns });
    return {
      success: true,
      message: 'Monitored columns updated',
      config: this.kanbanAgent.getConfig(),
    };
  }

  /**
   * Изменить максимальное количество задач за цикл
   */
  @Put('max-tasks/:count')
  setMaxTasksPerCycle(@Param('count') count: string) {
    const maxTasks = parseInt(count, 10);
    if (isNaN(maxTasks) || maxTasks < 1) {
      return {
        success: false,
        error: 'Invalid count. Must be a positive number.',
      };
    }

    this.kanbanAgent.updateConfig({ maxTasksPerCycle: maxTasks });
    return {
      success: true,
      message: `Max tasks per cycle set to ${maxTasks}`,
      config: this.kanbanAgent.getConfig(),
    };
  }

  /**
   * Получить краткую сводку о работе агента
   */
  @Get('summary')
  getSummary() {
    const status = this.kanbanAgent.getStatus();
    const config = this.kanbanAgent.getConfig();

    return {
      agent: {
        isRunning: status.isRunning,
        lastActivity: status.lastCycleTime,
        totalCycles: status.cyclesCompleted,
        totalTasksProcessed: status.tasksProcessed,
        totalTasksExecuted: status.tasksExecuted,
        errorCount: status.errors.length,
      },
      configuration: {
        autoExecuteMode: config.autoExecuteMode,
        monitoringInterval: config.monitoringInterval,
        columnsToMonitor: config.columnsToMonitor,
        maxTasksPerCycle: config.maxTasksPerCycle,
      },
      currentTasks: status.currentTasks,
      recentErrors: status.errors.slice(-3), // последние 3 ошибки
    };
  }
}
