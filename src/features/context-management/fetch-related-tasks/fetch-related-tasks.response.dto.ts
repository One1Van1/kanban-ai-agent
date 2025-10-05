import { ApiProperty } from '@nestjs/swagger';
import {
  RelationshipType,
  FetchRelatedTasksQueryDto,
} from './fetch-related-tasks.query.dto';

export class RelatedTaskDto {
  @ApiProperty({
    description: 'Уникальный идентификатор связанной задачи',
    example: 'related-task-1',
  })
  id: string;

  @ApiProperty({
    description: 'Ключ задачи в системе управления проектами',
    example: 'TASK-1001',
  })
  key: string;

  @ApiProperty({
    description: 'Название связанной задачи',
    example: 'Связанная задача 1 для task-uuid-123',
  })
  title: string;

  @ApiProperty({
    description: 'Текущий статус задачи',
    example: 'In Progress',
  })
  status: string;

  @ApiProperty({
    description: 'Приоритет задачи',
    example: 'High',
  })
  priority: string;

  @ApiProperty({
    description: 'Исполнитель задачи',
    example: 'user-1@example.com',
  })
  assignee: string;

  @ApiProperty({
    enum: RelationshipType,
    enumName: 'RelationshipType',
    example: RelationshipType.RELATED_TO,
    description: 'Тип связи с основной задачей',
  })
  relationshipType: RelationshipType;

  @ApiProperty({
    description: 'Дата создания задачи',
    example: '2025-10-01T14:30:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Дата последнего обновления задачи',
    example: '2025-10-05T14:30:00Z',
  })
  updatedAt: string;
}

export class RelatedTasksStatsDto {
  @ApiProperty({
    description: 'Общее количество найденных связанных задач',
    example: 7,
  })
  totalFound: number;

  @ApiProperty({
    description: 'Количество возвращенных задач (с учетом лимита)',
    example: 5,
  })
  returned: number;

  @ApiProperty({
    description: 'Распределение по типам связей',
    example: {
      related_to: 3,
      blocks: 1,
      subtask: 1,
      parent: 1,
    },
  })
  relationshipTypeDistribution: Record<string, number>;
}

export class FetchRelatedTasksResponseDto {
  @ApiProperty({
    description: 'Статус успешности операции',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Идентификатор основной задачи',
    example: 'task-uuid-123',
  })
  taskId: string;

  @ApiProperty({
    description: 'Список связанных задач',
    type: [RelatedTaskDto],
  })
  relatedTasks: RelatedTaskDto[];

  @ApiProperty({
    description: 'Параметры запроса, использованные для поиска',
    type: FetchRelatedTasksQueryDto,
  })
  searchParams: FetchRelatedTasksQueryDto;

  @ApiProperty({
    description: 'Статистика по найденным связанным задачам',
    type: RelatedTasksStatsDto,
  })
  stats: RelatedTasksStatsDto;

  @ApiProperty({
    description: 'Сообщение о результате операции',
    example: 'Найдено 7 связанных задач',
  })
  message: string;

  @ApiProperty({
    description: 'Время выполнения запроса',
    example: '2025-10-05T14:30:00Z',
  })
  timestamp: string;

  constructor(
    success: boolean,
    taskId: string,
    relatedTasks: RelatedTaskDto[],
    searchParams: FetchRelatedTasksQueryDto,
    message: string,
  ) {
    this.success = success;
    this.taskId = taskId;
    this.relatedTasks = relatedTasks;
    this.searchParams = searchParams;
    this.message = message;
    this.timestamp = new Date().toISOString();

    // Генерируем статистику
    this.stats = {
      totalFound: relatedTasks.length,
      returned: relatedTasks.length,
      relationshipTypeDistribution: this.calculateDistribution(relatedTasks),
    };
  }

  private calculateDistribution(
    tasks: RelatedTaskDto[],
  ): Record<string, number> {
    const distribution: Record<string, number> = {};

    tasks.forEach((task) => {
      const type = task.relationshipType;
      distribution[type] = (distribution[type] || 0) + 1;
    });

    return distribution;
  }
}
