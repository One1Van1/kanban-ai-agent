# Schedule

## Что это

Запуск потока по расписанию (каждый час, каждый день, по cron).

## Зачем нужен

- Автоматические отчёты каждый день
- Регулярная синхронизация данных
- Напоминания в определённое время
- Очистка старых данных раз в неделю

## Поля

### Schedule Type

Тип расписания

**Interval** - Повторять каждые N минут/часов/дней

- Простой, для регулярных задач
- Пример: каждые 30 минут

**Cron Expression** - Точное время (cron формат)

- Для сложных расписаний
- Пример: `0 9 * * 1-5` = каждый будний день в 9:00

**Specific DateTime** - Один раз в конкретное время

- Для разовых задач
- Пример: 31 декабря 2025 в 23:59

### Interval (для Interval)

- **Value:** Число (например, 30)
- **Unit:** `minutes`, `hours`, `days`

### Cron Expression (для Cron)

Формат: `минута час день месяц день_недели`

**Примеры:**

- `0 9 * * *` - каждый день в 9:00
- `0 */2 * * *` - каждые 2 часа
- `0 9 * * 1-5` - будни в 9:00
- `0 0 1 * *` - 1 числа каждого месяца в 00:00

### Timezone

Часовой пояс

Пример: `Europe/Moscow`, `UTC`, `America/New_York`

### Active

Включено ли расписание

Можно временно отключить без удаления

## Примеры использования

### Ежедневный отчёт в 9:00

```
⭐ Блок: Schedule (Расписание) ⭐
  Тип расписания: Cron Expression
  Cron выражение: 0 9 * * *
  Временная зона: Europe/Moscow
  Active: ✓
  Сохранить результат в переменную: ✓ schedule_event

Блок: Get Data (Получение данных)
  Переменная: yesterday_data
  Источник: api/statistics?date=yesterday
  Сохранить результат в переменную: ✓ stats

Блок: Generate File (Генерация файла)
  Имя файла: daily_report_{stats.date}.pdf
  Формат: PDF
  Содержимое файла: Отчёт за {stats.date}:
    Задачи выполнено: {stats.completed}
    Новых задач: {stats.created}

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: managers@company.com
  Сообщение: Ежедневный отчёт за {stats.date}
  Вложение: daily_report_{stats.date}.pdf
```

---

### Синхронизация каждые 30 минут

```
⭐ Блок: Schedule (Расписание) ⭐
  Тип расписания: Interval
  Интервал: 30
  Единица времени: minutes
  Временная зона: UTC
  Active: ✓
  Сохранить результат в переменную: ✓ sync_event

Блок: API Call (API вызов)
  Адрес сервиса: https://jira.company.com/rest/api/2/search?jql=updated>=-30m
  Тип запроса: GET
  Настройки подключения: {"Authorization": "Bearer {JIRA_TOKEN}"}
  Сохранить результат в переменную: ✓ jira_tasks

Блок: Loop (Цикл)
  Коллекция/Массив: {jira_tasks.issues}
  Переменная элемента: issue
  Максимум итераций: 100

  ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
    ID карточки: sync_board
    Текст комментария: Синхронизирована задача {issue.key}: {issue.fields.summary}
```

---

### Еженедельный бэкап (Воскресенье в 2:00)

```
⭐ Блок: Schedule (Расписание) ⭐
  Тип расписания: Cron Expression
  Cron выражение: 0 2 * * 0
  Временная зона: Europe/Moscow
  Active: ✓
  Сохранить результат в переменную: ✓ backup_event

Блок: Get Data (Получение данных)
  Переменная: all_data
  Источник: api/export/full
  Сохранить результат в переменную: ✓ export_data

Блок: Generate File (Генерация файла)
  Имя файла: backup_{backup_event.timestamp}.json
  Формат: JSON
  Содержимое файла: {export_data}

Блок: API Call (API вызов)
  Адрес сервиса: https://s3.amazonaws.com/backups/backup_{backup_event.timestamp}.json
  Тип запроса: PUT
  Настройки подключения: {"Authorization": "AWS {AWS_KEY}"}
  Данные для отправки: {export_data}

Блок: Send Message (Отправка сообщения)
  Канал отправки: Slack
  Получатель: #devops
  Сообщение: ✅ Недельный бэкап выполнен: backup_{backup_event.timestamp}.json
```

---

### Напоминания о просроченных задачах каждый час

```
⭐ Блок: Schedule (Расписание) ⭐
  Тип расписания: Interval
  Интервал: 1
  Единица времени: hours
  Временная зона: Europe/Moscow
  Active: ✓
  Сохранить результат в переменную: ✓ reminder_event

Блок: Get Data (Получение данных)
  Переменная: overdue_data
  Источник: api/tasks?status=overdue
  Сохранить результат в переменную: ✓ overdue_tasks

Блок: Transform Data (Преобразование данных)
  Переменная: overdue_tasks
  Источник: {overdue_tasks}
  Тип преобразования: Group By
  Группировать по полю: assignee.email
  Сохранить результат в переменную: ✓ grouped_by_assignee

Блок: Loop (Цикл)
  Коллекция/Массив: Object.entries({grouped_by_assignee})
  Переменная элемента: assignee_group

  Блок: Send Message (Отправка сообщения)
    Канал отправки: Email
    Получатель: {assignee_group[0]}
    Сообщение: У вас {assignee_group[1].length} просроченных задач:
      {assignee_group[1].map(t => t.title).join(', ')}
```

---

### Очистка старых данных раз в месяц (1 числа в 3:00)

```
⭐ Блок: Schedule (Расписание) ⭐
  Тип расписания: Cron Expression
  Cron выражение: 0 3 1 * *
  Временная зона: UTC
  Active: ✓
  Сохранить результат в переменную: ✓ cleanup_event

Блок: API Call (API вызов)
  Адрес сервиса: api/tasks/cleanup?older_than=6months
  Тип запроса: DELETE
  Сохранить результат в переменную: ✓ deleted_tasks

Блок: API Call (API вызов)
  Адрес сервиса: api/cache/clear
  Тип запроса: POST

Блок: API Call (API вызов)
  Адрес сервиса: api/database/optimize
  Тип запроса: POST
  Сохранить результат в переменную: ✓ optimize_result

Блок: Send Message (Отправка сообщения)
  Канал отправки: Slack
  Получатель: #admin
  Сообщение: 🧹 Месячная очистка завершена:
    Удалено задач: {deleted_tasks.count}
    Оптимизация БД: {optimize_result.status}
```

---

### Утренняя сводка для команды (будни в 9:00)

```
⭐ Блок: Schedule (Расписание) ⭐
  Тип расписания: Cron Expression
  Cron выражение: 0 9 * * 1-5
  Временная зона: Europe/Moscow
  Active: ✓
  Сохранить результат в переменную: ✓ morning_event

Блок: Get Data (Получение данных)
  Переменная: today_tasks
  Источник: api/tasks?due_date=today
  Сохранить результат в переменную: ✓ tasks_today

Блок: AI Request (AI запрос)
  AI Модель: GPT-4
  System Prompt: Ты помощник команды. Создавай краткие мотивирующие сводки.
  Промпт: Создай утреннюю сводку для команды:

    Задач на сегодня: {tasks_today.length}
    Список задач: {tasks_today}

    Сводка должна быть мотивирующей и структурированной.
  Сохранить результат в переменную: ✓ morning_summary

Блок: Send Message (Отправка сообщения)
  Канал отправки: Slack
  Получатель: #general
  Сообщение: ☀️ Доброе утро, команда!

    {morning_summary.content}
```
