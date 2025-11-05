# API Call

## Что это

Отправить HTTP запрос к внешнему API (GET, POST, PUT, DELETE).

## Зачем нужен

- Интеграция с внешними сервисами
- Отправка данных в другие системы
- Получение данных из API
- Webhooks исходящие

## Поля

### URL

Адрес API endpoint. Может содержать переменные в фигурных скобках.

**Примеры:**

- `https://api.service.com/users/{userId}`
- `{env.API_URL}/tasks`
- `https://api.github.com/repos/{owner}/{repo}/issues`

**Query Parameters:** Можно добавить прямо в URL:

- `https://api.service.com/users?page=1&limit=10`
- `https://api.service.com/search?q={searchQuery}&status=active`

### HTTP Method

Метод HTTP запроса.

**Доступные методы:**

- **GET** - получить данные (не имеет body)
- **POST** - создать новый ресурс / отправить данные
- **PUT** - обновить ресурс полностью
- **PATCH** - обновить ресурс частично
- **DELETE** - удалить ресурс

### Headers

HTTP заголовки в формате JSON.

**Примеры:**

```json
{
  "Authorization": "Bearer {env.API_TOKEN}",
  "Content-Type": "application/json"
}
```

```json
{
  "Authorization": "Bearer sk-abc123xyz",
  "Content-Type": "application/json",
  "X-Custom-Header": "my-value"
}
```

**Частые заголовки:**

- `Authorization` - токен для аутентификации
- `Content-Type` - формат данных (`application/json`)
- `Accept` - какой формат ответа вы ожидаете
- `User-Agent` - идентификация клиента

### Body

Тело запроса (для POST, PUT, PATCH). В формате JSON.

**Примеры:**

```json
{
  "title": "{task.title}",
  "status": "done",
  "completedAt": "{now}"
}
```

```json
{
  "name": "{user.name}",
  "email": "{user.email}",
  "role": "admin"
}
```

**Использование переменных:**

- Переменные из предыдущих блоков: `{variableName.field}`
- Вложенные данные: `{data.user.profile.name}`

### Сохранить результат в переменную

Имя переменной для сохранения ответа API.

**Примеры:**

- `api_response` → использовать как `{api_response.data}`
- `github_issues` → использовать как `{github_issues[0].title}`
- `created_user` → использовать как `{created_user.id}`

---

> **💡 Примечание:** Продвинутые настройки (Retry Logic, Timeout, Authentication types) планируются в будущих версиях. Сейчас используйте Headers для аутентификации и включайте query parameters прямо в URL.

### Timeout

Максимальное время ожидания ответа (секунды)

По умолчанию: 30 секунд

### Save Response to Variable

Сохранить ответ в переменную

Пример: `api_response` → `{api_response.data}`, `{api_response.status}`

## Примеры использования

### Создать задачу в Jira

```
Блок: Event Listener (Слушатель событий)
  Event Type: task.created
  Сохранить результат в переменную: ✓ task_event

⭐ Блок: API Call (API вызов) ⭐
  URL: {env.JIRA_URL}/rest/api/2/issue
  HTTP Method: POST
  Headers: {
    "Authorization": "Bearer {env.JIRA_TOKEN}",
    "Content-Type": "application/json"
  }
  Body: {
    "fields": {
      "project": {"key": "PROJ"},
      "summary": "{task_event.task.title}",
      "description": "{task_event.task.description}",
      "issuetype": {"name": "Task"}
    }
  }
  Сохранить результат в переменную: ✓ jira_task

Блок: Store Data (Сохранение данных)
  Переменная: task_id
  Значение: {jira_task.data.id}
```

---

### Отправить в Slack webhook

```
Блок: Event Listener (Слушатель событий)
  Event Type: bug.critical
  Сохранить результат в переменную: ✓ bug_event

⭐ Блок: API Call (API вызов) ⭐
  URL: {env.SLACK_WEBHOOK_URL}
  HTTP Method: POST
  Headers: {
    "Content-Type": "application/json"
  }
  Body: {
    "text": "🚨 Критический баг!",
    "blocks": [{
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*{bug_event.bug.title}*\n{bug_event.bug.description}"
      }
    }, {
      "type": "context",
      "elements": [{
        "type": "mrkdwn",
        "text": "Приоритет: P0 | Создано: {bug_event.timestamp}"
      }]
    }]
  }
  Сохранить результат в переменную: ✓ slack_response
```

