import { Injectable, Logger } from '@nestjs/common';
import { GetReportHealthResponseDto } from './get-report-health.response.dto';

@Injectable()
export class GetReportHealthService {
  private readonly logger = new Logger(GetReportHealthService.name);

  async execute(): Promise<GetReportHealthResponseDto> {
    this.logger.log('🏥 Health check requested');

    return new GetReportHealthResponseDto(
      'healthy',
      new Date().toISOString(),
      'AI Reporting Agent - Generate Report',
    );
  }
}
