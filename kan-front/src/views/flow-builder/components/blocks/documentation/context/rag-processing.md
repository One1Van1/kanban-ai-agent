# RAG Processing

## Что это

RAG (Retrieval-Augmented Generation) - поиск релевантной информации для AI.

## Зачем нужен

- AI отвечает на основе ваших документов
- Поиск по базе знаний
- Семантический поиск
- Chatbot с контекстом компании

## Поля

### Operation

Что делать

**Index Document** - Добавить документ в базу

- Для новых документов

**Search** - Найти релевантную информацию

- Для ответов AI

**Update Index** - Обновить существующий документ

**Delete** - Удалить из базы

### Text Source (для Index/Update)

Откуда текст

**Direct Text** - вставить текст напрямую

**From Variable** - из переменной

- Пример: `{extracted_text}`

### Query (для Search)

Что искать

Обычный вопрос на естественном языке

Пример: "Какая политика отпусков?"

### Vector Database

Где хранить/искать

**Pinecone** - облачная векторная БД
**Weaviate** - open-source
**Qdrant** - быстрая локальная
**In-Memory** - в памяти (для тестов)

### Collection/Index

Название коллекции

Разные темы в разных коллекциях

**Примеры:**

- `company-docs` - документы компании
- `product-manuals` - мануалы
- `customer-support` - база знаний поддержки

### Chunk Settings (для Index)

**Chunk Size** - размер фрагмента текста

- Обычно 500-1000 символов

**Overlap** - перекрытие между фрагментами

- Обычно 50-100 символов

### Search Settings (для Search)

**Top K** - сколько результатов вернуть

- Обычно 3-5

**Min Score** - минимальная релевантность

- 0.0 - 1.0, обычно > 0.7

### Metadata (опционально)

Дополнительные данные о документе

```json
{
  "source": "employee-handbook.pdf",
  "category": "HR",
  "date": "2024-01-15"
}
```

### Save Result to Variable

Имя переменной

Для Search: массив найденных фрагментов
Пример: `context` → `{context[0].text}`

## Примеры использования

### Chatbot с базой знаний компании

```
Блок: Webhook (Вебхук)
  HTTP Метод: Получение данных (POST)
  Сохранить результат в переменную: ✓ user_message

⭐ Блок: RAG Processing (RAG обработка) ⭐
  Переменная: search_query
  Действие: Search
  Запрос: {user_message.body.question}
  Vector Database: Pinecone
  Коллекция: company-docs
  Настройки поиска:
    Top K: 3
    Min Score: 0.7
  Сохранить результат в переменную: ✓ relevant_info

Блок: AI Request (AI запрос)
  AI Модель: GPT-4
  System Prompt: Ты помощник компании. Отвечай только на основе предоставленной информации. Если информации нет - скажи об этом.
  Промпт: Контекст из базы знаний:
    {relevant_info.map(r => r.text).join('\n\n')}

    Вопрос пользователя: {user_message.body.question}
  Temperature: 0.3
  Сохранить результат в переменную: ✓ ai_answer

Блок: Send Message (Отправка сообщения)
  Канал отправки: {user_message.body.channel}
  Получатель: {user_message.body.user_id}
  Сообщение: {ai_answer.content}

    Источники:
    {relevant_info.map(r => `- ${r.metadata.source} (релевантность: ${r.score})`).join('\n')}
```

---

### Индексация новых документов

```
Блок: Event Listener (Слушатель событий)
  Event Type: document.uploaded
  Event Filter: {"category": "documentation"}
  Сохранить результат в переменную: ✓ doc_event

Блок: Extract Text (Извлечение текста)
  Переменная: doc_event
  Источник: {doc_event.document.file_url}
  Тип файла: PDF
  Опции извлечения: With Formatting, Metadata
  Сохранить результат в переменную: ✓ extracted_text

⭐ Блок: RAG Processing (RAG обработка) ⭐
  Переменная: extracted_text
  Действие: Index Document
  Источник текста: {extracted_text.content}
  Vector Database: Weaviate
  Коллекция: product-manuals
  Настройки разбиения:
    Размер фрагмента: 800 символов
    Перекрытие: 100 символов
  Метаданные:
    {
      "filename": {doc_event.document.name},
      "uploadedBy": {doc_event.user.name},
      "uploadedAt": {doc_event.timestamp},
      "category": {doc_event.document.category},
      "pages": {extracted_text.metadata.pages}
    }
  Сохранить результат в переменную: ✓ index_result

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  ID карточки: documentation_index
  Текст комментария: ✅ Документ проиндексирован:
    Название: {doc_event.document.name}
    Фрагментов: {index_result.chunks_count}
    Vector ID: {index_result.document_id}
    Коллекция: product-manuals
```

---

### Поиск похожих тикетов поддержки