---

### Получить курс валюты

```
⭐ Блок: API Call (API вызов) ⭐
  URL: https://api.exchangerate-api.com/v4/latest/USD
  HTTP Method: GET
  Headers: {
    "Accept": "application/json"
  }
  Сохранить результат в переменную: ✓ rates

Блок: Transform Data (Преобразование данных)
  Переменная: price_eur
  Источник: {price} * {rates.rates.EUR}
  Тип преобразования: JavaScript
  Код преобразования: return Number((context.price * context.rates.rates.EUR).toFixed(2));
  Сохранить результат в переменную: ✓ converted_price
```

---

### GitHub - создать issue

```
Блок: Event Listener (Слушатель событий)
  Event Type: task.bug_reported
  Сохранить результат в переменную: ✓ bug_report

⭐ Блок: API Call (API вызов) ⭐
  URL: https://api.github.com/repos/{env.GITHUB_OWNER}/{env.GITHUB_REPO}/issues
  HTTP Method: POST
  Headers: {
    "Authorization": "token {env.GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
  }
  Body: {
    "title": "{bug_report.bug.title}",
    "body": "{bug_report.bug.description}\n\n---\nReported by: {bug_report.user.name}",
    "labels": ["bug", "from-system"],
    "assignees": ["{env.GITHUB_DEFAULT_ASSIGNEE}"]
  }
  Сохранить результат в переменную: ✓ github_issue

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  ID карточки: {bug_report.bug.id}
  Текст комментария: ✅ GitHub issue создан: {github_issue.data.html_url}
```

---

### REST API с авторизацией и retry

```
Блок: Schedule (Расписание)
  Тип расписания: Cron Expression
  Cron выражение: 0 */6 * * *
  Временная зона: Europe/Moscow
  Сохранить результат в переменную: ✓ schedule_event

⭐ Блок: API Call (API вызов) ⭐
  URL: https://api.example.com/v1/sync
  HTTP Method: POST
  Headers: {
    "Authorization": "Bearer {env.API_TOKEN}",
    "Content-Type": "application/json",
    "X-Request-ID": "{schedule_event.run_id}"
  }
  Body: {
    "timestamp": "{schedule_event.timestamp}",
    "source": "kanban_system"
  }
  Сохранить результат в переменную: ✓ sync_result

Блок: If-Else (Условие)
  Условие: {sync_result.status} === 200

  True (Успех):
    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
      Операция: add_comment
      ID карточки: {card.id}
      Текст комментария: ✅ Sync completed: {sync_result.data.synced_count} items

  False (Ошибка):
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Slack
      Получатель: #devops-alerts
      Сообщение: ⚠️ Sync failed: {sync_result.error}
```

---

### Webhook с Form Data (загрузка файла)

```
Блок: Event Listener (Слушатель событий)
  Event Type: document.uploaded
  Сохранить результат в переменную: ✓ doc_event

⭐ Блок: API Call (API вызов) ⭐
  URL: https://api.example.com/v1/documents/convert
  HTTP Method: POST
  Headers: {
    "Authorization": "API-Key {env.CONVERSION_API_KEY}"
  }
  Body Type: Form Data
  Form Data: {
    "file": "{doc_event.document.file}",
    "format": "pdf",
    "quality": "high"
  }
  API Key Location: Header
  Сохранить результат в переменную: ✓ converted_doc

Блок: Store Data (Сохранение данных)
  Переменная: converted_document_url
  Значение: {converted_doc.data.url}
```

API Call:
URL: "{api_url}"
Method: GET
Retry Settings:
Max Retries: 3
Retry Delay: 2 (exponential)
Retry On: [429, 503, 504]
Timeout: 10

```

### GraphQL запрос

```

API Call:
URL: "https://api.github.com/graphql"
Method: POST
Headers: {
"Authorization": "Bearer {token}"
}
Body: {
"query": "query {
viewer {
login
repositories(first: 10) {
nodes { name }
}
}
}"
}
Save to: github_data

```

### Отправить файл (multipart)

```

API Call:
URL: "{upload_url}"
Method: POST
Headers: {
"Authorization": "Bearer {token}"
}
Body Type: Form Data
Body: {
"file": {file_from_variable},
"name": "{filename}",
"description": "Uploaded file"
}

```

```
