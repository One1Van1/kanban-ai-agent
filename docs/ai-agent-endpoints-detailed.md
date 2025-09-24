# 🎯 Документация Endpoint модулей AI Agent

## 1. 📊 `analyze-new-tasks/`

**Endpoint**: `POST /ai-agent/analyze-new-tasks`  
**Назначение**: Анализ всех задач в колонке "New"

### Файлы модуля:

#### `analyze-new-tasks.controller.ts`

- **HTTP метод**: POST
- **Swagger tags**: 'ai-agent'
- **Описание**: "AI анализирует все задачи в колонке New и перемещает понятные в In Progress, непонятные в Questions"
- **Возвращает**: `AnalyzeNewTasksResponse`

#### `analyze-new-tasks.service.ts`

**Основная логика**:

1. Получает задачи из колонки "New" (макс. 50)
2. Анализирует каждую задачу через `analyzeNewTask()` из `AiBaseService`
3. Выполняет решения через `executeTaskDecision()`
4. Возвращает статистику

**Пример ответа**:

```json
{
  "tasksAnalyzed": 3,
  "tasksMoved": 2,
  "results": [
    {
      "taskKey": "KAN-5",
      "decision": "move_to_progress",
      "reason": "Task is clear and well-defined",
      "moved": true
    }
  ]
}
```

---

## 2. ✂️ `analyze-haircut-tasks/`

**Endpoint**: `POST /ai-agent/analyze-haircut-tasks`  
**Назначение**: Специализированный анализ задач о стрижках

### Файлы модуля:

#### `analyze-haircut-tasks.service.ts`

**Расширенная логика анализа**:

**Метод `execute(dto)`**:

1. Получает задачи из указанной колонки (по умолчанию "New")
2. Для каждой задачи получает полную информацию через `getTaskService`
3. Создает `HaircutTaskDetails` с информацией о вложениях
4. Анализирует через `analyzeSpecificHaircutTask()`

**Метод `analyzeSpecificHaircutTask(task)`**:

- **Проверка типа**: `isSpecificHaircutRelated()` - проверяет ключевые слова стрижек
- **Анализ полноты**:
  - `hasTitle` - есть название
  - `hasDescription` - есть описание
  - `hasPhoto` - есть вложения

**Логика решений**:

```typescript
// ПОЛНАЯ задача (название + описание + фото)
if (hasTitle && hasDescription && hasPhoto) {
  // → Move to "In Progress"
  // → Add comment: "Стрижка займёт минуту"
}

// НЕПОЛНАЯ задача
else {
  // → Move to "Questions"
  // → Add comment: "Какую именно стрижку ты хочешь?"
}
```

**Ключевые слова для распознавания**:

```typescript
[
  'стрижк',
  'haircut',
  'причёск',
  'парикмахер',
  'hair',
  'волос',
  'укладк',
  'стиль',
  'сделай мне',
  'подстриг',
];
```

#### `analyze-haircut-tasks.interface.ts`

**Специальные типы**:

```typescript
interface HaircutTaskDetails {
  key: string;
  summary: string;
  description: string;
  hasAttachments: boolean;
  attachmentCount: number;
}

interface HaircutTaskAnalysisResult {
  taskKey: string;
  decision: 'move_to_progress' | 'move_to_questions';
  reason: string;
  moved: boolean;
  commentAdded?: string;
}
```

---

## 3. 🚀 `execute-haircut-tasks/`

**Endpoint**: `POST /ai-agent/execute-haircut-tasks`  
**Назначение**: Автоматическое "выполнение" стрижек

### Файлы модуля:

#### `execute-haircut-tasks.service.ts`

**Процесс выполнения**:

**Метод `execute(dto)`**:

1. Получает задачи из колонки "In Progress"
2. Фильтрует только задачи о стрижках
3. Для каждой стрижки вызывает `executeHaircutTask()`

**Метод `executeHaircutTask(taskKey, summary)`**:

1. **Имитация работы**: `await new Promise(resolve => setTimeout(resolve, 1000))`
2. **Добавление результата**: комментарий "Стрижка выполнена! Вот результат:"
3. **Прикрепление фото**: `attachFileService.attachFileToTask()`
   - Файл: `assets/Сделал стрижку.png`
4. **Перемещение**: в колонку "Review"

**Логирование**:

- 🚀 - начало выполнения
- 🎯 - обработка конкретной задачи
- ✅ - успешное завершение
- ❌ - ошибки
- 🎉 - общий итог

**Ключевые слова для распознавания**:

