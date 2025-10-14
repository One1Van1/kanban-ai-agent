import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExecuteFlowService } from './execute-flow.service';
import { ExecuteFlowRequestDto } from './execute-flow.request.dto';
import { ExecuteFlowResponseDto } from './execute-flow.response.dto';
import { ApiExecuteFlow } from './openapi.decorator';

@Controller('ai-agent')
@ApiTags('ExecuteFlow')
export class ExecuteFlowController {
  constructor(private readonly executeFlowService: ExecuteFlowService) {}

  @Post('execute-flow')
  @ApiExecuteFlow()
  async handle(
    @Body() requestDto: ExecuteFlowRequestDto,
  ): Promise<ExecuteFlowResponseDto> {
    return this.executeFlowService.execute(requestDto);
  }
}
