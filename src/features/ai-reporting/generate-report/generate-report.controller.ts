import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GenerateReportService } from './generate-report.service';
import { GenerateReportRequestDto } from './generate-report.request.dto';
import { GenerateReportResponseDto } from './generate-report.response.dto';
import { ApiGenerateReport } from './openapi.decorator';

@ApiTags('GenerateReport')
@Controller('ai-reporting-agent/generate-report')
export class GenerateReportController {
  private readonly logger = new Logger(GenerateReportController.name);

  constructor(private readonly service: GenerateReportService) {}

  @Post()
  @ApiGenerateReport()
  async handle(
    @Body() dto: GenerateReportRequestDto,
  ): Promise<GenerateReportResponseDto> {
    this.logger.log(`🔍 Starting report generation for task: ${dto.taskKey}`);

    try {
      const report = await this.service.execute(dto);
      this.logger.log(`✅ Report generated successfully for ${dto.taskKey}`);
      return report;
    } catch (error) {
      this.logger.error(
        `❌ Failed to generate report for ${dto.taskKey}:`,
        error,
      );
      throw error;
    }
  }
}
