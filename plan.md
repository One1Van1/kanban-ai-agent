# План реализации AI Kanban Agent

## 🎯 Цель проекта

Создать гибко настраиваемого AI агента для автоматизации работы с Kanban досками, который может:

- Отслеживать задачи и реагировать на изменения
- Выполнять настраиваемые инструкции при перемещении карточек между колонками
- Собирать контекст из различных источников
- Отправлять уведомления по разным каналам
- Работать через очереди задач для масштабируемости

---

## 📋 Спринт 1: Основа системы (1-2 недели) - КРИТИЧНО

### 1.1 Bull Queue Integration

**Задача:** Настроить систему очередей для фоновой обработки задач

**Файлы для создания:**

- [x] `yarn add @nestjs/bull bull redis`
- [x] `src/features/queue-management/create-task-queue/`
  - [x] `create-task-queue.controller.ts`
  - [x] `create-task-queue.service.ts`
  - [x] `create-task-queue.dto.ts`
- [x] `src/features/queue-management/process-task-queue/`
  - [x] `process-task-queue.processor.ts`
- [x] `src/features/queue-management/get-queue-status/`
  - [x] `get-queue-status.controller.ts`
  - [x] `get-queue-status.service.ts`
- [x] `src/features/queue-management/get-job-details/`
  - [x] `get-job-details.controller.ts`
  - [x] `get-job-details.service.ts`
- [x] `src/modules/queue-management.module.ts`
- [x] `src/config/queue.config.ts`

**Результат:** Система может ставить задачи в очередь и обрабатывать их фоново

### 1.2 AI Agent Core

**Задача:** Создать основу для управления AI агентами

**Файлы для создания:**

- [x] `src/features/ai-agent/create-agent/`
  - [x] `create-agent.controller.ts`
  - [x] `create-agent.service.ts`
  - [x] `create-agent.request.dto.ts`
  - [x] `create-agent.response.dto.ts`
  - [x] `create-agent.spec.ts`
  - [x] `openapi.decorator.ts`
- [x] `src/features/ai-agent/configure-agent/`
  - [x] `configure-agent.controller.ts`
  - [x] `configure-agent.service.ts`
  - [x] `configure-agent.request.dto.ts`
  - [x] `configure-agent.response.dto.ts`
  - [x] `configure-agent.spec.ts`
  - [x] `openapi.decorator.ts`
- [x] `src/features/ai-agent/track-agent-in-task/`
  - [x] `track-agent-in-task.controller.ts`
  - [x] `track-agent-in-task.service.ts`
  - [x] `track-agent-in-task.request.dto.ts`
  - [x] `track-agent-in-task.response.dto.ts`
  - [x] `track-agent-in-task.spec.ts`
  - [x] `track-agent-in-task.openapi.decorator.ts`
- [x] `src/features/ai-agent/ai-agent.module.ts`
- [x] `src/config/ai-agent.config.ts`
- [x] `src/types/ai-agent.interface.ts`

**Результат:** Можно создавать и настраивать AI агентов ✅ ЗАВЕРШЕНО

### 1.3 Basic Notifications

**Задача:** Базовые уведомления (Email + Telegram)

**Файлы для создания:**

- [x] `yarn add nodemailer telegraf @types/nodemailer`
- [x] `src/features/notifications/send-email/`
  - [x] `send-email.controller.ts`
  - [x] `send-email.service.ts`
  - [x] `send-email.request.dto.ts`
  - [x] `send-email.response.dto.ts`
  - [x] `send-email.spec.ts`
  - [x] `openapi.decorator.ts`
- [x] `src/features/notifications/send-telegram/`
  - [x] `send-telegram.controller.ts`
  - [x] `send-telegram.service.ts`
  - [x] `send-telegram.request.dto.ts`
  - [x] `send-telegram.response.dto.ts`
  - [x] `send-telegram.spec.ts`
  - [x] `openapi.decorator.ts`
- [x] `src/modules/notifications.module.ts`
- [x] `src/config/notifications.config.ts`

