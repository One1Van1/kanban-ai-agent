# Auto Haircut Monitor API

## Описание

Эндпойнт для автоматического мониторинга задач о парикмахерских услугах.

## Endpoints

### Запуск мониторинга

```
POST /ai-agent/auto-haircut-monitor/start
```

### Остановка мониторинга

```
POST /ai-agent/auto-haircut-monitor/stop
```

### Статус мониторинга

```
GET /ai-agent/auto-haircut-monitor/status
```

### Обновление настроек

```
PATCH /ai-agent/auto-haircut-monitor/settings
```

## Описание функциональности

Автоматический мониторинг колонки "New" для задач о парикмахерских услугах:

- **Периодическая проверка** новых задач о стрижках
- **Автоматический анализ** и перемещение задач
- **Умное планирование** интервалов проверки
- **Резервный cron** для восстановления мониторинга
- **Адаптивные настройки** в зависимости от загрузки

## Запуск мониторинга

### Request Body

```json
{
  "checkIntervalSeconds": 30,
  "enableSmartScheduling": true,
  "workingHoursOnly": true,
  "notifyOnResults": true
}
```

| Поле                  | Тип     | Обязательный | Описание                     | По умолчанию |
| --------------------- | ------- | ------------ | ---------------------------- | ------------ |
| checkIntervalSeconds  | number  | Нет          | Интервал проверки в секундах | 30           |
| enableSmartScheduling | boolean | Нет          | Адаптивное планирование      | true         |
| workingHoursOnly      | boolean | Нет          | Только в рабочие часы        | true         |
| notifyOnResults       | boolean | Нет          | Уведомления о результатах    | true         |

### Пример запроса

```bash
curl -X POST http://localhost:3000/ai-agent/auto-haircut-monitor/start \
  -H "Content-Type: application/json" \
  -d '{
    "checkIntervalSeconds": 45,
    "enableSmartScheduling": true,
    "workingHoursOnly": true,
    "notifyOnResults": true
  }'
```

### Ответ при запуске (200)

```json
{
  "monitoringStarted": true,
  "message": "Auto haircut monitoring started successfully",
  "config": {
    "checkIntervalSeconds": 45,
    "enableSmartScheduling": true,
    "workingHoursOnly": true,
    "notifyOnResults": true,
    "nextCheckTime": "2025-09-23T15:05:00.000Z"
  },
  "timestamp": "2025-09-23T15:04:15.000Z",
  "monitorId": "haircut-monitor-001"
}
```

## Получение статуса

### Пример запроса

```bash
curl -X GET http://localhost:3000/ai-agent/auto-haircut-monitor/status
```

### Ответ статуса (200)

```json
{
  "isRunning": true,
  "uptime": 3600,
  "lastCheckTime": "2025-09-23T15:03:00.000Z",
  "nextCheckTime": "2025-09-23T15:05:00.000Z",
  "checksPerformed": 120,
  "tasksProcessed": 15,
  "config": {
    "checkIntervalSeconds": 45,
    "enableSmartScheduling": true,
    "workingHoursOnly": true,
    "notifyOnResults": true
  },
  "statistics": {
    "totalHaircutTasks": 15,
    "movedToProgress": 8,
    "movedToQuestions": 7,
    "averageProcessingTime": 1200,
    "successRate": 0.93
  },
  "performance": {
    "averageCheckDuration": 250,
    "peakMemoryUsage": "45MB",
    "cpuUsageAverage": "2.3%"
  },
  "errors": {
    "lastError": null,
    "errorCount": 0,
    "lastErrorTime": null
  }
}
```

## Остановка мониторинга

### Пример запроса

```bash
curl -X POST http://localhost:3000/ai-agent/auto-haircut-monitor/stop
```

### Ответ при остановке (200)

```json
{
  "monitoringStopped": true,
  "message": "Auto haircut monitoring stopped successfully",
  "finalStatistics": {
    "totalUptime": 7200,
    "totalChecks": 240,
    "totalTasksProcessed": 28,
    "successfulMoves": 26,
    "averageInterval": 30
  },
  "timestamp": "2025-09-23T17:04:15.000Z"
}
```

