# Parallel

## Что это

Параллельное выполнение - запустить несколько веток одновременно.

## Зачем нужен

- Ускорить выполнение (параллельные API запросы)
- Независимые действия одновременно
- Отправить уведомления в разные каналы сразу
- Не ждать завершения одной ветки для старта другой

## Поля

### Execution Mode

Режим выполнения

**Wait for All** - ждать завершения всех веток

- Продолжить только когда все ветки завершены

**Wait for First** - ждать первую завершившуюся

- Как только одна ветка завершилась - продолжить

**Wait for Any (N)** - ждать N веток

- Продолжить когда N веток завершились

**Fire and Forget** - не ждать

- Запустить и сразу продолжить основной поток

### Branches

Ветки для параллельного выполнения

Каждая ветка:

- **Name** - название ветки
- **Blocks** - блоки для выполнения

### Timeout (опционально)

Максимальное время ожидания

Если ветки не завершились за это время - перейти дальше

### On Error

Что делать при ошибке в ветке

**Continue** - продолжить другие ветки
**Stop All** - остановить все ветки
**Ignore** - игнорировать ошибки

### Collect Results

Собрать результаты всех веток

Сохранить в переменную: `{results.branch1}`, `{results.branch2}`

## Примеры использования

### Параллельные API запросы

```
Parallel: Wait for All

Branch "Weather":
  → API Call: Получить погоду

Branch "News":
  → API Call: Получить новости

Branch "Stock":
  → API Call: Получить курсы валют

→ Generate File: Объединить все данные в отчёт
```

### Отправка в разные каналы

```
Parallel: Fire and Forget

Branch "Email":
  → Send Message: Email уведомление

Branch "Slack":
  → Send Message: Slack сообщение

Branch "SMS":
  → Send Message: SMS уведомление

→ Продолжить не дожидаясь отправки
```

### Множественные AI провайдеры

```
Parallel: Wait for First (самый быстрый ответ)

Branch "OpenAI":
  → AI Request: GPT-4

Branch "Claude":
  → AI Request: Claude-3

Branch "Gemini":
  → AI Request: Gemini Pro

→ Использовать первый полученный ответ
```

### Обработка файлов

```
Parallel: Wait for All

Branch "Extract Text":
  → Extract Text: Из PDF
  → AI Request: Анализ текста

Branch "Extract Images":
  → Extract Media: Изображения
  → AI Request: Описание картинок

Branch "Metadata":
  → Get метаданные файла
  → Сохранить в БД

→ Собрать все результаты
→ Создать полный отчёт
```

### Проверки перед действием

```
Parallel: Wait for All (все проверки должны пройти)
Timeout: 10 секунд

Branch "Check Permissions":
  → User Data: Проверить права
  → Condition: Если нет прав - ошибка

Branch "Check Limits":
  → Get Data: Проверить лимиты
  → Condition: Если превышен - ошибка

Branch "Check Balance":
  → API Call: Проверить баланс
  → Condition: Если недостаточно - ошибка

On Error: Stop All
→ Если все проверки прошли - выполнить действие
```

### Синхронизация с несколькими системами

```
Parallel: Fire and Forget

Branch "Jira":
  → API Call: Создать задачу в Jira

Branch "Slack":
  → Send Message: Уведомление в Slack

Branch "Database":
  → Store Data: Сохранить в БД

Branch "Analytics":
  → Send Event: Отправить в аналитику

→ Не ждать, продолжить основной поток
```
