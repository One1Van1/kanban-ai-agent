# Loop

## Что это

Цикл - повторять действия для каждого элемента или N раз.

## Зачем нужен

- Обработать список задач/пользователей
- Повторить действие несколько раз
- Массовые операции

## Поля

### Loop Type

Тип цикла

**For Each** - для каждого элемента массива

- Самый частый вариант

**For N Times** - повторить N раз

- Когда нужно точное количество повторов

**While Condition** - пока условие верно

- Когда неизвестно сколько итераций нужно

### Array (для For Each)

Массив для обработки

Обычно из переменной: `{tasks}`, `{users}`, `{items}`

### Count (для For N Times)

Сколько раз повторить

Может быть переменная: `{users.length}`, `5`, `{retryCount}`

### Condition (для While)

Условие продолжения цикла

Пример: `{processedCount} < {total}`

### Current Item Variable

Имя переменной для текущего элемента

**Для For Each:**

- `item` → внутри цикла доступно как `{item.name}`, `{item.id}`

**Для For N Times:**

- `index` → `{index}` (0, 1, 2, 3...)

### Max Iterations (опционально)

Максимум итераций (защита от бесконечного цикла)

Рекомендуется для While

### Loop Body

Блоки которые выполняются в каждой итерации

### Break/Continue

**Break** - прервать цикл
**Continue** - перейти к следующей итерации

Можно добавить Condition внутри цикла чтобы прервать его

## Примеры использования

### Обработать все задачи

```
Task Data: Get Tasks → tasks
Loop: For Each {tasks} as task
  → AI Request: Проанализировать {task.description}
  → Update Task: Добавить теги
  → Delay: 1 секунда (чтобы не перегрузить AI)
```

### Отправить уведомления всем

```
User Data: Search активные пользователи → users
Loop: For Each {users} as user
  → Send Message: Email на {user.email}
  → Delay: 0.5 сек (rate limiting)
```

### Повторить с задержкой

```
Loop: For 3 Times as attempt
  → API Call: Попытка отправить данные
  → Condition: Если успешно
    → Break (выйти из цикла)
  → Else:
    → Delay: {attempt} * 2 секунды (1, 2, 4 сек)
```

### While - ждать завершения

```
API Call: Запустить обработку → job
Loop: While {job.status} !== "completed"
  Max Iterations: 30
  → Delay: 10 секунд
  → API Call: Проверить статус {job.id} → job
  → Condition: Если completed
    → Break
```

### Пакетная обработка

```
Task Data: Get Tasks (1000 задач) → tasks
Loop: For Each {tasks} as task
  → Update Task: Изменить поле
  → Condition: Если {loop.index} % 100 === 0
    → Delay: 5 секунд (пауза каждые 100 задач)
```

### Найти первое совпадение

```
Loop: For Each {items} as item
  → Condition: Если {item.id} === {searchId}
    → Save: {item} to foundItem
    → Break (нашли, выходим)
```