```typescript
[
  'стрижка',
  'стрижку',
  'haircut',
  'подстриг',
  'причёска',
  'сделай мне',
  'волосы',
  'hair',
];
```

#### Зависимости:

- `AttachFileService` - прикрепление файлов к задачам
- `AiBaseService` - базовая функциональность
- Стандартные Jira сервисы

---

## 4. 📈 `check-progress-tasks/`

**Endpoint**: `POST /ai-agent/check-progress-tasks`  
**Назначение**: Проверка задач в состоянии "In Progress"

### Функциональность:

- Анализирует задачи в колонке "In Progress"
- Определяет готовность к переходу в "Review"
- Проверяет критерии завершения
- Автоматически перемещает готовые задачи

### Логика анализа:

- Проверка времени в статусе
- Анализ прогресса выполнения
- Оценка готовности к review

---

## 5. 🔍 `check-entity-exists/`

**Endpoint**: `POST /ai-agent/check-entity-exists`  
**Назначение**: Проверка существования сущностей

### Функциональность:

- Проверяет наличие уже созданных сущностей
- Предотвращает дублирование работы
- Возвращает статус существования
- Интегрируется с анализом новых задач

### Логика:

```typescript
// Извлекает название сущности из текста задачи
// Проверяет в системе/базе данных
// Возвращает результат проверки
```

---

## 6. ⚙️ `execute-tasks/`

**Endpoint**: `POST /ai-agent/execute-tasks`  
**Назначение**: Универсальное выполнение задач

### Функциональность:

- Обработка различных типов задач
- Выполнение специфичной логики для каждого типа
- Координация с другими сервисами
- Отчетность по результатам

---

## 7. 🔄 `run-auto-workflow/`

**Endpoint**: `POST /ai-agent/run-auto-workflow`  
**Назначение**: Запуск полного автоматического workflow

### Функциональность:

**Комплексный процесс**:

1. Анализ задач в "New"
2. Проверка задач в "In Progress"
3. Координация специальных workflow (стрижки)
4. Сбор общей статистики

**Возвращает**: `WorkflowExecutionResult`

```typescript
{
  newTasksProcessed: TaskAnalysisResult[];
  progressTasksProcessed: TaskProgressResult[];
  totalTasksMoved: number;
  errors: string[];
  timestamp: string;
}
```

---

## 8. 📱 `auto-haircut-monitor/`

**Endpoint**: `GET /ai-agent/auto-haircut-monitor`  
**Назначение**: Мониторинг автоматических процессов стрижек

### Функциональность:

- Отслеживание состояния haircut workflow
- Статистика выполнения стрижек
- Мониторинг качества процесса
- Dashboard для контроля

---

## 🔧 Общие паттерны всех модулей

### Структура файлов:

```
[endpoint-name]/
├── [endpoint-name].controller.ts  # HTTP контроллер
├── [endpoint-name].service.ts     # Бизнес-логика
├── [endpoint-name].dto.ts         # Request/Response DTOs
├── [endpoint-name].interface.ts   # Специфичные типы
├── [endpoint-name].module.ts      # NestJS модуль
└── [endpoint-name].spec.ts        # Unit тесты
```

### Общие зависимости:

- `AiBaseService` - базовая AI логика
- `GetColumnTasksService` - получение задач
- `MoveTaskService` - перемещение задач
- `AddTaskCommentService` - комментарии
- Специфичные сервисы по необходимости

### Паттерн наследования:

```typescript
@Injectable()
export class SpecificService extends AiBaseService {
  constructor(
    // Базовые зависимости через super()
    getColumnTasksService: GetColumnTasksService,
    moveTaskService: MoveTaskService,
    addTaskCommentService: AddTaskCommentService,
    checkEntityExistsService: CheckEntityExistsService,
    // Специфичные зависимости
    private readonly specificService: SpecificService,
  ) {
    super(
      getColumnTasksService,
      moveTaskService,
      addTaskCommentService,
      checkEntityExistsService,
    );
  }
}
```

### Общий формат ответов:

```typescript
{
  tasksProcessed: number;    // Количество обработанных
  tasksMoved: number;        // Количество перемещенных
  results: Array<Result>;    // Детальные результаты
  errors?: string[];         // Ошибки (если есть)
  timestamp?: string;        // Время выполнения
}
```

### Система логирования:

- **Эмодзи префиксы** для типов операций
- **Детальная статистика** выполнения
- **Error handling** с сохранением контекста
- **Debug информация** для разработки
