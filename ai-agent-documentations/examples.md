# Примеры использования AI Agent API

## Базовые сценарии

### 1. Запуск полного AI workflow

```bash
# Простой запуск без параметров
curl -X POST http://localhost:3000/ai-agent/run-auto-workflow

# С детальным выводом
curl -X POST http://localhost:3000/ai-agent/run-auto-workflow | jq '.'
```

### 2. Анализ новых задач

```bash
# Анализ всех задач в колонке New
curl -X POST http://localhost:3000/ai-agent/analyze-new-tasks

# Получение статистики
curl -X POST http://localhost:3000/ai-agent/analyze-new-tasks | jq '.summary'
```

### 3. Проверка задач в разработке

```bash
# Проверка задач в In Progress
curl -X POST http://localhost:3000/ai-agent/check-progress-tasks

# Фильтрация только перемещённых задач
curl -X POST http://localhost:3000/ai-agent/check-progress-tasks | jq '.results[] | select(.moved == true)'
```

## Работа с сущностями

### 4. Проверка существования entity

```bash
# Проверить сущность User
curl -X POST http://localhost:3000/ai-agent/check-entity-exists \
  -H "Content-Type: application/json" \
  -d '{"entityName": "User"}'

# Проверить несколько сущностей
entities=("User" "Order" "Product" "Category")
for entity in "${entities[@]}"; do
  echo "Проверяю $entity:"
  curl -s -X POST http://localhost:3000/ai-agent/check-entity-exists \
    -H "Content-Type: application/json" \
    -d "{\"entityName\": \"$entity\"}" | jq '.exists'
done
```

### 5. Автоматическое выполнение задач

```bash
# Выполнение задач с генерацией кода
curl -X POST http://localhost:3000/ai-agent/execute-tasks

# Получение списка созданных файлов
curl -X POST http://localhost:3000/ai-agent/execute-tasks | jq '.results[].filesCreated[]'
```

## Парикмахерская специализация

### 6. Анализ задач о стрижках

```bash
# Базовый анализ
curl -X POST http://localhost:3000/ai-agent/analyze-haircut-tasks

# С настройками
curl -X POST http://localhost:3000/ai-agent/analyze-haircut-tasks \
  -H "Content-Type: application/json" \
  -d '{
    "includeImages": true,
    "commentTemplate": "Пожалуйста, добавьте фото желаемой стрижки",
    "strictMode": false
  }'

# Получение статистики по типам стрижек
curl -X POST http://localhost:3000/ai-agent/analyze-haircut-tasks | jq '.statistics'
```

### 7. Выполнение парикмахерских задач

```bash
# Выполнение для senior мастера
curl -X POST http://localhost:3000/ai-agent/execute-haircut-tasks \
  -H "Content-Type: application/json" \
  -d '{
    "masterLevel": "senior",
    "includeTimeEstimation": true,
    "generateInstructions": true,
    "createPricing": true
  }'

# Получение инструкций для мастера
curl -X POST http://localhost:3000/ai-agent/execute-haircut-tasks | jq '.results[].masterInstructions'
```

### 8. Мониторинг парикмахерских задач

```bash
# Запуск мониторинга
curl -X POST http://localhost:3000/ai-agent/auto-haircut-monitor/start \
  -H "Content-Type: application/json" \
  -d '{
    "checkIntervalSeconds": 30,
    "enableSmartScheduling": true,
    "workingHoursOnly": true
  }'

# Проверка статуса
curl -X GET http://localhost:3000/ai-agent/auto-haircut-monitor/status

# Остановка мониторинга
curl -X POST http://localhost:3000/ai-agent/auto-haircut-monitor/stop
```

## Автоматизация рабочих процессов

### 9. Ежедневный AI workflow

