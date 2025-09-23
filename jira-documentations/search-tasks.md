# Search Tasks API

## Описание

Эндпойнт для поиска задач в Jira с использованием JQL (Jira Query Language).

## Endpoint

```
POST /jira/search
```

## Описание функциональности

Выполняет гибкий поиск задач в Jira используя мощный язык запросов JQL. Позволяет создавать сложные фильтры и получать точно те задачи, которые нужны.

## Параметры запроса

### Request Body

```json
{
  "jql": "project = \"KAN\" AND status = \"In Progress\"",
  "maxResults": 20
}
```

| Поле       | Тип    | Обязательный | Описание                                              | Пример                                    |
| ---------- | ------ | ------------ | ----------------------------------------------------- | ----------------------------------------- |
| jql        | string | Да           | JQL запрос для поиска                                 | "project = \"KAN\" AND status = \"Done\"" |
| maxResults | number | Нет          | Максимальное количество результатов (по умолчанию 20) | 10                                        |

## Примеры запросов

### Базовый поиск

```bash
curl -X POST http://localhost:3000/jira/search \
  -H "Content-Type: application/json" \
  -d '{
    "jql": "project = \"KAN\" AND status = \"In Progress\"",
    "maxResults": 10
  }'
```

### Поиск по исполнителю

```bash
curl -X POST http://localhost:3000/jira/search \
  -H "Content-Type: application/json" \
  -d '{
    "jql": "assignee = \"john.doe\" AND status != \"Done\"",
    "maxResults": 15
  }'
```

### Поиск по приоритету и дате

```bash
curl -X POST http://localhost:3000/jira/search \
  -H "Content-Type: application/json" \
  -d '{
    "jql": "priority = \"High\" AND created >= \"-1w\"",
    "maxResults": 25
  }'
```

## Ответы

### Успешный ответ (200)

```json
{
  "issues": [
    {
      "key": "KAN-5",
      "fields": {
        "summary": "Реализация новой функции",
        "description": "Подробное описание задачи",
        "status": {
          "name": "In Progress",
          "id": "3"
        },
        "assignee": {
          "displayName": "John Doe",
          "emailAddress": "john.doe@example.com"
        },
        "priority": {
          "name": "High",
          "id": "2"
        },
        "created": "2025-09-20T10:00:00.000Z",
        "updated": "2025-09-23T15:04:11.000Z"
      }
    }
  ],
  "total": 1,
  "maxResults": 10,
  "startAt": 0
}
```

### Структура ответа

| Поле       | Тип    | Описание                             |
| ---------- | ------ | ------------------------------------ |
| issues     | array  | Массив найденных задач               |
| total      | number | Общее количество найденных задач     |
| maxResults | number | Максимальное количество в ответе     |
| startAt    | number | Смещение результатов (для пагинации) |

## Возможные ошибки

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Некорректный JQL запрос",
  "error": "Bad Request",
  "details": "Syntax error in JQL query"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Ошибка выполнения поиска",
  "error": "Internal Server Error"
}
```

## JQL Примеры

### Основные операторы

```jql
# Поиск по проекту
project = "KAN"

# Поиск по статусу
status = "In Progress"

# Поиск по исполнителю
assignee = "john.doe"

# Поиск по приоритету
priority = "High"
```

### Комбинирование условий

```jql
# И (AND)
project = "KAN" AND status = "In Progress"

# ИЛИ (OR)
status = "In Progress" OR status = "Review"

# НЕ (NOT)
status != "Done"

# В списке (IN)
status IN ("In Progress", "Review", "Questions")
```

### Работа с датами

```jql
# Задачи созданные за последнюю неделю
created >= "-1w"

# Задачи обновлённые сегодня
updated >= startOfDay()

# Задачи созданные в определённый период
created >= "2025-09-01" AND created <= "2025-09-30"
```

### Расширенные запросы

```jql
# Просроченные задачи
duedate < now() AND status != "Done"

# Задачи без исполнителя
assignee is EMPTY

# Задачи с определённым текстом
summary ~ "API"

# Задачи в нескольких проектах
project IN ("KAN", "DEV", "TEST")
```

## Полезные функции JQL

### Функции времени

- `now()` - текущее время
- `startOfDay()` - начало дня
- `endOfDay()` - конец дня
- `startOfWeek()` - начало недели

### Относительные даты

- `-1d` - вчера
- `-1w` - неделю назад
- `-1M` - месяц назад
- `+1d` - завтра

## Использование

Этот эндпойнт идеален для:

- Создания пользовательских фильтров
- Построения отчётов
- Поиска задач по сложным критериям
- Интеграции с внешними системами
- Автоматизации workflow

## Ограничения

- Максимальное количество результатов за один запрос: 1000
- Сложные JQL запросы могут выполняться медленно
- Доступ к полям зависит от прав пользователя

## Примечания

- JQL чувствителен к регистру для значений
- Используйте кавычки для значений с пробелами
- Функции и операторы не чувствительны к регистру
- Поддерживается пагинация через параметр startAt

## Теги Swagger

- **search** - Эндпойнты для поиска
