# Task Data

## Что это

Получить данные о задачах.

## Зачем нужен

- Поиск задач по критериям
- Получить все задачи доски/пользователя
- Статистика по задачам
- Работа с несколькими задачами

## Поля

### Operation

Что делать

**Get Task by ID** - Конкретная задача

**Get Tasks from Board** - Все задачи доски

**Get Tasks by User** - Задачи пользователя

**Search Tasks** - Поиск по условиям

### Task ID

ID задачи (для Get Task by ID)

### Board ID

ID доски (для Get Tasks from Board)

### User ID

ID пользователя (для Get Tasks by User)

### Filters

Фильтры для поиска (для Search Tasks)

**Примеры:**

- По статусу: `{"status": "in_progress"}`
- По приоритету: `{"priority": "high"}`
- Просроченные: `{"overdue": true}`
- По тегам: `{"tags": ["bug", "urgent"]}`
- По дате: `{"createdAfter": "2024-01-01"}`

### Include

Дополнительные данные

- **Comments** - комментарии
- **Attachments** - файлы
- **History** - история изменений
- **Subtasks** - подзадачи

### Sort

Сортировка результатов

**Примеры:**

- `{"field": "createdAt", "order": "desc"}` - новые сначала
- `{"field": "priority", "order": "asc"}` - по приоритету
- `{"field": "dueDate", "order": "asc"}` - по дедлайну

### Limit

Максимум задач

Пример: `10` - только первые 10

### Save Result to Variable

Имя переменной

Пример: `tasks` → `{tasks.length}`, `{tasks[0].title}`

## Примеры использования

### Найти просроченные задачи

```
Task Data: Search Tasks
  Filters: {"overdue": true}
  Include: Assignee
→ Отправить напоминание каждому ответственному
```

### Отчёт по доске

```
Task Data: Get Tasks from Board {boardId}
  Include: Comments, History
→ Посчитать статистику:
  - Сколько задач выполнено
  - Среднее время выполнения
  - Кто самый активный
→ Создать PDF отчёт
```

### Автоматическое назначение

```
Task Data: Search Tasks
  Filters: {"assignedTo": null, "priority": "high"}
  Sort: {"field": "createdAt", "order": "asc"}
  Limit: 5
→ Для каждой задачи:
  → AI читает описание
  → Назначает подходящего специалиста
```

### Еженедельный дайджест

```
Task Data: Search Tasks
  Filters: {"completedAfter": "7 days ago"}
  Include: Assignee, Comments
→ Создать список выполненных задач
→ Отправить на email руководителю
```

### Очистка старых задач

```
Task Data: Search Tasks
  Filters: {"status": "done", "completedBefore": "6 months ago"}
→ Архивировать каждую задачу
→ Или удалить если неважная
```
