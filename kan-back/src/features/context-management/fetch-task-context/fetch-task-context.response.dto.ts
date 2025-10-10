import { ApiProperty } from '@nestjs/swagger';

export class TaskCommentDto {
  @ApiProperty({
    description: 'Уникальный идентификатор комментария',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'Автор комментария',
    example: 'AI Agent',
  })
  author: string;

  @ApiProperty({
    description: 'Содержимое комментария',
    example: 'Автоматический анализ задачи',
  })
  content: string;

  @ApiProperty({
    description: 'Дата создания комментария',
    example: '2025-10-05T14:30:00Z',
  })
  createdAt: string;
}

export class TaskAttachmentDto {
  @ApiProperty({
    description: 'Уникальный идентификатор вложения',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'Имя файла',
    example: 'requirements.pdf',
  })
  fileName: string;

  @ApiProperty({
    description: 'Размер файла в байтах',
    example: 1024,
  })
  fileSize: number;

  @ApiProperty({
    description: 'Дата загрузки файла',
    example: '2025-10-05T14:30:00Z',
  })
  uploadedAt: string;
}

export class TaskWorklogDto {
  @ApiProperty({
    description: 'Уникальный идентификатор записи времени',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'Автор записи времени',
    example: 'Developer',
  })
  author: string;

  @ApiProperty({
    description: 'Потраченное время',
    example: '2h',
  })
  timeSpent: string;

  @ApiProperty({
    description: 'Описание работы',
    example: 'Анализ требований',
  })
  description: string;

  @ApiProperty({
    description: 'Дата записи времени',
    example: '2025-10-05T14:30:00Z',
  })
  loggedAt: string;
}

export class TaskCustomFieldsDto {
  @ApiProperty({
    description: 'Приоритет задачи',
    example: 'High',
  })
  priority: string;

  @ApiProperty({
    description: 'Оценочное время в часах',
    example: 8,
  })
  estimatedHours: number;

  @ApiProperty({
    description: 'Компонент системы',
    example: 'Frontend',
  })
  component: string;
}

export class TaskContextDataDto {
  @ApiProperty({
    description: 'Идентификатор задачи',
    example: 'task-uuid-123',
  })
  taskId: string;

  @ApiProperty({
    description: 'Описание задачи',
    example: 'Контекст для задачи task-uuid-123',
  })
  description: string;

  @ApiProperty({
    description: 'Комментарии к задаче',
    type: [TaskCommentDto],
  })
  comments: TaskCommentDto[];

  @ApiProperty({
    description: 'Вложения задачи',
    type: [TaskAttachmentDto],
  })
  attachments: TaskAttachmentDto[];

  @ApiProperty({
    description: 'Записи времени по задаче',
    type: [TaskWorklogDto],
  })
  worklog: TaskWorklogDto[];

  @ApiProperty({
    description: 'Дополнительные поля задачи',
    type: TaskCustomFieldsDto,
  })
  customFields: TaskCustomFieldsDto;
}

export class FetchTaskContextResponseDto {
  @ApiProperty({
    description: 'Статус успешности операции',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Идентификатор задачи',
    example: 'task-uuid-123',
  })
  taskId: string;

  @ApiProperty({
    description: 'Данные контекста задачи',
    type: TaskContextDataDto,
  })
  contextData: TaskContextDataDto;

  @ApiProperty({
    description: 'Сообщение о результате операции',
    example: 'Контекст задачи успешно получен',
  })
  message: string;

  @ApiProperty({
    description: 'Время получения контекста',
    example: '2025-10-05T14:30:00Z',
  })
  timestamp: string;

  constructor(
    success: boolean,
    taskId: string,
    contextData: TaskContextDataDto,
    message: string,
  ) {
    this.success = success;
    this.taskId = taskId;
    this.contextData = contextData;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }
}