## Обновление настроек

### Request Body

```json
{
  "checkIntervalSeconds": 60,
  "workingHoursOnly": false,
  "notifyOnResults": false
}
```

### Ответ обновления настроек (200)

```json
{
  "settingsUpdated": true,
  "message": "Monitor settings updated successfully",
  "oldConfig": {
    "checkIntervalSeconds": 30,
    "workingHoursOnly": true,
    "notifyOnResults": true
  },
  "newConfig": {
    "checkIntervalSeconds": 60,
    "workingHoursOnly": false,
    "notifyOnResults": false,
    "enableSmartScheduling": true
  },
  "appliedAt": "2025-09-23T15:10:00.000Z"
}
```

## Возможные ошибки

### 409 Conflict - Мониторинг уже запущен

```json
{
  "statusCode": 409,
  "message": "Monitoring is already running",
  "error": "Conflict",
  "currentStatus": {
    "startedAt": "2025-09-23T14:00:00.000Z",
    "uptime": 3600
  }
}
```

### 404 Not Found - Мониторинг не запущен

```json
{
  "statusCode": 404,
  "message": "No active monitoring session found",
  "error": "Not Found"
}
```

### 400 Bad Request - Некорректные настройки

```json
{
  "statusCode": 400,
  "message": "Invalid interval: minimum is 10 seconds",
  "error": "Bad Request"
}
```

## Умное планирование

### Адаптивные интервалы

```javascript
const smartScheduling = {
  highActivity: {
    condition: 'newTasksPerHour > 5',
    interval: 20, // секунд
  },
  normalActivity: {
    condition: 'newTasksPerHour 1-5',
    interval: 30,
  },
  lowActivity: {
    condition: 'newTasksPerHour < 1',
    interval: 60,
  },
  noActivity: {
    condition: 'noNewTasksFor > 120min',
    interval: 300,
  },
};
```

### Рабочие часы

```javascript
const workingHours = {
  monday: { start: '09:00', end: '21:00' },
  tuesday: { start: '09:00', end: '21:00' },
  wednesday: { start: '09:00', end: '21:00' },
  thursday: { start: '09:00', end: '21:00' },
  friday: { start: '09:00', end: '21:00' },
  saturday: { start: '10:00', end: '20:00' },
  sunday: { start: '11:00', end: '19:00' },
};
```

### Праздничные дни

- Автоматическое определение праздников
- Специальное расписание для праздников
- Уменьшенные интервалы в предпраздничные дни
- Отключение в нерабочие дни (опционально)

## Система уведомлений

### Slack интеграция

```json
{
  "channel": "#haircut-bookings",
  "message": "🔄 Мониторинг стрижек активен\n📊 Обработано задач: 5\n✅ Перемещено в работу: 3\n❓ Отправлено на уточнение: 2",
  "timestamp": "2025-09-23T15:04:15.000Z"
}
```

### Email отчёты

```html
<h2>Ежедневный отчёт мониторинга стрижек</h2>
<ul>
  <li>Время работы: 8 часов 15 минут</li>
  <li>Обработано задач: 23</li>
  <li>Успешных перемещений: 21 (91%)</li>
  <li>Средний интервал: 32 секунды</li>
  <li>
    Популярные услуги: Женская стрижка (60%), Мужская стрижка (30%), Окрашивание
    (10%)
  </li>
</ul>
```

### Webhook события

```json
{
  "event": "haircut_task_processed",
  "data": {
    "taskKey": "KAN-35",
    "action": "moved_to_progress",
    "serviceType": "мужская стрижка",
    "processingTime": 1150,
    "confidence": 0.89
  },
  "timestamp": "2025-09-23T15:04:15.000Z"
}
```

## Мониторинг производительности

### Метрики системы

