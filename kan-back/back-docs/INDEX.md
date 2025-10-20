# Documentation Index

Быстрый доступ ко всей документации бэкенда.

## 📖 Главные разделы

| Раздел          | Описание                             | Ссылка                             |
| --------------- | ------------------------------------ | ---------------------------------- |
| 🚀 **Features** | Бизнес-логика и API endpoints        | [→ Features](./features/README.md) |
| ⚙️ **Config**   | Конфигурация и environment variables | [→ Config](./config/README.md)     |
| 🗄️ **Entities** | База данных и TypeORM сущности       | [→ Entities](./entities/README.md) |
| 📦 **Modules**  | NestJS модули и DI                   | [→ Modules](./modules/README.md)   |
| 🔧 **Shared**   | Переиспользуемые сервисы             | [→ Shared](./shared/README.md)     |
| 📘 **Types**    | TypeScript типы и интерфейсы         | [→ Types](./types/README.md)       |

## 🔥 Популярные страницы

### Основные модули

- [Kanban Management](./features/kanban-management.md) - Работа с задачами
- [AI Agent](./features/ai-agent.md) - Интеллектуальные агенты
- [Flow Management](./features/flow-management.md) - Visual flow builder
- [Jira Integration](./features/jira-integration.md) - Синхронизация с Jira

### Инфраструктура

- [Database Management](./features/database-management.md) - PostgreSQL
- [Cache Management](./features/cache-management.md) - Redis кэш
- [Queue Management](./features/queue-management.md) - BullMQ очереди

### AI возможности

- [AI Reporting](./features/ai-reporting.md) - Аналитика через AI
- [Photo Analysis](./features/photo-analysis.md) - Анализ изображений
- [Context Management](./features/context-management.md) - AI контекст

## 🔍 Поиск по темам

### API Endpoints

- [Все endpoints по модулям](./features/README.md#содержание)
- [Kanban API](./features/kanban-management.md#эндпоинты)
- [AI Agent API](./features/ai-agent.md#эндпоинты)
- [Flow API](./features/flow-management.md#эндпоинты)

### База данных

- [Все entities](./entities/README.md#структура-сущностей)
- [Миграции](./entities/README.md#миграции)
- [Связи между таблицами](./entities/README.md#связи-между-сущностями)

### Конфигурация

- [Environment variables](./config/README.md#переменные-окружения)
- [Database config](./config/README.md#структура)
- [Cache config](./config/README.md#структура)

### Типизация

- [Domain types](./types/README.md#категории-типов)
- [DTO types](./types/README.md#примеры-использования)
- [Utility types](./types/README.md#utility-types)

## 🚀 Быстрый старт

### Для нового разработчика

1. **Изучите архитектуру**
   - [Главный README](./README.md#архитектура-проекта)
   - [Принципы архитектуры](./README.md#принципы-архитектуры)

2. **Настройте окружение**
   - [Environment variables](./config/README.md#переменные-окружения)
   - [Установка зависимостей](./README.md#установка)

3. **Изучите feature-модули**
   - [Список всех модулей](./features/README.md)
   - [Структура модуля](./features/README.md#архитектура)

4. **Начните разработку**
   - [Workflow разработки](./README.md#workflow-разработки)
   - [Создание нового feature](./README.md#1-создание-нового-feature)

### Для добавления нового функционала

1. **Определите типы** → [Types Guide](./types/README.md#создание-новых-типов)
2. **Создайте entity** → [Entities Guide](./entities/README.md#создание-новой-сущности)
3. **Добавьте конфиг** → [Config Guide](./config/README.md#создание-нового-конфига)
4. **Создайте модуль** → [Modules Guide](./modules/README.md#создание-нового-модуля)
5. **Задокументируйте** → [Contributing](./README.md#contributing)

## 📊 Статистика проекта

### Features

- 🎯 **13 модулей** - Основная функциональность
- 🔌 **2 интеграции** - Jira, Board integrations
- 🤖 **3 AI модуля** - Agent, Reporting, Photo analysis
- 🔧 **5 инфраструктурных** - DB, Cache, Queue, Context, Notifications

### Технологии

- **NestJS** - Backend framework
- **TypeORM** - ORM для PostgreSQL
- **BullMQ** - Система очередей
- **Redis** - Кэширование
- **Claude AI** - AI модели

### Endpoints

- **GET** - Получение данных
- **POST** - Создание ресурсов
- **PATCH** - Обновление ресурсов
- **DELETE** - Удаление ресурсов

## 🎯 Навигация по задачам

### Работа с задачами

- [CRUD операции](./features/kanban-management.md#post)
- [История изменений](./features/kanban-management.md#get)
- [Статистика](./features/kanban-management.md#get)

### AI автоматизация

- [Создание агентов](./features/ai-agent.md#post)
- [Запуск агентов](./features/ai-agent.md#post)
- [Результаты выполнения](./features/ai-agent.md#get)

### Flow builder

- [Создание флоу](./features/flow-management.md#post)
- [Конвертация в агентов](./features/flow-management.md#post)
- [Выполнение флоу](./features/flow-management.md#post)

### Интеграции

- [Подключение Jira](./features/jira-integration.md#post)
- [Синхронизация задач](./features/jira-integration.md#post)
- [Другие доски](./features/board-integrations.md#post)

## 📚 Дополнительные ресурсы

### Внутренняя документация

- [Action Instructions](../action-instruction.md)
- [TypeScript Only Mode](../TYPESCRIPT_ONLY_MODE.md)
- [Instruction files](../instruction/)

### Внешние ресурсы

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [BullMQ Documentation](https://docs.bullmq.io/)
- [Redis Documentation](https://redis.io/docs/)

## 🔄 Обновления документации

**Дата последнего обновления:** 20 октября 2025 г.

**Последние изменения:**

- ✅ Создана структура документации
- ✅ Документированы все features
- ✅ Добавлены config, entities, modules, shared, types
- ✅ Созданы навигационные README файлы

## 📝 Легенда эмодзи

- 🎯 - Назначение/Цель
- ⚙️ - Возможности/Функционал
- 🌐 - API Endpoints
- 🔌 - Интеграции/Связи
- 📁 - Структура файлов
- 🔧 - Примеры использования
- 📋 - Инструкции/Гайды
- 🚀 - Быстрый старт
- ✅ - Готово/Реализовано
- 📊 - Статистика/Данные
- 🔍 - Поиск/Навигация
- 📚 - Документация
- 🎓 - Обучение

---

**[← Вернуться к главной документации](./README.md)**
