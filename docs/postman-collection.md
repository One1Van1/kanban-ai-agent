# 📡 Postman коллекция для тестирования AI агента

## 🚀 Быстрый старт

Импортируйте эту коллекцию в Postman для тестирования всех эндпоинтов.

## 📋 Переменные окружения

Создайте в Postman окружение со следующими переменными:

```json
{
  "baseUrl": "http://localhost:3000",
  "jiraHost": "your-company.atlassian.net",
  "jiraEmail": "your-email@company.com",
  "jiraToken": "your-api-token",
  "projectKey": "TEST",
  "agentId": "",
  "taskId": ""
}
```

## 🧪 1. Создание AI агента

### POST {{baseUrl}}/ai-agent

```json
{
  "name": "Тестовый AI агент для стрижек",
  "description": "Агент для автоматической обработки задач по стрижкам",
  "type": "hairdressing_processor",
  "configuration": {
    "model": "claude-3-sonnet",
    "temperature": 0.7,
    "maxTokens": 4000,
    "systemPrompt": "Ты - опытный стилист-парикмахер. Анализируй фотографии стрижек и давай профессиональные рекомендации."
  },
  "capabilities": [
    "photo_analysis",
    "comment_generation",
    "task_transition",
    "context_extraction"
  ]
}
```

**Сохраните** `agentId` из ответа в переменную Postman.

---

## 🔧 2. Настройка инструкций для колонки

### POST {{baseUrl}}/ai-agent/configure-column-instructions

```json
{
  "agentId": "{{agentId}}",
  "columnId": "in-progress",
  "columnName": "В работе",
  "instructions": {
    "trigger": "on_task_enter",
    "actions": [
      {
        "type": "analyze_photos",
        "description": "Проанализируй все прикрепленные фотографии стрижек"
      },
      {
        "type": "add_comment",
        "template": "Анализ фотографий:\n\n{photo_analysis}\n\nРекомендации:\n{recommendations}\n\nОценка качества: {quality_score}/10"
      },
      {
        "type": "set_assignee",
        "condition": "if quality_score < 7",
        "assignee": "senior_stylist"
      }
    ],
    "context_sources": [
      "task_description",
      "attachments",
      "related_tasks",
      "client_history"
    ]
  }
}
```

---

## 🎯 3. Привязка агента к задаче

### POST {{baseUrl}}/ai-agent/track-agent-in-task

```json
{
  "agentId": "{{agentId}}",
  "taskId": "{{taskId}}",
  "projectKey": "{{projectKey}}",
  "trackingOptions": {
    "watchColumns": ["to-do", "in-progress", "review"],
    "autoExecute": true,
    "notifyOnAction": true
  }
}
```

---

## 📊 4. Получение задачи из Jira

### GET {{baseUrl}}/jira/task/{{taskId}}

**Headers:**

```
Content-Type: application/json
```

**Ожидаемый ответ:**

```json
{
  "id": "HAIR-123",
  "key": "HAIR-123",
  "summary": "Стрижка каскад для клиента Анны",
  "description": "Клиент просит сделать каскадную стрижку средней длины",
  "status": "To Do",
  "assignee": "stylist@salon.com",
  "attachments": [
    {
      "id": "att_001",
      "filename": "reference_photo.jpg",
      "mimeType": "image/jpeg",
      "url": "https://..."
    }
  ],
  "customFields": {
    "clientPhone": "+7-999-123-45-67",
    "preferredTime": "14:00",
    "hairType": "thick"
  }
}
```

---

## 🔄 5. Получение переходов задачи

### GET {{baseUrl}}/jira/task/{{taskId}}/transitions

**Ожидаемый ответ:**

```json
{
  "transitions": [
    {
      "id": "11",
      "name": "В работу",
      "to": {
        "id": "3",
        "name": "In Progress"
      }
    },
    {
      "id": "21",
      "name": "На проверку",
      "to": {
        "id": "4",
        "name": "Review"
      }
    }
  ]
}
```

---

## 📝 6. Добавление комментария

### POST {{baseUrl}}/jira/task/{{taskId}}/comment

```json
{
  "comment": "🤖 **AI Анализ фотографии:**\n\n**Тип стрижки:** Каскад\n**Длина:** Средняя (до плеч)\n**Техника:** Слоистая стрижка с филировкой\n\n**Рекомендации:**\n✅ Использовать технику \"слайсинг\"\n✅ Сделать мягкую градуировку\n✅ Добавить текстуру филировочными ножницами\n\n**Время выполнения:** 45-60 минут\n**Уровень сложности:** Средний\n\n*Анализ выполнен AI агентом в {{$timestamp}}*"
}
```

