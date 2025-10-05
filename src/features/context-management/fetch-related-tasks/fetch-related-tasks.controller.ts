import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FetchRelatedTasksService } from './fetch-related-tasks.service';
import { FetchRelatedTasksQueryDto } from './fetch-related-tasks.query.dto';
import { FetchRelatedTasksResponseDto } from './fetch-related-tasks.response.dto';
import { ApiFetchRelatedTasks } from './openapi.decorator';

@Controller('context-management/related-tasks')
@ApiTags('FetchRelatedTasks')
export class FetchRelatedTasksController {
  constructor(private readonly service: FetchRelatedTasksService) {}

  @Get(':taskId')
  @ApiFetchRelatedTasks()
  async handle(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Query() query: FetchRelatedTasksQueryDto,
  ): Promise<FetchRelatedTasksResponseDto> {
    return this.service.execute(taskId, query);
  }
}
