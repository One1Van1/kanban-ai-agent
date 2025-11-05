# Extract Media

## Что это

Извлечь медиа из файлов (изображения, видео, аудио).

## Зачем нужен

- Получить картинки из PDF
- Извлечь кадры из видео
- Аудио из видео файлов
- Обработка медиа контента

## Поля

### Source

Откуда файл

**File URL** - ссылка
**File from Variable** - из переменной
**Upload** - загрузить

### Media Type

Что извлекать

**Images** - изображения

- Из PDF, Word, архивов

**Video Frames** - кадры из видео

- Можно указать интервал (каждую N секунду)

**Audio** - аудиодорожка

- Из видео файлов

**Thumbnails** - превью

- Для видео или больших изображений

### Extract Options

#### Для Images

- **Format** - в какой формат конвертировать (jpg, png, webp)
- **Max Size** - максимальный размер
- **Quality** - качество (1-100)

#### Для Video Frames

- **Interval** - интервал между кадрами (секунды)
- **Format** - формат кадров
- **Start Time** / **End Time** - диапазон видео

#### Для Audio

- **Format** - формат аудио (mp3, wav, ogg)
- **Quality** - битрейт

### Save Result to Variable

Имя переменной

Результат: массив файлов
Пример: `media` → `{media[0].url}`, `{media.length}`

## Примеры использования

### Изображения из PDF презентации

```
Блок: Webhook (Вебхук)
  HTTP Метод: Получение данных (POST)
  Сохранить результат в переменную: ✓ webhook_data

⭐ Блок: Extract Media (Извлечение медиа) ⭐
  Переменная: webhook_data
  Источник: {webhook_data.body.presentation_url}
  Тип медиа: Images
  Опции извлечения:
    Формат: png
    Макс размер: 1920x1080
    Качество: 90
  Сохранить результат в переменную: ✓ images

Блок: Loop (Цикл)
  Коллекция/Массив: {images}
  Переменная элемента: image

  Блок: AI Request (AI запрос)
    AI Модель: GPT-4 Vision
    Промпт: Опиши что на этом изображении из презентации
    Изображение: {image.url}
    Сохранить результат в переменную: ✓ description

  ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
    ID карточки: presentation_gallery
    Текст комментария: Слайд {image.index}: {description.content}
```

---

### Превью для видео

```
Блок: Event Listener (Слушатель событий)
  Event Type: video.uploaded
  Сохранить результат в переменную: ✓ video_event

⭐ Блок: Extract Media (Извлечение медиа) ⭐
  Переменная: video_event
  Источник: {video_event.video.url}
  Тип медиа: Video Frames
  Опции извлечения:
    Интервал: 10 секунд
    Формат: jpg
    Время начала: 0
    Время конца: 60
    Качество: 80
  Сохранить результат в переменную: ✓ frames

Блок: Transform Data (Преобразование данных)
  Переменная: frames
  Источник: {frames}
  Тип преобразования: Map
  Map выражение:
    {
      url: item.url,
      timestamp: item.timestamp,
      thumbnail: true
    }
  Сохранить результат в переменную: ✓ thumbnails

Блок: API Call (API вызов)
  Адрес сервиса: api/videos/{video_event.video.id}/thumbnails
  Тип запроса: POST
  Данные для отправки: {thumbnails}
```

---

### Транскрипция видео

