# Примеры использования Jira API

## Базовые сценарии

### 1. Проверка подключения к Jira

```bash
# Простая проверка
curl -X GET http://localhost:3000/jira/health

# С форматированием JSON
curl -X GET http://localhost:3000/jira/health | jq '.'
```

### 2. Получение информации о задаче

```bash
# Получить задачу
curl -X GET http://localhost:3000/jira/tasks/KAN-5

# Получить только название и статус
curl -X GET http://localhost:3000/jira/tasks/KAN-5 | jq '{key: .key, summary: .fields.summary, status: .fields.status.name}'
```

### 3. Перемещение задачи

```bash
# Переместить в Done без комментария
curl -X POST http://localhost:3000/jira/tasks/KAN-5/move \
  -H "Content-Type: application/json" \
  -d '{"targetStatus": "Done"}'

# Переместить с комментарием
curl -X POST http://localhost:3000/jira/tasks/KAN-5/move \
  -H "Content-Type: application/json" \
  -d '{
    "targetStatus": "In Progress",
    "comment": "Начинаю работу над задачей"
  }'
```

## Продвинутые сценарии

### 4. Работа с колонками и задачами

```bash
# Получить все задачи в работе
curl -X GET "http://localhost:3000/jira/columns/In%20Progress/tasks"

# Получить топ-5 задач с высоким приоритетом
curl -X GET "http://localhost:3000/jira/columns/backlog/tasks?maxResults=5&priority=High"

# Получить задачи конкретного исполнителя
curl -X GET "http://localhost:3000/jira/columns/Review/tasks?assignee=john.doe"
```

### 5. Сложный поиск с JQL

```bash
# Найти просроченные задачи
curl -X POST http://localhost:3000/jira/search \
  -H "Content-Type: application/json" \
  -d '{
    "jql": "duedate < now() AND status != \"Done\"",
    "maxResults": 20
  }'

# Найти задачи без исполнителя
curl -X POST http://localhost:3000/jira/search \
  -H "Content-Type: application/json" \
  -d '{
    "jql": "assignee is EMPTY AND status != \"Done\"",
    "maxResults": 10
  }'

# Найти задачи созданные за последнюю неделю
curl -X POST http://localhost:3000/jira/search \
  -H "Content-Type: application/json" \
  -d '{
    "jql": "created >= \"-1w\" ORDER BY created DESC",
    "maxResults": 15
  }'
```

### 6. Добавление комментариев

```bash
# Простой комментарий
curl -X POST http://localhost:3000/jira/tasks/KAN-5/comment \
  -H "Content-Type: application/json" \
  -d '{"comment": "Задача выполнена успешно"}'

# Комментарий с форматированием
curl -X POST http://localhost:3000/jira/tasks/KAN-5/comment \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "*Выполненные работы:*\n- Реализация API\n- Написание тестов\n- Обновление документации\n\n_Задача готова к ревью_"
  }'
```

## Автоматизация рабочих процессов

### 7. Скрипт для мониторинга просроченных задач

```bash
#!/bin/bash

echo "=== Поиск просроченных задач ==="
response=$(curl -s -X POST http://localhost:3000/jira/search \
  -H "Content-Type: application/json" \
  -d '{
    "jql": "duedate < now() AND status != \"Done\"",
    "maxResults": 50
  }')

total=$(echo $response | jq '.total')
echo "Найдено просроченных задач: $total"

if [ $total -gt 0 ]; then
  echo "Список задач:"
  echo $response | jq -r '.issues[] | "- \(.key): \(.fields.summary) (срок: \(.fields.duedate // "не указан"))"'
fi
```

### 8. Скрипт для создания отчёта по команде

