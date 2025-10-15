import {
  Controller,
  Patch,
  Param,
  Body,
  Logger,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateFlowService } from './update-flow.service';
import { UpdateFlowRequestDto } from './update-flow.request.dto';
import { UpdateFlowResponseDto } from './update-flow.response.dto';
import { ApiUpdateFlow } from './openapi.decorator';

@Controller('flow-management')
@ApiTags('UpdateFlow')
export class UpdateFlowController {
  private readonly logger = new Logger(UpdateFlowController.name);

  constructor(private readonly updateFlowService: UpdateFlowService) {}

  @Patch(':id')
  @ApiUpdateFlow()
  async handle(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requestDto: UpdateFlowRequestDto,
  ): Promise<UpdateFlowResponseDto> {
    this.logger.log(`PATCH /flow-management/${id} - Updating flow`);

    const result = await this.updateFlowService.execute(id, requestDto);

    this.logger.log(`Flow updated successfully: ${result.name}`);
    return result;
  }
}
