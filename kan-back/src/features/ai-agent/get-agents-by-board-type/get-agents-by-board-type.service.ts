import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '../../../entities/agent.entity';
import { BoardType } from '../../../types/board-integration.interface';
import {
  GetAgentsByBoardTypeResponseDto,
  AgentSummaryDto,
} from './get-agents-by-board-type.response.dto';

@Injectable()
export class GetAgentsByBoardTypeService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
  ) {}

  async execute(
    boardType: BoardType,
  ): Promise<GetAgentsByBoardTypeResponseDto> {
    const [agents, total] = await this.agentRepository.findAndCount({
      where: { boardType },
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

    return new GetAgentsByBoardTypeResponseDto(
      agentSummaries,
      boardType,
      total,
    );
  }
}
