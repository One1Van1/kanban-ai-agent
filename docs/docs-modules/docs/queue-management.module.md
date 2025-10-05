# queue-management.module.ts

## Описание

Модуль управления очередями задач. Обеспечивает фоновую обработку задач через Bull Queue с использованием Redis.

## Контроллеры

- **CreateTaskQueueController** - создание задач в очереди
- **GetQueueStatusController** - получение статуса очередей
- **GetJobDetailsController** - получение деталей конкретной задачи

## Сервисы

- **CreateTaskQueueService** - логика добавления задач в очередь
- **GetQueueStatusService** - логика получения статуса очередей
- **GetJobDetailsService** - логика получения информации о задачах

## Процессоры

- **ProcessTaskQueueProcessor** - обработчик задач из очереди

## Конфигурация

Использует `queue.config.ts` для настройки Redis подключения и параметров очередей.

## Зависимости

- **@nestjs/bull** - интеграция Bull Queue с NestJS
- **bull** - система очередей задач
- **redis** - база данных для хранения очередей

## API Endpoints

- `POST /queue/tasks` - добавить задачу в очередь
- `GET /queue/status` - получить статус очередей
- `GET /queue/jobs/:jobId` - получить детали задачи
