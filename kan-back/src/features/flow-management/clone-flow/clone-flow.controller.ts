import {
  Controller,
  Post,
  Param,
  Body,
  Logger,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CloneFlowService } from './clone-flow.service';
import { CloneFlowRequestDto } from './clone-flow.request.dto';
import { CloneFlowResponseDto } from './clone-flow.response.dto';
import { ApiCloneFlow } from './openapi.decorator';

@Controller('flow-management')
@ApiTags('CloneFlow')
export class CloneFlowController {
  private readonly logger = new Logger(CloneFlowController.name);

  constructor(private readonly cloneFlowService: CloneFlowService) {}

  @Post(':id/clone')
  @ApiCloneFlow()
  async handle(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requestDto: CloneFlowRequestDto,
  ): Promise<CloneFlowResponseDto> {
    this.logger.log(`POST /flow-management/${id}/clone - Cloning flow`);

    const result = await this.cloneFlowService.execute(id, requestDto);

    this.logger.log(
      `Flow cloned successfully: ${result.name} (${result.flowId})`,
    );
    return result;
  }
}
