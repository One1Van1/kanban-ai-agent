import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flow } from '../../../entities/flow.entity';
import { GetFlowQueryDto } from './get-flow.query.dto';
import { GetFlowResponseDto } from './get-flow.response.dto';

@Injectable()
export class GetFlowService {
  private readonly logger = new Logger(GetFlowService.name);

  constructor(
    @InjectRepository(Flow)
    private readonly flowRepository: Repository<Flow>,
  ) {}

  async execute(queryDto: GetFlowQueryDto): Promise<GetFlowResponseDto> {
    this.logger.log(`Getting flow with ID: ${queryDto.id}`);

    try {
      const flow = await this.flowRepository.findOne({
        where: { id: queryDto.id },
        relations: ['agent'],
      });

      if (!flow) {
        throw new NotFoundException(`Flow with ID ${queryDto.id} not found`);
      }

      this.logger.log(`Flow found: ${flow.name}`);

      return new GetFlowResponseDto({
        flowId: flow.id,
        name: flow.name,
        description: flow.description,
        status: flow.status,
        definition: flow.definition,
        agentId: flow.agentId,
        metadata: flow.metadata,
        createdBy: flow.createdBy,
        updatedBy: flow.updatedBy,
        createdAt: flow.createdAt,
        updatedAt: flow.updatedAt,
      });
    } catch (error) {
      this.logger.error(`Failed to get flow: ${error.message}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new NotFoundException('Flow not found');
    }
  }
}
