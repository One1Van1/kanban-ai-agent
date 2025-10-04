import { ApiProperty } from '@nestjs/swagger';
import { JiraTaskTransition } from '../../../types/jira-task.interface';

export class GetTaskTransitionsResponseDto {
  @ApiProperty({
    description: 'Ключ задачи',
    example: 'KAN-5',
  })
  taskKey: string;

  @ApiProperty({
    description: 'Доступные переходы для задачи',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '21' },
        name: { type: 'string', example: 'To Do' },
        to: { type: 'object' },
      },
    },
  })
  transitions: JiraTaskTransition[];

  @ApiProperty({
    description: 'Общее количество переходов',
    example: 3,
  })
  total: number;

  constructor(taskKey: string, transitions: JiraTaskTransition[]) {
    this.taskKey = taskKey;
    this.transitions = transitions;
    this.total = transitions.length;
  }
}
