# 🎨 План реализации Visual Flow Builder для AI-агентов

## 🎯 Задача от тимлида

Создать визуальный конструктор AI-потоков с drag & drop интерфейсом для настройки сложных сценариев автоматизации.

## 🧩 Компоненты системы

### 1. **🔥 Trigger Blocks (Триггеры)**

```typescript
interface TriggerBlock {
  id: string;
  type: 'jira_move' | 'jira_create' | 'jira_update' | 'time_based';
  config: {
    source: 'jira' | 'webhook' | 'schedule';
    event: 'card_moved' | 'card_created' | 'card_updated';
    targetColumn?: string;
    conditions?: Record<string, any>;
  };
}
```

**UI Компоненты:**

- `TriggerSelector` - выбор типа триггера
- `JiraColumnSelector` - выбор колонки Jira
- `TriggerConditions` - дополнительные условия

### 2. **📋 Context Blocks (Контекст)**

```typescript
interface ContextBlock {
  id: string;
  type: 'extract_files' | 'get_card_data' | 'external_api' | 'variable';
  config: {
    variableName: string;
    source: 'card_attachments' | 'card_fields' | 'api_call';
    filter?: {
      uploadedBy?: string;
      fileType?: string[];
      dateRange?: [Date, Date];
    };
  };
}
```

**UI Компоненты:**

- `VariableNameInput` - название переменной
- `FileFilterSelector` - фильтры для файлов
- `UserSelector` - выбор пользователя

### 3. **🔀 Logic Blocks (Условная логика)**

```typescript
interface LogicBlock {
  id: string;
  type: 'if_else' | 'switch' | 'loop' | 'try_catch';
  config: {
    condition: {
      variable: string;
      operator: 'exists' | 'empty' | 'equals' | 'contains';
      value?: any;
    };
    trueBranch: string[]; // IDs следующих блоков
    falseBranch: string[]; // IDs следующих блоков
  };
}
```

**UI Компоненты:**

- `ConditionBuilder` - построитель условий
- `VariableSelector` - выбор переменной для проверки
- `OperatorSelector` - выбор оператора сравнения

### 4. **⚡ Action Blocks (Действия)**

```typescript
interface ActionBlock {
  id: string;
  type:
    | 'comment'
    | 'ai_request'
    | 'create_file'
    | 'attach_file'
    | 'send_notification';
  config: {
    // Для комментариев
    commentText?: string;

    // Для AI запросов
    aiModel?: 'claude' | 'gpt' | 'gemini';
    prompt?: string;
    attachments?: string[]; // переменные с файлами

    // Для файлов
    fileName?: string;
    fileContent?: string;
    fileFormat?: 'docx' | 'pdf' | 'txt' | 'xlsx';
  };
}
```

**UI Компоненты:**

- `CommentEditor` - редактор комментариев
- `AIModelSelector` - выбор AI модели
- `PromptEditor` - редактор промптов
- `FileCreator` - настройка создания файлов

### 5. **⏱️ Wait Blocks (Ожидание)**

```typescript
interface WaitBlock {
  id: string;
  type: 'wait_response' | 'wait_time' | 'wait_condition';
  config: {
    waitFor: 'ai_response' | 'user_action' | 'time_delay';
    timeout?: number;
    onSuccess: string[]; // IDs следующих блоков
    onError: string[]; // IDs следующих блоков
    onTimeout: string[]; // IDs следующих блоков
  };
}
```

## 🎨 Frontend Architecture

### Технологический стек

```typescript
// Flow Builder компоненты
- React Flow / Xyflow - для drag & drop канваса
- Zustand - для состояния flow
- React Hook Form - для форм настройки блоков
- Shadcn/ui - для UI компонентов
- Monaco Editor - для редактирования промптов и кода
```

### Структура компонентов

```
src/components/flow-builder/
├── FlowCanvas.tsx              # Основной канвас
├── Sidebar/                    # Панель с блоками
│   ├── BlockPalette.tsx       # Палитра доступных блоков
│   ├── TriggerBlocks.tsx      # Триггеры
│   ├── ContextBlocks.tsx      # Контекстные блоки
│   ├── LogicBlocks.tsx        # Логические блоки
│   ├── ActionBlocks.tsx       # Блоки действий
│   └── WaitBlocks.tsx         # Блоки ожидания
├── Blocks/                     # Компоненты блоков
│   ├── TriggerBlock.tsx
│   ├── ContextBlock.tsx
│   ├── LogicBlock.tsx
│   ├── ActionBlock.tsx
│   └── WaitBlock.tsx
├── Properties/                 # Панель свойств
│   ├── PropertiesPanel.tsx
│   ├── TriggerProperties.tsx
│   ├── ContextProperties.tsx
│   ├── LogicProperties.tsx
│   ├── ActionProperties.tsx
│   └── WaitProperties.tsx
├── Toolbar/                    # Панель инструментов
│   ├── FlowToolbar.tsx
│   ├── SaveButton.tsx
│   ├── TestButton.tsx
│   └── DeployButton.tsx
└── Dialogs/                    # Модальные окна
    ├── VariableDialog.tsx
    ├── ConditionDialog.tsx
    └── TestResultDialog.tsx
```

## 🔧 Backend Extensions

### Новые эндпоинты для Flow Builder

