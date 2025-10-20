# Backend Documentation

Полная документация бэкенда Kanban AI Agent.

## 🎯 Назначение

Централизованная документация всех компонентов бэкенда: features, конфигурации, типы, entities и модули.

## 📚 Навигация

### 🚀 [Features](./features/README.md)

Бизнес-логика и функциональные модули

- [Kanban Management](./features/kanban-management.md) - Управление канбан-досками
- [AI Agent](./features/ai-agent.md) - Интеллектуальные агенты
- [Flow Management](./features/flow-management.md) - Визуальный flow builder
- [Jira Integration](./features/jira-integration.md) - Синхронизация с Jira
- [AI Reporting](./features/ai-reporting.md) - Аналитика через AI
- [Photo Analysis](./features/photo-analysis.md) - Анализ изображений
- [Notifications](./features/notifications.md) - Система уведомлений
- [Database Management](./features/database-management.md) - Управление БД
- [Cache Management](./features/cache-management.md) - Кэширование
- [Queue Management](./features/queue-management.md) - Очереди задач
- [Context Management](./features/context-management.md) - AI контекст
- [Board Integrations](./features/board-integrations.md) - Интеграции с досками
- [Flow Conversion](./features/flow-conversion.md) - Конвертация флоу

### ⚙️ [Config](./config/README.md)

Конфигурационные файлы

- `app.config.ts` - Основные настройки
- `database.config.ts` - PostgreSQL
- `cache.config.ts` - Redis
- `claude.config.ts` - AI модели
- `jira.config.ts` - Jira подключение

### 🗄️ [Entities](./entities/README.md)

TypeORM сущности базы данных

- `agent.entity.ts` - AI агенты
- `flow.entity.ts` - Визуальные флоу
- `task-history.entity.ts` - История задач
- `board-integration.entity.ts` - Интеграции

### 📦 [Modules](./modules/README.md)

NestJS модули и dependency injection

- Feature modules - Бизнес-логика
- Infrastructure modules - БД, кэш, очереди
- Dynamic modules - Конфигурируемые модули

### 🔧 [Shared](./shared/README.md)

Переиспользуемые сервисы

- `BaseBoardIntegrationService` - Базовый класс интеграций
- `BoardIntegrationFactory` - Фабрика адаптеров
- Jira implementation - Реализация для Jira

### 📘 [Types](./types/README.md)

TypeScript типы и интерфейсы

- Domain types - Бизнес-модели
- DTO types - Data transfer objects
- Config types - Конфигурация
- Utility types - Вспомогательные типы

## 🏗️ Архитектура проекта

```
kan-back/
├── src/
│   ├── features/          # 🚀 Бизнес-логика
│   │   ├── ai-agent/
│   │   ├── kanban-management/
│   │   ├── flow-management/
│   │   └── ...
│   │
│   ├── config/            # ⚙️ Конфигурация
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   └── ...
│   │
│   ├── entities/          # 🗄️ База данных
│   │   ├── agent.entity.ts
│   │   ├── flow.entity.ts
│   │   └── ...
│   │
│   ├── modules/           # 📦 NestJS модули
│   │   ├── ai-agent.module.ts
│   │   ├── database.module.ts
│   │   └── ...
│   │
│   ├── shared/            # 🔧 Утилиты
│   │   ├── base-board-integration.service.ts
│   │   └── board-integration.factory.ts
│   │
│   └── types/             # 📘 Типизация
│       ├── ai-agent.interface.ts
│       ├── flow-definition.types.ts
│       └── ...
│
└── docs/                  # 📚 Документация
    ├── features/
    ├── config/
    ├── entities/
    ├── modules/
    ├── shared/
    └── types/
```

## 🎯 Принципы архитектуры

### 1. Модульность

Каждый feature - отдельный блок с минимальными зависимостями

### 2. Один endpoint = одна папка

```
features/kanban-management/
├── GET/
│   └── get-tasks-by-column/
│       ├── get-tasks-by-column.controller.ts
│       ├── get-tasks-by-column.service.ts
│       └── get-tasks-by-column.dto.ts
└── POST/
    └── create-task/
```

