# 📚 Documentation Structure

Визуальная карта всей документации бэкенда.

```
docs/
│
├── 📖 INDEX.md                              # Быстрая навигация
├── 📚 README.md                             # Главная документация
├── 📊 SUMMARY.md                            # Статистика и метрики
│
├── 🚀 features/                             # FEATURE-МОДУЛИ
│   ├── 📋 README.md                         # Индекс всех features
│   │
│   ├── 🎯 Основные модули
│   │   ├── kanban-management.md             # Канбан-доски и задачи
│   │   ├── ai-agent.md                      # AI агенты
│   │   └── flow-management.md               # Visual flow builder
│   │
│   ├── 🔌 Интеграции
│   │   ├── jira-integration.md              # Jira синхронизация
│   │   └── board-integrations.md            # Другие доски
│   │
│   ├── 🤖 AI модули
│   │   ├── ai-reporting.md                  # AI аналитика
│   │   ├── photo-analysis.md                # Анализ изображений
│   │   └── flow-conversion.md               # Конвертация флоу
│   │
│   └── 🔧 Инфраструктура
│       ├── database-management.md           # PostgreSQL
│       ├── cache-management.md              # Redis кэш
│       ├── queue-management.md              # BullMQ очереди
│       ├── context-management.md            # AI контекст
│       └── notifications.md                 # Уведомления
│
├── ⚙️ config/                               # КОНФИГУРАЦИЯ
│   └── 📄 README.md
│       ├── app.config.ts                    # Основные настройки
│       ├── database.config.ts               # PostgreSQL
│       ├── cache.config.ts                  # Redis
│       ├── queue.config.ts                  # BullMQ
│       ├── claude.config.ts                 # Claude AI
│       ├── ai-agent.config.ts               # AI агенты
│       ├── jira.config.ts                   # Jira
│       └── notifications.config.ts          # Уведомления
│
├── 🗄️ entities/                            # БАЗА ДАННЫХ
│   └── 📄 README.md
│       ├── agent.entity.ts                  # AI агенты
│       ├── agent-instruction.entity.ts      # Инструкции агентов
│       ├── flow.entity.ts                   # Визуальные флоу
│       ├── task-history.entity.ts           # История задач
│       ├── board-integration.entity.ts      # Интеграции
│       └── notification-log.entity.ts       # Логи уведомлений
│
├── 📦 modules/                              # NESTJS МОДУЛИ
│   └── 📄 README.md
│       ├── ai-agent.module.ts               # AI агенты
│       ├── flow-management.module.ts        # Flow management
│       ├── jira-integration.module.ts       # Jira
│       ├── ai-reporting.module.ts           # AI отчеты
│       ├── photo-analysis.module.ts         # Фото анализ
│       ├── notifications.module.ts          # Уведомления
│       ├── database.module.ts               # TypeORM
│       ├── database-management.module.ts    # DB управление
│       ├── cache-management.module.ts       # Кэш
│       ├── queue-management.module.ts       # Очереди
│       └── context-management.module.ts     # Контекст
│
├── 🔧 shared/                               # УТИЛИТЫ
│   └── 📄 README.md
│       ├── base-board-integration.service   # Базовый класс
│       ├── board-integration.factory        # Фабрика адаптеров
│       └── jira/                            # Jira реализация
│
└── 📘 types/                                # ТИПИЗАЦИЯ
    └── 📄 README.md
        ├── ai-agent.interface.ts            # AI агенты
        ├── flow-definition.types.ts         # Flow типы
        ├── board-integration.interface.ts   # Интеграции
        ├── board-service.interface.ts       # Сервисы досок
        ├── jira-board.interface.ts          # Jira доски
        ├── jira-task.interface.ts           # Jira задачи
        ├── kanban-column.interface.ts       # Канбан колонки
        └── context.interface.ts             # AI контекст
```

## 📊 Статистика

```
┌────────────────────────────────────────────────┐
│           DOCUMENTATION METRICS                │
├────────────────────────────────────────────────┤
│  📄 Total Files:              22               │
│  📁 Sections:                  6               │
│  🚀 Feature Modules:          13               │
│  ⚙️  Config Files:             9               │
│  🗄️ Entities:                  6               │
│  📦 NestJS Modules:           11               │
│  📘 Type Files:                8               │
│  💾 Total Size:            ~110 KB             │
│  ✅ Coverage:                100%              │
└────────────────────────────────────────────────┘
```

