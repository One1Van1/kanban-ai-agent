# Generate File

## Что это

Создать файл (PDF, Excel, CSV, JSON и др.) из данных.

## Зачем нужен

- Генерация отчётов
- Экспорт данных
- Создание документов
- Счета, договоры

## Поля

### File Type

Тип файла для создания

**PDF** - PDF документ
**Excel** - Excel таблица (.xlsx)
**CSV** - CSV файл
**JSON** - JSON файл
**Markdown** - Markdown документ
**HTML** - HTML страница
**Image** - Изображение (PNG, JPG)

### Template (для PDF, Excel, HTML)

Шаблон для генерации

Можно:

- **Use Template** - выбрать готовый шаблон
- **Custom HTML/Markdown** - написать свой

**Пример PDF (HTML):**

```html
<h1>Отчёт за {date}</h1>
<p>Всего задач: {stats.total}</p>
<table>
  {{#each tasks}}
  <tr>
    <td>{{title}}</td>
    <td>{{status}}</td>
  </tr>
  {{/each}}
</table>
```

### Data

Данные для файла

Обычно из переменной: `{tasks}`, `{report_data}`

Для CSV/Excel - массив объектов
Для JSON - любые данные

### Filename

Имя файла

Может содержать переменные:

- `report-{date}.pdf`
- `tasks-export-{timestamp}.csv`

### Options

#### Для PDF:

- **Page Size** - A4, Letter
- **Orientation** - Portrait, Landscape
- **Margins** - отступы

#### Для Excel:

- **Sheet Name** - название листа
- **Auto Width** - автоширина колонок
- **Header Row** - заголовки

#### Для CSV:

- **Delimiter** - разделитель (`,` или `;`)
- **Encoding** - кодировка (UTF-8)

### Storage

Где сохранить

**Return URL** - вернуть ссылку на файл
**Send as Attachment** - отправить файл
**Save to Storage** - сохранить в S3/облако

### Save Result to Variable

Имя переменной

Содержит URL или данные файла

## Примеры использования

### Еженедельный отчёт PDF

```
Блок: Schedule (Расписание)
  Тип расписания: Cron Expression
  Cron выражение: 0 17 * * 5
  Временная зона: Europe/Moscow
  Сохранить результат в переменную: ✓ schedule_event

Блок: Get Data (Получение данных)
  Переменная: tasks
  Источник: api/tasks?from={schedule_event.week_start}&to={schedule_event.week_end}
  Сохранить результат в переменную: ✓ tasks

Блок: Transform Data (Преобразование данных)
  Переменная: stats
  Источник: {tasks}
  Тип преобразования: JavaScript
  Код преобразования:
    const total = context.tasks.length;
    const completed = context.tasks.filter(t => t.status === 'done').length;
    return { total, completed, percentage: (completed/total*100).toFixed(1) };
  Сохранить результат в переменную: ✓ stats

⭐ Блок: Generate File (Генерация файла) ⭐
  Тип файла: PDF
  Шаблон: weekly-report
  Данные: {
    tasks: {tasks},
    stats: {stats},
    date: {schedule_event.timestamp}
  }
  Имя файла: weekly-report-{stats.week_number}.pdf
  Опции PDF:
    Page Size: A4
    Orientation: Portrait
    Margins: 20mm
  Storage: Return URL
  Сохранить результат в переменную: ✓ report_url

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: management@company.com
  Тема письма: Еженедельный отчёт {schedule_event.week_number}
  Сообщение: Отчёт за неделю во вложении
  Вложения: [{report_url}]
```

---

### Экспорт задач в Excel

```
Блок: Manual Trigger (Ручной запуск)
  Название триггера: Экспорт задач в Excel
  Описание: Экспорт всех задач в Excel файл
  Кнопка: Экспортировать
  Сохранить результат в переменную: ✓ trigger_event

Блок: Get Data (Получение данных)
  Переменная: all_tasks
  Источник: api/tasks?all=true
  Сохранить результат в переменную: ✓ tasks

Блок: Transform Data (Преобразование данных)
  Переменная: excel_data
  Источник: {tasks}
  Тип преобразования: Map
  Map выражение: ({
    ID: item.id,
    Название: item.title,
    Статус: item.status,
    Приоритет: item.priority,
    Исполнитель: item.assignee.name,
    Дедлайн: item.dueDate
  })
  Сохранить результат в переменную: ✓ formatted_data

⭐ Блок: Generate File (Генерация файла) ⭐
  Тип файла: Excel
  Данные: {formatted_data}
  Имя файла: tasks-export-{trigger_event.timestamp}.xlsx
  Опции Excel:
    Sheet Name: Задачи
    Auto Width: ✓
    Header Row: ✓
    Freeze First Row: ✓
  Storage: Return URL
  Сохранить результат в переменную: ✓ excel_file

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: {trigger_event.user.email}
  Тема письма: Экспорт задач готов
  Сообщение: Файл с экспортом задач готов к скачиванию
  Вложения: [{excel_file}]
```

---

### Счёт для клиента

