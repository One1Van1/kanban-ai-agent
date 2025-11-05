# Store Data - Сохранить данные

## Описание

Сохраняет данные в постоянное хранилище (база данных, кэш, файл) по ключу для последующего использования.

## Категория

**Actions** (Действия)

## Конфигурация

### Поля

- **Storage Key** (`storageKey`) - Ключ для сохранения данных
- **Storage Value** (`storageValue`) - Данные для сохранения (может быть текст, JSON, переменная)

### Variable Storage

❌ **Не поддерживает сохранение в переменную** (блок записи данных)

## Пример использования

**Сценарий 1:** Сохранить настройки пользователя

```json
{
  "storageKey": "user_settings_123",
  "storageValue": "{\"theme\": \"dark\", \"language\": \"ru\", \"notifications\": true}"
## Примеры использования

### Кэширование результата API

```

Блок: Event Listener (Слушатель событий)
Event Type: weather.check
Сохранить результат в переменную: ✓ weather_event

Блок: Get Data (Получение данных)
Переменная: cached*weather
Источник: cache:weather*{weather_event.city}
Сохранить результат в переменную: ✓ cache_check

Блок: If-Else (Условие)
Условие: {cache_check} === null

True (Нет кэша - получить свежие данные):
Блок: API Call (API вызов)
URL: https://api.weather.com/v1/current?city={weather_event.city}
HTTP Method: GET
Сохранить результат в переменную: ✓ api_response

    Блок: Store Data (Сохранение данных)
      Тип хранилища: Cache
      Ключ: weather_{weather_event.city}
      Значение: {api_response.data}
      TTL (секунды): 1800
      Сохранить результат в переменную: ✓ stored

    Блок: Send Message (Отправка сообщения)
      Канал отправки: Slack
      Получатель: {weather_event.channel}
      Сообщение: 🌤 Погода в {weather_event.city}: {api_response.data.temp}°C

False (Есть кэш - использовать):
Блок: Send Message (Отправка сообщения)
Канал отправки: Slack
Получатель: {weather_event.channel}
Сообщение: 🌤 Погода (из кэша): {cached_weather.temp}°C

```

---

### Сохранение пользовательских настроек

```

Блок: Event Listener (Слушатель событий)
Event Type: user.preferences_updated
Сохранить результат в переменную: ✓ pref_event

⭐ Блок: Store Data (Сохранение данных) ⭐
Тип хранилища: Database
Ключ: user*preferences*{pref_event.user.id}
Значение: {
"theme": "{pref_event.preferences.theme}",
"notifications": {pref_event.preferences.notifications},
"language": "{pref_event.preferences.language}",
"updated_at": "{pref_event.timestamp}"
}
Сохранить результат в переменную: ✓ saved

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
Целевая задача: {pref_event.task_id}
Текст комментария: ✅ Настройки сохранены для пользователя {pref_event.user.name}

```

---

### Счётчик запусков flow

```

Блок: Schedule (Расписание)
Тип расписания: Cron Expression
Cron выражение: 0 _/1 _ \* \*
Временная зона: Europe/Moscow
Сохранить результат в переменную: ✓ schedule_event

Блок: Get Data (Получение данных)
Переменная: run_count
Источник: database:flow_run_counter
Сохранить результат в переменную: ✓ current_count

Блок: Transform Data (Преобразование данных)
Переменная: new_count
Источник: {current_count} + 1
Тип преобразования: JavaScript
Код преобразования: return (context.current_count || 0) + 1;
Сохранить результат в переменную: ✓ incremented

⭐ Блок: Store Data (Сохранение данных) ⭐
Тип хранилища: Database
Ключ: flow_run_counter
Значение: {incremented}
Сохранить результат в переменную: ✓ updated

Блок: If-Else (Условие)
Условие: {incremented} % 100 === 0

True:
Блок: Send Message (Отправка сообщения)
Канал отправки: Slack
Получатель: #monitoring
Сообщение: 🎉 Flow выполнен {incremented} раз!

