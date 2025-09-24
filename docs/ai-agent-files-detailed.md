# 📄 Детальная документация файлов AI Agent

## 🔧 Shared компоненты

### `shared/ai-agent-scheduler.service.ts`

**Тип**: Service  
**Назначение**: Планировщик автоматических задач AI Agent с использованием cron jobs

#### Импорты и зависимости:

```typescript
- Injectable, Logger от @nestjs/common
- Cron, CronExpression от @nestjs/schedule
- RunAutoWorkflowService
- AnalyzeHaircutTasksService
- ExecuteHaircutTasksService
```

#### Методы:

**1. `handleAutoWorkflow()` - ОТКЛЮЧЕН**

- **Описание**: Запускал AI workflow каждую минуту
- **Cron**: `CronExpression.EVERY_MINUTE` (закомментирован)
- **Логика**:
  - Вызов `runAutoWorkflowService.runAutoWorkflow()`
  - Логирование результатов (количество перемещенных задач, время выполнения)
  - Обработка ошибок с детальным логированием
- **Статус**: Заменен на webhook для мгновенной реакции, оставлен как fallback

**2. `handleHaircutScheduler()` - ОТКЛЮЧЕН**

- **Описание**: Двухэтапный процесс обработки задач о стрижках
- **Cron**: `CronExpression.EVERY_MINUTE` (закомментирован)
- **Логика**:
  1. **Этап анализа**:
     - Вызов `analyzeHaircutTasksService.execute()` для колонки 'New'
     - Перемещение задач в 'In Progress' или 'Questions'
  2. **Этап выполнения**:
     - Вызов `executeHaircutTasksService.execute()` для колонки 'In Progress'
     - Выполнение стрижек и перемещение в 'Review'
  3. **Отчетность**: Подсчет общего количества обработанных задач
- **Логирование**: Детальные логи каждого этапа с эмодзи ✂️

**3. `handleFallbackAnalysis()` - АКТИВЕН**

- **Описание**: Резервный анализ для пропущенных webhook'ом задач
- **Cron**: `'0 */1 * * *'` (каждый час)
- **Логика**:
  - Анализ задач в колонке 'New'
  - Обнаружение задач, которые могли быть пропущены
  - Предупреждающее логирование при обнаружении пропущенных задач
- **Цель**: Обеспечение надежности системы

#### Особенности логирования:

- **⏰** - плановые операции workflow
- **✂️** - операции со стрижками
- **🔍** - fallback анализ
- Подробная статистика выполнения
- Отдельное логирование ошибок

---

### `shared/ai-base.service.ts`

**Тип**: Service (Abstract Base)  
**Назначение**: Базовый класс с общей логикой для всех AI операций

#### Зависимости:

```typescript
- GetColumnTasksService - получение задач из Jira колонок
- MoveTaskService - перемещение задач между колонками
- AddTaskCommentService - добавление комментариев к задачам
- CheckEntityExistsService - проверка существования сущностей
```

#### Основные методы:

**1. `analyzeNewTask(taskKey, summary, description)`**

- **Возвращает**: `TaskAnalysisResult`
- **Логика**:
  1. Проверка на создание сущности (`создать сущность` / `create entity`)
  2. Проверка на задачи о стрижках (`isHaircutRelated()`)
  3. Общий анализ по ключевым словам (fix, bug, implement, add, create)
- **Решения**:
  - `move_to_progress` - задача понятна
  - `move_to_questions` - требует уточнений
  - `stay_in_new` - остается на месте

**2. `analyzeEntityCreationTask(taskKey, summary, description)`**

- **Назначение**: Специальный анализ задач создания сущностей
- **Логика**:
  - Извлечение названия сущности из текста
  - Проверка существования через `checkEntityExistsService`
  - Решение на основе результата проверки

**3. `analyzeHaircutTask(taskKey, summary, description)`**

- **Назначение**: Анализ задач, связанных со стрижками
- **Логика**: Специализированная обработка beauty-related задач

**4. `isHaircutRelated(text)`**

- **Возвращает**: `boolean`
- **Проверяет ключевые слова**:
  - стрижка, haircut, beauty, красота
  - salon, салон, hair, волосы
  - cut, подстричь, trim

**5. `executeTaskDecision(analysis)`**

- **Назначение**: Выполнение решений по анализу задач
- **Логика**:
  - Перемещение задач согласно решению
  - Добавление комментариев при необходимости
  - Обработка ошибок перемещения

#### Паттерны анализа:

- **Entity creation**: поиск паттернов создания сущностей
- **Haircut detection**: распознавание beauty-related задач
- **Clarity assessment**: оценка понятности задачи
- **Keyword matching**: поиск ключевых слов для категоризации

