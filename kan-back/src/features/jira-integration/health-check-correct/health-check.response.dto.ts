import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckResponseDto {
  @ApiProperty({
    description: 'Статус соединения с Jira',
    example: 'ok',
  })
  status: string;

  @ApiProperty({
    description: 'URL Jira сервера',
    example: 'https://company.atlassian.net',
  })
  jiraUrl: string;

  @ApiProperty({
    description: 'Ключ проекта',
    example: 'KAN',
  })
  projectKey: string;

  @ApiProperty({
    description: 'Время проверки',
    example: '2024-01-20T12:00:00Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Дополнительная информация',
    required: false,
  })
  details?: any;

  constructor(
    status: string,
    jiraUrl: string,
    projectKey: string,
    details?: any,
  ) {
    this.status = status;
    this.jiraUrl = jiraUrl;
    this.projectKey = projectKey;
    this.timestamp = new Date().toISOString();
    this.details = details;
  }
}
