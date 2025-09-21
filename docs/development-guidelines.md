# 📝 Руководство по разработке AI Jira Agent

## Принципы разработки

### 🎯 Основные правила

#### 1. Модульность и единственная ответственность

- ✅ **Один файл = одна функция** - каждый файл решает конкретную задачу
- ✅ **Максимум 150-200 строк** на файл для читаемости
- ✅ **Single Responsibility Principle** - класс отвечает за одну область
- ✅ **Четкие интерфейсы** между модулями

#### 2. Поэтапная разработка

- ✅ **Создаем по 1-2 файла** за итерацию
- ✅ **Тестируем каждый модуль** сразу после создания
- ✅ **НЕ изменяем существующие файлы** без крайней необходимости
- ✅ **Проверяем компиляцию** на каждом шаге

#### 3. Структура и чистота кода

- ✅ **TypeScript strict mode** - строгая типизация
- ✅ **Явные типы** для всех публичных методов
- ✅ **Meaningful names** - говорящие имена переменных и методов
- ✅ **Комментарии** для сложной бизнес-логики

## 🔄 Схема работы по запросам

### Запрос 1: Базовая инфраструктура Jira

**Цель**: Создать фундамент для работы с Jira API

#### Создаваемые файлы:

1. `src/jira/types/jira-task.interface.ts` - интерфейсы задач
2. `src/jira/types/jira-board.interface.ts` - интерфейсы досок
3. `src/jira/jira.service.ts` - основной сервис Jira
4. `src/jira/jira.module.ts` - модуль NestJS

#### Критерии готовности:

- ✅ Все типы экспортируются корректно
- ✅ JiraService подключается к API (базовая аутентификация)
- ✅ JiraModule корректно регистрируется в DI
- ✅ `yarn start:dev` запускается без ошибок

### Запрос 2: Ядро функциональности

**Цель**: Реализовать получение и управление задачами

#### Создаваемые файлы:

1. `src/jira/task-fetcher.service.ts` - получение задач из колонок
2. `src/jira/task-status-manager.service.ts` - управление статусами
3. `src/jira/types/kanban-column.interface.ts` - типы колонок

#### Критерии готовности:

- ✅ TaskFetcher может получать задачи по фильтрам
- ✅ TaskStatusManager может изменять статусы
- ✅ Все сервисы интегрированы в JiraModule
- ✅ Базовое тестирование с реальным API

### Запрос 3: AI интеграция

**Цель**: Добавить анализ и выполнение задач через AI

#### Создаваемые файлы:

1. `src/ai-analysis/ai-analysis.service.ts` - анализ задач
2. `src/ai-analysis/ai-analysis.module.ts` - модуль AI
3. `src/task-executor/task-executor.service.ts` - выполнение задач
4. `src/task-executor/task-executor.module.ts` - модуль исполнителя

#### Критерии готовности:

- ✅ AI может анализировать описание задач
- ✅ TaskExecutor выполняет простые задачи
- ✅ Интеграция с существующим Claude API
- ✅ Логирование процессов

### Запрос 4: Финальная интеграция

**Цель**: Объединить все компоненты в единого агента

#### Создаваемые файлы:

1. `src/kanban-agent/kanban-agent.service.ts` - главный агент
2. `src/kanban-agent/kanban-agent.controller.ts` - REST API
3. `src/kanban-agent/workflow-engine.service.ts` - управление процессами
4. `src/kanban-agent/kanban-agent.module.ts` - финальный модуль

#### Критерии готовности:

- ✅ Полный цикл: получение → анализ → выполнение → перемещение
- ✅ REST API для внешнего управления
- ✅ Обработка ошибок и логирование
- ✅ Документация API endpoints

## 🔍 Проверка после каждого запроса

### Автоматические проверки:

```bash
# Компиляция TypeScript
yarn build

# Запуск в dev режиме
yarn start:dev

# Линтинг кода (если настроен)
yarn lint
```

### Ручные проверки:

- ✅ **Импорты/экспорты** работают корректно
- ✅ **DI контейнер** NestJS разрешает зависимости
- ✅ **Конфигурация** подгружается из нужных файлов
- ✅ **Логирование** показывает корректную работу

## 📁 Соглашения по именованию

### Файлы и папки:

```
kebab-case для файлов и папок:
✅ jira-task.interface.ts
✅ task-fetcher.service.ts
✅ kanban-agent/

PascalCase для классов и интерфейсов:
✅ JiraTaskInterface
✅ TaskFetcherService
✅ KanbanAgentModule
```

### Методы и переменные:

```typescript
// camelCase для методов
async getTasksFromColumn(columnName: string): Promise<JiraTask[]>

// camelCase для переменные
const tasksList = await this.taskFetcher.getTasks();

// SCREAMING_SNAKE_CASE для констант
const DEFAULT_JIRA_TIMEOUT = 30000;
```

## 🛡️ Паттерны безопасности

### Конфигурация:

- ✅ **Никаких хардкод credentials** в коде
- ✅ **Валидация конфигурации** при старте приложения
- ✅ **Дефолтные значения** для необязательных параметров

### Обработка ошибок:

```typescript
// ✅ Правильно - с типизированными исключениями
try {
  const tasks = await this.jiraService.getTasks();
  return tasks;
} catch (error) {
  this.logger.error('Failed to fetch tasks', error.stack);
  throw new JiraApiException('Unable to retrieve tasks', error);
}

// ❌ Неправильно - проглатывание ошибок
try {
  const tasks = await this.jiraService.getTasks();
} catch (error) {
  // Тишина - плохо!
}
```

## 📚 Структура коммитов

### Формат коммитов:

```
feat(jira): add task fetcher service
fix(ai): resolve Claude API timeout issue
docs(readme): update installation instructions
refactor(types): extract common interfaces
```

### Типы коммитов:

- `feat` - новая функциональность
- `fix` - исправление багов
- `docs` - документация
- `refactor` - рефакторинг без изменения функциональности
- `test` - добавление тестов
- `chore` - обслуживание кода

## 🚀 Готовность к продакшену

### Минимальные требования:

- ✅ **Логирование** всех важных операций
- ✅ **Валидация входных данных**
- ✅ **Graceful degradation** при недоступности внешних сервисов
- ✅ **Health checks** для мониторинга
- ✅ **Rate limiting** для API calls

### Дополнительные улучшения:

- ✅ **Метрики** для мониторинга производительности
- ✅ **Ретраи** для неустойчивых API calls
- ✅ **Кэширование** частых запросов
- ✅ **Тесты** unit и integration

---

## 🎯 Следующие шаги

После создания этих MD файлов готов начать **Запрос 1** - создание базовой инфраструктуры Jira.

Скажи **"начинаем Запрос 1"** и я создам первые файлы согласно плану!
