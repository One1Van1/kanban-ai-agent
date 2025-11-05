# Wait Response - Ожидание ответа

## Описание

Приостанавливает выполнение потока до получения ответа от пользователя или внешней системы.

## Категория

**Wait** (Ожидание)

## Конфигурация

### Поля

- **Response Variable** (`responseVariable`) - Имя переменной для сохранения ответа
- **Timeout** (`timeout`) - Таймаут ожидания (в секундах)
- **Condition** (`condition`) - Условие продолжения:
  - `not_empty` - Переменная не пуста
  - `equals` - Переменная равна значению
  - `contains` - Переменная содержит текст
  - `api_success` - API вызов успешен

### Variable Storage

✅ **Поддерживает сохранение ответа в переменную**

Результат содержит данные ответа:

```json
{
  "response": "Текст ответа пользователя",
  "timestamp": "2025-11-04T10:30:00Z",
  "source": "telegram"
}
```

### Выходы

- **Success** - Ответ получен
- **Timeout** - Превышен таймаут
- **Error** - Ошибка получения ответа

## Примеры использования

### Запросить подтверждение действия

```
Блок: Event Listener (Слушатель событий)
  Event Type: task.critical_change
  Сохранить результат в переменную: ✓ change_event

Блок: Send Message (Отправка сообщения)
  Канал отправки: Telegram
  Получатель: {change_event.user.telegram_id}
  Сообщение: ⚠️ Подтвердите изменение задачи:
    {change_event.task.title}

    Новый статус: {change_event.new_status}

    Ответьте "ДА" для подтверждения или "НЕТ" для отмены

⭐ Блок: Wait Response (Ожидание ответа) ⭐
  Ожидать ответ от: {change_event.user.id}
  Канал ответа: Telegram
  Timeout (секунды): 300
  Условие валидации: not_empty
  Сохранить результат в переменную: ✓ user_response

Блок: If-Else (Условие)
  Условие: {user_response.text}.toLowerCase() === "да"

  True (Подтверждено):
    Блок: API Call (API вызов)
      URL: https://api.example.com/tasks/{change_event.task.id}
      HTTP Method: PUT
      Body: { "status": "{change_event.new_status}" }

    Блок: Send Message (Отправка сообщения)
      Канал отправки: Telegram
      Получатель: {change_event.user.telegram_id}
      Сообщение: ✅ Изменение применено

  False (Отменено):
    ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
      Целевая задача: {change_event.task.id}
      Текст комментария: Изменение отменено пользователем
```

---

### Интерактивный опрос

```
Блок: Manual Trigger (Ручной запуск)
  Название триггера: Начать опрос
  Сохранить результат в переменную: ✓ survey_start

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: {survey_start.user.email}
  Тема письма: Опрос о качестве сервиса
  Сообщение: Оцените наш сервис от 1 до 10:

⭐ Блок: Wait Response (Ожидание ответа) ⭐
  Ожидать ответ от: {survey_start.user.id}
  Канал ответа: Email
  Timeout (секунды): 86400
  Условие валидации: regex
  Паттерн валидации: ^([1-9]|10)$
  Сохранить результат в переменную: ✓ rating

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: {survey_start.user.email}
  Тема письма: Расскажите подробнее
  Сообщение: Спасибо за оценку {rating.text}!
    Что можно улучшить?

⭐ Блок: Wait Response (Ожидание ответа) ⭐
  Ожидать ответ от: {survey_start.user.id}
  Канал ответа: Email
  Timeout (секунды): 86400
  Сохранить результат в переменную: ✓ feedback

Блок: Store Data (Сохранение данных)
  Тип хранилища: Database
  Ключ: survey_result_{survey_start.user.id}_{survey_start.timestamp}
  Значение: {
    "user_id": "{survey_start.user.id}",
    "rating": {rating.text},
    "feedback": "{feedback.text}",
    "timestamp": "{feedback.timestamp}"
  }

Блок: Send Message (Отправка сообщения)
  Канал отправки: Slack
  Получатель: #customer-feedback
  Сообщение: 📊 Новый отзыв!
    Оценка: {rating.text}/10
    Отзыв: {feedback.text}
```

---

### Ожидание документа от пользователя

```
Блок: Event Listener (Слушатель событий)
  Event Type: document.requested
  Сохранить результат в переменную: ✓ doc_request

Блок: Send Message (Отправка сообщения)
  Канал отправки: Telegram
  Получатель: {doc_request.user.telegram_id}
  Сообщение: 📎 Пожалуйста, отправьте документ: {doc_request.document_type}

⭐ Блок: Wait Response (Ожидание ответа) ⭐
  Ожидать ответ от: {doc_request.user.id}
  Канал ответа: Telegram
  Timeout (секунды): 3600
  Тип ответа: File
  Условие валидации: file_type
  Допустимые типы файлов: [pdf, docx, jpg, png]
  Сохранить результат в переменную: ✓ uploaded_doc

Блок: Extract Text (Извлечение текста)
  Переменная: document
  Источник: {uploaded_doc.file}
  Язык документа: Русский
  Извлечь структуру: ✓
  Сохранить результат в переменную: ✓ extracted_text

Блок: AI Request (AI запрос)
  Промпт: Проверь документ на соответствие требованиям:
    Тип документа: {doc_request.document_type}

    Содержимое:
    {extracted_text}

    Верни JSON: { "valid": boolean, "issues": string[] }
  Модель: gpt-4
  Формат ответа: JSON
  Сохранить результат в переменную: ✓ validation

Блок: If-Else (Условие)
  Условие: {validation.valid} === true

  True (Документ валиден):
    Блок: Store Data (Сохранение данных)
      Тип хранилища: File
      Ключ: documents/{doc_request.user.id}/{uploaded_doc.filename}
      Значение: {uploaded_doc.file}

    Блок: Send Message (Отправка сообщения)
      Канал отправки: Telegram
      Получатель: {doc_request.user.telegram_id}
      Сообщение: ✅ Документ принят и сохранён

  False (Проблемы с документом):
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Telegram
      Получатель: {doc_request.user.telegram_id}
      Сообщение: ❌ Документ не прошёл проверку:
        {validation.issues}

        Пожалуйста, отправьте исправленный вариант
```

