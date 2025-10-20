# Types Documentation

TypeScript типы и интерфейсы для приложения.

## 🎯 Назначение

Централизованная типизация для обеспечения type-safety во всем фронтенде.

## 📁 Структура

```
src/types/
└── flow-builder.ts      # Типы для Flow Builder
```

## ⚙️ Основные типы

### Flow Builder Types

**Файл:** `src/types/flow-builder.ts`

```typescript
import { Node, Edge } from 'reactflow';

// Типы блоков
export type FlowBlockType = 'start' | 'action' | 'condition' | 'end';

// Интерфейс блока
export interface FlowBlock extends Node {
  id: string;
  type: FlowBlockType;
  position: Position;
  data: FlowBlockData;
}

// Данные блока
export interface FlowBlockData {
  label: string;
  config?: BlockConfig;
  icon?: string;
}

// Конфиг блока
export interface BlockConfig {
  actionType?: 'ai' | 'http' | 'transform';
  prompt?: string;
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  condition?: string;
  [key: string]: any;
}

// Связь между блоками
export interface FlowEdge extends Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  type?: EdgeType;
}

// Тип связи
export type EdgeType = 'default' | 'straight' | 'step' | 'smoothstep';

// Позиция
export interface Position {
  x: number;
  y: number;
}

// Полное определение флоу
export interface FlowDefinition {
  id: string;
  name: string;
  description?: string;
  blocks: FlowBlock[];
  edges: FlowEdge[];
  variables?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

// DTO для создания флоу
export interface CreateFlowDto {
  name: string;
  description?: string;
  blocks: FlowBlock[];
  edges: FlowEdge[];
}

// DTO для обновления флоу
export interface UpdateFlowDto {
  name?: string;
  description?: string;
  blocks?: FlowBlock[];
  edges?: FlowEdge[];
}
```

---

## 📋 Другие типы (примеры)

### Kanban Types

```typescript
// Типы для канбан-доски
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
  order: number;
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
}
```

### Agent Types

```typescript
// Типы для AI агентов
export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  instruction: string;
  status: AgentStatus;
  config?: AgentConfig;
  createdAt: Date;
}

export type AgentType = 'task_creator' | 'task_analyzer' | 'custom';

export type AgentStatus = 'idle' | 'running' | 'completed' | 'failed';

export interface AgentConfig {
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface AgentResult {
  agentId: string;
  result: any;
  executionTime: number;
  success: boolean;
  error?: string;
}
```

### API Types

```typescript
// Типы для API ответов
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
```

---

## 📋 Создание новых типов

### 1. Создайте файл типов

```typescript
// src/types/my-feature.ts
export interface MyData {
  id: string;
  name: string;
  value: number;
}

export type MyStatus = 'active' | 'inactive';

export interface MyConfig {
  option1: string;
  option2?: boolean;
}
```

### 2. Экспортируйте

```typescript
// src/types/index.ts
export * from './flow-builder';
export * from './my-feature';
```

### 3. Используйте

```typescript
import { FlowBlock, MyData } from '@/types';

const block: FlowBlock = { ... };
const data: MyData = { ... };
```

---

## 🎯 Best Practices

### Именование

- ✅ PascalCase для интерфейсов и типов
- ✅ Суффикс `Dto` для Data Transfer Objects
- ✅ Префикс `I` НЕ используем (Interface)
- ✅ Описательные имена

### Структура

- ✅ Группируйте связанные типы
- ✅ Используйте barrel exports
- ✅ Разделяйте domain и API типы
- ✅ Документируйте сложные типы

### Использование

- ✅ `interface` для объектов
- ✅ `type` для unions/intersections
- ✅ `enum` для констант (осторожно!)
- ✅ Utility types (Partial, Pick, Omit)

### Избегайте

- ❌ `any` (используйте `unknown`)
- ❌ Дублирования типов
- ❌ Слишком общих типов
- ❌ Типов только в одном месте

---

## 🔧 Utility Types

### Встроенные TypeScript

```typescript
// Partial - все поля optional
type PartialTask = Partial<Task>;

// Pick - выбрать поля
type TaskSummary = Pick<Task, 'id' | 'title'>;

// Omit - исключить поля
type CreateTask = Omit<Task, 'id' | 'createdAt'>;

// Required - все поля обязательные
type RequiredConfig = Required<AgentConfig>;

// Readonly - иммутабельность
type ReadonlyTask = Readonly<Task>;
```

### Кастомные

```typescript
// Nullable
type Nullable<T> = T | null;

// Maybe
type Maybe<T> = T | undefined;

// Result
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };
```

---

## 📊 Type Guards

```typescript
// Проверка типа блока
export function isActionBlock(
  block: FlowBlock,
): block is FlowBlock & { type: 'action' } {
  return block.type === 'action';
}

// Использование
if (isActionBlock(block)) {
  // TypeScript знает, что block.type === 'action'
  console.log(block.data.config?.actionType);
}
```

---

## 🔗 Связи

**Используется в:**

- Components (props типизация)
- Hooks (параметры и возвраты)
- Stores (state типизация)
- API calls (request/response)

**Экспортируется через:**

- Barrel exports (`index.ts`)
- Direct imports
