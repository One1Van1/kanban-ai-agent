import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetAgentTaskHistoryQueryDto } from './get-agent-task-history.request.dto';
import { GetAgentTaskHistoryResponseDto } from './get-agent-task-history.response.dto';
import { TaskHistory } from 'kan-back/src/entities/task-history.entity';

@Injectable()
export class GetAgentTaskHistoryService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(
    agentId: string,
    query: GetAgentTaskHistoryQueryDto,
  ): Promise<GetAgentTaskHistoryResponseDto> {
    const limit = query.limit || 50;

    const items = await this.taskHistoryRepository.find({
      where: { agentId },
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return new GetAgentTaskHistoryResponseDto(agentId, items);
  }
}
