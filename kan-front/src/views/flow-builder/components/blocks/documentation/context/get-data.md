# Get Data

## Что это

Получить данные из базы данных, API или кэша.

## Зачем нужен

- Читать данные из БД
- Получать данные из внешних API
- Работа с кэшем
- Универсальный источник данных

## Поля

### Source Type

Откуда брать данные

**Database** - из базы данных
**API** - из внешнего API
**Cache** - из кэша (Redis)
**File Storage** - из файлового хранилища

### Database Settings (для Database)

**Connection** - какое подключение использовать

- Выбрать из настроенных подключений

**Query** - SQL запрос или запрос к БД

```sql
SELECT * FROM orders WHERE user_id = {user.id}
```

### API Settings (для API)

**URL** - адрес API

- Можно переменные: `https://api.com/users/{userId}`

**Method** - HTTP метод (GET обычно)

**Headers** - заголовки

```json
{
  "Authorization": "Bearer {token}"
}
```

**Query Parameters** - параметры запроса

```json
{
  "page": 1,
  "limit": 10
}
```

### Cache Settings (для Cache)

**Key** - ключ в кэше

- Пример: `user-data-{user.id}`

**Default Value** - что вернуть если нет в кэше

### Parse Response

Как парсить ответ

**JSON** - JSON данные (по умолчанию)
**XML** - XML данные
**CSV** - CSV файл
**Plain Text** - обычный текст

### Save Result to Variable

Имя переменной

Пример: `data` → `{data.items}`, `{data.total}`

## Примеры использования

### Получить заказы пользователя из БД

```
Блок: Event Listener (Слушатель событий)
  Event Type: user.login
  Сохранить результат в переменную: ✓ login_event

⭐ Блок: Get Data (Получение данных) ⭐
  Переменная: user_orders
  Источник: Database
  Подключение: main_db
  Запрос: SELECT * FROM orders WHERE user_id = {login_event.user.id} AND status IN ('pending', 'processing')
  Формат ответа: JSON
  Сохранить результат в переменную: ✓ orders

Блок: Loop (Цикл)
  Коллекция/Массив: {orders}
  Переменная элемента: order

  Блок: IF/ELSE
    Условие: new Date({order.payment_deadline}) < new Date()

    Если ИСТИНА:
      Блок: Send Message (Отправка сообщения)
        Канал отправки: Email
        Получатель: {login_event.user.email}
        Сообщение: Напоминание: заказ #{order.id} ожидает оплаты
```

---

### Актуальные курсы валют

```
Блок: Schedule (Расписание)
  Тип расписания: Interval
  Интервал: 1
  Единица времени: hours
  Сохранить результат в переменную: ✓ schedule_event

⭐ Блок: Get Data (Получение данных) ⭐
  Переменная: exchange_rates
  Источник: API
  URL: https://api.exchangerate-api.com/v4/latest/USD
  Метод: GET
  Формат ответа: JSON
  Сохранить результат в переменную: ✓ rates

⭐ Блок: Get Data (Получение данных) ⭐
  Переменная: products_data
  Источник: Database
  Запрос: SELECT * FROM products WHERE currency = 'USD'
  Сохранить результат в переменную: ✓ products

Блок: Loop (Цикл)
  Коллекция/Массив: {products}
  Переменная элемента: product

  Блок: API Call (API вызов)
    Адрес сервиса: api/products/{product.id}
    Тип запроса: PATCH
    Данные для отправки:
      {
        "price_rub": {product.price_usd} * {rates.rates.RUB},
        "price_eur": {product.price_usd} * {rates.rates.EUR}
      }

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  ID карточки: currency_updates
  Текст комментария: ✅ Цены обновлены:
    Курс USD/RUB: {rates.rates.RUB}
    Обновлено товаров: {products.length}
```

---

### Проверка кэша перед запросом в БД

