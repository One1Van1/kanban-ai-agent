# Kanban Management

## 🎯 Назначение

Управление канбан-досками: задачи, колонки, статусы, комментарии, история.

## ⚙️ Возможности

- ✅ CRUD операции с задачами
- ✅ Перемещение между колонками
- ✅ История изменений
- ✅ Комментарии и вложения
- ✅ Статистика и аналитика
- ✅ Временные метки (timelog)
- ✅ Структура досок

## 🌐 Эндпоинты

### GET

- `get-tasks-by-column` - Задачи в колонке
- `get-task-details` - Детали задачи
- `get-task-history` - История изменений
- `get-task-statistics` - Статистика задач
- `get-board-structure` - Структура доски
- `get-board-summary` - Краткая информация о доске
- `get-available-statuses` - Доступные статусы
- `get-task-comments` - Комментарии к задаче
- `get-task-timelog` - Временные метки задачи
- `get-user-activity` - Активность пользователя
- `get-agent-task-history` - История задач агента
- `download-attachment` - Скачать вложение

### POST

- `create-task` - Создание задачи
- `add-comment` - Добавить комментарий
- `upload-attachment` - Загрузить вложение

### PATCH

- `update-task` - Обновление задачи
- `move-task` - Перемещение между колонками

### DELETE

- `delete-task` - Удаление задачи
- `delete-comment` - Удаление комментария

## 🔌 Интеграции

**Использует:**

- `database-management` - хранение данных
- `cache-management` - кэширование
- `notifications` - уведомления о изменениях
- `queue-management` - асинхронные операции

**Используется в:**

- `ai-agent` - автоматизация задач
- `flow-management` - интеграция с флоу
- `ai-reporting` - аналитика и отчеты