### 3. Разделение ответственности

- **Controllers** - HTTP обработка
- **Services** - Бизнес-логика
- **DTOs** - Валидация данных
- **Entities** - Модели БД
- **Interfaces** - Типизация

### 4. Dependency Injection

Все зависимости через NestJS DI контейнер

## 🔗 Граф зависимостей

```
┌─────────────────────────────────────────┐
│           Feature Modules               │
│  (AI Agent, Kanban, Flow, Jira, etc.)   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Infrastructure Modules             │
│   (Database, Cache, Queue, Context)     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Foundation Layer                │
│    (Config, Types, Entities, Shared)    │
└─────────────────────────────────────────┘
```

## 📋 Workflow разработки

### 1. Создание нового feature

```bash
# Создать структуру папок
mkdir -p src/features/feature-name/{GET,POST,PATCH,DELETE}

# Создать endpoint
mkdir src/features/feature-name/POST/create-feature
cd src/features/feature-name/POST/create-feature

# Создать файлы
touch create-feature.controller.ts
touch create-feature.service.ts
touch create-feature.dto.ts
touch create-feature.module.ts
```

### 2. Определить типы

```typescript
// types/feature.interface.ts
export interface Feature {
  id: string;
  name: string;
  // ...
}
```

### 3. Создать entity

```typescript
// entities/feature.entity.ts
@Entity('features')
export class Feature {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // ...
}
```

### 4. Добавить конфигурацию

```typescript
// config/feature.config.ts
export default registerAs('feature', () => ({
  apiUrl: process.env.FEATURE_API_URL,
}));
```

### 5. Создать модуль

```typescript
// modules/feature.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Feature])],
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService],
})
export class FeatureModule {}
```

### 6. Задокументировать

```bash
# Создать документацию
echo "# Feature Name\n\n## 🎯 Назначение\n..." > docs/features/feature-name.md
```

## 🚀 Быстрый старт

### Установка

```bash
# Установить зависимости (используйте YARN!)
yarn install
```

### Запуск

```bash
# Development mode
yarn start:dev

# Production mode
yarn build
yarn start:prod
```

### Тестирование

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Coverage
yarn test:cov
```

## 🔍 Поиск информации

### По функционалу

1. Откройте [Features](./features/README.md)
2. Найдите нужный модуль
3. Изучите раздел "Возможности"

### По API endpoints

1. Откройте документацию feature
2. Смотрите раздел "Эндпоинты"
3. Каждый endpoint = папка в src

### По типам данных

1. Откройте [Types](./types/README.md)
2. Найдите нужный интерфейс
3. Проверьте связанные типы

### По конфигурации

1. Откройте [Config](./config/README.md)
2. Найдите нужные env переменные
3. Добавьте в `.env` файл

## 🎓 Обучающие материалы

### NestJS

- [Official Documentation](https://docs.nestjs.com/)
- [TypeORM Guide](https://typeorm.io/)

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Advanced Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Patterns

- [Design Patterns](https://refactoring.guru/design-patterns)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 📦 Package Manager

**⚠️ КРИТИЧЕСКИ ВАЖНО: ВСЕГДА ИСПОЛЬЗУЙТЕ YARN!**

```bash
# ✅ Правильно
yarn add package-name
yarn install
yarn start:dev

# ❌ Неправильно
npm install package-name
npm install
npm run start:dev
```

## 🤝 Contributing

### Добавление документации

1. Создайте файл в соответствующей папке docs
2. Следуйте структуре существующих документов
3. Добавьте ссылку в главный README
4. Используйте эмодзи для навигации

### Структура документа

```markdown
# Название

## 🎯 Назначение

Краткое описание

## ⚙️ Возможности

- ✅ Фича 1
- ✅ Фича 2

## 🌐 Эндпоинты (если применимо)

Список endpoints

## 🔌 Интеграции

Связи с другими модулями
```

## 📞 Поддержка

Если возникли вопросы:

1. Проверьте документацию
2. Изучите примеры кода
3. Посмотрите тесты
4. Создайте issue в репозитории

---

**Последнее обновление:** 20 октября 2025 г.
