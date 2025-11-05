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
Блок: Get Data (Получение данных)
  Переменная: all_tasks
  Источник: api/tasks
  Сохранить результат в переменную: ✓ tasks

⭐ Блок: Transform Data (Преобразование данных) ⭐
  Переменная: tasks
  Источник: {tasks}
  Тип преобразования: Map
  Map выражение:
    {
      "Название": item.title,
      "Статус": item.status,
      "Ответственный": item.assignee.name,
      "Просрочена": new Date(item.dueDate) < new Date()
    }
  Сохранить результат в переменную: ✓ report_data

Блок: Generate File (Генерация файла)
  Имя файла: report.xlsx
  Формат: Excel
  Содержимое файла: {report_data}
```

---

### 2. Filter - Активные пользователи

```
Блок: Get Data (Получение данных)
  Переменная: users_list
  Источник: api/users
  Сохранить результат в переменную: ✓ users

⭐ Блок: Transform Data (Преобразование данных) ⭐
  Переменная: users
  Источник: {users}
  Тип преобразования: Filter
  Условие фильтра: item.isActive && item.lastLoginDays < 30
  Сохранить результат в переменную: ✓ active_users

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: team@company.com
  Сообщение: Активных пользователей: {active_users.length}
```

---

### 3. Sort - Задачи по приоритету

```
Блок: Get Data (Получение данных)
  Переменная: project_data
  Источник: api/projects/123/tasks
  Сохранить результат в переменную: ✓ project_tasks

⭐ Блок: Transform Data (Преобразование данных) ⭐
  Переменная: project_tasks
  Источник: {project_tasks}
  Тип преобразования: Sort
  Поле сортировки: priority
  Порядок: По убыванию (desc)
  Сохранить результат в переменную: ✓ sorted_tasks

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  ID карточки: {sorted_tasks[0].id}
  Текст комментария: Самая приоритетная задача: {sorted_tasks[0].title}
```

---

### 4. Group By - Статистика по статусам

```
Блок: Get Data (Получение данных)
  Переменная: tasks_data
  Источник: api/tasks
  Сохранить результат в переменную: ✓ all_tasks

⭐ Блок: Transform Data (Преобразование данных) ⭐
  Переменная: all_tasks
  Источник: {all_tasks}
  Тип преобразования: Group By
  Группировать по полю: status
  Сохранить результат в переменную: ✓ grouped_by_status

Результат:
  {grouped_by_status.todo} → массив задач со статусом "todo"
  {grouped_by_status.in_progress} → массив задач "in_progress"
  {grouped_by_status.done} → массив задач "done"

Блок: AI Request (AI запрос)
  AI Модель: GPT-4
  Промпт: Проанализируй статистику задач:
    Todo: {grouped_by_status.todo.length}
    В работе: {grouped_by_status.in_progress.length}
    Готово: {grouped_by_status.done.length}
  Сохранить результат в переменную: ✓ analysis
```

---

### 5. Reduce - Подсчёт статистики

```
Блок: Get Data (Получение данных)
  Переменная: orders_data
  Источник: api/orders?month=current
  Сохранить результат в переменную: ✓ orders

⭐ Блок: Transform Data (Преобразование данных) ⭐
  Переменная: orders
  Источник: {orders}
  Тип преобразования: Reduce
  Код преобразования:
    {
      totalOrders: data.length,
      totalRevenue: data.reduce((sum, o) => sum + o.total, 0),
      avgOrderValue: data.reduce((sum, o) => sum + o.total, 0) / data.length,
      topCustomer: data.sort((a, b) => b.total - a.total)[0].customer
    }
  Сохранить результат в переменную: ✓ stats

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  ID карточки: monthly_report
  Текст комментария: Выручка за месяц: {stats.totalRevenue} руб. Средний чек: {stats.avgOrderValue} руб.
```

---

### 6. JavaScript Expression - Сложная трансформация

```
Блок: API Call (API вызов)
  Адрес сервиса: https://crm.company.com/api/leads
  Тип запроса: GET
  Сохранить результат в переменную: ✓ crm_data

⭐ Блок: Transform Data (Преобразование данных) ⭐
  Переменная: crm_data
  Источник: {crm_data.leads}
  Тип преобразования: JavaScript Expression
  Код преобразования:
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
  Сохранить результат в переменную: ✓ qualified_leads

Блок: Loop (Цикл)
  Коллекция/Массив: {qualified_leads}
  Переменная элемента: lead
  Максимум итераций: 50

  Внутри цикла:
    → Создать задачу для {lead.assignedTo}
    → Отправить уведомление на {lead.email}
```

---

### 7. Format Conversion - Экспорт в CSV

```
Блок: Get Data (Получение данных)
  Переменная: users_export
  Источник: api/users?active=true
  Сохранить результат в переменную: ✓ users

⭐ Блок: Transform Data (Преобразование данных) ⭐
  Переменная: users
  Источник: {users}
  Тип преобразования: Format Conversion
  Формат вывода: CSV
  Сохранить результат в переменную: ✓ users_csv

Блок: Generate File (Генерация файла)
  Имя файла: users_export.csv
  Формат: CSV
  Содержимое файла: {users_csv}

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: admin@company.com
  Сообщение: Экспорт активных пользователей
  Вложение: users_export.csv
```

---

### 8. Цепочка преобразований

````
Блок: Get Data (Получение данных)
  Переменная: all_data
  Источник: api/tasks
  Сохранить результат в переменную: ✓ raw_tasks

Блок: Transform Data #1
  Переменная: raw_tasks
  Источник: {raw_tasks}
  Тип преобразования: Filter
  Условие фильтра: item.status !== 'archived'
  Сохранить результат в переменную: ✓ active_tasks

Блок: Transform Data #2
  Переменная: active_tasks
  Источник: {active_tasks}
  Тип преобразования: Map
  Map выражение:
    {
      id: item.id,
      title: item.title,
      daysOpen: Math.floor((new Date() - new Date(item.createdAt)) / (1000*60*60*24))
    }
  Сохранить результат в переменную: ✓ tasks_with_age

Блок: Transform Data #3
  Переменная: tasks_with_age
  Источник: {tasks_with_age}
  Тип преобразования: Sort
  Поле сортировки: daysOpen
  Порядок: По убыванию (desc)
  Сохранить результат в переменную: ✓ oldest_tasks

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  ID карточки: project_dashboard
  Текст комментария: Самая старая задача открыта {oldest_tasks[0].daysOpen} дней: {oldest_tasks[0].title}
```---

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
````
