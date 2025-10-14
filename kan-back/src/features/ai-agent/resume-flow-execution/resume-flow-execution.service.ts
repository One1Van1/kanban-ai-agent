import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ResumeFlowExecutionResponseDto } from './resume-flow-execution.response.dto';
import { FlowExecutionStatus } from '../get-flow-execution-status/get-flow-execution-status.response.dto';

@Injectable()
export class ResumeFlowExecutionService {
  // Mock data для демонстрации
  private mockExecutions = new Map([
    [
      'exec-001',
      {
        id: 'exec-001',
        flowId: 'flow-001',
        status: FlowExecutionStatus.PAUSED,
        startTime: new Date('2024-01-15T10:00:00Z'),
        pausedAt: new Date('2024-01-15T10:05:30Z'),
        resumedAt: null as Date | null,
        currentStep: 3,
        totalSteps: 8,
        progress: 37.5,
        pauseReason: 'Paused by user request',
        canBeResumed: true,
        statePreserved: true,
        contextData: {
          variables: { userId: '123', taskId: 'TASK-456' },
          stepData: { lastApiResponse: '{"status": "pending"}' },
          checkpoint: 'after_user_input_validation',
        },
        logs: [
          {
            timestamp: new Date('2024-01-15T10:00:00Z'),
            level: 'info',
            message: 'Flow execution started',
          },
          {
            timestamp: new Date('2024-01-15T10:01:30Z'),
            level: 'info',
            message: 'Completed step 1: Data validation',
          },
          {
            timestamp: new Date('2024-01-15T10:03:00Z'),
            level: 'info',
            message: 'Completed step 2: API call preparation',
          },
          {
            timestamp: new Date('2024-01-15T10:04:15Z'),
            level: 'info',
            message: 'Step 3: Processing user input',
          },
          {
            timestamp: new Date('2024-01-15T10:05:30Z'),
            level: 'warn',
            message: 'Flow execution paused by user at step 3',
          },
        ],
      },
    ],
    [
      'exec-002',
      {
        id: 'exec-002',
        flowId: 'flow-002',
        status: FlowExecutionStatus.RUNNING,
        startTime: new Date('2024-01-15T09:30:00Z'),
        pausedAt: null as Date | null,
        resumedAt: null as Date | null,
        currentStep: 2,
        totalSteps: 5,
        progress: 40,
        pauseReason: null,
        canBeResumed: false,
        statePreserved: false,
        contextData: null,
        logs: [
          {
            timestamp: new Date('2024-01-15T09:30:00Z'),
            level: 'info',
            message: 'Flow execution started',
          },
          {
            timestamp: new Date('2024-01-15T09:35:00Z'),
            level: 'info',
            message: 'Completed step 1',
          },
          {
            timestamp: new Date('2024-01-15T09:40:00Z'),
            level: 'info',
            message: 'Step 2 in progress',
          },
        ],
      },
    ],
    [
      'exec-003',
      {
        id: 'exec-003',
        flowId: 'flow-003',
        status: FlowExecutionStatus.COMPLETED,
        startTime: new Date('2024-01-15T08:00:00Z'),
        pausedAt: null as Date | null,
        resumedAt: null as Date | null,
        currentStep: 4,
        totalSteps: 4,
        progress: 100,
        pauseReason: null,
        canBeResumed: false,
        statePreserved: false,
        contextData: null,
        logs: [
          {
            timestamp: new Date('2024-01-15T08:00:00Z'),
            level: 'info',
            message: 'Flow execution started',
          },
          {
            timestamp: new Date('2024-01-15T08:15:00Z'),
            level: 'success',
            message: 'Flow execution completed successfully',
          },
        ],
      },
    ],
  ]);

  async execute(executionId: string): Promise<ResumeFlowExecutionResponseDto> {
    // Проверяем существование выполнения
    const execution = this.mockExecutions.get(executionId);
    if (!execution) {
      throw new NotFoundException(
        `Flow execution with ID ${executionId} not found`,
      );
    }

    // Проверяем, можно ли возобновить выполнение
    if (execution.status !== FlowExecutionStatus.PAUSED) {
      throw new BadRequestException(
        `Cannot resume flow execution. Current status: ${execution.status}. Only PAUSED executions can be resumed.`,
      );
    }

    if (!execution.canBeResumed) {
      throw new BadRequestException(
        'This flow execution cannot be resumed. The execution context may have been lost or corrupted.',
      );
    }

    // Проверяем сохранность состояния
    if (!execution.statePreserved) {
      throw new BadRequestException(
        'Cannot resume flow execution. The execution state has been lost and cannot be restored.',
      );
    }

    // Обновляем статус на RUNNING
    execution.status = FlowExecutionStatus.RUNNING;
    execution.resumedAt = new Date();
    execution.canBeResumed = false;

    // Добавляем лог о возобновлении
    execution.logs.push({
      timestamp: new Date(),
      level: 'info',
      message: `Flow execution resumed from step ${execution.currentStep}. Context restored from checkpoint: ${execution.contextData?.checkpoint}`,
    });

    // Симулируем восстановление следующего шага
    const nextStepEstimate = this.calculateNextStepEstimate(execution);

    // Обновляем данные в mock store
    this.mockExecutions.set(executionId, execution);

    return new ResumeFlowExecutionResponseDto({
      executionId,
      flowId: execution.flowId,
      status: execution.status,
      resumedAt: execution.resumedAt,
      pausedDuration: this.calculatePausedDuration(
        execution.pausedAt!,
        execution.resumedAt!,
      ),
      currentStep: execution.currentStep,
      totalSteps: execution.totalSteps,
      progress: execution.progress,
      message: 'Flow execution has been successfully resumed',
      restoredContext: {
        variablesRestored: Object.keys(execution.contextData?.variables || {})
          .length,
        checkpointRestored: execution.contextData?.checkpoint || 'unknown',
        stateValidated: true,
      },
      nextStepInfo: nextStepEstimate,
      resumeSuccessful: true,
    });
  }

  private calculatePausedDuration(pausedAt: Date, resumedAt: Date): number {
    return Math.round((resumedAt.getTime() - pausedAt.getTime()) / 1000); // seconds
  }

  private calculateNextStepEstimate(execution: any): any {
    const nextStep = execution.currentStep + 1;
    const stepsRemaining = execution.totalSteps - execution.currentStep;

    return {
      nextStepNumber: nextStep,
      nextStepName: `Step ${nextStep}: Continue processing`,
      estimatedDuration: Math.min(stepsRemaining * 30, 180), // seconds
      stepsRemaining,
    };
  }
}
