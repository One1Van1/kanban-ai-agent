import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { GetFlowExecutionStatusQueryDto } from './get-flow-execution-status.query.dto';
import {
  GetFlowExecutionStatusResponseDto,
  FlowExecutionStatus,
  FlowStepDto,
  FlowExecutionLogDto,
  FlowExecutionMetricsDto,
  StepStatus,
} from './get-flow-execution-status.response.dto';

@Injectable()
export class GetFlowExecutionStatusService {
  // В реальной реализации здесь будет работа с базой данных
  // Сейчас используем mock данные для демонстрации структуры
  private mockExecutions = new Map<string, any>();

  constructor() {
    // Инициализируем тестовые данные
    this.initializeMockData();
  }

  async execute(
    executionId: string,
    query: GetFlowExecutionStatusQueryDto,
  ): Promise<GetFlowExecutionStatusResponseDto> {
    try {
      // Валидация входных параметров
      if (!executionId) {
        throw new BadRequestException('Execution ID is required');
      }

      // Получаем данные выполнения
      const execution = this.mockExecutions.get(executionId);
      if (!execution) {
        throw new NotFoundException(
          `Flow execution with ID ${executionId} not found`,
        );
      }

      // Создаем основной ответ
      const response = new GetFlowExecutionStatusResponseDto(
        executionId,
        execution.flowId,
        execution.flowName,
        execution.status,
        this.buildMetrics(execution),
        execution.startedBy,
      );

      // Добавляем опциональные данные на основе запроса
      if (query.includeSteps) {
        response.steps = this.buildSteps(execution);
      }

      if (query.includeLogs) {
        response.logs = this.buildLogs(execution);
      }

      if (query.includeVariables) {
        response.variables = this.buildVariables(execution);
      }

      return response;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve flow execution status: ${error.message}`,
      );
    }
  }

  private buildMetrics(execution: any): FlowExecutionMetricsDto {
    const startedAt = new Date(execution.startedAt);
    const now = new Date();
    const completedAt = execution.completedAt
      ? new Date(execution.completedAt)
      : null;

    // Рассчитываем длительность
    let duration: string | undefined;
    if (completedAt) {
      duration = this.formatDuration(
        completedAt.getTime() - startedAt.getTime(),
      );
    } else if (execution.status === FlowExecutionStatus.RUNNING) {
      duration = this.formatDuration(now.getTime() - startedAt.getTime());
    }

    // Рассчитываем прогресс
    const totalSteps = execution.steps.length;
    const completedSteps = execution.steps.filter(
      (s: any) => s.status === StepStatus.COMPLETED,
    ).length;
    const failedSteps = execution.steps.filter(
      (s: any) => s.status === StepStatus.FAILED,
    ).length;
    const skippedSteps = execution.steps.filter(
      (s: any) => s.status === StepStatus.SKIPPED,
    ).length;
    const progress =
      totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    // Находим текущий шаг
    const currentStep = execution.steps.find(
      (s: any) => s.status === StepStatus.RUNNING,
    )?.id;

    // Оценка времени завершения (простая эвристика)
    let estimatedCompletion: string | undefined;
    if (
      execution.status === FlowExecutionStatus.RUNNING &&
      completedSteps > 0
    ) {
      const avgStepDuration =
        (now.getTime() - startedAt.getTime()) / completedSteps;
      const remainingSteps = totalSteps - completedSteps;
      const estimatedRemainingTime = avgStepDuration * remainingSteps;
      estimatedCompletion = new Date(
        now.getTime() + estimatedRemainingTime,
      ).toISOString();
    }

    return {
      startedAt: execution.startedAt,
      completedAt: execution.completedAt || undefined,
      duration,
      progress,
      totalSteps,
      completedSteps,
      failedSteps,
      skippedSteps,
      currentStep,
      estimatedCompletion,
    };
  }

  private buildSteps(execution: any): FlowStepDto[] {
    return execution.steps.map((step: any) => ({
      id: step.id,
      name: step.name,
      status: step.status,
      order: step.order,
      startedAt: step.startedAt,
      completedAt: step.completedAt,
      duration: step.duration,
      result: step.result,
      error: step.error,
      progress: step.progress || 0,
    }));
  }

  private buildLogs(execution: any): FlowExecutionLogDto[] {
    return (execution.logs || []).map((log: any) => ({
      timestamp: log.timestamp,
      level: log.level,
      stepId: log.stepId,
      message: log.message,
      context: log.context,
    }));
  }

  private buildVariables(execution: any): Record<string, any> {
    if (!execution.variables) {
      return {};
    }

    // Преобразуем массив переменных в объект ключ-значение
    const variablesMap: Record<string, any> = {};
    execution.variables.forEach((variable: any) => {
      variablesMap[variable.name] = variable.value;
    });

    return variablesMap;
  }

  private formatDuration(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const ms = milliseconds % 1000;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  }

  private initializeMockData() {
    // Тестовые данные для демонстрации
    const mockSteps = [
      {
        id: 'step_1',
        name: 'Initialize Flow',
        status: StepStatus.COMPLETED,
        order: 1,
        startedAt: '2024-01-15T10:30:00Z',
        completedAt: '2024-01-15T10:30:15Z',
        duration: '00:00:15.000',
        result: 'Flow initialized successfully',
        progress: 100,
      },
      {
        id: 'step_2',
        name: 'Fetch Jira Tasks',
        status: StepStatus.COMPLETED,
        order: 2,
        startedAt: '2024-01-15T10:30:15Z',
        completedAt: '2024-01-15T10:31:45Z',
        duration: '00:01:30.000',
        result: 'Retrieved 25 tasks from Jira',
        progress: 100,
      },
      {
        id: 'step_3',
        name: 'AI Analysis',
        status: StepStatus.RUNNING,
        order: 3,
        startedAt: '2024-01-15T10:31:45Z',
        result: 'Processing task analysis...',
        progress: 65,
      },
      {
        id: 'step_4',
        name: 'Generate Report',
        status: StepStatus.WAITING,
        order: 4,
        progress: 0,
      },
      {
        id: 'step_5',
        name: 'Send Notifications',
        status: StepStatus.WAITING,
        order: 5,
        progress: 0,
      },
    ];

    const mockLogs = [
      {
        timestamp: '2024-01-15T10:30:00Z',
        level: 'info',
        stepId: 'step_1',
        message: 'Starting flow execution',
        context: { flowId: 'marketing_automation_v1' },
      },
      {
        timestamp: '2024-01-15T10:30:15Z',
        level: 'info',
        stepId: 'step_2',
        message: 'Connecting to Jira API',
        context: { jiraUrl: 'https://company.atlassian.net' },
      },
      {
        timestamp: '2024-01-15T10:30:30Z',
        level: 'info',
        stepId: 'step_2',
        message: 'Retrieved tasks successfully',
        context: { taskCount: 25 },
      },
      {
        timestamp: '2024-01-15T10:31:45Z',
        level: 'info',
        stepId: 'step_3',
        message: 'Starting AI analysis',
        context: { model: 'claude-3-sonnet' },
      },
      {
        timestamp: '2024-01-15T10:32:30Z',
        level: 'debug',
        stepId: 'step_3',
        message: 'Processing task PROJ-123',
        context: { taskId: 'PROJ-123', priority: 'high' },
      },
    ];

    const mockVariables = [
      { name: 'user_email', value: 'john.doe@company.com' },
      { name: 'task_count', value: 25 },
      { name: 'current_task', value: 'PROJ-123' },
      { name: 'processing_status', value: true },
      { name: 'analysis_results', value: { completed: 15, pending: 10 } },
    ];

    // Выполнение в процессе
    this.mockExecutions.set('flow_exec_123', {
      flowId: 'marketing_automation_v1',
      flowName: 'Marketing Campaign Automation',
      status: FlowExecutionStatus.RUNNING,
      startedAt: '2024-01-15T10:30:00Z',
      startedBy: 'john.doe@company.com',
      steps: mockSteps,
      logs: mockLogs,
      variables: mockVariables,
    });

    // Завершенное выполнение
    this.mockExecutions.set('flow_exec_456', {
      flowId: 'task_processing_v2',
      flowName: 'Task Processing Pipeline',
      status: FlowExecutionStatus.COMPLETED,
      startedAt: '2024-01-14T15:00:00Z',
      completedAt: '2024-01-14T15:30:00Z',
      startedBy: 'jane.smith@company.com',
      steps: mockSteps.map((s) => ({
        ...s,
        status: StepStatus.COMPLETED,
        progress: 100,
      })),
      logs: mockLogs,
      variables: mockVariables.slice(0, 3),
    });

    // Неудачное выполнение
    this.mockExecutions.set('flow_exec_789', {
      flowId: 'error_handling_test',
      flowName: 'Error Handling Test Flow',
      status: FlowExecutionStatus.FAILED,
      startedAt: '2024-01-14T12:00:00Z',
      completedAt: '2024-01-14T12:05:30Z',
      startedBy: 'admin@company.com',
      steps: [
        { ...mockSteps[0], status: StepStatus.COMPLETED, progress: 100 },
        {
          ...mockSteps[1],
          status: StepStatus.FAILED,
          error: 'Jira API connection timeout',
          progress: 0,
        },
        { ...mockSteps[2], status: StepStatus.SKIPPED, progress: 0 },
      ],
      logs: [
        ...mockLogs.slice(0, 2),
        {
          timestamp: '2024-01-14T12:05:30Z',
          level: 'error',
          stepId: 'step_2',
          message: 'Jira API connection timeout',
          context: { error: 'ECONNRESET', timeout: 30000 },
        },
      ],
      variables: [],
    });
  }
}
