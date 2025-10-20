# 🤖 AI-Agent - Интеллектуальные агенты

## 📋 Содержание

- [Обзор](#обзор)
- [Эндпойнты](#эндпойнты)
  - [create-agent](#create-agent) - Создание нового AI-агента с настройками
  - [get-all-agents](#get-all-agents) - Список всех агентов с пагинацией
  - [get-agent-by-id](#get-agent-by-id) - Детальная информация об агенте
  - [get-agents-by-board-type](#get-agents-by-board-type) - Агенты по типу доски (Jira, Trello и т.д.)
  - [configure-agent](#configure-agent) - Настройка и обновление конфигурации
  - [get-available-models](#get-available-models) - Список доступных AI моделей
  - [execute-agent-action](#execute-agent-action) - Выполнение действия агента
  - [get-agent-activity](#get-agent-activity) - История активности агента
  - [configure-column-instructions](#configure-column-instructions) - Настройка инструкций для колонок
  - [agent-learning](#agent-learning) - Обучение и метрики агента
  - [agent-role](#agent-role) - Управление ролями (аналитик, ревьюер и т.д.)
  - [intelligent-agent](#intelligent-agent) - Расширенные возможности агента
  - [kanban-knowledge-base](#kanban-knowledge-base) - База знаний о Kanban
  - [instruction-executor](#instruction-executor) - Сервис выполнения инструкций
  - [Flow Execution](#flow-execution) - Управление выполнением flow (пауза, отмена, возобновление)

---

## 🎯 Обзор

**Назначение:** Управление интеллектуальными AI-агентами для автоматизации работы с задачами, досками и процессами.

**Основные возможности:**

- ✅ Создание и настройка AI-агентов
- ✅ Выполнение автоматических действий
- ✅ Обучение на основе истории
- ✅ Управление ролями агентов
- ✅ Интеграция с Kanban-досками
- ✅ Flow execution (паузы, отмены, возобновление)

**Сущности:**

- `Agent` - основная сущность агента
- `AgentInstruction` - инструкции для агентов
- `TaskHistory` - история выполнения задач
- `BoardIntegration` - интеграции с досками

---

## 📌 Эндпойнты

### create-agent

**HTTP:** `POST /ai-agent`

**Назначение:** Создание нового AI-агента с настройками и инструкциями.

**Входные данные (DTO):**

```typescript
{
  name: string;                    // Имя агента
  description?: string;            // Описание
  instructions: string;            // Базовые инструкции
  model?: string;                  // AI модель (по умолчанию: claude-3-haiku)
  temperature?: number;            // Температура (0-1, по умолчанию: 0.3)
  maxTokens?: number;             // Макс. токенов (по умолчанию: 4000)
  isActive?: boolean;             // Активен ли (по умолчанию: true)
  userId?: string;                // ID создателя
  triggerColumnId?: string;       // ID колонки-триггера
  triggerColumnName?: string;     // Название колонки
  triggerEvent?: string;          // Событие (on_enter, on_exit, on_update)
}
```

**Выходные данные:**

```typescript
{
  success: boolean;
  agentId: string; // UUID созданного агента
  name: string;
  message: string;
  agent: {
    id: string;
    name: string;
    description: string;
    instructions: string;
    model: string;
    temperature: number;
    maxTokens: number;
    isActive: boolean;
    createdAt: Date;
  }
}
```

**🔗 Связи и зависимости:**

**📤 Исходящие связи (что использует):**

**Эндпоинты:**

- `database-management/store-agent-config` - сохранение конфигурации
- `cache-management/cache-agent-configs` - кэширование настроек

**Сущности:**

- `Agent` (create) - создание новой записи агента
- `AgentInstruction` (create) - добавление базовой инструкции

**Сервисы:**

- `ConfigService` - получение дефолтных настроек (model, temperature, maxTokens)
- `AgentRepository` - работа с БД
- `AgentInstructionRepository` - сохранение инструкций

**📥 Входящие связи (кто использует):**

- `flow-management/create-flow` - создание агента для флоу
- `ai-agent/get-all-agents` - получение созданных агентов
- Frontend: страница создания агентов

**🔄 Связанные процессы:**

1. Валидация входных данных
2. Создание записи в таблице `agents`
3. Создание базовой инструкции в `agent_instructions`
4. Кэширование конфигурации
5. Возврат данных созданного агента

**Примеры использования:**

```bash
# Создать простого агента
curl -X POST http://localhost:3000/ai-agent \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Task Analyzer",
    "description": "Анализирует задачи и добавляет комментарии",
    "instructions": "Анализируй описание задачи и добавляй рекомендации",
    "model": "claude-3-haiku-20240307",
    "temperature": 0.3
  }'

# Создать агента с триггером на колонку
curl -X POST http://localhost:3000/ai-agent \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Code Reviewer",
    "instructions": "Проверяй код в задаче на ошибки",
    "triggerColumnId": "col-review",
    "triggerColumnName": "Code Review",
    "triggerEvent": "on_enter"
  }'
```

---

### get-all-agents

**HTTP:** `GET /ai-agent`

**Назначение:** Получить список всех AI-агентов с пагинацией и фильтрацией.

**Query параметры:**

```typescript
{
  page?: number;        // Номер страницы (по умолчанию: 1)
  limit?: number;       // Кол-во на странице (по умолчанию: 10)
  status?: string;      // Фильтр по статусу (active, inactive, paused)
  boardType?: string;   // Фильтр по типу доски
}
```

**Выходные данные:**

```typescript
{
  agents: Agent[];      // Массив агентов
  total: number;        // Всего агентов
  page: number;         // Текущая страница
  limit: number;        // Лимит на странице
  totalPages: number;   // Всего страниц
}
```

**🔗 Связи и зависимости:**

**📤 Исходящие связи:**

- `AgentRepository.findAndCount()` - получение списка с пагинацией
- `cache-management/get-cached-context` - кэширование результатов

**📥 Входящие связи:**

- Frontend: страница списка агентов
- `ai-reporting/generate-report` - список агентов для отчета
- `flow-management/list-flows` - доступные агенты для flow

**🔄 Связанные процессы:**

1. Парсинг query параметров
2. Формирование фильтров
3. Запрос к БД с пагинацией
4. Кэширование результата (TTL: 5 минут)
5. Возврат отформатированных данных

---

### get-agent-by-id

**HTTP:** `GET /ai-agent/:id`

**Назначение:** Получить детальную информацию об агенте по его ID.

**Path параметры:**

```typescript
{
  id: string; // UUID агента
}
```

**Выходные данные:**

```typescript
{
  id: string;
  name: string;
  description: string;
  status: string;
  config: {
    instructions: string;
    model: string;
    temperature: number;
    maxTokens: number;
    isActive: boolean;
  };
  boardType?: string;
  boardConfig?: object;
  contextSources?: object;
  notificationSettings?: object;
  instructions: AgentInstruction[];  // Связанные инструкции
  taskHistories: TaskHistory[];      // История выполнения
  createdAt: Date;
  updatedAt: Date;
}
```

**🔗 Связи и зависимости:**

**📤 Исходящие связи:**

- `AgentRepository.findOne()` - поиск по ID с relations
- `cache-management/get-cached-context` - кэширование агента

**📥 Входящие связи:**

- Frontend: страница детального просмотра агента
- `ai-agent/configure-agent` - перед настройкой
- `ai-agent/execute-agent-action` - перед выполнением
- `flow-management/execute-flow` - получение конфига агента

**🔄 Связанные процессы:**

1. Валидация UUID
2. Проверка существования агента
3. Загрузка связанных данных (instructions, taskHistories)
4. Кэширование (TTL: 10 минут)
5. Возврат полных данных

---

### get-agents-by-board-type

**HTTP:** `GET /ai-agent/by-board-type/:boardType`

**Назначение:** Получить агентов, настроенных для конкретного типа доски (Jira, Trello, Asana и т.д.).

**Path параметры:**

```typescript
{
  boardType: 'jira' | 'trello' | 'asana' | 'github' | 'local';
}
```

**Выходные данные:**

```typescript
{
  agents: Agent[];
  boardType: string;
  total: number;
}
```

**🔗 Связи и зависимости:**

**📤 Исходящие связи:**

- `AgentRepository.find({ where: { boardType } })` - фильтр по типу
- `board-integrations/get-board-config` - конфигурация доски

**📥 Входящие связи:**

- Frontend: фильтрация агентов по доске
- `jira-integration/*` - агенты для Jira
- `board-integrations/*` - агенты для других досок

**🔄 Связанные процессы:**

1. Валидация типа доски
2. Запрос агентов с фильтром
3. Загрузка конфигураций досок
4. Группировка по статусу
5. Возврат отфильтрованного списка

---

### configure-agent

**HTTP:** `PUT /ai-agent/:agentId/configure`

**Назначение:** Полная настройка или обновление конфигурации агента.

**Path параметры:**

```typescript
{
  agentId: string; // UUID агента
}
```

**Входные данные:**

```typescript
{
  name?: string;
  description?: string;
  config?: {
    instructions?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    isActive?: boolean;
  };
  boardType?: string;
  boardConfig?: object;
  contextSources?: {
    jira?: boolean;
    database?: boolean;
    external?: string[];
  };
  notificationSettings?: {
    email?: boolean;
    telegram?: boolean;
    slack?: boolean;
  };
}
```

**Выходные данные:**

```typescript
{
  success: boolean;
  agent: Agent;
  message: string;
  updatedFields: string[];  // Список обновленных полей
}
```

**🔗 Связи и зависимости:**

**📤 Исходящие связи:**

- `AgentRepository.update()` - обновление данных
- `cache-management/cache-agent-configs` - обновление кэша
- `database-management/store-agent-config` - сохранение конфига
- `notifications/send-email` - уведомление об изменении

**📥 Входящие связи:**

- Frontend: страница настройки агента
- `ai-agent/agent-role` - изменение роли агента
- `flow-management/update-flow` - обновление агента во flow

**🔄 Связанные процессы:**

1. Получение текущего агента
2. Валидация новых настроек
3. Мердж с существующими данными
4. Обновление в БД
5. Инвалидация кэша
6. Отправка уведомления (если настроено)
7. Возврат обновленных данных

---

### get-available-models

**HTTP:** `GET /ai-agent/available-models`

**Назначение:** Получить список доступных AI моделей с их характеристиками.

**Выходные данные:**

```typescript
{
  models: Array<{
    id: string;              // claude-3-haiku-20240307
    name: string;            // Claude 3 Haiku
    provider: string;        // anthropic
    maxTokens: number;       // 4000
    costPerToken: number;    // 0.00025
    capabilities: string[];  // ["text", "code", "analysis"]
    recommended: boolean;    // true для рекомендуемых
  }>;
  default: string;          // ID модели по умолчанию
}
```

**🔗 Связи и зависимости:**

**📤 Исходящие связи:**

- `ConfigService.get('claude.apiKey')` - проверка доступности Claude
- `ConfigService.get('openai.apiKey')` - проверка доступности OpenAI
- External API - проверка доступности моделей

**📥 Входящие связи:**

- Frontend: выбор модели при создании агента
- `ai-agent/create-agent` - валидация выбранной модели
- `ai-agent/configure-agent` - смена модели

**🔄 Связанные процессы:**

1. Чтение конфигурации API ключей
2. Проверка доступности каждого провайдера
3. Формирование списка моделей
4. Расчет стоимости
5. Маркировка рекомендуемых
6. Кэширование списка (TTL: 1 час)

---

### execute-agent-action

**HTTP:** `POST /ai-agent/execute-action`

**Назначение:** Выполнить действие агента (анализ задачи, добавление комментария и т.д.).

**Входные данные:**

```typescript
{
  agentId: string;
  actionType: 'analyze' | 'comment' | 'update' | 'move';
  targetId: string;      // ID задачи/доски
  context?: {
    taskData?: object;
    boardData?: object;
    userInput?: string;
  };
  async?: boolean;       // Асинхронное выполнение (по умолчанию: false)
}
```

**Выходные данные:**

```typescript
{
  success: boolean;
  executionId: string;
  result?: {
    action: string;
    output: string;
    changes: object;
  };
  status: 'completed' | 'pending' | 'failed';
  message: string;
}
```

**🔗 Связи и зависимости:**

**📤 Исходящие связи:**

- `ai-agent/get-agent-by-id` - получение агента
- `jira-integration/get-task-correct` - получение задачи
- `context-management/fetch-task-context` - контекст задачи
- `queue-management/create-task-queue` - для async выполнения
- `jira-integration/add-task-comment` - добавление комментария
- AI Provider API (Claude/OpenAI) - выполнение AI действия

**📥 Входящие связи:**

- Frontend: кнопка "Выполнить действие"
- `flow-management/execute-flow` - выполнение в рамках flow
- `jira-integration/jira-webhook-handler-correct` - триггер от webhook
- `ai-agent/instruction-executor` - выполнение инструкции

**🔄 Связанные процессы:**

1. Получение агента и его конфигурации
2. Сбор контекста (задача, доска, история)
3. Формирование промпта для AI
4. Вызов AI модели
5. Парсинг результата
6. Выполнение действия (комментарий/обновление)
7. Сохранение в TaskHistory
8. Возврат результата

---

### get-agent-activity

**HTTP:** `GET /ai-agent/:agentId/activity`

**Назначение:** Получить историю активности агента (все выполненные действия).

**Path параметры:**

```typescript
{
  agentId: string;
}
```

**Query параметры:**

```typescript
{
  from?: Date;       // Дата начала
  to?: Date;         // Дата окончания
  limit?: number;    // Лимит записей
  actionType?: string;  // Фильтр по типу действия
}
```

**Выходные данные:**

```typescript
{
  agentId: string;
  activities: Array<{
    id: string;
    timestamp: Date;
    actionType: string;
    targetId: string;
    result: object;
    status: string;
    duration: number; // мс
  }>;
  total: number;
  statistics: {
    totalActions: number;
    successRate: number;
    averageDuration: number;
  }
}
```

**🔗 Связи и зависимости:**

**📤 Исходящие связи:**

- `TaskHistoryRepository.find()` - история из БД
- `cache-management/get-cached-context` - кэширование

**📥 Входящие связи:**

- Frontend: страница активности агента
- `ai-reporting/generate-report` - для отчетов
- `ai-agent/agent-learning` - для обучения

---

### configure-column-instructions

**HTTP:** `POST /ai-agent/configure-column-instructions`

**Назначение:** Настроить инструкции агента для конкретной колонки доски.

**Входные данные:**

```typescript
{
  agentId: string;
  columnId: string;
  columnName: string;
  instruction: string;
  triggerEvent: 'on_enter' | 'on_exit' | 'on_update';
  conditions?: {
    priority?: string[];
    assignee?: string[];
    labels?: string[];
  };
  actions?: {
    type: 'comment' | 'update' | 'notify';
    template: string;
  };
  isActive?: boolean;
  priority?: number;
}
```

**Выходные данные:**

```typescript
{
  success: boolean;
  instructionId: string;
  message: string;
}
```

**🔗 Связи и зависимости:**

**📤 Исходящие связи:**

- `AgentInstructionRepository.create()` - создание инструкции
- `jira-integration/get-board-columns` - получение колонок доски
- `cache-management/cache-agent-configs` - кэширование

**📥 Входящие связи:**

- Frontend: настройка инструкций по колонкам
- `ai-agent/create-agent` - базовая инструкция
- `flow-management/deploy-to-agent` - конвертация flow

**🔄 Связанные процессы:**

1. Валидация существования агента
2. Проверка колонки на доске
3. Создание записи в agent_instructions
4. Инвалидация кэша агента
5. Возврат ID инструкции

---

### agent-learning

**HTTP:** `GET /ai-agent/:agentId/metrics` (и другие)

**Назначение:** Обучение агента на основе истории выполнения, получение метрик, паттернов и рекомендаций.

**Эндпойнты:**

- `GET /ai-agent/:agentId/metrics` - метрики агента
- `GET /ai-agent/patterns` - выявленные паттерны
- `POST /ai-agent/feedback` - обратная связь
- `GET /ai-agent/:agentId/recommendations` - рекомендации
- `GET /ai-agent/best-practices` - лучшие практики
- `GET /ai-agent/:agentId/predict/:instructionType` - предсказания

**🔗 Связи и зависимости:**

**📤 Исходящие связи:**

- `TaskHistoryRepository` - история для анализа
- `AgentInstructionRepository` - инструкции для оптимизации
- AI Provider - машинное обучение
- `cache-management` - кэширование метрик

**📥 Входящие связи:**

- Frontend: дашборд обучения агента
- `ai-reporting/generate-report` - метрики в отчет
- `ai-agent/configure-agent` - автоматическая оптимизация

---

### agent-role

**HTTP:** `GET /ai-agent/available` (и другие)

**Назначение:** Управление ролями агентов (аналитик, ревьюер, тестировщик и т.д.).

**Эндпойнты:**

- `GET /ai-agent/available` - доступные роли
- `POST /ai-agent/:agentId/configure` - настройка роли
- `GET /ai-agent/:agentId/specialization` - специализация агента
- `POST /ai-agent/determine-optimal` - определить оптимальную роль
- `GET /ai-agent/role/:role/configuration` - конфиг роли
- `GET /ai-agent/statistics` - статистика по ролям
- `POST /ai-agent/team-recommendations` - рекомендации команде
- `POST /ai-agent/:agentId/adapt-role` - адаптация роли

**Доступные роли:**

- `task-analyst` - анализ задач
- `code-reviewer` - ревью кода
- `documentation-writer` - написание документации
- `test-engineer` - тестирование
- `project-manager` - управление проектом
- `bug-hunter` - поиск багов
- `performance-optimizer` - оптимизация

**🔗 Связи и зависимости:**

**📤 Исходящие связи:**

- `ai-agent/configure-agent` - применение роли
- `context-management` - контекст для роли
- AI Provider - генерация инструкций по роли

**📥 Входящие связи:**

- Frontend: выбор роли агента
- `ai-agent/create-agent` - создание с ролью
- `flow-management` - агенты с определенными ролями

---

### Flow Execution

**Эндпойнты для управления выполнением flow:**

#### get-flow-execution-status

**HTTP:** `GET /ai-agent/flow-execution/:executionId/status`
**Назначение:** Получить статус выполнения flow

#### cancel-flow-execution

**HTTP:** `POST /ai-agent/flow-execution/:executionId/cancel`
**Назначение:** Отменить выполнение flow

#### pause-flow-execution

**HTTP:** `POST /ai-agent/flow-execution/:executionId/pause`
**Назначение:** Поставить выполнение flow на паузу

#### resume-flow-execution

**HTTP:** `POST /ai-agent/flow-execution/:executionId/resume`
**Назначение:** Возобновить выполнение flow

**🔗 Связи и зависимости:**

**📤 Исходящие связи:**

- `flow-management/execute-flow` - выполнение flow
- `queue-management` - управление очередью
- `cache-management` - кэширование статуса

**📥 Входящие связи:**

- Frontend: управление flow
- `flow-management/*` - внутренние вызовы

---

### intelligent-agent

**Назначение:** Расширенные возможности интеллектуальных агентов с продвинутой логикой.

**Возможности:**

- Контекстное понимание задач
- Адаптивное поведение
- Мультизадачность
- Приоритизация действий

---

### kanban-knowledge-base

**Назначение:** База знаний агента о структуре Kanban-досок, правилах и процессах.

**Возможности:**

- Понимание структуры досок
- Знание правил перемещения
- Понимание workflow
- Контекст проекта

---

### instruction-executor

**Назначение:** Сервис для выполнения инструкций агентов.

**Возможности:**

- Парсинг инструкций
- Выполнение действий
- Обработка ошибок
- Логирование результатов

---

## 📊 Сводка по блоку

**Всего эндпойнтов:** 18+  
**HTTP методы:**

- GET: 12
- POST: 9
- PUT: 1

**Основные сущности:**

- Agent
- AgentInstruction
- TaskHistory
- BoardIntegration

**Ключевые зависимости:**

- database-management
- cache-management
- jira-integration
- context-management
- queue-management
- flow-management

**AI провайдеры:**

- Anthropic Claude
- OpenAI GPT
- Другие (расширяемо)

---

**Последнее обновление:** 20 октября 2025
