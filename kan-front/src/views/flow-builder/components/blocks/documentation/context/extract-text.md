# Extract Text

## Что это

Извлечь текст из файлов (PDF, Word, изображений с OCR).

## Зачем нужен

- Читать текст из PDF документов
- OCR для сканов и фото
- Парсить Word/Excel файлы
- Обработка документов AI

## Поля

### Source

Откуда брать файл

**File URL** - ссылка на файл

- Пример: `https://example.com/document.pdf`

**File from Variable** - файл из переменной

- Пример: `{attachment.file}`

**Upload** - загрузить файл сейчас

### File Type

Тип файла (опционально, определится автоматически)

- **PDF** - PDF документы
- **DOCX** - Word документы
- **TXT** - текстовые файлы
- **Image** - изображения (будет OCR)

### OCR Settings

Настройки распознавания текста (для изображений)

**Language** - язык текста

- `ru` - русский
- `en` - английский
- `auto` - автоопределение

**Mode** - режим

- `fast` - быстро но менее точно
- `accurate` - медленно но точно

### Extract Options

Что извлекать

- **Text Only** - только текст
- **With Formatting** - с форматированием (заголовки, списки)
- **Tables** - таблицы отдельно
- **Metadata** - метаданные (автор, дата создания)

### Save Result to Variable

Имя переменной для текста

Пример: `extracted_text` → `{extracted_text.content}`

## Примеры использования

### Обработка резюме

```
Блок: Webhook (Вебхук)
  HTTP Метод: Получение данных (POST)
  Сохранить результат в переменную: ✓ webhook_data

⭐ Блок: Extract Text (Извлечение текста) ⭐
  Переменная: webhook_data
  Источник: {webhook_data.body.resume_file_url}
  Тип файла: PDF
  Настройки OCR: (не нужны для PDF с текстом)
  Опции извлечения: With Formatting
  Сохранить результат в переменную: ✓ resume_text

Блок: AI Request (AI запрос)
  AI Модель: GPT-4
  Промпт: Проанализируй резюме и извлеки: имя, email, телефон, опыт работы (в годах), ключевые навыки. Текст резюме: {resume_text.content}
  Сохранить результат в переменную: ✓ parsed_resume

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  ID карточки: hr_applications
  Текст комментария: Новое резюме от {parsed_resume.name}. Опыт: {parsed_resume.experience} лет.
```

---

### Сканы документов

```
Блок: Manual Trigger (Ручной запуск)
  Trigger Name: Распознать скан
  Input Parameters: [{"name": "scan_file", "type": "file"}]

⭐ Блок: Extract Text (Извлечение текста) ⭐
  Переменная: (можно оставить пустым)
  Источник: {scan_file}
  Тип файла: Image
  Настройки OCR:
    Язык: ru
    Режим: accurate
  Опции извлечения: Text Only
  Сохранить результат в переменную: ✓ scan_text

Блок: Generate File (Генерация файла)
  Имя файла: recognized_text.txt
  Формат: TXT
  Содержимое файла: {scan_text.content}

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: user@company.com
  Сообщение: Распознанный текст из скана
  Вложение: recognized_text.txt
```

---

### Анализ контрактов

```
Блок: Event Listener (Слушатель событий)
  Event Type: document.uploaded
  Event Filter: {"document_type": "contract"}
  Сохранить результат в переменную: ✓ event

⭐ Блок: Extract Text (Извлечение текста) ⭐
  Переменная: event
  Источник: {event.document.file_url}
  Тип файла: PDF
  Опции извлечения: With Formatting, Tables, Metadata
  Сохранить результат в переменную: ✓ contract_text

Блок: AI Request (AI запрос)
  AI Модель: GPT-4
  Промпт: Проверь контракт на:
    1. Наличие всех подписей
    2. Совпадение сумм в тексте и таблицах
    3. Подозрительные условия

    Текст: {contract_text.content}
    Таблицы: {contract_text.tables}
  Сохранить результат в переменную: ✓ contract_analysis

Блок: IF/ELSE
  Условие: {contract_analysis.has_issues} === true

  Если ИСТИНА:
    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
      ID карточки: {event.document.card_id}
      Текст комментария: ⚠️ Найдены проблемы: {contract_analysis.issues}

  Если ЛОЖЬ:
    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
      ID карточки: {event.document.card_id}
      Текст комментария: ✅ Контракт проверен, замечаний нет
```

---

### Обработка счетов

```
Блок: Webhook (Вебхук)
  HTTP Метод: Получение данных (POST)
  Сохранить результат в переменную: ✓ email_data

⭐ Блок: Extract Text (Извлечение текста) ⭐
  Переменная: email_data
  Источник: {email_data.body.attachments[0].url}
  Тип файла: PDF
  Опции извлечения: Tables, Metadata
  Сохранить результат в переменную: ✓ invoice_text

Блок: AI Request (AI запрос)
  AI Модель: GPT-4
  Промпт: Извлеки из счёта:
    - Номер счёта
    - Сумму к оплате
    - Дату выставления
    - Срок оплаты

    Текст: {invoice_text.content}
    Таблицы: {invoice_text.tables}
  Сохранить результат в переменную: ✓ invoice_data

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  ID карточки: invoices_board
  Текст комментария: Новый счёт №{invoice_data.number}
    Сумма: {invoice_data.amount} руб
    Оплатить до: {invoice_data.due_date}

Блок: Send Message (Отправка сообщения)
  Канал отправки: Telegram
  Получатель: finance_chat
  Сообщение: 💰 Счёт на оплату: {invoice_data.amount} руб до {invoice_data.due_date}
```

---

### База знаний из документов

```
Блок: Event Listener (Слушатель событий)
  Event Type: file.uploaded
  Event Filter: {"folder": "knowledge_base"}
  Сохранить результат в переменную: ✓ event

⭐ Блок: Extract Text (Извлечение текста) ⭐
  Переменная: event
  Источник: {event.file.url}
  Тип файла: (автоопределение)
  Опции извлечения: With Formatting
  Сохранить результат в переменную: ✓ document_text

Блок: RAG Processing (RAG обработка)
  Переменная: document_text
  Источник: {document_text.content}
  Действие: Индексировать
  Метаданные:
    Название: {event.file.name}
    Дата: {event.file.created_at}
    Автор: {event.file.uploaded_by}
  Сохранить результат в переменную: ✓ indexed

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  ID карточки: knowledge_base_card
  Текст комментария: Документ "{event.file.name}" добавлен в базу знаний. ID: {indexed.document_id}
```
