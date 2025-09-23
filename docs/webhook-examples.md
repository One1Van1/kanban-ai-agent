# 🎯 Примеры использования Webhook Integration

## 1. Базовая настройка вебхука в Jira

### Создание вебхука через Jira UI

1. Перейдите в **Jira Administration** → **System** → **Webhooks**
2. Нажмите **Create a Webhook**
3. Заполните форму:

```
Name: AI Agent Webhook
URL: https://your-domain.com/jira/webhook
Events:
☑️ Issue created
☑️ Issue updated
☑️ Issue deleted
☑️ Comment created

Secret: your-webhook-secret-123
```

### Создание через REST API

```bash
curl -X POST \
  https://your-domain.atlassian.net/rest/webhooks/1.0/webhook \
  -H "Authorization: Basic $(echo -n email:token | base64)" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AI Agent Webhook",
    "url": "https://your-server.com/jira/webhook",
    "events": [
      "jira:issue_created",
      "jira:issue_updated",
      "comment_created"
    ],
    "filters": {
      "issue-related-events-section": "project = YOUR_PROJECT"
    }
  }'
```

## 2. Тестирование вебхуков

### Создание тестовой задачи о стрижке

```bash
# Создаем задачу в Jira, которая автоматически запустит AI анализ
curl -X POST \
  https://your-domain.atlassian.net/rest/api/3/issue \
  -H "Authorization: Basic $(echo -n email:token | base64)" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "project": {
        "key": "SALON"
      },
      "summary": "Стрижка для клиентки Анны - каскад средней длины",
      "description": "Клиентка просит сделать стрижку каскад на волосы средней длины. Предпочитает классический стиль.",
      "issuetype": {
        "name": "Task"
      }
    }
  }'
```

### Ожидаемый результат:

1. Jira отправит вебхук в ваше приложение
2. AI агент автоматически проанализирует задачу
3. Задача будет классифицирована как "задача о стрижке"
4. Запустится специализированный анализ для парикмахерских услуг

## 3. Симуляция вебхуков для разработки

### Мокирование вебхука создания задачи

```javascript
// mock-webhook-sender.js
const axios = require('axios');

const mockWebhookPayload = {
  webhookEvent: 'jira:issue_created',
  timestamp: Date.now(),
  user: {
    accountId: '123456',
    displayName: 'Test User',
    emailAddress: 'test@example.com',
  },
  issue: {
    id: '10001',
    key: 'SALON-123',
    self: 'https://example.atlassian.net/rest/api/3/issue/10001',
    fields: {
      summary: 'Окрашивание волос в блонд для Марии',
      description: 'Клиентка хочет кардинально изменить цвет волос',
      status: {
        id: '1',
        name: 'To Do',
        statusCategory: {
          id: 2,
          key: 'new',
          name: 'New',
        },
      },
      issuetype: {
        id: '10001',
        name: 'Task',
        iconUrl: 'https://example.com/icon.png',
      },
      created: '2025-09-23T10:00:00.000+0000',
      updated: '2025-09-23T10:00:00.000+0000',
    },
  },
};

async function sendMockWebhook() {
  try {
    const response = await axios.post(
      'http://localhost:3000/jira/webhook',
      mockWebhookPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Test-Webhook': 'true',
        },
      },
    );

    console.log('Webhook sent successfully:', response.data);
  } catch (error) {
    console.error('Webhook failed:', error.response?.data || error.message);
  }
}

sendMockWebhook();
```

### Запуск мок-вебхука

```bash
node mock-webhook-sender.js
```

## 4. Автоматизация рабочего процесса

### Скрипт для автоматического создания и отслеживания задач

```bash
#!/bin/bash

# create-and-track-task.sh

JIRA_URL="https://your-domain.atlassian.net"
AUTH_HEADER="Authorization: Basic $(echo -n $JIRA_EMAIL:$JIRA_TOKEN | base64)"

echo "🎯 Создаем новую задачу о стрижке..."

# Создаем задачу
ISSUE_RESPONSE=$(curl -s -X POST \
  "$JIRA_URL/rest/api/3/issue" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "project": {"key": "SALON"},
      "summary": "Комплексная стрижка + окрашивание для VIP клиента",
      "description": "VIP клиент заказал полный комплекс услуг: стрижка боб-каре + мелирование",
      "issuetype": {"name": "Task"},
      "priority": {"name": "High"}
    }
  }')

ISSUE_KEY=$(echo $ISSUE_RESPONSE | jq -r '.key')
echo "✅ Создана задача: $ISSUE_KEY"

# Ждем обработки вебхука
echo "⏳ Ждем автоматической обработки AI агентом (5 секунд)..."
sleep 5

# Проверяем результат AI анализа
echo "🔍 Проверяем результат AI анализа..."
curl -s "http://localhost:3000/ai-agent/analyze-haircut-tasks" | jq

# Переводим задачу в работу
echo "🚀 Переводим задачу в статус 'В работе'..."
curl -s -X POST \
  "$JIRA_URL/rest/api/3/issue/$ISSUE_KEY/transitions" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d '{
    "transition": {"id": "21"}
  }'

echo "✅ Задача $ISSUE_KEY переведена в работу"
```

