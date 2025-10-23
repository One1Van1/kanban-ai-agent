import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ImportFlowService } from './import-flow.service';
import { ImportFlowBodyDto } from './import-flow.body.dto';
import { ImportFlowResponseDto } from './import-flow.response.dto';
import { ApiImportFlow } from './openapi.decorator';

@Controller('flow-management/import')
@ApiTags('ImportFlow')
export class ImportFlowController {
  private readonly logger = new Logger(ImportFlowController.name);

  constructor(private readonly importFlowService: ImportFlowService) {}

  @Post()
  @ApiImportFlow()
  async handle(
    @Body() bodyDto: ImportFlowBodyDto,
  ): Promise<ImportFlowResponseDto> {
    this.logger.log(`📥 Import flow request: ${bodyDto.name}`);

    const result = await this.importFlowService.execute(bodyDto);

    this.logger.log(`✅ Flow imported successfully: ${result.flowId}`);

    return result;
  }
}
