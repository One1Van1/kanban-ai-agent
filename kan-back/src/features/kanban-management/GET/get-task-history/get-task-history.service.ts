import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetTaskHistoryResponseDto } from './get-task-history.response.dto';
import { TaskHistory } from '@/entities/task-history.entity';
@Injectable()
export class GetTaskHistoryService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(taskId: string): Promise<GetTaskHistoryResponseDto> {
    const items = await this.taskHistoryRepository.find({
      where: { taskId },
      order: { createdAt: 'DESC' },
    });

    return new GetTaskHistoryResponseDto(taskId, items);
  }
}
