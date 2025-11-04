# Transform Data

## Что это

Преобразовать данные в другой формат или структуру.

## Зачем нужен

- Изменить структуру данных
- Фильтровать массивы
- Преобразовать форматы (JSON → CSV)
- Вычисления с данными

## Поля

### Variable Name (Переменная)

Откуда брать исходные данные

**Примеры:**

- `tasks` - если данные в переменной tasks
- `api_response` - результат API запроса
- `webhook_data` - данные из webhook

### Source (Источник)

Путь к данным для преобразования

**Примеры:**

- `{tasks}` - вся переменная
- `{api_response.data.items}` - массив из API ответа
- `{webhook_data.body}` - тело запроса

### Transformation Type (Тип преобразования)

Выберите тип преобразования:

#### **JavaScript Expression**

Написать произвольный JavaScript код

- Доступна переменная `data` с исходными данными
- Можно использовать любые JS функции
- Универсальный метод для сложных операций

#### **Map**

Преобразовать каждый элемент массива

- Применяется к массивам
- Создаёт новый массив с преобразованными элементами
- Доступна переменная `item` для каждого элемента

#### **Filter**

Отфильтровать элементы массива

- Оставить только элементы, подходящие под условие
- Возвращает новый массив
- Условие возвращает `true` (оставить) или `false` (убрать)

#### **Reduce**

Свернуть массив в одно значение

- Подсчёт суммы, среднего, агрегация
- Сложные вычисления над массивом

#### **Sort**

Отсортировать массив

- По указанному полю
- По возрастанию или убыванию

#### **Group By**

Сгруппировать элементы

- Результат: объект где ключи - значения поля
- Например, группировка задач по статусу

#### **Format Conversion**

Изменить формат данных

- JSON → CSV, XML, Excel
- Для экспорта данных

---

### Transformation Code (для JavaScript/Map/Reduce)

JavaScript код для преобразования

**Для JavaScript Expression:**

```javascript
// Доступна переменная data
data.map((task) => ({
  id: task.id,
  title: task.title.toUpperCase(),
  isOverdue: new Date(task.dueDate) < new Date(),
}));
```

**Для Map:**

```javascript
// Доступна переменная item
{
  name: item.firstName + " " + item.lastName,
  age: new Date().getFullYear() - item.birthYear,
  isAdult: item.age >= 18
}
```

**Для Reduce:**

```javascript
// Подсчитать статистику
{
  total: data.length,
  completed: data.filter(t => t.status === "done").length,
  avgDuration: data.reduce((sum, t) => sum + t.duration, 0) / data.length
}
```

---

### Filter Condition (для Filter)

Условие фильтрации (возвращает true/false)

**Примеры:**

```javascript
// Только активные задачи
item.status === 'active';

// Только высокий приоритет
item.priority === 'high' && item.status !== 'done';

// Просроченные задачи
new Date(item.dueDate) <
  new Date()(
    // Задачи старше 7 дней
    new Date() - new Date(item.createdAt),
  ) >
  7 * 24 * 60 * 60 * 1000;
```

---

### Sort Field (для Sort)

Имя поля для сортировки

**Примеры:**

- `createdAt` - по дате создания
- `priority` - по приоритету
- `title` - по названию
- `assignee.name` - по имени ответственного

### Sort Order (для Sort)

Порядок сортировки:

- **По возрастанию** (asc) - 1, 2, 3... / A, B, C...
- **По убыванию** (desc) - 3, 2, 1... / Z, Y, X...

---

### Group By Field (для Group By)

Поле для группировки

**Примеры:**

- `status` - группировка по статусу
- `assignee.id` - по ответственному
- `priority` - по приоритету

**Результат:**

```javascript
{
  "todo": [задача1, задача2],
  "in_progress": [задача3],
  "done": [задача4, задача5]
}
```

---

### Output Format (для Format Conversion)

Формат вывода:

- **JSON** - JSON строка
- **CSV** - CSV таблица
- **XML** - XML документ
- **Excel** - Excel файл (.xlsx)

---

### Save Result to Variable

Имя переменной для результата

**Пример:** `transformed_data` → используйте `{transformed_data}` в следующих блоках

---

## Примеры использования

### 1. Map - Преобразовать задачи для отчёта

```
Get Data: Получить все задачи → tasks

Transform Data:
  Variable: tasks
  Source: {tasks}
  Type: Map
  Map Expression:
    {
      "Название": item.title,
      "Статус": item.status,
      "Ответственный": item.assignee.name,
      "Просрочена": new Date(item.dueDate) < new Date()
    }
  Save to: report_data

Generate File: Создать Excel с {report_data}
```

---

### 2. Filter - Активные пользователи

