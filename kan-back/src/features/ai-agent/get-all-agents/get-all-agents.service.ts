import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '../../../entities/agent.entity';
import {
  GetAllAgentsResponseDto,
  AgentSummaryDto,
} from './get-all-agents.response.dto';

@Injectable()
export class GetAllAgentsService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
  ) {}

  async execute(): Promise<GetAllAgentsResponseDto> {
    const [agents, total] = await this.agentRepository.findAndCount({
      order: {
        createdAt: 'DESC',
      },
    });

    const agentSummaries: AgentSummaryDto[] = agents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      status: agent.status,
      boardType: agent.boardType,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
    }));

    return new GetAllAgentsResponseDto(agentSummaries, total);
  }
}
