import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PauseFlowExecutionResponseDto } from './pause-flow-execution.response.dto';
import { FlowExecutionStatus } from '../get-flow-execution-status/get-flow-execution-status.response.dto';

@Injectable()
export class PauseFlowExecutionService {
  // Mock data для демонстрации
  private mockExecutions = new Map([
    [
      'exec-001',
      {
        id: 'exec-001',
        flowId: 'flow-001',
        status: FlowExecutionStatus.RUNNING,
        startTime: new Date('2024-01-15T10:00:00Z'),
        currentStep: 3,
        totalSteps: 8,
        progress: 37.5,
        pausedAt: null,
        pauseReason: null,
        canBePaused: true,
        isPausable: true,
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
        ],
      },
    ],
    [
      'exec-002',
      {
        id: 'exec-002',
        flowId: 'flow-002',
        status: FlowExecutionStatus.PAUSED,
        startTime: new Date('2024-01-15T09:30:00Z'),
        currentStep: 2,
        totalSteps: 5,
        progress: 40,
        pausedAt: new Date('2024-01-15T09:45:00Z'),
        pauseReason: 'Manual pause by user',
        canBePaused: false,
        isPausable: false,
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
            timestamp: new Date('2024-01-15T09:45:00Z'),
            level: 'warn',
            message: 'Flow execution paused',
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
        currentStep: 4,
        totalSteps: 4,
        progress: 100,
        pausedAt: null,
        pauseReason: null,
        canBePaused: false,
        isPausable: false,
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

  async execute(executionId: string): Promise<PauseFlowExecutionResponseDto> {
    // Проверяем существование выполнения
    const execution = this.mockExecutions.get(executionId);
    if (!execution) {
      throw new NotFoundException(
        `Flow execution with ID ${executionId} not found`,
      );
    }

    // Проверяем, можно ли приостановить выполнение
    if (execution.status !== FlowExecutionStatus.RUNNING) {
      throw new BadRequestException(
        `Cannot pause flow execution. Current status: ${execution.status}. Only RUNNING executions can be paused.`,
      );
    }

    if (!execution.isPausable) {
      throw new BadRequestException(
        'This flow execution cannot be paused at the current step. Some steps are atomic and must complete.',
      );
    }

    // Обновляем статус на PAUSED
    execution.status = FlowExecutionStatus.PAUSED;
    execution.pausedAt = new Date();
    execution.pauseReason = 'Paused by user request';
    execution.canBePaused = false;
    execution.isPausable = false;

    // Добавляем лог о приостановке
    execution.logs.push({
      timestamp: new Date(),
      level: 'warn',
      message: `Flow execution paused by user at step ${execution.currentStep}`,
    });

    // Обновляем данные в mock store
    this.mockExecutions.set(executionId, execution);

    return new PauseFlowExecutionResponseDto({
      executionId,
      flowId: execution.flowId,
      status: execution.status,
      pausedAt: execution.pausedAt,
      pauseReason: execution.pauseReason,
      currentStep: execution.currentStep,
      totalSteps: execution.totalSteps,
      progress: execution.progress,
      message: 'Flow execution has been successfully paused',
      canBeResumed: true,
      estimatedResumeTime: null, // Можно возобновить немедленно
      nextAction: 'Use resume-flow-execution endpoint to continue',
    });
  }
}
