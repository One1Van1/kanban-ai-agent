import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CancelFlowExecutionResponseDto } from './cancel-flow-execution.response.dto';
import { FlowExecutionStatus } from '../get-flow-execution-status/get-flow-execution-status.response.dto';

@Injectable()
export class CancelFlowExecutionService {
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
        canBeCancelled: true,
        isSafeToCancel: true,
        rollbackRequired: false,
        activeConnections: ['jira-api', 'database'],
        resourcesInUse: ['temp-file-001.json', 'api-session-abc123'],
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
        canBeCancelled: true,
        isSafeToCancel: true,
        rollbackRequired: false,
        activeConnections: [],
        resourcesInUse: [],
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
        canBeCancelled: false,
        isSafeToCancel: false,
        rollbackRequired: false,
        activeConnections: [],
        resourcesInUse: [],
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
    [
      'exec-004',
      {
        id: 'exec-004',
        flowId: 'flow-004',
        status: FlowExecutionStatus.RUNNING,
        startTime: new Date('2024-01-15T11:00:00Z'),
        currentStep: 6,
        totalSteps: 8,
        progress: 75,
        canBeCancelled: true,
        isSafeToCancel: false,
        rollbackRequired: true,
        activeConnections: ['jira-api', 'database', 'external-webhook'],
        resourcesInUse: ['transaction-xyz789', 'file-lock-temp.xlsx'],
        logs: [
          {
            timestamp: new Date('2024-01-15T11:00:00Z'),
            level: 'info',
            message: 'Flow execution started',
          },
          {
            timestamp: new Date('2024-01-15T11:05:00Z'),
            level: 'warn',
            message: 'Critical transaction in progress',
          },
        ],
      },
    ],
  ]);

  async execute(
    executionId: string,
    force: boolean = false,
  ): Promise<CancelFlowExecutionResponseDto> {
    // Проверяем существование выполнения
    const execution = this.mockExecutions.get(executionId);
    if (!execution) {
      throw new NotFoundException(
        `Flow execution with ID ${executionId} not found`,
      );
    }

    // Проверяем, можно ли отменить выполнение
    if (execution.status === FlowExecutionStatus.COMPLETED) {
      throw new BadRequestException(
        'Cannot cancel flow execution. Execution has already completed successfully.',
      );
    }

    if (execution.status === FlowExecutionStatus.CANCELLED) {
      throw new BadRequestException('Flow execution is already cancelled.');
    }

    if (execution.status === FlowExecutionStatus.FAILED) {
      throw new BadRequestException(
        'Cannot cancel flow execution. Execution has already failed.',
      );
    }

    if (!execution.canBeCancelled) {
      throw new BadRequestException(
        'This flow execution cannot be cancelled. It may be in a critical state or protected from cancellation.',
      );
    }

    // Проверяем безопасность отмены (если не принудительная)
    if (!force && !execution.isSafeToCancel) {
      throw new BadRequestException(
        'Cannot safely cancel flow execution. Active transactions or connections detected. Use force=true to override.',
      );
    }

    // Выполняем процедуру отмены
    const cancelledAt = new Date();
    const cancellationResult = await this.performCancellation(execution, force);

    // Обновляем статус на CANCELLED
    execution.status = FlowExecutionStatus.CANCELLED;

    // Добавляем лог об отмене
    execution.logs.push({
      timestamp: cancelledAt,
      level: 'warn',
      message: force
        ? `Flow execution forcefully cancelled by user at step ${execution.currentStep}`
        : `Flow execution safely cancelled by user at step ${execution.currentStep}`,
    });

    // Обновляем данные в mock store
    this.mockExecutions.set(executionId, execution);

    return new CancelFlowExecutionResponseDto({
      executionId,
      flowId: execution.flowId,
      status: execution.status,
      cancelledAt,
      cancelReason: force ? 'Force cancelled by user' : 'Cancelled by user',
      wasForced: force,
      currentStep: execution.currentStep,
      totalSteps: execution.totalSteps,
      progress: execution.progress,
      message: 'Flow execution has been successfully cancelled',
      cleanupResult: cancellationResult,
      rollbackPerformed: execution.rollbackRequired,
      resourcesFreed: execution.resourcesInUse.length,
      connectionsTerminated: execution.activeConnections.length,
    });
  }

  private async performCancellation(
    execution: any,
    force: boolean,
  ): Promise<any> {
    const cleanupSteps = [];

    // Симулируем закрытие соединений
    if (execution.activeConnections.length > 0) {
      cleanupSteps.push(
        `Terminated ${execution.activeConnections.length} active connections: ${execution.activeConnections.join(', ')}`,
      );
    }

    // Симулируем освобождение ресурсов
    if (execution.resourcesInUse.length > 0) {
      cleanupSteps.push(
        `Freed ${execution.resourcesInUse.length} resources: ${execution.resourcesInUse.join(', ')}`,
      );
    }

    // Симулируем откат изменений (если требуется)
    if (execution.rollbackRequired) {
      cleanupSteps.push('Performed transaction rollback');
      if (force) {
        cleanupSteps.push('Force rollback: some changes may not be reversible');
      }
    }

    // Симулируем временную задержку на cleanup
    const cleanupDuration = Math.min(
      execution.activeConnections.length * 50,
      500,
    ); // ms

    return {
      cleanupSteps,
      cleanupDuration,
      cleanupSuccessful: true,
      warningsGenerated: force
        ? ['Force cancellation may have side effects']
        : [],
      resourcesRecovered: execution.resourcesInUse.length,
      connectionsTerminated: execution.activeConnections.length,
    };
  }
}
