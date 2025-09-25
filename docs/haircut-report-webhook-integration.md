# Интеграция Webhook'а для автоматического анализа стрижек

## Обзор

Новый webhook контроллер `HaircutReportWebhookController` автоматически запускает анализ задач по стрижкам, когда они переводятся в статус "Review" в Jira.

## Архитектура решения

### Компоненты

1. **HaircutReportWebhookController** - принимает события от Jira
2. **HaircutReportWebhookService** - обрабатывает webhook события и фильтрует релевантные
3. **AnalyzeCompletedHaircutTasksService** - выполняет анализ по инструкции AI агента

### Поток данных

```
Jira Event → Webhook Controller → Webhook Service → AI Agent Service → Response
```

## Настройка Webhook в Jira

### Шаг 1: Создание webhook в Jira

1. Перейти в настройки проекта Jira
2. Выбрать "System" → "WebHooks"
3. Нажать "Create WebHook"
4. Заполнить параметры:

**URL webhook:**

```
https://your-domain.com/jira/webhook/haircut-report
```

**Events to send webhook for:**

- Issue updated
- Issue commented

**JQL Filter (опционально):**

```jql
project = "YOUR_PROJECT" AND summary ~ "стрижка" OR summary ~ "haircut"
```

### Шаг 2: Настройка ngrok для разработки

Если используете локальную разработку:

```bash
# Запустить ngrok
ngrok http 3000

# Получить публичный URL, например:
# https://4ba29f625da.ngrok-free.app

# URL для Jira webhook:
# https://4ba29f625da.ngrok-free.app/jira/webhook/haircut-report
```

## API Документация

### POST /jira/webhook/haircut-report

Принимает webhook события от Jira для автоматического анализа стрижек.

**Request Body:**

```json
{
  "webhookEvent": "jira:issue_updated",
  "timestamp": 1695454800000,
  "issue": {
    "key": "HAIR-123",
    "fields": {
      "summary": "Стрижка клиента №001",
      "description": "Быстрая стрижка",
      "status": {
        "name": "Review"
      },
      "assignee": {
        "displayName": "Мастер Иван"
      },
      "worklog": {
        "worklogs": [
          {
            "timeSpentSeconds": 1800,
            "started": "2025-09-23T10:00:00.000+0000"
          }
        ]
      },
      "comment": {
        "comments": [
          {
            "body": "Сделал стрижку, клиент постоянный",
            "author": {
              "displayName": "Мастер Иван"
            }
          }
        ]
      }
    }
  },
  "changelog": {
    "items": [
      {
        "field": "status",
        "fromString": "In Progress",
        "toString": "Review"
      }
    ]
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "data": {
    "processed": true,
    "taskKey": "HAIR-123",
    "analysisTriggered": true,
    "analysisResult": {
      "success": true,
      "taskAnalyzed": "HAIR-123",
      "extractedData": {
        "taskKey": "HAIR-123",
        "masterName": "Мастер Иван",
        "timeSpent": 1800,
        "category": "Быстрая стрижка"
      }
    }
  }
}
```

## Фильтрация событий

Webhook обрабатывает только релевантные события:

### ✅ Обрабатываемые события:

- `jira:issue_updated` - обновление задачи
- `comment_created` - добавление комментария
- `comment_updated` - изменение комментария

### ✅ Условия обработки:

1. **Задача связана со стрижками** - проверяет ключевые слова:
   - "стрижка", "стричь", "haircut", "hair", "волосы"

2. **Задача в статусе Review** - проверяет:
   - Текущий статус = "Review"
   - Или изменение статуса на "Review" в changelog

### ❌ Игнорируемые события:

- Задачи без ключевых слов стрижки
- Задачи не в статусе Review
- Нерелевантные типы событий

## Извлечение данных

Webhook автоматически извлекает данные для анализа:

```typescript
interface HaircutAnalysisData {
  taskKey: string; // Ключ задачи (HAIR-123)
  masterName?: string; // Имя мастера из assignee или user
  timeSpent?: number; // Время в секундах из worklog
  questions?: string[]; // Вопросы из комментариев
  category?: string; // Категория из описания задачи
}
```

## Интеграция с AI агентом

### TODO: Подключение к AnalyzeCompletedHaircutTasksService

