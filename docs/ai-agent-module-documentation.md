# 📋 AI Agent Module - Полная документация

## 🎯 Общее описание

Модуль `ai-agent` представляет собой интеллектуальную систему автоматизации для обработки задач в Jira, специализированную на сценарии "стрижки". Модуль анализирует новые задачи, определяет их полноту и автоматически перемещает между колонками канбан-доски.

## 📁 Структура модуля

```
src/ai-agent/
├── ai-agent.module.ts              # Главный модуль - точка входа
├── analyze-haircut-tasks/          # Анализ задач о стрижках
│   ├── analyze-haircut-tasks.controller.ts
│   ├── analyze-haircut-tasks.service.ts
│   ├── analyze-haircut-tasks.dto.ts
│   ├── analyze-haircut-tasks.interface.ts
│   ├── analyze-haircut-tasks.module.ts
│   └── analyze-haircut-tasks.spec.ts
├── execute-haircut-tasks/          # Выполнение стрижек
│   ├── execute-haircut-tasks.controller.ts
│   ├── execute-haircut-tasks.service.ts
│   ├── execute-haircut-tasks.dto.ts
│   ├── execute-haircut-tasks.interface.ts
│   └── execute-haircut-tasks.module.ts
├── shared/                         # Общие сервисы и планировщик
│   ├── ai-base.service.ts
│   ├── ai-agent-scheduler.service.ts
│   └── shared.module.ts
└── types/                          # Общие интерфейсы
    └── ai-agent.interface.ts
```

## 🔄 Workflow (Рабочий процесс)

### Этап 1: Анализ новых задач (`analyze-haircut-tasks`)

1. **Получение задач** из колонки "New"
2. **Определение типа** - является ли задача о стрижке
3. **Проверка полноты**:
   - ✅ Полная задача: название + описание + фото → **In Progress**
   - ❌ Неполная задача: отсутствует описание/фото → **Questions**
   - 🚫 Не о стрижке: остается в **New**

### Этап 2: Выполнение стрижек (`execute-haircut-tasks`)

1. **Получение задач** из колонки "In Progress"
2. **Имитация выполнения** стрижки
3. **Завершение**:
   - Перемещение в колонку **Review**
   - Прикрепление фото результата
   - Добавление комментария о выполнении

## 📦 Компоненты модуля

### 1. `ai-agent.module.ts` - Главный модуль

**Назначение**: Объединяет все компоненты модуля и настраивает зависимости.

**Основные импорты**:

- `AnalyzeHaircutTasksModule` - анализ задач
- `ExecuteHaircutTasksModule` - выполнение стрижек
- `SharedModule` - общие сервисы
- `ScheduleModule` - планировщик cron jobs

### 2. `analyze-haircut-tasks/` - Анализ задач о стрижках

#### `analyze-haircut-tasks.service.ts`

**Назначение**: Основная логика анализа задач о стрижках.

**Ключевые методы**:

- `execute(dto)` - главная точка входа для анализа
- `analyzeSpecificHaircutTask(task)` - анализ конкретной задачи
- `isSpecificHaircutRelated(summary, description)` - проверка на стрижку

**Логика принятия решений**:

```typescript
// Полная задача (название + описание + фото)
if (hasTitle && hasDescription && hasPhoto) {
  // → Перемещение в "In Progress"
  // + комментарий "Стрижка займёт некоторое время"
}

// Неполная задача
else {
  // → Перемещение в "Questions"
  // + комментарий "Какую именно стрижку ты хочешь?"
}
```

**Ключевые слова для определения стрижки**:

- стрижк, haircut, причёск, парикмахер
- hair, волос, укладк, стиль
- сделай мне, подстриг

#### `analyze-haircut-tasks.controller.ts`

**Эндпоинт**: `POST /ai-agent/analyze-haircut-tasks`

**Функционал**: HTTP API для ручного запуска анализа задач.

#### `analyze-haircut-tasks.dto.ts`

```typescript
export class AnalyzeHaircutTasksDto {
  sourceColumn?: string; // По умолчанию "New"
}
```

#### `analyze-haircut-tasks.interface.ts`

