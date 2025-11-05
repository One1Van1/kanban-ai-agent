# Wait Timeout - Пауза на время

## Описание

Приостанавливает выполнение потока на заданное время.

## Категория

**Wait** (Ожидание)

## Конфигурация

### Поля

- **Duration** (`duration`) - Длительность паузы (число)
- **Unit** (`unit`) - Единица измерения времени:
  - `seconds` - Секунды
  - `minutes` - Минуты
  - `hours` - Часы

### Variable Storage

❌ **Не поддерживает сохранение в переменную** (блок управления временем)

## Примеры использования

### Пауза перед повторной попыткой

```
Блок: Event Listener (Слушатель событий)
  Event Type: api.call_failed
  Сохранить результат в переменную: ✓ failed_call

Блок: Loop (Цикл)
  Тип цикла: For N Times
  Количество итераций: 3
  Переменная индекса: attempt

  Внутри цикла:
    Блок: Wait Timeout (Задержка)
      Длительность (секунды): {attempt} * 10
      Описание: Экспоненциальная задержка: 10, 20, 30 сек

    Блок: API Call (API вызов)
      URL: {failed_call.url}
      HTTP Method: {failed_call.method}
      Сохранить результат в переменную: ✓ retry_result

    Блок: If-Else (Условие)
      Условие: {retry_result.status} === 200

      True:
        Блок: Break (Прервать цикл)
          Описание: Успех, выходим из цикла

Блок: If-Else (Условие)
  Условие: {retry_result.status} !== 200

  True:
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Slack
      Получатель: #api-alerts
      Сообщение: ❌ API вызов провалился после 3 попыток
```

---

### Rate limiting для API запросов

```
Блок: Get Data (Получение данных)
  Переменная: users
  Источник: api/users?all=true
  Сохранить результат в переменную: ✓ users

Блок: Loop (Цикл)
  Тип цикла: For Each
  Итерировать по: {users}
  Переменная элемента: user

  Внутри цикла:
    Блок: API Call (API вызов)
      URL: https://api.external.com/enrich
      HTTP Method: POST
      Body: { "user_id": "{user.id}" }

    Блок: Wait Timeout (Задержка)
      Длительность (секунды): 0.5
      Описание: Rate limit: 2 запроса в секунду
```

---

### Отложенное уведомление

```
Блок: Event Listener (Слушатель событий)
  Event Type: task.assigned
  Сохранить результат в переменную: ✓ task_event

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: {task_event.task.assignee.email}
  Тема письма: Новая задача назначена
  Сообщение: {task_event.task.title}

⭐ Блок: Wait Timeout (Задержка) ⭐
  Длительность (секунды): 3600
  Описание: Ждём 1 час

Блок: Get Data (Получение данных)
  Переменная: task_status
  Источник: api/tasks/{task_event.task.id}
  Сохранить результат в переменную: ✓ current_task

Блок: If-Else (Условие)
  Условие: {current_task.status} === "todo"

  True (Задача не начата):
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Slack
      Получатель: {task_event.task.assignee.slack_id}
      Сообщение: ⏰ Напоминание: задача ещё не начата
        {task_event.task.title}
```

---

### Периодическая проверка статуса

```
Блок: API Call (API вызов)
  URL: https://api.example.com/jobs/start
  HTTP Method: POST
  Body: { "type": "data_export" }
  Сохранить результат в переменную: ✓ job

Блок: Loop (Цикл)
  Тип цикла: While
  Условие: {job.status} !== "completed"
  Max Iterations: 30

  Внутри цикла:
    Блок: Wait Timeout (Задержка)
      Длительность (секунды): 10
      Описание: Проверяем каждые 10 секунд

    Блок: API Call (API вызов)
      URL: https://api.example.com/jobs/{job.id}
      HTTP Method: GET
      Сохранить результат в переменную: ✓ job

    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
      Текст комментария: Статус: {job.status}, прогресс: {job.progress}%

Блок: Send Message (Отправка сообщения)
  Канал отправки: Slack
  Получатель: #job-notifications
  Сообщение: ✅ Экспорт завершён: {job.result_url}
```

---

### Задержка между массовыми рассылками

```
Блок: Schedule (Расписание)
  Тип расписания: Cron Expression
  Cron выражение: 0 9 * * 1
  Временная зона: Europe/Moscow
  Описание: Каждый понедельник в 9:00
  Сохранить результат в переменную: ✓ schedule_event

Блок: Get Data (Получение данных)
  Переменная: subscribers
  Источник: api/subscribers?active=true
  Сохранить результат в переменную: ✓ subscribers

Блок: Loop (Цикл)
  Тип цикла: For Each
  Итерировать по: {subscribers}
  Переменная элемента: subscriber

  Внутри цикла:
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Email
      Получатель: {subscriber.email}
      Тема письма: Еженедельная рассылка
      Шаблон: weekly-newsletter
      Данные: { "subscriber": {subscriber} }

    Блок: Wait Timeout (Задержка)
      Длительность (секунды): 2
      Описание: Пауза 2 сек между письмами

Блок: Send Message (Отправка сообщения)
  Канал отправки: Slack
  Получатель: #marketing
  Сообщение: 📧 Рассылка завершена: {subscribers.length} писем
```

---

### Таймаут перед эскалацией

```
Блок: Event Listener (Слушатель событий)
  Event Type: task.overdue
  Сохранить результат в переменную: ✓ overdue_event

Блок: Send Message (Отправка сообщения)
  Канал отправки: Slack
  Получатель: {overdue_event.task.assignee.slack_id}
  Сообщение: ⚠️ Задача просрочена: {overdue_event.task.title}
    Пожалуйста, обновите статус в течение 30 минут

⭐ Блок: Wait Timeout (Задержка) ⭐
  Длительность (секунды): 1800
  Описание: Ждём 30 минут

Блок: Get Data (Получение данных)
  Переменная: task_check
  Источник: api/tasks/{overdue_event.task.id}
  Сохранить результат в переменную: ✓ updated_task

Блок: If-Else (Условие)
  Условие: {updated_task.status} === "done"

  True:
    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
      Текст комментария: Задача выполнена, эскалация не требуется

  False:
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Email
      Получатель: {overdue_event.task.manager.email}
      Тема письма: Эскалация: просроченная задача
      Сообщение: Задача не выполнена после напоминания:
        {overdue_event.task.title}
        Исполнитель: {overdue_event.task.assignee.name}
```

---

### Пакетная обработка с задержками

```
Блок: Get Data (Получение данных)
  Переменная: pending_items
  Источник: api/items?status=pending&limit=1000
  Сохранить результат в переменную: ✓ items

Блок: Loop (Цикл)
  Тип цикла: For Each
  Итерировать по: {items}
  Переменная элемента: item
  Переменная индекса: index

  Внутри цикла:
    Блок: AI Request (AI запрос)
      Промпт: Обработай элемент: {item}
      Сохранить результат в переменную: ✓ processed

    Блок: API Call (API вызов)
      URL: https://api.example.com/items/{item.id}
      HTTP Method: PUT
      Body: { "result": "{processed}" }

    Блок: If-Else (Условие)
      Условие: ({index} + 1) % 50 === 0

      True:
        Блок: Wait Timeout (Задержка)
          Длительность (секунды): 60
          Описание: Пауза 1 мин каждые 50 элементов

        Блок: Send Message (Отправка сообщения)
          Канал отправки: Slack
          Получатель: #batch-processing
          Сообщение: Прогресс: {index + 1}/{items.length}
```