```bash
#!/bin/bash

echo "=== Ежедневный AI Workflow $(date) ==="

# Шаг 1: Анализ новых задач
echo "📝 Анализируем новые задачи..."
new_tasks_result=$(curl -s -X POST http://localhost:3000/ai-agent/analyze-new-tasks)
new_analyzed=$(echo $new_tasks_result | jq '.tasksAnalyzed')
new_moved=$(echo $new_tasks_result | jq '.tasksMoved')
echo "   Проанализировано: $new_analyzed, Перемещено: $new_moved"

# Шаг 2: Проверка задач в работе
echo "🔍 Проверяем задачи в работе..."
progress_result=$(curl -s -X POST http://localhost:3000/ai-agent/check-progress-tasks)
progress_checked=$(echo $progress_result | jq '.tasksChecked')
progress_moved=$(echo $progress_result | jq '.tasksMoved')
echo "   Проверено: $progress_checked, Перемещено: $progress_moved"

# Шаг 3: Выполнение готовых задач
echo "⚡ Выполняем автоматические задачи..."
execute_result=$(curl -s -X POST http://localhost:3000/ai-agent/execute-tasks)
executed=$(echo $execute_result | jq '.tasksExecuted')
successful=$(echo $execute_result | jq '.successfulExecutions')
echo "   Выполнено: $executed, Успешно: $successful"

# Шаг 4: Специализированный анализ стрижек
echo "✂️  Анализируем задачи о стрижках..."
haircut_result=$(curl -s -X POST http://localhost:3000/ai-agent/analyze-haircut-tasks)
haircut_found=$(echo $haircut_result | jq '.haircutTasksFound')
echo "   Найдено задач о стрижках: $haircut_found"

echo "=== Workflow завершён ==="
```

### 10. Мониторинг эффективности AI

```bash
#!/bin/bash

echo "=== Анализ эффективности AI ==="

# Запуск полного workflow с замером времени
start_time=$(date +%s)
workflow_result=$(curl -s -X POST http://localhost:3000/ai-agent/run-auto-workflow)
end_time=$(date +%s)
duration=$((end_time - start_time))

# Извлечение метрик
total_processed=$(echo $workflow_result | jq '.summary.totalTasksProcessed')
total_moved=$(echo $workflow_result | jq '.summary.totalTasksMoved')
efficiency=$(echo $workflow_result | jq '.summary.efficiencyScore')

echo "Время выполнения: ${duration}s"
echo "Обработано задач: $total_processed"
echo "Перемещено задач: $total_moved"
echo "Эффективность: $(echo "$efficiency * 100" | bc)%"

# Проверка производительности
if (( $(echo "$efficiency > 0.8" | bc -l) )); then
  echo "✅ AI работает эффективно"
else
  echo "⚠️  Требуется проверка AI настроек"
fi
```

## Интеграция с системами

### 11. Slack интеграция

```bash
#!/bin/bash

# Функция отправки в Slack
send_to_slack() {
  local message="$1"
  local webhook="$SLACK_WEBHOOK_URL"

  curl -X POST -H 'Content-type: application/json' \
    --data "{\"text\":\"$message\"}" \
    "$webhook"
}

# Запуск AI workflow с уведомлением
echo "🤖 Запускаю AI workflow..."
result=$(curl -s -X POST http://localhost:3000/ai-agent/run-auto-workflow)

# Формирование отчёта
processed=$(echo $result | jq '.summary.totalTasksProcessed')
moved=$(echo $result | jq '.summary.totalTasksMoved')
efficiency=$(echo $result | jq '.summary.efficiencyScore')

message="🤖 AI Workflow завершён!
📊 Обработано: $processed задач
✅ Перемещено: $moved задач
📈 Эффективность: $(echo "$efficiency * 100" | bc -l)%"

send_to_slack "$message"
```

### 12. GitHub Actions интеграция

