import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetFlowExecutionStatusService } from './get-flow-execution-status.service';
import { GetFlowExecutionStatusQueryDto } from './get-flow-execution-status.query.dto';
import { GetFlowExecutionStatusResponseDto } from './get-flow-execution-status.response.dto';
import { ApiGetFlowExecutionStatus } from './openapi.decorator';

@Controller('ai-agent')
@ApiTags('GetFlowExecutionStatus')
export class GetFlowExecutionStatusController {
  constructor(private readonly service: GetFlowExecutionStatusService) {}

  @Get('flow-execution/:executionId/status')
  @ApiGetFlowExecutionStatus()
  async handle(
    @Param('executionId') executionId: string,
    @Query() query: GetFlowExecutionStatusQueryDto,
  ): Promise<GetFlowExecutionStatusResponseDto> {
    return this.service.execute(executionId, query);
  }
}
