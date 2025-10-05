import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistory } from '../../../entities/task-history.entity';
import { GetTaskHistoryResponseDto } from './get-task-history.response.dto';

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
