# Update Task

## Что это

Обновить существующую задачу.

## Зачем нужен

- Изменить статус, приоритет, описание
- Назначить ответственного
- Добавить комментарий
- Обновить поля задачи

## Поля

### Task ID

ID задачи для обновления

Обычно из переменной: `{task.id}`, `{event.taskId}`

### Fields to Update

Какие поля обновить

Можно обновить несколько полей одновременно

### Title

Новое название (опционально)

### Description

Новое описание (опционально)

Можно:

- **Replace** - заменить полностью
- **Append** - добавить к существующему

### Status

Новый статус

`todo`, `in_progress`, `done`, etc.

### Priority

Новый приоритет

`low`, `medium`, `high`, `critical`

### Assigned To

Новый ответственный (User ID)

- ID пользователя
- `null` - снять назначение
- `{user.id}` - из переменной

### Due Date

Новый дедлайн

### Tags

Обновить теги

- **Replace** - заменить все теги
- **Add** - добавить к существующим
- **Remove** - удалить определённые

### Add Comment

Добавить комментарий к задаче

Текст комментария, может быть с переменными

### Custom Fields

Обновить кастомные поля

## Примеры использования

### Изменить статус

```
Event: Задача выполнена разработчиком
Update Task: {task.id}
  Status: "ready_for_review"
  Add Comment: "Готово к ревью @{reviewer.username}"
→ Send Message: Уведомить ревьюера
```

### Автоназначение по AI

```
Event: task.created без ответственного
AI Request: "Кто лучше подходит для задачи?
             {task.description}"
  → Возвращает best_user
Update Task: {task.id}
  Assigned To: {best_user.id}
  Add Comment: "Автоматически назначено AI"
→ Send Message: Уведомить {best_user}
```

### Повысить приоритет просроченных

```
Schedule: Каждый день в 9:00
Task Data: Search просроченные задачи
Loop: For Each {tasks} as task
  Update Task: {task.id}
    Priority: "high"
    Tags: Add ["overdue"]
    Add Comment: "Задача просрочена на {daysOverdue} дней"
```

### Обновить из комментария

```
Event: task.commented с командой
  Пример: "@bot set priority high"
Parse команду из {comment.text}
Update Task: {task.id}
  Priority: {parsed_priority}
  Add Comment: "Приоритет изменён на {parsed_priority}"
```

### Продлить дедлайн

```
Event: task.comment contains "нужно больше времени"
Update Task: {task.id}
  Due Date: {task.dueDate + 3 days}
  Add Comment: "Дедлайн продлён на 3 дня"
→ Send Message: Уведомить менеджера
```

### Синхронизация с Jira

```
Event: task.updated
Delay: 5 секунд (debounce)
Update Task: {task.id}
  Custom Fields: {
    "jira_sync_status": "syncing"
  }
→ API Call: Обновить в Jira
→ Update Task: {task.id}
    Custom Fields: {
      "jira_sync_status": "synced",
      "jira_updated_at": {now}
    }
```
