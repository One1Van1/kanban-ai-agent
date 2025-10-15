import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flow } from '../../../entities/flow.entity';
import { DeleteFlowResponseDto } from './delete-flow.response.dto';

@Injectable()
export class DeleteFlowService {
  private readonly logger = new Logger(DeleteFlowService.name);

  constructor(
    @InjectRepository(Flow)
    private readonly flowRepository: Repository<Flow>,
  ) {}

  async execute(flowId: string): Promise<DeleteFlowResponseDto> {
    this.logger.log(`Deleting flow with ID: ${flowId}`);

    try {
      const flow = await this.flowRepository.findOne({
        where: { id: flowId },
      });

      if (!flow) {
        throw new NotFoundException(`Flow with ID ${flowId} not found`);
      }

      await this.flowRepository.remove(flow);

      this.logger.log(`Flow deleted successfully: ${flow.name}`);

      return new DeleteFlowResponseDto(flowId);
    } catch (error) {
      this.logger.error(`Failed to delete flow: ${error.message}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new Error('Failed to delete flow');
    }
  }
}
