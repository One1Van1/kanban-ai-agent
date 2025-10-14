import { Controller, Post, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PauseFlowExecutionService } from './pause-flow-execution.service';
import { PauseFlowExecutionResponseDto } from './pause-flow-execution.response.dto';
import { ApiPauseFlowExecution } from './openapi.decorator';

@Controller('ai-agent')
@ApiTags('PauseFlowExecution')
export class PauseFlowExecutionController {
  constructor(private readonly service: PauseFlowExecutionService) {}

  @Post('flow-execution/:executionId/pause')
  @ApiPauseFlowExecution()
  async handle(
    @Param('executionId') executionId: string,
  ): Promise<PauseFlowExecutionResponseDto> {
    return this.service.execute(executionId);
  }
}
