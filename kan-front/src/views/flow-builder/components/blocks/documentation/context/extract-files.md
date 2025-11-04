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

## Пример использования

**Сценарий:** Извлечь все PDF файлы из вложений карточки

```json
{
  "variableName": "pdfFiles",
  "source": "card_attachments",
  "filter": {
    "fileType": ["pdf"]
  },
  "saveToVariable": true,
  "outputVariable": "extracted_pdfs"
}
```

## Выходные данные

Переменная будет содержать список файлов, готовых для дальнейшей обработки (например, передачи в Extract Text для OCR).
