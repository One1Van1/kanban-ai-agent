# Get Column Tasks API

## Описание

Эндпойнт для получения всех задач из конкретной колонки (статуса) с возможностью фильтрации.

## Endpoint

```
GET /jira/columns/{columnName}/tasks
```

## Описание функциональности

Возвращает список всех задач, находящихся в указанной колонке (статусе), с поддержкой различных фильтров для уточнения результатов.

## Параметры запроса

### Path Parameters

| Параметр   | Тип    | Обязательный | Описание                   | Возможные значения                                 |
| ---------- | ------ | ------------ | -------------------------- | -------------------------------------------------- |
| columnName | string | Да           | Название колонки (статуса) | New, backlog, Questions, In Progress, Review, Done |

### Query Parameters

| Параметр   | Тип    | Обязательный | Описание                      | Пример   |
| ---------- | ------ | ------------ | ----------------------------- | -------- |
| maxResults | number | Нет          | Максимальное количество задач | 10       |
| assignee   | string | Нет          | ID исполнителя для фильтрации | john.doe |
| priority   | string | Нет          | Приоритет для фильтрации      | High     |

## Примеры запросов

### Основной запрос

```bash
curl -X GET http://localhost:3000/jira/columns/In%20Progress/tasks
```

### С фильтрами

```bash
curl -X GET "http://localhost:3000/jira/columns/In%20Progress/tasks?maxResults=5&assignee=john.doe&priority=High"
```

## Ответы

### Успешный ответ (200)

```json
{
  "columnName": "In Progress",
  "totalTasks": 3,
  "tasks": [
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
          "emailAddress": "john.doe@example.com",
          "accountId": "john.doe"
        },
        "priority": {
          "name": "High",
          "id": "2"
        },
        "created": "2025-09-20T10:00:00.000Z",
        "updated": "2025-09-23T15:04:11.000Z"
      }
    },
    {
      "key": "KAN-7",
      "fields": {
        "summary": "Исправление багов",
        "status": {
          "name": "In Progress"
        },
        "assignee": {
          "displayName": "Jane Smith"
        },
        "priority": {
          "name": "Medium"
        }
      }
    }
  ]
}
```

### Структура ответа

| Поле                    | Тип    | Описание                         |
| ----------------------- | ------ | -------------------------------- |
| columnName              | string | Название колонки                 |
| totalTasks              | number | Общее количество задач в колонке |
| tasks                   | array  | Массив задач                     |
| tasks[].key             | string | Ключ задачи                      |
| tasks[].fields          | object | Поля задачи                      |
| tasks[].fields.summary  | string | Название задачи                  |
| tasks[].fields.status   | object | Статус задачи                    |
| tasks[].fields.assignee | object | Исполнитель                      |
| tasks[].fields.priority | object | Приоритет                        |

## Возможные ошибки

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Некорректное название колонки",
  "error": "Bad Request"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Колонка не найдена",
  "error": "Not Found"
}
```

## Доступные колонки

- **New** - Новые задачи
- **backlog** - Бэклог проекта
- **Questions** - Задачи с вопросами
- **In Progress** - Задачи в работе
- **Review** - Задачи на проверке
- **Done** - Завершённые задачи

## Фильтры

### По исполнителю (assignee)

Можно указать ID пользователя или email для фильтрации задач конкретного исполнителя.

### По приоритету (priority)

Доступные значения:

- **Highest** - Наивысший
- **High** - Высокий
- **Medium** - Средний
- **Low** - Низкий
- **Lowest** - Наименьший

### По количеству (maxResults)

Ограничивает количество возвращаемых задач. По умолчанию возвращается до 50 задач.

## Использование

Этот эндпойнт полезен для:

- Отображения канбан-доски
- Мониторинга загрузки колонок
- Анализа распределения задач
- Построения отчётов по статусам

## Примечания

- Результаты сортируются по дате обновления (новые сверху)
- Фильтры можно комбинировать
- При использовании фильтров учитывается регистр
- Пустые колонки возвращают пустой массив задач

## Теги Swagger

- **columns** - Эндпойнты для работы с колонками
