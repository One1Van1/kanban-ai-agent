# Switch

## Что это

Множественный выбор - выбрать один из нескольких вариантов в зависимости от значения.

## Зачем нужен

- Обработка разных типов событий
- Маршрутизация по статусу
- Разные действия для разных значений
- Альтернатива множественным Condition

## Поля

### Switch Value

Значение для проверки

Обычно переменная: `{task.status}`, `{user.role}`, `{event.type}`

### Cases

Варианты (ветки)

Каждый вариант:

- **Value** - значение для сравнения
- **Blocks** - блоки для выполнения

### Default Case (опционально)

Что выполнить если ни один вариант не подошёл

Как `else` в условии

## Примеры использования

### Обработка статуса задачи

```
Блок: Event Listener (Слушатель событий)
  Event Type: task.status_changed
  Сохранить результат в переменную: ✓ status_event

⭐ Блок: Switch (Переключатель) ⭐
  Переменная для проверки: {status_event.task.status}

  Case "todo":
    Блок: AI Request (AI запрос)
      Промпт: Назначь подходящего исполнителя для задачи:
        {status_event.task.description}
      Сохранить результат в переменную: ✓ assignee

    Блок: Send Message (Отправка сообщения)
      Канал отправки: Slack
      Получатель: {assignee.slack_id}
      Сообщение: 📋 Новая задача: {status_event.task.title}

  Case "in_progress":
    Блок: If-Else (Условие)
      Условие: {status_event.task.dueDate} < {now} + 86400000
      True:
        Блок: Send Message (Отправка сообщения)
          Канал отправки: Email
          Получатель: {status_event.task.assignee.email}
          Тема письма: Задача скоро истекает
          Сообщение: Дедлайн через 24 часа!

  Case "done":
    Блок: Store Data (Сохранение данных)
      Ключ: completed_tasks_count
      Значение: {completed_tasks_count} + 1

    Блок: Send Message (Отправка сообщения)
      Канал отправки: Email
      Получатель: {status_event.task.creator.email}
      Тема письма: Задача выполнена
      Сообщение: ✅ {status_event.task.title}

  Case "blocked":
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Slack
      Получатель: {team_lead.slack_id}
      Сообщение: 🚫 Задача заблокирована: {status_event.task.title}
        Причина: {status_event.task.block_reason}

    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
      Целевая задача: {status_event.task.id}
      Текст комментария: Руководитель уведомлён о блокировке

  Default:
    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
      Текст комментария: Неизвестный статус: {status_event.task.status}
```

---

### Роутинг по типу события

```
Блок: Event Listener (Слушатель событий)
  Event Type: *
  Сохранить результат в переменную: ✓ any_event

⭐ Блок: Switch (Переключатель) ⭐
  Переменная для проверки: {any_event.type}

  Case "task.created":
    Блок: AI Request (AI запрос)
      Промпт: Проанализируй задачу и предложи подзадачи:
        {any_event.task.description}
      Сохранить результат в переменную: ✓ subtasks

    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
      Целевая задача: {any_event.task.id}
      Текст комментария: Предлагаемые подзадачи: {subtasks}

  Case "task.updated":
    Блок: API Call (API вызов)
      URL: https://your-domain.atlassian.net/rest/api/3/issue/{any_event.task.jira_id}
      HTTP Method: PUT
      Body: {
        "fields": {
          "summary": "{any_event.task.title}",
          "description": "{any_event.task.description}"
        }
      }

  Case "task.deleted":
    Блок: Store Data (Сохранение данных)
      Тип хранилища: Database
      Ключ: archived_task_{any_event.task.id}
      Значение: {any_event.task}

    Блок: Send Message (Отправка сообщения)
      Канал отправки: Slack
      Получатель: #task-archive
      Сообщение: 🗄 Задача архивирована: {any_event.task.title}

  Case "task.commented":
    Блок: Extract Text (Извлечение текста)
      Переменная: comment_text
      Источник: {any_event.comment.text}
      Извлечь упоминания: ✓
      Сохранить результат в переменную: ✓ mentions

    Блок: Loop (Цикл)
      Итерировать по: {mentions.users}
      Элемент: mentioned_user

      Блок: Send Message (Отправка сообщения)
        Канал отправки: Email
        Получатель: {mentioned_user.email}
        Тема письма: Вас упомянули в комментарии
        Сообщение: {any_event.comment.text}

  Default:
    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
      Текст комментария: Событие проигнорировано: {any_event.type}
```

---

### Обработка по приоритету

