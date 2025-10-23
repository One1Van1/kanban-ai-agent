import { Controller, Get, Param, Logger, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExportFlowJsonService } from './export-flow-json.service';
import { ExportFlowJsonResponseDto } from './export-flow-json.response.dto';
import { ApiExportFlowJson } from './openapi.decorator';

@Controller('flow-management/export-json')
@ApiTags('ExportFlowJson')
export class ExportFlowJsonController {
  private readonly logger = new Logger(ExportFlowJsonController.name);

  constructor(private readonly exportFlowJsonService: ExportFlowJsonService) {}

  @Get(':id')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="flow-export.json"')
  @ApiExportFlowJson()
  async handle(@Param('id') id: string): Promise<ExportFlowJsonResponseDto> {
    this.logger.log(`📤 Export flow to JSON request: ${id}`);

    const result = await this.exportFlowJsonService.execute({ id });

    this.logger.log(`✅ Flow exported successfully: ${id}`);

    return result;
  }
}
