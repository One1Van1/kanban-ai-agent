# Create Task

## Что это

Создать новую задачу в системе.

## Зачем нужен

- Автоматическое создание задач
- Из событий создавать задачи
- Разбивать большие задачи на подзадачи
- Интеграции создают задачи

## Поля

### Board ID

На какой доске создать

Можно переменную: `{event.boardId}`, `{user.defaultBoard}`

### Title

Название задачи (обязательно)

Может быть из переменных: `"Новый заказ #{order.id}"`

### Description

Описание задачи

Может быть длинным, с переменными

### Status

Статус задачи

Обычно: `todo`, `in_progress`, `done`

По умолчанию: `todo`

### Priority

Приоритет

- `low` - низкий
- `medium` - средний (по умолчанию)
- `high` - высокий
- `critical` - критический

### Assigned To

Кому назначить (User ID)

Может быть:

- Конкретный ID: `"user123"`
- Из переменной: `{selectedUser.id}`
- `null` - не назначена

### Due Date

Дедлайн (срок выполнения)

Форматы:

- Дата: `"2024-12-31"`
- Относительно: `{now + 7 days}`
- Из переменной: `{task.dueDate}`

### Tags

Теги задачи

Массив строк: `["bug", "urgent", "frontend"]`

### Parent Task ID

ID родительской задачи (для подзадач)

Если указано - создаётся подзадача

### Custom Fields

Дополнительные поля

JSON с кастомными полями:

```json
{
  "client": "Acme Corp",
  "budget": 5000,
  "contactEmail": "client@example.com"
}
```

### Save Created Task to Variable

Сохранить созданную задачу

Пример: `new_task` → `{new_task.id}`, `{new_task.url}`

## Примеры использования

### Из webhook создать задачу

```
Webhook Trigger: Новая заявка с сайта
Create Task:
  Board ID: {env.SUPPORT_BOARD}
  Title: "Заявка от {webhook.name}"
  Description: "Email: {webhook.email}
                Вопрос: {webhook.message}"
  Priority: medium
  Assigned To: null (назначить вручную)
  Tags: ["website", "new-request"]
  Save to: task
→ Send Message: "Создана задача #{task.id}"
```

### AI создаёт подзадачи

```
Task Created: {main_task}
AI Request: "Разбей задачу на подзадачи:
             {main_task.description}"
  → Возвращает массив подзадач
Loop: For Each {subtasks} as subtask
  Create Task:
    Board ID: {main_task.boardId}
    Title: {subtask.title}
    Description: {subtask.description}
    Parent Task ID: {main_task.id}
    Assigned To: {main_task.assignedTo}
```

### Просроченная задача → эскалация

```
Event: task.overdue
Create Task:
  Board ID: {task.boardId}
  Title: "Эскалация: {task.title}"
  Description: "Задача просрочена на {daysOverdue} дней
                Оригинал: {task.url}"
  Priority: high
  Assigned To: {manager.id}
  Tags: ["escalation", "overdue"]
```

### Из email создать задачу

```
Email Trigger: Новое письмо на support@
Create Task:
  Board ID: {SUPPORT_BOARD}
  Title: {email.subject}
  Description: "От: {email.from}
                {email.body}

                Вложения: {email.attachments}"
  Priority: medium
  Tags: ["email", "support"]
  Save to: task
→ Send Email: "Создан тикет #{task.id}"
```

### Регулярная задача

```
Schedule: Каждый понедельник в 9:00
Create Task:
  Board ID: {TEAM_BOARD}
  Title: "Еженедельный планёрка"
  Description: "Обсудить прогресс, блокеры, планы"
  Due Date: {today + 7 days}
  Assigned To: {team_lead.id}
  Tags: ["meeting", "weekly"]
```