```
Блок: Event Listener (Слушатель событий)
  Event Type: task.created
  Сохранить результат в переменную: ✓ task_event

⭐ Блок: Switch (Переключатель) ⭐
  Переменная для проверки: {task_event.task.priority}

  Case "critical":
    Блок: Send Message (Отправка сообщения)
      Канал отправки: SMS
      Получатель: {senior_manager.phone}
      Сообщение: 🚨 КРИТИЧЕСКАЯ ЗАДАЧА: {task_event.task.title}

    Блок: Send Message (Отправка сообщения)
      Канал отправки: Slack
      Получатель: #critical-tasks
      Сообщение: @channel 🔴 Требуется немедленное внимание!
        {task_event.task.title}

    Блок: AI Request (AI запрос)
      Промпт: Назначь самого старшего доступного специалиста
      Сохранить результат в переменную: ✓ assignee

  Case "high":
    Блок: AI Request (AI запрос)
      Промпт: Назначь опытного специалиста для задачи
      Сохранить результат в переменную: ✓ assignee

    Блок: Send Message (Отправка сообщения)
      Канал отправки: Email
      Получатель: {assignee.email}
      Тема письма: Высокоприоритетная задача
      Сообщение: {task_event.task.title}

  Case "medium":
    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
      Текст комментария: Задача добавлена в стандартную очередь

    Блок: Send Message (Отправка сообщения)
      Канал отправки: Slack
      Получатель: #task-queue
      Сообщение: Новая задача: {task_event.task.title}

  Case "low":
    Блок: Store Data (Сохранение данных)
      Тип хранилища: Database
      Ключ: low_priority_queue
      Значение: {task_event.task.id}

  Default:
    Блок: Transform Data (Преобразование данных)
      Переменная: updated_task
      Источник: {task_event.task}
      Тип преобразования: JavaScript
      Код преобразования:
        const task = context.task_event.task;
        task.priority = "medium";
        return task;
      Сохранить результат в переменную: ✓ fixed_task
```

---

### Обработка платежей

```
Блок: Event Listener (Слушатель событий)
  Event Type: payment.status_updated
  Сохранить результат в переменную: ✓ payment_event

⭐ Блок: Switch (Переключатель) ⭐
  Переменная для проверки: {payment_event.payment.status}

  Case "pending":
    Блок: If-Else (Условие)
      Условие: {payment_event.payment.created_at} < {now} - 259200000

      True (> 3 дней):
        Блок: API Call (API вызов)
          URL: https://api.orders.com/cancel/{payment_event.order_id}
          HTTP Method: POST

        Блок: Send Message (Отправка сообщения)
          Канал отправки: Email
          Получатель: {payment_event.customer.email}
          Тема письма: Заказ отменён
          Сообщение: Платёж не получен в течение 3 дней

      False:
        Блок: Send Message (Отправка сообщения)
          Канал отправки: Email
          Получатель: {payment_event.customer.email}
          Тема письма: Напоминание об оплате
          Сообщение: Пожалуйста, завершите оплату заказа

  Case "processing":
    Блок: Wait Timeout (Задержка)
      Длительность (секунды): 300

    Блок: Get Data (Получение данных)
      Переменная: payment_check
      Источник: api/payments/{payment_event.payment.id}
      Сохранить результат в переменную: ✓ updated_payment

  Case "completed":
    Блок: API Call (API вызов)
      URL: https://api.orders.com/{payment_event.order_id}/status
      HTTP Method: PUT
      Body: { "status": "paid" }

    Блок: Generate File (Генерация файла)
      Тип файла: PDF
      Шаблон: receipt
      Данные: {payment_event.payment}
      Имя файла: receipt-{payment_event.payment.id}.pdf
      Сохранить результат в переменную: ✓ receipt

    Блок: Send Message (Отправка сообщения)
      Канал отправки: Email
      Получатель: {payment_event.customer.email}
      Тема письма: Чек об оплате
      Вложения: [{receipt}]

    Блок: Send Message (Отправка сообщения)
      Канал отправки: Slack
      Получатель: #fulfillment
      Сообщение: ✅ Заказ #{payment_event.order_id} оплачен, начать выполнение

  Case "failed":
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Email
      Получатель: {payment_event.customer.email}
      Тема письма: Ошибка оплаты
      Сообщение: Платёж не прошёл: {payment_event.payment.error_message}
        Попробуйте другой способ оплаты

    Блок: Store Data (Сохранение данных)
      Ключ: failed_payments_log
      Значение: {payment_event.payment}

  Default:
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Slack
      Получатель: #finance-alerts
      Сообщение: ⚠️ Неизвестный статус платежа: {payment_event.payment.status}
```

→ Предложить другой способ оплаты

Case "refunded":
→ Обновить заказ → "refunded"
→ Уведомить склад

Default:
→ Залогировать неизвестный статус

```

### Тип пользователя

```

Switch: {user.type}

Case "admin":
→ Полный доступ
→ Логировать все действия

Case "manager":
→ Доступ к своей команде
→ Права на создание задач

Case "developer":
→ Доступ к задачам
→ Права на обновление

Case "guest":
→ Только просмотр
→ Без изменений

Default:
→ Отказать в доступе

```

```