```
Блок: Event Listener (Слушатель событий)
  Event Type: ticket.created
  Сохранить результат в переменную: ✓ new_ticket

⭐ Блок: RAG Processing (RAG обработка) ⭐
  Переменная: ticket_search
  Действие: Search
  Запрос: {new_ticket.ticket.title} {new_ticket.ticket.description}
  Vector Database: Qdrant
  Коллекция: resolved-tickets
  Настройки поиска:
    Top K: 5
    Min Score: 0.75
  Сохранить результат в переменную: ✓ similar_tickets

Блок: IF/ELSE
  Условие: {similar_tickets.length} > 0

  Если ИСТИНА:
    Блок: Transform Data (Преобразование данных)
      Переменная: similar_tickets
      Источник: {similar_tickets}
      Тип преобразования: Map
      Map выражение:
        {
          ticket_id: item.metadata.ticket_id,
          title: item.metadata.title,
          solution: item.metadata.solution,
          similarity: (item.score * 100).toFixed(1) + '%'
        }
      Сохранить результат в переменную: ✓ suggestions

    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
      ID карточки: {new_ticket.ticket.id}
      Текст комментария: 🔍 Найдены похожие решённые тикеты:

        {suggestions.map(s => `
        **Тикет #${s.ticket_id}** (похожесть: ${s.similarity})
        ${s.title}
        Решение: ${s.solution}
        `).join('\n---\n')}

    Блок: Send Message (Отправка сообщения)
      Канал отправки: Email
      Получатель: {new_ticket.ticket.assignee.email}
      Сообщение: Новый тикет #{new_ticket.ticket.id} похож на {similar_tickets.length} решённых тикетов. Проверь комментарии.

  Если ЛОЖЬ:
    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
      ID карточки: {new_ticket.ticket.id}
      Текст комментария: ℹ️ Похожих тикетов не найдено - новая проблема
```

---

### Обновление раздела документации

```
Блок: Manual Trigger (Ручной запуск)
  Trigger Name: Обновить раздел документации
  Input Parameters:
    [
      {
        "name": "section_id",
        "type": "text",
        "label": "ID раздела",
        "required": true
      },
      {
        "name": "new_content",
        "type": "textarea",
        "label": "Новый текст",
        "required": true
      },
      {
        "name": "change_note",
        "type": "text",
        "label": "Что изменилось"
      }
    ]
  Сохранить результат в переменную: ✓ update_params

⭐ Блок: RAG Processing (RAG обработка) ⭐
  Переменная: update_doc
  Действие: Update Index
  Document ID: {update_params.section_id}
  Источник текста: {update_params.new_content}
  Vector Database: Pinecone
  Коллекция: company-docs
  Метаданные:
    {
      "last_updated": new Date().toISOString(),
      "updated_by": {current_user.name},
      "change_note": {update_params.change_note}
    }
  Сохранить результат в переменную: ✓ update_result

Блок: Send Message (Отправка сообщения)
  Канал отправки: Slack
  Получатель: #documentation
  Сообщение: 📝 Документация обновлена:
    Раздел: {update_params.section_id}
    Изменения: {update_params.change_note}
    Автор: {current_user.name}
```

---

### FAQ бот с автоматическим ответом

```
Блок: Webhook (Вебхук)
  HTTP Метод: Получение данных (POST)
  Сохранить результат в переменную: ✓ faq_question

⭐ Блок: RAG Processing (RAG обработка) ⭐
  Переменная: faq_search
  Действие: Search
  Запрос: {faq_question.body.question}
  Vector Database: Weaviate
  Коллекция: faq
  Настройки поиска:
    Top K: 1
    Min Score: 0.8
  Сохранить результат в переменную: ✓ faq_match

Блок: IF/ELSE
  Условие: {faq_match.length} > 0 && {faq_match[0].score} >= 0.8

  Если ИСТИНА (найден точный ответ):
    Блок: Send Message (Отправка сообщения)
      Канал отправки: {faq_question.body.channel}
      Получатель: {faq_question.body.user_id}
      Сообщение: {faq_match[0].text}

        📚 FAQ: {faq_match[0].metadata.category}
        Релевантность: {(faq_match[0].score * 100).toFixed(1)}%

    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
      ID карточки: faq_stats
      Текст комментария: ✅ Автоответ FAQ:
        Вопрос: {faq_question.body.question}
        Совпадение: {(faq_match[0].score * 100).toFixed(1)}%

  Если ЛОЖЬ (точного ответа нет):
    Блок: AI Request (AI запрос)
      AI Модель: GPT-3.5 Turbo
      Промпт: Вежливо скажи что не нашёл точного ответа на вопрос: "{faq_question.body.question}". Предложи связаться с поддержкой.
      Сохранить результат в переменную: ✓ fallback_answer

    Блок: Send Message (Отправка сообщения)
      Канал отправки: {faq_question.body.channel}
      Получатель: {faq_question.body.user_id}
      Сообщение: {fallback_answer.content}

    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
      ID карточки: support_queue
      Текст комментария: ❓ Нужна помощь support:
        Вопрос: {faq_question.body.question}
        Пользователь: {faq_question.body.user_id}
```
