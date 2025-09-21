# 🔄 План реализации улучшенного Kanban Workflow

## 🎯 Цель: Расширить workflow без изменения существующего кода

### 📋 Текущий workflow (НЕ ТРОГАЕМ):

```
New → AI анализ → Questions OR In Progress
```

### 🎯 Новый workflow (ДОБАВЛЯЕМ):

```
Backlog → New → AI анализ → Questions OR (выполнение → In Progress) → Review → Done
```

## 📁 Структура новых файлов:

### 1. 🔄 Workflow Module (НОВЫЙ)

```
src/workflow/
├── workflow.module.ts              // Основной модуль workflow
├── workflow.service.ts             // Оркестратор переходов
├── status-manager.service.ts       // Управление статусами
├── transition-rules.service.ts     // Правила переходов
├── workflow.controller.ts          // API для тестирования (опционально)
└── interfaces/
    ├── workflow.interface.ts       // Типы workflow
    ├── transition.interface.ts     // Типы переходов
    └── status-rules.interface.ts   // Правила статусов
```

### 2. 📢 Events Module (НОВЫЙ)

```
src/events/
├── events.module.ts               // Модуль событий
├── event-dispatcher.service.ts    // Диспетчер событий
├── event-listener.service.ts      // Слушатель событий
└── types/
    ├── workflow-events.ts         // События workflow
    └── transition-events.ts       // События переходов
```

### 3. 📊 Analytics Module (НОВЫЙ - опционально)

```
src/analytics/
├── analytics.module.ts            // Модуль аналитики
├── workflow-analytics.service.ts  // Аналитика workflow
└── interfaces/
    └── analytics.interface.ts     // Типы аналитики
```

## 🎯 Этапы реализации:

### Этап 1: Расширение типов (БЕЗОПАСНО)

**Файл:** `src/types/enums.ts`

```typescript
// ✅ ДОБАВЛЯЕМ в конец существующих enum'ов:

export enum TaskStatus {
  NEW = 'new', // Существующий
  QUESTIONS = 'questions', // Существующий
  IN_PROGRESS = 'in_progress', // Существующий
  REVIEW = 'review', // Существующий
  DONE = 'done', // Существующий
  // ✅ Новые статусы:
  BACKLOG = 'backlog', // НОВЫЙ
}

// ✅ НОВЫЙ enum для событий workflow:
export enum WorkflowEvent {
  TASK_MOVED = 'task_moved',
  STATUS_CHANGED = 'status_changed',
  EXECUTION_COMPLETED = 'execution_completed',
  REVIEW_REQUESTED = 'review_requested',
}

// ✅ НОВЫЙ enum для типов переходов:
export enum TransitionType {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
  AI_TRIGGERED = 'ai_triggered',
}
```

### Этап 2: Создание интерфейсов workflow (НОВЫЕ ФАЙЛЫ)

**Файл:** `src/workflow/interfaces/workflow.interface.ts`

```typescript
export interface WorkflowTransition {
  from: TaskStatus;
  to: TaskStatus;
  type: TransitionType;
  conditions?: TransitionCondition[];
  actions?: TransitionAction[];
}

export interface TransitionCondition {
  type: 'ai_decision' | 'execution_success' | 'manual_approval';
  value: any;
}

export interface TransitionAction {
  type: 'update_status' | 'add_comment' | 'notify_user';
  params: any;
}

export interface WorkflowState {
  taskKey: string;
  currentStatus: TaskStatus;
  previousStatus?: TaskStatus;
  transitions: WorkflowTransition[];
  metadata: any;
}
```

### Этап 3: Создание WorkflowService (НОВЫЙ ФАЙЛ)

**Файл:** `src/workflow/workflow.service.ts`

```typescript
@Injectable()
export class WorkflowService {
  // Методы для управления переходами
  async handleStatusTransition(...)
  async canTransition(...)
  async executeTransition(...)
  async getAvailableTransitions(...)
}
```

### Этап 4: Интеграция с существующими сервисами (БЕЗОПАСНО)

**В существующий файл:** `src/webhook/webhook.service.ts`

```typescript
// ✅ ДОБАВЛЯЕМ только инжекцию в конструктор:
constructor(
  private readonly aiAnalysisService: AIAnalysisService,     // Существующий
  private readonly kanbanService: KanbanService,             // Существующий
  private readonly taskExecutorService: TaskExecutorService, // Существующий
  // ✅ НОВЫЙ сервис:
  private readonly workflowService: WorkflowService,         // НОВЫЙ
) {}

// ✅ ДОБАВЛЯЕМ вызов в конец существующих методов:
async processNewIssue(payload: JiraWebhookDto) {
  // Вся существующая логика остается без изменений

  // ✅ ДОБАВЛЯЕМ в конце:
  await this.workflowService.handleStatusTransition(payload);
}
```

### Этап 5: Новые методы KanbanService (ДОБАВЛЯЕМ, НЕ МЕНЯЕМ)

**В существующий файл:** `src/kanban/kanban.service.ts`

```typescript
// ✅ ДОБАВЛЯЕМ новые методы в конец класса:

async moveToReview(taskKey: string, comment?: string): Promise<boolean> {
  // Новый метод для перемещения в Review
}

async moveToBacklog(taskKey: string): Promise<boolean> {
  // Новый метод для перемещения в Backlog
}

async getTaskStatus(taskKey: string): Promise<TaskStatus> {
  // Новый метод для получения текущего статуса
}
```

## 🎮 API для тестирования (НОВЫЕ ENDPOINTS)

### Файл: `src/workflow/workflow.controller.ts`

```typescript
@Controller('workflow')
export class WorkflowController {
  @Post('transition/:taskKey')
  async triggerTransition() {}

  @Get('status/:taskKey')
  async getTaskWorkflowState() {}

  @Post('test-scenario')
  async testWorkflowScenario() {}
}
```

## 🧪 Тестовые сценарии:

### Сценарий 1: Полный цикл задачи

1. Создать задачу в Backlog (вручную в Jira)
2. Переместить в New (webhook триггер)
3. AI анализ → выполнение → In Progress
4. Автоматическое перемещение в Review
5. Manual approval → Done

### Сценарий 2: Задача с вопросами

1. Создать неясную задачу в Backlog
2. Переместить в New
3. AI анализ → Questions
4. Manual уточнение → обратно в New
5. Повторный анализ → выполнение

## 🔒 Гарантии безопасности:

✅ Существующий код остается нетронутым
✅ Новая функциональность изолирована в отдельных модулях  
✅ Интеграция только через DI и вызовы новых методов
✅ Fallback на существующую логику при ошибках
✅ Можно отключить новую функциональность через config

## 🚀 Готовы начинать реализацию?

Какой этап начнем первым?
