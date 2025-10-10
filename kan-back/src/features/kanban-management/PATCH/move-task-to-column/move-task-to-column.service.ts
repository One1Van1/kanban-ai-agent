import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoveTaskRequestDto } from './move-task-request.dto';
import { MoveTaskResponseDto } from './move-task-response.dto';
import { TaskHistory } from '../../../../entities/task-history.entity';

@Injectable()
export class MoveTaskToColumnService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(
    taskId: string,
    moveDto: MoveTaskRequestDto,
  ): Promise<MoveTaskResponseDto> {
    // Получаем последнюю запись о задаче для получения текущего состояния
    const currentTaskState = await this.taskHistoryRepository.findOne({
      where: { taskId },
      order: { createdAt: 'DESC' },
    });

    if (!currentTaskState) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Создаем новую запись о перемещении
    const moveHistory = this.taskHistoryRepository.create({
      taskId: taskId,
      taskKey: currentTaskState.taskKey,
      taskTitle: currentTaskState.taskTitle,
      action: 'moved',
      fromColumn: currentTaskState.toColumn,
      toColumn: moveDto.targetColumn,
      fromStatus: currentTaskState.toStatus,
      toStatus: moveDto.newStatus || currentTaskState.toStatus,
      status: 'completed', // Статус выполнения операции
      context: {
        ...currentTaskState.context,
        ...moveDto.context,
        moveReason: moveDto.context?.reason || 'Task moved to new column',
        previousState: {
          column: currentTaskState.toColumn,
          status: currentTaskState.toStatus,
        },
      },
      agentId: moveDto.agentId || currentTaskState.agentId || 'system',
      agentResponse: {
        success: true,
        message: `Task moved from "${currentTaskState.toColumn}" to "${moveDto.targetColumn}"`,
        timestamp: new Date().toISOString(),
        triggerType: moveDto.triggerType || 'manual',
      },
    });

    const savedMove = await this.taskHistoryRepository.save(moveHistory);

    return new MoveTaskResponseDto(savedMove, currentTaskState);
  }
}
