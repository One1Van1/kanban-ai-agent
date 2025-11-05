# Event Listener (Слушатель событий)

## Что это

**Универсальный триггер** для запуска flow при любом событии в системе: изменения во внешних системах, действия пользователей, системные события или кастомные триггеры из интеграций.

## Зачем нужен

- 🎯 Автоматизация при изменениях во внешних системах (Kanban, CRM, любые данные)
- 👤 Реакция на действия пользователей
- 🔄 Синхронизация с интеграциями
- 📢 Уведомления о важных событиях
- ⚙️ Системный мониторинг и обслуживание

## Поля

### Event Source (Источник события) ⭐

Выбор источника событий - **универсальная система!**

**Варианты:**

#### � **External Events** - Внешние события

События из подключенных внешних систем (Kanban, CRM, любая интеграция)

- Дополнительное поле: **External Type** - тип внешней системы (jira, trello, crm)

#### 👥 **User Events** - События пользователей

Любые действия пользователей в системе

- Дополнительное поле: **User ID** - ID конкретного пользователя для фильтрации

#### 🖥️ **System Events** - Системные события

Внутренние системные процессы Flow Builder, обслуживание, мониторинг

- Дополнительное поле: **System Module** - модуль системы (auth, database, cache)

#### 🔌 **Custom Events** - Пользовательские события

Любые кастомные события из вебхуков или интеграций

- Дополнительное поле: **Custom Filter** - JSON фильтр для точной настройки

---

### Event Type (Тип события)

Какое конкретное событие слушать.

**Примеры для разных источников:**

**External Events (Внешние системы):**

- `card.created` - создана карточка в Kanban
- `order.placed` - создан заказ в CRM
- `ticket.opened` - открыт тикет
- `task.assigned` - назначена задача

**User Events:**

- `user.registered` - новый пользователь
- `user.logged_in` - вход пользователя
- `user.updated_profile` - обновлён профиль
- `user.password_changed` - смена пароля

**System Events:**

- `system.backup_completed` - завершён backup
- `system.cleanup_started` - начата очистка
- `system.error` - системная ошибка
- `system.update_available` - доступно обновление

**Custom Events:**

- `payment.completed` - оплата завершена (Stripe)
- `email.bounced` - email не доставлен (SendGrid)
- `video.encoded` - видео обработано (AWS)
- Любое событие из вашей интеграции!

---

### Dynamic Filters (Динамические фильтры)

В зависимости от выбранного **Event Source** появляются специфичные поля:

#### Для External Events:

- **External Type** - фильтр по типу внешней системы (jira, trello, crm, kanban)

#### Для User Events:

- **User ID** - слушать события только от конкретного пользователя

#### Для System Events:

- **System Module** - фильтр по модулю системы (auth, database, cache)

#### Для Custom Events:

- **Custom Filter** - любой JSON фильтр для точной настройки

---

### Save Result to Variable (Сохранить результат в переменную)

Имя переменной для сохранения данных события.

**Что сохраняется:**

```json
{
  "event_type": "card.created",
  "source": "board",
  "data": {
    // Данные события (структура зависит от типа)
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "user_id": "user-123"
}
```

```json
{
  "priority": "high",
  "assignedTo": "user123"
}
```

### Debounce Time

Задержка перед запуском (миллисекунды)

Если событие происходит много раз подряд - запустить только один раз после паузы

**Пример:**

- Debounce 2000ms
- Задача обновилась 5 раз за 1 секунду
- Поток запустится один раз через 2 секунды после последнего обновления

### Save Event Data to Variable

Имя переменной для данных события

Пример: `event` → доступно как `{event.task}`, `{event.user}`

## Примеры использования

### Новая задача → назначить ответственного

```
⭐ Блок: Event Listener (Слушатель событий) ⭐
  Event Source: board
  Event Type: task.created
  Event Filter: {"assignedTo": null}
  Debounce Time: (оставить пустым)
  Сохранить результат в переменную: ✓ event

Блок: AI Request (AI запрос)
  AI Модель: GPT-4
  Промпт: Определи кто лучше подходит для задачи: "{event.task.title}". Описание: "{event.task.description}". Доступные сотрудники: Иван (backend), Мария (frontend), Петр (дизайн).
  Сохранить результат в переменную: ✓ assigned_user

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  ID карточки: {event.task.id}
  Текст комментария: Задача автоматически назначена на {assigned_user.content}

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: {assigned_user.content}@company.com
  Сообщение: Вам назначена новая задача: {event.task.title}
```

