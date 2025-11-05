# Loop

## Что это

Цикл - повторять действия для каждого элемента или N раз.

## Зачем нужен

- Обработать список задач/пользователей
- Повторить действие несколько раз
- Массовые операции

## Поля

### Loop Type

Тип цикла

**For Each** - для каждого элемента массива

- Самый частый вариант

**For N Times** - повторить N раз

- Когда нужно точное количество повторов

**While Condition** - пока условие верно

- Когда неизвестно сколько итераций нужно

### Array (для For Each)

Массив для обработки

Обычно из переменной: `{tasks}`, `{users}`, `{items}`

### Count (для For N Times)

Сколько раз повторить

Может быть переменная: `{users.length}`, `5`, `{retryCount}`

### Condition (для While)

Условие продолжения цикла

Пример: `{processedCount} < {total}`

### Current Item Variable

Имя переменной для текущего элемента

**Для For Each:**

- `item` → внутри цикла доступно как `{item.name}`, `{item.id}`

**Для For N Times:**

- `index` → `{index}` (0, 1, 2, 3...)

### Max Iterations (опционально)

Максимум итераций (защита от бесконечного цикла)

Рекомендуется для While

### Loop Body

Блоки которые выполняются в каждой итерации

### Break/Continue

**Break** - прервать цикл
**Continue** - перейти к следующей итерации

Можно добавить Condition внутри цикла чтобы прервать его

## Примеры использования

### Обработать все задачи

```
Блок: Get Data (Получение данных)
  Переменная: all_tasks
  Источник: api/tasks?status=pending
  Сохранить результат в переменную: ✓ tasks

⭐ Блок: Loop (Цикл) ⭐
  Тип цикла: For Each
  Итерировать по: {tasks}
  Переменная элемента: task
  Max Iterations: 100

  Внутри цикла:
    Блок: AI Request (AI запрос)
      Промпт: Проанализируй задачу и предложи теги:
        Название: {task.title}
        Описание: {task.description}
      Модель: gpt-3.5-turbo
      Сохранить результат в переменную: ✓ suggested_tags

    Блок: API Call (API вызов)
      URL: https://api.example.com/tasks/{task.id}/tags
      HTTP Method: PUT
      Body: { "tags": {suggested_tags} }

    Блок: Wait Timeout (Задержка)
      Длительность (секунды): 1
      Описание: Задержка чтобы не перегрузить AI
```

---

### Отправить уведомления всем пользователям

```
Блок: Event Listener (Слушатель событий)
  Event Type: announcement.created
  Сохранить результат в переменную: ✓ announcement

Блок: Get Data (Получение данных)
  Переменная: active_users
  Источник: api/users?status=active
  Сохранить результат в переменную: ✓ users

⭐ Блок: Loop (Цикл) ⭐
  Тип цикла: For Each
  Итерировать по: {users}
  Переменная элемента: user

  Внутри цикла:
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Email
      Получатель: {user.email}
      Тема письма: {announcement.title}
      Сообщение: {announcement.message}

    Блок: Store Data (Сохранение данных)
      Ключ: notification_sent_{user.id}_{announcement.id}
      Значение: {now}

    Блок: Wait Timeout (Задержка)
      Длительность (секунды): 0.5
      Описание: Rate limiting для email
```

---

### Повторить с задержкой (Retry)

```
Блок: Event Listener (Слушатель событий)
  Event Type: data.sync_needed
  Сохранить результат в переменную: ✓ sync_event

⭐ Блок: Loop (Цикл) ⭐
  Тип цикла: For N Times
  Количество итераций: 3
  Переменная индекса: attempt

  Внутри цикла:
    Блок: API Call (API вызов)
      URL: https://api.example.com/v1/sync
      HTTP Method: POST
      Body: {sync_event.data}
      Timeout: 30
      Сохранить результат в переменную: ✓ sync_result

    Блок: If-Else (Условие)
      Условие: {sync_result.status} === 200

      True (Успех):
        ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
          Текст комментария: ✅ Синхронизация успешна на попытке {attempt}

        Блок: Break (Прервать цикл)
          Описание: Выйти из цикла при успехе

      False (Ошибка):
        Блок: Transform Data (Преобразование данных)
          Переменная: delay_seconds
          Источник: {attempt} * 2
          Тип преобразования: JavaScript
          Код преобразования: return context.attempt * 2;
          Сохранить результат в переменную: ✓ delay

        Блок: Wait Timeout (Задержка)
          Длительность (секунды): {delay}
          Описание: Экспоненциальная задержка: 2, 4, 6 секунд

        ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
          Текст комментария: Попытка {attempt} не удалась, повтор через {delay}с

Блок: If-Else (Условие)
  Условие: {sync_result.status} !== 200

  True (Все попытки провалились):
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Slack
      Получатель: #devops-alerts
      Сообщение: ⚠️ Синхронизация провалилась после 3 попыток
        Ошибка: {sync_result.error}
```

