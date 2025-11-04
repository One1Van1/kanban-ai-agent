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
MCP Operation:
  Server: Filesystem
  Operation: read_file
  Parameters: {
    "path": "/data/report.csv"
  }
  Save to: file_content
→ AI Request:
  Prompt: "Проанализируй данные:
           {file_content}"
```

### AI генерирует и сохраняет файл

```
AI Request: "Создай HTML отчёт" → html_code
MCP Operation:
  Server: Filesystem
  Operation: write_file
  Parameters: {
    "path": "/reports/report-{date}.html",
    "content": "{html_code}"
  }
→ Send Message: Ссылка на отчёт
```

### Выполнить Python анализ

```
Task Data: Get Tasks → tasks
MCP Operation:
  Server: Code Execution
  Operation: execute_python
  Parameters: {
    "code": "
import pandas as pd
import json

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
      SELECT user_id, COUNT(*) as task_count
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
