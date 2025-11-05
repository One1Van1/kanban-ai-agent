# MCP Operation

## Что это

Model Context Protocol - операции с MCP серверами (файловая система, база данных, выполнение кода).

## Зачем нужен

- Доступ к файлам через AI
- Выполнение кода безопасно
- Работа с БД через AI
- Расширенные возможности AI

## Поля

### MCP Server

Какой MCP сервер использовать

**Filesystem** - работа с файлами
**Database** - работа с БД
**Code Execution** - выполнение кода
**Custom** - свой MCP сервер

### Operation

Какую операцию выполнить

Зависит от сервера:

#### Filesystem:

- `read_file` - прочитать файл
- `write_file` - записать файл
- `list_directory` - список файлов
- `create_directory` - создать папку
- `delete_file` - удалить файл

#### Database:

- `query` - SQL запрос
- `execute` - выполнить команду
- `get_schema` - получить схему

#### Code Execution:

- `execute_python` - Python код
- `execute_javascript` - JS код
- `execute_sql` - SQL

### Parameters

Параметры операции

В зависимости от операции:

**read_file:**

```json
{
  "path": "/path/to/file.txt"
}
```

**write_file:**

```json
{
  "path": "/path/to/file.txt",
  "content": "{file_content}"
}
```

**query (database):**

```json
{
  "sql": "SELECT * FROM users WHERE id = {userId}"
}
```

**execute_python:**

```json
{
  "code": "print('Hello')\nresult = 2 + 2\nreturn result"
}
```

### Sandbox Mode

Безопасный режим выполнения

**Enabled** - изолированная среда (рекомендуется)
**Disabled** - полный доступ (опасно)

### Timeout

Максимальное время выполнения (секунды)

По умолчанию: 30 секунд

### Save Result to Variable

Сохранить результат

Пример: `mcp_result` → `{mcp_result.output}`, `{mcp_result.error}`

## Примеры использования

### AI читает и анализирует файл

```
Блок: Event Listener (Слушатель событий)
  Event Type: analysis.requested
  Сохранить результат в переменную: ✓ analysis_event

⭐ Блок: MCP Operation (MCP операция) ⭐
  MCP Server: Filesystem
  Operation: read_file
  Parameters: {
    "path": "{analysis_event.file_path}"
  }
  Sandbox Mode: ✓ Enabled
  Timeout: 30
  Сохранить результат в переменную: ✓ file_content

Блок: AI Request (AI запрос)
  Промпт: Проанализируй содержимое файла:

    {file_content.output}

    Выдели:
    - Ключевые метрики
    - Проблемы
    - Рекомендации
  Модель: gpt-4
  Сохранить результат в переменную: ✓ analysis

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  ID карточки: {analysis_event.task_id}
  Текст комментария: 📊 Анализ файла завершён:

    {analysis}
```

---

### AI генерирует и сохраняет файл

```
Блок: Manual Trigger (Ручной запуск)
  Название триггера: Сгенерировать отчёт
  Сохранить результат в переменную: ✓ trigger_event

Блок: Get Data (Получение данных)
  Переменная: report_data
  Источник: api/reports/data?type=monthly
  Сохранить результат в переменную: ✓ data

Блок: AI Request (AI запрос)
  Промпт: Создай HTML отчёт на основе данных:
    {data}

    Требования:
    - Красивый дизайн
    - Графики и таблицы
    - Адаптивная вёрстка
  Модель: gpt-4
  Сохранить результат в переменную: ✓ html_code

⭐ Блок: MCP Operation (MCP операция) ⭐
  MCP Server: Filesystem
  Operation: write_file
  Parameters: {
    "path": "/reports/monthly-report-{trigger_event.timestamp}.html",
    "content": "{html_code}"
  }
  Sandbox Mode: ✓ Enabled
  Timeout: 15
  Сохранить результат в переменную: ✓ file_result

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: {trigger_event.user.email}
  Тема письма: Отчёт готов
  Сообщение: Ссылка на отчёт: {file_result.output.url}
```

---

### Выполнить Python анализ данных

```
Блок: Event Listener (Слушатель событий)
  Event Type: data.analyze
  Сохранить результат в переменную: ✓ analyze_event

Блок: Get Data (Получение данных)
  Переменная: tasks_data
  Источник: api/tasks?all=true
  Сохранить результат в переменную: ✓ tasks

⭐ Блок: MCP Operation (MCP операция) ⭐
  MCP Server: Code Execution
  Operation: execute_python
  Parameters: {
    "code": "
import pandas as pd
import json

# Загрузить данные
data = json.loads('{tasks}')
df = pd.DataFrame(data)

# Анализ
stats = {
    'total': len(df),
    'by_status': df['status'].value_counts().to_dict(),
    'by_priority': df['priority'].value_counts().to_dict(),
    'avg_completion_time': df['completionTime'].mean()
}

return json.dumps(stats, ensure_ascii=False)
    "
  }
  Sandbox Mode: ✓ Enabled
  Timeout: 60
  Сохранить результат в переменную: ✓ python_result

Блок: Send Message (Отправка сообщения)
  Канал отправки: Slack
  Получатель: #analytics
  Сообщение: 📊 Анализ задач завершён:

    {python_result.output}
```

---

### SQL запрос к базе данных

