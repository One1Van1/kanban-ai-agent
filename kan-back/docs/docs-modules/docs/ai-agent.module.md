# ai-agent.module.ts

## Описание

Модуль управления AI агентами в системе Kanban. Обеспечивает создание, настройку и отслеживание работы AI агентов.

## Контроллеры

- **CreateAgentController** - создание новых AI агентов
- **ConfigureAgentController** - настройка параметров агентов
- **TrackAgentInTaskController** - привязка агентов к задачам

## Сервисы

- **CreateAgentService** - логика создания агентов
- **ConfigureAgentService** - логика настройки агентов
- **TrackAgentInTaskService** - логика отслеживания агентов

## Конфигурация

Использует `ai-agent.config.ts` для настройки параметров работы агентов.

## API Endpoints

- `POST /ai-agent` - создать агента
- `PUT /ai-agent/:agentId/configure` - настроить агента
- `POST /ai-agent/track-agent-in-task/:agentId` - привязать к задаче
