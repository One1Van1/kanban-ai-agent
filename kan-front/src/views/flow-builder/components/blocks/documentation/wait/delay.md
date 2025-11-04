# Delay

## Что это

Пауза в выполнении потока на определённое время.

## Зачем нужен

- Пауза между API запросами (избежать rate limit)
- Дать время внешней системе обработать данные
- Polling с интервалами
- Распределить нагрузку во времени

## Поля

### Delay Type

Тип задержки

**Fixed** - фиксированная пауза
**Until DateTime** - до определённого времени
**Random** - случайная пауза (распределить нагрузку)
**Dynamic** - вычисляемая пауза

### Duration (для Fixed/Random)

Длительность паузы

**Value** - число
**Unit** - `seconds`, `minutes`, `hours`

**Примеры:**

- 5 seconds
- 2 minutes
- 1 hour

### Target DateTime (для Until)

До какого времени ждать

Формат ISO: `2025-12-31T23:59:59Z`

Или относительно: `{tomorrow at 09:00}`

### Min / Max Duration (для Random)

Диапазон случайной паузы

**Пример:**

- Min: 1 second
- Max: 5 seconds
- Результат: пауза от 1 до 5 секунд

### Expression (для Dynamic)

JavaScript выражение для вычисления паузы

**Примеры:**

```javascript
{loop.index} * 2  // Увеличивающаяся: 0, 2, 4, 6...
Math.min({retry_count} ** 2, 60)  // Exponential backoff
```

## Примеры использования

### Rate limiting для API

```
Loop: For Each {users} as user
  → API Call: Создать в CRM
  → Delay: Fixed 1 second
  (Чтобы не превысить 60 req/min)
```

### Polling с интервалами

```
API Call: Запустить обработку → job
Loop: While {job.status} !== "completed"
  Max Iterations: 30
  → Delay: Fixed 10 seconds
  → API Call: Проверить статус
```

### Распределённая рассылка

```
Schedule: Каждый час
User Data: Get All Users → users
Loop: For Each {users} as user
  → Delay: Random
    Min: 1 second
    Max: 60 seconds
    (Распределить отправку на весь час)
  → Send Message: Email пользователю
```

### Exponential backoff retry

```
Try/Catch:
  Max Retries: 5
  TRY:
    → API Call: Нестабильный API
  CATCH:
    → Delay: Dynamic
      Expression: Math.min(2 ** {retry_count}, 60)
      (Паузы: 2, 4, 8, 16, 32, 60...)
    → Retry
```

### Ждать до определённого времени

```
AI Request: Создать отчёт → report
Delay: Until DateTime
  Target: {tomorrow at 00:00}
  (Подождать до следующего дня)
→ Send Message: Отправить отчёт утром
```

### Задержка между этапами

```
Create Task: "Подготовить презентацию"
Delay: Fixed 2 hours
  (Дать время на подготовку)
→ Send Message: "Напоминание о дедлайне"
```
