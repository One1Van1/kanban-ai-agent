import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FetchExternalContextService } from './fetch-external-context.service';
import { FetchExternalContextQueryDto } from './fetch-external-context.query.dto';
import { FetchExternalContextResponseDto } from './fetch-external-context.response.dto';
import { ApiFetchExternalContext } from './openapi.decorator';

@Controller('context-management/external-context')
@ApiTags('FetchExternalContext')
export class FetchExternalContextController {
  constructor(private readonly service: FetchExternalContextService) {}

  @Get(':taskId')
  @ApiFetchExternalContext()
  async handle(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Query() query: FetchExternalContextQueryDto,
  ): Promise<FetchExternalContextResponseDto> {
    return this.service.execute(taskId, query);
  }
}
