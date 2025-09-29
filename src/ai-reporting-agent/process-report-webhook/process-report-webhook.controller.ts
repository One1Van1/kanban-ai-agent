import { Controller, Post, Body, Logger, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProcessReportWebhookService } from './process-report-webhook.service';
import { ProcessReportWebhookDto } from './process-report-webhook.dto';

@ApiTags('AI Reporting Agent')
@Controller('ai-reporting-agent/process-report-webhook')
export class ProcessReportWebhookController {
  private readonly logger = new Logger(ProcessReportWebhookController.name);

  constructor(
    private readonly processReportWebhookService: ProcessReportWebhookService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Process Jira webhook for report generation',
    description:
      'Automatically process Jira webhooks to detect tasks assigned to AI-Report-maker and generate reports',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid webhook payload',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during webhook processing',
  })
  async processWebhook(
    @Body() payload: any,
  ): Promise<{ message: string; timestamp: string }> {
    this.logger.log(
      `🎯 Report webhook received: ${payload.webhookEvent || 'unknown'} for task ${payload.issue?.key || 'unknown'}`,
    );

    try {
      const result =
        await this.processReportWebhookService.processWebhook(payload);

      this.logger.log(`✅ Report webhook processed: ${result}`);

      return {
        message: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`❌ Failed to process report webhook:`, error);
      throw error;
    }
  }

  @Get('health')
  @ApiOperation({
    summary: 'Health check for report webhook service',
    description:
      'Check if the report webhook processing service is operational',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
  })
  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    service: string;
    processingTasks: number;
  }> {
    this.logger.log('🏥 Report webhook health check requested');

    const health = await this.processReportWebhookService.healthCheck();

    return {
      ...health,
      timestamp: new Date().toISOString(),
      service: 'AI Reporting Agent - Process Report Webhook',
    };
  }

  @Get('config')
  @ApiOperation({
    summary: 'Get current configuration for report webhook processing',
    description:
      'Display current configuration settings for the report webhook processing service',
  })
  @ApiResponse({
    status: 200,
    description: 'Configuration retrieved successfully',
  })
  async getConfig(): Promise<{
    service: string;
    triggerEvents: string[];
    triggerStatuses: string[];
    assigneeEmail: string;
  }> {
    this.logger.log('⚙️ Report webhook configuration requested');

    return {
      service: 'AI Reporting Agent - Process Report Webhook',
      triggerEvents: ['jira:issue_updated', 'jira:issue_created'],
      triggerStatuses: ['In Progress'],
      assigneeEmail: 'AI-Report-maker (configured in environment)',
    };
  }
}
