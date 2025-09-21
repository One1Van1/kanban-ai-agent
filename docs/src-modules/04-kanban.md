# 🏢 Kanban Module

## 📍 Расположение: `src/kanban/`

## 🎯 Назначение

Модуль **Kanban** отвечает за интеграцию с Jira и управление статусами задач на Kanban-доске. Позволяет автоматически переводить задачи между колонками, добавлять комментарии и проверять доступность Jira.

## 📁 Структура

```
src/kanban/
├── kanban.module.ts   # NestJS модуль
├── kanban.service.ts  # Основной сервис для работы с Jira
└── index.ts           # Экспорт модуля
```

## 🔧 Основные компоненты

### 🟦 `KanbanModule`

**Файл:** `kanban.module.ts`

- Импортирует `HttpModule` и `ConfigModule` для работы с внешними API и конфигами
- Регистрирует и экспортирует `KanbanService`

### 🟢 `KanbanService`

**Файл:** `kanban.service.ts`

- Основной сервис для работы с Jira API
- Позволяет:
  - Обновлять статус задачи (`updateTaskStatus`)
  - Получать доступные переходы статусов (`getAvailableTransitions`)
  - Добавлять комментарии к задачам
  - Проверять подключение к Jira (`testConnection`)

#### Пример: Обновление статуса задачи

```typescript
await kanbanService.updateTaskStatus({
  taskKey: 'KAN-123',
  newStatus: TaskStatus.IN_PROGRESS,
  comment: 'AI агент начал выполнение задачи',
});
```

#### Пример: Проверка подключения к Jira

```typescript
const isConnected = await kanbanService.testConnection();
if (isConnected) {
  console.log('Jira доступна!');
}
```

## 🔗 Связи с другими модулями

- Используется в WebhookService для автоматического управления задачами
- Получает конфигурацию из `ConfigModule`
- Работает с HTTP через `HttpModule`

## 🛠 Важные интерфейсы

- `TaskUpdateRequest` — структура запроса на обновление статуса
- `JiraTransition` — описание перехода статусов в Jira

## 🚀 Особенности

- Поддержка разных статусов (NEW, IN_PROGRESS, REVIEW, DONE, QUESTIONS)
- Гибкий маппинг статусов между системой и Jira
- Логирование всех операций

## 📚 Экспорт

- Все публичные классы и сервисы экспортируются через `index.ts`

---

**Модуль Kanban — это мост между вашим AI агентом и Jira, позволяющий автоматически управлять жизненным циклом задач!**
