import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetTaskStatisticsQueryDto } from './get-task-statistics.request.dto';
import { GetTaskStatisticsResponseDto } from './get-task-statistics.response.dto';
import { TaskHistory } from 'src/entities/task-history.entity';

@Injectable()
export class GetTaskStatisticsService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(
    query: GetTaskStatisticsQueryDto,
  ): Promise<GetTaskStatisticsResponseDto> {
    const queryBuilder =
      this.taskHistoryRepository.createQueryBuilder('history');

    if (query.agentId) {
      queryBuilder.where('history.agentId = :agentId', {
        agentId: query.agentId,
      });
    }

    const [total, completed, failed, pending] = await Promise.all([
      queryBuilder.getCount(),
      queryBuilder
        .clone()
        .andWhere('history.status = :status', { status: 'completed' })
        .getCount(),
      queryBuilder
        .clone()
        .andWhere('history.status = :status', { status: 'failed' })
        .getCount(),
      queryBuilder
        .clone()
        .andWhere('history.status = :status', { status: 'pending' })
        .getCount(),
    ]);

    const processing = total - completed - failed - pending;

    return new GetTaskStatisticsResponseDto(
      {
        total,
        completed,
        failed,
        pending,
        processing,
      },
      query.agentId,
    );
  }
}
