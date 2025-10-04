import { ApiProperty } from '@nestjs/swagger';
import { JiraTask } from '../../../types/jira-task.interface';

export class GetColumnTasksResponseDto {
  @ApiProperty({
    description: 'Задачи из указанной колонки',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        key: { type: 'string', example: 'KAN-5' },
        fields: { type: 'object' },
      },
    },
  })
  tasks: JiraTask[];

  @ApiProperty({
    description: 'Статус колонки',
    example: 'In Progress',
  })
  columnStatus: string;

  @ApiProperty({
    description: 'Общее количество задач',
    example: 15,
  })
  total: number;

  constructor(tasks: JiraTask[], columnStatus: string, total: number) {
    this.tasks = tasks;
    this.columnStatus = columnStatus;
    this.total = total;
  }
}
