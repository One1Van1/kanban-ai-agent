# AI Request

## Что это

Отправить запрос к AI (GPT, Claude, Gemini и др.) для обработки данных.

## Зачем нужен

- Анализ текста AI
- Генерация контента
- Извлечение информации
- Принятие решений
- Ответы на вопросы

## Поля

### AI Provider

Какой AI использовать

**OpenAI** - GPT-4, GPT-3.5
**Anthropic** - Claude-3 (Opus, Sonnet, Haiku)
**Google** - Gemini Pro
**Local/Custom** - свой AI

### Model

Модель AI

**OpenAI:**

- `gpt-4o` - самый умный, дорогой
- `gpt-4-turbo` - быстрый, умный
- `gpt-3.5-turbo` - быстрый, дешёвый

**Anthropic:**

- `claude-3-opus` - самый умный
- `claude-3-sonnet` - баланс
- `claude-3-haiku` - быстрый

**Google:**

- `gemini-pro` - универсальный

### System Message

Инструкция для AI (роль, контекст)

**Примеры:**

```
Ты помощник менеджера проектов.
Анализируй задачи и предлагай улучшения.
```

```
Ты эксперт по HR.
Оценивай резюме кандидатов объективно.
```

### User Message / Prompt

Сам запрос к AI

Может содержать переменные: `{task.description}`, `{user.question}`

**Пример:**

```
Проанализируй эту задачу и предложи:
1. Приоритет (low/medium/high)
2. Примерное время выполнения
3. Подходящего исполнителя

Задача: {task.description}
```

### Temperature

Креативность ответа (0.0 - 2.0)

- `0.0` - детерминированный, точный
- `0.7` - баланс (по умолчанию)
- `1.5` - креативный, непредсказуемый

### Max Tokens

Максимальная длина ответа

- `100` - короткий ответ
- `500` - средний
- `2000` - длинный

### Response Format

Формат ответа

**Text** - обычный текст
**JSON** - структурированный JSON
**Markdown** - форматированный текст

Для JSON укажите JSON Schema

### Save Response to Variable

Имя переменной для ответа

Пример: `ai_response` → `{ai_response.text}`

## Примеры использования

### Анализ задачи

```
AI Request:
  Provider: OpenAI
  Model: gpt-4o
  System: "Ты менеджер проектов"
  Prompt: "Проанализируй задачу и определи приоритет:
           {task.description}"
  Response Format: JSON
  Schema: {"priority": "string", "estimatedHours": "number"}
  Save to: analysis
→ Update Task: priority = {analysis.priority}
```

### Генерация описания

```
AI Request:
  Model: gpt-4-turbo
  System: "Ты копирайтер"
  Prompt: "Создай описание продукта:
           Название: {product.name}
           Характеристики: {product.features}"
  Temperature: 1.0 (креативно)
  Max Tokens: 300
  Save to: description
→ Update Product: description = {description}
```

### Chatbot

```
User Message: {message}
AI Request:
  Provider: OpenAI
  Model: gpt-3.5-turbo
  System: "Ты помощник службы поддержки компании"
  Prompt: "{message}"
  Temperature: 0.7
  Save to: bot_response
→ Send Message: {bot_response} пользователю
```

### Извлечение данных из текста

```
Extract Text: {resume_file} → resume_text
AI Request:
  Model: gpt-4o
  Prompt: "Извлеки из резюме:
           {resume_text}"
  Response Format: JSON
  Schema: {
    "name": "string",
    "email": "string",
    "phone": "string",
    "skills": ["string"],
    "experience_years": "number"
  }
  Save to: candidate_data
→ Store Data: Сохранить в БД
```

### Саммаризация комментариев

```
Task Data: Get Task → task
AI Request:
  Model: claude-3-haiku (быстрый, дешёвый для саммари)
  Prompt: "Сделай краткое резюме обсуждения:
           {task.comments}"
  Max Tokens: 200
  Save to: summary
→ Update Task: Добавить summary в описание
```

### Принятие решения

```
AI Request:
  Model: gpt-4o
  System: "Ты эксперт по приоритизации"
  Prompt: "У нас 20 задач. Какие 5 самые важные?
           Задачи: {tasks}
           Критерии: срочность, важность, зависимости"
  Response Format: JSON
  Save to: top_tasks
→ For Each {top_tasks}:
  → Update Task: priority = "high"
```
