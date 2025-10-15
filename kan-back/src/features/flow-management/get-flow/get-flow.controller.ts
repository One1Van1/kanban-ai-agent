import { Controller, Get, Param, Logger, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetFlowService } from './get-flow.service';
import { GetFlowQueryDto } from './get-flow.query.dto';
import { GetFlowResponseDto } from './get-flow.response.dto';
import { ApiGetFlow } from './openapi.decorator';

@Controller('flow-management')
@ApiTags('GetFlow')
export class GetFlowController {
  private readonly logger = new Logger(GetFlowController.name);

  constructor(private readonly getFlowService: GetFlowService) {}

  @Get(':id')
  @ApiGetFlow()
  async handle(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GetFlowResponseDto> {
    this.logger.log(`GET /flow-management/${id} - Getting flow`);

    const queryDto: GetFlowQueryDto = { id };
    const result = await this.getFlowService.execute(queryDto);

    this.logger.log(`Flow retrieved successfully: ${result.name}`);
    return result;
  }
}
