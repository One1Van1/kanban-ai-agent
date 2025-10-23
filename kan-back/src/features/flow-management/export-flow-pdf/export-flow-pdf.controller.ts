import {
  Controller,
  Get,
  Param,
  Logger,
  Header,
  StreamableFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExportFlowPdfService } from './export-flow-pdf.service';
import { ApiExportFlowPdf } from './openapi.decorator';

@Controller('flow-management/export-pdf')
@ApiTags('ExportFlowPdf')
export class ExportFlowPdfController {
  private readonly logger = new Logger(ExportFlowPdfController.name);

  constructor(private readonly exportFlowPdfService: ExportFlowPdfService) {}

  @Get(':id')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="flow-export.pdf"')
  @ApiExportFlowPdf()
  async handle(@Param('id') id: string): Promise<StreamableFile> {
    this.logger.log(`📄 Export flow to PDF request: ${id}`);

    const pdfBuffer = await this.exportFlowPdfService.execute({ id });

    this.logger.log(`✅ PDF generated successfully for flow: ${id}`);

    return new StreamableFile(pdfBuffer);
  }
}
