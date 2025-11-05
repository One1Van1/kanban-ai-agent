# If/Else - Условное ветвление

## Описание

Выполняет условное ветвление потока на основе проверки переменной или выражения.

## Категория

**Logic** (Логика)

## Конфигурация

### Поля

- **Variable** (`condition.variable`) - Переменная для проверки
- **Operator** (`condition.operator`) - Оператор сравнения:
  - `exists` - Существует (не null/undefined)
  - `equals` - Равно значению
  - `not_equals` - Не равно значению
  - `contains` - Содержит подстроку
  - `greater_than` - Больше чем
  - `less_than` - Меньше чем
  - `is_empty` - Пустая строка/массив
- **Value** (`condition.value`) - Значение для сравнения

### Выходы

- **True** - Условие выполнено
- **False** - Условие не выполнено

## Примеры использования

### Проверка статуса задачи

```
Блок: Event Listener (Слушатель событий)
  Event Type: task.updated
  Сохранить результат в переменную: ✓ task_event

⭐ Блок: If-Else (Условие) ⭐
  Условие: {task_event.task.status} === "completed"

  True (Задача завершена):
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Email
      Получатель: {task_event.task.creator.email}
      Тема письма: Задача завершена: {task_event.task.title}
      Сообщение: ✅ Ваша задача успешно выполнена!

    Блок: Store Data (Сохранение данных)
      Ключ: completed_tasks_count
      Значение: {completed_tasks_count} + 1

  False (Задача не завершена):
    Блок: If-Else (Условие)
      Условие: {task_event.task.dueDate} < {now}

      True (Просрочена):
        Блок: Send Message (Отправка сообщения)
          Канал отправки: Slack
          Получатель: {task_event.task.assignee.slack_id}
          Сообщение: ⚠️ Задача просрочена: {task_event.task.title}

      False:
        ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
          Текст комментария: Задача в работе, дедлайн не нарушен
```

---

### Проверка приоритета

```
Блок: Event Listener (Слушатель событий)
  Event Type: task.created
  Сохранить результат в переменную: ✓ new_task

⭐ Блок: If-Else (Условие) ⭐
  Условие: {new_task.task.priority} === "critical"

  True (Критический приоритет):
    Блок: Send Message (Отправка сообщения)
      Канал отправки: SMS
      Получатель: {manager.phone}
      Сообщение: 🚨 КРИТИЧЕСКАЯ ЗАДАЧА: {new_task.task.title}

    Блок: Send Message (Отправка сообщения)
      Канал отправки: Slack
      Получатель: #urgent-tasks
      Сообщение: 🔴 Новая критическая задача!
        {new_task.task.title}

    Блок: AI Request (AI запрос)
      Промпт: Назначь самого опытного специалиста для задачи:
        {new_task.task.description}
      Сохранить результат в переменную: ✓ assignee

  False (Обычный приоритет):
    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
      Текст комментария: Задача добавлена в очередь
```

---

### Проверка наличия данных

```
Блок: Event Listener (Слушатель событий)
  Event Type: user.login
  Сохранить результат в переменную: ✓ login_event

Блок: Get Data (Получение данных)
  Переменная: user_profile
  Источник: cache:user_{login_event.user.id}
  Сохранить результат в переменную: ✓ cached_profile

⭐ Блок: If-Else (Условие) ⭐
  Условие: {cached_profile} !== null

  True (Профиль в кэше):
    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
      Текст комментария: Профиль загружен из кэша

  False (Нужно загрузить):
    Блок: API Call (API вызов)
      URL: https://api.example.com/users/{login_event.user.id}
      HTTP Method: GET
      Сохранить результат в переменную: ✓ api_profile

    Блок: Store Data (Сохранение данных)
      Тип хранилища: Cache
      Ключ: user_{login_event.user.id}
      Значение: {api_profile.data}
      TTL: 3600
```

---

### Множественные условия (вложенные if-else)

```
Блок: Event Listener (Слушатель событий)
  Event Type: payment.received
  Сохранить результат в переменную: ✓ payment_event

⭐ Блок: If-Else (Условие) ⭐
  Условие: {payment_event.payment.amount} >= 10000

  True (Крупный платёж):
    Блок: If-Else (Условие)
      Условие: {payment_event.payment.method} === "bank_transfer"

      True:
        Блок: Send Message (Отправка сообщения)
          Канал отправки: Email
          Получатель: finance@company.com
          Тема письма: Банковский перевод {payment_event.payment.amount} руб
          Сообщение: Требуется подтверждение

        Блок: Wait Response (Ожидание ответа)
          Вопрос: Подтвердить платёж?
          Целевой пользователь: {finance_manager.id}
          Timeout: 3600
          Сохранить результат в переменную: ✓ confirmation

      False:
        ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
          Текст комментария: Автоматически одобрено (онлайн оплата)

  False (Обычный платёж):
    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
      Текст комментария: Платёж обработан автоматически
```

---

### Проверка с логическими операторами

```
Блок: Event Listener (Слушатель событий)
  Event Type: task.assigned
  Сохранить результат в переменную: ✓ assign_event

⭐ Блок: If-Else (Условие) ⭐
  Условие: {assign_event.task.priority} === "high" && {assign_event.task.assignee.workload} > 80

  True (Высокий приоритет + перегрузка):
    Блок: AI Request (AI запрос)
      Промпт: Найди другого специалиста с меньшей нагрузкой для задачи:
        Приоритет: {assign_event.task.priority}
        Требуемые навыки: {assign_event.task.required_skills}
      Сохранить результат в переменную: ✓ alternative_assignee

    Блок: Send Message (Отправка сообщения)
      Канал отправки: Slack
      Получатель: {team_lead.slack_id}
      Сообщение: ⚠️ Переназначение задачи
        Исполнитель перегружен: {assign_event.task.assignee.name}
        Предлагаемый: {alternative_assignee}

  False:
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Email
      Получатель: {assign_event.task.assignee.email}
      Тема письма: Новая задача: {assign_event.task.title}
      Сообщение: Задача назначена на вас
```

---

### Проверка диапазона значений

```
Блок: Event Listener (Слушатель событий)
  Event Type: temperature.measured
  Сохранить результат в переменную: ✓ temp_event

⭐ Блок: If-Else (Условие) ⭐
  Условие: {temp_event.temperature} < 15 || {temp_event.temperature} > 30

  True (Температура вне нормы):
    Блок: If-Else (Условие)
      Условие: {temp_event.temperature} > 35

      True (Критически высокая):
        Блок: Send Message (Отправка сообщения)
          Канал отправки: SMS
          Получатель: {ops_manager.phone}
          Сообщение: 🚨 КРИТИЧНО! Температура: {temp_event.temperature}°C

        Блок: API Call (API вызов)
          URL: https://api.hvac.com/emergency-cooling
          HTTP Method: POST

      False (Просто вне нормы):
        Блок: Send Message (Отправка сообщения)
          Канал отправки: Email
          Получатель: maintenance@company.com
          Тема письма: Температура вне нормы
          Сообщение: Текущая: {temp_event.temperature}°C

  False (Нормальная температура):
    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
      Текст комментария: Температура в норме: {temp_event.temperature}°C
```
