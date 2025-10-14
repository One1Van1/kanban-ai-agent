# Backend Tasks for AI Flow Implementation

## 📋 Overview

Инструкция по созданию backend endpoints для интеграции с AI Flow Builder, следуя архитектурным принципам:

- **Неизменяемость**: Никогда не редактируй существующие файлы
- **Атомарность**: Один endpoint = одна папка
- **Изоляция**: Каждая функция полностью самодостаточна

## ✅ Completed Tasks

### 1. Execute Flow Endpoint

**Статус**: ✅ ГОТОВО  
**Путь**: `/features/ai-agent/execute-flow/`  
**Endpoint**: `POST /ai-agent/execute-flow`

**Описание**: Основной endpoint для выполнения Flow Builder определений путем конвертации в AI agent инструкции.

**Файлы**:

- `execute-flow.controller.ts` - REST контроллер
- `execute-flow.service.ts` - Бизнес-логика конвертации flow в агент инструкции
- `execute-flow.dto.ts` - Валидация входящих данных
- `execute-flow.module.ts` - Модуль изоляции
- `execute-flow.interface.ts` - TypeScript интерфейсы
- `execute-flow.spec.ts` - E2E тесты
- `openapi.decorator.ts` - OpenAPI документация

**Интеграция**: ✅ Добавлен в `ai-agent.module.ts`

### 2. Get Board Columns Endpoint

**Статус**: ✅ ГОТОВО  
**Путь**: `/features/jira-integration/get-board-columns/`  
**Endpoint**: `GET /jira/boards/:id/columns`

**Описание**: Получение колонок Jira доски для UI селекторов Flow Builder.

**Файлы**:

- `get-board-columns.controller.ts` - REST контроллер
- `get-board-columns.service.ts` - Логика получения колонок через Jira API
- `get-board-columns.dto.ts` - Валидация и типизация
- `get-board-columns.module.ts` - Модуль изоляции
- `get-board-columns.interface.ts` - TypeScript интерфейсы
- `get-board-columns.spec.ts` - E2E тесты
- `openapi.decorator.ts` - OpenAPI документация

**Интеграция**: ✅ Добавлен в `jira-integration.module.ts`

### 3. Get Available Models Endpoint

**Статус**: ✅ ГОТОВО  
**Путь**: `/features/ai-agent/get-available-models/`  
**Endpoint**: `GET /ai-agent/available-models`

**Описание**: Предоставление доступных AI моделей для выбора модели в Flow Builder.

**Файлы**:

- `get-available-models.controller.ts` - REST контроллер
- `get-available-models.service.ts` - Логика определения Claude, OpenAI, Gemini моделей
- `get-available-models.dto.ts` - Валидация и типизация
- `get-available-models.module.ts` - Модуль изоляции
- `get-available-models.interface.ts` - TypeScript интерфейсы
- `get-available-models.spec.ts` - E2E тесты
- `openapi.decorator.ts` - OpenAPI документация

**Интеграция**: ✅ Добавлен в `ai-agent.module.ts`

---

## 🔄 Remaining Tasks

### 4. Get Task Files by User Endpoint

**Статус**: 🔄 ТРЕБУЕТСЯ  
**Путь**: `/features/jira-integration/get-task-files-by-user/`  
**Endpoint**: `GET /jira/tasks/:taskId/files/user/:userId`

**Описание**: Получение файлов карточки по конкретному пользователю для Flow Builder контекста.

**Требуемые файлы**:

- `get-task-files-by-user.controller.ts`
- `get-task-files-by-user.service.ts`
- `get-task-files-by-user.dto.ts`
- `get-task-files-by-user.module.ts`
- `get-task-files-by-user.interface.ts`
- `get-task-files-by-user.spec.ts`
- `openapi.decorator.ts`

**Функциональность**:

- Фильтрация файлов по пользователю
- Поддержка различных типов файлов (изображения, документы)
- Метаданные файлов (размер, дата создания, тип)
- Пагинация результатов

**Интеграция**: Добавить в `jira-integration.module.ts`

### 5. Get Flow Variables Endpoint

**Статус**: 🔄 ТРЕБУЕТСЯ  
**Путь**: `/features/context-management/get-flow-variables/`  
**Endpoint**: `GET /context/flow/:flowId/variables`

**Описание**: Получение переменных Flow для контекста выполнения.

**Требуемые файлы**:

- `get-flow-variables.controller.ts`
- `get-flow-variables.service.ts`
- `get-flow-variables.dto.ts`
- `get-flow-variables.module.ts`
- `get-flow-variables.interface.ts`
- `get-flow-variables.spec.ts`
- `openapi.decorator.ts`

**Функциональность**:

- Получение всех переменных flow
- Фильтрация по типу переменных
- Поддержка вложенных объектов
- Валидация типов данных

**Интеграция**: Создать новый `context-management.module.ts`

### 6. Set Flow Variables Endpoint

**Статус**: 🔄 ТРЕБУЕТСЯ  
**Путь**: `/features/context-management/set-flow-variables/`  
**Endpoint**: `POST /context/flow/:flowId/variables`

**Описание**: Установка переменных Flow во время выполнения.

**Требуемые файлы**:

- `set-flow-variables.controller.ts`
- `set-flow-variables.service.ts`
- `set-flow-variables.dto.ts`
- `set-flow-variables.module.ts`
- `set-flow-variables.interface.ts`
- `set-flow-variables.spec.ts`
- `openapi.decorator.ts`

**Функциональность**:

- Установка/обновление переменных
- Валидация значений
- Поддержка атомарных операций
- Логирование изменений

**Интеграция**: Добавить в `context-management.module.ts`

### 7. Get Flow Execution Status Endpoint

