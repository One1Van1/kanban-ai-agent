# 🏷️ Types Module

## 📍 Расположение: `src/types/`

## 🎯 Назначение

Модуль **Types** содержит все общие типы данных, интерфейсы и перечисления, используемые во всем приложении. Это центральное место для определения структур данных, что обеспечивает типобезопасность и консистентность кода.

## 📁 Структура

```
src/types/
├── index.ts        # Центральный экспорт всех типов
├── enums.ts        # Перечисления (enums)
└── interfaces.ts   # Интерфейсы и типы
```

## 🔧 Основные компоненты

### 🟡 `enums.ts` — Перечисления

#### 📊 `TaskStatus`

Статусы задач в канбан-доске:

```typescript
enum TaskStatus {
  NEW = 'new', // Новая задача
  QUESTIONS = 'questions', // Требуются уточнения
  IN_PROGRESS = 'in_progress', // В работе
  REVIEW = 'review', // На ревью
  DONE = 'done', // Завершена
}
```

#### 🎯 `Priority`

Приоритеты задач:

```typescript
enum Priority {
  LOW = 'low', // Низкий приоритет
  MEDIUM = 'medium', // Средний приоритет
  HIGH = 'high', // Высокий приоритет
  CRITICAL = 'critical', // Критический приоритет
}
```

#### 🤖 `AIDecision`

Решения AI анализа:

```typescript
enum AIDecision {
  QUESTIONS = 'questions', // Нужны уточнения
  IN_PROGRESS = 'in_progress', // Можно выполнять
}
```

### 🟢 `interfaces.ts` — Интерфейсы

#### 📋 `Task`

Основная модель задачи:

```typescript
interface Task {
  id: string; // Уникальный ID в нашей системе
  title: string; // Название задачи
  description: string; // Описание задачи
  status: TaskStatus; // Текущий статус
  priority?: Priority; // Приоритет
  labels?: string[]; // Метки/теги
  assignee?: string; // Исполнитель
  createdAt: Date; // Дата создания
  updatedAt: Date; // Дата обновления
  kanbanSystemId: string; // ID канбан-системы
  kanbanTaskId: string; // ID в канбан-системе
  kanbanUrl?: string; // URL задачи
}
```

#### 🔍 `TaskAnalysisRequest`

Данные для анализа AI:

```typescript
interface TaskAnalysisRequest {
  title: string; // Название задачи
  description: string; // Описание
  context?: string; // Дополнительный контекст
  priority?: Priority; // Приоритет
  labels?: string[]; // Метки
}
```

#### 🧠 `AIAnalysisResult`

Результат анализа AI:

```typescript
interface AIAnalysisResult {
  decision: AIDecision; // Принятое решение
  reasoning: string; // Обоснование
  questions?: string[]; // Вопросы (если нужны)
  confidence: number; // Уверенность (0-1)
  suggestedActions?: string[]; // Предлагаемые действия
}
```

#### ⚙️ `KanbanConfig`

Конфигурация канбан-системы:

```typescript
interface KanbanConfig {
  type: 'jira'; // Тип системы
  baseUrl: string; // URL инстанса
  credentials: {
    // Учетные данные
    email: string;
    apiToken: string;
  };
  projectId: string; // ID проекта
  statusMapping: {
    // Маппинг статусов
    [key in TaskStatus]: string;
  };
}
```

## 🔗 Использование в проекте

### Import примеры:

```typescript
// Импорт всех типов
import { Task, TaskStatus, Priority, AIDecision } from '../types';

// Импорт конкретных типов
import { TaskAnalysisRequest, AIAnalysisResult } from '../types/interfaces';
import { TaskStatus } from '../types/enums';
```

### Примеры использования:

#### Создание задачи:

```typescript
const newTask: Task = {
  id: 'task-001',
  title: 'Создать API для пользователей',
  description: 'Разработать REST API для управления пользователями',
  status: TaskStatus.NEW,
  priority: Priority.HIGH,
  labels: ['api', 'backend'],
  assignee: 'john.doe@company.com',
  createdAt: new Date(),
  updatedAt: new Date(),
  kanbanSystemId: 'jira-main',
  kanbanTaskId: 'PROJ-123',
  kanbanUrl: 'https://company.atlassian.net/browse/PROJ-123',
};
```

#### Обработка результата AI:

```typescript
const analysisResult: AIAnalysisResult = {
  decision: AIDecision.IN_PROGRESS,
  reasoning: 'Задача четко сформулирована и содержит достаточно деталей',
  confidence: 0.85,
  suggestedActions: [
    'Создать Entity для User',
    'Создать UserService с CRUD операциями',
    'Создать UserController',
  ],
};
```

## 🔗 Связи с модулями

### Используется в:

- **AI Analysis Module** — для типизации запросов и ответов
- **Kanban Module** — для работы с задачами и статусами
- **Task Executor Module** — для планирования выполнения
- **Webhook Module** — для обработки входящих данных
- **DTO Module** — для валидации входных данных

### Преимущества централизованных типов:

- ✅ **Типобезопасность** — компилятор отловит ошибки несоответствия типов
- ✅ **Консистентность** — одинаковая структура данных во всем приложении
- ✅ **Maintainability** — изменения в одном месте применяются везде
- ✅ **IDE Support** — автодополнение и подсказки типов
- ✅ **Документация** — типы служат живой документацией

## 🚀 Расширение типов

При добавлении новых фич легко расширить типы:

```typescript
// Добавление нового статуса
enum TaskStatus {
  // ... существующие
  TESTING = 'testing',
}

// Добавление нового поля в Task
interface Task {
  // ... существующие поля
  estimatedHours?: number;
  actualHours?: number;
}
```

---

**Types Module — фундамент типобезопасности всего приложения!** 🏗️✨
