# User Data

## Что это

Получить данные о пользователях системы.

## Зачем нужен

- Работа с профилями пользователей
- Поиск пользователей
- Статистика активности
- Назначение задач

## Поля

### Operation

Что делать

**Get User by ID** - Конкретный пользователь по ID

**Get Current User** - Текущий пользователь (кто запустил поток)

**Get All Users** - Все пользователи системы

**Search Users** - Найти по условиям

### User ID

ID пользователя (для Get User by ID)

Можно переменную: `{task.assignedTo}`

### Filters

Фильтры поиска (для Search Users)

**Примеры:**

- По email: `{"email": "user@example.com"}`
- По роли: `{"role": "admin"}`
- Активные: `{"isActive": true}`
- По команде: `{"team": "developers"}`

### Include

Дополнительные данные

- **Tasks** - задачи пользователя
- **Boards** - доски пользователя
- **Activity** - история активности
- **Stats** - статистика

### Save Result to Variable

Имя переменной

Пример: `user` → `{user.name}`, `{user.email}`

## Примеры использования

### Назначить задачу свободному специалисту

```
User Data: Search Users
  Filters: {"role": "developer", "isActive": true}
  Include: Tasks
→ Найти того у кого меньше всего задач
→ Назначить новую задачу
```

### Приветствие нового пользователя

```
User Data: Get User by ID {event.userId}
→ Отправить welcome email на {user.email}
→ Создать onboarding задачи
```

### Отчёт по активности

```
User Data: Get All Users
  Include: Activity, Stats
→ Для каждого:
  - Сколько задач выполнил
  - Когда последний раз заходил
→ Создать отчёт
```

### Рассылка по команде

```
User Data: Search Users
  Filters: {"team": "marketing"}
→ Отправить сообщение каждому
```

### Проверка прав доступа

```
User Data: Get Current User
→ Проверить роль
→ Если admin - выполнить действие
→ Иначе - отказать
```
