# Context Management

## 🎯 Назначение

**Переиспользуемые методы для сбора данных о задачах для AI агентов.**

Вместо того, чтобы в каждом сервисе (AI Agent, Reporting, Photo Analysis) писать свой код для получения данных из досок задач (Jira, Trello, Asana и др.), Context Management предоставляет готовые методы.

**Работает с любыми досками:** Jira, Trello, Linear, Asana, Notion, GitHub Projects - не важно откуда данные, методы одинаковые!

## 💡 Зачем это нужно

### ❌ **Без Context Management:**

```
Каждый сервис пишет свой код для получения данных из досок:
- AI Agent → 50 строк запросов к Jira/Trello/Asana API
- AI Reporting → 50 строк запросов к доске API (копипаста)
- Photo Analysis → 50 строк запросов к доске API (копипаста)

5 сервисов × 50 строк = 250 строк копипасты!
Меняешь логику → меняй в 5 местах
Переходишь с Jira на Trello → переписывай везде!
```

### ✅ **С Context Management:**

```
Один вызов в каждом сервисе:
- AI Agent → await contextMgmt.fetchTaskContext(taskId)
- AI Reporting → await contextMgmt.fetchTaskContext(taskId)
- Photo Analysis → await contextMgmt.fetchTaskContext(taskId)

5 сервисов × 1 строка = 5 строк!
Меняешь логику → меняешь в 1 месте
Переходишь с Jira на Trello → Context Management сам адаптируется!
```

## ⚙️ Возможности

### **Сбор данных:**

- ✅ Получить детали задачи (title, description, status)
- ✅ Получить комментарии к задаче
- ✅ Найти связанные задачи
- ✅ Получить данные из внешних API
- ✅ Получить файлы и attachments

### **Оптимизация:**

- ✅ Автоматическое кэширование (не дергать API доски каждый раз)
- ✅ Фильтрация важной информации (AI не нужна ВСЯ история)
- ✅ Сжатие больших данных (лимит токенов AI моделей)

### **Управление:**

- ✅ Настройка источников данных (включить/выключить комментарии, файлы)
- ✅ Приоритизация (что важнее: детали > комментарии > история)
- ✅ Версионирование (сохранение контекста на момент времени)

## 🌐 Основные методы

### **fetchTaskContext**

Получить полный контекст задачи (детали, комментарии, файлы, worklogs)

### **fetchRelatedTasks**

Найти связанные задачи по labels, assignee, epic

### **fetchExternalContext**

Получить данные из внешних API (GitHub, Slack, Custom API)

### **configureContextSources**

Настроить, какие данные собирать для агента

### **getFlowVariables / setFlowVariables**

Работа с переменными в Flow (передача данных между блоками)

## 🔌 Интеграции

**Использует:**

- `database-management` - хранение настроек источников контекста
- `cache-management` - кэширование контекста (не запрашивать API каждый раз)
- `board-integrations` - получение данных из любых досок (Jira, Trello, Asana и др.)

**Используется в:**

- `ai-agent` - собирает контекст для AI анализа
- `flow-management` - контекст для выполнения Flow блоков
- `ai-reporting` - контекст для генерации отчетов
- `photo-analysis` - контекст задачи для анализа скриншотов

## 🎯 Реальный пример использования

### **AI Agent анализирует задачу:**

**Без Context Management (плохо):**

```typescript
// ai-agent.service.ts
async analyzeTask(taskId: string) {
  // Запросы к доске вручную (Jira, Trello, etc.)
  const task = await axios.get(`${boardUrl}/issue/${taskId}`);
  const comments = await axios.get(`${boardUrl}/issue/${taskId}/comment`);
  const attachments = await axios.get(`${boardUrl}/issue/${taskId}/attachments`);

  // Форматирование вручную (разное для каждой доски!)
  const context = {
    title: task.fields.summary,  // ← В Jira 'summary', в Trello 'name'
    description: task.fields.description,  // ← В Trello 'desc'
    comments: comments.comments.map(c => c.body),
    // ... еще 20 строк форматирования
  };

  // Передаем AI
  await this.ai.analyze(context);
}
```

**С Context Management (хорошо):**

```typescript
// ai-agent.service.ts
async analyzeTask(taskId: string) {
  // Один вызов - всё готово! Работает с любой доской!
  const context = await this.contextMgmt.fetchTaskContext(taskId);

  // context уже в едином формате, не важно Jira это или Trello
  const context = await this.contextMgmt.fetchTaskContext(taskId);

  // Передаем AI
  await this.ai.analyze(context);
}
```

## 📝 Итого

**Context Management = библиотека для сбора данных о задачах**

- Меньше кода (1 строка вместо 50)
- Нет копипасты (логика в одном месте)
- Автоматическое кэширование (быстрее)
- Легко менять (изменения в одном месте)