---

### Задача завершена → создать отчёт

```
⭐ Блок: Event Listener (Слушатель событий) ⭐
  Event Source: board
  Event Type: task.status_changed
  Event Filter: {"newStatus": "done"}
  Debounce Time: (оставить пустым)
  Сохранить результат в переменную: ✓ event

Блок: Get Data (Получение данных)
  Переменная: task_stats
  Источник: api/tasks/{event.task.id}/statistics
  Сохранить результат в переменную: ✓ stats

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  ID карточки: {event.task.id}
  Текст комментария: Задача завершена!
    Время выполнения: {stats.duration} часов
    Комментариев: {stats.comments_count}
    Участников: {stats.participants_count}

Блок: IF/ELSE
  Условие: {event.task.is_last_in_project} === true

  Если ИСТИНА:
    Блок: Generate File (Генерация файла)
      Имя файла: project_report.pdf
      Формат: PDF
      Содержимое файла: Итоговый отчёт по проекту {event.task.project_name}
```

---

### Новый пользователь → приветствие

```
⭐ Блок: Event Listener (Слушатель событий) ⭐
  Event Source: board
  Event Type: user.registered
  Event Filter: (оставить пустым - для всех пользователей)
  Debounce Time: (оставить пустым)
  Сохранить результат в переменную: ✓ event

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: {event.user.email}
  Сообщение: Добро пожаловать, {event.user.name}! Спасибо за регистрацию.

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  ID карточки: onboarding_board
  Текст комментария: Создать задачи онбординга для {event.user.name}

Блок: API Call (API вызов)
  Адрес сервиса: https://slack.company.com/api/invite
  Тип запроса: POST
  Данные для отправки:
    {
      "email": {event.user.email},
      "channel": "general"
    }
```

---

### Обновление задачи → синхронизация с Jira

```
⭐ Блок: Event Listener (Слушатель событий) ⭐
  Event Source: board
  Event Type: task.updated
  Event Filter: {"sync_with_jira": true}
  Debounce Time: 5000
  Сохранить результат в переменную: ✓ event

Блок: API Call (API вызов)
  Адрес сервиса: https://jira.company.com/rest/api/2/issue/{event.task.jira_key}
  Тип запроса: PUT
  Настройки подключения: {"Authorization": "Bearer {JIRA_TOKEN}"}
  Данные для отправки:
    {
      "fields": {
        "summary": {event.task.title},
        "description": {event.task.description},
        "status": {event.task.status}
      }
    }
  Сохранить результат в переменную: ✓ jira_response

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  ID карточки: {event.task.id}
  Текст комментария: Синхронизировано с Jira: {jira_response.key}
```

---

### Комментарий с упоминанием → уведомление

```
⭐ Блок: Event Listener (Слушатель событий) ⭐
  Event Source: board
  Event Type: task.commented
  Event Filter: {"mentions": "{current_user.id}"}
  Debounce Time: 1000
  Сохранить результат в переменную: ✓ event

Блок: Send Message (Отправка сообщения)
  Канал отправки: Push Notification
  Получатель: {current_user.id}
  Сообщение: {event.comment.author.name} упомянул вас в задаче "{event.task.title}": {event.comment.text}

Блок: IF/ELSE
  Условие: {current_user.is_online} === false

  Если ИСТИНА:
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Email
      Получатель: {current_user.email}
      Сообщение: Вы были упомянуты в задаче (вы оффлайн)
```

---

## 🆕 Примеры для других источников событий

### 👥 USER EVENTS - Новый пользователь зарегистрировался

```
⭐ Блок: Event Listener (Слушатель событий) ⭐
  Event Source: user
  Event Type: user.registered
  User ID: (оставить пустым - слушаем всех)
  Сохранить результат в переменную: ✓ event

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: {event.user.email}
  Тема: Добро пожаловать!
  Сообщение: Привет, {event.user.name}! Спасибо за регистрацию.

Блок: Send Message (Отправка сообщения)
  Канал отправки: Slack
  Получатель: #team-notifications
  Сообщение: 🎉 Новый пользователь: {event.user.name} ({event.user.email})
```

