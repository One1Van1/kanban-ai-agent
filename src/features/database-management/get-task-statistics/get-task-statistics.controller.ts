import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetTaskStatisticsService } from './get-task-statistics.service';
import { GetTaskStatisticsQueryDto } from './get-task-statistics.request.dto';
import { GetTaskStatisticsResponseDto } from './get-task-statistics.response.dto';
import { ApiGetTaskStatistics } from './openapi.decorator';

@Controller('database/task-history')
@ApiTags('GetTaskStatistics')
export class GetTaskStatisticsController {
  constructor(private readonly service: GetTaskStatisticsService) {}

  @Get('statistics')
  @ApiGetTaskStatistics()
  async handle(
    @Query() query: GetTaskStatisticsQueryDto,
  ): Promise<GetTaskStatisticsResponseDto> {
    return this.service.execute(query);
  }
}
