import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExecuteAgentActionService } from './execute-agent-action.service';
import { ExecuteAgentActionRequestDto } from './execute-agent-action.request.dto';
import { ExecuteAgentActionResponseDto } from './execute-agent-action.response.dto';
import { ApiExecuteAgentAction } from './openapi.decorator';

@Controller('ai-agent')
@ApiTags('ExecuteAgentAction')
export class ExecuteAgentActionController {
  constructor(private readonly service: ExecuteAgentActionService) {}

  @Post('execute-action')
  @ApiExecuteAgentAction()
  async handle(
    @Body() request: ExecuteAgentActionRequestDto,
  ): Promise<ExecuteAgentActionResponseDto> {
    return this.service.execute(request);
  }
}