---

### While - ждать завершения задачи

```
Блок: API Call (API вызов)
  URL: https://api.example.com/jobs/start
  HTTP Method: POST
  Body: { "task_type": "data_processing" }
  Сохранить результат в переменную: ✓ job

⭐ Блок: Loop (Цикл) ⭐
  Тип цикла: While
  Условие: {job.status} !== "completed" && {job.status} !== "failed"
  Max Iterations: 30

  Внутри цикла:
    Блок: Wait Timeout (Задержка)
      Длительность (секунды): 10
      Описание: Проверяем каждые 10 секунд

    Блок: API Call (API вызов)
      URL: https://api.example.com/jobs/{job.id}/status
      HTTP Method: GET
      Сохранить результат в переменную: ✓ job

    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
      Текст комментария: Статус задачи: {job.status}, прогресс: {job.progress}%

    Блок: If-Else (Условие)
      Условие: {job.status} === "completed" || {job.status} === "failed"

      True:
        Блок: Break (Прервать цикл)
          Описание: Задача завершена

Блок: If-Else (Условие)
  Условие: {job.status} === "completed"

  True:
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Slack
      Получатель: #processing-results
      Сообщение: ✅ Обработка завершена успешно
        ID: {job.id}
        Результат: {job.result_url}

  False:
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Slack
      Получатель: #processing-alerts
      Сообщение: ❌ Обработка провалилась
        ID: {job.id}
        Ошибка: {job.error}
```

---

### Пакетная обработка с паузами

```
Блок: Get Data (Получение данных)
  Переменная: large_dataset
  Источник: api/data/export?all=true
  Сохранить результат в переменную: ✓ tasks

Блок: Transform Data (Преобразование данных)
  Переменная: total_count
  Источник: {tasks}
  Тип преобразования: JavaScript
  Код преобразования: return context.tasks.length;
  Сохранить результат в переменную: ✓ total

⭐ Блок: Loop (Цикл) ⭐
  Тип цикла: For Each
  Итерировать по: {tasks}
  Переменная элемента: task
  Переменная индекса: index
  Max Iterations: 1000

  Внутри цикла:
    Блок: API Call (API вызов)
      URL: https://api.example.com/tasks/{task.id}/update
      HTTP Method: PUT
      Body: {
        "processed": true,
        "processed_at": "{now}"
      }

    Блок: If-Else (Условие)
      Условие: ({index} + 1) % 100 === 0

      True (Каждые 100 элементов):
        Блок: Send Message (Отправка сообщения)
          Канал отправки: Slack
          Получатель: #batch-processing
          Сообщение: 📊 Прогресс: {index + 1} / {total} ({((index + 1) / total * 100).toFixed(1)}%)

        Блок: Wait Timeout (Задержка)
          Длительность (секунды): 5
          Описание: Пауза каждые 100 задач

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: admin@company.com
  Тема письма: Пакетная обработка завершена
  Сообщение: Обработано задач: {total}
```

---

### Loop с условным выходом (Break)

```
Блок: Get Data (Получение данных)
  Переменная: items
  Источник: api/items?pending=true
  Сохранить результат в переменную: ✓ items

Блок: Store Data (Сохранение данных)
  Ключ: processed_count
  Значение: 0
  Сохранить результат в переменную: ✓ counter

⭐ Блок: Loop (Цикл) ⭐
  Тип цикла: For Each
  Итерировать по: {items}
  Переменная элемента: item

  Внутри цикла:
    Блок: AI Request (AI запрос)
      Промпт: Проверь валидность данных: {item}
      Сохранить результат в переменную: ✓ validation

    Блок: If-Else (Условие)
      Условие: {validation.is_valid} === false

      True (Невалидные данные):
        Блок: Send Message (Отправка сообщения)
          Канал отправки: Slack
          Получатель: #data-quality
          Сообщение: ❌ Найдены невалидные данные: {item.id}
            Ошибка: {validation.error}

        Блок: Break (Прервать цикл)
          Описание: Прерываем при первой ошибке

      False (Данные OK):
        Блок: Transform Data (Преобразование данных)
          Переменная: counter
          Источник: {counter} + 1
          Тип преобразования: JavaScript
          Код преобразования: return context.counter + 1;
          Сохранить результат в переменную: ✓ counter

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  Текст комментария: Обработано элементов: {counter}
```

### Найти первое совпадение

```
Loop: For Each {items} as item
  → Condition: Если {item.id} === {searchId}
    → Save: {item} to foundItem
    → Break (нашли, выходим)
```
