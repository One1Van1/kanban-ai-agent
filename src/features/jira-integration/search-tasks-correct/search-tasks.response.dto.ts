import { ApiProperty } from '@nestjs/swagger';
import { JiraTask } from '../../../types/jira-task.interface';

export class SearchTasksResponseDto {
  @ApiProperty({
    description: 'Найденные задачи',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        key: { type: 'string', example: 'KAN-5' },
        fields: { type: 'object' },
      },
    },
  })
  issues: JiraTask[];

  @ApiProperty({
    description: 'Общее количество задач',
    example: 156,
  })
  total: number;

  @ApiProperty({
    description: 'Начальная позиция',
    example: 0,
  })
  startAt: number;

  @ApiProperty({
    description: 'Количество возвращенных результатов',
    example: 20,
  })
  maxResults: number;

  constructor(
    issues: JiraTask[],
    total: number,
    startAt: number,
    maxResults: number,
  ) {
    this.issues = issues;
    this.total = total;
    this.startAt = startAt;
    this.maxResults = maxResults;
  }
}
