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

### AI Модель

Выберите модель AI для обработки запроса.

**Доступные модели:**

- **GPT-4** - самый умный, лучше для сложных задач
- **GPT-3.5 Turbo** - быстрый и эффективный
- **Claude-3** - хорош для анализа и творчества
- **Gemini Pro** - универсальный от Google

### Промпт

Ваш запрос к AI. Может включать переменные из предыдущих блоков.

**Примеры:**

```
Проанализируй эту задачу: {task.description}
```

```
Ответь на вопрос пользователя: {user.question}
```

```
Сгенерируй краткое описание для товара:
Название: {product.title}
Характеристики: {product.specs}
```

**Советы по написанию промптов:**

- Будьте конкретны в инструкциях
- Используйте переменные в фигурных скобках: `{variable.field}`
- Для JSON ответов опишите желаемую структуру в промпте
- Примеры помогают AI понять что вы хотите

### Сохранить результат в переменную

Имя переменной для сохранения ответа AI.

**Примеры:**

- `ai_analysis` → использовать как `{ai_analysis}`
- `generated_text` → использовать как `{generated_text}`
- `ai_decision` → использовать как `{ai_decision}`

---

> **💡 Примечание:** Продвинутые настройки AI (System Prompt, Temperature, Max Tokens, Response Format, JSON Schema) планируются в следующих версиях. Сейчас доступны базовые возможности отправки запроса и получения ответа.

## Примеры использования

### Анализ задачи

```
Блок: Get Data (Получение данных)
  Переменная: task_info
  Источник: api/tasks/123
  Сохранить результат в переменную: ✓ task

⭐ Блок: AI Request (AI запрос) ⭐
  AI Модель: GPT-4
  Промпт: Проанализируй задачу и определи:
    1. Приоритет (low/medium/high)
    2. Примерное время выполнения в часах
    3. Подходящего исполнителя (frontend/backend/design)

    Задача: {task.title}
    Описание: {task.description}

    Ответь в формате JSON:
    {
      "priority": "string",
      "estimatedHours": "number",
      "assignee": "string"
    }
  Сохранить результат в переменную: ✓ analysis

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  ID карточки: {task.id}
  Текст комментария: 🤖 AI Анализ:
    Приоритет: {analysis.priority}
    Время: {analysis.estimatedHours}ч
    Назначить на: {analysis.assignee}
```

---

### Генерация описания продукта

```
Блок: Get Data (Получение данных)
  Переменная: product_data
  Источник: api/products/{product_id}
  Сохранить результат в переменную: ✓ product

⭐ Блок: AI Request (AI запрос) ⭐
  AI Модель: GPT-4
  Промпт: Ты профессиональный копирайтер. Создай привлекательное описание продукта для интернет-магазина (2-3 абзаца):

    Название: {product.name}
    Категория: {product.category}
    Характеристики: {product.features}
    Цена: {product.price} руб
  Сохранить результат в переменную: ✓ description

Блок: API Call (API вызов)
  URL: api/products/{product_id}
  HTTP Method: PUT
  Body: {"description": "{description}"}
  Сохранить результат в переменную: ✓ updated
```

---

### Chatbot поддержки

```
Блок: Webhook (Вебхук)
  Webhook URL: https://flow.kanban.com/webhook/abc123
  HTTP Method: POST
  Webhook Secret: secret_key_123

Блок: Get Data (Получение данных)
  Переменная: chat_history
  Источник: api/chat/{webhook_data.body.user_id}/history
  Сохранить результат в переменную: ✓ history

⭐ Блок: AI Request (AI запрос) ⭐
  AI Модель: GPT-3.5 Turbo
  Промпт: Ты вежливый помощник службы поддержки компании TechCorp. Отвечай кратко и по делу.

    История чата: {history}
    Новое сообщение: {webhook_data.body.message}
  Сохранить результат в переменную: ✓ bot_response

Блок: Send Message (Отправка сообщения)
  Канал отправки: Telegram
  Получатель: {webhook_data.body.chat_id}
  Сообщение: {bot_response}
```

---

### Извлечение данных из резюме

```
Блок: Webhook (Вебхук)
  Webhook URL: https://flow.kanban.com/webhook/hr_123
  HTTP Method: POST
  Webhook Secret: hr_secret

Блок: Extract Text (Извлечение текста)
  Переменная: resume_file
  Источник: {webhook_data.body.resume_url}
  Сохранить результат в переменную: ✓ resume_text

⭐ Блок: AI Request (AI запрос) ⭐
  AI Модель: GPT-4
  Промпт: Ты HR специалист. Извлеки из резюме структурированную информацию в формате JSON:

    Текст резюме: {resume_text}

    Верни JSON с полями:
    {
      "name": "ФИО",
      "email": "email",
      "phone": "телефон",
      "skills": ["навык1", "навык2"],
      "experience_years": число_лет,
      "education": "образование",
      "last_position": "последняя должность"
    }
  Сохранить результат в переменную: ✓ candidate_data

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  ID карточки: hr_applications
  Текст комментария: 📄 Новое резюме:
    Имя: {candidate_data.name}
    Email: {candidate_data.email}
    Опыт: {candidate_data.experience_years} лет
    Навыки: {candidate_data.skills}
```

---

### Анализ тональности отзывов

```
Блок: Get Data (Получение данных)
  Переменная: reviews_data
  Источник: api/products/{product_id}/reviews
  Сохранить результат в переменную: ✓ reviews

Блок: Loop (Цикл)
  Коллекция/Массив: {reviews}
  Переменная элемента: review
  Максимум итераций: 100

  ⭐ Блок: AI Request (AI запрос) ⭐
    AI Модель: GPT-3.5 Turbo
    Промпт: Определи тональность отзыва (positive/neutral/negative) и оцени от 1 до 10:

      Отзыв: "{review.text}"

      Ответь в JSON формате:
      {
        "sentiment": "positive|neutral|negative",
        "score": число_1_10,
        "key_points": ["ключевой момент 1", "момент 2"]
      }
    Сохранить результат в переменную: ✓ sentiment

  ⭐ Блок: MCP Operation (Операция с объектом) ⭐
    Операция: add_comment
    ID карточки: {review.id}
    Текст комментария: 📊 Тональность: {sentiment.sentiment} ({sentiment.score}/10)
      Ключевые моменты: {sentiment.key_points}
```

---

### Генерация отчёта

```
Блок: Get Data (Получение данных)
  Переменная: sales_data
  Источник: api/sales?period=last_month
  Сохранить результат в переменную: ✓ sales

Блок: Transform Data (Преобразование данных)
  Переменная: sales
  Источник: {sales}
  Тип преобразования: Custom
  Код преобразования:
    {
      total: data.reduce((sum, s) => sum + s.amount, 0),
      count: data.length,
      avg: data.reduce((sum, s) => sum + s.amount, 0) / data.length
    }
  Сохранить результат в переменную: ✓ stats

⭐ Блок: AI Request (AI запрос) ⭐
  AI Модель: GPT-4
  Промпт: Ты бизнес-аналитик. Создай детальный отчёт о продажах за месяц:

    Всего продаж: {stats.count}
    Общая сумма: {stats.total} руб
    Средний чек: {stats.avg} руб
    Данные по дням: {sales}

    Отчёт должен включать:
    1. Краткую сводку
    2. Анализ тенденций
    3. Рекомендации
  Сохранить результат в переменную: ✓ report

Блок: Generate File (Генерация файла)
  Имя файла: monthly_sales_report.md
  Формат: Markdown
  Содержимое файла: {report}

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: management@company.com
  Сообщение: Отчёт о продажах за месяц готов
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

```