```
Get Data: Получить пользователей → users

Transform Data:
  Variable: users
  Source: {users}
  Type: Filter
  Filter Condition: item.isActive && item.lastLoginDays < 30
  Save to: active_users

Send Message: Отправить рассылку {active_users}
```

---

### 3. Sort - Задачи по приоритету

```
Get Data: Задачи проекта → project_tasks

Transform Data:
  Variable: project_tasks
  Source: {project_tasks}
  Type: Sort
  Sort Field: priority
  Order: По убыванию (desc)
  Save to: sorted_tasks

Comment: Топ задачи: {sorted_tasks[0].title}
```

---

### 4. Group By - Статистика по статусам

```
Get Data: Все задачи → all_tasks

Transform Data:
  Variable: all_tasks
  Source: {all_tasks}
  Type: Group By
  Group By Field: status
  Save to: grouped_by_status

Результат в {grouped_by_status}:
{
  "todo": [задача1, задача2],
  "in_progress": [задача3, задача4],
  "done": [задача5, задача6, задача7]
}

AI Request:
  Prompt: "Проанализируй статистику:
    Todo: {grouped_by_status.todo.length}
    В работе: {grouped_by_status.in_progress.length}
    Готово: {grouped_by_status.done.length}"
```

---

### 5. Reduce - Подсчёт статистики

```
Get Data: Заказы за месяц → orders

Transform Data:
  Variable: orders
  Source: {orders}
  Type: Reduce
  Transformation Code:
    {
      totalOrders: data.length,
      totalRevenue: data.reduce((sum, o) => sum + o.total, 0),
      avgOrderValue: data.reduce((sum, o) => sum + o.total, 0) / data.length,
      topCustomer: data.sort((a, b) => b.total - a.total)[0].customer
    }
  Save to: stats

Comment: Выручка за месяц: {stats.totalRevenue} руб
```

---

### 6. JavaScript Expression - Сложная трансформация

```
API Call: Получить данные CRM → crm_data

Transform Data:
  Variable: crm_data
  Source: {crm_data.leads}
  Type: JavaScript Expression
  Code:
    data
      .filter(lead => lead.score > 70)
      .map(lead => ({
        id: lead.id,
        company: lead.company || 'Не указано',
        contact: `${lead.firstName} ${lead.lastName}`,
        email: lead.email,
        phone: lead.phone,
        score: lead.score,
        status: lead.score > 90 ? 'Горячий' : 'Тёплый',
        assignedTo: lead.score > 90 ? 'senior_manager' : 'junior_manager'
      }))
      .sort((a, b) => b.score - a.score)
  Save to: qualified_leads

Loop: Для каждого лида в {qualified_leads}
  → Создать задачу
  → Назначить менеджера
  → Отправить уведомление
```

---

### 7. Format Conversion - Экспорт в CSV

```
Get Data: Все пользователи → users

Transform Data:
  Variable: users
  Source: {users}
  Type: Format Conversion
  Output Format: CSV
  Save to: users_csv

Generate File:
  File Name: users_export.csv
  Content: {users_csv}

Send Message:
  Channel: Email
  To: admin@company.com
  Message: Экспорт пользователей
  Attachment: {users_csv}
```

---

### 8. Цепочка преобразований

```
Get Data: Задачи → raw_tasks

Transform Data #1: Фильтр
  Type: Filter
  Condition: item.status !== 'archived'
  Save to: active_tasks

Transform Data #2: Map
  Source: {active_tasks}
  Type: Map
  Expression: {
    id: item.id,
    title: item.title,
    daysOpen: Math.floor((new Date() - new Date(item.createdAt)) / (1000*60*60*24))
  }
  Save to: tasks_with_age

Transform Data #3: Sort
  Source: {tasks_with_age}
  Type: Sort
  Field: daysOpen
  Order: desc
  Save to: oldest_tasks

Comment: Самая старая задача открыта {oldest_tasks[0].daysOpen} дней
```

---

## Советы

### Когда использовать Map

- Нужно преобразовать структуру каждого элемента
- Переименовать поля
- Добавить вычисляемые поля
- Изменить формат данных

### Когда использовать Filter

- Выбрать элементы по условию
- Убрать ненужные данные
- Найти элементы с определёнными свойствами

### Когда использовать Sort

- Упорядочить данные
- Найти топ N элементов
- Отсортировать перед отображением

### Когда использовать Group By

- Группировка для статистики
- Создать категории
- Подсчёт по группам

### Когда использовать Reduce

- Подсчёт итогов
- Агрегация данных
- Вычисление статистики

### Когда использовать JavaScript

- Сложная логика
- Комбинация операций
- Нестандартные преобразования
- Когда Map/Filter/Sort не хватает

### Когда использовать Format Conversion

- Экспорт данных
- Создание файлов отчётов
- Интеграция с внешними системами
