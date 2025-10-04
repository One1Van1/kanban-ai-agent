import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetReportHealthService } from './get-report-health.service';
import { GetReportHealthResponseDto } from './get-report-health.response.dto';
import { ApiGetReportHealth } from './openapi.decorator';

@ApiTags('GetReportHealth')
@Controller('ai-reporting-agent/generate-report')
export class GetReportHealthController {
  private readonly logger = new Logger(GetReportHealthController.name);

  constructor(private readonly service: GetReportHealthService) {}

  @Get('health')
  @ApiGetReportHealth()
  async handle(): Promise<GetReportHealthResponseDto> {
    this.logger.log('🏥 Health check requested');

    try {
      const result = await this.service.execute();
      this.logger.log('✅ Health check completed');
      return result;
    } catch (error) {
      this.logger.error('❌ Health check failed:', error);
      throw error;
    }
  }
}
