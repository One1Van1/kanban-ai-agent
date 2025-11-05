# Wait Condition - Ожидание условия

## Описание

Приостанавливает выполнение потока до выполнения заданного условия. Периодически проверяет условие.

## Категория

**Wait** (Ожидание)

## Конфигурация

### Поля

- **Response Variable** (`responseVariable`) - Переменная для проверки условия
- **Timeout** (`timeout`) - Максимальное время ожидания (в секундах)
- **Condition** (`condition`) - Условие для продолжения:
  - `not_empty` - Переменная не пуста
  - `equals` - Переменная равна значению
  - `contains` - Переменная содержит текст
  - `api_success` - API вызов успешен

### Variable Storage

❌ **Не поддерживает сохранение в переменную** (блок управления потоком)

### Выходы

- **Success** - Условие выполнено
- **Timeout** - Превышен таймаут
- **Error** - Ошибка проверки условия

## Примеры использования

### Ждать завершения задачи

```
Блок: Event Listener (Слушатель событий)
  Event Type: subtask.created
  Сохранить результат в переменную: ✓ subtask_event

⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
  Целевая задача: {subtask_event.parent_task.id}
  Текст комментария: Ожидаем завершения подзадачи: {subtask_event.subtask.title}

⭐ Блок: Wait Condition (Ожидание условия) ⭐
  Переменная для проверки: subtask_status
  Источник данных: api/tasks/{subtask_event.subtask.id}
  Условие: {subtask_status.status} === "completed"
  Интервал проверки (секунды): 30
  Timeout (секунды): 86400
  Max Retries: 2880
  Сохранить результат в переменную: ✓ wait_result

  Success (Задача завершена):
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Slack
      Получатель: {subtask_event.parent_task.assignee.slack_id}
      Сообщение: ✅ Подзадача завершена: {subtask_event.subtask.title}
        Можете продолжать работу над основной задачей

    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
      Целевая задача: {subtask_event.parent_task.id}
      Текст комментария: Подзадача выполнена

  Timeout (Превышен лимит ожидания):
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Email
      Получатель: {subtask_event.parent_task.manager.email}
      Тема письма: Подзадача не завершена в срок
      Сообщение: Подзадача просрочена более чем на 24 часа:
        {subtask_event.subtask.title}
```

---

### Ожидание готовности внешней системы

```
Блок: API Call (API вызов)
  URL: https://api.external.com/v1/deploy
  HTTP Method: POST
  Body: { "version": "2.0.0" }
  Сохранить результат в переменную: ✓ deployment

Блок: Send Message (Отправка сообщения)
  Канал отправки: Slack
  Получатель: #deployments
  Сообщение: 🚀 Деплой начат: ID {deployment.data.id}

⭐ Блок: Wait Condition (Ожидание условия) ⭐
  Переменная для проверки: deploy_status
  Источник данных: api/external.com/v1/deploy/{deployment.data.id}/status
  Условие: {deploy_status.state} === "ready" || {deploy_status.state} === "failed"
  Интервал проверки (секунды): 15
  Timeout (секунды): 3600
  Max Retries: 240
  Сохранить результат в переменную: ✓ final_status

  Success:
    Блок: If-Else (Условие)
      Условие: {deploy_status.state} === "ready"

      True (Деплой успешен):
        Блок: Send Message (Отправка сообщения)
          Канал отправки: Slack
          Получатель: #deployments
          Сообщение: ✅ Деплой завершён успешно
            Версия: 2.0.0
            URL: {deploy_status.url}

      False (Деплой провалился):
        Блок: Send Message (Отправка сообщения)
          Канал отправки: Slack
          Получатель: #deployments
          Сообщение: ❌ Деплой провалился
            Ошибка: {deploy_status.error}

        Блок: API Call (API вызов)
          URL: https://api.external.com/v1/deploy/{deployment.data.id}/rollback
          HTTP Method: POST

  Timeout:
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Slack
      Получатель: #deployments
      Сообщение: ⏰ Деплой не завершился за 1 час
        Требуется ручная проверка
```

---

### Ожидание подтверждения оплаты

