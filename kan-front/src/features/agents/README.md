# 🤖 Agents (AI Агенты)

## 🎯 Назначение

Блок **Agents** отвечает за управление AI агентами в системе.

Позволяет создавать, настраивать, выполнять действия через агентов и отслеживать их активность.

---

## 📂 Структура

```
agents/
├── README.md              # Этот файл
├── components/            # Компоненты агентов (пока не созданы)
├── hooks/                 # Хуки для агентов
├── stores/                # Zustand store
│   └── agents.store.ts    # Главный store агентов
├── api/                   # API методы
│   └── agents.api.ts      # API клиент агентов
├── types/                 # TypeScript типы
│   └── index.ts           # Agent, AgentActivity и т.д.
└── utils/                 # Утилиты (пока не созданы)
```

---

## 🔌 API методы

### Основные методы:

- `agentsAPI.getAll()` — получить всех агентов
- `agentsAPI.getById(id)` — получить агента по ID
- `agentsAPI.create(data)` — создать нового агента
- `agentsAPI.configure(id, data)` — настроить конфигурацию агента
- `agentsAPI.execute(data)` — выполнить действие через агента
- `agentsAPI.getActivity(agentId)` — получить историю активности агента
- `agentsAPI.update(id, data)` — обновить базовые данные агента
- `agentsAPI.delete(id)` — удалить агента

**Файл:** `api/agents.api.ts`

---

## 🪝 Основные хуки

### `useAgentsStore`

Главный Zustand store для управления состоянием агентов.

**Поля состояния:**

- `agents` — список всех агентов
- `selectedAgent` — выбранный агент
- `agentActivity` — активность агента (логи)
- `isLoading` — индикатор загрузки
- `error` — ошибки

**Actions:**

- `createAgent(data)` — создать агента
- `configureAgent(id, data)` — настроить агента
- `executeAgent(data)` — выполнить действие через агента
- `getAgentActivity(id)` — получить активность агента
- `setSelectedAgent(agent)` — установить выбранного агента
- `clearError()` — очистить ошибку

---

## 📊 Store (состояние)

**Файл:** `stores/agents.store.ts`

**Использование:**

```tsx
import { useAgentsStore } from '@/src/features/agents/stores/agents.store';

function AgentsPage() {
  const { agents, createAgent, isLoading } = useAgentsStore();

  const handleCreate = async () => {
    await createAgent({
      name: 'My Agent',
      description: 'Agent description',
      type: 'task-automation',
    });
  };

  // ...
}
```

---

## 🧩 Компоненты

> **TODO:** Компоненты пока не созданы, будут добавлены позже.

Планируемые компоненты:

- `AgentsList` — список всех агентов
- `AgentCard` — карточка агента
- `CreateAgentDialog` — диалог создания агента
- `AgentDetailsPanel` — панель с деталями агента
- `AgentActivityLog` — лог активности агента
- `AgentConfigForm` — форма настройки агента

---

## 📝 Типы

**Файл:** `types/index.ts`

### Основные типы:

- `Agent` — модель агента
- `AgentConfiguration` — конфигурация агента
- `AgentActivity` — лог активности агента
- `CreateAgentData` — данные для создания агента
- `UpdateAgentData` — данные для обновления агента
- `ExecuteAgentData` — данные для выполнения действия
- `AgentExecutionResult` — результат выполнения действия
- `GetAllAgentsResponse` — ответ API при получении агентов

**Использование:**

```tsx
import type { Agent, AgentActivity } from '@/src/features/agents/types';
```

---

## 🔗 Зависимости

**От каких блоков зависит:**

- `shared/api` — использует базовый HTTP клиент
- `shared/components/ui` — использует UI компоненты

**Какие блоки зависят от этого:**

- `flows` — может использовать агентов для выполнения флоу
- `flow-builder` — может деплоить флоу в агента

---

## 📝 Примеры использования

### Создать агента:

```tsx
import { agentsAPI } from '@/src/features/agents/api/agents.api';

await agentsAPI.create({
  name: 'Task Automation Agent',
  description: 'Автоматизирует задачи в канбане',
  type: 'task-automation',
  configuration: {
    model: 'gpt-4',
    temperature: 0.7,
    systemPrompt: 'You are a task automation assistant.',
  },
});
```

### Настроить агента:

```tsx
const { configureAgent } = useAgentsStore();

await configureAgent('agent-id', {
  configuration: {
    temperature: 0.5,
    maxTokens: 2000,
  },
});
```

### Выполнить действие:

```tsx
const { executeAgent } = useAgentsStore();

const result = await executeAgent({
  agentId: 'agent-id',
  action: 'create-task',
  parameters: {
    title: 'New Task',
    column: 'todo',
  },
});
```

### Получить активность:

```tsx
const { getAgentActivity, agentActivity } = useAgentsStore();

await getAgentActivity('agent-id');
console.log(agentActivity); // логи действий агента
```

---

## 🚀 Следующие шаги

1. ✅ Создана структура блока
2. ✅ Создан API клиент
3. ✅ Создан store
4. ✅ Созданы типы
5. ⏳ Создать компоненты для агентов
6. ⏳ Создать хуки (useAgentExecution, useAgentConfig и т.д.)

---

**Дата создания:** 2 ноября 2025  
**Последнее обновление:** 2 ноября 2025
