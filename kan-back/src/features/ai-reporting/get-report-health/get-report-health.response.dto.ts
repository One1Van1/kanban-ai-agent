import { ApiProperty } from '@nestjs/swagger';

export class GetReportHealthResponseDto {
  @ApiProperty({
    description: 'Service health status',
    example: 'healthy',
  })
  status: string;

  @ApiProperty({
    description: 'Current timestamp',
    example: '2025-10-04T10:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Service name',
    example: 'AI Reporting Agent - Generate Report',
  })
  service: string;

  constructor(status: string, timestamp: string, service: string) {
    this.status = status;
    this.timestamp = timestamp;
    this.service = service;
  }
}