```bash
#!/bin/bash

ASSIGNEE="john.doe"

echo "=== Отчёт по исполнителю: $ASSIGNEE ==="

# Задачи в работе
in_progress=$(curl -s -X POST http://localhost:3000/jira/search \
  -H "Content-Type: application/json" \
  -d "{
    \"jql\": \"assignee = \\\"$ASSIGNEE\\\" AND status = \\\"In Progress\\\"\",
    \"maxResults\": 10
  }")

echo "Задач в работе: $(echo $in_progress | jq '.total')"

# Задачи на ревью
in_review=$(curl -s -X POST http://localhost:3000/jira/search \
  -H "Content-Type: application/json" \
  -d "{
    \"jql\": \"assignee = \\\"$ASSIGNEE\\\" AND status = \\\"Review\\\"\",
    \"maxResults\": 10
  }")

echo "Задач на ревью: $(echo $in_review | jq '.total')"

# Выполненные за неделю
completed=$(curl -s -X POST http://localhost:3000/jira/search \
  -H "Content-Type: application/json" \
  -d "{
    \"jql\": \"assignee = \\\"$ASSIGNEE\\\" AND status = \\\"Done\\\" AND resolved >= \\\"-1w\\\"\",
    \"maxResults\": 20
  }")

echo "Выполнено за неделю: $(echo $completed | jq '.total')"
```

### 9. Скрипт для автоматического перемещения задач

```bash
#!/bin/bash

# Переместить все задачи из Questions в backlog если они старше 3 дней
questions_tasks=$(curl -s -X POST http://localhost:3000/jira/search \
  -H "Content-Type: application/json" \
  -d '{
    "jql": "status = \"Questions\" AND updated <= \"-3d\"",
    "maxResults": 50
  }')

echo $questions_tasks | jq -r '.issues[].key' | while read task_key; do
  echo "Перемещаю задачу $task_key в backlog"

  curl -s -X POST http://localhost:3000/jira/tasks/$task_key/move \
    -H "Content-Type: application/json" \
    -d '{
      "targetStatus": "backlog",
      "comment": "Автоматическое перемещение: вопрос не решён в течение 3 дней"
    }' | jq '.'
done
```

### 10. Пакетное добавление комментариев

```bash
#!/bin/bash

# Добавить комментарий ко всем задачам определённого спринта
sprint_tasks=$(curl -s -X POST http://localhost:3000/jira/search \
  -H "Content-Type: application/json" \
  -d '{
    "jql": "Sprint = \"Sprint 1\" AND status != \"Done\"",
    "maxResults": 100
  }')

echo $sprint_tasks | jq -r '.issues[].key' | while read task_key; do
  echo "Добавляю комментарий к задаче $task_key"

  curl -s -X POST http://localhost:3000/jira/tasks/$task_key/comment \
    -H "Content-Type: application/json" \
    -d '{
      "comment": "Напоминание: до конца спринта осталось 3 дня. Пожалуйста, обновите статус задачи."
    }' > /dev/null
done

echo "Комментарии добавлены ко всем задачам спринта"
```

## Интеграция с другими системами

### 11. Webhook для автоматизации

```javascript
// Пример Node.js webhook handler
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/webhook/jira', async (req, res) => {
  const { issue, changelog } = req.body;

  // Если задача перемещена в Done, добавить комментарий
  if (
    changelog?.items?.some(
      (item) => item.field === 'status' && item.toString === 'Done',
    )
  ) {
    await axios.post(`http://localhost:3000/jira/tasks/${issue.key}/comment`, {
      comment: `🎉 Задача автоматически помечена как выполненная! Время выполнения: ${new Date().toISOString()}`,
    });
  }

  res.status(200).send('OK');
});
```

### 12. Интеграция с CI/CD

```yaml
# GitHub Actions example
name: Update Jira on Deploy
on:
  push:
    branches: [main]