```
Блок: Webhook (Вебхук)
  HTTP Метод: Получение данных (POST)
  Сохранить результат в переменную: ✓ request_data

⭐ Блок: Get Data (Получение данных) ⭐
  Переменная: cached_settings
  Источник: Cache (Redis)
  Ключ: user-settings-{request_data.body.user_id}
  Значение по умолчанию: null
  Сохранить результат в переменную: ✓ cache_result

Блок: IF/ELSE
  Условие: {cache_result} === null

  Если ИСТИНА (нет в кэше):
    Блок: Get Data (Получение данных)
      Переменная: db_settings
      Источник: Database
      Запрос: SELECT * FROM user_settings WHERE user_id = {request_data.body.user_id}
      Сохранить результат в переменную: ✓ settings

    Блок: Store Data (Сохранение данных)
      Ключ хранилища: user-settings-{request_data.body.user_id}
      Значение: {settings}
      TTL: 3600

  Если ЛОЖЬ (есть в кэше):
    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
      ID карточки: cache_hits
      Текст комментария: ✅ Cache hit для user {request_data.body.user_id}

Блок: API Call (API вызов)
  Адрес сервиса: {request_data.body.callback_url}
  Тип запроса: POST
  Данные для отправки: {cache_result || settings}
```

---

### Получить аналитику из внешнего сервиса

```
Блок: Manual Trigger (Ручной запуск)
  Trigger Name: Загрузить аналитику
  Input Parameters:
    [
      {
        "name": "startDate",
        "type": "date",
        "required": true
      },
      {
        "name": "endDate",
        "type": "date",
        "required": true
      }
    ]
  Сохранить результат в переменную: ✓ params

⭐ Блок: Get Data (Получение данных) ⭐
  Переменная: analytics_data
  Источник: API
  URL: https://analytics.company.com/api/v2/stats
  Метод: GET
  Заголовки:
    {
      "Authorization": "Bearer {env.ANALYTICS_API_KEY}",
      "Content-Type": "application/json"
    }
  Query Parameters:
    {
      "from": {params.startDate},
      "to": {params.endDate},
      "metrics": "users,sessions,pageviews,revenue"
    }
  Формат ответа: JSON
  Сохранить результат в переменную: ✓ stats

Блок: Transform Data (Преобразование данных)
  Переменная: stats
  Источник: {stats.data}
  Тип преобразования: JavaScript Expression
  Код преобразования:
    {
      period: `${params.startDate} - ${params.endDate}`,
      users: data.users.total,
      sessions: data.sessions.total,
      pageviews: data.pageviews.total,
      revenue: data.revenue.total,
      avgSessionDuration: (data.sessions.total_duration / data.sessions.total / 60).toFixed(1) + ' мин',
      conversionRate: ((data.orders.count / data.users.total) * 100).toFixed(2) + '%'
    }
  Сохранить результат в переменную: ✓ formatted_stats

Блок: Generate File (Генерация файла)
  Имя файла: analytics_{params.startDate}_{params.endDate}.json
  Формат: JSON
  Содержимое файла: {formatted_stats}

Блок: Send Message (Отправка сообщения)
  Канал отправки: Slack
  Получатель: #analytics
  Сообщение: 📊 Отчёт по аналитике:
    Период: {formatted_stats.period}
    Пользователей: {formatted_stats.users}
    Сессий: {formatted_stats.sessions}
    Выручка: {formatted_stats.revenue} руб
    Конверсия: {formatted_stats.conversionRate}
```

---

### Чтение конфигурации из хранилища

```
Блок: Schedule (Расписание)
  Тип расписания: Interval
  Интервал: 10
  Единица времени: minutes
  Сохранить результат в переменную: ✓ schedule_event

⭐ Блок: Get Data (Получение данных) ⭐
  Переменная: config_file
  Источник: File Storage
  Путь: /config/flow_settings.json
  Формат ответа: JSON
  Сохранить результат в переменную: ✓ config

Блок: Loop (Цикл)
  Коллекция/Массив: {config.flows}
  Переменная элемента: flow_config

  Блок: IF/ELSE
    Условие: {flow_config.enabled} === true

    Если ИСТИНА:
      Блок: API Call (API вызов)
        Адрес сервиса: api/flows/{flow_config.id}/execute
        Тип запроса: POST
        Данные для отправки: {flow_config.params}

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  ID карточки: config_sync
  Текст комментария: Конфигурация синхронизирована:
    Всего потоков: {config.flows.length}
    Активных: {config.flows.filter(f => f.enabled).length}
```
