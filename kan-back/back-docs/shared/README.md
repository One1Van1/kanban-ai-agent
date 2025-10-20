# Shared Services

Переиспользуемые сервисы и утилиты для интеграций с внешними системами.

## 🎯 Назначение

Базовые классы и фабрики для создания интеграций с различными системами управления задачами (Jira, Trello, Asana и др.).

## 📁 Структура

| Файл/Папка                          | Описание                        | Использование                    |
| ----------------------------------- | ------------------------------- | -------------------------------- |
| `base-board-integration.service.ts` | Абстрактный базовый класс       | Наследование для всех интеграций |
| `board-integration.factory.ts`      | Фабрика для создания интеграций | Создание нужного адаптера        |
| `jira/`                             | Jira специфичная реализация     | Адаптер для Jira                 |

## ⚙️ Основные возможности

- ✅ Унифицированный интерфейс для всех интеграций
- ✅ Фабричный паттерн для создания адаптеров
- ✅ Переиспользование кода
- ✅ Легкое добавление новых интеграций
- ✅ Типизация и валидация

## 🔧 Архитектура

### Base Board Integration Service

Абстрактный класс с общим функционалом:

```typescript
export abstract class BaseBoardIntegrationService {
  abstract connect(credentials: any): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract getTasks(filters?: any): Promise<Task[]>;
  abstract createTask(data: CreateTaskDto): Promise<Task>;
  abstract updateTask(id: string, data: UpdateTaskDto): Promise<Task>;
  abstract deleteTask(id: string): Promise<void>;
  abstract syncTasks(): Promise<SyncResult>;

  // Общие методы
  protected validateCredentials(credentials: any): void {
    // Валидация
  }

  protected mapToInternalTask(externalTask: any): Task {
    // Маппинг
  }
}
```

### Board Integration Factory

Создание нужного адаптера:

```typescript
@Injectable()
export class BoardIntegrationFactory {
  create(type: BoardType): BaseBoardIntegrationService {
    switch (type) {
      case BoardType.JIRA:
        return new JiraBoardService();
      case BoardType.TRELLO:
        return new TrelloBoardService();
      case BoardType.ASANA:
        return new AsanaBoardService();
      default:
        throw new Error(`Unknown board type: ${type}`);
    }
  }
}
```

### Jira Implementation

Конкретная реализация для Jira:

```typescript
export class JiraBoardService extends BaseBoardIntegrationService {
  async connect(credentials: JiraCredentials): Promise<void> {
    this.validateCredentials(credentials);
    this.client = new JiraClient(credentials);
    await this.client.testConnection();
  }

  async getTasks(filters?: JiraFilters): Promise<Task[]> {
    const issues = await this.client.getIssues(filters);
    return issues.map((issue) => this.mapToInternalTask(issue));
  }

  // ... остальные методы
}
```

## 📋 Добавление новой интеграции

### Шаг 1: Создайте папку

```
shared/
└── trello/
    ├── trello-board.service.ts
    ├── trello-board.interface.ts
    └── trello-client.ts
```

### Шаг 2: Реализуйте сервис

```typescript
export class TrelloBoardService extends BaseBoardIntegrationService {
  async connect(credentials: TrelloCredentials): Promise<void> {
    // Реализация подключения к Trello
  }

  async getTasks(): Promise<Task[]> {
    // Получение задач из Trello
  }

  // ... остальные методы
}
```

### Шаг 3: Добавьте в фабрику

```typescript
create(type: BoardType): BaseBoardIntegrationService {
  switch (type) {
    case BoardType.JIRA:
      return new JiraBoardService();
    case BoardType.TRELLO:
      return new TrelloBoardService(); // <-- Добавить
    // ...
  }
}
```

### Шаг 4: Зарегистрируйте тип

```typescript
export enum BoardType {
  JIRA = 'jira',
  TRELLO = 'trello', // <-- Добавить
  ASANA = 'asana',
}
```

## 🎯 Паттерны проектирования

### Strategy Pattern

Разные стратегии для разных досок

```typescript
interface BoardStrategy {
  sync(): Promise<SyncResult>;
}

class JiraStrategy implements BoardStrategy {}
class TrelloStrategy implements BoardStrategy {}
```

### Adapter Pattern

Адаптация внешних API к внутреннему формату

```typescript
class JiraAdapter {
  adaptTask(jiraIssue: JiraIssue): Task {
    return {
      id: jiraIssue.key,
      title: jiraIssue.fields.summary,
      // ...
    };
  }
}
```

### Factory Pattern

Создание нужного сервиса

```typescript
const service = factory.create(BoardType.JIRA);
```

## 🔄 Типичный flow использования

```typescript
// 1. Создание адаптера через фабрику
const boardService = boardFactory.create(BoardType.JIRA);

// 2. Подключение
await boardService.connect({
  host: 'https://example.atlassian.net',
  email: 'user@example.com',
  apiToken: 'token',
});

// 3. Получение задач
const tasks = await boardService.getTasks({
  projectKey: 'PROJ',
  status: 'In Progress',
});

// 4. Синхронизация
const result = await boardService.syncTasks();

// 5. Отключение
await boardService.disconnect();
```

## 🧪 Тестирование

### Mock для тестов

```typescript
class MockBoardService extends BaseBoardIntegrationService {
  async connect() {
    return;
  }
  async getTasks() {
    return [mockTask];
  }
  // ...
}
```

### Unit тесты

```typescript
describe('BoardIntegrationFactory', () => {
  it('should create Jira service', () => {
    const service = factory.create(BoardType.JIRA);
    expect(service).toBeInstanceOf(JiraBoardService);
  });
});
```

## 🎯 Best Practices

- ✅ Всегда наследуйтесь от `BaseBoardIntegrationService`
- ✅ Используйте фабрику для создания инстансов
- ✅ Реализуйте все абстрактные методы
- ✅ Обрабатывайте ошибки API
- ✅ Добавляйте логирование
- ✅ Кэшируйте результаты
- ✅ Используйте retry механизмы

## 🔗 Связи

**Используется в:**

- `board-integrations` (feature)
- `jira-integration` (feature)
- Будущие интеграции (Trello, Asana, etc.)

**Использует:**

- Types (интерфейсы)
- Config (настройки)
- HTTP клиенты (Axios, Fetch)