---

### 👥 USER EVENTS - Отслеживание конкретного пользователя

```
⭐ Блок: Event Listener (Слушатель событий) ⭐
  Event Source: user
  Event Type: user.logged_in
  User ID: admin@company.com  ← Слушаем только админа!
  Сохранить результат в переменную: ✓ event

Блок: Store Data (Сохранение данных)
  Ключ: last_admin_login
  Значение: {event.timestamp}

Блок: If-Else (Условие)
  Условие: {event.ip_address} NOT IN ["офисные IP"]

  Если ИСТИНА (подозрительный вход):
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Telegram
      Получатель: security_team
      Сообщение: ⚠️ Вход админа с неизвестного IP: {event.ip_address}
```

---

### 🖥️ SYSTEM EVENTS - Мониторинг базы данных

```
⭐ Блок: Event Listener (Слушатель событий) ⭐
  Event Source: system
  Event Type: system.error
  System Module: database  ← Только ошибки БД!
  Сохранить результат в переменную: ✓ event

Блок: If-Else (Условие)
  Условие: {event.error.severity} === "critical"

  Если ИСТИНА:
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Slack
      Получатель: #devops-alerts
      Сообщение: 🚨 CRITICAL DB ERROR: {event.error.message}

    Блок: API Call (API вызов)
      Адрес: https://api.pagerduty.com/incidents
      Тип запроса: POST
      Данные: Create incident для дежурного
```

---

### 🖥️ SYSTEM EVENTS - Автоматический backup

```
⭐ Блок: Event Listener (Слушатель событий) ⭐
  Event Source: system
  Event Type: system.backup_completed
  System Module: database
  Сохранить результат в переменную: ✓ event

Блок: If-Else (Условие)
  Условие: {event.backup.size_mb} > 1000

  Если ИСТИНА (большой backup):
    Блок: API Call (API вызов)
      Адрес: https://storage.googleapis.com/upload
      Тип запроса: POST
      Данные: Upload to cloud storage

  Если ЛОЖЬ (небольшой):
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Email
      Получатель: admin@company.com
      Сообщение: ✅ Backup завершён: {event.backup.size_mb}MB
```

---

### 🔌 CUSTOM EVENTS - Stripe платежи

```
⭐ Блок: Event Listener (Слушатель событий) ⭐
  Event Source: custom
  Event Type: payment.completed
  Custom Filter: {"amount_gte": 10000}  ← Только платежи > 10k руб
  Сохранить результат в переменную: ✓ event

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: create_card
  Данные карточки:
    title: "Новый платёж: {event.payment.amount} руб"
    description: |
      Клиент: {event.customer.name}
      Email: {event.customer.email}
      Сумма: {event.payment.amount} руб
      ID платежа: {event.payment.id}
    column: "Новые заказы"

Блок: Send Message (Отправка сообщения)
  Канал отправки: Telegram
  Получатель: sales_team
  Сообщение: 💰 Крупный платёж: {event.payment.amount} руб от {event.customer.name}
```

---

### 🔌 CUSTOM EVENTS - AWS видео обработано

```
⭐ Блок: Event Listener (Слушатель событий) ⭐
  Event Source: custom
  Event Type: video.encoded
  Custom Filter: {"quality": "1080p"}
  Сохранить результат в переменную: ✓ event

Блок: API Call (API вызов)
  Адрес: https://api.cdn.com/videos
  Тип запроса: POST
  Данные:
    {
      "video_url": {event.video.output_url},
      "duration": {event.video.duration_seconds},
      "thumbnail": {event.video.thumbnail_url}
    }

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: update
  ID карточки: {event.video.card_id}
  Данные для обновления:
    status: "Ready"
    video_url: {event.video.output_url}
  Операция: add_comment

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: {event.video.uploader_email}
  Сообщение: ✅ Ваше видео обработано и готово к просмотру!
```

---

## 🎯 Итого

**Event Listener** - это **универсальный триггер** который может:

✅ Слушать события досок (если используется как Kanban)  
✅ Реагировать на действия пользователей  
✅ Мониторить системные процессы  
✅ Принимать кастомные события из любых внешних источников

**Каждый источник** имеет свои специфичные фильтры для точной настройки! 🚀

```

```
