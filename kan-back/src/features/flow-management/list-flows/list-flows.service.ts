import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Flow } from '../../../entities/flow.entity';
import { ListFlowsQueryDto } from './list-flows.query.dto';
import { ListFlowsResponseDto } from './list-flows.response.dto';

@Injectable()
export class ListFlowsService {
  private readonly logger = new Logger(ListFlowsService.name);

  constructor(
    @InjectRepository(Flow)
    private readonly flowRepository: Repository<Flow>,
  ) {}

  async execute(queryDto: ListFlowsQueryDto): Promise<ListFlowsResponseDto> {
    this.logger.log(`Listing flows with filters: ${JSON.stringify(queryDto)}`);

    try {
      const queryBuilder = this.buildQuery(queryDto);

      // Get total count
      const total = await queryBuilder.getCount();

      // Apply pagination
      const page = queryDto.page || 1;
      const limit = queryDto.limit || 10;
      const offset = (page - 1) * limit;
      queryBuilder.skip(offset).take(limit);

      // Execute query
      const flows = await queryBuilder.getMany();

      // Transform to response format
      const items = flows.map((flow) => ({
        flowId: flow.id,
        name: flow.name,
        description: flow.description,
        status: flow.status,
        agentId: flow.agentId,
        blockCount: flow.definition?.blocks?.length || 0,
        metadata: flow.metadata,
        createdBy: flow.createdBy,
        createdAt: flow.createdAt,
        updatedAt: flow.updatedAt,
      }));

      this.logger.log(
        `Found ${total} flows, returning ${items.length} for page ${page}`,
      );

      return new ListFlowsResponseDto(items, total, page, limit);
    } catch (error) {
      this.logger.error(`Failed to list flows: ${error.message}`, error.stack);
      throw error;
    }
  }

  private buildQuery(queryDto: ListFlowsQueryDto): SelectQueryBuilder<Flow> {
    const queryBuilder = this.flowRepository
      .createQueryBuilder('flow')
      .orderBy('flow.updatedAt', 'DESC');

    // Apply filters
    if (queryDto.status) {
      queryBuilder.andWhere('flow.status = :status', {
        status: queryDto.status,
      });
    }

    if (queryDto.createdBy) {
      queryBuilder.andWhere('flow.createdBy = :createdBy', {
        createdBy: queryDto.createdBy,
      });
    }

    if (queryDto.agentId) {
      queryBuilder.andWhere('flow.agentId = :agentId', {
        agentId: queryDto.agentId,
      });
    }

    if (queryDto.search) {
      queryBuilder.andWhere(
        '(flow.name ILIKE :search OR flow.description ILIKE :search)',
        { search: `%${queryDto.search}%` },
      );
    }

    if (queryDto.isTemplate !== undefined) {
      queryBuilder.andWhere("flow.metadata ->> 'isTemplate' = :isTemplate", {
        isTemplate: queryDto.isTemplate.toString(),
      });
    }

    if (queryDto.category) {
      queryBuilder.andWhere("flow.metadata ->> 'category' = :category", {
        category: queryDto.category,
      });
    }

    return queryBuilder;
  }
}
