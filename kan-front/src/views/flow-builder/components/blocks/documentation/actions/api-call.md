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

Адрес API endpoint

Может содержать переменные:

- `https://api.service.com/users/{userId}`
- `{env.API_URL}/tasks`

### HTTP Method

Метод запроса

**GET** - получить данные
**POST** - создать/отправить данные
**PUT** - обновить полностью
**PATCH** - обновить частично
**DELETE** - удалить

### Headers

Заголовки запроса

JSON объект:

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json",
  "X-Custom-Header": "value"
}
```

**Частые заголовки:**

- `Authorization` - аутентификация
- `Content-Type` - тип данных
- `Accept` - какой формат ответа

### Query Parameters

Параметры в URL (для GET)

```json
{
  "page": 1,
  "limit": 10,
  "status": "active"
}
```

Результат: `?page=1&limit=10&status=active`

### Body (для POST/PUT/PATCH)

Тело запроса

**JSON:**

```json
{
  "title": "{task.title}",
  "status": "done",
  "completedAt": "{now}"
}
```

**Form Data** - для загрузки файлов

### Authentication

Тип аутентификации

**Bearer Token** - `Authorization: Bearer <token>`
**API Key** - в header или query
**Basic Auth** - username:password
**OAuth 2.0** - OAuth токен

### Retry Settings

Настройки повторов при ошибке

**Max Retries** - сколько раз повторить
**Retry Delay** - пауза между попытками
**Retry On** - какие ошибки (429, 5xx)

### Timeout

Максимальное время ожидания ответа (секунды)

По умолчанию: 30 секунд

### Save Response to Variable

Сохранить ответ в переменную

Пример: `api_response` → `{api_response.data}`, `{api_response.status}`

## Примеры использования

### Создать задачу в Jira

```
Event: task.created
API Call:
  URL: "https://your-domain.atlassian.net/rest/api/3/issue"
  Method: POST
  Headers: {
    "Authorization": "Bearer {env.JIRA_TOKEN}",
    "Content-Type": "application/json"
  }
  Body: {
    "fields": {
      "project": {"key": "PROJ"},
      "summary": "{task.title}",
      "description": "{task.description}",
      "issuetype": {"name": "Task"}
    }
  }
  Save to: jira_task
→ Update Task: Сохранить jira_id
```

### Отправить в Slack webhook

```
Event: Критический баг
API Call:
  URL: "{env.SLACK_WEBHOOK_URL}"
  Method: POST
  Body: {
    "text": "🚨 Критический баг!",
    "blocks": [{
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*{task.title}*\n{task.description}"
      }
    }]
  }
```

### Получить курс валюты

```
API Call:
  URL: "https://api.exchangerate-api.com/v4/latest/USD"
  Method: GET
  Save to: rates
→ Transform Data: Конвертировать цену
  {price} * {rates.rates.EUR}
```

### GitHub - создать issue

```
API Call:
  URL: "https://api.github.com/repos/{owner}/{repo}/issues"
  Method: POST
  Headers: {
    "Authorization": "token {env.GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
  }
  Body: {
    "title": "{task.title}",
    "body": "{task.description}",
    "labels": ["bug"]
  }
```

### Проверка с retry

```
Try/Catch:
  Max Retries: 3

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
