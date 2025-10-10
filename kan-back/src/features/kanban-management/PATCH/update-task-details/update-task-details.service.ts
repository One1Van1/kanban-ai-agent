import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistory } from '@/entities/task-history.entity';
import {
  UpdateTaskDetailsRequestDto,
  TaskPriority,
  TaskType,
} from './update-task-details.request.dto';
import {
  UpdateTaskDetailsResponseDto,
  TaskUpdateMetadata,
} from './update-task-details.response.dto';

@Injectable()
export class UpdateTaskDetailsService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async updateDetails(
    taskId: string,
    requestDto: UpdateTaskDetailsRequestDto,
  ): Promise<UpdateTaskDetailsResponseDto> {
    // Get current task state
    const currentTask = await this.getCurrentTaskState(taskId);

    if (!currentTask) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Validate update request
    await this.validateUpdateRequest(requestDto);

    // Calculate what fields are being updated
    const updateMetadata = this.calculateUpdateMetadata(
      currentTask,
      requestDto,
    );

    if (updateMetadata.fieldsUpdated.length === 0) {
      throw new BadRequestException('No fields to update provided');
    }

    // Apply updates and create new task state
    const updatedTaskData = this.applyUpdates(currentTask, requestDto);

    // Create history log entry
    const historyLog = this.taskHistoryRepository.create({
      agentId: 'system',
      taskId,
      taskKey: currentTask.taskKey,
      taskTitle: updatedTaskData.title,
      action: 'task_updated',
      fromStatus: currentTask.status,
      toStatus: currentTask.status, // Status doesn't change in details update
      fromColumn: currentTask.toColumn,
      toColumn: currentTask.toColumn,
      status: 'completed',
      context: {
        updateType: 'task_details',
        fieldsUpdated: updateMetadata.fieldsUpdated,
        previousValues: updateMetadata.previousValues,
        newValues: updateMetadata.newValues,
        updateComment: requestDto.updateComment,
        taskData: updatedTaskData,
      },
      agentResponse: {
        success: true,
        updateApplied: true,
        fieldsModified: updateMetadata.fieldsUpdated.length,
        timestamp: new Date().toISOString(),
      },
    });

    const savedLog = await this.taskHistoryRepository.save(historyLog);

    return {
      taskId,
      title: updatedTaskData.title,
      description: updatedTaskData.description,
      priority: updatedTaskData.priority,
      type: updatedTaskData.type,
      assignee: updatedTaskData.assignee,
      reporter: updatedTaskData.reporter,
      labels: updatedTaskData.labels,
      estimatedHours: updatedTaskData.estimatedHours,
      storyPoints: updatedTaskData.storyPoints,
      dueDate: updatedTaskData.dueDate,
      customFields: updatedTaskData.customFields,
      updatedBy: requestDto.updatedBy,
      updatedAt: savedLog.createdAt,
      fieldsUpdated: updateMetadata.fieldsUpdated,
      previousValues: updateMetadata.previousValues,
      updateComment: requestDto.updateComment,
      success: true,
      version: (await this.getTaskVersion(taskId)) + 1,
      historyLogId: savedLog.id,
    };
  }

  private async getCurrentTaskState(taskId: string) {
    return await this.taskHistoryRepository.findOne({
      where: { taskId },
      order: { createdAt: 'DESC' },
    });
  }

  private async validateUpdateRequest(
    requestDto: UpdateTaskDetailsRequestDto,
  ): Promise<void> {
    // Validate priority enum
    if (
      requestDto.priority &&
      !Object.values(TaskPriority).includes(requestDto.priority)
    ) {
      throw new BadRequestException(`Invalid priority: ${requestDto.priority}`);
    }

    // Validate type enum
    if (requestDto.type && !Object.values(TaskType).includes(requestDto.type)) {
      throw new BadRequestException(`Invalid task type: ${requestDto.type}`);
    }

    // Validate estimated hours
    if (
      requestDto.estimatedHours !== undefined &&
      requestDto.estimatedHours < 0
    ) {
      throw new BadRequestException('Estimated hours cannot be negative');
    }

    // Validate story points
    if (requestDto.storyPoints !== undefined && requestDto.storyPoints < 0) {
      throw new BadRequestException('Story points cannot be negative');
    }

    // Validate due date format
    if (requestDto.dueDate) {
      const dueDate = new Date(requestDto.dueDate);
      if (isNaN(dueDate.getTime())) {
        throw new BadRequestException('Invalid due date format');
      }
    }

    // Validate labels
    if (requestDto.labels) {
      const invalidLabels = requestDto.labels.filter(
        (label) => !label || label.trim().length === 0,
      );
      if (invalidLabels.length > 0) {
        throw new BadRequestException('Labels cannot be empty');
      }
    }
  }

  private calculateUpdateMetadata(
    currentTask: TaskHistory,
    requestDto: UpdateTaskDetailsRequestDto,
  ): TaskUpdateMetadata {
    const fieldsUpdated: string[] = [];
    const previousValues: Record<string, any> = {};
    const newValues: Record<string, any> = {};

    // Get current task data from context or create default
    const currentData = currentTask.context?.taskData || {
      title: currentTask.taskTitle,
      priority: TaskPriority.MEDIUM,
      type: TaskType.TASK,
    };

    // Check each field for changes
    if (requestDto.title && requestDto.title !== currentData.title) {
      fieldsUpdated.push('title');
      previousValues.title = currentData.title;
      newValues.title = requestDto.title;
    }

    if (
      requestDto.description &&
      requestDto.description !== currentData.description
    ) {
      fieldsUpdated.push('description');
      previousValues.description = currentData.description;
      newValues.description = requestDto.description;
    }

    if (requestDto.priority && requestDto.priority !== currentData.priority) {
      fieldsUpdated.push('priority');
      previousValues.priority = currentData.priority;
      newValues.priority = requestDto.priority;
    }

    if (requestDto.type && requestDto.type !== currentData.type) {
      fieldsUpdated.push('type');
      previousValues.type = currentData.type;
      newValues.type = requestDto.type;
    }

    if (requestDto.assignee && requestDto.assignee !== currentData.assignee) {
      fieldsUpdated.push('assignee');
      previousValues.assignee = currentData.assignee;
      newValues.assignee = requestDto.assignee;
    }

    if (requestDto.reporter && requestDto.reporter !== currentData.reporter) {
      fieldsUpdated.push('reporter');
      previousValues.reporter = currentData.reporter;
      newValues.reporter = requestDto.reporter;
    }

    if (
      requestDto.labels &&
      JSON.stringify(requestDto.labels) !== JSON.stringify(currentData.labels)
    ) {
      fieldsUpdated.push('labels');
      previousValues.labels = currentData.labels;
      newValues.labels = requestDto.labels;
    }

    if (
      requestDto.estimatedHours !== undefined &&
      requestDto.estimatedHours !== currentData.estimatedHours
    ) {
      fieldsUpdated.push('estimatedHours');
      previousValues.estimatedHours = currentData.estimatedHours;
      newValues.estimatedHours = requestDto.estimatedHours;
    }

    if (
      requestDto.storyPoints !== undefined &&
      requestDto.storyPoints !== currentData.storyPoints
    ) {
      fieldsUpdated.push('storyPoints');
      previousValues.storyPoints = currentData.storyPoints;
      newValues.storyPoints = requestDto.storyPoints;
    }

    if (requestDto.dueDate && requestDto.dueDate !== currentData.dueDate) {
      fieldsUpdated.push('dueDate');
      previousValues.dueDate = currentData.dueDate;
      newValues.dueDate = requestDto.dueDate;
    }

    if (
      requestDto.customFields &&
      JSON.stringify(requestDto.customFields) !==
        JSON.stringify(currentData.customFields)
    ) {
      fieldsUpdated.push('customFields');
      previousValues.customFields = currentData.customFields;
      newValues.customFields = requestDto.customFields;
    }

    return {
      fieldsUpdated,
      previousValues,
      newValues,
      updateReason: requestDto.updateComment,
      updatedBy: requestDto.updatedBy,
      updatedAt: new Date(),
    };
  }

  private applyUpdates(
    currentTask: TaskHistory,
    requestDto: UpdateTaskDetailsRequestDto,
  ) {
    const currentData = currentTask.context?.taskData || {
      title: currentTask.taskTitle,
      priority: TaskPriority.MEDIUM,
      type: TaskType.TASK,
    };

    return {
      title: requestDto.title || currentData.title,
      description: requestDto.description || currentData.description,
      priority: requestDto.priority || currentData.priority,
      type: requestDto.type || currentData.type,
      assignee: requestDto.assignee || currentData.assignee,
      reporter: requestDto.reporter || currentData.reporter,
      labels: requestDto.labels || currentData.labels,
      estimatedHours:
        requestDto.estimatedHours !== undefined
          ? requestDto.estimatedHours
          : currentData.estimatedHours,
      storyPoints:
        requestDto.storyPoints !== undefined
          ? requestDto.storyPoints
          : currentData.storyPoints,
      dueDate: requestDto.dueDate || currentData.dueDate,
      customFields: requestDto.customFields || currentData.customFields,
    };
  }

  private async getTaskVersion(taskId: string): Promise<number> {
    const updateCount = await this.taskHistoryRepository.count({
      where: {
        taskId,
        action: 'task_updated',
      },
    });

    return updateCount;
  }
}
