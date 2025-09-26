import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TrackWorkTimeController } from './track-work-time.controller';
import { TrackWorkTimeService } from './track-work-time.service';
import { JiraTimeService } from './jira-time.service';

/**
 * Модуль для трекинга времени работы над задачами
 *
 * Изолированный эндпоинт согласно архитектурным правилам:
 * - Полная изоляция - все сервисы внутри модуля
 * - Собственный Jira сервис (не shared)
 * - Независимые зависимости
 */
@Module({
  imports: [
    ConfigModule, // Для доступа к конфигурации Jira
  ],
  controllers: [TrackWorkTimeController],
  providers: [
    TrackWorkTimeService,
    JiraTimeService, // Локальный сервис - не shared!
  ],
  exports: [
    TrackWorkTimeService, // Экспортируем для возможных интеграций
  ],
})
export class TrackWorkTimeModule {}
