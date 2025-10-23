import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flow } from '../../../entities/flow.entity';
import { ExportFlowJsonQueryDto } from './export-flow-json.query.dto';
import { ExportFlowJsonResponseDto } from './export-flow-json.response.dto';

@Injectable()
export class ExportFlowJsonService {
  private readonly logger = new Logger(ExportFlowJsonService.name);
  private readonly EXPORT_FORMAT_VERSION = '1.0.0';

  constructor(
    @InjectRepository(Flow)
    private readonly flowRepository: Repository<Flow>,
  ) {}

  async execute(
    queryDto: ExportFlowJsonQueryDto,
  ): Promise<ExportFlowJsonResponseDto> {
    this.logger.log(`Exporting flow to JSON: ${queryDto.id}`);

    try {
      const flow = await this.flowRepository.findOne({
        where: { id: queryDto.id },
      });

      if (!flow) {
        throw new NotFoundException(`Flow with ID ${queryDto.id} not found`);
      }

      this.logger.log(`Flow "${flow.name}" found, preparing export...`);

      const exportData = new ExportFlowJsonResponseDto({
        version: this.EXPORT_FORMAT_VERSION,
        exportedAt: new Date().toISOString(),
        flowId: flow.id,
        name: flow.name,
        description: flow.description,
        status: flow.status,
        definition: flow.definition,
        metadata: flow.metadata,
        createdBy: flow.createdBy,
        createdAt: flow.createdAt.toISOString(),
        updatedAt: flow.updatedAt.toISOString(),
      });

      this.logger.log(`Flow exported successfully: ${flow.name}`);

      return exportData;
    } catch (error) {
      this.logger.error(`Failed to export flow: ${error.message}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new NotFoundException('Failed to export flow');
    }
  }
}