```
Блок: Event Listener (Слушатель событий)
  Event Type: order.completed
  Сохранить результат в переменную: ✓ order_event

Блок: Get Data (Получение данных)
  Переменная: customer
  Источник: api/customers/{order_event.order.customer_id}
  Сохранить результат в переменную: ✓ customer

⭐ Блок: Generate File (Генерация файла) ⭐
  Тип файла: PDF
  Шаблон: invoice
  Данные: {
    order: {order_event.order},
    customer: {customer},
    items: {order_event.order.items},
    total: {order_event.order.total},
    date: {order_event.timestamp}
  }
  Имя файла: invoice-{order_event.order.id}.pdf
  Опции PDF:
    Page Size: A4
    Orientation: Portrait
    Margins: 15mm
    Header: invoice-header
    Footer: invoice-footer
  Storage: Save to Storage (S3)
  Сохранить результат в переменную: ✓ invoice_url

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: {customer.email}
  Тема письма: Счёт #{order_event.order.id}
  Шаблон: invoice-email
  Вложения: [{invoice_url}]

Блок: Store Data (Сохранение данных)
  Переменная: order_{order_event.order.id}_invoice
  Значение: {invoice_url}
```

---

### CSV для бухгалтерии

```
Блок: Schedule (Расписание)
  Тип расписания: Cron Expression
  Cron выражение: 0 9 1 * *
  Временная зона: Europe/Moscow
  Описание: 1-го числа каждого месяца в 9:00
  Сохранить результат в переменную: ✓ schedule_event

Блок: Get Data (Получение данных)
  Переменная: orders
  Источник: api/orders?month={schedule_event.last_month}&status=completed
  Сохранить результат в переменную: ✓ orders

Блок: Transform Data (Преобразование данных)
  Переменная: accounting_data
  Источник: {orders}
  Тип преобразования: Map
  Map выражение: ({
    Дата: item.completedAt,
    НомерЗаказа: item.id,
    Клиент: item.customer.name,
    ИНН: item.customer.inn,
    Сумма: item.total,
    НДС: item.vat,
    ИтогоСНДС: item.totalWithVat
  })
  Сохранить результат в переменную: ✓ csv_data

⭐ Блок: Generate File (Генерация файла) ⭐
  Тип файла: CSV
  Данные: {csv_data}
  Имя файла: accounting-{schedule_event.last_month}.csv
  Опции CSV:
    Delimiter: ;
    Encoding: UTF-8
    Quote All: ✓
    Include BOM: ✓
  Storage: Save to Storage (SFTP)
  Сохранить результат в переменную: ✓ csv_url

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: accounting@company.com
  Тема письма: Данные для бухгалтерии за {schedule_event.last_month}
  Сообщение: Файл с данными о заказах за прошлый месяц
  Вложения: [{csv_url}]
```

---

### JSON для интеграции

```
Блок: Event Listener (Слушатель событий)
  Event Type: data.export_requested
  Сохранить результат в переменную: ✓ export_event

Блок: Get Data (Получение данных)
  Переменная: export_data
  Источник: api/data/export?type={export_event.data_type}
  Сохранить результат в переменную: ✓ data

⭐ Блок: Generate File (Генерация файла) ⭐
  Тип файла: JSON
  Данные: {data}
  Имя файла: export-{export_event.data_type}-{export_event.timestamp}.json
  Опции JSON:
    Pretty Print: ✓
    Indent: 2
  Storage: Return URL
  Сохранить результат в переменную: ✓ json_url

Блок: API Call (API вызов)
  URL: {export_event.webhook_url}
  HTTP Method: POST
  Body: {
    "export_id": "{export_event.id}",
    "file_url": "{json_url}",
    "status": "completed"
  }
```

---

### Динамический HTML отчёт

```
Блок: Manual Trigger (Ручной запуск)
  Название триггера: Сгенерировать отчёт
  Сохранить результат в переменную: ✓ trigger_event

Блок: Get Data (Получение данных)
  Переменная: analytics
  Источник: api/analytics?period=month
  Сохранить результат в переменную: ✓ analytics

Блок: AI Request (AI запрос)
  Промпт: Создай красивый HTML отчёт на основе данных:
    {analytics}

    Включи графики, таблицы, основные метрики.
    Используй современный дизайн с CSS.
  Модель: gpt-4
  Сохранить результат в переменную: ✓ html_report

⭐ Блок: Generate File (Генерация файла) ⭐
  Тип файла: HTML
  Содержимое: {html_report}
  Имя файла: analytics-report-{trigger_event.timestamp}.html
  Опции HTML:
    Inline CSS: ✓
    Responsive: ✓
  Storage: Return URL
  Сохранить результат в переменную: ✓ report_url

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: {trigger_event.user.email}
  Тема письма: Аналитический отчёт готов
  Сообщение: <a href="{report_url}">Открыть отчёт</a>
```

Generate File:
Type: CSV
Data: {orders}
Filename: "orders-{month}.csv"
Options:
Delimiter: ";"
Encoding: "UTF-8"
→ Send Message: Email бухгалтеру

```

### JSON бэкап

```

Schedule: Каждый день в 3:00
Board Data: Get All → boards
Task Data: Get All → tasks
Generate File:
Type: JSON
Data: {boards, tasks, timestamp: {now}}
Filename: "backup-{date}.json"
Storage: Save to S3

```

### Сертификат достижения

```

Event: user.completed_course
Generate File:
Type: PDF
Template: "certificate"
Data: {
userName: {user.name},
courseName: {course.title},
date: {now},
certificateId: {generated_id}
}
Filename: "certificate-{user.id}.pdf"
→ Send Message: Поздравление + сертификат

```

```
