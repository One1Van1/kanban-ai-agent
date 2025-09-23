# Execute Tasks API

## Описание

Эндпойнт для автоматического выполнения задач из колонки "In Progress" с помощью AI агента.

## Endpoint

```
POST /ai-agent/execute-tasks
```

## Описание функциональности

AI агент анализирует задачи в колонке "In Progress" и автоматически выполняет их, создавая:

- Entity файлы
- API эндпойнты
- Базовый код
- Конфигурационные файлы
- Тесты

Агент интерпретирует описание задачи и генерирует соответствующий код.

## Параметры запроса

Не требуются (выполняются все подходящие задачи из колонки "In Progress").

## Пример запроса

```bash
curl -X POST http://localhost:3000/ai-agent/execute-tasks \
  -H "Content-Type: application/json"
```

## Ответы

### Успешный ответ (200)

```json
{
  "tasksExecuted": 3,
  "successfulExecutions": 2,
  "results": [
    {
      "taskKey": "KAN-15",
      "executed": true,
      "success": true,
      "reason": "Entity Order created with fields: id, userId, totalAmount, status",
      "filesCreated": [
        "/src/entities/order.entity.ts",
        "/src/modules/order/order.module.ts",
        "/src/modules/order/order.service.ts"
      ],
      "codeGenerated": true,
      "testFiles": ["/src/modules/order/order.service.spec.ts"]
    },
    {
      "taskKey": "KAN-16",
      "executed": true,
      "success": false,
      "reason": "Failed to generate API endpoint: insufficient requirements",
      "error": "Missing API specification details",
      "filesCreated": []
    },
    {
      "taskKey": "KAN-17",
      "executed": false,
      "success": false,
      "reason": "Task type not supported for automatic execution",
      "taskType": "manual-testing"
    }
  ],
  "timestamp": "2025-09-23T15:04:11.000Z",
  "duration": 4500,
  "totalFilesCreated": 4
}
```

### Структура ответа

| Поле                 | Тип    | Описание                                              |
| -------------------- | ------ | ----------------------------------------------------- |
| tasksExecuted        | number | Количество задач, для которых была попытка выполнения |
| successfulExecutions | number | Количество успешно выполненных задач                  |
| results              | array  | Массив результатов выполнения для каждой задачи       |
| timestamp            | string | Временная метка выполнения                            |
| duration             | number | Время выполнения в миллисекундах                      |
| totalFilesCreated    | number | Общее количество созданных файлов                     |

### Структура объекта result

| Поле          | Тип     | Описание                       |
| ------------- | ------- | ------------------------------ |
| taskKey       | string  | Ключ задачи                    |
| executed      | boolean | Была ли попытка выполнения     |
| success       | boolean | Успешность выполнения          |
| reason        | string  | Описание результата выполнения |
| error         | string  | Описание ошибки (если есть)    |
| filesCreated  | array   | Список созданных файлов        |
| codeGenerated | boolean | Был ли сгенерирован код        |
| testFiles     | array   | Список созданных тестов        |
| taskType      | string  | Тип задачи                     |

## Возможные ошибки

- **500 Internal Server Error** - Ошибка при выполнении задач
- **503 Service Unavailable** - AI сервис недоступен
- **400 Bad Request** - Некорректные требования в задачах

## Типы поддерживаемых задач

### 🏗️ Entity Creation

**Примеры задач:**

- "Создать entity User"
- "Добавить модель Product с полями name, price, category"

**Генерируемые файлы:**

- `*.entity.ts` - Entity класс
- `*.dto.ts` - DTO для валидации
- `*.interface.ts` - TypeScript интерфейсы
- `*.module.ts` - NestJS модуль

### 🔌 API Endpoints

**Примеры задач:**

- "Создать CRUD API для User"
- "Добавить эндпойнт GET /api/products"

**Генерируемые файлы:**

- `*.controller.ts` - Контроллер
- `*.service.ts` - Бизнес-логика
- `*.dto.ts` - DTO для валидации
- `*.spec.ts` - Unit тесты