```typescript
// Flow Management API
POST /ai-agent/flows/create          # Создание flow
PUT /ai-agent/flows/:id/update       # Обновление flow
GET /ai-agent/flows/:id              # Получение flow
DELETE /ai-agent/flows/:id           # Удаление flow
POST /ai-agent/flows/:id/test        # Тестирование flow
POST /ai-agent/flows/:id/deploy      # Деплой flow

// Flow Execution API
POST /ai-agent/flows/:id/execute     # Ручной запуск flow
GET /ai-agent/flows/:id/executions   # История выполнений
GET /ai-agent/flows/:id/status       # Статус выполнения
POST /ai-agent/flows/:id/stop        # Остановка выполнения
```

### Расширения существующих сервисов

```typescript
// InstructionExecutorService расширения
interface FlowDefinition {
  id: string;
  name: string;
  description: string;
  triggers: TriggerBlock[];
  blocks: (ContextBlock | LogicBlock | ActionBlock | WaitBlock)[];
  connections: FlowConnection[];
  variables: FlowVariable[];
}

interface FlowExecution {
  id: string;
  flowId: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  currentBlock: string;
  variables: Record<string, any>;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}
```

## 📋 Пример использования (как описал тимлид)

### Flow Definition

```json
{
  "id": "photo-analysis-flow",
  "name": "Анализ фотографий стрижки",
  "triggers": [
    {
      "id": "trigger-1",
      "type": "jira_move",
      "config": {
        "source": "jira",
        "event": "card_moved",
        "targetColumn": "В работе"
      }
    }
  ],
  "blocks": [
    {
      "id": "context-1",
      "type": "extract_files",
      "config": {
        "variableName": "userPhotos",
        "source": "card_attachments",
        "filter": {
          "fileType": ["jpg", "png", "jpeg"],
          "uploadedBy": "specific_user"
        }
      }
    },
    {
      "id": "logic-1",
      "type": "if_else",
      "config": {
        "condition": {
          "variable": "userPhotos",
          "operator": "exists"
        },
        "trueBranch": ["action-2"],
        "falseBranch": ["action-1"]
      }
    },
    {
      "id": "action-1",
      "type": "comment",
      "config": {
        "commentText": "Загрузите фотографии стрижки"
      }
    },
    {
      "id": "action-2",
      "type": "ai_request",
      "config": {
        "aiModel": "claude",
        "prompt": "Проанализируй фотографии стрижки и создай отчет",
        "attachments": ["userPhotos"]
      }
    },
    {
      "id": "wait-1",
      "type": "wait_response",
      "config": {
        "waitFor": "ai_response",
        "onSuccess": ["logic-2"],
        "onError": ["action-4"]
      }
    },
    {
      "id": "logic-2",
      "type": "if_else",
      "config": {
        "condition": {
          "variable": "aiResponse",
          "operator": "exists"
        },
        "trueBranch": ["action-3"],
        "falseBranch": ["action-4"]
      }
    },
    {
      "id": "action-3",
      "type": "create_file",
      "config": {
        "fileName": "report.docx",
        "fileContent": "{{aiResponse}}",
        "fileFormat": "docx"
      }
    },
    {
      "id": "action-4",
      "type": "comment",
      "config": {
        "commentText": "Ошибка запроса к LLM"
      }
    }
  ],
  "connections": [
    { "from": "trigger-1", "to": "context-1" },
    { "from": "context-1", "to": "logic-1" },
    { "from": "logic-1", "to": "action-1", "condition": "false" },
    { "from": "logic-1", "to": "action-2", "condition": "true" },
    { "from": "action-2", "to": "wait-1" },
    { "from": "wait-1", "to": "logic-2", "condition": "success" },
    { "from": "wait-1", "to": "action-4", "condition": "error" },
    { "from": "logic-2", "to": "action-3", "condition": "true" },
    { "from": "logic-2", "to": "action-4", "condition": "false" }
  ]
}
```

## 🚀 План реализации

### Этап 1: Базовая инфраструктура (1-2 недели)

- [ ] Настройка React Flow в проекте
- [ ] Создание базовых компонентов блоков
- [ ] Система drag & drop
- [ ] Базовое сохранение/загрузка flow

### Этап 2: Блоки триггеров и контекста (1 неделя)

- [ ] Компоненты триггеров (Jira интеграция)
- [ ] Блоки извлечения контекста
- [ ] Система переменных
- [ ] Фильтры и селекторы

### Этап 3: Логика и действия (1-2 недели)

- [ ] IF/ELSE блоки с условиями
- [ ] Action блоки (комментарии, AI запросы)
- [ ] Блоки создания/прикрепления файлов
- [ ] Wait блоки с таймаутами

### Этап 4: Backend интеграция (1 неделя)

- [ ] API для сохранения flow definitions
- [ ] Расширение InstructionExecutorService
- [ ] Система выполнения flow
- [ ] Мониторинг и логирование

### Этап 5: UI/UX полировка (1 неделя)

- [ ] Панель свойств блоков
- [ ] Валидация flow
- [ ] Тестирование flow
- [ ] Документация и help

## 🎯 Результат

Получится мощный визуальный конструктор, где пользователи смогут:

1. **Drag & Drop** создавать сложные AI-потоки
2. **Визуально настраивать** все параметры
3. **Тестировать** flow перед деплоем
4. **Мониторить** выполнение в реальном времени
5. **Повторно использовать** готовые блоки

**Это будет революция в настройке AI-агентов!** 🚀
