# Wait for Event

## Что это

Приостановить поток и ждать пока произойдёт событие.

## Зачем нужен

- Ждать ответ пользователя
- Апрув-процессы
- Multi-step workflows с паузами
- Ожидание внешних событий

## Поля

### Event Type

Какое событие ждать

**User Action** - действие пользователя

- Approve/Reject/Response/Click

**Task Event** - событие с задачей

- Status Changed/Updated/Commented

**Custom Event** - кастомное событие

- Любое событие по имени

**Webhook Call** - вызов webhook

- Ждать HTTP запрос

### Event Filter (опционально)

Фильтр события

Ждать только если событие соответствует условию

**Примеры:**

```json
{
  "userId": "{specific_user.id}",
  "action": "approve"
}
```

```json
{
  "taskId": "{created_task.id}",
  "status": "done"
}
```

### Timeout

Максимальное время ожидания

**Duration** - длительность
**Unit** - `minutes`, `hours`, `days`
**On Timeout** - что делать:

- `fail` - ошибка
- `continue` - продолжить (с default)
- `cancel` - отменить поток

### Save Event Data to Variable

Сохранить данные события

Пример: `event_data` → `{event_data.action}`, `{event_data.comment}`

## Примеры использования

### Апрув-процесс

```
Create Task: "Approve vacation request"
  Assigned To: {manager.id}
  Save to: approval_task
→ Send Message: Уведомить менеджера
→ Wait for Event: User Action
  Event Filter: {
    "userId": "{manager.id}",
    "taskId": "{approval_task.id}",
    "action": ["approve", "reject"]
  }
  Timeout: 48 hours
  On Timeout: continue (default: rejected)
  Save to: approval
→ Condition: Если {approval.action} === "approve"
  THEN:
    → API Call: Создать отпуск в HR
    → Send Message: Уведомить об одобрении
  ELSE:
    → Send Message: Уведомить об отклонении
```

### Multi-step форма

```
Send Message: Email с ссылкой на форму (step 1)
Wait for Event: Webhook Call
  Timeout: 7 days
  Save to: step1_data
→ Send Message: Email со step 2
→ Wait for Event: Webhook Call
  Timeout: 7 days
  Save to: step2_data
→ Create Account: С данными из step1 и step2
```

### Ждать комментарий с ревью

```
Event: task.created с меткой "needs-review"
Wait for Event: Task Event
  Event Filter: {
    "taskId": "{task.id}",
    "event": "commented",
    "comment_contains": "LGTM"
  }
  Timeout: 3 days
  Save to: review
→ Condition: Если не timeout
  → Update Task: Status = "ready"
```

### Ожидание оплаты

```
Event: order.created
Send Message: Ссылка на оплату
Wait for Event: Custom Event
  Event Name: "payment.completed"
  Event Filter: {"orderId": "{order.id}"}
  Timeout: 30 minutes
  On Timeout: continue
  Save to: payment
→ Condition: Если {payment} существует
  THEN:
    → Update Order: status = "paid"
    → Send Message: Спасибо за оплату
  ELSE:
    → Update Order: status = "cancelled"
    → Send Message: Заказ отменён
```

### Внешняя обработка

```
API Call: Отправить видео на обработку → job
Wait for Event: Webhook Call
  Expected Webhook: {job.callbackUrl}
  Timeout: 1 hour
  Save to: result
→ Send Message: Видео обработано
  Attachment: {result.videoUrl}
```

### Цепочка апрувов

```
Create Task: "Approve budget"
Wait for Event: Manager approval
  Timeout: 24 hours
→ Condition: Если approved
  → Create Task: "CEO approval"
  → Wait for Event: CEO approval
    Timeout: 48 hours
  → Condition: Если approved
    → API Call: Approve budget
```
