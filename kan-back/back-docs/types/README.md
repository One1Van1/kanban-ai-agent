# TypeScript Types & Interfaces

Типы и интерфейсы для типизации всего приложения.

## 🎯 Назначение

Централизованное хранение типов, интерфейсов и type definitions для обеспечения type-safety во всем проекте.

## 📁 Структура типов

| Файл                             | Описание          | Основные типы                             |
| -------------------------------- | ----------------- | ----------------------------------------- |
| `ai-agent.interface.ts`          | Типы AI агентов   | `Agent`, `AgentConfig`, `AgentStatus`     |
| `flow-definition.types.ts`       | Типы флоу-билдера | `FlowBlock`, `FlowEdge`, `FlowDefinition` |
| `board-integration.interface.ts` | Интеграции досок  | `BoardConnection`, `SyncSettings`         |
| `board-service.interface.ts`     | Сервисы досок     | `IBoardService`, `TaskFilter`             |
| `jira-board.interface.ts`        | Jira типы         | `JiraCredentials`, `JiraProject`          |
| `jira-task.interface.ts`         | Jira задачи       | `JiraIssue`, `JiraField`                  |
| `kanban-column.interface.ts`     | Канбан колонки    | `Column`, `ColumnSettings`                |
| `context.interface.ts`           | AI контекст       | `Context`, `ContextWindow`                |

## ⚙️ Основные возможности

- ✅ Строгая типизация TypeScript
- ✅ Автокомплит в IDE
- ✅ Раннее обнаружение ошибок
- ✅ Самодокументирование кода
- ✅ Рефакторинг безопасность
- ✅ Переиспользование типов

## 🔧 Примеры использования

### Интерфейсы

```typescript
// ai-agent.interface.ts
export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  config: AgentConfig;
  instructions: AgentInstruction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  tools?: string[];
}

export enum AgentType {
  TASK_CREATOR = 'task_creator',
  TASK_ANALYZER = 'task_analyzer',
  CUSTOM = 'custom',
}

export enum AgentStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}
```

### Type Definitions

```typescript
// flow-definition.types.ts
export type FlowBlock = {
  id: string;
  type: FlowBlockType;
  position: Position;
  data: FlowBlockData;
};

export type FlowEdge = {
  id: string;
  source: string;
  target: string;
  type?: EdgeType;
  label?: string;
};

export type FlowDefinition = {
  blocks: FlowBlock[];
  edges: FlowEdge[];
  variables?: Record<string, any>;
};

export type FlowBlockType = 'start' | 'action' | 'condition' | 'end';
```

### Utility Types

```typescript
// Частичное обновление
export type UpdateAgent = Partial<Agent>;

// Только для создания (без ID)
export type CreateAgent = Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>;

// Только чтение
export type ReadonlyAgent = Readonly<Agent>;

// Выборочные поля
export type AgentSummary = Pick<Agent, 'id' | 'name' | 'status'>;
```

### Generic Types

```typescript
// Обертка для API ответов
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Пагинация
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Результат с ошибками
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };
```

## 📋 Создание новых типов

### 1. Определите интерфейс

```typescript
// feature.interface.ts
export interface Feature {
  id: string;
  name: string;
  enabled: boolean;
  config?: FeatureConfig;
}

export interface FeatureConfig {
  setting1: string;
  setting2: number;
}
```

### 2. Добавьте DTOs

```typescript
export class CreateFeatureDto implements Omit<Feature, 'id'> {
  @IsString()
  name: string;

  @IsBoolean()
  enabled: boolean;

  @IsOptional()
  @ValidateNested()
  config?: FeatureConfig;
}
```

### 3. Добавьте утилитные типы

```typescript
export type UpdateFeature = Partial<Feature>;
export type FeatureWithRelations = Feature & {
  relatedItems: RelatedItem[];
};
```

## 🎯 Категории типов

### Domain Types

Бизнес-логика приложения

```typescript
interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}
```

### DTO Types

Data Transfer Objects для API

```typescript
class CreateTaskDto {
  @IsString()
  title: string;
}
```

### Config Types

Конфигурация и настройки

```typescript
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
}
```

### Response Types

API ответы

```typescript
interface TaskResponse {
  task: Task;
  metadata: Metadata;
}
```

## 🔍 Type Guards

```typescript
// Проверка типа
export function isAgent(obj: any): obj is Agent {
  return obj && typeof obj.id === 'string' && 'type' in obj;
}

// Использование
if (isAgent(data)) {
  // TypeScript знает, что data это Agent
  console.log(data.name);
}
```

## 🎯 Best Practices

### Именование

- ✅ Интерфейсы: `PascalCase` (Agent, Task)
- ✅ Types: `PascalCase` (FlowBlock, EdgeType)
- ✅ Enums: `PascalCase` (AgentStatus, TaskType)
- ✅ Без префикса `I` (Agent, не IAgent)

### Организация

- ✅ Группируйте связанные типы в один файл
- ✅ Используйте barrel exports (`index.ts`)
- ✅ Разделяйте domain и DTO типы
- ✅ Документируйте сложные типы

### Использование

- ✅ Предпочитайте `interface` над `type` для объектов
- ✅ Используйте `type` для unions и intersections
- ✅ Используйте `Readonly` для иммутабельности
- ✅ Используйте `Partial`, `Pick`, `Omit` для утилит

### Избегайте

- ❌ `any` типов (используйте `unknown`)
- ❌ Дублирования типов
- ❌ Слишком общих типов
- ❌ Типов только в одном месте

## 📊 Связи типов

```typescript
// Композиция
interface AgentWithContext extends Agent {
  context: Context;
}

// Union
type Status = 'active' | 'inactive' | 'pending';

// Intersection
type AgentTask = Agent & Task;

// Conditional
type ResponseType<T> = T extends Agent ? AgentResponse : TaskResponse;
```

## 🔗 Связи

**Используется в:**

- Все модули и сервисы
- Controllers (для validation)
- DTOs (для типизации)
- Entities (для свойств)
- Tests (для моков)

**Экспортируется через:**

- Barrel exports (`index.ts`)
- Feature-специфичные экспорты