```
Блок: Get Data (Получение данных)
  Переменная: video_data
  Источник: api/videos/123
  Сохранить результат в переменную: ✓ video

⭐ Блок: Extract Media (Извлечение медиа) ⭐
  Переменная: video
  Источник: {video.file_url}
  Тип медиа: Audio
  Опции извлечения:
    Формат: mp3
    Битрейт: 128kbps
  Сохранить результат в переменную: ✓ audio

Блок: API Call (API вызов)
  Адрес сервиса: https://api.openai.com/v1/audio/transcriptions
  Тип запроса: POST
  Настройки подключения: {"Authorization": "Bearer {OPENAI_KEY}"}
  Данные для отправки:
    {
      "file": {audio.url},
      "model": "whisper-1",
      "language": "ru"
    }
  Сохранить результат в переменную: ✓ transcription

Блок: Generate File (Генерация файла)
  Имя файла: {video.name}_transcript.txt
  Формат: TXT
  Содержимое файла: {transcription.text}

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  ID карточки: {video.card_id}
  Текст комментария: 📝 Транскрипция готова:
    Длительность аудио: {audio.duration}с
    Распознано текста: {transcription.text.length} символов
```

---

### Обработка скриншотов багов

```
Блок: Webhook (Вебхук)
  HTTP Метод: Получение данных (POST)
  Сохранить результат в переменную: ✓ bug_report

⭐ Блок: Extract Media (Извлечение медиа) ⭐
  Переменная: bug_report
  Источник: {bug_report.body.attachments}
  Тип медиа: Images
  Опции извлечения:
    Формат: png
    Качество: 90
  Сохранить результат в переменную: ✓ screenshots

Блок: Loop (Цикл)
  Коллекция/Массив: {screenshots}
  Переменная элемента: screenshot

  Блок: AI Request (AI запрос)
    AI Модель: GPT-4 Vision
    System Prompt: Ты QA специалист. Анализируй скриншоты багов.
    Промпт: Проанализируй скриншот и определи:
      1. Что на экране (какая страница/компонент)
      2. Тип бага (UI, функциональный, данные)
      3. Серьёзность (critical/high/medium/low)
      4. Теги для классификации

      Изображение: {screenshot.url}
    Response Format: JSON
    JSON Schema:
      {
        "page": "string",
        "bug_type": "string",
        "severity": "string",
        "tags": ["string"],
        "description": "string"
      }
    Сохранить результат в переменную: ✓ analysis

  ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
    ID карточки: {bug_report.body.issue_id}
    Текст комментария: 🐛 Анализ скриншота:
      Страница: {analysis.page}
      Тип: {analysis.bug_type}
      Серьёзность: {analysis.severity}
      Теги: {analysis.tags.join(', ')}
      {analysis.description}
```

---

### Оптимизация архива фотографий

```
Блок: Manual Trigger (Ручной запуск)
  Trigger Name: Обработать архив фотографий
  Input Parameters:
    [
      {
        "name": "archive_file",
        "type": "file",
        "label": "Архив с фотографиями (ZIP)",
        "required": true
      }
    ]
  Сохранить результат в переменную: ✓ trigger_params

⭐ Блок: Extract Media (Извлечение медиа) ⭐
  Переменная: trigger_params
  Источник: {trigger_params.archive_file}
  Тип медиа: Images
  Опции извлечения:
    Формат: webp
    Макс размер: 1920x1080
    Качество: 85
  Сохранить результат в переменную: ✓ images

Блок: Transform Data (Преобразование данных)
  Переменная: images
  Источник: {images}
  Тип преобразования: Map
  Map выражение:
    {
      original_name: item.name,
      optimized_url: item.url,
      original_size: item.original_size,
      optimized_size: item.size,
      compression: ((1 - item.size / item.original_size) * 100).toFixed(1) + '%'
    }
  Сохранить результат в переменную: ✓ stats

Блок: Loop (Цикл)
  Коллекция/Массив: {images}
  Переменная элемента: image

  Блок: API Call (API вызов)
    Адрес сервиса: https://storage.cloud.com/upload
    Тип запроса: POST
    Данные для отправки:
      {
        "file": {image.url},
        "folder": "optimized_photos"
      }

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: {current_user.email}
  Сообщение: ✅ Обработка завершена:
    Обработано фотографий: {images.length}
    Средняя степень сжатия: {stats.reduce((sum, s) => sum + parseFloat(s.compression), 0) / stats.length}%
    Все фото загружены в облако
```
