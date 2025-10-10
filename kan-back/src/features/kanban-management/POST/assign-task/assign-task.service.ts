import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignTaskRequestDto } from './assign-task.request.dto';
import { AssignTaskResponseDto } from './assign-task.response.dto';
import { TaskHistory } from '@/entities/task-history.entity';
@Injectable()
export class AssignTaskService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(
    taskId: string,
    assignDto: AssignTaskRequestDto,
  ): Promise<AssignTaskResponseDto> {
    // Проверяем, что задача существует
    const existingTask = await this.taskHistoryRepository.findOne({
      where: { taskId },
      order: { createdAt: 'DESC' },
    });

    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Создаем запись о назначении задачи
    const assignmentHistory = this.taskHistoryRepository.create({
      taskId: taskId,
      taskKey: existingTask.taskKey,
      taskTitle: existingTask.taskTitle,
      action: 'task_assigned',
      // Сохраняем текущее состояние задачи
      fromColumn: existingTask.toColumn,
      toColumn: existingTask.toColumn,
      fromStatus: existingTask.toStatus,
      toStatus: existingTask.toStatus,
      status: 'completed', // Статус выполнения операции
      context: {
        ...existingTask.context,
        ...assignDto.context,
        assignment: {
          assigneeEmail: assignDto.assigneeEmail,
          assigneeName: assignDto.assigneeName || assignDto.assigneeEmail,
          assignedByEmail: assignDto.assignedByEmail || '',
          assignedByName:
            assignDto.assignedByName || assignDto.assignedByEmail || 'System',
          assignmentMessage: assignDto.assignmentMessage || '',
          assignedAt: new Date().toISOString(),
          previousAssignee:
            existingTask.context?.assignment?.assigneeEmail || null,
        },
      },
      agentId: assignDto.agentId || existingTask.agentId || 'system',
      agentResponse: {
        success: true,
        message: `Task assigned to ${assignDto.assigneeEmail}`,
        timestamp: new Date().toISOString(),
        triggerType: assignDto.triggerType || 'manual',
        assigneeEmail: assignDto.assigneeEmail,
        assigneeName: assignDto.assigneeName,
      },
    });

    const savedAssignment =
      await this.taskHistoryRepository.save(assignmentHistory);

    return {
      success: true,
      message: `Task successfully assigned to ${assignDto.assigneeEmail}`,
      taskId: taskId,
      assignment: {
        id: savedAssignment.id,
        taskId: taskId,
        assigneeEmail: assignDto.assigneeEmail,
        assigneeName: assignDto.assigneeName,
        assignedByEmail: assignDto.assignedByEmail,
        assignedByName: assignDto.assignedByName,
        assignmentMessage: assignDto.assignmentMessage,
        assignedAt: savedAssignment.createdAt,
        context: assignDto.context,
        agentId: assignDto.agentId,
        triggerType: assignDto.triggerType,
      },
      timestamp: savedAssignment.createdAt.toISOString(),
      metadata: {
        previousAssignee:
          existingTask.context?.assignment?.assigneeEmail || null,
        queueJobId: `assign-${savedAssignment.id}`,
        notificationsSent: ['email'], // Placeholder for future notification integration
      },
    };
  }
}