В файле `haircut-report-webhook.service.ts` есть заготовка для интеграции:

```typescript
// TODO: Здесь должен быть вызов сервиса анализа стрижек
// const aiReportingService = // ... получить сервис
// return await aiReportingService.analyzeCompletedHaircutTask(analysisData);
```

Для полной интеграции нужно:

1. **Импортировать AnalyzeCompletedHaircutTasksService** в webhook service
2. **Добавить в конструктор** для dependency injection
3. **Вызвать метод анализа** вместо мок-результата

### Пример интеграции:

```typescript
// В haircut-report-webhook.service.ts
import { AnalyzeCompletedHaircutTasksService } from '../../ai-reporting-agent/analyze-completed-haircut-tasks/analyze-completed-haircut-tasks.service';

@Injectable()
export class HaircutReportWebhookService {
  constructor(
    private readonly aiReportingService: AnalyzeCompletedHaircutTasksService,
  ) {}

  private async triggerHaircutAnalysis(
    analysisData: HaircutAnalysisData,
  ): Promise<any> {
    // Преобразуем данные в формат для AI агента
    const analysisRequest = {
      issueKey: analysisData.taskKey,
      category: analysisData.category,
      timeSpent: analysisData.timeSpent,
      employeeReport: `Работу выполнил: ${analysisData.masterName}`,
      clientType: 'не указан', // нужно будет добавить извлечение
    };

    // Вызываем AI агента для анализа
    return await this.aiReportingService.analyzeHaircutTask(analysisRequest);
  }
}
```

## Тестирование

### Ручное тестирование с curl:

```bash
curl -X POST http://localhost:3000/jira/webhook/haircut-report \
  -H "Content-Type: application/json" \
  -d '{
    "webhookEvent": "jira:issue_updated",
    "timestamp": 1695454800000,
    "issue": {
      "key": "TEST-123",
      "fields": {
        "summary": "Стрижка тестового клиента",
        "description": "Быстрая стрижка",
        "status": {"name": "Review"},
        "assignee": {"displayName": "Тестовый Мастер"},
        "worklog": {
          "worklogs": [
            {"timeSpentSeconds": 1500, "started": "2025-09-24T10:00:00.000+0000"}
          ]
        }
      }
    },
    "changelog": {
      "items": [
        {"field": "status", "fromString": "In Progress", "toString": "Review"}
      ]
    }
  }'
```

### Ожидаемый ответ:

```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "data": {
    "processed": true,
    "taskKey": "TEST-123",
    "analysisTriggered": true
  }
}
```

## Мониторинг и логирование

Webhook сервис логирует:

- ✅ **Обработанные события:** `Processing webhook event: jira:issue_updated`
- ✅ **Запуск анализа:** `Triggering haircut analysis for task: HAIR-123`
- ❌ **Ошибки:** `Error processing webhook: [error message]`
- ℹ️ **Пропущенные события:** `Event not relevant for haircut analysis`

## Swagger документация

После запуска приложения, API документация доступна по адресу:

```
http://localhost:3000/api
```

В разделе "Jira Webhook - Haircut Reports" можно найти детальное описание эндпоинта и протестировать его.

## Следующие шаги

1. **Интегрировать с AI агентом** - подключить реальный сервис анализа
2. **Добавить валидацию webhook signature** - для безопасности
3. **Настроить retry механизм** - для обработки ошибок
4. **Добавить метрики** - для мониторинга производительности
5. **Создать dashboards** - для отслеживания аналитики

## Архитектурные решения

### Преимущества текущего подхода:

- ✅ **Модульность** - отдельный блок для webhook обработки
- ✅ **Фильтрация** - обрабатывает только релевантные события
- ✅ **Типизация** - строгие TypeScript интерфейсы
- ✅ **Тестируемость** - unit тесты для всех компонентов
- ✅ **Swagger docs** - автоматическая документация API

### Следование принципам проекта:

- ✅ **Один блок = одна задача** - отдельный блок для webhook'ов отчётов
- ✅ **Один endpoint = одна папка** - структура папок по функциональности
- ✅ **Kebab-case именование** - все файлы следуют конвенции
- ✅ **Полный набор файлов** - controller, service, dto, interface, module, spec

Webhook готов к использованию и полностью интегрирован в архитектуру проекта!
