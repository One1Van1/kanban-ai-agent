import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ListFlowsService } from './list-flows.service';
import { ListFlowsQueryDto } from './list-flows.query.dto';
import { ListFlowsResponseDto } from './list-flows.response.dto';
import { ApiListFlows } from './openapi.decorator';

@Controller('flow-management')
@ApiTags('ListFlows')
export class ListFlowsController {
  private readonly logger = new Logger(ListFlowsController.name);

  constructor(private readonly listFlowsService: ListFlowsService) {}

  @Get()
  @ApiListFlows()
  async handle(
    @Query() queryDto: ListFlowsQueryDto,
  ): Promise<ListFlowsResponseDto> {
    this.logger.log(
      `GET /flow-management - Listing flows with filters: ${JSON.stringify(queryDto)}`,
    );

    const result = await this.listFlowsService.execute(queryDto);

    this.logger.log(
      `Found ${result.total} flows, page ${result.page}/${result.totalPages}`,
    );
    return result;
  }
}
