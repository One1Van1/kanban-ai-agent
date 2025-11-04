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
Webhook: Получен файл резюме (PDF)
Extract Text: {webhook.attachment}
  Extract Options: With Formatting
→ AI анализирует текст резюме
→ Извлекает: имя, email, опыт, навыки
→ Создаёт задачу HR
```

### Сканы документов

```
Manual Trigger: "Распознать скан"
  Upload: photo.jpg
Extract Text:
  OCR Language: ru
  Mode: accurate
→ Сохранить текст
→ Создать редактируемый документ
```

### Анализ контрактов

```
Event: Загружен контракт (PDF)
Extract Text: {contract.file}
  Extract Options: With Formatting, Tables
→ AI проверяет:
  - Все ли подписи есть
  - Все ли суммы совпадают
  - Нет ли подозрительных условий
→ Отправляет на утверждение
```

### Обработка счетов

```
Email Trigger: Получен счёт
Extract Text: {email.attachment}
  Extract Options: Tables, Metadata
→ Извлечь:
  - Номер счёта
  - Сумму
  - Дату оплаты
→ Создать задачу "Оплатить счёт"
```

### База знаний из документов

```
Folder Watcher: Новый документ в папке
Extract Text: {file}
→ RAG Processing: индексировать текст
→ Сохранить в базу знаний
→ Теперь AI может отвечать по этому документу
```
