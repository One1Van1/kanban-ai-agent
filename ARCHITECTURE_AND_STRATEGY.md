# 🏗️ Архитектура Flow Builder и Стратегия Изменений

> **Дата:** 3 ноября 2025 г.  
> **Цель:** Понять из чего состоят блоки и как их правильно изменить

---

## 📐 ИЗ ЧЕГО СОСТОИТ СИСТЕМА КАНВАСА

### 1. **ReactFlow - Основа канваса**

```
@xyflow/react - библиотека для drag-and-drop канваса
```

### 2. **Компонентная структура**

```
kan-front/src/views/flow-builder/
├── FlowBuilderPage.tsx          # Главная страница
│
├── components/
│   ├── canvas/
│   │   └── FlowCanvas.tsx        # ❗ ГЛАВНЫЙ компонент канваса
│   │       ├── nodeTypes         # ❗ Регистрация типов блоков
│   │       └── edgeTypes         # Типы соединений
│   │
│   ├── blocks/                   # ❗ КОМПОНЕНТЫ БЛОКОВ
│   │   ├── TriggerBlock.tsx      # ❗ Блок триггеров
│   │   ├── ContextBlock.tsx      # ❗ Блок контекста
│   │   ├── LogicBlock.tsx        # ❗ Блок логики
│   │   ├── ActionBlock.tsx       # ❗ Блок действий
│   │   ├── WaitBlock.tsx         # ❗ Блок ожидания
│   │   ├── ResultBlock.tsx       # ❌ УДАЛИТЬ (дубликат)
│   │   └── ConnectionHandle.tsx  # Handles для соединений
│   │
│   ├── sidebar/
│   │   └── BlockPalette.tsx      # ❗ ПАЛИТРА блоков (sidebar)
│   │       ├── PALETTE_BLOCKS    # ❗ Список всех блоков
│   │       ├── getBlockInfo()    # Информация о блоке
│   │       ├── getDefaultConfig()# Дефолтная конфигурация
│   │       └── createBlockPreview() # Drag preview
│   │
│   ├── toolbar/
│   │   └── FlowToolbar.tsx       # Тулбар
│   │
│   └── dialogs/
│       └── ...                   # Диалоги
│
└── hooks/
    └── ...

kan-front/src/features/flow-builder/
├── types/
│   └── index.ts                  # ❗ TYPESCRIPT ТИПЫ
│       ├── TriggerBlock          # ❗ Интерфейс триггера
│       ├── ContextBlock          # ❗ Интерфейс контекста
│       ├── LogicBlock            # ❗ Интерфейс логики
│       ├── ActionBlock           # ❗ Интерфейс действий
│       ├── WaitBlock             # ❗ Интерфейс ожидания
│       └── FlowDefinition        # Полное определение потока
│
└── stores/
    └── flow-builder.store.ts     # Zustand store
```

---

## 🎯 ИЗ ЧЕГО СОСТОИТ БЛОК

### Каждый блок имеет 4 уровня:

#### 1️⃣ **TypeScript Типы** (`types/index.ts`)

```typescript
export interface TriggerBlock {
  id: string;
  type: 'board_move' | 'webhook' | 'schedule'; // ❗ ТИПЫ БЛОКА
  name: string;
  config: {
    // ❗ КОНФИГУРАЦИЯ
    boardType?: string;
    webhookUrl?: string;
    // ...
  };
}
```

#### 2️⃣ **React Компонент** (`blocks/TriggerBlock.tsx`)

```tsx
export function TriggerBlock({ data, id, selected }: Props) {
  // ❗ ВИЗУАЛИЗАЦИЯ блока на канвасе
  // - UI (Card, inputs, buttons)
  // - Логика редактирования
  // - Handles для соединений
}
```

#### 3️⃣ **Регистрация в ReactFlow** (`FlowCanvas.tsx`)

```typescript
const nodeTypes = {
  trigger: TriggerBlock, // ❗ Регистрация компонента
  context: ContextBlock,
  logic: LogicBlock,
  action: ActionBlock,
  wait: WaitBlock,
};
```

#### 4️⃣ **Палитра** (`BlockPalette.tsx`)

```typescript
const PALETTE_BLOCKS = [
  {
    type: 'board_move',      // ❗ ТИП блока
    category: 'trigger',     // ❗ КАТЕГОРИЯ
    icon: <GitBranch />,     // ❗ ИКОНКА
    color: 'text-green-600', // ❗ ЦВЕТ
  },
  // ...
];
```

---

## 🔍 КАК СИСТЕМА РАБОТАЕТ

### 1. **Drag & Drop из палитры**

