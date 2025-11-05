# Send Message

## Что это

Отправить сообщение (Email, Slack, SMS, Push уведомление и др.).

## Зачем нужен

- Уведомления пользователям
- Отправка отчётов
- Алерты и оповещения
- Коммуникация

## Поля

### Channel

Канал для отправки

**Email** - электронная почта
**Slack** - Slack сообщение
**Telegram** - Telegram бот
**SMS** - СМС сообщение
**Push** - Push уведомление (браузер/мобильное)
**Webhook** - отправить на webhook URL
**In-App** - уведомление в приложении

### Recipient

Кому отправить

В зависимости от канала:

- **Email:** email адрес или `{user.email}`
- **Slack:** канал или user ID
- **Telegram:** chat ID или username
- **SMS:** номер телефона
- **Push:** user ID

### Subject / Title

Тема сообщения (для Email, Push)

Может содержать переменные: `"Новая задача: {task.title}"`

### Message / Body

Текст сообщения

Поддерживает:

- Переменные: `{user.name}`, `{task.id}`
- **Markdown** (для Slack, Telegram)
- **HTML** (для Email)

### Template (опционально)

Использовать шаблон

Выбрать готовый шаблон вместо написания текста

### Attachments (опционально)

Приложить файлы

Файлы из переменных или URLs

### Options

#### Для Email:

- **From Name** - от кого
- **CC / BCC** - копии
- **Reply-To** - ответить на

#### Для Slack:

- **Username** - имя бота
- **Icon** - иконка
- **Thread** - ответ в тред

#### Для Push:

- **Icon** - иконка
- **URL** - ссылка при клике

## Примеры использования

### Email уведомление о назначенной задаче

```
Блок: Event Listener (Слушатель событий)
  Event Type: task.assigned
  Сохранить результат в переменную: ✓ task_event

⭐ Блок: Send Message (Отправка сообщения) ⭐
  Канал отправки: Email
  Получатель: {task_event.task.assignee.email}
  Тема письма: Вам назначена задача: {task_event.task.title}
  Текст сообщения:
    Привет {task_event.task.assignee.name}!

    Вам назначена новая задача:
    **{task_event.task.title}**

    Описание: {task_event.task.description}
    Дедлайн: {task_event.task.dueDate}
    Приоритет: {task_event.task.priority}

    Перейти к задаче: {task_event.task.url}
  Опции Email:
    From Name: Task Management System
    Reply-To: manager@company.com
```

---

### Slack уведомление команде

```
Блок: Event Listener (Слушатель событий)
  Event Type: task.created
  Event Filter: {"priority": "critical"}
  Сохранить результат в переменную: ✓ critical_task

⭐ Блок: Send Message (Отправка сообщения) ⭐
  Канал отправки: Slack
  Получатель: #dev-team
  Сообщение:
    🚨 *КРИТИЧЕСКАЯ ЗАДАЧА!*

    *{critical_task.task.title}*

    Описание: {critical_task.task.description}
    Приоритет: {critical_task.task.priority}
    Автор: {critical_task.task.created_by.name}

    <{critical_task.task.url}|Открыть задачу>
  Опции Slack:
    Username: TaskBot
    Icon: :rotating_light:
```

---

### SMS для критического алерта

```
Блок: Event Listener (Слушатель событий)
  Event Type: system.down
  Сохранить результат в переменную: ✓ alert_event

⭐ Блок: Send Message (Отправка сообщения) ⭐
  Канал отправки: SMS
  Получатель: {admin.phone}
  Сообщение: 🚨 АЛЕРТ: Система недоступна.
    Сервис: {alert_event.service_name}
    Время: {alert_event.timestamp}
    Проверьте сервера немедленно!

⭐ Блок: Send Message (Отправка сообщения) ⭐
  Канал отправки: Telegram
  Получатель: {admin.telegram_id}
  Сообщение: ⚠️ Дублирую в Telegram:
    Система {alert_event.service_name} недоступна.
    Статус: {alert_event.status}
```

---

### Push уведомление о комментарии

```
Блок: Event Listener (Слушатель событий)
  Event Type: task.commented
  Event Filter: {"mentioned_users": "{current_user.id}"}
  Сохранить результат в переменную: ✓ comment_event

⭐ Блок: Send Message (Отправка сообщения) ⭐
  Канал отправки: Push Notification
  Получатель: {current_user.id}
  Заголовок: Новый комментарий
  Сообщение: {comment_event.comment.author.name}: {comment_event.comment.text}
  Опции Push:
    URL: {comment_event.task.url}
    Icon: comment-icon.png
    Sound: notification.wav
```

---

### Еженедельный отчёт с вложением

```
Блок: Schedule (Расписание)
  Тип расписания: Cron Expression
  Cron выражение: 0 17 * * 5
  Временная зона: Europe/Moscow
  Сохранить результат в переменную: ✓ schedule_event

Блок: Get Data (Получение данных)
  Переменная: weekly_stats
  Источник: api/statistics?period=week
  Сохранить результат в переменную: ✓ stats

Блок: Generate File (Генерация файла)
  Имя файла: weekly_report_{stats.week_number}.pdf
  Формат: PDF
  Содержимое файла: Отчёт за неделю {stats.week_number}:
    Задач выполнено: {stats.completed}
    Новых задач: {stats.created}
    Среднее время: {stats.avg_time}ч
  Сохранить результат в переменную: ✓ report

⭐ Блок: Send Message (Отправка сообщения) ⭐
  Канал отправки: Email
  Получатель: management@company.com
  Тема письма: Еженедельный отчёт {stats.week_number}
  Шаблон: weekly-report-email
  Вложения: [{report}]
  Опции Email:
    From Name: Reporting System
    CC: team-leads@company.com
```

---

### Мультиканальное уведомление

```
Блок: Event Listener (Слушатель событий)
  Event Type: bug.critical
  Сохранить результат в переменную: ✓ bug_event

⭐ Блок: Send Message (Отправка сообщения) ⭐
  Канал отправки: Email
  Получатель: dev-team@company.com
  Тема письма: [CRITICAL BUG] {bug_event.bug.title}
  Сообщение: Подробности в Slack

⭐ Блок: Send Message (Отправка сообщения) ⭐
  Канал отправки: Slack
  Получатель: #bugs-critical
  Сообщение:
    🔴 *КРИТИЧЕСКИЙ БАГ*

    {bug_event.bug.description}

    Затронуто пользователей: {bug_event.bug.affected_users}
    <{bug_event.bug.url}|Открыть баг>

⭐ Блок: Send Message (Отправка сообщения) ⭐
  Канал отправки: SMS
  Получатель: {oncall_engineer.phone}
  Сообщение: CRITICAL: {bug_event.bug.title}. Проверь Slack.

⭐ Блок: Send Message (Отправка сообщения) ⭐
  Канал отправки: Telegram
  Получатель: {ops_chat_id}
  Сообщение: ⚠️ Критический баг:
    {bug_event.bug.title}
    Приоритет: P0
    Требуется немедленная реакция!
```

    Send Message: Email всем разработчикам

Branch "Slack":
Send Message: Slack в #bugs
Branch "SMS":
Send Message: SMS team lead

```

### Telegram бот ответ

```

Webhook: Сообщение от пользователя Telegram
AI Request: Ответить на вопрос → ai_response
Send Message:
Channel: Telegram
Recipient: {webhook.chatId}
Message: {ai_response.text}

```

```
