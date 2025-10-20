# 🛠️ Infrastructure & Services - Вспомогательные блоки

## 📋 Содержание

- [Context-Management](#context-management) - Управление контекстом (6 эндпойнтов)
- [Cache-Management](#cache-management) - Кэширование (3 эндпойнта)
- [Queue-Management](#queue-management) - Очереди задач (4 эндпойнта)
- [Database-Management](#database-management) - Управление БД (2 эндпойнта)
- [Notifications](#notifications) - Уведомления (2 эндпойнта)
- [Photo-Analysis](#photo-analysis) - Анализ изображений (1 эндпойнт)
- [AI-Reporting](#ai-reporting) - AI отчеты (4 эндпойнта)
- [Board-Integrations](#board-integrations) - Интеграции досок (1+ эндпойнт)
- [Flow-Conversion](#flow-conversion) - Конвертация flow (сервисы)

---

## 🧠 Context-Management

**Назначение:** Управление контекстом задач, досок и переменных для AI-агентов.

### Эндпойнты:

#### configure-context-sources

**HTTP:** `POST /context-management/configure`  
**Назначение:** Настроить источники контекста (Jira, БД, внешние API).

**🔗 Связи:**

- 📥 `ai-agent/configure-agent` - настройка источников контекста

---

#### fetch-external-context

**HTTP:** `GET /context-management/external/:source`  
**Назначение:** Получить контекст из внешних источников.

**🔗 Связи:**

- 📤 External APIs
- 📥 `ai-agent/execute-agent-action` - дополнительный контекст

---

#### fetch-related-tasks

**HTTP:** `GET /context-management/related/:taskId`  
**Назначение:** Найти связанные задачи.

**🔗 Связи:**

- 📤 `jira-integration/search-tasks-correct` - поиск
- 📥 `ai-agent/*` - контекст для анализа

---

#### fetch-task-context

**HTTP:** `GET /context-management/task/:taskId`  
**Назначение:** Получить полный контекст задачи (задача + связанные + история).

**🔗 Связи:**

- 📤 `jira-integration/get-task-correct` - данные задачи
- 📤 `TaskHistoryRepository` - история
- 📥 `ai-agent/execute-agent-action` - основной источник контекста

---

#### get-flow-variables

**HTTP:** `GET /context-management/flow/:flowId/variables`  
**Назначение:** Получить переменные flow.

**🔗 Связи:**

- 📥 `flow-management/execute-flow` - во время выполнения

---

#### set-flow-variables

**HTTP:** `POST /context-management/flow/:flowId/variables`  
**Назначение:** Установить переменные flow.

**🔗 Связи:**

- 📥 `flow-management/execute-flow` - сохранение результатов блоков

---

**Сводка:** 6 эндпойнтов  
**Ключевые зависимости:** jira-integration, database-management

---

## 💾 Cache-Management

**Назначение:** Управление кэшированием данных для оптимизации производительности.

### Эндпойнты:

#### cache-agent-configs

**HTTP:** `POST /cache-management/agent-configs`  
**Назначение:** Кэшировать конфигурации агентов.

**Входные данные:**

```typescript
{
  agentId: string;
  config: object;
  ttl?: number;  // TTL в секундах (по умолчанию: 600)
}
```

**🔗 Связи:**

- 📥 `ai-agent/create-agent` - кэширование при создании
- 📥 `ai-agent/configure-agent` - обновление кэша

---

#### cache-context

**HTTP:** `POST /cache-management/context`  
**Назначение:** Кэшировать контекст задач/досок.

**🔗 Связи:**

- 📥 `context-management/*` - кэширование результатов

---

#### get-cached-context

**HTTP:** `GET /cache-management/context/:key`  
**Назначение:** Получить кэшированный контекст.

**🔗 Связи:**

- 📥 Все блоки - чтение из кэша

---

**Сводка:** 3 эндпойнта  
**Технологии:** Redis/In-Memory Cache  
**TTL:** Настраиваемый (по умолчанию: 5-30 минут)

---

## 🔄 Queue-Management

**Назначение:** Управление очередями задач для асинхронной обработки.

### Эндпойнты:

#### create-task-queue

**HTTP:** `POST /queue-management/queue`  
**Назначение:** Создать задачу в очереди для асинхронной обработки.

**Входные данные:**

```typescript
{
  taskType: 'agent-execution' | 'flow-execution' | 'report-generation';
  payload: object;
  priority?: number;
  delay?: number;  // мс задержки
}
```

**🔗 Связи:**

- 📥 `ai-agent/execute-agent-action` - async выполнение
- 📥 `flow-management/execute-flow` - async flow
- 📥 `ai-reporting/generate-report` - async отчеты

---

#### get-queue-status

**HTTP:** `GET /queue-management/queue/:queueName/status`  
**Назначение:** Получить статус очереди.

---

#### get-job-details

**HTTP:** `GET /queue-management/job/:jobId`  
**Назначение:** Получить детали конкретной задачи в очереди.

---

#### process-task-queue

**HTTP:** `POST /queue-management/process`  
**Назначение:** Обработать задачу из очереди (worker endpoint).

**🔗 Связи:**

- 📤 Соответствующие сервисы (agent, flow, reporting)

---

**Сводка:** 4 эндпойнта  
**Технологии:** Bull Queue / BullMQ  
**Очереди:**

- agent-execution-queue
- flow-execution-queue
- report-generation-queue

---

## 🗄️ Database-Management

**Назначение:** Управление базой данных агентов и их конфигурациями.

### Эндпойнты:

#### store-agent-config

**HTTP:** `POST /database-management/agent-config`  
**Назначение:** Сохранить конфигурацию агента в БД.

**🔗 Связи:**

- 📥 `ai-agent/create-agent` - первичное сохранение
- 📥 `ai-agent/configure-agent` - обновление конфига

---

#### user-email-mapping

**HTTP:** `POST /database-management/user-mapping`  
**Назначение:** Маппинг email пользователей для интеграций.

**Входные данные:**

```typescript
{
  jiraAccountId: string;
  email: string;
  displayName: string;
}
```

**🔗 Связи:**

- 📥 `jira-integration/*` - маппинг пользователей
- 📥 `notifications/*` - отправка по email

---

**Сводка:** 2 эндпойнта  
**БД:** PostgreSQL с TypeORM  
**Сущности:** Agent, AgentInstruction, TaskHistory, BoardIntegration, Flow

---

## 🔔 Notifications

**Назначение:** Отправка уведомлений через различные каналы.

### Эндпойнты:

#### send-email

**HTTP:** `POST /notifications/email`  
**Назначение:** Отправить email уведомление.

**Входные данные:**

```typescript
{
  to: string[];
  subject: string;
  body: string;
  html?: string;
  attachments?: Array<{filename: string; content: Buffer}>;
}
```

**🔗 Связи:**

- 📥 `ai-agent/configure-agent` - уведомления об изменениях
- 📥 `jira-webhook-handler-correct` - уведомления о событиях
- 📥 `ai-reporting/generate-report` - отправка отчетов

---

#### send-telegram

**HTTP:** `POST /notifications/telegram`  
**Назначение:** Отправить сообщение в Telegram.

**Входные данные:**

```typescript
{
  chatId: string;
  message: string;
  parseMode?: 'Markdown' | 'HTML';
}
```

**🔗 Связи:**

- 📥 `jira-integration/add-task-comment` - уведомление о комментарии
- 📥 `ai-agent/execute-agent-action` - результаты действий

---

**Сводка:** 2 эндпойнта  
**Каналы:** Email (SMTP), Telegram Bot API  
**Расширяемость:** Slack, Discord, MS Teams

---

## 📸 Photo-Analysis

**Назначение:** Анализ изображений и скриншотов с помощью AI.

### Эндпойнты:

#### analyze-before-after-photos

**HTTP:** `POST /photo-analysis/before-after`  
**Назначение:** Анализ "до" и "после" скриншотов с AI комментариями.

**Входные данные:**

```typescript
{
  taskKey: string;
  userId: string;
  analysisType?: 'ui-changes' | 'visual-regression' | 'general';
}
```

**Выходные данные:**

```typescript
{
  success: boolean;
  analysis: {
    beforeImage: {
      url: string;
      uploadedAt: Date;
    }
    afterImage: {
      url: string;
      uploadedAt: Date;
    }
    differences: Array<{
      type: string;
      description: string;
      severity: 'low' | 'medium' | 'high';
    }>;
    aiComment: string; // Детальный AI анализ
    recommendation: string;
  }
  commentAdded: boolean;
}
```

**🔗 Связи:**

**📤 Исходящие связи:**

- `jira-integration/get-task-files-by-user` - получение скриншотов
- `ai-agent/execute-agent-action` - AI анализ
- `jira-integration/add-task-comment` - добавление результата
- AI Vision API (Claude/GPT-4 Vision) - анализ изображений

**📥 Входящие связи:**

- `jira-webhook-handler-correct` - автоматический анализ при загрузке
- Frontend: кнопка "Analyze Photos"

**🔄 Процесс:**

1. Получение файлов пользователя из задачи
2. Фильтрация изображений (before/after)
3. Скачивание изображений
4. Отправка в AI Vision API
5. Парсинг результатов анализа
6. Генерация комментария
7. Добавление в Jira
8. Возврат результата

---

**Сводка:** 1 основной эндпойнт  
**AI Provider:** Claude 3 / GPT-4 Vision  
**Форматы:** PNG, JPG, JPEG, WebP

---

## 📊 AI-Reporting

**Назначение:** Генерация AI-отчетов и аналитики.

### Эндпойнты:

#### generate-report

**HTTP:** `POST /ai-reporting/generate`  
**Назначение:** Генерация AI-отчета по задачам/агентам.

**Входные данные:**

```typescript
{
  reportType: 'agent-performance' | 'task-analytics' | 'team-productivity';
  dateRange: {
    from: Date;
    to: Date;
  };
  agentIds?: string[];
  format?: 'json' | 'pdf' | 'html';
}
```

**🔗 Связи:**

- 📤 `ai-agent/get-agent-activity` - метрики агентов
- 📤 `jira-integration/search-tasks-correct` - данные задач
- 📤 `TaskHistoryRepository` - история
- 📤 AI Provider - анализ и инсайты
- 📤 `queue-management/create-task-queue` - async генерация
- 📥 Frontend: страница отчетов

---

#### get-report-config

**HTTP:** `GET /ai-reporting/config`  
**Назначение:** Получить конфигурацию отчетов.

---

#### get-report-health

**HTTP:** `GET /ai-reporting/health`  
**Назначение:** Проверка статуса сервиса отчетов.

**🔗 Связи:**

- 📥 Frontend: индикатор статуса
- 📥 Мониторинг

---

#### process-report-task

**HTTP:** `POST /ai-reporting/process`  
**Назначение:** Обработать задачу генерации отчета (worker).

**🔗 Связи:**

- 📤 `queue-management` - получение задачи из очереди
- 📤 `ai-agent/get-agent-activity` - сбор данных
- 📥 `queue-management/process-task-queue` - обработчик очереди

---

**Сводка:** 4 эндпойнта  
**Форматы:** JSON, PDF, HTML  
**Типы отчетов:**

- Agent Performance
- Task Analytics
- Team Productivity
- Custom Reports

---

## 🔌 Board-Integrations

**Назначение:** Управление интеграциями с различными досками (Jira, Trello, Asana и т.д.).

### Основной файл:

- `board-integrations.controller.ts`
- `board-integrations.module.ts`

### Подблоки:

- `create-board-integration` - создание интеграции

**Назначение:** Абстракция над различными системами управления задачами.

**🔗 Связи:**

- 📤 `jira-integration/*` - Jira специфика
- 📥 `ai-agent/*` - работа с разными досками

---

## 🔄 Flow-Conversion

**Назначение:** Сервисы для конвертации визуальных flow в agent instructions.

### Сервисы (не эндпойнты):

#### block-converter.service.ts

**Назначение:** Конвертация отдельных блоков flow в инструкции.

**Методы:**

- `convertAIBlock()` - AI блок → agent instruction
- `convertConditionBlock()` - Условие → условие в instruction
- `convertActionBlock()` - Действие → действие в instruction

---

#### convert-flow-to-agent.service.ts

**Назначение:** Основной сервис конвертации flow → agent.

**Методы:**

- `convertFlowToAgent(flowId)` - полная конвертация
- `analyzeFlowStructure()` - анализ структуры
- `groupBlocksByTrigger()` - группировка по триггерам
- `generateInstructions()` - генерация инструкций

---

#### flow-analyzer.service.ts

**Назначение:** Анализ flow перед конвертацией.

**Методы:**

- `validateFlowStructure()` - валидация
- `detectTriggers()` - определение триггеров
- `findOptimizations()` - оптимизации

---

**🔗 Связи:**

- 📥 `flow-management/deploy-to-agent` - основной вызов
- 📤 `ai-agent/create-agent` - создание результата
- 📤 `ai-agent/configure-column-instructions` - инструкции

---

## 📊 Общая сводка

| Блок                | Эндпойнтов  | Тип            | Ключевая роль      |
| ------------------- | ----------- | -------------- | ------------------ |
| context-management  | 6           | Service        | Контекст для AI    |
| cache-management    | 3           | Infrastructure | Оптимизация        |
| queue-management    | 4           | Infrastructure | Асинхронность      |
| database-management | 2           | Infrastructure | Хранение           |
| notifications       | 2           | Service        | Коммуникация       |
| photo-analysis      | 1           | AI Service     | Анализ изображений |
| ai-reporting        | 4           | AI Service     | Аналитика          |
| board-integrations  | 1+          | Integration    | Универсальность    |
| flow-conversion     | 0 (сервисы) | Service        | Конвертация        |

**Всего:** 23+ эндпойнта + 3 сервиса

---

**Последнее обновление:** 20 октября 2025
