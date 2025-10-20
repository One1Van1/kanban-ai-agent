# 🔌 Jira-Integration - Интеграция с Jira

## 📋 Содержание

- [Обзор](#обзор)
- [Эндпойнты](#эндпойнты)
  - [health-check-correct](#health-check-correct) - Проверка подключения к Jira API
  - [get-task-correct](#get-task-correct) - Получить задачу из Jira по ключу
  - [get-board-columns](#get-board-columns) - Список колонок (статусов) доски
  - [get-column-tasks-correct](#get-column-tasks-correct) - Все задачи в колонке
  - [get-task-transitions-correct](#get-task-transitions-correct) - Доступные переходы для задачи
  - [search-tasks-correct](#search-tasks-correct) - Поиск задач через JQL
  - [add-task-comment](#add-task-comment) - Добавить комментарий к задаче
  - [move-task-correct](#move-task-correct) - Переместить задачу в другой статус
  - [attach-file-correct](#attach-file-correct) - Прикрепить файл к задаче
  - [get-task-files-by-user](#get-task-files-by-user) - Файлы пользователя в задаче
  - [jira-webhook-handler-correct](#jira-webhook-handler-correct) - Обработка Jira webhooks
  - [process-webhook-before-after](#process-webhook-before-after) - Анализ изменений до/после
  - [time-validation-webhook-correct](#time-validation-webhook-correct) - Валидация времени на задачах

---

## 🎯 Обзор

**Назначение:** Полная интеграция с Jira API для работы с задачами, досками, комментариями и вебхуками.

**Основные возможности:**

- ✅ Получение задач и их деталей из Jira
- ✅ Управление колонками и статусами
- ✅ Перемещение задач между статусами
- ✅ Добавление комментариев и файлов
- ✅ Поиск задач с JQL
- ✅ Обработка Jira webhooks
- ✅ Анализ изменений до/после
- ✅ Валидация времени на задачах

**Сущности:**

- `BoardIntegration` - настройки интеграции с Jira
- `TaskHistory` - история изменений задач

**Внешние API:**

- Jira REST API v3
- Jira Webhook API

---

## 📌 Эндпойнты

### health-check-correct

**HTTP:** `GET /jira-integration/health`

**Назначение:** Проверка доступности и работоспособности Jira API, валидация креденшелов.

**Выходные данные:**

```typescript
{
  status: 'healthy' | 'unhealthy';
  jiraConnected: boolean;
  apiVersion: string;
  lastCheck: Date;
  details: {
    baseUrl: string;
    authenticated: boolean;
    permissions: string[];
  };
}
```

**🔗 Связи и зависимости:**

**📤 Исходящие связи (что использует):**

**Эндпоинты:**

- Jira REST API - `/rest/api/3/myself`

**Сервисы:**

- `ConfigService.get('jira.baseUrl')` - URL Jira
- `ConfigService.get('jira.apiToken')` - токен авторизации

**📥 Входящие связи (кто использует):**

- Frontend: индикатор статуса Jira
- `ai-agent/execute-agent-action` - проверка перед действием
- Мониторинг систем

**🔄 Связанные процессы:**

1. Проверка наличия credentials в конфиге
2. Запрос к Jira API `/myself`
3. Валидация ответа
4. Проверка permissions
5. Кэширование результата (TTL: 5 минут)
6. Возврат статуса

**Примеры использования:**

```bash
# Проверить подключение к Jira
curl http://localhost:3000/jira-integration/health
```

---

### get-task-correct

**HTTP:** `GET /jira-integration/tasks/:taskKey`

**Назначение:** Получить полную информацию о задаче из Jira по ключу (например, PROJ-123).

**Path параметры:**

```typescript
{
  taskKey: string; // Например: "PROJ-123", "DEV-456"
}
```

**Выходные данные:**

```typescript
{
  key: string;
  id: string;
  summary: string;
  description: string;
  status: {
    id: string;
    name: string;
    category: string;
  };
  assignee: {
    accountId: string;
    displayName: string;
    email: string;
  };
  reporter: {
    accountId: string;
    displayName: string;
  };
  priority: {
    id: string;
    name: string;
  };
  labels: string[];
  components: Array<{name: string}>;
  created: Date;
  updated: Date;
  customFields: Record<string, any>;
}
```

**🔗 Связи и зависимости:**

**📤 Исходящие связи:**

- Jira REST API - `/rest/api/3/issue/:taskKey`
- `cache-management/get-cached-context` - кэширование задачи
- `context-management/fetch-task-context` - расширенный контекст

**📥 Входящие связи:**

- Frontend: просмотр задачи
- `ai-agent/execute-agent-action` - получение данных для AI
- `jira-integration/add-task-comment` - проверка существования
- `photo-analysis/analyze-before-after-photos` - контекст для анализа

**🔄 Связанные процессы:**

1. Валидация формата taskKey
2. Запрос к Jira API
3. Парсинг и нормализация данных
4. Кэширование (TTL: 2 минуты)
5. Возврат форматированных данных

**Примеры использования:**

```bash
# Получить задачу
curl http://localhost:3000/jira-integration/tasks/PROJ-123
```

---

### get-board-columns

**HTTP:** `GET /jira-integration/boards/:boardId/columns`

**Назначение:** Получить список колонок (статусов) доски Jira.

**Path параметры:**

```typescript
{
  boardId: string; // ID доски в Jira
}
```

**Выходные данные:**

```typescript
{
  boardId: string;
  columns: Array<{
    id: string;
    name: string;
    statusIds: string[];
    position: number;
    type: 'todo' | 'inprogress' | 'done';
  }>;
  total: number;
}
```

**🔗 Связи и зависимости:**

**📤 Исходящие связи:**

- Jira REST API - `/rest/agile/1.0/board/:boardId/configuration`
- `cache-management/cache-context` - кэширование колонок

**📥 Входящие связи:**

- Frontend: отображение структуры доски
- `ai-agent/configure-column-instructions` - настройка инструкций
- `jira-integration/move-task-correct` - валидация перемещения

**🔄 Связанные процессы:**

1. Запрос конфигурации доски
2. Парсинг колонок и статусов
3. Сортировка по position
4. Кэширование (TTL: 30 минут)
5. Возврат списка колонок

---

### get-column-tasks-correct

**HTTP:** `GET /jira-integration/:columnStatus/tasks`

**Назначение:** Получить все задачи в определенной колонке/статусе.

**Path параметры:**

```typescript
{
  columnStatus: string; // Название статуса: "To Do", "In Progress", "Done"
}
```

**Query параметры:**

```typescript
{
  boardId?: string;
  limit?: number;
  startAt?: number;
}
```

**Выходные данные:**

```typescript
{
  status: string;
  tasks: Array<{
    key: string;
    summary: string;
    assignee: string;
    priority: string;
  }>;
  total: number;
  startAt: number;
  maxResults: number;
}
```

**🔗 Связи и зависимости:**

**📤 Исходящие связи:**

- Jira REST API - JQL search `/rest/api/3/search`
- `jira-integration/search-tasks-correct` - внутренний поиск

**📥 Входящие связи:**

- Frontend: отображение задач колонки
- `ai-agent/get-agent-activity` - анализ задач
- `ai-reporting/generate-report` - отчет по колонкам

---

### get-task-transitions-correct

**HTTP:** `GET /jira-integration/:taskKey/transitions`

**Назначение:** Получить доступные переходы (transitions) для задачи.

**Path параметры:**

```typescript
{
  taskKey: string; // PROJ-123
}
```

**Выходные данные:**

```typescript
{
  taskKey: string;
  transitions: Array<{
    id: string;
    name: string;
    to: {
      id: string;
      name: string;
    };
    fields?: object; // Обязательные поля для перехода
  }>;
}
```

**🔗 Связи и зависимости:**

**📤 Исходящие связи:**

- Jira REST API - `/rest/api/3/issue/:taskKey/transitions`

**📥 Входящие связи:**

- `jira-integration/move-task-correct` - выбор перехода
- Frontend: кнопки перемещения задачи

**🔄 Связанные процессы:**

1. Запрос доступных переходов
2. Фильтрация по permissions
3. Парсинг обязательных полей
4. Возврат списка

---

### search-tasks-correct

**HTTP:** `POST /jira-integration/search`

**Назначение:** Поиск задач в Jira с использованием JQL (Jira Query Language).

**Входные данные:**

```typescript
{
  jql: string;          // "project = PROJ AND status = 'In Progress'"
  fields?: string[];    // Поля для возврата
  maxResults?: number;  // Лимит (по умолчанию: 50)
  startAt?: number;     // Offset для пагинации
}
```

**Выходные данные:**

```typescript
{
  issues: Array<{
    key: string;
    fields: object;
  }>;
  total: number;
  startAt: number;
  maxResults: number;
}
```

**🔗 Связи и зависимости:**

**📤 Исходящие связи:**

- Jira REST API - `/rest/api/3/search`
- `cache-management` - кэширование результатов

**📥 Входящие связи:**

- Frontend: страница поиска
- `ai-agent/execute-agent-action` - поиск релевантных задач
- `ai-reporting/generate-report` - сбор данных

**Примеры:**

```bash
# Поиск задач
curl -X POST http://localhost:3000/jira-integration/search \
  -H "Content-Type: application/json" \
  -d '{
    "jql": "project = PROJ AND status = \"In Progress\"",
    "maxResults": 10
  }'
```

---

### add-task-comment

**HTTP:** `POST /jira-integration/tasks/:taskKey/comment`

**Назначение:** Добавить комментарий к задаче в Jira.

**Path параметры:**

```typescript
{
  taskKey: string; // PROJ-123
}
```

**Входные данные:**

```typescript
{
  body: string;     // Текст комментария (поддерживает Markdown)
  visibility?: {
    type: 'role' | 'group';
    value: string;
  };
}
```

**Выходные данные:**

```typescript
{
  success: boolean;
  commentId: string;
  created: Date;
  author: {
    accountId: string;
    displayName: string;
  }
}
```

**🔗 Связи и зависимости:**

**📤 Исходящие связи:**

- Jira REST API - `/rest/api/3/issue/:taskKey/comment`
- `jira-integration/get-task-correct` - проверка задачи
- `notifications/send-telegram` - уведомление о комментарии

**📥 Входящие связи:**

- `ai-agent/execute-agent-action` - AI комментарии
- `photo-analysis/analyze-before-after-photos` - результаты анализа
- Frontend: добавление комментария

**🔄 Связанные процессы:**

1. Валидация существования задачи
2. Форматирование текста
3. Отправка в Jira API
4. Сохранение в TaskHistory
5. Отправка уведомлений
6. Возврат результата

---

### move-task-correct

**HTTP:** `POST /jira-integration/tasks/:taskKey/move`

**Назначение:** Переместить задачу в другой статус (выполнить transition).

**Path параметры:**

```typescript
{
  taskKey: string;
}
```

**Входные данные:**

```typescript
{
  transitionId: string;  // ID перехода из get-task-transitions
  fields?: {             // Дополнительные поля при переходе
    assignee?: string;
    resolution?: string;
  };
}
```

**Выходные данные:**

```typescript
{
  success: boolean;
  taskKey: string;
  newStatus: string;
  message: string;
}
```

**🔗 Связи и зависимости:**

**📤 Исходящие связи:**

- Jira REST API - `/rest/api/3/issue/:taskKey/transitions`
- `jira-integration/get-task-transitions-correct` - получение transitions
- `ai-agent/execute-agent-action` - триггер AI действия
- `TaskHistoryRepository` - запись изменения

**📥 Входящие связи:**

- Frontend: drag-and-drop задач
- `ai-agent/intelligent-agent` - автоматическое перемещение
- Webhooks - внешние триггеры

**🔄 Связанные процессы:**

1. Получение доступных transitions
2. Валидация transitionId
3. Выполнение перехода
4. Запись в историю
5. Триггер AI агента (если настроено)
6. Возврат нового статуса

---

### attach-file-correct

**HTTP:** `POST /jira-integration/:taskKey`

**Назначение:** Прикрепить файл к задаче в Jira.

**Path параметры:**

```typescript
{
  taskKey: string;
}
```

**Входные данные:**

```typescript
FormData {
  file: File;  // Файл для загрузки
}
```

**Выходные данные:**

```typescript
{
  success: boolean;
  attachmentId: string;
  filename: string;
  size: number;
  mimeType: string;
  url: string;
}
```

**🔗 Связи и зависимости:**

**📤 Исходящие связи:**

- Jira REST API - `/rest/api/3/issue/:taskKey/attachments`
- File storage - временное хранение

**📥 Входящие связи:**

- Frontend: загрузка файлов
- `photo-analysis/analyze-before-after-photos` - анализ скриншотов

---

### get-task-files-by-user

**HTTP:** `GET /jira-integration/tasks/:taskId/files/user/:userId`

**Назначение:** Получить файлы задачи, загруженные конкретным пользователем.

**Path параметры:**

```typescript
{
  taskId: string;
  userId: string;
}
```

**Выходные данные:**

```typescript
{
  taskId: string;
  userId: string;
  files: Array<{
    id: string;
    filename: string;
    created: Date;
    size: number;
    mimeType: string;
    thumbnail?: string;
  }>;
  total: number;
}
```

**🔗 Связи и зависимости:**

**📤 Исходящие связи:**

- Jira REST API - получение attachments
- Фильтрация по author

**📥 Входящие связи:**

- `photo-analysis/analyze-before-after-photos` - поиск before/after

---

### jira-webhook-handler-correct

**HTTP:** `POST /jira-integration`

**Назначение:** Обработка webhooks от Jira (создание, обновление, удаление задач).

**Входные данные:**

```typescript
{
  webhookEvent: string;  // "jira:issue_created", "jira:issue_updated"
  issue: {
    key: string;
    fields: object;
  };
  changelog?: {
    items: Array<{
      field: string;
      fromString: string;
      toString: string;
    }>;
  };
  user: object;
  timestamp: number;
}
```

**Выходные данные:**

```typescript
{
  success: boolean;
  processed: boolean;
  actions: string[];  // Выполненные действия
}
```

**🔗 Связи и зависимости:**

**📤 Исходящие связи:**

- `ai-agent/execute-agent-action` - триггер AI действий
- `TaskHistoryRepository` - запись события
- `context-management/fetch-task-context` - сбор контекста
- `notifications/*` - отправка уведомлений

**📥 Входящие связи:**

- Jira Webhooks - внешние события
- `process-webhook-before-after` - анализ изменений

**🔄 Связанные процессы:**

1. Валидация webhook подписи
2. Парсинг события
3. Определение типа изменения
4. Сохранение в TaskHistory
5. Триггер AI агентов по инструкциям
6. Отправка уведомлений
7. Возврат статуса обработки

---

### process-webhook-before-after

**HTTP:** `POST /jira-integration` (отдельный эндпойнт)

**Назначение:** Анализ изменений задачи "до" и "после" из webhook с AI комментариями.

**Дополнительные эндпойнты:**

- `GET /jira-integration/health` - статус обработчика
- `GET /jira-integration/config` - конфигурация

**Входные данные:**

```typescript
{
  webhookEvent: string;
  issue: object;
  changelog: {
    items: Array<{
      field: string;
      from: any;
      fromString: string;
      to: any;
      toString: string;
    }>;
  }
}
```

**Выходные данные:**

```typescript
{
  success: boolean;
  analysis: {
    before: object;
    after: object;
    changes: Array<{
      field: string;
      oldValue: any;
      newValue: any;
      significance: 'low' | 'medium' | 'high';
    }>;
    aiComment?: string;  // AI-сгенерированный комментарий
  };
}
```

**🔗 Связи и зависимости:**

**📤 Исходящие связи:**

- `ai-agent/execute-agent-action` - генерация AI комментария
- `jira-integration/add-task-comment` - добавление комментария
- `photo-analysis/analyze-before-after-photos` - анализ скриншотов
- AI Provider - анализ изменений

**📥 Входящие связи:**

- `jira-webhook-handler-correct` - обработка webhook
- Jira Webhooks

**🔄 Связанные процессы:**

1. Получение данных before/after
2. Сравнение состояний
3. Определение значимости изменений
4. Генерация AI анализа
5. Добавление комментария в Jira
6. Логирование изменений

---

### time-validation-webhook-correct

**HTTP:** `POST /jira-integration/time-validation`

**Назначение:** Валидация времени на задачах через webhook (проверка logged time, estimates).

**Входные данные:**

```typescript
{
  issue: {
    key: string;
    fields: {
      timetracking: {
        originalEstimate: string;
        remainingEstimate: string;
        timeSpent: string;
      }
    }
  }
}
```

**Выходные данные:**

```typescript
{
  valid: boolean;
  warnings: string[];
  errors: string[];
  recommendations: string[];
}
```

**🔗 Связи и зависимости:**

**📤 Исходящие связи:**

- `jira-integration/get-task-correct` - получение задачи
- `ai-agent/execute-agent-action` - AI рекомендации по времени
- `jira-integration/add-task-comment` - предупреждения

**📥 Входящие связи:**

- Jira Webhooks - события изменения времени

---

## 📊 Сводка по блоку

**Всего эндпойнтов:** 13  
**HTTP методы:**

- GET: 6
- POST: 7

**Основные операции:**

- Чтение задач: 4
- Изменение задач: 3
- Webhooks: 3
- Поиск: 1
- Health check: 1
- Файлы: 2

**Ключевые зависимости:**

- Jira REST API v3
- ai-agent (для автоматических действий)
- context-management
- photo-analysis
- notifications

**Внешние сервисы:**

- Jira Cloud/Server
- Jira Webhooks

---

**Последнее обновление:** 20 октября 2025