**Статус**: 🔄 ТРЕБУЕТСЯ  
**Путь**: `/features/ai-agent/get-flow-execution-status/`  
**Endpoint**: `GET /ai-agent/flow-execution/:executionId/status`

**Описание**: Мониторинг статуса выполнения Flow в реальном времени.

**Требуемые файлы**:

- `get-flow-execution-status.controller.ts`
- `get-flow-execution-status.service.ts`
- `get-flow-execution-status.dto.ts`
- `get-flow-execution-status.module.ts`
- `get-flow-execution-status.interface.ts`
- `get-flow-execution-status.spec.ts`
- `openapi.decorator.ts`

**Функциональность**:

- Статус выполнения (running, completed, failed, paused)
- Прогресс выполнения (% завершения)
- Текущий шаг выполнения
- Логи выполнения и ошибки

**Интеграция**: Добавить в `ai-agent.module.ts`

### 8. Pause Flow Execution Endpoint

**Статус**: 🔄 ТРЕБУЕТСЯ  
**Путь**: `/features/ai-agent/pause-flow-execution/`  
**Endpoint**: `POST /ai-agent/flow-execution/:executionId/pause`

**Описание**: Приостановка выполнения Flow с возможностью возобновления.

**Требуемые файлы**:

- `pause-flow-execution.controller.ts`
- `pause-flow-execution.service.ts`
- `pause-flow-execution.dto.ts`
- `pause-flow-execution.module.ts`
- `pause-flow-execution.interface.ts`
- `pause-flow-execution.spec.ts`
- `openapi.decorator.ts`

**Функциональность**:

- Безопасная остановка выполнения
- Сохранение состояния
- Уведомления пользователей
- Логирование операций

**Интеграция**: Добавить в `ai-agent.module.ts`

### 9. Resume Flow Execution Endpoint

**Статус**: 🔄 ТРЕБУЕТСЯ  
**Путь**: `/features/ai-agent/resume-flow-execution/`  
**Endpoint**: `POST /ai-agent/flow-execution/:executionId/resume`

**Описание**: Возобновление приостановленного выполнения Flow.

**Требуемые файлы**:

- `resume-flow-execution.controller.ts`
- `resume-flow-execution.service.ts`
- `resume-flow-execution.dto.ts`
- `resume-flow-execution.module.ts`
- `resume-flow-execution.interface.ts`
- `resume-flow-execution.spec.ts`
- `openapi.decorator.ts`

**Функциональность**:

- Восстановление состояния
- Валидация возможности продолжения
- Уведомления о возобновлении
- Обработка изменений контекста

**Интеграция**: Добавить в `ai-agent.module.ts`

### 10. Cancel Flow Execution Endpoint

**Статус**: 🔄 ТРЕБУЕТСЯ  
**Путь**: `/features/ai-agent/cancel-flow-execution/`  
**Endpoint**: `POST /ai-agent/flow-execution/:executionId/cancel`

**Описание**: Отмена выполнения Flow с очисткой ресурсов.

**Требуемые файлы**:

- `cancel-flow-execution.controller.ts`
- `cancel-flow-execution.service.ts`
- `cancel-flow-execution.dto.ts`
- `cancel-flow-execution.module.ts`
- `cancel-flow-execution.interface.ts`
- `cancel-flow-execution.spec.ts`
- `openapi.decorator.ts`

**Функциональность**:

- Принудительная остановка
- Очистка ресурсов
- Откат изменений (если возможно)
- Уведомления об отмене

**Интеграция**: Добавить в `ai-agent.module.ts`

---

## 🏗️ Architecture Principles

### File Structure Template

```
/features/{block-name}/{endpoint-name}/
├── {endpoint-name}.controller.ts      # REST контроллер
├── {endpoint-name}.service.ts         # Бизнес-логика
├── {endpoint-name}.dto.ts             # Валидация данных
├── {endpoint-name}.module.ts          # Модуль изоляции
├── {endpoint-name}.interface.ts       # TypeScript интерфейсы
├── {endpoint-name}.spec.ts            # E2E тесты
└── openapi.decorator.ts               # OpenAPI документация
```

### Naming Convention

- Folders: kebab-case (`get-available-models`)
- Files: kebab-case with type suffix (`get-available-models.service.ts`)
- Classes: PascalCase (`GetAvailableModelsService`)
- Methods: camelCase (`getModelsConfiguration`)

### Integration Requirements

1. Добавить Controller в соответствующий module
2. Добавить Service в providers и exports
3. Создать OpenAPI декораторы для документации
4. Написать E2E тесты
5. Следовать принципу изоляции

### Dependencies

- **NestJS**: Framework и декораторы
- **TypeORM**: Работа с базой данных
- **class-validator**: Валидация DTO
- **@nestjs/swagger**: OpenAPI документация
- **@nestjs/config**: Конфигурация
- **Existing Services**: IntelligentAgentService, JiraService

---

## 📊 Progress Tracking

**Completed**: 3/10 endpoints ✅  
**Remaining**: 7/10 endpoints 🔄  
**Progress**: 30% ⭐

### Next Steps

1. ✅ ~~Интегрировать GetAvailableModelsController в ai-agent.module.ts~~
2. 🔄 Создать endpoint get-task-files-by-user в jira-integration
3. 🔄 Создать context-management module с flow variables endpoints
4. 🔄 Создать flow execution management endpoints в ai-agent
5. 🔄 Написать интеграционные тесты для всех endpoints

### Dependencies Status

- ✅ IntelligentAgentService - готов
- ✅ InstructionExecutorService - готов
- ✅ JiraService - готов
- ✅ Claude AI integration - готов
- 🔄 Context management entities - требуется создание
- 🔄 Flow execution tracking - требуется создание
