# Анализ недостающих функций для AI Агента

## Бизнес-логика

Согласно требованиям из сообщения, AI агент должен быть гибко настраиваемым, понимать контекст задач и автоматически выполнять действия.

## Статус: ❌ НЕ РЕАЛИЗОВАНО

### ❌ Основной блок AI Agent

**Требуется создать:** `src/features/ai-agent/`

**Недостающие эндпоинты:**

#### 1. Создание AI агента

**Endpoint:** `POST /ai-agent/create`
**Файлы для создания:**

- `src/features/ai-agent/create-agent/create-agent.controller.ts`
- `src/features/ai-agent/create-agent/create-agent.service.ts`
- `src/features/ai-agent/create-agent/create-agent.request.dto.ts`
- `src/features/ai-agent/create-agent/create-agent.response.dto.ts`

**Бизнес-логика:** Создание настраиваемого AI агента с определенными правилами и инструкциями.

#### 2. Настройка агента

**Endpoint:** `PUT /ai-agent/{id}/configure`
**Файлы для создания:**

- `src/features/ai-agent/configure-agent/configure-agent.controller.ts`
- `src/features/ai-agent/configure-agent/configure-agent.service.ts`
- `src/features/ai-agent/configure-agent/configure-agent.request.dto.ts`
- `src/features/ai-agent/configure-agent/configure-agent.response.dto.ts`

**Бизнес-логика:**

- Установка инструкций для выполнения при попадании карточки в колонку
- Настройка критериев выбора контекста (из карточки, других карточек, внешних источников, БД)
- Конфигурация правил уведомлений

#### 3. Получение статуса агента

**Endpoint:** `GET /ai-agent/{id}/status`
**Файлы для создания:**

- `src/features/ai-agent/get-agent-status/get-agent-status.controller.ts`
- `src/features/ai-agent/get-agent-status/get-agent-status.service.ts`
- `src/features/ai-agent/get-agent-status/get-agent-status.response.dto.ts`

**Бизнес-логика:** Мониторинг активности агента и отслеживание выполняемых задач.

#### 4. Запуск действия агента

**Endpoint:** `POST /ai-agent/{id}/trigger`
**Файлы для создания:**

- `src/features/ai-agent/trigger-agent-action/trigger-agent-action.controller.ts`
- `src/features/ai-agent/trigger-agent-action/trigger-agent-action.service.ts`
- `src/features/ai-agent/trigger-agent-action/trigger-agent-action.request.dto.ts`
- `src/features/ai-agent/trigger-agent-action/trigger-agent-action.response.dto.ts`

**Бизнес-логика:** Ручной запуск действий агента для тестирования или экстренного выполнения.

### ❌ Блок уведомлений

**Требуется создать:** `src/features/notifications/`

**Недостающие эндпоинты:**

#### 1. Отправка уведомлений

**Endpoint:** `POST /notifications/send`
**Файлы для создания:**

- `src/features/notifications/send-notification/send-notification.controller.ts`
- `src/features/notifications/send-notification/send-notification.service.ts`
- `src/features/notifications/send-notification/send-notification.request.dto.ts`
- `src/features/notifications/send-notification/send-notification.response.dto.ts`

#### 2. Настройка уведомлений

**Endpoint:** `PUT /notifications/configure`
**Файлы для создания:**

- `src/features/notifications/configure-notifications/configure-notifications.controller.ts`
- `src/features/notifications/configure-notifications/configure-notifications.service.ts`

### ❌ Блок аналитики задач

**Требуется создать:** `src/features/task-analytics/`

**Недостающие эндпоинты:**

#### 1. Анализ производительности

**Endpoint:** `GET /task-analytics/performance`
**Файлы для создания:**

- `src/features/task-analytics/get-performance-metrics/get-performance-metrics.controller.ts`
- `src/features/task-analytics/get-performance-metrics/get-performance-metrics.service.ts`

#### 2. Прогнозирование

**Endpoint:** `POST /task-analytics/predict`
**Файлы для создания:**

- `src/features/task-analytics/predict-task-completion/predict-task-completion.controller.ts`
- `src/features/task-analytics/predict-task-completion/predict-task-completion.service.ts`

### ❌ Блок управления пользователями

**Требуется создать:** `src/features/user-management/`

**Недостающие эндпоинты:**

#### 1. Управление пользователями

**Endpoint:** `POST /users/create`
**Файлы для создания:**

- `src/features/user-management/create-user/create-user.controller.ts`
- `src/features/user-management/create-user/create-user.service.ts`

#### 2. Права доступа

**Endpoint:** `PUT /users/{id}/permissions`
**Файлы для создания:**

- `src/features/user-management/manage-permissions/manage-permissions.controller.ts`
- `src/features/user-management/manage-permissions/manage-permissions.service.ts`

### ❌ Workflow Configurator (расширенный)

**Возможно требуется расширение:** `src/features/workflow-management/`

**Текущий файл:** `/Users/one.van/Desktop/kanban_ai_agent/src/shared/jira/workflow-configurator.service.ts`

**Требует создания отдельного блока с эндпоинтами:**

#### 1. Создание workflow

**Endpoint:** `POST /workflow/create`

#### 2. Настройка правил

**Endpoint:** `PUT /workflow/{id}/rules`

## Недостающие модули

**Требуется создать:**

- `src/modules/ai-agent.module.ts`
- `src/modules/notifications.module.ts`
- `src/modules/task-analytics.module.ts`
- `src/modules/user-management.module.ts`
- `src/modules/workflow-management.module.ts`

## Недостающие конфигурации

**Требуется создать:**

- `src/config/ai-agent.config.ts`
- `src/config/notifications.config.ts`
- `src/config/analytics.config.ts`

## Недостающие типы и интерфейсы

**Требуется создать:**

- `src/types/ai-agent.interface.ts`
- `src/types/notification.interface.ts`
- `src/types/user.interface.ts`
- `src/types/workflow.interface.ts`

## Приоритет реализации

1. **Высокий приоритет:** `ai-agent` блок (основная функциональность)
2. **Средний приоритет:** `notifications` блок (для отправки уведомлений)
3. **Низкий приоритет:** `task-analytics`, `user-management` (дополнительные функции)
