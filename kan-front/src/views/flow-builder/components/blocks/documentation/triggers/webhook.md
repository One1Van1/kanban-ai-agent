# Webhook

## Что это

Входящий HTTP запрос, который запускает поток. Другие системы могут отправить данные на ваш webhook URL.

## Зачем нужен

- Получать уведомления от внешних сервисов (GitHub, Stripe, Jira)
- Интеграция с другими приложениями
- Получать данные от форм на сайте
- API для других систем

## Поля

### HTTP Метод

Какой тип операции будет выполняться

- **Получение данных (POST)** - когда внешняя система отправляет вам данные (рекомендуется)
- **Запрос информации (GET)** - когда внешняя система запрашивает данные у вас
- **Полное обновление (PUT)** - когда нужно полностью заменить данные
- **Частичное обновление (PATCH)** - когда нужно изменить только часть данных
- **Удаление данных (DELETE)** - когда нужно удалить данные

### Webhook URL

**⚠️ Пока не реализовано** - будет автоматически генерироваться

Уникальный URL для этого потока. Пример: `https://api.app.com/webhooks/abc123`

### Webhook Secret

Секретный ключ для проверки подлинности запроса

**Как работает:**

1. Вы даёте секрет отправителю
2. Отправитель подписывает запрос этим секретом (HMAC SHA256)
3. Вы проверяете подпись

**Рекомендуется** для безопасности

Какие заголовки сохранить в переменные

Пример: `Authorization`, `X-GitHub-Event`

### Save Result to Variable

Имя переменной для сохранения данных запроса

Пример: `webhook_data` → доступно как `{webhook_data.body}`, `{webhook_data.headers}`

## Примеры использования

### GitHub - уведомление о push

```
⭐ Блок: Webhook (Вебхук) ⭐
  HTTP Метод: Получение данных (POST)
  Webhook URL: https://api.app.com/webhooks/github-123
  Webhook Secret: github_secret_key_2024
  Сохранить результат в переменную: ✓ webhook_data

Блок: Extract Text (Извлечение текста)
  Переменная: webhook_data
  Источник: {webhook_data.body.commits[0].message}
  Сохранить результат в переменную: ✓ commit_message

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  ID карточки: {webhook_data.body.repository.id}
  Текст комментария: Новый коммит от {webhook_data.body.pusher.name}: {commit_message}
```

---

### Stripe - оплата прошла

```
⭐ Блок: Webhook (Вебхук) ⭐
  HTTP Метод: Получение данных (POST)
  Webhook URL: https://api.app.com/webhooks/stripe-456
  Webhook Secret: whsec_stripe_secret_123
  Сохранить результат в переменную: ✓ payment_data

Блок: IF/ELSE
  Условие: {payment_data.body.type} === "payment_intent.succeeded"

  Если ИСТИНА:
    Блок: Get Data (Получение данных)
      Переменная: order_data
      Источник: api/orders/{payment_data.body.data.object.metadata.order_id}
      Сохранить результат в переменную: ✓ order

    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
      Операция: add_comment
      ID карточки: {order.card_id}
      Текст комментария: Оплата получена! Сумма: {payment_data.body.data.object.amount} руб.
```

---

### Форма на сайте

```
⭐ Блок: Webhook (Вебхук) ⭐
  HTTP Метод: Получение данных (POST)
  Webhook URL: https://api.app.com/webhooks/contact-form
  Сохранить результат в переменную: ✓ form_data

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  ID карточки: contact_requests
  Текст комментария: Новая заявка:
    Имя: {form_data.body.name}
    Email: {form_data.body.email}
    Сообщение: {form_data.body.message}

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: manager@company.com
  Сообщение: Новая заявка с сайта от {form_data.body.name}
```

---

### Jira - новая задача

```
⭐ Блок: Webhook (Вебхук) ⭐
  HTTP Метод: Получение данных (POST)
  Webhook URL: https://api.app.com/webhooks/jira-789
  Webhook Secret: jira_webhook_secret
  Сохранить результат в переменную: ✓ jira_event

Блок: IF/ELSE
  Условие: {jira_event.body.webhookEvent} === "jira:issue_created"

  Если ИСТИНА:
    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
      Операция: add_comment
      ID карточки: jira_sync_board
      Текст комментария: Создана задача в Jira:
        Ключ: {jira_event.body.issue.key}
        Название: {jira_event.body.issue.fields.summary}
        Автор: {jira_event.body.issue.fields.reporter.displayName}
```

---

### Telegram бот

```
⭐ Блок: Webhook (Вебхук) ⭐
  HTTP Метод: Получение данных (POST)
  Webhook URL: https://api.app.com/webhooks/telegram-bot
  Webhook Secret: telegram_bot_secret_token
  Сохранить результат в переменную: ✓ telegram_update

Блок: AI Request (AI запрос)
  AI Модель: GPT-4
  Промпт: Пользователь написал: "{telegram_update.body.message.text}". Сформулируй вежливый ответ.
  Сохранить результат в переменную: ✓ ai_response

Блок: API Call (API вызов)
  Адрес сервиса: https://api.telegram.org/bot{BOT_TOKEN}/sendMessage
  Тип запроса: POST
  Данные для отправки:
    {
      "chat_id": {telegram_update.body.message.chat.id},
      "text": {ai_response.content}
    }
```