**Результат:** Система может отправлять уведомления по email и в Telegram ✅ ЗАВЕРШЕНО

---

## 📋 Спринт 2: Умная обработка (1 неделя) - ВАЖНО

### 2.1 Context Management System

**Задача:** Система выбора и сбора контекста для AI агента

**Файлы для создания:**

- [x] `src/features/context-management/configure-context-sources/`
  - [x] `configure-context-sources.controller.ts`
  - [x] `configure-context-sources.service.ts`
  - [x] `configure-context-sources.request.dto.ts`
  - [x] `configure-context-sources.response.dto.ts`
  - [x] `configure-context-sources.spec.ts`
  - [x] `openapi.decorator.ts`
- [ ] `src/features/context-management/fetch-task-context/`
  - [ ] `fetch-task-context.service.ts`
  - [ ] `fetch-task-context.dto.ts`
- [ ] `src/features/context-management/fetch-related-tasks/`
  - [ ] `fetch-related-tasks.service.ts`
  - [ ] `fetch-related-tasks.dto.ts`
- [ ] `src/features/context-management/fetch-external-context/`
  - [ ] `fetch-external-context.service.ts`
  - [ ] `fetch-external-context.dto.ts`
- [x] `src/modules/context-management.module.ts`
- [x] `src/types/context.interface.ts`

**Результат:** AI агент может собирать контекст из разных источников

### 2.2 Agent Instructions System

**Задача:** Система настройки инструкций для агента по колонкам

**Файлы для создания:**

- [x] `src/features/ai-agent/configure-column-instructions/`
  - [x] `configure-column-instructions.controller.ts`
  - [x] `configure-column-instructions.service.ts`
  - [x] `configure-column-instructions.request.dto.ts`
  - [x] `configure-column-instructions.response.dto.ts`
  - [x] `configure-column-instructions.spec.ts`
  - [x] `openapi.decorator.ts`
- [x] `src/features/ai-agent/execute-agent-action/`
  - [x] `execute-agent-action.controller.ts`
  - [x] `execute-agent-action.service.ts`
  - [x] `execute-agent-action.request.dto.ts`
  - [x] `execute-agent-action.response.dto.ts`
  - [x] `execute-agent-action.spec.ts`
  - [x] `openapi.decorator.ts`
- [x] `src/features/ai-agent/get-agent-activity/`
  - [x] `get-agent-activity.controller.ts`
  - [x] `get-agent-activity.service.ts`
  - [x] `get-agent-activity.request.dto.ts`
  - [x] `get-agent-activity.response.dto.ts`
  - [x] `get-agent-activity.spec.ts`
  - [x] `openapi.decorator.ts`

**Результат:** Агент выполняет настроенные инструкции при перемещении карточек ✅ ЗАВЕРШЕНО

### 2.3 Enhanced Testing

**Задача:** Качественные интеграционные тесты

**Файлы для создания:**

- [ ] `test/integration/ai-agent.e2e-spec.ts`
- [ ] `test/integration/queue-management.e2e-spec.ts`
- [ ] `test/integration/notifications.e2e-spec.ts`
- [ ] `test/integration/context-management.e2e-spec.ts`
- [ ] `test/helpers/test-data-factory.ts`
- [ ] `test/helpers/mock-services.ts`

**Результат:** 100% покрытие тестами с реальными сценариями

---

## 📋 Спринт 3: Персистентность и оптимизация (1-2 недели) - СРЕДНЕ

### 3.1 Database Integration

**Задача:** Хранение конфигураций агентов и истории

**Файлы для создания:**

- [ ] `yarn add @nestjs/typeorm typeorm pg @types/pg`
- [ ] `src/entities/agent.entity.ts`
- [ ] `src/entities/agent-instruction.entity.ts`
- [ ] `src/entities/task-history.entity.ts`
- [ ] `src/entities/notification-log.entity.ts`
- [ ] `src/features/database-management/store-agent-config/`
  - [ ] `store-agent-config.service.ts`
  - [ ] `store-agent-config.repository.ts`