## 5. Мониторинг и диагностика

### Проверка состояния вебхук обработчика

```bash
#!/bin/bash

echo "=== Webhook Handler Health Check ==="

# Основная проверка
health=$(curl -s http://localhost:3000/jira/health)
echo "Jira Integration Status: $(echo $health | jq -r '.status')"

# Проверка логов последних вебхуков
echo -e "\n=== Recent Webhook Processing ==="
curl -s http://localhost:3000/api/webhook-logs?limit=5 | jq '.logs[] | {
  timestamp: .timestamp,
  event: .webhookEvent,
  issueKey: .issueKey,
  status: .status,
  actions: .triggeredActions
}'

# Статистика обработки
echo -e "\n=== Webhook Statistics ==="
curl -s http://localhost:3000/api/webhook-stats | jq '{
  totalProcessed: .totalProcessed,
  successRate: .successRate,
  avgProcessingTime: .avgProcessingTime,
  topEvents: .topEvents
}'
```

## 6. Интеграция с внешними системами

### Webhook для интеграции с Slack

```javascript
// slack-integration.js
const { WebClient } = require('@slack/web-api');
const express = require('express');

const slack = new WebClient(process.env.SLACK_TOKEN);
const app = express();

app.use(express.json());

// Прослушивание вебхуков от AI агента
app.post('/webhook/ai-agent-results', async (req, res) => {
  const { issueKey, analysis, recommendations } = req.body;

  if (analysis.isHaircutTask && analysis.confidence > 0.8) {
    // Отправляем уведомление в Slack канал мастеров
    await slack.chat.postMessage({
      channel: '#hair-masters',
      text: `🎯 Новая задача о стрижке: ${issueKey}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Новая задача о стрижке готова к анализу*\n*Задача:* ${issueKey}\n*Уверенность AI:* ${(analysis.confidence * 100).toFixed(1)}%`,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Рекомендованный мастер:* ${recommendations.suggestedMaster || 'Не определен'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Время выполнения:* ${recommendations.estimatedDuration || 'Не указано'}`,
            },
          ],
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Открыть в Jira',
              },
              url: `https://your-domain.atlassian.net/browse/${issueKey}`,
            },
          ],
        },
      ],
    });
  }

  res.status(200).send('OK');
});

app.listen(3001, () => {
  console.log('Slack integration webhook listening on port 3001');
});
```

### Webhook для обновления внешней CRM системы

```python
# crm_integration.py
import requests
import json
from flask import Flask, request

app = Flask(__name__)

@app.route('/webhook/crm-update', methods=['POST'])
def update_crm():
    data = request.get_json()

    if data.get('webhookEvent') == 'jira:issue_updated':
        issue = data.get('issue', {})
        issue_key = issue.get('key')
        status = issue.get('fields', {}).get('status', {}).get('name')

        # Если задача о стрижке завершена
        if 'стрижка' in issue.get('fields', {}).get('summary', '').lower() and status == 'Done':
            # Обновляем CRM
            crm_data = {
                'client_id': extract_client_id(issue_key),
                'service_completed': True,
                'completion_date': data.get('timestamp'),
                'service_type': 'haircut'
            }

            response = requests.post(
                'https://your-crm.com/api/services/complete',
                json=crm_data,
                headers={'Authorization': f'Bearer {CRM_API_TOKEN}'}
            )

            if response.status_code == 200:
                print(f"✅ CRM updated for {issue_key}")
            else:
                print(f"❌ Failed to update CRM for {issue_key}")

    return {'status': 'processed'}, 200

def extract_client_id(issue_key):
    # Логика извлечения ID клиента из ключа задачи
    return issue_key.split('-')[1]

if __name__ == '__main__':
    app.run(port=3002)
```

## 7. Продвинутые сценарии

### Каскадная обработка вебхуков

```javascript
// webhook-cascade.js
const axios = require('axios');
const express = require('express');

const app = express();
app.use(express.json());

// Основной обработчик
app.post('/webhook/master-handler', async (req, res) => {
  const payload = req.body;

  try {
    // 1. Базовая обработка в AI агенте
    const aiResponse = await axios.post(
      'http://localhost:3000/jira/webhook',
      payload,
    );

    // 2. Если это задача о стрижке, запускаем дополнительные процессы
    if (aiResponse.data.triggeredActions.includes('haircut-analysis')) {
      // Параллельно запускаем несколько процессов
      await Promise.all([
        // Обновление календаря мастеров
        axios.post('http://localhost:3003/calendar/update', {
          issueKey: payload.issue.key,
          eventType: 'haircut_scheduled',
        }),

        // Отправка SMS клиенту
        axios.post('http://localhost:3004/sms/send', {
          phone: extractClientPhone(payload),
          message: 'Ваша запись на стрижку подтверждена!',
        }),

        // Обновление системы лояльности
        axios.post('http://localhost:3005/loyalty/update', {
          clientId: extractClientId(payload),
          points: 50,
        }),
      ]);
    }

    res.status(200).json({
      success: true,
      processedBy: 'master-handler',
      cascadeActions: ['ai-agent', 'calendar', 'sms', 'loyalty'],
    });
  } catch (error) {
    console.error('Cascade processing failed:', error.message);
    res.status(500).json({ error: 'Cascade processing failed' });
  }
});

