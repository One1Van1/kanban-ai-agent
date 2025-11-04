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

### Email уведомление о задаче

```
Event: task.assigned to пользователя
Send Message:
  Channel: Email
  Recipient: {user.email}
  Subject: "Вам назначена задача: {task.title}"
  Body: "
    Привет {user.name}!

    Вам назначена новая задача:
    {task.title}

    Описание: {task.description}
    Дедлайн: {task.dueDate}

    Перейти к задаче: {task.url}
  "
```

### Slack уведомление команде

```
Event: Критическая задача создана
Send Message:
  Channel: Slack
  Recipient: "#dev-team"
  Message: "
    🚨 *Критическая задача!*

    {task.title}
    Приоритет: {task.priority}

    <{task.url}|Открыть задачу>
  "
```

### SMS для важного события

```
Event: Система недоступна
Send Message:
  Channel: SMS
  Recipient: {admin.phone}
  Message: "АЛЕРТ: Система недоступна.
            Проверьте сервера немедленно."
```

### Push уведомление

```
Event: Новый комментарий на вашей задаче
Send Message:
  Channel: Push
  Recipient: {task.assignee.id}
  Title: "Новый комментарий"
  Message: "{comment.author}: {comment.text}"
  Options:
    URL: {task.url}
    Icon: "comment-icon.png"
```

### Еженедельный отчёт

```
Schedule: Каждую пятницу 17:00
Generate File: Отчёт PDF → report
Send Message:
  Channel: Email
  Recipient: {manager.email}
  Subject: "Еженедельный отчёт {date}"
  Template: "weekly-report-email"
  Attachments: [{report}]
```

### Мультиканальное уведомление

```
Event: Критический баг
Parallel:
  Branch "Email":
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
