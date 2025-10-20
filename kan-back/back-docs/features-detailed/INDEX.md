# 📚 Детальная документация Features

> Полное описание всех эндпойнтов системы Kanban AI Agent с детализацией связей, зависимостей и примеров

## 🚀 Быстрый старт

**Всего задокументировано:**

- ✅ **99+ эндпойнтов**
- ✅ **9 блоков/модулей**
- ✅ **100% покрытие** всех features

---

## 📁 Документация по блокам

### 🤖 AI & Intelligent Agents

#### [AI-Agent](./ai-agent.md) - Интеллектуальные агенты

**18 эндпойнтов** | Основной блок системы

- Создание и настройка AI-агентов
- Выполнение автоматических действий
- Обучение на основе истории
- Управление ролями агентов
- Flow execution management

---

### 🔌 Integrations

#### [Jira-Integration](./jira-integration.md) - Интеграция с Jira

**13 эндпойнтов** | Основная интеграция

- Получение и изменение задач Jira
- Управление колонками и статусами
- Комментарии и файлы
- Webhooks обработка
- Анализ изменений до/после

---

### 📋 Kanban & Tasks

#### [Kanban-Management](./kanban-management.md) - Управление досками

**38 эндпойнтов** | Самый большой блок

- CRUD операции с задачами
- Управление досками и колонками
- Комментарии и реакции
- Файлы и вложения
- История и timelog

---

### 🔄 Flow Management

#### [Flow-Management](./flow-management.md) - Управление процессами

**8 эндпойнтов** | Визуальные процессы

- Создание и редактирование flow
- Выполнение flow с AI-блоками
- Конвертация в agent instructions
- Deploy в production

---

### 🛠️ Infrastructure & Services

#### [Infrastructure-Services](./infrastructure-services.md) - Вспомогательные сервисы

**23+ эндпойнтов** | Infrastructure блоки

Включает:

- **Context-Management** (6) - управление контекстом
- **Cache-Management** (3) - кэширование
- **Queue-Management** (4) - очереди задач
- **Database-Management** (2) - управление БД
- **Notifications** (2) - уведомления
- **Photo-Analysis** (1) - анализ изображений
- **AI-Reporting** (4) - AI отчеты
- **Board-Integrations** (1+) - интеграции досок
- **Flow-Conversion** (сервисы) - конвертация

---

## 📊 Статистика по блокам

