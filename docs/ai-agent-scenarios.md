# AI Agent Scenarios - Инструкция по сценариям

## 📋 Обзор

AI агент в проекте kanban_ai_agent предназначен для автоматизации работы с Kanban доской в Jira. Агент анализирует задачи и автоматически перемещает их между колонками на основе AI анализа.

## 🎯 Существующие сценарии

### 1. **Анализ новых задач** (`analyze-new-tasks`)

**Эндпоинт:** `POST /ai-agent/analyze-new-tasks`

**Описание:** AI анализирует все задачи в колонке "New" и автоматически перемещает их:

- Понятные и четкие задачи → в колонку "In Progress"
- Непонятные задачи → в колонку "Questions"

**Логика работы:**

- Анализирует заголовок и описание задачи
- Определяет, является ли задача созданием сущности
- Проверяет наличие ключевых слов (fix, bug, implement, add, create, update, delete, refactor)
- Автоматически перемещает задачи и добавляет комментарии с объяснением

**Пример ответа:**

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

### 2. **Проверка задач в работе** (`check-progress-tasks`)

**Эндпоинт:** `POST /ai-agent/check-progress-tasks`

**Описание:** AI проверяет все задачи в колонке "In Progress" и автоматически перемещает завершенные задачи в колонку "Review".

**Логика работы:**

- Анализирует статус выполнения задачи
- Проверяет комментарии и обновления
- Определяет, готова ли задача к ревью
- Автоматически перемещает завершенные задачи

**Пример ответа:**

```json
{
  "tasksChecked": 2,
  "tasksMoved": 1,
  "results": [
    {
      "taskKey": "KAN-6",
      "decision": "move_to_review",
      "reason": "Task appears to be completed",
      "moved": true
    }
  ]
}
```

### 3. **Выполнение задач** (`execute-tasks`)

**Эндпоинт:** `POST /ai-agent/execute-tasks`

**Описание:** Агент выполняет задачи из колонки "In Progress" - создает файлы, код и другие артефакты на основе описания задачи.

**Логика работы:**

- Анализирует задачи в колонке "In Progress"
- Определяет тип задачи (создание сущности, API эндпоинта и т.д.)
- Генерирует и создает необходимые файлы
- Добавляет комментарии с результатами выполнения

**Пример ответа:**

```json
{
  "tasksExecuted": 2,
  "successfulExecutions": 1,
  "results": [
    {
      "taskKey": "KAN-5",
      "executed": true,
      "success": true,
      "reason": "Entity Order created with fields: id, userId, totalAmount, status",
      "filesCreated": ["/path/to/order.entity.ts"]
    }
  ]
}
```

### 4. **Полный автоматический workflow** (`run-auto-workflow`)

**Эндпоинт:** `POST /ai-agent/run-auto-workflow`

**Описание:** Выполняет полный цикл автоматизации: анализ новых задач + проверка задач в работе.

**Логика работы:**

- Последовательно запускает `analyze-new-tasks`
- Затем запускает `check-progress-tasks`
- Возвращает сводную статистику

**Пример ответа:**

```json
{
  "timestamp": "2025-09-22T15:30:00.000Z",
  "newTasks": { "analyzed": 3, "moved": 2 },
  "progressTasks": { "checked": 2, "moved": 1 },
  "totalMoved": 3,
  "duration": 1500
}
```

### 5. **Проверка существования сущности** (`check-entity-exists`)

**Эндпоинт:** `POST /ai-agent/check-entity-exists`

**Описание:** Проверяет, существует ли указанная сущность в проекте.

**Входные данные:**

```json
{
  "entityName": "Order"
}
```

**Пример ответа:**

```json
{
  "entityName": "Order",
  "exists": true,
  "filePath": "/path/to/order.entity.ts",
  "fields": ["id", "userId", "totalAmount", "status"]
}
```

## 🏗️ Архитектура сценариев

### Структура папок для каждого сценария:

```
src/ai-agent/
├── [scenario-name]/
│   ├── [scenario-name].controller.ts   # REST API контроллер
│   ├── [scenario-name].service.ts      # Бизнес-логика
│   ├── [scenario-name].dto.ts          # Data Transfer Objects
│   ├── [scenario-name].interface.ts    # TypeScript интерфейсы
│   ├── [scenario-name].module.ts       # NestJS модуль
│   └── [scenario-name].spec.ts         # Тесты (опционально)
```

### Базовые компоненты:

- **AiBaseService** - базовый сервис с общей логикой анализа
- **AiAgentSchedulerService** - планировщик для автоматического запуска

## 🚀 Как создать новый сценарий

### Шаг 1: Создание структуры папок

```bash
mkdir src/ai-agent/new-scenario
```

### Шаг 2: Создание файлов

1. **Controller** - REST API эндпоинт
2. **Service** - бизнес-логика
3. **DTO** - валидация входных данных
4. **Interface** - типизация ответов
5. **Module** - регистрация в DI контейнере

### Шаг 3: Пример Controller

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('ai-agent')
@Controller('ai-agent')
export class NewScenarioController {
  constructor(private readonly newScenarioService: NewScenarioService) {}

  @Post('new-scenario')
  @ApiOperation({
    summary: 'Описание нового сценария',
    description: 'Подробное описание что делает сценарий',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешное выполнение',
    schema: {
      example: {
        // Пример ответа
      },
    },
  })
  async newScenario(@Body() dto: NewScenarioDto): Promise<NewScenarioResponse> {
    return this.newScenarioService.execute(dto);
  }
}
```

### Шаг 4: Пример Service

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { AiBaseService } from '../shared/ai-base.service';

@Injectable()
export class NewScenarioService extends AiBaseService {
  private readonly logger = new Logger(NewScenarioService.name);

  async execute(dto: NewScenarioDto): Promise<NewScenarioResponse> {
    this.logger.log('Starting new scenario execution');

    // Ваша логика здесь

    return {
      // Результат выполнения
    };
  }
}
```

### Шаг 5: Регистрация в основном модуле

Добавить новый модуль в `src/ai-agent/ai-agent.module.ts`:

```typescript
@Module({
  imports: [
    // ... существующие модули
    NewScenarioModule,
  ],
})
export class AiAgentModule {}
```

## 🔧 Интеграция с Jira

Все сценарии используют следующие Jira сервисы:

- **GetColumnTasksService** - получение задач из колонки
- **MoveTaskService** - перемещение задач между колонками
- **AddTaskCommentService** - добавление комментариев к задачам

## 📝 Рекомендации

1. **Наследование от AiBaseService** - используйте базовый сервис для общей логики
2. **Логирование** - обязательно логируйте все действия
3. **Обработка ошибок** - предусмотрите обработку ошибок Jira API
4. **Тестирование** - создавайте unit тесты для сложной логики
5. **Документация** - используйте Swagger аннотации для API документации

## 🎭 Примеры задач для AI анализа

### Задачи для автоматического перемещения в "In Progress":

- "Создать сущность User"
- "Fix bug in authentication"
- "Implement user registration API"
- "Add validation to Order entity"

### Задачи для перемещения в "Questions":

- "Исследовать возможности"
- "Обсудить архитектуру"
- "Нужно уточнить требования"
- Задачи без четкого описания

---

_Эта инструкция поможет вам понять существующие сценарии и создать новые аналогичные компоненты для AI агента._
