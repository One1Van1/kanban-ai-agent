import { ApiProperty } from '@nestjs/swagger';

export class GetReportConfigResponseDto {
  @ApiProperty({
    description: 'Service name',
    example: 'AI Reporting Agent - Generate Report',
  })
  service: string;

  @ApiProperty({
    description: 'Supported date formats',
    isArray: true,
    example: [
      'со вчера до сегодня',
      'за прошлую неделю',
      'DD.MM.YYYY - DD.MM.YYYY',
    ],
  })
  supportedDateFormats: string[];

  @ApiProperty({
    description: 'Default date range',
    example: 'last 7 days',
  })
  defaultDateRange: string;

  @ApiProperty({
    description: 'Available report types',
    isArray: true,
    example: ['haircut_statistics', 'quality_analysis', 'performance_trends'],
  })
  reportTypes: string[];

  constructor(
    service: string,
    supportedDateFormats: string[],
    defaultDateRange: string,
    reportTypes: string[],
  ) {
    this.service = service;
    this.supportedDateFormats = supportedDateFormats;
    this.defaultDateRange = defaultDateRange;
    this.reportTypes = reportTypes;
  }
}