```yaml
# .github/workflows/ai-workflow.yml
name: AI Workflow
on:
  schedule:
    - cron: '0 */2 * * *' # Каждые 2 часа
  workflow_dispatch:

jobs:
  ai-workflow:
    runs-on: ubuntu-latest
    steps:
      - name: Run AI Analysis
        run: |
          response=$(curl -s -X POST ${{ secrets.AI_ENDPOINT }}/ai-agent/run-auto-workflow)
          echo "AI_RESPONSE=$response" >> $GITHUB_ENV

      - name: Check Results
        run: |
          efficiency=$(echo "$AI_RESPONSE" | jq '.summary.efficiencyScore')
          if (( $(echo "$efficiency < 0.5" | bc -l) )); then
            echo "Low AI efficiency detected: $efficiency"
            exit 1
          fi

      - name: Notify on Failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: failure
          text: 'AI Workflow failed - требуется проверка'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### 13. Webhook интеграция

```javascript
// Express.js webhook handler
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Webhook для новых задач Jira
app.post('/webhook/jira-task-created', async (req, res) => {
  const { issue } = req.body;

  // Если создана задача в колонке New, запустить анализ
  if (issue.fields.status.name === 'New') {
    console.log(`Новая задача создана: ${issue.key}`);

    // Небольшая задержка для обработки в Jira
    setTimeout(async () => {
      try {
        await axios.post('http://localhost:3000/ai-agent/analyze-new-tasks');
        console.log('AI анализ запущен для новой задачи');
      } catch (error) {
        console.error('Ошибка запуска AI анализа:', error.message);
      }
    }, 5000);
  }

  res.status(200).send('OK');
});

// Webhook для задач о стрижках
app.post('/webhook/haircut-task', async (req, res) => {
  const { issue } = req.body;

  // Проверяем ключевые слова в названии
  const haircutKeywords = ['стрижка', 'haircut', 'окрашивание', 'укладка'];
  const hasHaircutKeywords = haircutKeywords.some((keyword) =>
    issue.fields.summary.toLowerCase().includes(keyword),
  );

  if (hasHaircutKeywords && issue.fields.status.name === 'New') {
    console.log(`Задача о стрижке: ${issue.key}`);

    setTimeout(async () => {
      try {
        await axios.post(
          'http://localhost:3000/ai-agent/analyze-haircut-tasks',
        );
        console.log('Анализ стрижек запущен');
      } catch (error) {
        console.error('Ошибка анализа стрижек:', error.message);
      }
    }, 3000);
  }

  res.status(200).send('OK');
});

app.listen(3001, () => {
  console.log('Webhook server running on port 3001');
});
```

## Продвинутые сценарии

### 14. Пакетная обработка с условиями

```bash
#!/bin/bash

# Проверка рабочего времени
current_hour=$(date +%H)
if [ $current_hour -lt 9 ] || [ $current_hour -gt 18 ]; then
  echo "Не рабочее время, пропускаем AI workflow"
  exit 0
fi

# Проверка нагрузки системы
load_avg=$(uptime | awk '{print $10}' | cut -d',' -f1)
if (( $(echo "$load_avg > 2.0" | bc -l) )); then
  echo "Высокая нагрузка системы ($load_avg), откладываем AI workflow"
  exit 0
fi

# Проверка доступности AI сервиса
if ! curl -s --max-time 5 http://localhost:3000/ai-agent/run-auto-workflow > /dev/null; then
  echo "AI сервис недоступен"
  exit 1
fi

# Выполнение с retry механизмом
max_retries=3
retry_count=0

