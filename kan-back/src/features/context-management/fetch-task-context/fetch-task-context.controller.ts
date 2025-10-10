import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FetchTaskContextService } from './fetch-task-context.service';
import { FetchTaskContextResponseDto } from './fetch-task-context.response.dto';
import { ApiFetchTaskContext } from './openapi.decorator';

@Controller('context-management/task-context')
@ApiTags('FetchTaskContext')
export class FetchTaskContextController {
  constructor(private readonly service: FetchTaskContextService) {}

  @Get(':taskId')
  @ApiFetchTaskContext()
  async handle(
    @Param('taskId', ParseUUIDPipe) taskId: string,
  ): Promise<FetchTaskContextResponseDto> {
    return this.service.execute(taskId);
  }
}
