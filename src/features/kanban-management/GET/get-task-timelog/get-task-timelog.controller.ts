import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetTaskTimelogService } from './get-task-timelog.service';
import { GetTaskTimelogRequestDto } from './get-task-timelog.request.dto';
import { GetTaskTimelogResponseDto } from './get-task-timelog.response.dto';
import { ApiGetTaskTimelog } from './openapi.decorator';

@Controller('kanban/tasks')
@ApiTags('GetTaskTimelog')
export class GetTaskTimelogController {
  constructor(private readonly service: GetTaskTimelogService) {}

  @Get(':id/timelog')
  @ApiGetTaskTimelog()
  async handle(
    @Param('id', ParseUUIDPipe) taskId: string,
    @Query() query: GetTaskTimelogRequestDto,
  ): Promise<GetTaskTimelogResponseDto> {
    return this.service.execute(taskId, query);
  }
}
