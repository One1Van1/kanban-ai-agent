# Jira Integration

## 🎯 Назначение

Двусторонняя синхронизация с Jira: импорт и экспорт задач.

## ⚙️ Возможности

- ✅ Подключение к Jira (OAuth/API Token)
- ✅ Импорт задач из Jira
- ✅ Экспорт задач в Jira
- ✅ Синхронизация изменений
- ✅ Маппинг полей и статусов
- ✅ Управление проектами

## 🌐 Эндпоинты

### GET

- `get-jira-connection` - Статус подключения
- `get-jira-projects` - Список проектов Jira
- `get-jira-issues` - Задачи из Jira

### POST

- `connect-jira` - Подключиться к Jira
- `import-from-jira` - Импортировать задачи
- `export-to-jira` - Экспортировать задачи
- `sync-with-jira` - Синхронизировать изменения

### DELETE

- `disconnect-jira` - Отключиться от Jira

## 🔌 Интеграции

**Использует:**

- `database-management` - хранение настроек подключения
- `cache-management` - кэширование данных Jira
- `kanban-management` - создание/обновление задач
- `notifications` - уведомления о синхронизации

**Используется в:**

- `board-integrations` - интеграция с другими досками
- `ai-reporting` - аналитика по синхронизации