```
Блок: Event Listener (Слушатель событий)
  Event Type: order.created
  Сохранить результат в переменную: ✓ order_event

Блок: API Call (API вызов)
  URL: https://payment.gateway.com/charge
  HTTP Method: POST
  Body: {
    "amount": {order_event.order.total},
    "currency": "RUB",
    "order_id": "{order_event.order.id}"
  }
  Сохранить результат в переменную: ✓ payment

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: {order_event.customer.email}
  Тема письма: Ожидаем оплаты заказа
  Сообщение: Ссылка для оплаты: {payment.data.payment_url}

⭐ Блок: Wait Condition (Ожидание условия) ⭐
  Переменная для проверки: payment_status
  Источник данных: payment.gateway.com/status/{payment.data.id}
  Условие: {payment_status.status} === "paid" || {payment_status.status} === "failed"
  Интервал проверки (секунды): 10
  Timeout (секунды): 1800
  Max Retries: 180
  Сохранить результат в переменную: ✓ payment_result

  Success:
    Блок: If-Else (Условие)
      Условие: {payment_status.status} === "paid"

      True (Оплачено):
        Блок: API Call (API вызов)
          URL: https://api.example.com/orders/{order_event.order.id}/confirm
          HTTP Method: POST

        Блок: Generate File (Генерация файла)
          Тип файла: PDF
          Шаблон: invoice
          Данные: { "order": {order_event.order} }
          Имя файла: invoice-{order_event.order.id}.pdf
          Сохранить результат в переменную: ✓ invoice

        Блок: Send Message (Отправка сообщения)
          Канал отправки: Email
          Получатель: {order_event.customer.email}
          Тема письма: Оплата получена
          Сообщение: Спасибо за оплату!
          Вложения: [{invoice}]

      False (Провалилась):
        Блок: Send Message (Отправка сообщения)
          Канал отправки: Email
          Получатель: {order_event.customer.email}
          Тема письма: Ошибка оплаты
          Сообщение: Не удалось обработать платёж

  Timeout:
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Email
      Получатель: {order_event.customer.email}
      Тема письма: Напоминание об оплате
      Сообщение: Вы не завершили оплату заказа
```

---

### Ожидание обработки файла

```
Блок: Event Listener (Слушатель событий)
  Event Type: file.uploaded
  Сохранить результат в переменную: ✓ file_event

Блок: API Call (API вызов)
  URL: https://converter.api.com/convert
  HTTP Method: POST
  Body: {
    "file_url": "{file_event.file.url}",
    "format": "pdf"
  }
  Сохранить результат в переменную: ✓ conversion_job

⭐ Блок: Wait Condition (Ожидание условия) ⭐
  Переменная для проверки: job_status
  Источник данных: converter.api.com/jobs/{conversion_job.data.job_id}
  Условие: {job_status.progress} === 100
  Интервал проверки (секунды): 5
  Timeout (секунды): 600
  Max Retries: 120
  Сохранить результат в переменную: ✓ conversion_result

  Success:
    Блок: Store Data (Сохранение данных)
      Тип хранилища: Database
      Ключ: converted_file_{file_event.file.id}
      Значение: {job_status.result_url}

    Блок: Send Message (Отправка сообщения)
      Канал отправки: Email
      Получатель: {file_event.user.email}
      Тема письма: Файл конвертирован
      Сообщение: Ссылка для скачивания: {job_status.result_url}

  Timeout:
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Email
      Получатель: {file_event.user.email}
      Тема письма: Ошибка конвертации
      Сообщение: Не удалось конвертировать файл
```

---

### Ожидание изменения статуса

```
Блок: Event Listener (Слушатель событий)
  Event Type: approval.requested
  Сохранить результат в переменную: ✓ approval_event

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: {approval_event.approver.email}
  Тема письма: Требуется подтверждение
  Сообщение: Подтвердите действие: {approval_event.action}

⭐ Блок: Wait Condition (Ожидание условия) ⭐
  Переменная для проверки: approval_status
  Источник данных: api/approvals/{approval_event.approval_id}
  Условие: {approval_status.decision} !== null
  Интервал проверки (секунды): 30
  Timeout (секунды): 7200
  Max Retries: 240
  Сохранить результат в переменную: ✓ decision_result

  Success:
    Блок: Switch (Переключатель)
      Переменная для проверки: {approval_status.decision}

      Case "approved":
        Блок: API Call (API вызов)
          URL: https://api.example.com/actions/{approval_event.action_id}/execute
          HTTP Method: POST

        Блок: Send Message (Отправка сообщения)
          Канал отправки: Slack
          Получатель: #approvals
          Сообщение: ✅ Действие одобрено и выполнено

      Case "rejected":
        ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
          Текст комментария: Действие отклонено: {approval_status.reason}

      Default:
        ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
          Текст комментария: Неизвестное решение: {approval_status.decision}

  Timeout:
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Slack
      Получатель: {approval_event.escalation_manager.slack_id}
      Сообщение: ⚠️ Нет решения по подтверждению после 2 часов
        Действие: {approval_event.action}
        Запрошено у: {approval_event.approver.name}
```
