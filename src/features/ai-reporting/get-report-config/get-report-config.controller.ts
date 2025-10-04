import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetReportConfigService } from './get-report-config.service';
import { GetReportConfigResponseDto } from './get-report-config.response.dto';
import { ApiGetReportConfig } from './openapi.decorator';

@ApiTags('GetReportConfig')
@Controller('ai-reporting-agent/generate-report')
export class GetReportConfigController {
  private readonly logger = new Logger(GetReportConfigController.name);

  constructor(private readonly service: GetReportConfigService) {}

  @Get('config')
  @ApiGetReportConfig()
  async handle(): Promise<GetReportConfigResponseDto> {
    this.logger.log('⚙️ Configuration requested');

    try {
      const result = await this.service.execute();
      this.logger.log('✅ Configuration retrieved');
      return result;
    } catch (error) {
      this.logger.error('❌ Failed to get configuration:', error);
      throw error;
    }
  }
}
