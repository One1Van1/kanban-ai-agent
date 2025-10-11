import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '../../../entities/agent.entity';
import { GetAgentByIdResponseDto } from './get-agent-by-id.response.dto';

@Injectable()
export class GetAgentByIdService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
  ) {}

  async execute(id: string): Promise<GetAgentByIdResponseDto> {
    const agent = await this.agentRepository.findOne({
      where: { id },
      relations: ['instructions', 'boardIntegrations'],
    });

    if (!agent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }

    return new GetAgentByIdResponseDto(agent);
  }
}
