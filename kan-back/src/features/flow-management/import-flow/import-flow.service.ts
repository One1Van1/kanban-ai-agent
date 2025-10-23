import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flow } from '../../../entities/flow.entity';
import { ImportFlowBodyDto, ImportMode } from './import-flow.body.dto';
import { ImportFlowResponseDto } from './import-flow.response.dto';

@Injectable()
export class ImportFlowService {
  private readonly logger = new Logger(ImportFlowService.name);
  private readonly SUPPORTED_VERSIONS = ['1.0.0'];

  constructor(
    @InjectRepository(Flow)
    private readonly flowRepository: Repository<Flow>,
  ) {}

  async execute(bodyDto: ImportFlowBodyDto): Promise<ImportFlowResponseDto> {
    this.logger.log(`Importing flow: ${bodyDto.name}`);

    try {
      // Validate version
      if (!this.SUPPORTED_VERSIONS.includes(bodyDto.version)) {
        throw new BadRequestException(
          `Unsupported export version: ${bodyDto.version}. Supported versions: ${this.SUPPORTED_VERSIONS.join(', ')}`,
        );
      }

      // Validate import mode
      const importMode = bodyDto.importMode || ImportMode.CREATE_NEW;

      let flow: Flow;
      let isNewFlow = true;

      if (importMode === ImportMode.REPLACE_EXISTING) {
        if (!bodyDto.flowIdToReplace) {
          throw new BadRequestException(
            'flowIdToReplace is required when importMode is REPLACE_EXISTING',
          );
        }

        // Find existing flow
        const existingFlow = await this.flowRepository.findOne({
          where: { id: bodyDto.flowIdToReplace },
        });

        if (!existingFlow) {
          throw new NotFoundException(
            `Flow with ID ${bodyDto.flowIdToReplace} not found`,
          );
        }

        flow = existingFlow;

        this.logger.log(`Replacing existing flow: ${flow.name}`);
        isNewFlow = false;

        // Update existing flow
        flow.name = bodyDto.name;
        flow.description = bodyDto.description;
        flow.status = bodyDto.status as any;
        flow.definition = bodyDto.definition;
        flow.metadata = bodyDto.metadata;
        flow.updatedBy = bodyDto.createdBy || 'system';
        flow.updatedAt = new Date();
      } else {
        // Create new flow
        this.logger.log(`Creating new flow: ${bodyDto.name}`);

        flow = this.flowRepository.create({
          name: bodyDto.name,
          description: bodyDto.description,
          status: bodyDto.status as any,
          definition: bodyDto.definition,
          metadata: bodyDto.metadata,
          createdBy: bodyDto.createdBy || 'system',
          updatedBy: bodyDto.createdBy || 'system',
        });
      }

      // Save flow
      const savedFlow = await this.flowRepository.save(flow);

      this.logger.log(
        `Flow imported successfully: ${savedFlow.name} (ID: ${savedFlow.id})`,
      );

      return new ImportFlowResponseDto({
        status: 'success',
        message: isNewFlow
          ? 'Flow imported successfully as a new flow'
          : 'Flow imported successfully, existing flow replaced',
        flowId: savedFlow.id,
        flowName: savedFlow.name,
        importMode,
        isNewFlow,
      });
    } catch (error) {
      this.logger.error(`Failed to import flow: ${error.message}`, error.stack);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new BadRequestException('Failed to import flow');
    }
  }
}
