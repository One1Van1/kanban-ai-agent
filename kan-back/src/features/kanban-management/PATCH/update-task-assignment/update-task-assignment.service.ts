import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistory } from '@/entities/task-history.entity';
import {
  UpdateTaskAssignmentRequestDto,
  AssignmentAction,
} from './update-task-assignment.request.dto';
import {
  UpdateTaskAssignmentResponseDto,
  AssignmentChangeMetadata,
} from './update-task-assignment.response.dto';

@Injectable()
export class UpdateTaskAssignmentService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async updateAssignment(
    taskId: string,
    requestDto: UpdateTaskAssignmentRequestDto,
  ): Promise<UpdateTaskAssignmentResponseDto> {
    const currentTask = await this.getCurrentTaskState(taskId);

    if (!currentTask) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    await this.validateAssignmentRequest(requestDto);

    const changeMetadata = await this.calculateAssignmentChanges(
      currentTask,
      requestDto,
    );
    const updatedAssignmentData = this.applyAssignmentUpdates(
      currentTask,
      requestDto,
    );

    const historyLog = this.taskHistoryRepository.create({
      agentId: 'system',
      taskId,
      taskKey: currentTask.taskKey,
      taskTitle: currentTask.taskTitle,
      action: 'assignment_updated',
      fromStatus: currentTask.status,
      toStatus: currentTask.status,
      fromColumn: currentTask.toColumn,
      toColumn: currentTask.toColumn,
      status: 'completed',
      context: {
        updateType: 'task_assignment',
        assignmentAction: requestDto.action,
        assignmentChanges: changeMetadata,
        assignmentData: updatedAssignmentData,
        assignmentReason: requestDto.assignmentReason,
      },
      agentResponse: {
        success: true,
        assignmentUpdated: true,
        notificationsSent: requestDto.notifyAssignees ?? false,
        timestamp: new Date().toISOString(),
      },
    });

    const savedLog = await this.taskHistoryRepository.save(historyLog);

    return {
      taskId,
      action: requestDto.action,
      assignee: updatedAssignmentData.assignee,
      previousAssignee: changeMetadata.previousAssignee,
      watchers: updatedAssignmentData.watchers,
      assignmentDetails: requestDto.assignmentDetails,
      updatedBy: requestDto.updatedBy,
      updatedAt: savedLog.createdAt,
      assignmentReason: requestDto.assignmentReason,
      watchersAdded: changeMetadata.watchersAdded,
      watchersRemoved: changeMetadata.watchersRemoved,
      notificationsSent: requestDto.notifyAssignees ?? false,
      assignmentPriority: requestDto.assignmentPriority,
      success: true,
      assignmentVersion: (await this.getAssignmentVersion(taskId)) + 1,
      historyLogId: savedLog.id,
    };
  }

  private async getCurrentTaskState(taskId: string) {
    return await this.taskHistoryRepository.findOne({
      where: { taskId },
      order: { createdAt: 'DESC' },
    });
  }

  private async validateAssignmentRequest(
    requestDto: UpdateTaskAssignmentRequestDto,
  ): Promise<void> {
    if (!Object.values(AssignmentAction).includes(requestDto.action)) {
      throw new BadRequestException(
        `Invalid assignment action: ${requestDto.action}`,
      );
    }

    if (requestDto.action === AssignmentAction.ASSIGN && !requestDto.assignee) {
      throw new BadRequestException('Assignee is required for assign action');
    }

    if (
      requestDto.action === AssignmentAction.REASSIGN &&
      !requestDto.assignee
    ) {
      throw new BadRequestException(
        'New assignee is required for reassign action',
      );
    }

    if (requestDto.assignmentDetails) {
      for (const detail of requestDto.assignmentDetails) {
        if (detail.startDate && detail.endDate) {
          const start = new Date(detail.startDate);
          const end = new Date(detail.endDate);
          if (start >= end) {
            throw new BadRequestException('Start date must be before end date');
          }
        }
      }
    }
  }

  private async calculateAssignmentChanges(
    currentTask: TaskHistory,
    requestDto: UpdateTaskAssignmentRequestDto,
  ): Promise<AssignmentChangeMetadata> {
    const currentData = currentTask.context?.assignmentData || {};
    const currentWatchers = currentData.watchers || [];
    const newWatchers = requestDto.watchers || [];

    const watchersAdded = newWatchers.filter(
      (w: string) => !currentWatchers.includes(w),
    );
    const watchersRemoved = currentWatchers.filter(
      (w: string) => !newWatchers.includes(w),
    );

    return {
      action: requestDto.action,
      previousAssignee: currentData.assignee,
      newAssignee: requestDto.assignee,
      watchersAdded,
      watchersRemoved,
      assignmentHistory: [
        {
          userId: requestDto.updatedBy,
          action: requestDto.action,
          timestamp: new Date(),
        },
      ],
    };
  }

  private applyAssignmentUpdates(
    currentTask: TaskHistory,
    requestDto: UpdateTaskAssignmentRequestDto,
  ) {
    const currentData = currentTask.context?.assignmentData || {};

    let updatedAssignee = currentData.assignee;

    switch (requestDto.action) {
      case AssignmentAction.ASSIGN:
      case AssignmentAction.REASSIGN:
        updatedAssignee = requestDto.assignee;
        break;
      case AssignmentAction.UNASSIGN:
        updatedAssignee = undefined;
        break;
    }

    return {
      assignee: updatedAssignee,
      watchers: requestDto.watchers || currentData.watchers || [],
      assignmentDetails:
        requestDto.assignmentDetails || currentData.assignmentDetails,
      assignmentPriority:
        requestDto.assignmentPriority || currentData.assignmentPriority,
    };
  }

  private async getAssignmentVersion(taskId: string): Promise<number> {
    return await this.taskHistoryRepository.count({
      where: {
        taskId,
        action: 'assignment_updated',
      },
    });
  }
}
