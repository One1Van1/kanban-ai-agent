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

### Chatbot с базой знаний

```
User Question: {message}
RAG Processing: Search
  Query: {message}
  Collection: company-docs
  Top K: 3
  Save to: relevant_info
→ AI Request:
  System: "Отвечай на основе этой информации"
  Context: {relevant_info}
  Question: {message}
→ Send Message: Ответ пользователю
```

### Индексация новых документов

```
Event: Загружен новый документ
Extract Text: {document}
RAG Processing: Index Document
  Text: {extracted_text}
  Collection: product-manuals
  Chunk Size: 800
  Metadata: {
    "filename": "{document.name}",
    "uploadedBy": "{user.id}"
  }
```

### Поиск похожих тикетов поддержки

```
Event: Новый тикет создан
RAG Processing: Search
  Query: {ticket.description}
  Collection: resolved-tickets
  Top K: 5
  Min Score: 0.75
→ Если найдены похожие:
  → Предложить решения из них
  → Автоматически пометить похожими
```

### Обновление документации

```
Manual Trigger: "Обновить раздел документации"
  Parameters: section_id, new_text
RAG Processing: Update Index
  Document ID: {section_id}
  Text: {new_text}
  Collection: docs
```

### FAQ бот

```
Webhook: Вопрос от пользователя
RAG Processing: Search
  Query: {question}
  Collection: faq
  Top K: 1
  Min Score: 0.8
→ Если нашёлся хороший ответ (score > 0.8):
  → Отправить готовый ответ
→ Иначе:
  → Переключить на человека
```