```
BlockPalette.tsx
  ├── PALETTE_BLOCKS[]           # Список доступных блоков
  ├── onDragStart()              # Создание preview
  │   └── createBlockPreview()   # Pixel-perfect preview
  └── onAddBlock()               # Создание нового блока
      └── FlowCanvas.handleDrop()
          └── Создание Node в ReactFlow
```

### 2. **Отображение блока на канвасе**

```
ReactFlow
  ├── nodes[]                    # Массив блоков
  ├── nodeTypes                  # Маппинг type → Component
  └── Рендер блоков
      └── TriggerBlock.tsx (если type='trigger')
          ├── Читает data.type   # 'board_move', 'webhook', etc.
          ├── Рендерит UI
          └── Показывает config
```

### 3. **Редактирование блока**

```
TriggerBlock.tsx
  ├── isEditing state           # Режим редактирования
  ├── toggleEdit()              # Включить/выключить
  ├── Input поля               # Редактирование config
  └── saveEdit()               # Сохранение в node.data.config
```

### 4. **Сохранение потока**

```
FlowCanvas.tsx
  ├── saveFlow()
  └── convertNodesToFlowDefinition()
      ├── Собирает nodes[]
      ├── Собирает edges[]
      └── Создает FlowDefinition
          └── API.save(flowDefinition)
```

---

## 🎨 СТРАТЕГИЯ ИЗМЕНЕНИЙ

### ❓ **Что нужно изменить и где?**

---

## ✅ СЛУЧАЙ 1: Изменить ТОЛЬКО НАЗВАНИЕ блока

**Пример:** `send_notification` → `send_message`

### Где менять:

1. ✏️ **BlockPalette.tsx** - название в палитре

```typescript
const blockNames = {
  send_notification: 'Send Message', // Просто меняем текст
};
```

2. ✏️ **i18n translations** - переводы

```typescript
'send_notification': {
  name: 'Отправить сообщение',
  description: '...'
}
```

### ✅ РЕЗУЛЬТАТ:

- Блок остается работать
- Меняется только отображаемый текст
- Старые потоки совместимы

---

## ⚠️ СЛУЧАЙ 2: Изменить ФУНКЦИОНАЛ блока

**Пример:** Добавить новые поля в `config` для `webhook`

### Где менять:

1. 📝 **types/index.ts** - добавить поля в интерфейс

```typescript
export interface TriggerBlock {
  config: {
    webhookUrl?: string;
    method?: 'POST' | 'GET'; // ✅ НОВОЕ
    headers?: Record<string, string>; // ✅ НОВОЕ
  };
}
```

2. 🎨 **TriggerBlock.tsx** - добавить UI для новых полей

```tsx
{
  data.type === 'webhook' && (
    <>
      <Select value={config.method}>...</Select> {/* ✅ НОВОЕ */}
      <Input value={config.headers}>...</Input> {/* ✅ НОВОЕ */}
    </>
  );
}
```

3. 🔧 **BlockPalette.tsx** - обновить дефолтную конфигурацию

```typescript
case 'webhook':
  return {
    webhookUrl: '',
    method: 'POST',           // ✅ НОВОЕ
    headers: {},              // ✅ НОВОЕ
  };
```

### ✅ РЕЗУЛЬТАТ:

- Блок получил новый функционал
- Старые потоки работают (новые поля опциональные)
- UI показывает новые настройки

---

## 🔥 СЛУЧАЙ 3: ДОБАВИТЬ новый ТИП блока

**Пример:** Добавить `manual_trigger` в триггеры

### Где менять:

1. 📝 **types/index.ts** - добавить тип

```typescript
export interface TriggerBlock {
  type: 'board_move' | 'webhook' | 'schedule' | 'manual_trigger'; // ✅ ДОБАВИТЬ

  config: {
    // Для manual_trigger
    allowedUsers?: string[]; // ✅ ДОБАВИТЬ
    requireConfirmation?: boolean;
  };
}
```

2. 🎨 **TriggerBlock.tsx** - добавить UI для нового типа

```tsx
const getIcon = () => {
  switch (data.type) {
    case 'board_move':
      return <GitBranch />;
    case 'webhook':
      return <Globe />;
    case 'manual_trigger':
      return <Play />; // ✅ ДОБАВИТЬ
  }
};

// В рендере добавить специфичные поля
{
  data.type === 'manual_trigger' && (
    <div>
      <Input placeholder="Allowed Users" />
      <Checkbox label="Require Confirmation" />
    </div>
  );
}
```

3. 🎯 **BlockPalette.tsx** - добавить в палитру

```typescript
const PALETTE_BLOCKS = [
  // ...
  {
    type: 'manual_trigger',       // ✅ ДОБАВИТЬ
    category: 'trigger',
    icon: <Play />,
    color: 'text-green-600',
  },
];

// В getDefaultConfig
case 'manual_trigger':
  return {
    allowedUsers: [],
    requireConfirmation: true,
  };
```

