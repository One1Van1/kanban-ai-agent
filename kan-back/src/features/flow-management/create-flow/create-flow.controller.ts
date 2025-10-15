import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateFlowService } from './create-flow.service';
import { CreateFlowRequestDto } from './create-flow.request.dto';
import { CreateFlowResponseDto } from './create-flow.response.dto';
import { ApiCreateFlow } from './openapi.decorator';

@Controller('flow-management')
@ApiTags('CreateFlow')
export class CreateFlowController {
  private readonly logger = new Logger(CreateFlowController.name);

  constructor(private readonly createFlowService: CreateFlowService) {}

  @Post('create-flow')
  @ApiCreateFlow()
  async handle(
    @Body() requestDto: CreateFlowRequestDto,
  ): Promise<CreateFlowResponseDto> {
    this.logger.log(
      `POST /flow-management/create-flow - Creating flow: ${requestDto.name}`,
    );

    const result = await this.createFlowService.execute(requestDto);

    this.logger.log(`Flow created successfully with ID: ${result.flowId}`);
    return result;
  }
}