### ⚙️ Configuration

**Примеры задач:**

- "Настроить подключение к базе данных"
- "Добавить конфигурацию для Redis"

**Генерируемые файлы:**

- `*.config.ts` - Конфигурационные файлы
- Environment переменные
- Docker конфигурация

### 🧪 Testing

**Примеры задач:**

- "Добавить тесты для UserService"
- "Создать E2E тесты для API"

**Генерируемые файлы:**

- `*.spec.ts` - Unit тесты
- `*.e2e-spec.ts` - E2E тесты
- Test fixtures и моки

## Алгоритм выполнения

### 1. Анализ задачи

```javascript
// Анализ текста задачи
const analysis = {
  taskType: 'entity_creation',
  entityName: 'User',
  fields: ['id', 'email', 'password', 'createdAt'],
  requirements: ['validation', 'authentication'],
};
```

### 2. Генерация кода

```typescript
// Пример генерируемого entity
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

### 3. Создание файлов

- Проверка существования файлов
- Создание директорий
- Генерация кода по шаблонам
- Валидация синтаксиса

### 4. Тестирование

- Проверка компиляции TypeScript
- Запуск линтера
- Валидация архитектуры проекта

## Шаблоны генерации

### Entity Template

```typescript
// Template для создания entity
export const entityTemplate = (config) => `
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('${config.tableName}')
export class ${config.className} {
  @PrimaryGeneratedColumn()
  id: number;

  ${config.fields.map((field) => generateFieldCode(field)).join('\n  ')}
}
`;
```

### Controller Template

```typescript
// Template для создания контроллера
export const controllerTemplate = (config) => `
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ${config.serviceName} } from './${config.serviceFile}';

@Controller('${config.route}')
export class ${config.className} {
  constructor(private readonly ${config.serviceInstance}: ${config.serviceName}) {}

  ${config.endpoints.map((endpoint) => generateEndpointCode(endpoint)).join('\n\n  ')}
}
`;
```

## Конфигурация AI

### Поддерживаемые языки

- **TypeScript** (основной)
- **JavaScript**
- **SQL** (для миграций)
- **JSON** (конфигурации)

### Фреймворки

- **NestJS** (основной)
- **TypeORM** (для entities)
- **Jest** (для тестов)
- **Swagger** (документация)

### Переменные окружения

```bash
# Настройки генерации кода
AI_CODE_GENERATION_ENABLED=true
AI_MAX_FILES_PER_TASK=10
AI_ENABLE_TEST_GENERATION=true
AI_ENABLE_VALIDATION=true

# Пути для генерации
AI_ENTITIES_PATH=src/entities
AI_MODULES_PATH=src/modules
AI_TESTS_PATH=src/tests
```

## Ограничения и безопасность

### Ограничения

- Максимум 10 файлов на задачу
- Размер файла не более 50KB
- Только поддерживаемые типы задач
- Проверка на перезапись существующих файлов

### Безопасность

- Валидация имен файлов и путей
- Проверка на выполнение вредоносного кода
- Ограничение доступа к файловой системе
- Логирование всех операций

## Постобработка

### После успешного выполнения

1. Добавление комментария к задаче со списком созданных файлов
2. Перемещение задачи в статус "Review"
3. Создание pull request (если настроено)
4. Уведомление команды

### При ошибке выполнения

1. Добавление комментария с описанием ошибки
2. Перемещение в "Questions" для ручной доработки
3. Логирование для анализа и улучшения AI

## Мониторинг качества

- Статистика успешности выполнения
- Анализ типов ошибок
- Обратная связь от разработчиков
- Метрики качества сгенерированного кода

## Примечания

- Выполняются только задачи с ясными техническими требованиями
- Сложные задачи могут требовать ручной доработки
- Все изменения версионируются в Git
- Рекомендуется code review сгенерированного кода

## Теги Swagger

- **ai-agent** - Эндпойнты AI агента
