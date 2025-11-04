# Transform Data

## Что это

Преобразовать данные в другой формат или структуру.

## Зачем нужен

- Изменить структуру данных
- Фильтровать массивы
- Преобразовать форматы (JSON → CSV)
- Вычисления с данными

## Поля

### Input Data

Исходные данные

Обычно из переменной: `{tasks}`, `{api_response}`

### Transformation Type

Как преобразовать

**JavaScript Expression** - написать код трансформации
**Map** - преобразовать каждый элемент массива
**Filter** - отфильтровать элементы
**Reduce** - свернуть массив в одно значение
**Sort** - отсортировать
**Group By** - сгруппировать
**Format Conversion** - изменить формат

### Transformation Code (для JavaScript)

JavaScript код для преобразования

**Доступно:**

- `data` - исходные данные
- Все переменные потока
- Стандартные функции JS

**Пример:**

```javascript
data.map((task) => ({
  id: task.id,
  title: task.title.toUpperCase(),
  isOverdue: new Date(task.dueDate) < new Date(),
}));
```

### Map Expression (для Map)

Как преобразовать каждый элемент

**Пример:**

```javascript
{
  name: item.firstName + " " + item.lastName,
  age: 2024 - item.birthYear
}
```

### Filter Condition (для Filter)

Условие фильтрации

**Пример:**

```javascript
item.priority === 'high' && item.status !== 'done';
```

### Sort Options (для Sort)

**Field** - по какому полю
**Order** - `asc` или `desc`

### Group By Field (для Group By)

По какому полю группировать

Результат: объект где ключи - значения поля

### Output Format (для Format Conversion)

**JSON** - в JSON
**CSV** - в CSV таблицу
**XML** - в XML
**Excel** - в Excel файл

### Save Result to Variable

Имя переменной для результата

## Примеры использования

### Преобразовать задачи для отчёта

```
Task Data: Get All Tasks → tasks
Transform Data: Map
  Input: {tasks}
  Expression: {
    "Название": item.title,
    "Статус": item.status,
    "Ответственный": item.assignee.name,
    "Просрочена": item.dueDate < new Date()
  }
  Save to: report_data
→ Generate File: Excel с {report_data}
```

### Фильтр активных пользователей

```
User Data: Get All Users → users
Transform Data: Filter
  Input: {users}
  Condition: item.isActive && item.lastLoginDate > "30 days ago"
  Save to: active_users
```

### Посчитать статистику

```
Task Data: Get Tasks → tasks
Transform Data: Reduce
  Input: {tasks}
  Code: {
    total: data.length,
    completed: data.filter(t => t.status === "done").length,
    inProgress: data.filter(t => t.status === "in_progress").length,
    avgDuration: average(data.map(t => t.duration))
  }
```

### Группировка по статусу

```
Task Data: Get Tasks → tasks
Transform Data: Group By
  Input: {tasks}
  Field: status
  Save to: grouped
Результат:
{
  "todo": [...],
  "in_progress": [...],
  "done": [...]
}
```

### Конвертация в CSV

```
API Call: Get data from CRM → crm_data
Transform Data: Format Conversion
  Input: {crm_data}
  Output Format: CSV
  Save to: csv_file
→ Send Message: Email с CSV файлом
```

### Сложная трансформация

```javascript
// Преобразовать заказы в нужный формат для бухгалтерии
{
  orders: data.map(order => ({
    orderNumber: order.id,
    date: new Date(order.createdAt).toLocaleDateString('ru-RU'),
    customer: order.user.company || order.user.name,
    items: order.items.map(i => i.name).join(', '),
    total: order.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    vat: order.items.reduce((sum, i) => sum + i.price * i.quantity * 0.2, 0)
  })),
  totalRevenue: data.reduce((sum, o) => sum + o.total, 0)
}
```