```

---

### Хранение результатов обработки

```

Блок: Event Listener (Слушатель событий)
Event Type: document.uploaded
Сохранить результат в переменную: ✓ doc_event

Блок: Extract Text (Извлечение текста)
Переменная: document_file
Источник: {doc_event.document.file}
Язык документа: Русский
Извлечь структуру: ✓
Сохранить результат в переменную: ✓ extracted_text

Блок: AI Request (AI запрос)
Промпт: Проанализируй документ и извлеки ключевые данные:

    {extracted_text}

    Верни JSON с полями: title, category, keywords, summary

Модель: gpt-4
Формат ответа: JSON
Сохранить результат в переменную: ✓ ai_analysis

⭐ Блок: Store Data (Сохранение данных) ⭐
Тип хранилища: Database
Ключ: document*analysis*{doc_event.document.id}
Значение: {
"document_id": "{doc_event.document.id}",
"extracted_text": "{extracted_text}",
"ai_analysis": {ai_analysis},
"processed_at": "{doc_event.timestamp}"
}
Сохранить результат в переменную: ✓ stored

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
Целевая задача: {doc_event.task_id}
Текст комментария: 📄 Документ обработан:

    **Категория:** {ai_analysis.category}
    **Ключевые слова:** {ai_analysis.keywords}
    **Краткое содержание:** {ai_analysis.summary}

```

---

### Session storage для временных данных

```

Блок: Manual Trigger (Ручной запуск)
Название триггера: Начать опрос
Сохранить результат в переменную: ✓ survey_trigger

⭐ Блок: Store Data (Сохранение данных) ⭐
Тип хранилища: Session
Ключ: survey*session*{survey_trigger.user.id}
Значение: {
"started_at": "{survey_trigger.timestamp}",
"user_id": "{survey_trigger.user.id}",
"step": 1,
"answers": []
}
Сохранить результат в переменную: ✓ session_created

Блок: Wait Response (Ожидание ответа)
Вопрос: Как вы оцениваете наш сервис? (1-10)
Целевой пользователь: {survey_trigger.user.id}
Timeout: 300
Сохранить результат в переменную: ✓ answer_1

Блок: Get Data (Получение данных)
Переменная: current*session
Источник: session:survey_session*{survey_trigger.user.id}
Сохранить результат в переменную: ✓ session

Блок: Transform Data (Преобразование данных)
Переменная: updated_session
Источник: {session}
Тип преобразования: JavaScript
Код преобразования:
const s = context.session;
s.answers.push({ step: 1, answer: context.answer_1 });
s.step = 2;
return s;
Сохранить результат в переменную: ✓ updated

⭐ Блок: Store Data (Сохранение данных) ⭐
Тип хранилища: Session
Ключ: survey*session*{survey_trigger.user.id}
Значение: {updated_session}

```

---

### Файловое хранилище для бэкапов

```

Блок: Schedule (Расписание)
Тип расписания: Cron Expression
Cron выражение: 0 2 \* \* \*
Временная зона: Europe/Moscow
Описание: Каждый день в 2:00
Сохранить результат в переменную: ✓ backup_schedule

Блок: Get Data (Получение данных)
Переменная: all_data
Источник: api/data/export?full=true
Сохранить результат в переменную: ✓ data

⭐ Блок: Store Data (Сохранение данных) ⭐
Тип хранилища: File
Ключ: backups/backup\_{backup_schedule.date}.json
Значение: {data}
Сохранить результат в переменную: ✓ backup_saved

Блок: Transform Data (Преобразование данных)
Переменная: backup_size
Источник: {backup_saved}
Тип преобразования: JavaScript
Код преобразования: return JSON.stringify(context.data).length;
Сохранить результат в переменную: ✓ size

Блок: Send Message (Отправка сообщения)
Канал отправки: Email
Получатель: admin@company.com
Тема письма: Бэкап завершён {backup_schedule.date}
Сообщение: Размер бэкапа: {size} байт
Путь: {backup_saved.path}

```

```