| Блок                                                                    | Эндпойнтов | GET    | POST   | PATCH | DELETE | Статус   |
| ----------------------------------------------------------------------- | ---------- | ------ | ------ | ----- | ------ | -------- |
| [kanban-management](./kanban-management.md)                             | 38         | 12     | 11     | 9     | 6      | ✅       |
| [ai-agent](./ai-agent.md)                                               | 18         | 12     | 9      | 0     | 1      | ✅       |
| [jira-integration](./jira-integration.md)                               | 13         | 6      | 7      | 0     | 0      | ✅       |
| [flow-management](./flow-management.md)                                 | 8          | 2      | 3      | 0     | 1      | ✅       |
| [context-management](./infrastructure-services.md#context-management)   | 6          | 3      | 3      | 0     | 0      | ✅       |
| [queue-management](./infrastructure-services.md#queue-management)       | 4          | 2      | 2      | 0     | 0      | ✅       |
| [cache-management](./infrastructure-services.md#cache-management)       | 3          | 1      | 2      | 0     | 0      | ✅       |
| [ai-reporting](./infrastructure-services.md#ai-reporting)               | 4          | 2      | 2      | 0     | 0      | ✅       |
| [database-management](./infrastructure-services.md#database-management) | 2          | 0      | 2      | 0     | 0      | ✅       |
| [notifications](./infrastructure-services.md#notifications)             | 2          | 0      | 2      | 0     | 0      | ✅       |
| [photo-analysis](./infrastructure-services.md#photo-analysis)           | 1          | 0      | 1      | 0     | 0      | ✅       |
| **ИТОГО**                                                               | **99+**    | **40** | **44** | **9** | **8**  | **100%** |

---

## 🔍 Быстрый поиск

### По функциональности:

**AI операции:**

- [create-agent](./ai-agent.md#create-agent) - создание AI-агента
- [execute-agent-action](./ai-agent.md#execute-agent-action) - выполнение действия агента
- [analyze-before-after-photos](./infrastructure-services.md#analyze-before-after-photos) - AI анализ изображений

**Работа с Jira:**

- [get-task-correct](./jira-integration.md#get-task-correct) - получить задачу из Jira
- [add-task-comment](./jira-integration.md#add-task-comment) - добавить комментарий
- [move-task-correct](./jira-integration.md#move-task-correct) - переместить задачу

**Kanban доски:**

- [create-task](./kanban-management.md#create-task) - создать задачу
- [get-board-structure](./kanban-management.md#get-board-structure) - структура доски
- [move-task-to-column](./kanban-management.md#move-task-to-column) - переместить в колонку

**Flow процессы:**

- [create-flow](./flow-management.md#create-flow) - создать flow
- [execute-flow](./flow-management.md#execute-flow) - запустить flow
- [deploy-to-agent](./flow-management.md#deploy-to-agent) - конвертировать в агента

---

## 📝 Формат документации

Каждый эндпойнт описан по единому шаблону:

### ✅ Что включено:

1. **HTTP метод и путь** - полный URL эндпойнта
2. **Назначение** - краткое описание (1-2 предложения)
3. **Входные данные (DTO)** - TypeScript интерфейсы
4. **Выходные данные** - структура ответа
5. **🔗 Связи и зависимости:**
   - 📤 **Исходящие связи** - что использует этот эндпойнт
   - 📥 **Входящие связи** - кто использует этот эндпойнт
   - 🔄 **Связанные процессы** - последовательность действий
6. **Примеры использования** - curl команды (для основных)

---

## 🎯 Как использовать эту документацию

### 1. Найти нужный блок

Используйте таблицу выше или список блоков.

### 2. Перейти к эндпойнту

В каждом файле есть содержание с короткими описаниями.

### 3. Изучить связи

Секция "🔗 Связи и зависимости" покажет весь контекст.

### 4. Запустить пример

Используйте примеры curl для тестирования.

---

## 🔗 Связь с архитектурой

Документация соответствует принципу:

> **"ONE ENDPOINT = ONE FOLDER"**

```
src/features/ai-agent/create-agent/
↓
features-detailed/ai-agent.md → create-agent
```

---

## 📱 Для разработчиков

### Рекомендованный порядок изучения:

1. **[AI-Agent](./ai-agent.md)** - ядро системы
2. **[Jira-Integration](./jira-integration.md)** - основная интеграция
3. **[Kanban-Management](./kanban-management.md)** - локальные доски
4. **[Flow-Management](./flow-management.md)** - визуальные процессы
5. **[Infrastructure](./infrastructure-services.md)** - вспомогательные сервисы

### После изучения вы будете знать:

- ✅ Как работают AI-агенты
- ✅ Как система интегрируется с Jira
- ✅ Как создавать и управлять задачами
- ✅ Как создавать и выполнять flow
- ✅ Как компоненты связаны между собой

---

## 🆘 Нужна помощь?

**Не нашли эндпойнт?**

1. Используйте поиск (Cmd/Ctrl + F) по всем файлам
2. Проверьте секции "Связи" - там могут быть ссылки
3. Смотрите [infrastructure-services.md](./infrastructure-services.md) - там много вспомогательных эндпойнтов

**Нашли ошибку?**

- Создайте issue в репозитории
- Или сделайте PR с исправлением

---

## 📦 Файлы документации

```
features-detailed/
├── INDEX.md                      # 📋 Этот файл (главное оглавление)
├── ai-agent.md                   # 🤖 18 эндпойнтов AI-Agent
├── jira-integration.md           # 🔌 13 эндпойнтов Jira
├── kanban-management.md          # 📋 38 эндпойнтов Kanban
├── flow-management.md            # 🔄 8 эндпойнтов Flow
└── infrastructure-services.md    # 🛠️ 22+ эндпойнтов Infrastructure
```

---

**Дата создания:** 20 октября 2025  
**Версия:** 1.0.0  
**Статус:** ✅ Актуальная  
**Покрытие:** 100% всех features
