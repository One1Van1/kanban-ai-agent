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

### Получить заказы пользователя

```
Get Data: Database
  Query: SELECT * FROM orders WHERE user_id = {user.id}
  Save to: orders
→ Для каждого заказа:
  → Проверить статус оплаты
  → Отправить уведомление если нужно
```

### Курс валют

```
Get Data: API
  URL: https://api.exchangerate.com/latest
  Save to: rates
→ Посчитать сумму в другой валюте
→ Обновить цены
```

### Проверка кэша

```
Get Data: Cache
  Key: user-settings-{user.id}
  Default: null
→ Если в кэше есть - использовать
→ Если нет - загрузить из БД и закэшировать
```

### Получить статистику из Analytics

```
Get Data: API
  URL: https://analytics.com/api/stats
  Headers: {"API-Key": "{env.ANALYTICS_KEY}"}
  Query: {"from": "{startDate}", "to": "{endDate}"}
→ Обработать данные
→ Создать отчёт
```

### Чтение конфигурации

```
Get Data: File Storage
  Path: /config/settings.json
→ Использовать настройки в потоке
```