jobs:
  update-jira:
    runs-on: ubuntu-latest
    steps:
      - name: Extract Jira ticket from commit
        id: jira
        run: |
          TICKET=$(echo "${{ github.event.head_commit.message }}" | grep -o '[A-Z]\+-[0-9]\+' | head -1)
          echo "ticket=$TICKET" >> $GITHUB_OUTPUT

      - name: Add deployment comment
        if: steps.jira.outputs.ticket
        run: |
          curl -X POST http://your-server.com/jira/tasks/${{ steps.jira.outputs.ticket }}/comment \
            -H "Content-Type: application/json" \
            -d '{
              "comment": "🚀 Код развёрнут в production\\nCommit: ${{ github.sha }}\\nВремя: ${{ github.event.head_commit.timestamp }}"
            }'
```

## Полезные JQL запросы

### 13. Готовые JQL запросы для аналитики

```bash
# Топ исполнителей по количеству выполненных задач
curl -X POST http://localhost:3000/jira/search \
  -H "Content-Type: application/json" \
  -d '{
    "jql": "status = \"Done\" AND resolved >= \"-1M\" ORDER BY assignee",
    "maxResults": 100
  }'

# Задачи с наибольшим количеством комментариев (активные дискуссии)
curl -X POST http://localhost:3000/jira/search \
  -H "Content-Type: application/json" \
  -d '{
    "jql": "comment >= 5 AND status != \"Done\"",
    "maxResults": 20
  }'

# Задачи без описания
curl -X POST http://localhost:3000/jira/search \
  -H "Content-Type: application/json" \
  -d '{
    "jql": "description is EMPTY AND status != \"Done\"",
    "maxResults": 50
  }'

# Старые задачи (более месяца без обновлений)
curl -X POST http://localhost:3000/jira/search \
  -H "Content-Type: application/json" \
  -d '{
    "jql": "updated <= \"-1M\" AND status != \"Done\"",
    "maxResults": 30
  }'
```

## Мониторинг и диагностика

### 14. Скрипт для проверки здоровья системы

```bash
#!/bin/bash

echo "=== Проверка Jira API ==="

# Проверка подключения
health=$(curl -s http://localhost:3000/jira/health)
status=$(echo $health | jq -r '.status')

if [ "$status" = "healthy" ]; then
  echo "✅ Подключение к Jira: OK"
else
  echo "❌ Подключение к Jira: FAILED"
  exit 1
fi

# Проверка доступности основных эндпойнтов
echo "🔍 Проверка эндпойнтов..."

# Тестовый поиск
search_result=$(curl -s -X POST http://localhost:3000/jira/search \
  -H "Content-Type: application/json" \
  -d '{"jql": "project IS NOT EMPTY", "maxResults": 1}')

if echo $search_result | jq -e '.issues' > /dev/null; then
  echo "✅ Поиск задач: OK"
else
  echo "❌ Поиск задач: FAILED"
fi

# Проверка получения колонок
columns=("New" "backlog" "In Progress" "Done")
for column in "${columns[@]}"; do
  result=$(curl -s "http://localhost:3000/jira/columns/${column}/tasks?maxResults=1")
  if echo $result | jq -e '.tasks' > /dev/null; then
    echo "✅ Колонка $column: OK"
  else
    echo "❌ Колонка $column: FAILED"
  fi
done

echo "=== Проверка завершена ==="
```

## Оптимизация производительности

### 15. Пакетные операции

```bash
#!/bin/bash

# Пакетное получение информации о задачах
task_keys=("KAN-1" "KAN-2" "KAN-3" "KAN-4" "KAN-5")

# Параллельное выполнение запросов
for key in "${task_keys[@]}"; do
  (
    echo "Получаю информацию о $key..."
    curl -s http://localhost:3000/jira/tasks/$key | jq '{key: .key, status: .fields.status.name, assignee: .fields.assignee.displayName}'
  ) &
done

wait # Ждём завершения всех фоновых процессов
echo "Все задачи обработаны"
```

Эти примеры демонстрируют различные способы использования Jira API для автоматизации, мониторинга и интеграции с другими системами.
