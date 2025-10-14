import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetFlowVariablesService } from './get-flow-variables.service';
import { GetFlowVariablesQueryDto } from './get-flow-variables.query.dto';
import { GetFlowVariablesResponseDto } from './get-flow-variables.response.dto';
import { ApiGetFlowVariables } from './openapi.decorator';

@Controller('context')
@ApiTags('GetFlowVariables')
export class GetFlowVariablesController {
  constructor(private readonly service: GetFlowVariablesService) {}

  @Get('flow/:flowId/variables')
  @ApiGetFlowVariables()
  async handle(
    @Param('flowId') flowId: string,
    @Query() query: GetFlowVariablesQueryDto,
  ): Promise<GetFlowVariablesResponseDto> {
    return this.service.execute(flowId, query);
  }
}