while [ $retry_count -lt $max_retries ]; do
  echo "Попытка $((retry_count + 1)) из $max_retries"

  result=$(curl -s -w "%{http_code}" -X POST http://localhost:3000/ai-agent/run-auto-workflow)
  http_code="${result: -3}"
  response_body="${result%???}"

  if [ "$http_code" -eq 200 ]; then
    echo "AI workflow выполнен успешно"
    echo "$response_body" | jq '.summary'
    break
  else
    echo "Ошибка HTTP $http_code, повторяем через 30 секунд..."
    retry_count=$((retry_count + 1))
    sleep 30
  fi
done

if [ $retry_count -eq $max_retries ]; then
  echo "Не удалось выполнить AI workflow после $max_retries попыток"
  exit 1
fi
```

### 15. Анализ и оптимизация performance

```bash
#!/bin/bash

echo "=== Анализ производительности AI Agent ==="

# Функция измерения времени выполнения
measure_endpoint() {
  local endpoint="$1"
  local data="$2"

  echo "Тестируем $endpoint..."

  start_time=$(date +%s%3N)
  if [ -n "$data" ]; then
    response=$(curl -s -X POST "$endpoint" -H "Content-Type: application/json" -d "$data")
  else
    response=$(curl -s -X POST "$endpoint")
  fi
  end_time=$(date +%s%3N)

  duration=$((end_time - start_time))
  echo "  Время выполнения: ${duration}ms"

  # Проверка на ошибки
  if echo "$response" | jq -e '.error' > /dev/null 2>&1; then
    echo "  ❌ Ошибка: $(echo "$response" | jq -r '.message')"
  else
    echo "  ✅ Успешно"
  fi

  echo "$duration"
}

# Тестирование различных эндпойнтов
base_url="http://localhost:3000/ai-agent"

echo ""
echo "1. Анализ новых задач:"
time_analyze=$(measure_endpoint "$base_url/analyze-new-tasks")

echo ""
echo "2. Проверка прогресса:"
time_progress=$(measure_endpoint "$base_url/check-progress-tasks")

echo ""
echo "3. Проверка сущности:"
time_entity=$(measure_endpoint "$base_url/check-entity-exists" '{"entityName": "User"}')

echo ""
echo "4. Анализ стрижек:"
time_haircut=$(measure_endpoint "$base_url/analyze-haircut-tasks")

echo ""
echo "5. Полный workflow:"
time_workflow=$(measure_endpoint "$base_url/run-auto-workflow")

# Вычисление средних значений
total_time=$((time_analyze + time_progress + time_entity + time_haircut + time_workflow))
avg_time=$((total_time / 5))

echo ""
echo "=== Сводка ==="
echo "Общее время: ${total_time}ms"
echo "Среднее время: ${avg_time}ms"

if [ $avg_time -lt 2000 ]; then
  echo "✅ Производительность отличная (< 2s)"
elif [ $avg_time -lt 5000 ]; then
  echo "⚠️  Производительность приемлемая (< 5s)"
else
  echo "❌ Производительность требует оптимизации (> 5s)"
fi
```

### 16. Автоматическое развертывание с AI валидацией

```bash
#!/bin/bash

echo "=== Развертывание с AI валидацией ==="

# Функция проверки здоровья AI
check_ai_health() {
  local endpoint="$1"

  # Проверка доступности
  if ! curl -s --max-time 10 "$endpoint/run-auto-workflow" > /dev/null; then
    return 1
  fi

  # Проверка качества работы
  result=$(curl -s -X POST "$endpoint/analyze-new-tasks")
  if echo "$result" | jq -e '.error' > /dev/null 2>&1; then
    return 1
  fi

  return 0
}

# Развертывание на staging
echo "🚀 Развертывание на staging..."
# docker deploy to staging...

echo "🔍 Проверка AI на staging..."
if check_ai_health "http://staging.example.com/ai-agent"; then
  echo "✅ AI на staging работает корректно"
else
  echo "❌ Проблемы с AI на staging, останавливаем развертывание"
  exit 1
fi

# Запуск AI тестов
echo "🧪 Запуск AI тестов..."
test_result=$(curl -s -X POST http://staging.example.com/ai-agent/run-auto-workflow)
efficiency=$(echo "$test_result" | jq '.summary.efficiencyScore')

if (( $(echo "$efficiency > 0.7" | bc -l) )); then
  echo "✅ AI тесты пройдены, эффективность: $(echo "$efficiency * 100" | bc)%"
else
  echo "❌ AI тесты не пройдены, эффективность слишком низкая: $(echo "$efficiency * 100" | bc)%"
  exit 1
fi

# Развертывание на production
echo "🚀 Развертывание на production..."
# docker deploy to production...

echo "🔍 Финальная проверка AI на production..."
if check_ai_health "http://api.example.com/ai-agent"; then
  echo "✅ Развертывание завершено успешно"
else
  echo "❌ Проблемы на production, запускаем rollback"
  # rollback commands...
  exit 1
fi
```

Эти примеры демонстрируют различные способы использования AI Agent API для автоматизации, мониторинга, интеграции и развертывания в production среде.