function extractClientPhone(payload) {
  // Логика извлечения телефона из описания задачи
  const description = payload.issue?.fields?.description || '';
  const phoneMatch = description.match(/\+7\d{10}/);
  return phoneMatch ? phoneMatch[0] : null;
}

function extractClientId(payload) {
  // Логика извлечения ID клиента
  return payload.issue?.key?.split('-')[1] || null;
}

app.listen(3010, () => {
  console.log('Master webhook handler listening on port 3010');
});
```

### Webhook с retry логикой

```typescript
// robust-webhook-handler.ts
import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';

@Injectable()
export class RobustWebhookHandler {
  private readonly logger = new Logger(RobustWebhookHandler.name);
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 секунда

  async processWithRetry(payload: any, attempt: number = 1): Promise<void> {
    try {
      await this.processWebhook(payload);
      this.logger.log(`Webhook processed successfully on attempt ${attempt}`);
    } catch (error) {
      if (attempt < this.maxRetries) {
        this.logger.warn(
          `Webhook processing failed on attempt ${attempt}, retrying in ${this.retryDelay}ms...`,
        );

        await this.delay(this.retryDelay * attempt); // Exponential backoff
        return this.processWithRetry(payload, attempt + 1);
      } else {
        this.logger.error(
          `Webhook processing failed after ${this.maxRetries} attempts: ${error.message}`,
        );

        // Отправляем в dead letter queue или систему алертов
        await this.sendToDeadLetterQueue(payload, error);
        throw error;
      }
    }
  }

  private async processWebhook(payload: any): Promise<void> {
    // Основная логика обработки
    const response = await axios.post(
      'http://localhost:3000/ai-agent/analyze-new-tasks',
      {
        trigger: 'webhook',
        payload,
      },
    );

    if (response.status !== 200) {
      throw new Error(`AI service returned status ${response.status}`);
    }
  }

  private async sendToDeadLetterQueue(
    payload: any,
    error: Error,
  ): Promise<void> {
    // Отправка в систему для ручной обработки
    await axios.post('http://localhost:3000/admin/failed-webhooks', {
      payload,
      error: error.message,
      timestamp: new Date().toISOString(),
      attempts: this.maxRetries,
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

## 8. Мониторинг и метрики

### Дашборд для мониторинга вебхуков

```javascript
// webhook-dashboard.js
const express = require('express');
const app = express();

// Хранилище метрик (в продакшене используйте Redis/InfluxDB)
const metrics = {
  totalWebhooks: 0,
  successfulWebhooks: 0,
  failedWebhooks: 0,
  processingTimes: [],
  eventTypes: {},
  haircutTasks: 0,
};

app.get('/dashboard', (req, res) => {
  const successRate =
    metrics.totalWebhooks > 0
      ? ((metrics.successfulWebhooks / metrics.totalWebhooks) * 100).toFixed(2)
      : 0;

  const avgProcessingTime =
    metrics.processingTimes.length > 0
      ? metrics.processingTimes.reduce((a, b) => a + b, 0) /
        metrics.processingTimes.length
      : 0;

  res.json({
    overview: {
      totalWebhooks: metrics.totalWebhooks,
      successRate: `${successRate}%`,
      avgProcessingTime: `${avgProcessingTime.toFixed(2)}ms`,
      haircutTasks: metrics.haircutTasks,
    },
    eventTypes: metrics.eventTypes,
    recentProcessingTimes: metrics.processingTimes.slice(-10),
  });
});

// Эндпойнт для обновления метрик
app.post('/metrics/update', express.json(), (req, res) => {
  const { success, processingTime, eventType, isHaircutTask } = req.body;

  metrics.totalWebhooks++;

  if (success) {
    metrics.successfulWebhooks++;
  } else {
    metrics.failedWebhooks++;
  }

  if (processingTime) {
    metrics.processingTimes.push(processingTime);
    // Храним только последние 100 значений
    if (metrics.processingTimes.length > 100) {
      metrics.processingTimes.shift();
    }
  }

  if (eventType) {
    metrics.eventTypes[eventType] = (metrics.eventTypes[eventType] || 0) + 1;
  }

  if (isHaircutTask) {
    metrics.haircutTasks++;
  }

  res.json({ updated: true });
});

app.listen(3020, () => {
  console.log('Webhook dashboard available at http://localhost:3020/dashboard');
});
```

## Заключение

Эти примеры демонстрируют всю мощь вебхук интеграции:

1. **Мгновенная реакция** на события в Jira
2. **Автоматическая классификация** задач о стрижках
3. **Каскадная обработка** для сложных бизнес-процессов
4. **Надежность** с retry логикой и обработкой ошибок
5. **Мониторинг** и метрики для контроля качества

Вебхуки превращают ваш AI агент из реактивной системы в проактивную, обеспечивая мгновенную автоматизацию рабочих процессов салона красоты.
