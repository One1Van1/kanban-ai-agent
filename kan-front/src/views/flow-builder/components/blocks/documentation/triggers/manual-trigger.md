# Manual Trigger

## Что это

Ручной запуск потока пользователем (кнопка в интерфейсе).

## Зачем нужен

- Действия по требованию
- Тестирование потоков
- Разовые операции
- Кнопки для пользователей

## Поля

### Allowed Users (Разрешённые пользователи)

Список пользователей которые могут запускать поток (через запятую).

**Формат:** Строка с именами пользователей или email через запятую.

**Примеры:**

- `admin@company.com, manager@company.com` - только эти пользователи
- `admin, john, sarah` - по именам пользователей
- Оставить пустым - **все пользователи** могут запускать

### Require Confirmation (Требовать подтверждение)

Показывать диалог подтверждения перед запуском потока?

- ✅ **Включено** - показать подтверждение (для важных операций)
- ❌ **Выключено** - запускать сразу при нажатии

**Когда включать:**

- Удаление данных
- Массовые изменения
- Отправка сообщений многим пользователям
- Операции с внешними системами

## Примеры использования

### Создать еженедельный отчёт

```
⭐ Блок: Manual Trigger (Ручной запуск) ⭐
  Allowed Users: admin@company.com, manager@company.com
  Require Confirmation: нет

Блок: Get Data (Получение данных)
  Переменная: report_data
  Источник: api/statistics
  Сохранить результат в переменную: ✓ stats

Блок: Generate File (Генерация файла)
  Имя файла: weekly_report.pdf
  Формат: PDF
  Содержимое файла: Еженедельный отчёт: {stats}

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: reports@company.com
  Сообщение: Еженедельный отчёт готов
```

---

### Синхронизация с Jira

```
⭐ Блок: Manual Trigger (Ручной запуск) ⭐
  Allowed Users: admin@company.com
  Require Confirmation: ✓

Блок: API Call (API вызов)
  URL: https://jira.company.com/rest/api/2/search?jql=project=PROJ
  HTTP Method: GET
  Headers: {"Authorization": "Bearer {JIRA_TOKEN}"}
  Сохранить результат в переменную: ✓ jira_issues

Блок: Loop (Цикл)
  Коллекция/Массив: {jira_issues.issues}
  Переменная элемента: issue
  Максимум итераций: 500

  ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
    ID карточки: jira_sync_board
    Текст комментария: Импортирована задача {issue.key}: {issue.fields.summary}

Блок: Send Message (Отправка сообщения)
  Канал отправки: Slack
  Получатель: #sync-notifications
  Сообщение: ✅ Синхронизация Jira завершена. Импортировано: {jira_issues.total} задач
```

---

### Массовое обновление приоритетов

```
⭐ Блок: Manual Trigger (Ручной запуск) ⭐
  Allowed Users: admin, project-manager
  Require Confirmation: ✓

Блок: Get Data (Получение данных)
  Переменная: tasks_to_update
  Источник: api/tasks?status=open
  Сохранить результат в переменную: ✓ tasks

Блок: Loop (Цикл)
  Коллекция/Массив: {tasks}
  Переменная элемента: task
  Максимум итераций: 100

  Блок: API Call (API вызов)
    URL: api/tasks/{task.id}
    HTTP Method: PATCH
    Body: {"priority": "high"}
    Сохранить результат в переменную: ✓ updated

  Блок: Send Message (Отправка сообщения)
    Канал отправки: Email
    Получатель: {task.assignee.email}
    Сообщение: Приоритет задачи "{task.title}" изменён на HIGH

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  ID карточки: admin_log
  Текст комментария: Обновлено {tasks.length} задач. Новый приоритет: HIGH
```

---

### Отправить рассылку

```
⭐ Блок: Manual Trigger (Ручной запуск) ⭐
  Allowed Users: admin@company.com
  Require Confirmation: ✓

Блок: Get Data (Получение данных)
  Переменная: users_list
  Источник: api/users?status=active
  Сохранить результат в переменную: ✓ recipients

Блок: Loop (Цикл)
  Коллекция/Массив: {recipients}
  Переменная элемента: user
  Максимум итераций: 1000

  Блок: Send Message (Отправка сообщения)
    Канал отправки: Email
    Получатель: {user.email}
    Сообщение: Важное уведомление для всех пользователей

Блок: Send Message (Отправка сообщения)
  Канал отправки: Slack
  Получатель: #admin
  Сообщение: 📧 Рассылка завершена. Отправлено: {recipients.length} сообщений
```

---

### Экспорт данных

```
⭐ Блок: Manual Trigger (Ручной запуск) ⭐
  Allowed Users: admin, analyst
  Require Confirmation: нет

Блок: Get Data (Получение данных)
  Переменная: data_to_export
  Источник: api/tasks/export
  Сохранить результат в переменную: ✓ data

Блок: Generate File (Генерация файла)
  Имя файла: export_tasks.csv
  Формат: CSV
  Содержимое файла: {data}

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: {current_user.email}
  Сообщение: Ваш экспорт готов
```
