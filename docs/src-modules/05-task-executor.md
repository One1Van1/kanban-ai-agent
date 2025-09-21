# ⚡ Task Executor Module

## 📍 Расположение: `src/task-executor/`

## 🎯 Назначение

Модуль **Task Executor** — это "мозг" автоматизации, который анализирует задачи из Jira и выполняет автоматическую генерацию кода. Он может создавать целые NestJS ресурсы (Entity, Service, Controller, Module) на основе описания задачи.

## 📁 Структура

```
src/task-executor/
├── task-executor.module.ts          # NestJS модуль
├── task-executor.controller.ts      # REST API для тестирования
├── task-executor.service.ts         # Основная логика анализа и выполнения
├── interfaces/
│   └── execution.interface.ts       # Интерфейсы для планов выполнения
└── services/
    ├── code-generator.service.ts    # Генерация кода NestJS
    ├── command-executor.service.ts  # Выполнение системных команд
    └── file-operations.service.ts   # Операции с файловой системой
```

## 🔧 Основные компоненты

### 🟦 `TaskExecutorModule`

**Файл:** `task-executor.module.ts`

- Регистрирует все сервисы модуля
- Экспортирует `TaskExecutorService` для использования в других модулях

### 🟢 `TaskExecutorController`

**Файл:** `task-executor.controller.ts`

- `POST /task-executor/demo/create-entity` — демо-endpoint для создания сущности
- `POST /task-executor/analyze` — анализ задачи на возможность выполнения

#### Пример использования:

```bash
# Создание демо-сущности
curl -X POST http://localhost:3000/task-executor/demo/create-entity \
  -H "Content-Type: application/json" \
  -d '{"entityName": "Product", "description": "Product catalog entity"}'

# Анализ задачи
curl -X POST http://localhost:3000/task-executor/analyze \
  -H "Content-Type: application/json" \
  -d '{"summary": "Создать сущность User", "description": "Нужна сущность для пользователей"}'
```

### 🟢 `TaskExecutorService`

**Файл:** `task-executor.service.ts`
Основной сервис с ключевыми методами:

- **`analyzeTaskForExecution()`** — анализирует задачу и создает план выполнения
- **`executeTask()`** — выполняет план задачи пошагово
- **`isEntityCreationTask()`** — определяет, является ли задача созданием сущности
- **`extractEntityName()`** — извлекает название сущности из текста

#### Ключевые слова для распознавания задач:

- "создать сущность", "create entity"
- "добавить сущность", "новая сущность"
- "создать модель", "create model"

### 🟠 `CodeGeneratorService`

**Файл:** `services/code-generator.service.ts`
Генерирует полноценные NestJS ресурсы:

- **`generateEntity()`** — создает TypeORM Entity
- **`generateService()`** — создает Service с CRUD операциями
- **`generateController()`** — создает REST Controller
- **`generateModule()`** — создает NestJS Module
- **`createEntityFiles()`** — создает все файлы для сущности разом

#### Пример генерируемой структуры:

```
src/
├── entities/
│   └── product.entity.ts          # TypeORM Entity
└── products/
    ├── products.module.ts         # NestJS Module
    ├── products.service.ts        # Service с CRUD
    └── products.controller.ts     # REST Controller
```

### 🟠 `CommandExecutorService`

**Файл:** `services/command-executor.service.ts`
Выполняет системные команды:

- **`executeCommand()`** — выполнение произвольных команд
- **`executeYarnCommand()`** — yarn команды
- **`executeNestCommand()`** — Nest CLI команды
- **`generateNestResource()`** — генерация через Nest CLI

### 🟠 `FileOperationsService`

**Файл:** `services/file-operations.service.ts`
Операции с файловой системой:

- **`createFile()`** — создание файла с содержимым
- **`createDirectory()`** — создание директории
- **`fileExists()`** — проверка существования файла
- **`readFile()`** — чтение файла

## 🔗 Интерфейсы

### `TaskExecutionPlan`

Описывает план выполнения задачи:

```typescript
interface TaskExecutionPlan {
  taskKey: string; // Ключ задачи (например, KAN-123)
  summary: string; // Краткое описание
  description: string; // Подробное описание
  actions: ExecutableAction[]; // Список действий
  expectedResult: string; // Ожидаемый результат
}
```

### `ExecutableAction`

Отдельное действие для выполнения:

```typescript
interface ExecutableAction {
  type: ActionType; // Тип действия
  description: string; // Описание действия
  entityName?: string; // Название сущности (если применимо)
  // ... другие параметры
}
```

### `ActionType`

Поддерживаемые типы действий:

```typescript
enum ActionType {
  CREATE_ENTITY = 'create_entity',
  CREATE_MODULE = 'create_module',
  CREATE_CONTROLLER = 'create_controller',
  CREATE_SERVICE = 'create_service',
  RUN_COMMAND = 'run_command',
  CREATE_FILE = 'create_file',
}
```

## 🔗 Связи с другими модулями

- Используется в `WebhookService` для автоматического выполнения задач
- Интегрируется с `AI Analysis Module` для принятия решений
- Работает с `Kanban Module` для обновления статусов задач

## 🚀 Рабочий процесс

1. **Анализ задачи** → определение типа и извлечение параметров
2. **Создание плана** → формирование списка действий
3. **Выполнение плана** → пошаговое выполнение действий
4. **Результат** → создание файлов и обновление статуса в Jira

## 🎯 Возможности расширения

Модуль легко расширяется новыми типами задач:

- Добавление новых `ActionType`
- Создание специализированных генераторов
- Интеграция с внешними инструментами разработки

---

**Task Executor — это автоматизированный помощник разработчика, который превращает задачи в готовый код!** 🤖✨