Определяет интерфейсы:

- `AnalyzeHaircutTasksResponse` - результат анализа
- `HaircutTaskAnalysisResult` - результат для одной задачи
- `HaircutTaskDetails` - детали задачи

### 3. `execute-haircut-tasks/` - Выполнение стрижек

#### `execute-haircut-tasks.service.ts`

**Назначение**: Имитирует выполнение стрижки и завершает задачи.

**Основной процесс**:

1. Получает задачи из колонки "In Progress"
2. Проверяет, что задача о стрижке
3. Выполняет "стрижку":
   - Перемещает в "Review"
   - Прикрепляет фото `assets/Сделал стрижку.png`
   - Добавляет комментарий с описанием результата

**Пример комментария**:

```
"Стрижка выполнена! ✂️ Сделан стильный андеркат с плавным переходом
и текстурированным верхом. 📷 Фото результата: Сделал стрижку.png (45 KB)"
```

#### `execute-haircut-tasks.controller.ts`

**Эндпоинт**: `POST /ai-agent/execute-haircut-tasks`

### 4. `shared/` - Общие сервисы

#### `ai-base.service.ts`

**Назначение**: Базовый класс с общей логикой для AI-сервисов.

**Основные методы**:

- `analyzeNewTask()` - базовый анализ задач
- `isHaircutRelated()` - определение задач о стрижке
- `analyzeHaircutTask()` - специализированный анализ стрижек

**Ключевые слова стрижки**:

```typescript
const haircutKeywords = [
  'стрижка',
  'стрижку',
  'haircut',
  'окрашивание',
  'укладка',
  'маникюр',
  'педикюр',
  'косметология',
  'массаж',
  'эпиляция',
  'брови',
  'ресницы',
];
```

#### `ai-agent-scheduler.service.ts`

**Назначение**: Планировщик для автоматического выполнения задач по расписанию.

**Методы (в настоящее время отключены)**:

- `handleHaircutScheduler()` - ежеминутная проверка задач
- `handleFallbackAnalysis()` - резервная проверка раз в час

**Примечание**: Планировщик отключен в пользу webhook'ов для мгновенной реакции.

#### `shared.module.ts`

Экспортирует общие сервисы для использования в других модулях.

### 5. `types/ai-agent.interface.ts`

Общие интерфейсы:

- `TaskAnalysisResult` - результат анализа задачи
- `TaskProgressResult` - результат обработки задачи в прогрессе
- `WorkflowExecutionResult` - общий результат выполнения workflow

## 🔧 Зависимости модуля

### Внешние зависимости:

- **Jira Integration Module**: для работы с задачами Jira
  - `GetColumnTasksService` - получение задач из колонок
  - `GetTaskService` - получение деталей задачи
  - `MoveTaskService` - перемещение между колонками
  - `AddTaskCommentService` - добавление комментариев
  - `AttachFileService` - прикрепление файлов

### NestJS зависимости:

- `@nestjs/common` - базовые декораторы и сервисы
- `@nestjs/schedule` - планировщик cron jobs
- `@nestjs/config` - конфигурация

## 🚀 Использование

### API Endpoints

#### 1. Анализ задач о стрижках

```http
POST /ai-agent/analyze-haircut-tasks
Content-Type: application/json

{
  "sourceColumn": "New"  // необязательный, по умолчанию "New"
}
```

**Ответ**:

```json
{
  "tasksAnalyzed": 5,
  "tasksMoved": 3,
  "results": [
    {
      "taskKey": "PROJ-123",
      "decision": "move_to_progress",
      "reason": "Task has title, description and photo attachment",
      "moved": true,
      "commentAdded": "Стрижка займёт некоторое время"
    }
  ]
}
```

#### 2. Выполнение стрижек

```http
POST /ai-agent/execute-haircut-tasks
Content-Type: application/json

{
  "sourceColumn": "In Progress"  // необязательный
}
```

### Программное использование

```typescript
import { AnalyzeHaircutTasksService } from './analyze-haircut-tasks/analyze-haircut-tasks.service';

// Инъекция сервиса
constructor(
  private readonly analyzeService: AnalyzeHaircutTasksService
) {}

// Использование
const result = await this.analyzeService.execute({
  sourceColumn: 'New'
});
```

