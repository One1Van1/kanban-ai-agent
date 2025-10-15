import {
  Controller,
  Post,
  Param,
  Body,
  Logger,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExecuteFlowService } from './execute-flow.service';
import { ExecuteFlowRequestDto } from './execute-flow.request.dto';
import { ExecuteFlowResponseDto } from './execute-flow.response.dto';
import { ApiExecuteFlow } from './openapi.decorator';

@Controller('flow-management')
@ApiTags('ExecuteFlow')
export class ExecuteFlowController {
  private readonly logger = new Logger(ExecuteFlowController.name);

  constructor(private readonly executeFlowService: ExecuteFlowService) {}

  @Post(':id/execute')
  @ApiExecuteFlow()
  async handle(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requestDto: ExecuteFlowRequestDto,
  ): Promise<ExecuteFlowResponseDto> {
    this.logger.log(`POST /flow-management/${id}/execute - Executing flow`);

    const result = await this.executeFlowService.execute(id, requestDto);

    this.logger.log(`Flow execution started: ${result.executionId}`);
    return result;
  }
}
