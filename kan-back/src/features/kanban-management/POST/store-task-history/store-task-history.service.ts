import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreTaskHistoryRequestDto } from './store-task-history.request.dto';
import { StoreTaskHistoryResponseDto } from './store-task-history.response.dto';
import { TaskHistory } from 'kan-back/src/entities/task-history.entity';

@Injectable()
export class StoreTaskHistoryService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(
    dto: StoreTaskHistoryRequestDto,
  ): Promise<StoreTaskHistoryResponseDto> {
    const taskHistory = this.taskHistoryRepository.create({
      agentId: dto.agentId,
      taskId: dto.taskId,
      taskKey: dto.taskKey,
      taskTitle: dto.taskTitle,
      action: dto.action,
      fromStatus: dto.fromStatus,
      toStatus: dto.toStatus,
      fromColumn: dto.fromColumn,
      toColumn: dto.toColumn,
      context: dto.context,
      agentResponse: dto.agentResponse,
      executedInstruction: dto.executedInstruction,
      status: dto.status || 'pending',
      error: dto.error,
      processingTimeMs: dto.processingTimeMs,
    });

    const savedHistory = await this.taskHistoryRepository.save(taskHistory);

    return new StoreTaskHistoryResponseDto(
      savedHistory.id,
      'Task history stored successfully',
    );
  }
}
