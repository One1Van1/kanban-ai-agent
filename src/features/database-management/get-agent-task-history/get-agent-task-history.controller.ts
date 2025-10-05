import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetAgentTaskHistoryService } from './get-agent-task-history.service';
import { GetAgentTaskHistoryQueryDto } from './get-agent-task-history.request.dto';
import { GetAgentTaskHistoryResponseDto } from './get-agent-task-history.response.dto';
import { ApiGetAgentTaskHistory } from './openapi.decorator';

@Controller('database/task-history')
@ApiTags('GetAgentTaskHistory')
export class GetAgentTaskHistoryController {
  constructor(private readonly service: GetAgentTaskHistoryService) {}

  @Get('agent/:agentId')
  @ApiGetAgentTaskHistory()
  async handle(
    @Param('agentId') agentId: string,
    @Query() query: GetAgentTaskHistoryQueryDto,
  ): Promise<GetAgentTaskHistoryResponseDto> {
    return this.service.execute(agentId, query);
  }
}
