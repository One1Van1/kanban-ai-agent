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
Schedule: Каждую пятницу в 17:00
Task Data: Get Tasks за неделю → tasks
Transform Data: Посчитать статистику → stats
Generate File:
  Type: PDF
  Template: "weekly-report"
  Data: {tasks, stats, date: {now}}
  Filename: "weekly-report-{date}.pdf"
  Save to: report_url
→ Send Message: Email с файлом {report_url}
```

### Экспорт задач в Excel

```
Manual Trigger: "Экспорт задач"
Task Data: Get All Tasks → tasks
Transform Data: Преобразовать для Excel
Generate File:
  Type: Excel
  Data: {tasks}
  Filename: "tasks-{date}.xlsx"
  Options:
    Sheet Name: "Задачи"
    Auto Width: true
  Save to: excel_file
→ Return file для скачивания
```

### Счёт для клиента

```
Event: order.completed
Generate File:
  Type: PDF
  Template: "invoice"
  Data: {
    order: {order},
    customer: {customer},
    items: {order.items},
    total: {order.total}
  }
  Filename: "invoice-{order.id}.pdf"
  Save to: invoice_url
→ Send Message: Email с invoice
```

### CSV для бухгалтерии

```
Schedule: 1 числа каждого месяца
Get Data: Заказы за прошлый месяц
Transform Data: Формат для бухгалтерии
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
