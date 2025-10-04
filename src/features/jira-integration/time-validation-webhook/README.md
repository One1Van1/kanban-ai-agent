# Time Validation Webhook

Автоматическая проверка логирования времени при переходе задач в статус "Review".

## Функциональность

### ✅ Что делает webhook:

1. **Проверяет переходы** - ловит все переходы задач в статус "Review"
2. **Фильтрует стрижки** - обрабатывает только задачи связанные со стрижками
3. **Валидирует время** - проверяет наличие и достаточность logged времени
4. **Автоматический возврат** - возвращает задачи без времени в "In Progress"
5. **AI анализ** - запускает анализ для задач с корректным временем

### 🔄 Workflow:

```
Task: In Progress → Review
         ↓
   Time Validation
         ↓
Has worklog time? ─── NO ──→ Return to "In Progress" + Comment
         │
        YES
         ↓
   Trigger AI Analysis
```

## Настройка

### 1. Конфигурация Jira

В `config/jira.config.ts` должны быть настроены:

```typescript
export default {
  baseUrl: 'https://your-domain.atlassian.net',
  email: 'your-email@domain.com',
  apiToken: 'your-api-token',
};
```

### 2. Webhook URL

Новый endpoint: `POST /jira/webhook/time-validation`

### 3. Настройка в Jira Admin

1. **Jira Settings** → **System** → **Webhooks**
2. **Create Webhook**:
   - Name: `Time Validation Webhook`
   - URL: `https://your-domain.com/jira/webhook/time-validation`
   - Events: `Issue Updated`

## Использование

### Тестирование

```bash
curl -X POST http://localhost:3000/jira/webhook/time-validation \
  -H "Content-Type: application/json" \
  -d '{
    "webhookEvent": "jira:issue_updated",
    "issue": {
      "key": "TEST-001",
      "fields": {
        "summary": "Стрижка клиента",
        "status": {"name": "Review"},
        "assignee": {"displayName": "Мастер Иванов"},
        "worklog": {"worklogs": []}
      }
    },
    "changelog": {
      "items": [
        {"field": "status", "fromString": "In Progress", "toString": "Review"}
      ]
    }
  }'
```

### Ожидаемые результаты

#### ✅ С временем (одобрено):

```json
{
  "validated": true,
  "timeFound": true,
  "totalTimeSeconds": 1800,
  "action": "approved",
  "message": "Time validation passed, AI analysis triggered"
}
```

#### ❌ Без времени (отклонено):

```json
{
  "validated": false,
  "timeFound": false,
  "action": "rejected",
  "message": "Task returned to In Progress - missing time log",
  "nextSteps": [
    "Log work time for the task",
    "Add description of work performed",
    "Transition task to Review again"
  ]
}
```

## Логика валидации

### Минимальные требования:

- **Время**: минимум 5 минут
- **Записи**: хотя бы одна worklog запись
- **Категория**: задача должна содержать ключевые слова стрижек

### Ключевые слова для фильтрации:

- `стрижка`, `стричь`, `haircut`, `hair`, `волосы`

### Действия при отсутствии времени:

1. **Автоматический переход** задачи в "In Progress"
2. **Комментарий** с объяснением и инструкциями
3. **Уведомление** мастеру (логируется)

## Интеграция с AI

После успешной валидации времени webhook автоматически запускает:

- `HaircutReportWebhookService.processWebhook()`
- Полный AI анализ задачи
- Генерацию отчета с рекомендациями

## Мониторинг

### Логи

```bash
yarn start:dev
# Поиск в логах:
grep "Time validation" logs/app.log
```

### Метрики успеха

- `validated: true` - время корректно залогировано
- `action: "approved"` - задача прошла в AI анализ
- `action: "rejected"` - задача возвращена в работу

## Troubleshooting

### Проблема: Задачи не возвращаются автоматически

**Решение**: Проверить настройки Jira API и права доступа

### Проблема: Все задачи пропускаются

**Решение**: Проверить фильтрацию по ключевым словам в summary/description

### Проблема: AI анализ не запускается

**Решение**: Проверить интеграцию с `HaircutReportWebhookService`

## Развитие

### Планируемые улучшения:

- [ ] Email/Slack уведомления мастерам
- [ ] Настраиваемые минимальные требования по времени
- [ ] Dashboard с метриками валидации
- [ ] Интеграция с календарем мастеров
