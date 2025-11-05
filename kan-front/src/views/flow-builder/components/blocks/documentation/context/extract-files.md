# Extract Files - Извлечь файлы

## Описание

Извлекает файлы из различных источников (вложения карточки, API, хранилище).

## Категория

**Context** (Контекст)

## Конфигурация

### Поля

- **Variable Name** (`variableName`) - Имя переменной для сохранения результата
- **Source** (`source`) - Источник файлов:
  - `card_attachments` - Вложения карточки
  - `api_call` - Из API запроса
  - `file` - Локальный файл
  - `url` - По URL
  - `database` - Из базы данных
- **File Types** (`filter.fileType`) - Типы файлов для фильтрации (например: pdf, docx, txt)

### Variable Storage

✅ **Поддерживает сохранение результата в переменную**

Результат содержит массив файлов с метаданными:

```json
{
  "files": [
    {
      "name": "document.pdf",
      "size": 1024000,
      "type": "application/pdf",
      "path": "/uploads/document.pdf",
      "uploadedBy": "user123"
    }
  ]
}
```

## Примеры использования

### Извлечь PDF из вложений карточки

```
Блок: Get Data (Получение данных)
  Переменная: card_info
  Источник: api/cards/123
  Сохранить результат в переменную: ✓ card

⭐ Блок: Extract Files (Извлечение файлов) ⭐
  Переменная: card
  Источник: {card.attachments}
  Типы файлов: pdf
  Сохранить результат в переменную: ✓ pdf_files

Блок: Loop (Цикл)
  Коллекция/Массив: {pdf_files.files}
  Переменная элемента: file

  Блок: Extract Text (Извлечение текста)
    Переменная: file
    Источник: {file.path}
    Тип файла: PDF
    Сохранить результат в переменную: ✓ text_content

  ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
    ID карточки: {card.id}
    Текст комментария: Обработан файл {file.name}: {text_content.content.substring(0, 100)}...
```

---

### Фильтр изображений для обработки

```
Блок: Webhook (Вебхук)
  HTTP Метод: Получение данных (POST)
  Сохранить результат в переменную: ✓ webhook_data

⭐ Блок: Extract Files (Извлечение файлов) ⭐
  Переменная: webhook_data
  Источник: {webhook_data.body.attachments}
  Типы файлов: jpg, png, jpeg, webp
  Сохранить результат в переменную: ✓ images

Блок: Loop (Цикл)
  Коллекция/Массив: {images.files}
  Переменная элемента: image

  Блок: Extract Media (Извлечение медиа)
    Переменная: image
    Источник: {image.path}
    Действие: Распознать объекты
    Сохранить результат в переменную: ✓ detected_objects

  ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
    ID карточки: media_processing
    Текст комментария: На изображении {image.name} найдено объектов: {detected_objects.count}
```

---

### Извлечь документы из API

```
Блок: API Call (API вызов)
  Адрес сервиса: https://storage.company.com/api/documents?project=123
  Тип запроса: GET
  Настройки подключения: {"Authorization": "Bearer {API_TOKEN}"}
  Сохранить результат в переменную: ✓ api_response

⭐ Блок: Extract Files (Извлечение файлов) ⭐
  Переменная: api_response
  Источник: {api_response.data.files}
  Типы файлов: docx, pdf, xlsx
  Сохранить результат в переменную: ✓ documents

Блок: Transform Data (Преобразование данных)
  Переменная: documents
  Источник: {documents.files}
  Тип преобразования: Map
  Map выражение:
    {
      name: item.name,
      size_mb: (item.size / 1024 / 1024).toFixed(2),
      type: item.type
    }
  Сохранить результат в переменную: ✓ document_list

Блок: Send Message (Отправка сообщения)
  Канал отправки: Slack
  Получатель: #documents
  Сообщение: Найдено документов: {documents.files.length}
    Список: {document_list}
```

---

### Архивировать старые файлы

```
Блок: Schedule (Расписание)
  Тип расписания: Cron Expression
  Cron выражение: 0 2 1 * *
  Временная зона: UTC
  Сохранить результат в переменную: ✓ schedule_event

Блок: Get Data (Получение данных)
  Переменная: old_files_data
  Источник: api/files?older_than=6months
  Сохранить результат в переменную: ✓ old_files

⭐ Блок: Extract Files (Извлечение файлов) ⭐
  Переменная: old_files
  Источник: {old_files.data}
  Типы файлов: (все типы)
  Сохранить результат в переменную: ✓ files_to_archive

Блок: Loop (Цикл)
  Коллекция/Массив: {files_to_archive.files}
  Переменная элемента: file

  Блок: API Call (API вызов)
    Адрес сервиса: api/storage/archive
    Тип запроса: POST
    Данные для отправки:
      {
        "file_id": {file.id},
        "destination": "archive/old_files/"
      }

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: admin@company.com
  Сообщение: Архивировано файлов: {files_to_archive.files.length}
```

---

### Валидация загруженных файлов

```
Блок: Event Listener (Слушатель событий)
  Event Type: files.uploaded
  Сохранить результат в переменную: ✓ upload_event

⭐ Блок: Extract Files (Извлечение файлов) ⭐
  Переменная: upload_event
  Источник: {upload_event.files}
  Типы файлов: pdf, docx, xlsx
  Сохранить результат в переменную: ✓ uploaded_files

Блок: Transform Data (Преобразование данных)
  Переменная: uploaded_files
  Источник: {uploaded_files.files}
  Тип преобразования: Filter
  Условие фильтра: item.size < 10 * 1024 * 1024
  Сохранить результат в переменную: ✓ valid_files

Блок: IF/ELSE
  Условие: {valid_files.length} < {uploaded_files.files.length}

  Если ИСТИНА:
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Email
      Получатель: {upload_event.user.email}
      Сообщение: ⚠️ Некоторые файлы превышают лимит 10MB и не были загружены

  Если ЛОЖЬ:
    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
      ID карточки: {upload_event.card_id}
      Текст комментария: ✅ Загружено файлов: {valid_files.length}
```