---

### `shared/shared.module.ts`

**Тип**: Module  
**Назначение**: Модуль для экспорта общих сервисов AI Agent

#### Конфигурация:

```typescript
imports: [
  RunAutoWorkflowModule,
  AnalyzeHaircutTasksModule,
  ExecuteHaircutTasksModule,
];
providers: [AiAgentSchedulerService];
exports: [AiAgentSchedulerService];
```

#### Роль:

- Центральный модуль для shared компонентов
- Обеспечивает доступность `AiAgentSchedulerService` для всех модулей
- Управляет зависимостями между различными модулями workflow

---

## 📊 Types и интерфейсы

### `types/ai-agent.interface.ts`

**Тип**: TypeScript Interfaces  
**Назначение**: Определение типов данных для AI Agent

#### Интерфейсы:

**1. `TaskAnalysisResult`**

```typescript
interface TaskAnalysisResult {
  taskKey: string; // Ключ задачи (например, KAN-5)
  isUnderstandable: boolean; // Понятна ли задача
  decision: 'move_to_progress' | 'move_to_questions' | 'stay_in_new';
  reason: string; // Причина решения
  suggestedComment?: string; // Предлагаемый комментарий
}
```

- **Использование**: Результат анализа новых задач
- **Решения**: Три варианта действий с задачей

**2. `TaskProgressResult`**

```typescript
interface TaskProgressResult {
  taskKey: string; // Ключ задачи
  isCompleted: boolean; // Завершена ли задача
  decision: 'move_to_review' | 'stay_in_progress';
  reason: string; // Причина решения
  suggestedComment?: string; // Предлагаемый комментарий
}
```

- **Использование**: Результат проверки задач в процессе
- **Решения**: Переход в Review или остаться в Progress

**3. `WorkflowExecutionResult`**

```typescript
interface WorkflowExecutionResult {
  newTasksProcessed: TaskAnalysisResult[]; // Обработанные новые задачи
  progressTasksProcessed: TaskProgressResult[]; // Обработанные задачи в процессе
  totalTasksMoved: number; // Общее количество перемещенных
  errors: string[]; // Массив ошибок
  timestamp: string; // Время выполнения
}
```

- **Использование**: Полный отчет о выполнении workflow
- **Содержит**: Детальную статистику и историю операций

---

## 🎯 Endpoint модули (примерная структура)

### Структура каждого endpoint'а:

#### `[endpoint-name].controller.ts`

- **Роль**: HTTP контроллер
- **Декораторы**: `@Controller('ai-agent')`, `@ApiTags('ai-agent')`
- **Методы**: REST endpoints с Swagger документацией
- **Паттерн**: Один контроллер = один endpoint

#### `[endpoint-name].service.ts`

- **Роль**: Бизнес-логика
- **Наследование**: Обычно от `AiBaseService`
- **Методы**: Основная логика обработки
- **Интеграции**: Вызовы к Jira API сервисам

#### `[endpoint-name].dto.ts`

- **Роль**: Data Transfer Objects
- **Содержит**: Структуры для request/response
- **Валидация**: Class-validator декораторы

#### `[endpoint-name].interface.ts`

- **Роль**: Специфичные типы
- **Содержит**: Интерфейсы только для этого endpoint
- **Расширяет**: Базовые интерфейсы из types/

#### `[endpoint-name].module.ts`

- **Роль**: NestJS модуль
- **Импорты**: Необходимые зависимости
- **Экспорты**: Контроллер и сервис

#### `[endpoint-name].spec.ts`

- **Роль**: Unit тесты
- **Покрытие**: Тестирование сервисной логики
- **Моки**: Мокирование зависимостей

---

## 🔄 Workflow операций

### Последовательность выполнения:

1. **Получение задач** (`GetColumnTasksService`)
2. **Анализ содержимого** (`AiBaseService.analyzeNewTask()`)
3. **Принятие решения** (на основе ключевых слов и паттернов)
4. **Выполнение действий** (`MoveTaskService`, `AddTaskCommentService`)
5. **Логирование результатов** (детальные логи с статистикой)

### Система принятия решений:

- **Keyword matching** - поиск ключевых слов
- **Pattern recognition** - распознавание паттернов
- **Entity checking** - проверка существования сущностей
- **Context analysis** - анализ контекста задачи

### Обработка ошибок:

- **Graceful degradation** - продолжение работы при частичных сбоях
- **Detailed logging** - подробные логи ошибок
- **Retry mechanisms** - повторные попытки для критичных операций
- **Fallback strategies** - резервные стратегии
