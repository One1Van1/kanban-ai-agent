import { ApiProperty } from '@nestjs/swagger';
import { JiraTask } from '../../../types/jira-task.interface';

export class GetTaskResponseDto implements JiraTask {
  @ApiProperty({
    description: 'Ключ задачи в Jira',
    example: 'KAN-5',
  })
  key: string;

  @ApiProperty({
    description: 'ID задачи',
    example: '10001',
  })
  id: string;

  @ApiProperty({
    description: 'Ссылка на задачу',
    example: 'https://your-domain.atlassian.net/rest/api/2/issue/10001',
  })
  self: string;

  @ApiProperty({
    description: 'Поля задачи',
    example: {
      summary: 'Название задачи',
      description: 'Описание задачи',
      status: { name: 'In Progress' },
      priority: { name: 'High' },
    },
  })
  fields: any;

  constructor(task: JiraTask) {
    this.key = task.key;
    this.id = task.id;
    this.self = task.self;
    this.fields = task.fields;
  }
}
