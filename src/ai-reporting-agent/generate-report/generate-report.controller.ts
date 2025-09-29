import { Controller, Post, Body, Logger, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GenerateReportService } from './generate-report.service';
import { GenerateReportDto, GeneratedReport } from './generate-report.dto';

@ApiTags('AI Reporting Agent')
@Controller('ai-reporting-agent/generate-report')
export class GenerateReportController {
  private readonly logger = new Logger(GenerateReportController.name);

  constructor(private readonly generateReportService: GenerateReportService) {}

  @Post()
  @ApiOperation({
    summary: 'Generate haircut report for specified date range',
    description:
      'Generate comprehensive report of all haircuts performed within the specified date range',
  })
  @ApiResponse({
    status: 200,
    description: 'Report generated successfully',
    type: 'object',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request parameters',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during report generation',
  })
  async generateReport(
    @Body() dto: GenerateReportDto,
  ): Promise<GeneratedReport> {
    this.logger.log(`🔍 Starting report generation for task: ${dto.taskKey}`);

    try {
      const report = await this.generateReportService.generateReport(dto);

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

  @Post('process-task')
  @ApiOperation({
    summary: 'Process report task assigned to AI-Report-maker',
    description:
      'Automatically process a Jira task assigned to AI-Report-maker to generate and post a report',
  })
  @ApiResponse({
    status: 200,
    description: 'Report task processed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid task or not assigned to AI-Report-maker',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during task processing',
  })
  async processReportTask(
    @Body() body: { taskKey: string },
  ): Promise<{ success: boolean; message: string }> {
    this.logger.log(`🎯 Processing report task: ${body.taskKey}`);

    try {
      await this.generateReportService.processReportTask(body.taskKey);

      const message = `Report task ${body.taskKey} processed successfully`;
      this.logger.log(`✅ ${message}`);

      return { success: true, message };
    } catch (error) {
      this.logger.error(
        `❌ Failed to process report task ${body.taskKey}:`,
        error,
      );
      throw error;
    }
  }

  @Get('health')
  @ApiOperation({
    summary: 'Health check for report generation service',
    description: 'Check if the report generation service is operational',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
  })
  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    service: string;
  }> {
    this.logger.log('🏥 Health check requested');

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'AI Reporting Agent - Generate Report',
    };
  }

  @Get('config')
  @ApiOperation({
    summary: 'Get current configuration for report generation',
    description:
      'Display current configuration settings for the report generation service',
  })
  @ApiResponse({
    status: 200,
    description: 'Configuration retrieved successfully',
  })
  async getConfig(): Promise<{
    service: string;
    supportedDateFormats: string[];
    defaultDateRange: string;
    reportTypes: string[];
  }> {
    this.logger.log('⚙️ Configuration requested');

    return {
      service: 'AI Reporting Agent - Generate Report',
      supportedDateFormats: [
        'со вчера до сегодня',
        'за прошлую неделю',
        'DD.MM.YYYY - DD.MM.YYYY',
        'с DD/MM/YYYY по DD/MM/YYYY',
      ],
      defaultDateRange: 'last 7 days',
      reportTypes: [
        'haircut_statistics',
        'quality_analysis',
        'performance_trends',
        'recommendations',
      ],
    };
  }
}