```
Блок: Schedule (Расписание)
  Тип расписания: Cron Expression
  Cron выражение: 0 8 * * 1
  Временная зона: Europe/Moscow
  Описание: Каждый понедельник в 8:00
  Сохранить результат в переменную: ✓ schedule_event

⭐ Блок: MCP Operation (MCP операция) ⭐
  MCP Server: Database
  Operation: query
  Parameters: {
    "sql": "SELECT
      status,
      COUNT(*) as count,
      AVG(completion_time) as avg_time
    FROM tasks
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    GROUP BY status"
  }
  Sandbox Mode: ✓ Enabled
  Timeout: 30
  Сохранить результат в переменную: ✓ query_result

Блок: Transform Data (Преобразование данных)
  Переменная: formatted_stats
  Источник: {query_result.output}
  Тип преобразования: Map
  Map выражение: `${item.status}: ${item.count} задач (среднее время: ${item.avg_time}ч)`
  Сохранить результат в переменную: ✓ stats_text

Блок: Send Message (Отправка сообщения)
  Канал отправки: Slack
  Получатель: #team-updates
  Сообщение: 📈 Статистика за неделю:

    {stats_text}
```

---

### Работа с директориями

```
Блок: Manual Trigger (Ручной запуск)
  Название триггера: Синхронизировать файлы
  Сохранить результат в переменную: ✓ sync_trigger

⭐ Блок: MCP Operation (MCP операция) ⭐
  MCP Server: Filesystem
  Operation: list_directory
  Parameters: {
    "path": "/data/uploads"
  }
  Sandbox Mode: ✓ Enabled
  Сохранить результат в переменную: ✓ files_list

Блок: Loop (Цикл)
  Итерировать по: {files_list.output}
  Элемент: file_item

  Внутри Loop:
    Блок: MCP Operation (MCP операция)
      MCP Server: Filesystem
      Operation: read_file
      Parameters: {
        "path": "/data/uploads/{file_item.name}"
      }
      Сохранить результат в переменную: ✓ file_content

    Блок: API Call (API вызов)
      URL: https://api.example.com/v1/files/upload
      HTTP Method: POST
      Body: {
        "filename": "{file_item.name}",
        "content": "{file_content.output}"
      }
      Сохранить результат в переменную: ✓ upload_result

    Блок: If-Else (Условие)
      Условие: {upload_result.status} === 200

      True:
        Блок: MCP Operation (MCP операция)
          MCP Server: Filesystem
          Operation: delete_file
          Parameters: {
            "path": "/data/uploads/{file_item.name}"
          }

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: {sync_trigger.user.email}
  Тема письма: Синхронизация завершена
  Сообщение: Обработано файлов: {files_list.output.length}
```

---

### JavaScript выполнение с контекстом

````
Блок: Event Listener (Слушатель событий)
  Event Type: calculation.needed
  Сохранить результат в переменную: ✓ calc_event

⭐ Блок: MCP Operation (MCP операция) ⭐
  MCP Server: Code Execution
  Operation: execute_javascript
  Parameters: {
    "code": "
const data = context.calc_event.data;

// Сложные вычисления
const result = {
  sum: data.reduce((a, b) => a + b.value, 0),
  avg: data.reduce((a, b) => a + b.value, 0) / data.length,
  max: Math.max(...data.map(d => d.value)),
  min: Math.min(...data.map(d => d.value)),
  median: data.sort((a, b) => a.value - b.value)[Math.floor(data.length / 2)].value
};

return JSON.stringify(result);
    ",
    "context": {
      "calc_event": "{calc_event}"
    }
  }
  Sandbox Mode: ✓ Enabled
  Timeout: 20
  Сохранить результат в переменную: ✓ js_result

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  ID карточки: {calc_event.task_id}
  Текст комментария: 🧮 Результаты расчётов:

    ```json
    {js_result.output}
    ```
````

# Получить данные

tasks = json.loads('{tasks}')

# Анализ

df = pd.DataFrame(tasks)
analysis = {
'total': len(df),
'by_status': df['status'].value_counts().to_dict(),
'avg_duration': df['duration'].mean()
}

return json.dumps(analysis)
"
}
Sandbox: true
Timeout: 10
Save to: analysis

```

### SQL запрос через MCP

```

MCP Operation:
Server: Database
Operation: query
Parameters: {
"sql": "
SELECT user_id, COUNT(\*) as task_count
FROM tasks
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY user_id
ORDER BY task_count DESC
"
}
Save to: user_stats
→ Generate File: Отчёт с user_stats

```

### Создать структуру папок

```

MCP Operation:
Server: Filesystem
Operation: create_directory
Parameters: {
"path": "/projects/{project.name}/docs"
}
→ MCP Operation:
Operation: write_file
Parameters: {
"path": "/projects/{project.name}/docs/README.md",
"content": "# {project.name}\n\n{project.description}"
}

```

### AI с доступом к файлам

```

User Question: {message}

// Дать AI возможность читать файлы
AI Request:
System: "Ты можешь читать файлы через MCP"
Prompt: "{message}"
Tools: [
{
"name": "read_file",
"mcp_server": "filesystem",
"parameters": {"path": "string"}
}
]

// AI может вызвать read_file
// → MCP Operation автоматически

```

### Безопасное выполнение кода от пользователя

```

User Code: {user_code}

MCP Operation:
Server: Code Execution
Operation: execute_python
Parameters: {
"code": "{user_code}"
}
Sandbox: true (изоляция!)
Timeout: 5
Save to: result
→ Condition: Если нет ошибок
→ Send Message: Результат {result.output}
→ Else:
→ Send Message: Ошибка {result.error}

```

```