```javascript
const performanceMetrics = {
  memory: {
    used: '45MB',
    peak: '67MB',
    limit: '512MB',
  },
  cpu: {
    average: '2.3%',
    peak: '8.7%',
    cores: 4,
  },
  network: {
    requestsPerMinute: 12,
    averageResponseTime: '250ms',
    errors: 0,
  },
};
```

### Автоматическая диагностика

- Проверка доступности Jira API
- Валидация AI сервиса
- Мониторинг памяти и CPU
- Обнаружение зависших процессов

### Circuit Breaker

```javascript
const circuitBreaker = {
  errorThreshold: 5, // ошибок подряд
  timeout: 30000, // 30 секунд
  resetTimeout: 300000, // 5 минут
  fallbackAction: 'notify_admin',
};
```

## Резервирование и восстановление

### Автоматический restart

- Восстановление после сбоев
- Сохранение состояния в Redis
- Graceful shutdown при обновлениях
- Health check каждые 60 секунд

### Backup планировщик

```javascript
const backupScheduler = {
  primary: 'every 30 seconds',
  secondary: 'every 5 minutes (cron)',
  emergency: 'manual trigger',
  recovery: 'auto on service start',
};
```

### Логирование и аудит

- Детальные логи всех операций
- Ротация логов каждые 24 часа
- Экспорт статистики в JSON
- Архивирование исторических данных

## Конфигурация

### Переменные окружения

```bash
# Основные настройки
HAIRCUT_MONITOR_ENABLED=true
HAIRCUT_MONITOR_DEFAULT_INTERVAL=30
HAIRCUT_MONITOR_MIN_INTERVAL=10
HAIRCUT_MONITOR_MAX_INTERVAL=3600

# Рабочие часы
HAIRCUT_MONITOR_WORKING_HOURS=09:00-21:00
HAIRCUT_MONITOR_WEEKEND_HOURS=10:00-20:00
HAIRCUT_MONITOR_HOLIDAYS_ENABLED=false

# Уведомления
HAIRCUT_MONITOR_SLACK_WEBHOOK=https://hooks.slack.com/...
HAIRCUT_MONITOR_EMAIL_REPORTS=true
HAIRCUT_MONITOR_WEBHOOK_URL=https://your-app.com/webhooks

# Производительность
HAIRCUT_MONITOR_MEMORY_LIMIT=512MB
HAIRCUT_MONITOR_CPU_LIMIT=50%
HAIRCUT_MONITOR_PARALLEL_CHECKS=false
```

### JSON конфигурация

```json
{
  "monitor": {
    "intervals": {
      "high_activity": 20,
      "normal_activity": 30,
      "low_activity": 60,
      "no_activity": 300
    },
    "workingHours": {
      "enabled": true,
      "timezone": "Europe/Moscow",
      "weekdays": "09:00-21:00",
      "weekends": "10:00-20:00"
    },
    "notifications": {
      "slack": {
        "enabled": true,
        "channel": "#haircut-bookings",
        "frequency": "on_results"
      },
      "email": {
        "enabled": true,
        "recipients": ["manager@salon.com"],
        "frequency": "daily"
      }
    }
  }
}
```

## Безопасность

### Rate limiting

- Максимум 1 запрос в секунду к Jira
- Защита от спама и перегрузки
- Graceful degradation при лимитах

### Права доступа

- Ограниченные права на Jira API
- Только чтение/запись определённых колонок
- Логирование всех API вызовов

### Мониторинг безопасности

- Детекция аномальной активности
- Алерты при подозрительных операциях
- Автоматическая блокировка при угрозах

## Аналитика и BI

### Ежедневные метрики

- Количество обработанных задач
- Точность AI решений
- Время отклика системы
- Загрузка салона

### Еженедельные тренды

- Популярные дни и часы
- Сезонные изменения
- Эффективность мастеров
- Доходность услуг

### Месячные отчёты

- ROI от автоматизации
- Экономия времени персонала
- Улучшение качества сервиса
- Планы развития

## Теги Swagger

- **ai-agent** - Эндпойнты AI агента
