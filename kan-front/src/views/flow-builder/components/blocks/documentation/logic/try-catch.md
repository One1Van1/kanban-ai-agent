# Try/Catch

## Что это

Обработка ошибок - попробовать выполнить действие и обработать ошибку если она возникла.

## Зачем нужен

- Обработать ошибки API
- Retry логика (повторить если не получилось)
- Fallback действия
- Не дать потоку упасть из-за ошибки

## Поля

### Max Retries

Сколько раз повторить при ошибке

- `0` - не повторять
- `3` - повторить до 3 раз (всего 4 попытки)

### Retry Delay

Пауза между повторами (секунды)

Можно использовать **Exponential Backoff**:

- 1 попытка - сразу
- 2 попытка - через 2 сек
- 3 попытка - через 4 сек
- 4 попытка - через 8 сек

### Retry On

Какие ошибки повторять

**All Errors** - любые ошибки

**Specific Errors** - только определённые

- HTTP 429 (Too Many Requests)
- HTTP 503 (Service Unavailable)
- Timeout
- Network Error

### Save Error to Variable

Сохранить информацию об ошибке

Доступно в CATCH блоке: `{error.message}`, `{error.code}`

### TRY Block

Блоки которые пробуем выполнить

Если ошибка - переход в CATCH

### CATCH Block (опционально)

Блоки которые выполняются при ошибке

Если не указано - ошибка просто игнорируется

### FINALLY Block (опционально)

Выполняется всегда (и при успехе и при ошибке)

Полезно для очистки ресурсов

## Примеры использования

### Retry API запроса

```
Try/Catch:
  Max Retries: 3
  Retry Delay: 2 сек (exponential)
  Retry On: Network Error, HTTP 429, HTTP 503

TRY:
  → API Call: Отправить данные в CRM

CATCH:
  → Send Message: "Не удалось синхронизировать с CRM"
  → Store Data: Сохранить данные локально для повтора
```

### Обработка ошибок AI

```
Try/Catch:
  Max Retries: 2
  Save Error to: ai_error

TRY:
  → AI Request: Проанализировать текст

CATCH:
  → Condition: Если {ai_error.code} === "rate_limit"
    → Delay: 60 секунд
    → Retry
  → Else:
    → Использовать fallback логику (правила)
```

### Безопасное обновление

```
Try/Catch:
  Max Retries: 0
  Save Error to: error

TRY:
  → Update Task: Изменить статус

CATCH:
  → Send Message: "Ошибка: {error.message}"
  → Create Task: "Исправить ошибку обновления"

FINALLY:
  → Store Data: Залогировать попытку
```

### Fallback на другой API

```
Try/Catch:
  Max Retries: 1

TRY:
  → API Call: Основной AI provider (OpenAI)

CATCH:
  → API Call: Резервный provider (Claude)
```

### Обработка файлов

```
Try/Catch:
  Save Error to: error

TRY:
  → Extract Text: Из PDF файла
  → AI Request: Обработать текст

CATCH:
  → Condition: Если ошибка парсинга PDF
    → Send Message: "Файл повреждён"
  → Else:
    → Send Message: "Неизвестная ошибка: {error.message}"
```

### Транзакционная логика

```
Try/Catch:

TRY:
  → API Call: Списать деньги со счёта
  → Create Task: Создать заказ
  → Send Message: Подтверждение

CATCH:
  → API Call: Откатить списание
  → Send Message: "Ошибка оформления заказа"

FINALLY:
  → Store Data: Залогировать транзакцию
```
