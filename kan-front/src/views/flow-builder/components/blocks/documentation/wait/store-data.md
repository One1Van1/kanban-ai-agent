# Store Data

## Что это

Сохранить данные в хранилище (база данных, кэш, файлы).

## Зачем нужен

- Сохранить промежуточные результаты
- Логирование выполнения
- Кэширование данных
- Сохранить state между запусками
- Записать метрики

## Поля

### Storage Type

Куда сохранить

**Database** - реляционная БД (PostgreSQL, MySQL)
**Cache** - кэш (Redis, Memcached)
**File Storage** - файловое хранилище (S3, локально)
**Analytics** - система аналитики (Elasticsearch)
**Document DB** - документная БД (MongoDB)

### Connection / Database

Какое подключение использовать

Выбрать из настроенных подключений

### Operation

Что делать

**Insert** - добавить новую запись
**Update** - обновить существующую
**Upsert** - обновить или создать
**Delete** - удалить

### Table / Collection / Key

Где сохранить

- **Database:** имя таблицы
- **Cache:** ключ (может быть с переменными)
- **File:** путь к файлу
- **MongoDB:** коллекция

### Data

Данные для сохранения

JSON объект с переменными:

```json
{
  "user_id": "{user.id}",
  "action": "task_completed",
  "task_id": "{task.id}",
  "timestamp": "{now}"
}
```

### Options

#### Для Database:

- **Where** (для Update) - условие
- **Return ID** - вернуть ID новой записи

#### Для Cache:

- **TTL** - время жизни (секунды)
- **Overwrite** - перезаписать если есть

#### Для File Storage:

- **Path** - путь к файлу
- **Content Type** - MIME type

### Save Result to Variable

Сохранить результат операции

Пример: `saved` → `{saved.id}`, `{saved.status}`

## Примеры использования

### Логирование выполнения потока

```
Flow Started: {flow}
Store Data:
  Type: Database
  Table: "flow_executions"
  Operation: Insert
  Data: {
    "flow_id": "{flow.id}",
    "started_at": "{now}",
    "triggered_by": "{user.id}",
    "status": "running"
  }
  Save to: execution_log
→ ... выполнение потока ...
→ Store Data:
  Type: Database
  Table: "flow_executions"
  Operation: Update
  Where: {"id": "{execution_log.id}"}
  Data: {
    "completed_at": "{now}",
    "status": "completed"
  }
```

### Кэширование API ответа

```
API Call: Получить данные (медленный API)
  Save to: api_data
Store Data:
  Type: Cache
  Key: "api-cache-{endpoint}-{params}"
  Data: {api_data}
  TTL: 3600 (1 час)
```

### Использование кэша

```
// Сначала проверить кэш
Get Data: Cache "user-settings-{user.id}"
  Save to: cached_settings
Condition: Если {cached_settings} === null
  THEN:
    → Get Data: Database "users"
    → Store Data: Cache
      Key: "user-settings-{user.id}"
      Data: {user_settings}
      TTL: 1800
  ELSE:
    → Use {cached_settings}
```

### Сохранить user activity

```
Event: task.viewed
Store Data:
  Type: Analytics (Elasticsearch)
  Index: "user-activity-{date}"
  Data: {
    "user_id": "{user.id}",
    "action": "task_viewed",
    "task_id": "{task.id}",
    "timestamp": "{now}",
    "session_id": "{session.id}"
  }
```

### Сохранить state для продолжения

```
Schedule: Каждый час
Get Data: Cache "last_processed_id"
  → Получить где остановились
Task Data: Get Tasks where id > {last_processed_id}
Loop: For Each {tasks} as task
  → Process task
→ Store Data: Cache
  Key: "last_processed_id"
  Data: {last_task.id}
  TTL: 86400 (24 часа)
```

### Backup в S3

```
Schedule: Каждый день в 2:00
Board Data: Get All → boards
Task Data: Get All → tasks
Transform Data: В JSON → backup_data
Store Data:
  Type: File Storage (S3)
  Path: "/backups/full-backup-{date}.json"
  Data: {backup_data}
  Content Type: "application/json"
```

### Метрики для мониторинга

```
API Call: External API
  Save response time to: response_time
Store Data:
  Type: Analytics
  System: Datadog
  Metric: "api.response_time"
  Value: {response_time}
  Tags: {
    "endpoint": "{api_endpoint}",
    "method": "GET",
    "status": "{response.status}"
  }
```

### Сохранить для отчёта

```
Event: task.completed
Store Data:
  Type: Document DB (MongoDB)
  Collection: "completed_tasks"
  Operation: Insert
  Data: {
    "task_id": "{task.id}",
    "title": "{task.title}",
    "completed_by": "{user.id}",
    "completed_at": "{now}",
    "duration": "{task.duration}",
    "board_id": "{task.boardId}"
  }
```
