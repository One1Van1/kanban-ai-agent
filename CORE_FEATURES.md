# 🎯 Основные функции проекта AI Kanban Agent

> Документация ключевых возможностей системы с описанием назначения и использования

---

## 📋 Содержание

1. [Создание и управление AI агентами](#создание-и-управление-ai-агентами)
2. [Visual Flow Builder](#visual-flow-builder)
3. [Интеграция с досками](#интеграция-с-досками)
4. [AI аналитика и отчеты](#ai-аналитика-и-отчеты)
5. [Система обучения агентов](#система-обучения-агентов)

---

## Создание и управление AI агентами

### Три способа создания агента

#### 1.1 Ручное создание через UI форму

**Эндпоинт:** `POST /ai-agent`

**Назначение:** Быстрое создание простого агента через пользовательский интерфейс

**Когда использовать:**

- ✅ Пользователь создает агента через веб-форму
- ✅ Нужна простая настройка с базовыми параметрами
- ✅ Быстрое создание для тестирования

**Пример использования:**

```typescript
POST /ai-agent
{
  "name": "Task Analyzer Bot",
  "description": "Анализирует задачи и предлагает приоритеты",
  "instructions": "Когда задача попадает в 'To Do', проанализируй и добавь оценку сложности",
  "triggerColumnId": "TODO",
  "triggerEvent": "on_enter"
}
```

**Что создается:**

- Запись в таблице `agents`
- Одна базовая инструкция в таблице `agent_instructions`
- Агент готов к работе

---

#### 1.2 Программное создание/обновление через API

**Эндпоинт:** `POST /database/agents/store-config`

**Назначение:** Полное управление конфигурацией агента (создание + обновление)

**Когда использовать:**

- ✅ Программная интеграция с другими системами
- ✅ Миграция/импорт конфигураций агентов
- ✅ Обновление существующего агента
- ✅ Массовое создание агентов через скрипты
- ✅ Расширенная конфигурация (Jira settings, notifications, context sources)

**Особенность:** Если передан `agentId` - обновляет существующего, если нет - создает нового

**Пример создания:**

```typescript
POST /database/agents/store-config
{
  "name": "Advanced Task Agent",
  "description": "Продвинутый агент с полной конфигурацией",
  "status": "active",
  "config": {
    "model": "claude-3-haiku-20240307",
    "temperature": 0.3,
    "maxTokens": 4000
  },
  "jiraInstanceUrl": "https://company.atlassian.net",
  "jiraProjectKey": "PROJ",
  "jiraApiToken": "your-token",
  "contextSources": {
    "jira": true,
    "github": true
  },
  "notificationSettings": {
    "email": true,
    "telegram": true
  },
  "instructions": [
    {
      "columnId": "TODO",
      "columnName": "To Do",
      "instruction": "Analyze and prioritize",
      "triggerEvent": "on_enter",
      "isActive": true,
      "priority": 1
    }
  ]
}
```

**Пример обновления:**

```typescript
POST /database/agents/store-config
{
  "agentId": "existing-agent-uuid",  // ← Ключевое отличие!
  "name": "Updated Agent Name",
  "status": "inactive",
  "instructions": [...]  // Новые инструкции (старые удаляются)
}
```

**Что создается/обновляется:**

- Запись в таблице `agents` (CREATE или UPDATE)
- Массив инструкций в таблице `agent_instructions`
- Полная конфигурация с board integration

---

#### 1.3 Автоматическое создание через Flow Builder

**Эндпоинт:** `POST /flows/:flowId/deploy-to-agent`

**Назначение:** Конвертация визуального Flow в работающего AI агента

**Когда использовать:**

- ✅ Пользователь создал Flow в визуальном конструкторе
- ✅ Нажал кнопку "Deploy to Agent"
- ✅ Нужна автоматическая конвертация блоков в инструкции

**Процесс:**

1. Загружает Flow из БД по `flowId`
2. Анализирует структуру Flow (топологическая сортировка блоков)
3. Конвертирует блоки в текстовую инструкцию через `ConvertFlowToAgentService`
4. Создает агента через `CreateAgentService`
5. Связывает Flow с Agent (`flow.agentId = agent.id`)

**Пример использования:**

```typescript
POST /flows/flow-123/deploy-to-agent
{
  "userId": "user-456",
  "agentName": "Custom Flow Agent",  // Опционально
  "agentDescription": "Agent from my flow"  // Опционально
}
```

**Что происходит внутри:**

```typescript
// 1. Загружаем Flow
const flow = await flowRepository.findOne({ where: { id: flowId } });

// 2. Конвертируем Flow → Agent инструкции
const conversion = await convertFlowToAgentService.convertFlowToAgent(flow);
// Результат: полная текстовая инструкция из всех блоков Flow

// 3. Создаем агента
const agent = await createAgentService.execute({
  name: conversion.agentName,
  instructions: conversion.instructionText, // ← Инструкция из Flow!
  triggerColumnId: conversion.triggerConfig.columnId,
  triggerEvent: conversion.triggerConfig.event,
});

// 4. Связываем Flow с Agent
await flowRepository.update(flowId, { agentId: agent.agentId });
```

**Что создается:**

- Запись в таблице `agents`
- Инструкция, сгенерированная из блоков Flow
- Связь `flow.agentId` → `agent.id`

---

### Сравнение трех способов

| Критерий         | `POST /ai-agent`         | `POST /database/agents/store-config` | `POST /flows/:id/deploy`             |
| ---------------- | ------------------------ | ------------------------------------ | ------------------------------------ |
| **Для кого**     | 👤 Конечные пользователи | 🤖 Системы и API                     | 🎨 Flow Builder                      |
| **Сложность**    | Простая форма            | Полная конфигурация                  | Автоматическая конвертация           |
| **Создание**     | ✅ Да                    | ✅ Да                                | ✅ Да (из Flow)                      |
| **Обновление**   | ❌ Нет                   | ✅ Да (если передан agentId)         | ✅ Да (если flow.agentId существует) |
| **Инструкции**   | 1 базовая                | Массив детальных                     | Генерируется из блоков               |
| **Board config** | ❌ Нет                   | ✅ Да                                | ✅ Да (из trigger блока)             |
| **UI интерфейс** | Простая форма            | API endpoint                         | Visual Flow Builder                  |
| **Use case**     | Быстрое создание         | Программная интеграция               | Визуальное программирование          |

---

## Visual Flow Builder

### Назначение

Визуальный конструктор workflow для создания автоматизаций без кода

### Основные возможности

#### 2.1 Типы блоков

**Trigger (Триггер)**

- Событие, запускающее Flow
- Типы: `board_move`, `card_created`, `card_updated`, `schedule`, `webhook`
- Поддержка любых досок: Jira, Trello, Asana, Notion, Monday, ClickUp

**Context (Контекст)**

- Извлечение данных из задачи
- Источники: вложения, описание, комментарии, метаданные
- Фильтрация: по пользователю, типу файла, дате

**Logic (Логика)**

- IF/ELSE ветвления
- Условия: exists, empty, equals, contains
- Циклы и ожидание

**Action (Действия)**

- Комментарии к задаче
- AI запросы (Claude, GPT, Gemini)
- Создание файлов (DOCX, PDF, TXT, XLSX)
- Обновление полей задачи
- Уведомления

**Wait (Ожидание)**

- Задержка выполнения
- Ожидание события или ответа AI

#### 2.2 Процесс работы

```
1. Создание Flow
   ↓
2. Добавление блоков (drag & drop)
   ↓
3. Настройка каждого блока
   ↓
4. Соединение блоков связями
   ↓
5. Сохранение Flow (POST /flows)
   ↓
6. Deploy to Agent (POST /flows/:id/deploy-to-agent)
   ↓
7. Агент готов к работе!
```

#### 2.3 Пример Flow

**Use case:** Анализ фотографий стрижки

```
[Trigger: Файл загружен]
         ↓
[Context: Извлечь все фото от клиента]
         ↓
[IF: Есть ли фото "после"?]
    ↙        ↘
  YES        NO
   ↓          ↓
[AI: Анализ] [Action: Комментарий]
   ↓          "Загрузите фото после"
[Create File: report.docx]
   ↓
[Action: Прикрепить к задаче]
```

---

## Интеграция с досками

### 3.1 Архитектура интеграций

**Универсальная система подключения к любым канбан-доскам**

```
Agent (AI агент)
    ↓
BoardIntegration (запись о подключении)
    ↓
BoardIntegrationFactory (фабрика сервисов)
    ↓
Конкретный сервис (JiraBoardService, TrelloBoardService, и т.д.)
    ↓
Внешняя API доски
```

### 3.2 Процесс подключения к доске

#### Шаг 1: Создание интеграции

**Эндпоинт:** `POST /board-integrations`

**Что происходит:**

1. **Проверка агента** - существует ли агент с указанным ID
2. **Проверка поддержки** - поддерживается ли данный тип доски
3. **Валидация конфига** - правильно ли заполнены обязательные поля
4. **Тест подключения** - попытка подключиться к доске с этими данными
5. **Создание записи** - сохранение в таблицу `board_integrations`

**Пример для Jira:**

```typescript
POST /board-integrations
{
  "agentId": "agent-uuid",
  "boardType": "jira",
  "name": "Main Project Board",
  "description": "Integration with main Jira project",
  "config": {
    "instanceUrl": "https://company.atlassian.net",
    "projectKey": "PROJ",
    "apiToken": "your-jira-api-token",
    "email": "user@company.com"
  },
  "isActive": true,
  "fieldMappings": {
    "title": "summary",
    "description": "description",
    "status": "status.name",
    "assignee": "assignee.displayName"
  },
  "statusMappings": {
    "to-do": "To Do",
    "in-progress": "In Progress",
    "done": "Done"
  }
}
```

**Пример для Trello:**

```typescript
POST /board-integrations
{
  "agentId": "agent-uuid",
  "boardType": "trello",
  "name": "Marketing Board",
  "config": {
    "boardId": "trello-board-id",
    "apiKey": "your-trello-api-key",
    "token": "your-trello-token",
    "organizationId": "optional-org-id"
  }
}
```

**Пример для кастомной доски:**

```typescript
POST /board-integrations
{
  "agentId": "agent-uuid",
  "boardType": "custom",
  "name": "Custom Internal Board",
  "config": {
    "baseUrl": "https://internal-board.company.com/api",
    "authConfig": {
      "type": "bearer_token",
      "credentials": {
        "token": "your-internal-api-token"
      }
    },
    "endpoints": {
      "getTasks": "/tasks",
      "createTask": "/tasks",
      "updateTask": "/tasks/:id",
      "deleteTask": "/tasks/:id"
    }
  }
}
```

#### Шаг 2: Валидация и тест подключения

**Внутри системы происходит:**

```typescript
// 1. BoardIntegrationFactory выбирает нужный сервис
const service = boardIntegrationFactory.getBoardService('jira');

// 2. Валидация конфигурации
const validation = await service.validateConfig(config);
// Проверяет: instanceUrl заполнен? apiToken есть? projectKey указан?

if (!validation.valid) {
  throw new Error(validation.errors);
  // ["instanceUrl is required", "apiToken must be a valid string"]
}

// 3. Тест подключения
const connected = await service.testConnection(config);
// Делает реальный запрос к API доски для проверки

if (!connected) {
  console.warn('Connection test failed, but integration will be created');
  // Не блокируем создание - пользователь может позже исправить
}
```

#### Шаг 3: Сохранение в БД

**Таблица:** `board_integrations`

**Поля:**

- `id` - UUID интеграции
- `agentId` - к какому агенту привязана
- `boardType` - тип доски (jira, trello, asana, etc.)
- `name` - название интеграции
- `config` - JSON с настройками подключения
- `isActive` - активна ли интеграция
- `fieldMappings` - как мапить поля (наше поле → поле доски)
- `statusMappings` - как мапить статусы (наш статус → статус доски)
- `lastSyncAt` - когда последний раз синхронизировались
- `syncErrors` - ошибки последней синхронизации
- `syncStats` - статистика синхронизации

### 3.3 Поддерживаемые платформы

#### ✅ **Jira** (ПОЛНОСТЬЮ РЕАЛИЗОВАНО)

**Конфигурация:**

```typescript
{
  "instanceUrl": "https://company.atlassian.net",
  "projectKey": "PROJ",
  "apiToken": "your-api-token",
  "email": "user@company.com"  // опционально
}
```

**Доступные операции:**

- ✅ Получение списка задач
- ✅ Создание задачи
- ✅ Обновление задачи
- ✅ Добавление комментария
- ✅ Перемещение между статусами
- ✅ Получение вложений
- ✅ Получение колонок доски
- ✅ Webhook для событий в реальном времени

**Специальные эндпоинты:**

```
POST   /jira/connect                    - Подключение
GET    /jira/issues                     - Список задач
POST   /jira/issues                     - Создать задачу
GET    /jira/issues/:id                 - Детали задачи
PUT    /jira/issues/:id                 - Обновить задачу
POST   /jira/issues/:id/comments        - Добавить комментарий
POST   /jira/issues/:id/move            - Переместить задачу
GET    /jira/issues/:id/attachments     - Получить вложения
GET    /jira/boards/:id/columns         - Получить колонки
POST   /jira/webhook                    - Webhook endpoint
GET    /jira/health                     - Проверка здоровья
```

---

#### 🔶 **Trello** (ЧАСТИЧНО РЕАЛИЗОВАНО)

**Конфигурация:**

```typescript
{
  "boardId": "trello-board-id",
  "apiKey": "your-api-key",
  "token": "your-token",
  "organizationId": "optional-org-id"
}
```

**Доступные операции:**

- ✅ Получение списка карточек
- ✅ Создание карточки
- ✅ Обновление карточки
- ⏳ Добавление комментария (в разработке)
- ⏳ Webhook (в разработке)

---

#### 🔶 **Linear** (БАЗОВАЯ ПОДДЕРЖКА)

**Конфигурация:**

```typescript
{
  "apiKey": "your-linear-api-key",
  "teamId": "optional-team-id",
  "organizationId": "optional-org-id"
}
```

---

#### 🔶 **Asana** (БАЗОВАЯ ПОДДЕРЖКА)

**Конфигурация:**

```typescript
{
  "accessToken": "your-asana-token",
  "workspaceId": "workspace-id",
  "projectId": "optional-project-id"
}
```

---

#### 🔶 **Notion** (БАЗОВАЯ ПОДДЕРЖКА)

**Конфигурация:**

```typescript
{
  "integrationToken": "your-notion-token",
  "databaseId": "database-id",
  "pageId": "optional-page-id"
}
```

---

#### 🔶 **GitHub Projects** (БАЗОВАЯ ПОДДЕРЖКА)

**Конфигурация:**

```typescript
{
  "accessToken": "github-token",
  "owner": "repo-owner",
  "repo": "repo-name",
  "projectNumber": 1
}
```

---

#### ✅ **Custom (ПОЛНАЯ ПОДДЕРЖКА)**

**Конфигурация:**

```typescript
{
  "baseUrl": "https://your-board.com/api",
  "authConfig": {
    "type": "api_key" | "bearer_token" | "basic_auth" | "oauth",
    "credentials": {
      "token": "your-token",
      // или другие поля в зависимости от типа auth
    }
  },
  "endpoints": {
    "getTasks": "/tasks",
    "createTask": "/tasks",
    "updateTask": "/tasks/:id",
    "deleteTask": "/tasks/:id",
    "getBoards": "/boards"
  }
}
```

**Кастомная доска позволяет:**

- ✅ Подключить любую систему с REST API
- ✅ Настроить кастомную аутентификацию
- ✅ Определить свои эндпоинты
- ✅ Мапить поля как вам нужно

### 3.4 Field Mappings (Маппинг полей)

**Зачем нужно:** Каждая доска называет поля по-разному

**Наши стандартные поля:**

- `title` - название задачи
- `description` - описание
- `status` - статус
- `assignee` - исполнитель
- `priority` - приоритет
- `dueDate` - дедлайн
- `labels` - метки/теги
- `comments` - комментарии

**Как мапить для Jira:**

```json
{
  "title": "summary",
  "description": "description",
  "status": "status.name",
  "assignee": "assignee.displayName",
  "priority": "priority.name",
  "dueDate": "duedate",
  "labels": "labels"
}
```

**Как мапить для Trello:**

```json
{
  "title": "name",
  "description": "desc",
  "status": "list.name",
  "assignee": "members[0].fullName",
  "dueDate": "due",
  "labels": "labels[].name"
}
```

### 3.5 Status Mappings (Маппинг статусов)

**Зачем нужно:** Разные доски используют разные названия статусов

**Пример для Jira:**

```json
{
  "to-do": "To Do",
  "in-progress": "In Progress",
  "in-review": "Code Review",
  "done": "Done"
}
```

**Пример для Trello (по названиям колонок):**

```json
{
  "to-do": "Backlog",
  "in-progress": "Doing",
  "done": "Completed"
}
```

### 3.6 Синхронизация данных

**Автоматическая синхронизация:** Система периодически синхронизирует данные с досками

**Что синхронизируется:**

- Новые задачи
- Обновления существующих задач
- Изменения статусов
- Комментарии
- Вложения

**Статистика синхронизации сохраняется:**

```typescript
{
  "lastSyncAt": "2025-10-20T10:30:00Z",
  "syncStats": {
    "totalTasks": 150,
    "lastTasksImported": 5,
    "lastTasksUpdated": 12,
    "lastTasksSkipped": 3
  },
  "syncErrors": [
    "Task PROJ-123: Failed to update due to permission error"
  ]
}
```

### 3.7 Работа с несколькими досками

**Один агент может работать с несколькими досками одновременно!**

**Пример:**

```typescript
Agent "Multi-Board Agent"
├── BoardIntegration 1: Jira (основные задачи)
├── BoardIntegration 2: Trello (маркетинг)
└── BoardIntegration 3: Linear (разработка)
```

**Агент будет:**

- Следить за событиями во всех досках
- Выполнять инструкции в зависимости от источника
- Синхронизировать данные между досками (опционально)

---

## AI аналитика и отчеты

### 4.1 Генерация отчетов

**Эндпоинт:** `POST /ai-reporting/generate-report`

**Возможности:**

- Анализ производительности команды
- Отчеты по задачам
- Прогнозы выполнения
- Рекомендации по оптимизации

### 4.2 Анализ фотографий

**Эндпоинт:** `POST /photo-analysis/analyze`

**Use case:** Парикмахерские услуги

- Анализ фото "до" и "после"
- Оценка качества работы
- Генерация текстового отчета

---

## Система обучения агентов

### 5.1 Интеллектуальный анализ

**Сервис:** `IntelligentAgentService`

**4 уровня анализа:**

1. **Бизнес-контекст** - анализ типа задачи, приоритета, связей
2. **Канбан-процессы** - оптимизация workflow, WIP limits
3. **AI-решения** - Claude AI выбирает лучшие действия
4. **Обучение** - накопление опыта для будущих решений

### 5.2 Специализированные роли

**8 ролей агентов:**

- `workflow_optimizer` - Оптимизация процессов
- `quality_controller` - Контроль качества
- `priority_manager` - Управление приоритетами
- `stakeholder_communicator` - Коммуникация с заинтересованными сторонами
- `resource_allocator` - Распределение ресурсов
- `risk_assessor` - Оценка рисков
- `performance_analyst` - Анализ производительности
- `universal` - Универсальный агент

**Эндпоинты:**

- `GET /ai-agent/roles/available-roles` - Список ролей
- `POST /ai-agent/roles/determine-optimal-role` - Определение оптимальной роли
- `POST /ai-agent/roles/recommend-team` - Рекомендации по составу команды

### 5.3 База знаний

**Сервис:** `KanbanKnowledgeBaseService`

**Содержит:**

- Канбан-паттерны для типовых ситуаций
- Бизнес-правила для критических багов
- Лучшие практики индустрии (Definition of Done, WIP Limits)
- Workflow для разных типов задач

---

## 📈 Статистика проекта

- **95+** готовых API эндпоинтов
- **9** основных бизнес-блоков
- **8** специализированных ролей агентов
- **12** интеллектуальных эндпоинтов
- **4** AI-сервиса (анализ, обучение, роли, база знаний)
- **5** типов блоков в Flow Builder

---

## 🔧 Технологический стек

- **Backend:** NestJS + TypeScript
- **Frontend:** Next.js + React Flow
- **AI:** Claude AI (Anthropic)
- **БД:** PostgreSQL + TypeORM
- **Кэш:** Redis + Bull Queue
- **CI/CD:** GitHub Actions
- **Деплой:** Docker + Docker Compose

---

_Последнее обновление: 20 октября 2025 г._