4. 🔤 **i18n translations** - добавить переводы

```json
{
  "manual_trigger": {
    "name": "Manual Trigger",
    "description": "Start flow manually"
  }
}
```

### ✅ РЕЗУЛЬТАТ:

- Новый тип появился в палитре
- Можно добавить на канвас
- Работает как остальные блоки

---

## ❌ СЛУЧАЙ 4: УДАЛИТЬ ТИП блока

**Пример:** Удалить `board_move` (специфично для досок)

### Где менять:

1. 📝 **types/index.ts** - убрать из union type

```typescript
export interface TriggerBlock {
  type: // | 'board_move'    // ❌ УДАЛИТЬ
  'webhook' | 'schedule';
}
```

2. 🎨 **TriggerBlock.tsx** - убрать специфичный код

```tsx
const getIcon = () => {
  switch (data.type) {
    // case 'board_move':     // ❌ УДАЛИТЬ
    //   return <GitBranch />;
    case 'webhook':
      return <Globe />;
  }
};
```

3. 🎯 **BlockPalette.tsx** - убрать из палитры

```typescript
const PALETTE_BLOCKS = [
  // { type: 'board_move', ... },  // ❌ УДАЛИТЬ
  { type: 'webhook', ... },
];
```

4. 🔧 **Миграция** - что делать со старыми потоками?

```typescript
// Опция 1: Заменить на новый тип
if (block.type === 'board_move') {
  block.type = 'event_listener';
  block.config.eventSource = 'board';
  block.config.eventType = 'card_moved';
}

// Опция 2: Удалить блок (с предупреждением)
```

### ⚠️ ПРОБЛЕМА:

- Старые потоки сломаются!
- Нужна миграция

---

## 🚀 СЛУЧАЙ 5: ПОЛНОСТЬЮ ПЕРЕДЕЛАТЬ блок

**Пример:** TriggerBlock - убрать привязку к доскам

### Где менять:

1. 📝 **types/index.ts** - ПОЛНОСТЬЮ переписать интерфейс

```typescript
// ❌ СТАРОЕ
export interface TriggerBlock {
  config: {
    boardType: 'jira' | 'trello';
    event: 'card_moved' | 'card_created';
    targetColumn: string;
  };
}

// ✅ НОВОЕ
export interface TriggerBlock {
  config: {
    // Для webhook - универсальный HTTP
    webhookUrl?: string;
    method?: string;

    // Для schedule - универсальный cron
    cronExpression?: string;

    // Для event_listener - универсальные события
    eventSource?: 'board' | 'user' | 'system';
    eventType?: string;
  };
}
```

2. 🎨 **TriggerBlock.tsx** - ПОЛНОСТЬЮ переписать UI

```tsx
// ❌ УДАЛИТЬ старые поля (boardType, targetColumn)
// ✅ ДОБАВИТЬ новые поля (webhookUrl, cronExpression)
```

3. 🎯 **BlockPalette.tsx** - обновить типы и конфигурации

```typescript
// ❌ УДАЛИТЬ: board_move, board_create
// ✅ ДОБАВИТЬ: webhook (новый), schedule, event_listener, manual_trigger
```

4. 🔧 **Миграция** - ОБЯЗАТЕЛЬНА!

```typescript
function migrateOldTriggers(oldFlow: FlowDefinition) {
  oldFlow.triggers = oldFlow.triggers.map((trigger) => {
    if (trigger.type === 'board_move') {
      return {
        type: 'event_listener',
        config: {
          eventSource: 'board',
          eventType: 'card_moved',
          filters: {
            boardType: trigger.config.boardType,
            targetColumn: trigger.config.targetColumn,
          },
        },
      };
    }
    return trigger;
  });
}
```

### ⚠️ КРИТИЧНО:

- Обратная несовместимость!
- Нужен план миграции
- Версионирование схемы

---

## 📋 ВСТРОИТЬ функционал (Set Variable, Wait Response)

**Задача:** Добавить `saveToVariable` во ВСЕ блоки

### Стратегия:

1. 📝 **types/index.ts** - создать общий интерфейс

```typescript
export interface WithVariableStorage {
  saveToVariable?: boolean;
  variableName?: string;
}

// Расширить все блоки
export interface TriggerBlock {
  config: {
    ...
  } & WithVariableStorage;  // ✅ ДОБАВИТЬ
}

export interface ActionBlock {
  config: {
    ...
  } & WithVariableStorage;  // ✅ ДОБАВИТЬ
}
// И так далее для всех
```

2. 🎨 **Создать общий компонент** `VariableStorageControl.tsx`

