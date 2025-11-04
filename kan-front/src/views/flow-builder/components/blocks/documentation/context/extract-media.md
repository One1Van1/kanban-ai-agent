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
Upload: presentation.pdf
Extract Media: Images
  Format: png
  Quality: 90
→ Для каждого изображения:
  → AI генерирует описание
  → Сохранить в галерею
```

### Превью видео

```
Event: Загружено видео
Extract Media: Video Frames
  Interval: 10 секунд
  Format: jpg
→ Создать превью
→ Сохранить для быстрого просмотра
```

### Транскрипция видео

```
Video File: {video}
Extract Media: Audio
  Format: mp3
→ Отправить аудио в Speech-to-Text API
→ Получить текстовую транскрипцию
→ Сохранить как субтитры
```

### Обработка скриншотов багов

```
Webhook: Новый баг с скриншотами
Extract Media: Images from {bug.attachments}
→ Для каждого скриншота:
  → AI анализирует что на экране
  → Определяет тип бага
  → Добавляет теги
```

### Архив фотографий

```
Upload: photos.zip
Extract Media: Images
  Format: webp
  Max Size: 1920x1080
  Quality: 85
→ Оптимизировать размер
→ Загрузить в облако
→ Создать галерею
```