---

### Многошаговый диалог с пользователем

```
Блок: Manual Trigger (Ручной запуск)
  Название триггера: Создать задачу через чат
  Сохранить результат в переменную: ✓ trigger

Блок: Send Message (Отправка сообщения)
  Канал отправки: Slack
  Получатель: {trigger.user.slack_id}
  Сообщение: Создадим новую задачу!
    Шаг 1/3: Введите название задачи

⭐ Блок: Wait Response (Ожидание ответа) ⭐
  Ожидать ответ от: {trigger.user.id}
  Канал ответа: Slack
  Timeout (секунды): 600
  Сохранить результат в переменную: ✓ task_title

Блок: Send Message (Отправка сообщения)
  Канал отправки: Slack
  Получатель: {trigger.user.slack_id}
  Сообщение: Отлично! Название: "{task_title.text}"

    Шаг 2/3: Введите описание задачи

⭐ Блок: Wait Response (Ожидание ответа) ⭐
  Ожидать ответ от: {trigger.user.id}
  Канал ответа: Slack
  Timeout (секунды): 600
  Сохранить результат в переменную: ✓ task_description

Блок: Send Message (Отправка сообщения)
  Канал отправки: Slack
  Получатель: {trigger.user.slack_id}
  Сообщение: Шаг 3/3: Выберите приоритет (low/medium/high/critical)

⭐ Блок: Wait Response (Ожидание ответа) ⭐
  Ожидать ответ от: {trigger.user.id}
  Канал ответа: Slack
  Timeout (секунды): 300
  Условие валидации: regex
  Паттерн валидации: ^(low|medium|high|critical)$
  Сохранить результат в переменную: ✓ task_priority

Блок: API Call (API вызов)
  URL: https://api.example.com/tasks
  HTTP Method: POST
  Body: {
    "title": "{task_title.text}",
    "description": "{task_description.text}",
    "priority": "{task_priority.text}",
    "creator_id": "{trigger.user.id}"
  }
  Сохранить результат в переменную: ✓ created_task

Блок: Send Message (Отправка сообщения)
  Канал отправки: Slack
  Получатель: {trigger.user.slack_id}
  Сообщение: ✅ Задача создана!

    *{task_title.text}*
    Приоритет: {task_priority.text}
    ID: {created_task.data.id}

    <{created_task.data.url}|Открыть задачу>
```

---

### Ожидание с обработкой timeout

```
Блок: Event Listener (Слушатель событий)
  Event Type: approval.needed
  Сохранить результат в переменную: ✓ approval_event

Блок: Send Message (Отправка сообщения)
  Канал отправки: Email
  Получатель: {approval_event.approver.email}
  Тема письма: Требуется подтверждение
  Сообщение: Подтвердите действие: {approval_event.action}

    Ответьте "APPROVE" или "REJECT"

⭐ Блок: Wait Response (Ожидание ответа) ⭐
  Ожидать ответ от: {approval_event.approver.id}
  Канал ответа: Email
  Timeout (секунды): 7200
  Условие валидации: regex
  Паттерн валидации: ^(APPROVE|REJECT)$
  Сохранить результат в переменную: ✓ approval_response

  Success (Ответ получен):
    Блок: If-Else (Условие)
      Условие: {approval_response.text} === "APPROVE"

      True:
        Блок: API Call (API вызов)
          URL: https://api.example.com/actions/{approval_event.action_id}/approve
          HTTP Method: POST

        Блок: Send Message (Отправка сообщения)
          Канал отправки: Slack
          Получатель: #approvals
          Сообщение: ✅ Действие одобрено: {approval_event.action}

      False:
        ⭐ Блок: MCP Operation (Операция с объектом) ⭐
  Операция: add_comment
          Текст комментария: Действие отклонено

  Timeout (Превышен лимит):
    Блок: Send Message (Отправка сообщения)
      Канал отправки: Slack
      Получатель: {approval_event.escalation_manager.slack_id}
      Сообщение: ⚠️ Эскалация: нет ответа на запрос подтверждения
        Действие: {approval_event.action}
        Запрошено у: {approval_event.approver.name}
        Ожидание: 2 часа

    Блок: Send Message (Отправка сообщения)
      Канал отправки: Email
      Получатель: {approval_event.approver.email}
      Тема письма: НАПОМИНАНИЕ: Требуется подтверждение
      Сообщение: Вы не ответили на запрос подтверждения
```
