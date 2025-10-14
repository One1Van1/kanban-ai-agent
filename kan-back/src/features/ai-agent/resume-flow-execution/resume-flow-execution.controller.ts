import { Controller, Post, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResumeFlowExecutionService } from './resume-flow-execution.service';
import { ResumeFlowExecutionResponseDto } from './resume-flow-execution.response.dto';
import { ApiResumeFlowExecution } from './openapi.decorator';

@Controller('ai-agent')
@ApiTags('ResumeFlowExecution')
export class ResumeFlowExecutionController {
  constructor(private readonly service: ResumeFlowExecutionService) {}

  @Post('flow-execution/:executionId/resume')
  @ApiResumeFlowExecution()
  async handle(
    @Param('executionId') executionId: string,
  ): Promise<ResumeFlowExecutionResponseDto> {
    return this.service.execute(executionId);
  }
}