## 🎯 Быстрый доступ

### 📖 Начало работы

```
START HERE → INDEX.md → README.md → Features/README.md
```

### 🔍 Поиск по задачам

**Хочу создать задачу:**

```
kanban-management.md → POST section → create-task
```

**Хочу настроить AI агента:**

```
ai-agent.md → POST section → create-agent
```

**Хочу настроить базу данных:**

```
config/README.md → Database section → ENV variables
```

**Хочу понять типы:**

```
types/README.md → Domain types → Нужный интерфейс
```

## 🗺️ Архитектурная карта

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                         │
│                  (Next.js App)                      │
└────────────────────┬────────────────────────────────┘
                     │ HTTP/REST
                     ▼
┌─────────────────────────────────────────────────────┐
│               FEATURES LAYER                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │  Kanban  │  │ AI Agent │  │   Flow   │         │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘         │
│       │             │              │                │
│  ┌────┴────────┬────┴──────┬───────┴─────┐        │
│  │    Jira    │  │  Photo  │  │ Reporting │       │
│  └────┬────────┘  └────┬────┘  └────┬──────┘      │
└───────┼────────────────┼────────────┼──────────────┘
        │                │            │
        ▼                ▼            ▼
┌─────────────────────────────────────────────────────┐
│           INFRASTRUCTURE LAYER                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Database │  │  Cache   │  │  Queue   │         │
│  │PostgreSQL│  │  Redis   │  │ BullMQ   │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│                                                     │
│  ┌──────────┐  ┌──────────┐                       │
│  │ Context  │  │  Notify  │                       │
│  └──────────┘  └──────────┘                       │
└─────────────────────────────────────────────────────┘
        │                │            │
        ▼                ▼            ▼
┌─────────────────────────────────────────────────────┐
│             FOUNDATION LAYER                        │
│   Config  •  Types  •  Entities  •  Shared         │
└─────────────────────────────────────────────────────┘
```

## 🔗 Связи между разделами

```
Features ────────┬───→ Config (настройки)
                 ├───→ Entities (данные)
                 ├───→ Types (типы)
                 ├───→ Modules (DI)
                 └───→ Shared (утилиты)

Modules ─────────┬───→ Config
                 └───→ Entities

Entities ────────┬───→ Types
                 └───→ Config

Shared ──────────└───→ Types
```

## 📋 Чек-лист использования

### Новый разработчик

- [ ] Прочитать INDEX.md
- [ ] Изучить README.md (архитектура)
- [ ] Ознакомиться с Features/README.md
- [ ] Настроить .env (Config/README.md)
- [ ] Изучить основные типы (Types/README.md)

### Добавление feature

- [ ] Определить типы (types/)
- [ ] Создать entity (entities/)
- [ ] Добавить конфиг (config/)
- [ ] Реализовать модуль (modules/)
- [ ] Написать документацию (features/)

### Код-ревью

- [ ] Проверить структуру (один endpoint = одна папка)
- [ ] Проверить типизацию
- [ ] Проверить документацию
- [ ] Проверить связи между модулями

## 🎨 Легенда символов

- 📖 - Навигация и индексы
- 📚 - Основная документация
- 📊 - Статистика и метрики
- 🚀 - Features (бизнес-логика)
- ⚙️ - Конфигурация
- 🗄️ - База данных
- 📦 - NestJS модули
- 🔧 - Утилиты и shared
- 📘 - Типы и интерфейсы
- 🎯 - Основной функционал
- 🔌 - Интеграции
- 🤖 - AI возможности
- ✅ - Готово/Реализовано
- 📄 - Документ

## 💡 Tips & Tricks

### Быстрая навигация

1. Используйте INDEX.md как dashboard
2. Ctrl+F для поиска по ключевым словам
3. Следуйте ссылкам между документами

### Обучение

1. Начните с архитектуры (README.md)
2. Изучайте feature по feature
3. Смотрите примеры кода в документах

### Разработка

1. Сначала типы, потом код
2. Используйте существующие паттерны
3. Документируйте по ходу

---

**Создано:** 20 октября 2025 г.  
**Статус:** ✅ Complete  
**Версия:** 1.0
