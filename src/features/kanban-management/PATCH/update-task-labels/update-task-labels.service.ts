import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistory } from '../../../../entities/task-history.entity';
import {
  UpdateTaskLabelsRequestDto,
  LabelOperation,
} from './update-task-labels.request.dto';
import {
  UpdateTaskLabelsResponseDto,
  LabelChange,
} from './update-task-labels.response.dto';

@Injectable()
export class UpdateTaskLabelsService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(
    taskId: string,
    requestDto: UpdateTaskLabelsRequestDto,
  ): Promise<UpdateTaskLabelsResponseDto> {
    const task = await this.validateTaskExists(taskId);
    const currentLabels = await this.getCurrentTaskLabels(taskId);

    const { updatedLabels, addedLabels, removedLabels, labelChanges } =
      this.processLabelOperation(currentLabels, requestDto);

    const historyLog = await this.createLabelsHistoryLog(
      taskId,
      task,
      requestDto,
      addedLabels,
      removedLabels,
    );

    return {
      taskId,
      operation: requestDto.operation,
      currentLabels: updatedLabels,
      addedLabels,
      removedLabels,
      totalLabelsCount: updatedLabels.length,
      updatedAt: historyLog.createdAt,
      updatedBy: requestDto.updatedBy,
      updateReason: requestDto.updateReason,
      success: true,
      labelChanges,
      historyLogId: historyLog.id,
    };
  }

  private async validateTaskExists(taskId: string): Promise<TaskHistory> {
    const task = await this.taskHistoryRepository.findOne({
      where: {
        taskId,
        action: 'task_created',
      },
      order: { createdAt: 'DESC' },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    return task;
  }

  private async getCurrentTaskLabels(taskId: string): Promise<string[]> {
    // Get the most recent labels update or task creation
    const labelRecord = await this.taskHistoryRepository.findOne({
      where: [
        { taskId, action: 'labels_updated' },
        { taskId, action: 'task_created' },
      ],
      order: { createdAt: 'DESC' },
    });

    if (!labelRecord) {
      return [];
    }

    // Extract labels from context or agentResponse
    const labels =
      labelRecord.context?.taskData?.labels ||
      labelRecord.agentResponse?.labels ||
      [];

    return Array.isArray(labels) ? labels : [];
  }

  private processLabelOperation(
    currentLabels: string[],
    requestDto: UpdateTaskLabelsRequestDto,
  ): {
    updatedLabels: string[];
    addedLabels: string[];
    removedLabels: string[];
    labelChanges: LabelChange[];
  } {
    let updatedLabels: string[] = [...currentLabels];
    let addedLabels: string[] = [];
    let removedLabels: string[] = [];
    const labelChanges: LabelChange[] = [];
    const timestamp = new Date();

    switch (requestDto.operation) {
      case LabelOperation.ADD:
        for (const label of requestDto.labels) {
          if (!updatedLabels.includes(label)) {
            updatedLabels.push(label);
            addedLabels.push(label);
            labelChanges.push({
              labelName: label,
              operation: 'added',
              timestamp,
            });
          }
        }
        break;

      case LabelOperation.REMOVE:
        for (const label of requestDto.labels) {
          const index = updatedLabels.indexOf(label);
          if (index > -1) {
            updatedLabels.splice(index, 1);
            removedLabels.push(label);
            labelChanges.push({
              labelName: label,
              operation: 'removed',
              timestamp,
            });
          }
        }
        break;

      case LabelOperation.REPLACE:
        removedLabels = currentLabels.filter(
          (label) => !requestDto.labels.includes(label),
        );
        addedLabels = requestDto.labels.filter(
          (label) => !currentLabels.includes(label),
        );
        updatedLabels = [...requestDto.labels];

        // Record all changes
        removedLabels.forEach((label) => {
          labelChanges.push({
            labelName: label,
            operation: 'removed',
            timestamp,
          });
        });

        addedLabels.forEach((label) => {
          labelChanges.push({
            labelName: label,
            operation: 'added',
            timestamp,
          });
        });
        break;
    }

    return {
      updatedLabels: updatedLabels.sort(), // Sort for consistency
      addedLabels,
      removedLabels,
      labelChanges,
    };
  }

  private async createLabelsHistoryLog(
    taskId: string,
    task: TaskHistory,
    requestDto: UpdateTaskLabelsRequestDto,
    addedLabels: string[],
    removedLabels: string[],
  ): Promise<TaskHistory> {
    const historyLog = this.taskHistoryRepository.create({
      agentId: requestDto.updatedBy || 'system',
      taskId,
      taskKey: task.taskKey,
      taskTitle: `Updated labels: ${task.taskTitle}`,
      action: 'labels_updated',
      fromStatus: task.fromStatus || task.toStatus,
      toStatus: task.toStatus,
      fromColumn: task.fromColumn || task.toColumn,
      toColumn: task.toColumn,
      status: 'completed',
      context: {
        labelOperation: requestDto.operation,
        labelsToApply: requestDto.labels,
        addedLabels,
        removedLabels,
        updateReason: requestDto.updateReason,
        taskData: {
          labels: requestDto.labels, // Store final labels state
        },
      },
      agentResponse: {
        success: true,
        labelsUpdated: true,
        operation: requestDto.operation,
        addedCount: addedLabels.length,
        removedCount: removedLabels.length,
        timestamp: new Date().toISOString(),
        labels: requestDto.labels,
      },
    });

    return await this.taskHistoryRepository.save(historyLog);
  }
}