```tsx
export function VariableStorageControl({ config, onChange }) {
  return (
    <div>
      <Checkbox
        checked={config.saveToVariable}
        onChange={(v) => onChange('saveToVariable', v)}
      />
      {config.saveToVariable && (
        <Input
          placeholder="Variable name"
          value={config.variableName}
          onChange={(v) => onChange('variableName', v)}
        />
      )}
    </div>
  );
}
```

3. 🔧 **Встроить во ВСЕ блоки**

```tsx
// TriggerBlock.tsx
import { VariableStorageControl } from './VariableStorageControl';

export function TriggerBlock({ data, id }) {
  return (
    <Card>
      {/* Основная конфигурация */}
      <Input ... />

      {/* ✅ ВСТРОИТЬ компонент */}
      <VariableStorageControl
        config={data.config}
        onChange={updateFormData}
      />
    </Card>
  );
}

// То же самое в ActionBlock, ContextBlock, WaitBlock
```

### ✅ РЕЗУЛЬТАТ:

- Все блоки могут сохранять результат
- Единый UI компонент
- Легко поддерживать

---

## 📊 ИТОГОВАЯ СТРАТЕГИЯ ДЛЯ НАШЕГО ПРОЕКТА

### Уровни изменений:

| Тип изменения         | Где менять                         | Сложность       | Совместимость       |
| --------------------- | ---------------------------------- | --------------- | ------------------- |
| **Текст блока**       | BlockPalette, i18n                 | 🟢 Легко        | ✅ Полная           |
| **Новые поля config** | types + компонент + palette        | 🟡 Средне       | ✅ Обратная         |
| **Новый тип блока**   | types + компонент + palette + i18n | 🟠 Средне       | ✅ Полная           |
| **Удалить тип**       | Везде + миграция                   | 🔴 Сложно       | ❌ Требует миграции |
| **Переделать блок**   | Полностью переписать + миграция    | 🔴 Очень сложно | ❌ Требует миграции |
| **Встроить функцию**  | Общий компонент → все блоки        | 🟡 Средне       | ✅ Обратная         |

---

## 🎯 КОНКРЕТНО ДЛЯ НАШИХ БЛОКОВ

### 1. **TriggerBlock - ПОЛНОСТЬЮ ПЕРЕДЕЛАТЬ**

- ❌ Удалить: `board_move`, `board_create`, `board_update`
- ✅ Добавить: `webhook` (новый), `schedule`, `event_listener`, `manual_trigger`
- ⚠️ Убрать ВСЕ поля для досок из config
- 🔧 **Миграция обязательна!**

### 2. **ContextBlock - РАСШИРИТЬ**

- ✅ Добавить типы: `extract_text`, `extract_media`, `get_data`, `rag_processing`, `transform_data`
- ⚠️ Расширить `extract_files` - больше sources
- ✅ **Совместимость сохраняется**

### 3. **ActionBlock - ДОБАВИТЬ + ПЕРЕИМЕНОВАТЬ**

- ✅ Добавить: `api_call`, `mcp_operation`, `store_data`
- ✏️ Переименовать: `send_notification` → `send_message`, `create_file` → `generate_file`
- ⚠️ Добавить шаблоны в `generate_file`
- ✅ **Миграция мягкая** (переименование)

### 4. **LogicBlock - БЕЗ ИЗМЕНЕНИЙ**

- ✅ Все типы уже есть

### 5. **WaitBlock - БЕЗ ИЗМЕНЕНИЙ**

- ✅ Все типы уже есть
- ✅ Встроить как опцию в ActionBlock

### 6. **ResultBlock - УДАЛИТЬ**

- ❌ Полностью удалить файл
- ❌ Убрать из nodeTypes
- 🔧 Заменить на `LogicBlock.ai_result`

### 7. **Set Variable - ВСТРОИТЬ**

- ✅ Создать `WithVariableStorage` интерфейс
- ✅ Создать `VariableStorageControl` компонент
- ✅ Встроить во все блоки

### 8. **Wait Response - ВСТРОИТЬ**

- ✅ Создать `WithAsyncControl` интерфейс
- ✅ Создать `AsyncControl` компонент
- ✅ Встроить в ActionBlock для AI, API, MCP

---

## ✅ ПОРЯДОК ДЕЙСТВИЙ

1. ✅ **Сначала:** Встроить Set Variable и Wait Response (общие компоненты)
2. ✅ **Потом:** Добавить новые типы в существующие блоки (ContextBlock, ActionBlock)
3. ⚠️ **Осторожно:** Переделать TriggerBlock (с миграцией)
4. ❌ **В конце:** Удалить ResultBlock

---

**Готово! Теперь понятно?** 🚀
