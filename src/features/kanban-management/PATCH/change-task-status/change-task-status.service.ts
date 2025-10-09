import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ChangeTaskStatusRequestDto,
  TaskStatus,
} from './change-task-status.request.dto';
import { ChangeTaskStatusResponseDto } from './change-task-status.response.dto';
import { TaskHistory } from '../../../../entities/task-history.entity';

@Injectable()
export class ChangeTaskStatusService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  // Валидация переходов статусов (простая workflow-логика)
  private readonly allowedStatusTransitions: Record<TaskStatus, TaskStatus[]> =
    {
      [TaskStatus.TODO]: [
        TaskStatus.IN_PROGRESS,
        TaskStatus.BLOCKED,
        TaskStatus.CANCELLED,
      ],
      [TaskStatus.IN_PROGRESS]: [
        TaskStatus.IN_REVIEW,
        TaskStatus.BLOCKED,
        TaskStatus.TODO,
        TaskStatus.CANCELLED,
      ],
      [TaskStatus.IN_REVIEW]: [
        TaskStatus.TESTING,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
        TaskStatus.BLOCKED,
      ],
      [TaskStatus.TESTING]: [
        TaskStatus.DONE,
        TaskStatus.IN_REVIEW,
        TaskStatus.BLOCKED,
      ],
      [TaskStatus.DONE]: [TaskStatus.IN_REVIEW, TaskStatus.TESTING], // Возврат на доработку
      [TaskStatus.BLOCKED]: [
        TaskStatus.TODO,
        TaskStatus.IN_PROGRESS,
        TaskStatus.CANCELLED,
      ],
      [TaskStatus.CANCELLED]: [TaskStatus.TODO], // Возобновление отмененной задачи
    };

  private isValidStatusTransition(
    fromStatus: TaskStatus,
    toStatus: TaskStatus,
    forceChange: boolean = false,
  ): boolean {
    if (forceChange) return true;
    if (fromStatus === toStatus) return true; // Одинаковый статус допустим

    const allowedTransitions = this.allowedStatusTransitions[fromStatus];
    return allowedTransitions?.includes(toStatus) || false;
  }

  private calculateTimeInStatus(createdAt: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );

    if (diffDays > 0) {
      return `${diffDays} days ${diffHours} hours`;
    }
    return `${diffHours} hours`;
  }

  async execute(
    taskId: string,
    statusDto: ChangeTaskStatusRequestDto,
  ): Promise<ChangeTaskStatusResponseDto> {
    // Проверяем, что задача существует
    const existingTask = await this.taskHistoryRepository.findOne({
      where: { taskId },
      order: { createdAt: 'DESC' },
    });

    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const currentStatus = existingTask.toStatus as TaskStatus;
    const newStatus = statusDto.newStatus;

    // Валидация перехода статуса
    if (
      !this.isValidStatusTransition(
        currentStatus,
        newStatus,
        statusDto.forceChange,
      )
    ) {
      throw new BadRequestException(
        `Invalid status transition from '${currentStatus}' to '${newStatus}'. ` +
          `Allowed transitions: ${this.allowedStatusTransitions[currentStatus]?.join(', ') || 'none'}`,
      );
    }

    // Создаем запись об изменении статуса
    const statusChangeHistory = this.taskHistoryRepository.create({
      taskId: taskId,
      taskKey: existingTask.taskKey,
      taskTitle: existingTask.taskTitle,
      action: 'status_changed',
      // Статус изменяется
      fromColumn: existingTask.toColumn,
      toColumn: existingTask.toColumn, // Колонка может остаться той же
      fromStatus: currentStatus,
      toStatus: newStatus,
      status: 'completed', // Статус выполнения операции
      context: {
        ...existingTask.context,
        ...statusDto.context,
        statusChange: {
          fromStatus: currentStatus,
          toStatus: newStatus,
          changedByEmail: statusDto.changedByEmail || '',
          changedByName:
            statusDto.changedByName || statusDto.changedByEmail || 'System',
          statusComment: statusDto.statusComment || '',
          changedAt: new Date().toISOString(),
          forceChange: statusDto.forceChange || false,
          timeInPreviousStatus: this.calculateTimeInStatus(
            existingTask.createdAt,
          ),
        },
      },
      agentId: statusDto.agentId || existingTask.agentId || 'system',
      agentResponse: {
        success: true,
        message: `Status changed from ${currentStatus} to ${newStatus}`,
        timestamp: new Date().toISOString(),
        triggerType: statusDto.triggerType || 'manual',
        statusTransition: `${currentStatus} -> ${newStatus}`,
        workflowValidation: statusDto.forceChange ? 'bypassed' : 'passed',
      },
    });

    const savedStatusChange =
      await this.taskHistoryRepository.save(statusChangeHistory);

    return {
      success: true,
      message: `Task status changed from ${currentStatus} to ${newStatus}`,
      taskId: taskId,
      previousStatus: currentStatus,
      currentStatus: newStatus,
      statusChange: {
        id: savedStatusChange.id,
        taskId: taskId,
        fromStatus: currentStatus,
        toStatus: newStatus,
        changedByEmail: statusDto.changedByEmail,
        changedByName: statusDto.changedByName,
        statusComment: statusDto.statusComment,
        changedAt: savedStatusChange.createdAt,
        context: statusDto.context,
        agentId: statusDto.agentId,
        triggerType: statusDto.triggerType,
        forceChange: statusDto.forceChange,
      },
      timestamp: savedStatusChange.createdAt.toISOString(),
      metadata: {
        workflowValidation: statusDto.forceChange ? 'bypassed' : 'passed',
        timeInPreviousStatus: this.calculateTimeInStatus(
          existingTask.createdAt,
        ),
        allowedNextStatuses: this.allowedStatusTransitions[newStatus] || [],
        queueJobId: `status-${savedStatusChange.id}`,
        notificationsSent: ['email'], // Placeholder for future notification integration
      },
    };
  }
}
