# Архитектура системы 🏗️

Техническое описание архитектуры Kanban AI Agent и взаимодействия компонентов.

## 🎯 Общая архитектура

```
┌─────────────────────────────────────────────────────────────────┐
│                        Jira Cloud                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │   Задачи    │ │   Статусы   │ │   Файлы     │              │
│  │  (Issues)   │ │ (Workflow)  │ │(Attachments)│              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
└─────────────────────┬───────────────────────────────────────────┘
                      │ Webhook HTTP
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ngrok Tunnel                                │
│           https://abc123.ngrok-free.app                       │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                Kanban AI Agent                                │
│                                                               │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │  Jira Module    │ │ Photo Analysis  │ │ AI Reporting    │   │
│  │                 │ │    Module       │ │    Module       │   │
│  │ ┌─────────────┐ │ │ ┌─────────────┐ │ │ ┌─────────────┐ │   │
│  │ │   Webhook   │ │ │ │   Claude    │ │ │ │  Report     │ │   │
│  │ │  Handler    │ │ │ │  Vision     │ │ │ │ Generator   │ │   │
│  │ └─────────────┘ │ │ └─────────────┘ │ │ └─────────────┘ │   │
│  │ ┌─────────────┐ │ │ ┌─────────────┐ │ │ ┌─────────────┐ │   │
│  │ │    API      │ │ │ │   Image     │ │ │ │  Analytics  │ │   │
│  │ │ Operations  │ │ │ │ Processing  │ │ │ │   Engine    │ │   │
│  │ └─────────────┘ │ │ └─────────────┘ │ │ └─────────────┘ │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘   │
└─────────────────────┬───────────────────────────────────────────┘
                      │ OpenRouter API
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Claude 3.5 Sonnet                           │
│                    Vision API                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 📦 Структура модулей

### 🎯 Основные модули

```
src/
├── jira/                          # Jira интеграция
│   ├── process-webhook-before-after/   # Webhook для Claude анализа
│   ├── get-task/                      # Получение задач
│   ├── move-task/                     # Перемещение задач
│   ├── add-task-comment/              # Добавление комментариев
│   └── ...
├── photo-analysis-agent/          # AI анализ фотографий
│   └── analyze-before-after-photos/   # Claude Vision обработка
├── ai-reporting-agent/            # Генерация отчётов
│   ├── generate-report/               # Создание отчётов
│   └── process-report-webhook/        # Webhook для отчётов
└── config/                        # Конфигурация
    ├── app.config.ts
    ├── jira.config.ts
    └── claude.config.ts
```

## 🌊 Поток данных

### 1. AI Анализ стрижек

```
1. Пользователь перемещает задачу → Review/Testing/Done
2. Jira отправляет webhook → ngrok → приложение
3. Webhook handler анализирует событие
4. Поиск фотографий "до" и "после" в задаче
5. Отправка изображений в Claude 3.5 Sonnet
6. Получение и парсинг результата анализа
7. Добавление комментария с оценкой в задачу
8. Автоматическое перемещение в статус "Done"
```

### 2. Генерация отчётов

```
1. Создание задачи с описанием периода отчёта
2. Назначение на "AI-Report-maker"
3. Перевод в статус "In Progress" → webhook
4. Парсинг периода из описания задачи
5. Поиск всех завершённых анализов за период
6. Агрегация статистики и аналитики
7. Генерация форматированного отчёта
8. Добавление отчёта в комментарий задачи
9. Перевод задачи в статус "Done"
```

## 🔌 API Архитектура

### REST API Endpoints

#### Jira интеграция

```
GET    /jira/health                     # Проверка подключения
GET    /jira/tasks/:taskKey             # Получение задачи
POST   /jira/tasks/:taskKey/move        # Перемещение задачи
POST   /jira/tasks/:taskKey/comment     # Добавление комментария
GET    /jira/tasks/:taskKey/transitions # Доступные переходы
POST   /jira/search                     # Поиск задач
GET    /jira/columns/:columnName/tasks  # Задачи из колонки
POST   /jira/attach-file/:taskKey       # Прикрепление файла
```

#### AI анализ

```
POST   /photo-analysis-agent/analyze-before-after-photos  # Claude анализ
POST   /jira/process-webhook-before-after                 # Webhook для анализа
GET    /jira/process-webhook-before-after/health          # Health check
GET    /jira/process-webhook-before-after/config          # Конфигурация
```

#### AI отчёты

```
POST   /ai-reporting-agent/generate-report          # Генерация отчёта
POST   /ai-reporting-agent/process-report-webhook   # Webhook для отчётов
GET    /ai-reporting-agent/generate-report/health   # Health check
GET    /ai-reporting-agent/generate-report/config   # Конфигурация
```

## 🔧 Технологический стек

### Backend Framework

- **NestJS** - основной фреймворк
- **TypeScript** - язык разработки
- **Express** - HTTP сервер

### Внешние API

- **Jira REST API v3** - интеграция с Jira
- **OpenRouter API** - доступ к Claude 3.5 Sonnet
- **ngrok** - туннелинг для webhook

### Библиотеки

- **@nestjs/common** - основные декораторы и функции
- **@nestjs/config** - управление конфигурацией
- **@nestjs/swagger** - автоматическая документация API
- **chrono-node** - парсинг естественных дат
- **axios** - HTTP клиент
- **class-validator** - валидация DTO

---

**Следующий шаг:** [Пользовательские сценарии](USER-SCENARIOS.md)
