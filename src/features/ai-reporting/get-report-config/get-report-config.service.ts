import { Injectable, Logger } from '@nestjs/common';
import { GetReportConfigResponseDto } from './get-report-config.response.dto';

@Injectable()
export class GetReportConfigService {
  private readonly logger = new Logger(GetReportConfigService.name);

  async execute(): Promise<GetReportConfigResponseDto> {
    this.logger.log('⚙️ Configuration requested');

    return new GetReportConfigResponseDto(
      'AI Reporting Agent - Generate Report',
      [
        'со вчера до сегодня',
        'за прошлую неделю',
        'DD.MM.YYYY - DD.MM.YYYY',
        'с DD/MM/YYYY по DD/MM/YYYY',
      ],
      'last 7 days',
      [
        'haircut_statistics',
        'quality_analysis',
        'performance_trends',
        'recommendations',
      ],
    );
  }
}
