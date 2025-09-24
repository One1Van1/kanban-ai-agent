# 💇 Сценарий стрижки - Полный автоматизированный workflow

## 🎯 Описание сценария

Полностью автоматизированный сценарий обработки задач стрижек от создания до завершения. AI агент самостоятельно анализирует, выполняет и контролирует процесс стрижки.

## 🔄 Полная схема workflow

```
📋 New → 🤖 [Анализ] → 🔧 In Progress → 🤖 [Выполнение] → ✅ Review
    ↓
❓ Questions (если неполная задача)
```

## 📂 Модули и их роли

### 1️⃣ Анализ новых задач (New → In Progress/Questions)

#### `analyze-new-haircut-tasks/`

- **Задача**: Анализирует ТОЛЬКО новые задачи стрижек из колонки "New"
- **Логика**:
  - Полные задачи (название + описание + фото) → "In Progress"
  - Неполные задачи (только название) → "Questions"
- **Эндпоинт**: `POST /ai-agent/analyze-new-haircut-tasks`

#### `analyze-haircut-tasks/`

- **Задача**: Дублирующий функционал анализа задач стрижек
- **Логика**: Аналогична `analyze-new-haircut-tasks/`
- **Эндпоинт**: `POST /ai-agent/analyze-haircut-tasks`

### 2️⃣ Контроль прогресса (In Progress → Review)

#### `check-haircut-progress/`

- **Задача**: Проверяет прогресс стрижек в колонке "In Progress"
- **Логика**: Анализирует готовность задачи и перемещает в "Review"
- **Эндпоинт**: `POST /ai-agent/check-haircut-progress`

#### `execute-haircut-tasks/`

- **Задача**: Выполняет стрижки (создание фото результата)
- **Логика**: Обрабатывает задачи в "In Progress" и перемещает в "Review"
- **Эндпоинт**: `POST /ai-agent/execute-haircut-tasks`

### 3️⃣ Автоматизация

#### `auto-haircut-monitor/`

- **Задача**: Автоматический мониторинг процесса стрижек
- **Функции**:
  - `POST /ai-agent/auto-haircut-monitor/start` - запуск мониторинга
  - `POST /ai-agent/auto-haircut-monitor/stop` - остановка мониторинга
  - `GET /ai-agent/auto-haircut-monitor/status` - статус мониторинга
  - `PATCH /ai-agent/auto-haircut-monitor/settings` - настройки

## ⚙️ Автоматическое выполнение

### Планировщик (`AiAgentSchedulerService`)

```typescript
@Cron('0 * * * * *') // Каждую минуту
async handleHaircutScheduler() {
  // 1. Анализ New → In Progress/Questions
  // 2. Выполнение In Progress → Review
}
```

### Fallback анализ

```typescript
@Cron('0 0 * * * *') // Каждый час в 00 минут
async fallbackAnalysis() {
  // Повторная проверка пропущенных задач
}
```

## 🔍 Критерии анализа

### Полная задача стрижки:

- ✅ Название содержит ключевые слова (стрижка, haircut, etc.)
- ✅ Есть описание процедуры
- ✅ Прикреплено фото-референс
- **Результат**: → "In Progress"

### Неполная задача стрижки:

- ❌ Только название без описания
- ❌ Нет фото-референса
- **Результат**: → "Questions" + комментарий

### Не стрижка:

- ❌ Не содержит ключевые слова
- **Результат**: остается в "New"

## 📊 Мониторинг и логи

### Типичные логи работы:

```
[AiBaseService] Starting haircut tasks analysis for column: New
[JiraBaseService] Built JQL query: project = "KAN" AND status = "New"
[AiBaseService] No tasks found in the specified column
[AiAgentSchedulerService] ✂️ Haircut workflow complete: 0 tasks processed
```

### Статистика выполнения:

- `tasksAnalyzed` - количество проанализированных задач
- `tasksMoved` - количество перемещенных задач
- `tasksCompleted` - количество выполненных стрижек

## 🎛️ Ключевые слова для распознавания

```typescript
const haircutKeywords = [
  'стрижка',
  'стрижку',
  'стричь',
  'подстричь',
  'haircut',
  'hair',
  'cut',
  'trim',
  'прическа',
  'волосы',
  'парикмахер',
];
```

## 🚀 Как работает в реальном времени

1. **Каждую минуту** система автоматически:
   - Сканирует колонку "New" на предмет новых задач стрижек
   - Анализирует задачи в "In Progress" на готовность
   - Перемещает задачи по колонкам согласно логике

2. **Каждый час** дополнительно:
   - Запускает fallback анализ для пропущенных задач

3. **В режиме реального времени**:
   - Webhook'и могут триггерить немедленную обработку
   - Ручные вызовы API доступны для форсирования процесса

## 🔧 Настройка и управление

### Запуск/остановка автоматического режима:

```bash
# Запуск
curl -X POST http://localhost:3000/ai-agent/auto-haircut-monitor/start

# Остановка
curl -X POST http://localhost:3000/ai-agent/auto-haircut-monitor/stop

# Статус
curl -X GET http://localhost:3000/ai-agent/auto-haircut-monitor/status
```

### Ручное выполнение этапов:

```bash
# Анализ новых задач
curl -X POST http://localhost:3000/ai-agent/analyze-new-haircut-tasks

# Проверка прогресса
curl -X POST http://localhost:3000/ai-agent/check-haircut-progress

# Выполнение стрижек
curl -X POST http://localhost:3000/ai-agent/execute-haircut-tasks
```

## 🎯 Результат

**Полностью автоматизированная обработка задач стрижек** - от момента создания задачи до получения результата без участия человека.
