# NestJS Modules

Модули для организации кода и управления зависимостями.

## 🎯 Назначение

Централизованное управление зависимостями и импортами через NestJS модули.

## 📁 Структура модулей

| Модуль                          | Описание           | Импорты                         |
| ------------------------------- | ------------------ | ------------------------------- |
| `ai-agent.module.ts`            | AI агенты          | Database, Cache, Queue, Context |
| `flow-management.module.ts`     | Flow builder       | Database, Cache, Queue          |
| `jira-integration.module.ts`    | Jira интеграция    | Database, Cache, HTTP           |
| `ai-reporting.module.ts`        | AI аналитика       | Database, Cache, AI             |
| `photo-analysis.module.ts`      | Анализ изображений | Database, Cache, AI             |
| `notifications.module.ts`       | Уведомления        | Database, Queue, Email          |
| `database.module.ts`            | TypeORM настройка  | Config, Entities                |
| `database-management.module.ts` | Управление БД      | TypeORM                         |
| `cache-management.module.ts`    | Redis кэш          | Config                          |
| `queue-management.module.ts`    | BullMQ очереди     | Config                          |
| `context-management.module.ts`  | Контекст AI        | Database, Cache                 |

## ⚙️ Основные возможности

- ✅ Dependency Injection
- ✅ Инкапсуляция функционала
- ✅ Переиспользование кода
- ✅ Ленивая загрузка (lazy loading)
- ✅ Глобальные модули
- ✅ Динамические модули

## 🔧 Структура модуля

### Базовый модуль

```typescript
@Module({
  imports: [
    // Другие модули
    DatabaseModule,
    CacheModule,
  ],
  controllers: [
    // Контроллеры
    FeatureController,
  ],
  providers: [
    // Сервисы
    FeatureService,
  ],
  exports: [
    // Экспорт для других модулей
    FeatureService,
  ],
})
export class FeatureModule {}
```

### Динамический модуль

```typescript
@Module({})
export class CacheModule {
  static forRoot(options: CacheOptions): DynamicModule {
    return {
      module: CacheModule,
      providers: [
        {
          provide: 'CACHE_OPTIONS',
          useValue: options,
        },
        CacheService,
      ],
      exports: [CacheService],
    };
  }
}
```

### Глобальный модуль

```typescript
@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
```

## 🔗 Граф зависимостей

```
AppModule
├── DatabaseModule (@Global)
├── CacheModule (@Global)
├── QueueModule (@Global)
│
├── AIAgentModule
│   ├── imports: [Database, Cache, Queue, Context]
│   └── exports: [AIAgentService]
│
├── FlowManagementModule
│   ├── imports: [Database, Cache, Queue, AIAgent]
│   └── exports: [FlowService]
│
├── KanbanManagementModule
│   ├── imports: [Database, Cache, Notifications]
│   └── exports: [KanbanService]
│
└── JiraIntegrationModule
    ├── imports: [Database, Cache, HTTP, Kanban]
    └── exports: [JiraService]
```

## 📋 Создание нового модуля

### 1. Создайте файл модуля

```bash
# Используйте NestJS CLI
nest g module feature-name
```

### 2. Структура модуля

```typescript
// feature-name.module.ts
@Module({
  imports: [
    // Импорт необходимых модулей
    TypeOrmModule.forFeature([FeatureEntity]),
    CacheModule,
  ],
  controllers: [
    // Контроллеры из папок GET/POST/PATCH/DELETE
    CreateFeatureController,
    GetFeatureController,
  ],
  providers: [
    // Сервисы
    CreateFeatureService,
    GetFeatureService,
  ],
  exports: [
    // Что экспортируем для других модулей
    CreateFeatureService,
  ],
})
export class FeatureNameModule {}
```

### 3. Добавьте в AppModule

```typescript
@Module({
  imports: [
    // ... другие модули
    FeatureNameModule,
  ],
})
export class AppModule {}
```

## 🎯 Best Practices

### Организация

- ✅ Один модуль = одна функциональность
- ✅ Используйте папки для группировки (GET/POST/etc)
- ✅ Экспортируйте только публичное API
- ✅ Минимизируйте циклические зависимости

### Импорты

- ✅ Импортируйте только то, что нужно
- ✅ Используйте `@Global()` для общих модулей
- ✅ Динамические модули для конфигурации
- ✅ Lazy loading для больших модулей

### Экспорты

- ✅ Экспортируйте сервисы, не entities
- ✅ Используйте barrel exports (`index.ts`)
- ✅ Документируйте публичное API

## 🔄 Типы модулей

### Feature Modules

Модули бизнес-логики (AI Agent, Kanban, etc.)

### Shared Modules

Общие модули (Database, Cache, Queue)

- Используйте `@Global()` декоратор
- Экспортируйте для всего приложения

### Core Modules

Модули инфраструктуры (Config, Logger)

- Инициализируются один раз
- Глобальная конфигурация

### Dynamic Modules

Модули с настройками

- `forRoot()` - корневая конфигурация
- `forFeature()` - feature-специфичная

## 🚀 Оптимизация

### Lazy Loading

```typescript
// app.module.ts
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
];
```

### Scope

```typescript
@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {}
```

## 🔗 Связи

**Используется в:**

- AppModule (корневой модуль)
- Все feature-модули
- Тестирование (TestingModule)

**Зависит от:**

- Config (конфигурация)
- Entities (данные)
- Services (логика)
