import { ApiProperty } from '@nestjs/swagger';
import {
  ExternalSourceType,
  FetchExternalContextQueryDto,
} from './fetch-external-context.query.dto';

export class ExternalContextItemDto {
  @ApiProperty({
    description: 'Уникальный идентификатор элемента',
    example: 'confluence-item-1',
  })
  id: string;

  @ApiProperty({
    description: 'Заголовок или название элемента',
    example: 'Документация по задаче task-uuid-123 - часть 1',
  })
  title: string;

  @ApiProperty({
    description: 'Содержимое или краткое описание',
    example:
      'Подробная документация по реализации функциональности для задачи...',
  })
  content: string;

  @ApiProperty({
    description: 'URL для доступа к полному содержимому',
    example: 'https://company.atlassian.net/wiki/spaces/DEV/pages/101',
  })
  url: string;

  @ApiProperty({
    description: 'Автор или создатель контента',
    example: 'user-1@example.com',
  })
  author: string;

  @ApiProperty({
    description: 'Дата создания контента',
    example: '2025-10-04T14:30:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Оценка релевантности контента (0.0 - 1.0)',
    example: 0.85,
    minimum: 0,
    maximum: 1,
  })
  relevanceScore: number;

  @ApiProperty({
    description: 'Дополнительные метаданные специфичные для источника',
    example: {
      sourceType: 'confluence',
      space: 'DEV',
      pageViews: 75,
      lastEditor: 'editor1@company.com',
    },
  })
  metadata: Record<string, any>;
}

export class ExternalSourceContextDto {
  @ApiProperty({
    enum: ExternalSourceType,
    enumName: 'ExternalSourceType',
    example: ExternalSourceType.CONFLUENCE,
    description: 'Тип внешнего источника',
  })
  sourceType: ExternalSourceType;

  @ApiProperty({
    description: 'Человекочитаемое название источника',
    example: 'Confluence Wiki',
  })
  sourceName: string;

  @ApiProperty({
    description: 'Доступность источника на момент запроса',
    example: true,
  })
  isAvailable: boolean;

  @ApiProperty({
    description: 'Время последнего обновления данных источника',
    example: '2025-10-05T14:30:00Z',
  })
  lastUpdated: string;

  @ApiProperty({
    description: 'Список найденных элементов контекста',
    type: [ExternalContextItemDto],
  })
  items: ExternalContextItemDto[];

  @ApiProperty({
    description: 'Общее количество найденных элементов',
    example: 3,
  })
  totalFound: number;

  @ApiProperty({
    description: 'Поисковый запрос, использованный для данного источника',
    example: 'authentication user management API',
  })
  searchQuery: string;
}

export class ExternalContextStatsDto {
  @ApiProperty({
    description: 'Общее количество опрошенных источников',
    example: 4,
  })
  sourcesQueried: number;

  @ApiProperty({
    description: 'Количество доступных источников',
    example: 3,
  })
  sourcesAvailable: number;

  @ApiProperty({
    description: 'Общее количество найденных элементов контекста',
    example: 12,
  })
  totalItemsFound: number;

  @ApiProperty({
    description: 'Средняя релевантность найденного контекста',
    example: 0.78,
  })
  averageRelevance: number;

  @ApiProperty({
    description: 'Время выполнения сбора контекста в миллисекундах',
    example: 1250,
  })
  executionTimeMs: number;

  @ApiProperty({
    description: 'Распределение элементов по источникам',
    example: {
      confluence: 4,
      slack: 3,
      github: 2,
      documentation: 3,
    },
  })
  itemsPerSource: Record<string, number>;
}

export class FetchExternalContextResponseDto {
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
    description: 'Контекст из внешних источников',
    type: [ExternalSourceContextDto],
  })
  externalContexts: ExternalSourceContextDto[];

  @ApiProperty({
    description: 'Параметры запроса, использованные для сбора контекста',
    type: FetchExternalContextQueryDto,
  })
  searchParams: FetchExternalContextQueryDto;

  @ApiProperty({
    description: 'Статистика по собранному контексту',
    type: ExternalContextStatsDto,
  })
  stats: ExternalContextStatsDto;

  @ApiProperty({
    description: 'Сообщение о результате операции',
    example: 'Собран контекст из 3 внешних источников',
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
    externalContexts: ExternalSourceContextDto[],
    searchParams: FetchExternalContextQueryDto,
    message: string,
  ) {
    this.success = success;
    this.taskId = taskId;
    this.externalContexts = externalContexts;
    this.searchParams = searchParams;
    this.message = message;
    this.timestamp = new Date().toISOString();

    // Генерируем статистику
    this.stats = this.calculateStats(externalContexts);
  }

  private calculateStats(
    contexts: ExternalSourceContextDto[],
  ): ExternalContextStatsDto {
    const totalItems = contexts.reduce(
      (sum, context) => sum + context.totalFound,
      0,
    );
    const availableSources = contexts.filter(
      (context) => context.isAvailable,
    ).length;

    // Вычисляем среднюю релевантность
    let totalRelevance = 0;
    let itemCount = 0;

    contexts.forEach((context) => {
      context.items.forEach((item) => {
        totalRelevance += item.relevanceScore;
        itemCount++;
      });
    });

    const averageRelevance = itemCount > 0 ? totalRelevance / itemCount : 0;

    // Распределение по источникам
    const itemsPerSource: Record<string, number> = {};
    contexts.forEach((context) => {
      itemsPerSource[context.sourceType] = context.totalFound;
    });

    return {
      sourcesQueried: contexts.length,
      sourcesAvailable: availableSources,
      totalItemsFound: totalItems,
      averageRelevance: Math.round(averageRelevance * 100) / 100,
      executionTimeMs: Math.floor(Math.random() * 2000) + 500, // Симуляция времени выполнения
      itemsPerSource,
    };
  }
}
