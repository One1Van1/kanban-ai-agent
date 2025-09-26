import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO для запроса трекинга времени работы
 */
export class TrackWorkTimeDto {
  @ApiProperty({
    description: 'Ключ задачи в Jira',
    example: 'KAN-123',
  })
  @IsNotEmpty()
  @IsString()
  taskKey: string;

  @ApiProperty({
    description: 'Начальная дата для расчета (если нужен кастомный период)',
    example: '2025-09-26T08:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'Конечная дата для расчета (если нужен кастомный период)',
    example: '2025-09-26T09:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

/**
 * DTO для времени в конкретном статусе
 */
export class StatusTimeDto {
  @ApiProperty({
    description: 'Название статуса',
    example: 'In Progress',
  })
  statusName: string;

  @ApiProperty({
    description: 'ID статуса',
    example: '10002',
  })
  statusId: string;

  @ApiProperty({
    description: 'Время входа в статус',
    example: '2025-09-26T08:00:00.000Z',
  })
  enteredAt: string;

  @ApiProperty({
    description: 'Время выхода из статуса (null если текущий)',
    example: '2025-09-26T09:30:00.000Z',
    nullable: true,
  })
  exitedAt: string | null;

  @ApiProperty({
    description: 'Время в статусе (в минутах)',
    example: 90,
  })
  durationMinutes: number;
}

/**
 * DTO для worklog записи
 */
export class WorklogEntryDto {
  @ApiProperty({
    description: 'ID worklog записи',
    example: '12345',
  })
  id: string;

  @ApiProperty({
    description: 'Автор записи',
    example: 'john.doe',
  })
  author: string;

  @ApiProperty({
    description: 'Время начала работы',
    example: '2025-09-26T08:00:00.000Z',
  })
  started: string;

  @ApiProperty({
    description: 'Затраченное время в секундах',
    example: 5400,
  })
  timeSpentSeconds: number;

  @ApiProperty({
    description: 'Затраченное время в минутах',
    example: 90,
  })
  timeSpentMinutes: number;

  @ApiProperty({
    description: 'Комментарий к записи времени',
    example: 'Работал над стрижкой клиента',
    nullable: true,
  })
  comment: string | null;
}

/**
 * DTO анализа эффективности времени
 */
export class TimeEfficiencyDto {
  @ApiProperty({
    description: 'Общее время в работе (минуты)',
    example: 90,
  })
  totalWorkMinutes: number;

  @ApiProperty({
    description: 'Ожидаемое время для задачи',
    example: '60-90 мин',
  })
  expectedRange: string;

  @ApiProperty({
    description: 'Оценка эффективности',
    example: 'good',
    enum: ['excellent', 'good', 'acceptable', 'slow'],
  })
  efficiency: 'excellent' | 'good' | 'acceptable' | 'slow';

  @ApiProperty({
    description: 'Процент от нормы (100% = точно в норме)',
    example: 75,
  })
  efficiencyPercentage: number;

  @ApiProperty({
    description: 'Рекомендации по времени',
    example: ['Хорошая скорость работы', 'Уложился в норматив'],
  })
  recommendations: string[];
}

/**
 * DTO результата трекинга времени
 */
export class TrackWorkTimeResultDto {
  @ApiProperty({
    description: 'Успешность операции',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Ключ задачи',
    example: 'KAN-123',
  })
  taskKey: string;

  @ApiProperty({
    description: 'Общее время работы над задачей в минутах',
    example: 90,
  })
  totalMinutes: number;

  @ApiProperty({
    description: 'Время в каждом статусе',
    type: [StatusTimeDto],
  })
  statusHistory: StatusTimeDto[];

  @ApiProperty({
    description: 'Worklog записи от сотрудников',
    type: [WorklogEntryDto],
  })
  worklogEntries: WorklogEntryDto[];

  @ApiProperty({
    description: 'Анализ эффективности времени',
    type: TimeEfficiencyDto,
  })
  efficiency: TimeEfficiencyDto;

  @ApiProperty({
    description: 'Дата создания задачи',
    example: '2025-09-26T07:30:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Дата последнего обновления',
    example: '2025-09-26T09:30:00.000Z',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Текущий статус задачи',
    example: 'Review',
  })
  currentStatus: string;

  @ApiProperty({
    description: 'Сообщение об ошибке (если есть)',
    required: false,
  })
  @IsOptional()
  @IsString()
  error?: string;
}
