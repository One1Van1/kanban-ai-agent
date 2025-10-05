import { Controller, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetAgentActivityService } from './get-agent-activity.service';
import { GetAgentActivityRequestDto } from './get-agent-activity.request.dto';
import { GetAgentActivityResponseDto } from './get-agent-activity.response.dto';
import { ApiGetAgentActivity } from './openapi.decorator';

@Controller('ai-agent')
@ApiTags('GetAgentActivity')
export class GetAgentActivityController {
  constructor(private readonly service: GetAgentActivityService) {}

  @Get(':agentId/activity')
  @ApiGetAgentActivity()
  async handle(
    @Param('agentId') agentId: string,
    @Query() query: Omit<GetAgentActivityRequestDto, 'agentId'>,
  ): Promise<GetAgentActivityResponseDto> {
    const request: GetAgentActivityRequestDto = {
      agentId,
      ...query,
    };

    return this.service.execute(request);
  }
}
