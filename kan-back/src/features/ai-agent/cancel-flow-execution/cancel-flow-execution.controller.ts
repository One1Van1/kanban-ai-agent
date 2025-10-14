import { Controller, Post, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CancelFlowExecutionService } from './cancel-flow-execution.service';
import { CancelFlowExecutionResponseDto } from './cancel-flow-execution.response.dto';
import { CancelFlowExecutionQueryDto } from './cancel-flow-execution.query.dto';
import { ApiCancelFlowExecution } from './openapi.decorator';

@Controller('ai-agent')
@ApiTags('CancelFlowExecution')
export class CancelFlowExecutionController {
  constructor(private readonly service: CancelFlowExecutionService) {}

  @Post('flow-execution/:executionId/cancel')
  @ApiCancelFlowExecution()
  async handle(
    @Param('executionId') executionId: string,
    @Query() query: CancelFlowExecutionQueryDto,
  ): Promise<CancelFlowExecutionResponseDto> {
    return this.service.execute(executionId, query.force);
  }
}
