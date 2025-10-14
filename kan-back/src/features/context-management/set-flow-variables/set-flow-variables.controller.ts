import { Controller, Post, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SetFlowVariablesService } from './set-flow-variables.service';
import { SetFlowVariablesRequestDto } from './set-flow-variables.request.dto';
import { SetFlowVariablesResponseDto } from './set-flow-variables.response.dto';
import { ApiSetFlowVariables } from './openapi.decorator';

@Controller('context')
@ApiTags('SetFlowVariables')
export class SetFlowVariablesController {
  constructor(private readonly service: SetFlowVariablesService) {}

  @Post('flow/:flowId/variables')
  @ApiSetFlowVariables()
  async handle(
    @Param('flowId') flowId: string,
    @Body() request: SetFlowVariablesRequestDto,
  ): Promise<SetFlowVariablesResponseDto> {
    return this.service.execute(flowId, request);
  }
}