- [ ] `src/features/database-management/store-task-history/`
  - [ ] `store-task-history.service.ts`
  - [ ] `store-task-history.repository.ts`
- [ ] `src/config/database.config.ts`

**Результат:** Все данные агентов сохраняются в БД

### 3.2 Performance Optimization

**Задача:** Кэширование и оптимизация производительности

**Файлы для создания:**

- [ ] `yarn add @nestjs/cache-manager cache-manager-redis-store`
- [ ] `src/features/cache-management/cache-context/`
  - [ ] `cache-context.service.ts`
- [ ] `src/features/cache-management/cache-agent-configs/`
  - [ ] `cache-agent-configs.service.ts`
- [ ] `src/config/cache.config.ts`

**Результат:** Система работает быстро даже с большим количеством агентов

### 3.3 Admin Panel API

**Задача:** API для будущего frontend конструктора

**Файлы для создания:**

- [ ] `src/features/admin-panel/get-dashboard-stats/`
  - [ ] `get-dashboard-stats.controller.ts`
  - [ ] `get-dashboard-stats.service.ts`
- [ ] `src/features/admin-panel/manage-agents-ui/`
  - [ ] `manage-agents-ui.controller.ts`
  - [ ] `manage-agents-ui.service.ts`
- [ ] `src/features/admin-panel/export-agent-config/`
  - [ ] `export-agent-config.controller.ts`
  - [ ] `export-agent-config.service.ts`

**Результат:** Готовый API для frontend конструктора

---

## 🔧 Технические требования

### Архитектурные принципы:

- [ ] Каждый эндпоинт в отдельной папке
- [ ] Использование только Yarn (никогда npm)
- [ ] 100% покрытие тестами
- [ ] Bull Queue для всех фоновых задач
- [ ] Абстракция от конкретной task management системы (не только Jira)

### Зависимости для добавления:

```bash
# Queue system
yarn add @nestjs/bull bull redis

# Notifications
yarn add nodemailer telegraf @types/nodemailer

# Database
yarn add @nestjs/typeorm typeorm pg @types/pg

# Caching
yarn add @nestjs/cache-manager cache-manager-redis-store

# Utilities
yarn add uuid @types/uuid
yarn add lodash @types/lodash
```

### Конфигурационные файлы:

- [ ] `src/config/queue.config.ts`
- [ ] `src/config/database.config.ts`
- [ ] `src/config/cache.config.ts`
- [ ] `src/config/notifications.config.ts`

---

## 🎯 Ключевые метрики успеха

### После Спринта 1:

- [ ] AI агент может быть создан и настроен
- [ ] Задачи обрабатываются через очереди
- [ ] Базовые уведомления работают

### После Спринта 2:

- [ ] Агент выполняет инструкции при перемещении карточек
- [ ] Система собирает контекст из разных источников
- [ ] 100% покрытие тестами

### После Спринта 3:

- [ ] Все данные сохраняются в БД
- [ ] Система оптимизирована для production
- [ ] Готов API для frontend конструктора

---

## 🚀 Следующие этапы (после основной реализации)

### Frontend Constructor:

- [ ] Создать отдельный Next.js проект для конструктора агентов
- [ ] Drag & Drop интерфейс для настройки правил
- [ ] Визуализация workflow агентов

### Advanced Features:

- [ ] ML модели для предиктивной аналитики
- [ ] Интеграция с другими task management системами
- [ ] Plugin система для расширения функциональности

---

## 📞 Критерии готовности

Система считается готовой когда:

1. ✅ Можно создать AI агента через API
2. ✅ Можно настроить инструкции для колонок
3. ✅ Агент отслеживает добавление в задачи
4. ✅ Агент выполняет действия при изменении статуса
5. ✅ Агент собирает контекст из настроенных источников
6. ✅ Система отправляет уведомления на email и в Telegram
7. ✅ Все работает через Bull Queue
8. ✅ 100% покрытие качественными тестами
9. ✅ Система готова к замене Jira на другую платформу
