# 📋 План проекта AI Jira Agent

## Описание проекта

### Цель

Создать AI агента, который автоматизирует работу с задачами в Jira:

- 📊 **Мониторинг** задач в определенных колонках Kanban доски
- 🤖 **Анализ и выполнение** задач с помощью AI
- 🔄 **Автоматическое перемещение** задач между колонками

### Технический стек

- **Backend**: NestJS + TypeScript
- **Package Manager**: Yarn
- **AI**: Claude API (уже настроен)
- **API**: Jira REST API
- **Database**: (опционально для сохранения состояний)

## Архитектура системы

### Фаза 1: Интеграция с Jira 🔌

#### Модули:

1. **Jira Service** (`src/jira/jira.service.ts`)
   - Подключение к Jira API
   - Аутентификация
   - Базовые операции с задачами

2. **Task Fetcher** (`src/jira/task-fetcher.service.ts`)
   - Получение задач из определенных колонок
   - Фильтрация по статусам
   - Пагинация результатов

3. **Task Status Manager** (`src/jira/task-status-manager.service.ts`)
   - Изменение статуса задач
   - Перемещение между колонками
   - Валидация переходов

4. **Jira Types** (`src/jira/types/`)
   - Интерфейсы для Jira объектов
   - DTO для API запросов

### Фаза 2: AI Анализ и выполнение 🧠

#### Модули:

1. **AI Analysis Service** (`src/ai-analysis/ai-analysis.service.ts`)
   - Анализ описания задач
   - Определение типа задачи
   - Генерация плана выполнения

2. **Task Executor** (`src/task-executor/task-executor.service.ts`)
   - Выполнение задач на основе AI анализа
   - Интеграция с различными инструментами
   - Логирование процесса выполнения

3. **Result Validator** (`src/task-executor/result-validator.service.ts`)
   - Проверка результатов выполнения
   - Валидация качества работы
   - Формирование отчетов

### Фаза 3: Оркестрация и автоматизация 🎯

#### Модули:

1. **Kanban Agent** (`src/kanban-agent/kanban-agent.service.ts`)
   - Главный контроллер агента
   - Координация всех процессов
   - API для внешнего управления

2. **Workflow Engine** (`src/kanban-agent/workflow-engine.service.ts`)
   - Управление жизненным циклом задач
   - Состояния и переходы
   - Обработка ошибок

3. **Scheduler** (`src/kanban-agent/scheduler.service.ts`)
   - Планировщик автоматических запусков
   - Мониторинг периодических задач
   - Управление очередями

## Структура папок

```
src/
├── jira/                     # Интеграция с Jira
│   ├── types/               # Типы и интерфейсы
│   ├── jira.service.ts      # Основной сервис Jira
│   ├── task-fetcher.service.ts
│   ├── task-status-manager.service.ts
│   └── jira.module.ts       # Модуль Jira
├── ai-analysis/             # AI анализ задач
│   ├── ai-analysis.service.ts
│   └── ai-analysis.module.ts
├── task-executor/           # Выполнение задач
│   ├── task-executor.service.ts
│   ├── result-validator.service.ts
│   └── task-executor.module.ts
├── kanban-agent/            # Главный агент
│   ├── kanban-agent.service.ts
│   ├── workflow-engine.service.ts
│   ├── scheduler.service.ts
│   ├── kanban-agent.controller.ts
│   └── kanban-agent.module.ts
└── config/                  # Конфигурации
    ├── jira.config.ts       # Уже существует
    ├── claude.config.ts     # Уже существует
    └── app.config.ts        # Уже существует
```

## Этапы разработки

### Этап 1: Базовая инфраструктура (Запрос 1)

- ✅ Создание Jira service и конфигурации
- ✅ Базовые типы для работы с Jira
- ✅ Модуль Jira с DI

### Этап 2: Ядро функциональности (Запрос 2)

- ✅ Task fetcher для получения задач
- ✅ Task status manager для управления статусами
- ✅ Тестирование базовых операций

### Этап 3: AI интеграция (Запрос 3)

- ✅ AI analysis service
- ✅ Task executor с AI логикой
- ✅ Result validator

### Этап 4: Финальная интеграция (Запрос 4)

- ✅ Kanban agent controller
- ✅ Workflow engine
- ✅ Scheduler
- ✅ Полное тестирование системы

## Критерии готовности

### После каждого этапа:

- ✅ Код компилируется без ошибок TypeScript
- ✅ Все импорты и экспорты корректны
- ✅ `yarn start:dev` запускается успешно
- ✅ Созданные модули подключены к DI системе NestJS

### Финальная проверка:

- ✅ Агент может подключиться к Jira
- ✅ Может получить и проанализировать задачи
- ✅ Может выполнить простую задачу
- ✅ Может изменить статус задачи в Jira

## Конфигурация окружения

### Переменные среды (в .env):

```bash
# Jira Configuration
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_USERNAME=your-email@domain.com
JIRA_API_TOKEN=your-api-token
JIRA_PROJECT_KEY=PROJ

# Board Configuration
JIRA_BOARD_ID=123
KANBAN_COLUMNS_TO_MONITOR=["To Do", "In Progress"]
KANBAN_DONE_COLUMN="Done"

# AI Configuration (уже настроено)
CLAUDE_API_KEY=existing-key
```

## Примеры использования

### Базовое использование:

```typescript
// Получить задачи из колонки "To Do"
const tasks = await kanbanAgent.getTasksFromColumn('To Do');

// Выполнить задачу с помощью AI
const result = await kanbanAgent.executeTask(task.id);

// Переместить в "Done"
await kanbanAgent.moveTaskToColumn(task.id, 'Done');
```

### Автоматический режим:

```typescript
// Запустить мониторинг каждые 30 минут
await kanbanAgent.startAutomaticMode({
  interval: '30m',
  maxTasksPerRun: 3,
});
```