---

## 📎 7. Прикрепление файла

### POST {{baseUrl}}/jira/task/{{taskId}}/attachment

**Body:** form-data

- **file:** [выберите файл с фотографией]

---

## 🔍 8. Поиск задач

### POST {{baseUrl}}/jira/search

```json
{
  "jql": "project = {{projectKey}} AND status = \"In Progress\" AND created >= -7d",
  "maxResults": 20,
  "fields": ["summary", "status", "assignee", "created", "attachment"]
}
```

---

## 🚀 9. Перемещение задачи

### PUT {{baseUrl}}/jira/task/{{taskId}}/move

```json
{
  "transitionId": "11",
  "comment": "Задача перемещена AI агентом после анализа фотографий",
  "assignee": "senior_stylist@salon.com",
  "fields": {
    "customfield_10001": "Требует дополнительной консультации"
  }
}
```

---

## 📈 10. Получение активности агента

### GET {{baseUrl}}/ai-agent/activity/{{agentId}}

**Query params:**

- `from`: 2024-01-01
- `to`: 2024-12-31
- `limit`: 50

**Ожидаемый ответ:**

```json
{
  "agentId": "agent_123",
  "totalActions": 45,
  "period": {
    "from": "2024-01-01",
    "to": "2024-12-31"
  },
  "activities": [
    {
      "timestamp": "2024-01-15T10:30:00Z",
      "taskId": "HAIR-123",
      "action": "photo_analysis",
      "status": "completed",
      "details": {
        "photosAnalyzed": 3,
        "qualityScore": 8.5,
        "recommendations": "Использовать технику каскада..."
      }
    }
  ],
  "statistics": {
    "successRate": 98.5,
    "averageProcessingTime": "15s",
    "mostCommonAction": "photo_analysis"
  }
}
```

---

## 🔔 11. Webhook для тестирования

### POST {{baseUrl}}/jira/webhook

```json
{
  "timestamp": "{{$timestamp}}",
  "webhookEvent": "jira:issue_updated",
  "issue_event_type_name": "issue_generic",
  "issue": {
    "id": "123456",
    "key": "{{taskId}}",
    "fields": {
      "summary": "Стрижка каскад для клиента Анны",
      "status": {
        "id": "3",
        "name": "In Progress"
      },
      "assignee": {
        "emailAddress": "stylist@salon.com"
      },
      "project": {
        "key": "{{projectKey}}"
      }
    }
  },
  "changelog": {
    "items": [
      {
        "field": "status",
        "fromString": "To Do",
        "toString": "In Progress"
      }
    ]
  }
}
```

---

## ⚕️ 12. Health Check

### GET {{baseUrl}}/jira/health

**Ожидаемый ответ:**

```json
{
  "status": "healthy",
  "jira": {
    "connected": true,
    "responseTime": "150ms",
    "lastCheck": "2024-01-15T10:30:00Z"
  },
  "aiAgent": {
    "status": "active",
    "model": "claude-3-sonnet",
    "responseTime": "2.5s"
  },
  "database": {
    "connected": true,
    "migrations": "up-to-date"
  }
}
```

---

## 🧪 Полный сценарий тестирования

### Выполните запросы в следующем порядке:

1. **Health Check** → проверка системы
2. **Создание агента** → сохранить `agentId`
3. **Настройка инструкций** → конфигурация поведения
4. **Создание задачи в Jira UI** → получить `taskId`
5. **Привязка агента к задаче** → активация отслеживания
6. **Получение задачи** → проверка интеграции
7. **Webhook (симуляция)** → тестирование автоматизации
8. **Проверка активности** → результаты работы

### Ожидаемые результаты:

- ✅ Все запросы возвращают статус 200/201
- ✅ Агент создан и настроен
- ✅ Webhook обрабатывается корректно
- ✅ Комментарии добавляются в Jira
- ✅ Активность логируется

---

## 🎭 Дополнительные сценарии

### Тест с фотографиями

1. Создайте задачу в Jira
2. Прикрепите фотографию стрижки
3. Переместите в колонку "In Progress"
4. Проверьте автоматический комментарий AI

### Тест ошибочных ситуаций

- Несуществующий `taskId`
- Неверный `agentId`
- Недоступная Jira
- Некорректные права доступа

### Performance тест

- Создание 10+ агентов
- Обработка 50+ задач одновременно
- Мониторинг времени отклика
