# 🔄 Flows (Управление флоу)

## 🎯 Назначение

Блок **Flows** отвечает за управление флоу (потоками) в системе.

Позволяет создавать, редактировать, выполнять, клонировать, экспортировать и импортировать флоу. Также можно деплоить флоу в AI агента.

---

## 📂 Структура

```
flows/
├── README.md              # Этот файл
├── components/            # Компоненты flows
│   └── EditableFlowCard.tsx
├── hooks/                 # Хуки для flows
├── stores/                # Zustand store
│   └── flow-editor.store.ts
├── api/                   # API методы
│   └── flows.api.ts       # API клиент flows
├── types/                 # TypeScript типы
│   └── index.ts           # Flow, FlowExecutionResult и т.д.
└── utils/                 # Утилиты
```

---

## 🔌 API методы

### Основные методы:

- `flowsAPI.create(data)` — создать новый флоу
- `flowsAPI.get(flowId)` — получить флоу по ID
- `flowsAPI.list(params)` — получить список флоу с фильтрацией
- `flowsAPI.update(flowId, data)` — обновить флоу
- `flowsAPI.delete(flowId)` — удалить флоу
- `flowsAPI.clone(flowId, data)` — клонировать флоу
- `flowsAPI.execute(flowId, data)` — выполнить флоу
- `flowsAPI.deployToAgent(flowId, data)` — деплоить флоу в агента
- `flowsAPI.exportJson(flowId)` — экспортировать флоу в JSON
- `flowsAPI.exportPdf(flowId)` — экспортировать флоу в PDF
- `flowsAPI.import(data)` — импортировать флоу из JSON

**Файл:** `api/flows.api.ts`

---

## 🪝 Основные хуки

### `useFlowEditorStore`

Главный Zustand store для редактора флоу.

**Поля состояния:**

- `currentFlow` — текущий редактируемый флоу
- `originalFlow` — оригинальное состояние (для сравнения изменений)
- `executions` — история выполнений
- `variables` — переменные флоу
- `isLoading` — индикатор загрузки
- `error` — ошибки

**Actions:**

- `setCurrentFlow(flow)` — установить текущий флоу
- `hasUnsavedChanges()` — проверить наличие несохранённых изменений
- `loadFlow(flowId)` — загрузить флоу
- `saveFlow()` — сохранить изменения
- `executeFlow(context)` — выполнить флоу
- `addVariable(variable)` — добавить переменную
- `updateVariable(id, value)` — обновить переменную

---

## 📊 Store (состояние)

**Файл:** `stores/flow-editor.store.ts`

**Использование:**

```tsx
import { useFlowEditorStore } from '@/src/features/flows/stores/flow-editor.store';

function FlowEditor() {
  const { currentFlow, saveFlow, hasUnsavedChanges, isLoading } =
    useFlowEditorStore();

  const handleSave = async () => {
    await saveFlow();
  };

  // ...
}
```

---

## 🧩 Компоненты

### `EditableFlowCard`

Карточка флоу с возможностью редактирования.

**Использование:**

```tsx
import { EditableFlowCard } from '@/src/features/flows/components/EditableFlowCard';

<EditableFlowCard
  flow={flow}
  onEdit={() => router.push(`/flows/editor?id=${flow.id}`)}
  onDelete={handleDelete}
  onClone={handleClone}
/>;
```

---

## 📝 Типы

**Файл:** `types/index.ts`

### Основные типы:

- `Flow` — модель флоу
- `FlowStatus` — статус флоу ('draft' | 'active' | 'archived')
- `FlowMetadata` — метаданные флоу
- `CreateFlowData` — данные для создания
- `UpdateFlowData` — данные для обновления
- `CloneFlowData` — данные для клонирования
- `ExecuteFlowData` — данные для выполнения
- `FlowExecutionResult` — результат выполнения
- `ListFlowsParams` — параметры для списка
- `ListFlowsResponse` — ответ со списком
- `DeployToAgentData` — данные для деплоя в агента
- `ImportFlowData` — данные для импорта

**Использование:**

```tsx
import type { Flow, FlowExecutionResult } from '@/src/features/flows/types';
```

---

## 🔗 Зависимости

**От каких блоков зависит:**

- `shared/api` — использует базовый HTTP клиент
- `shared/components/ui` — использует UI компоненты
- `flow-builder` — использует типы флоу билдера

**Какие блоки зависят от этого:**

- `agents` — может использовать флоу через деплой
- `flow-builder` — создаёт флоу

---

## 📝 Примеры использования

### Создать флоу:

```tsx
import { flowsAPI } from '@/src/features/flows/api/flows.api';

await flowsAPI.create({
  name: 'My Flow',
  description: 'Flow description',
  definition: flowDefinition,
  createdBy: 'user-id',
  metadata: {
    category: 'automation',
    tags: ['task', 'kanban'],
  },
});
```

### Получить список флоу:

```tsx
const response = await flowsAPI.list({
  page: 1,
  limit: 10,
  status: 'active',
  search: 'automation',
});

console.log(response.flows); // массив флоу
```

### Выполнить флоу:

```tsx
const result = await flowsAPI.execute('flow-id', {
  context: { taskId: '123' },
  executedBy: 'user-id',
});

console.log(result.instructions); // инструкции выполнения
```

### Клонировать флоу:

```tsx
const cloned = await flowsAPI.clone('flow-id', {
  name: 'Copy of My Flow',
  description: 'Cloned flow',
  clonedBy: 'user-id',
});

console.log(cloned.clonedFlowId);
```

### Деплоить в агента:

```tsx
const deployed = await flowsAPI.deployToAgent('flow-id', {
  userId: 'user-id',
  agentName: 'Task Automation Agent',
  agentDescription: 'Automates tasks based on flow',
});

console.log(deployed.agentId); // ID созданного агента
```

### Экспорт в JSON:

```tsx
const json = await flowsAPI.exportJson('flow-id');
// Скачать файл
const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
saveAs(blob, `flow-${flowId}.json`);
```

### Импорт из JSON:

```tsx
const result = await flowsAPI.import({
  version: '1.0',
  name: flowData.name,
  definition: flowData.definition,
  status: 'draft',
  importMode: 'create_new',
  createdBy: 'user-id',
});

console.log(result.flowId); // ID импортированного флоу
```

---

## 🚀 Следующие шаги

1. ✅ Создана структура блока
2. ✅ Создан API клиент
3. ✅ Создан store
4. ✅ Созданы типы
5. ✅ Перенесён компонент EditableFlowCard
6. ⏳ Создать дополнительные компоненты
7. ⏳ Создать хуки (use-flow-list, use-flow-execution и т.д.)

---

**Дата создания:** 2 ноября 2025  
**Последнее обновление:** 2 ноября 2025