## 🔍 Логирование и мониторинг

### Уровни логов:

- `DEBUG`: Детальная отладочная информация
- `LOG`: Основные операции и статистика
- `WARN`: Предупреждения (например, дублирующиеся задачи)
- `ERROR`: Ошибки выполнения

### Примеры логов:

```
[AiAgentModule] 🔍 Analyzing task: PROJ-123 - "Сделай мне стрижку как у Брэда Питта"
[AiAgentModule] ✅ Task PROJ-123 moved to In Progress (complete haircut request)
[AiAgentModule] ✂️ Executing haircut for task: PROJ-123
[AiAgentModule] 📷 Photo attached to task PROJ-123: Сделал стрижку.png
```

## ⚙️ Конфигурация

### Настройки в файлах конфигурации:

#### Планировщик (отключен):

```typescript
// ai-agent-scheduler.service.ts
@Cron(CronExpression.EVERY_MINUTE)  // Закомментировано
async handleHaircutScheduler() { ... }
```

#### Пути к файлам:

```typescript
// execute-haircut-tasks.service.ts
const imagePath = path.join(process.cwd(), 'assets', 'Сделал стрижку.png');
```

## 🛡️ Защита от дублирования

Модуль использует механизм защиты от одновременной обработки одной задачи:

```typescript
private readonly processingTasks = new Set<string>();

// Добавление в обработку
this.processingTasks.add(task.key);

try {
  // Обработка задачи
} finally {
  // Освобождение блокировки
  this.processingTasks.delete(task.key);
}
```

## 🧪 Тестирование

### Структура тестов:

- `analyze-haircut-tasks.spec.ts` - тесты анализа задач
- Unit-тесты для каждого сервиса
- Моки для внешних зависимостей (Jira API)

### Запуск тестов:

```bash
yarn test ai-agent
```

## 📝 Комментарии в коде

### Закомментированный функционал:

1. **Общий workflow** (`// НЕ СТРИЖКИ: закомментировано`) - логика для неспециализированных задач
2. **Работа с сущностями** - создание/проверка существования сущностей
3. **Планировщик cron** - автоматическое выполнение по расписанию

### Причина комментирования:

Модуль изначально был универсальным, но был специализирован под сценарий "стрижки" для фокусировки на конкретной бизнес-логике.

## 🔮 Возможности расширения

### 1. Добавление новых типов задач:

```typescript
// В ai-base.service.ts
protected analyzeNewTask() {
  if (this.isHaircutRelated(text)) {
    return this.analyzeHaircutTask();
  }
  // Добавить новый тип задач здесь
  if (this.isMakedupRelated(text)) {
    return this.analyzeMakeupTask();
  }
}
```

### 2. Новые статусы и переходы:

- Добавление колонки "Waiting for Client"
- Промежуточные статусы выполнения
- Интеграция с календарем записи

### 3. Улучшение AI-логики:

- Интеграция с ChatGPT/Claude для анализа описаний
- Распознавание изображений для определения типа стрижки
- Автоматическая категоризация по сложности

## 📊 Метрики и KPI

Модуль может отслеживать:

- Количество обработанных задач в час
- Процент корректно перемещенных задач
- Время от создания до завершения задачи
- Процент задач, требующих уточнения

## 🚨 Известные ограничения

1. **Одноязычность**: Поддерживает только русский и английский
2. **Фиксированные колонки**: Жестко заданы названия колонок Jira
3. **Один тип файла**: Прикрепляется только один файл результата
4. **Нет валидации**: Не проверяется корректность прикрепленных изображений

## 🔄 История изменений

- **v1.0**: Универсальный AI-агент для всех типов задач
- **v2.0**: Специализация под сценарий стрижек
- **v2.1**: Добавление защиты от дублирования
- **v2.2**: Улучшение логирования и обработки ошибок

---

**Автор**: AI Agent Development Team  
**Дата последнего обновления**: 24 сентября 2025  
**Версия документации**: 2.2
