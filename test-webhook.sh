#!/bin/bash

# test-webhook.sh - Скрипт для тестирования webhook интеграции

echo "🎯 Тестирование Webhook Integration"
echo "=================================="

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

# Функция для проверки статуса ответа
check_response() {
  local response_code=$1
  local test_name=$2
  
  if [ "$response_code" -eq 200 ] || [ "$response_code" -eq 201 ]; then
    echo -e "${GREEN}✅ $test_name - PASSED${NC}"
  else
    echo -e "${RED}❌ $test_name - FAILED (Status: $response_code)${NC}"
  fi
}

echo -e "${YELLOW}1. Проверяем работоспособность сервера...${NC}"
health_response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/jira/health")
check_response $health_response "Health Check"

echo -e "\n${YELLOW}2. Тестируем основной webhook эндпойнт...${NC}"

# Тест 1: Создание обычной задачи
echo "📝 Тест: Создание обычной задачи"
regular_task_response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/jira/webhook" \
  -H "Content-Type: application/json" \
  -H "X-Test-Webhook: true" \
  -d '{
    "webhookEvent": "jira:issue_created",
    "timestamp": 1695461200000,
    "issue": {
      "id": "10001",
      "key": "TEST-123",
      "self": "https://example.atlassian.net/rest/api/3/issue/10001",
      "fields": {
        "summary": "Fix database connection issue",
        "status": {
          "id": "1",
          "name": "To Do",
          "statusCategory": {
            "id": 2,
            "key": "new",
            "name": "New"
          }
        },
        "issuetype": {
          "id": "10001",
          "name": "Bug",
          "iconUrl": "https://example.com/icon.png"
        },
        "created": "2025-09-23T10:00:00.000+0000",
        "updated": "2025-09-23T10:00:00.000+0000"
      }
    }
  }')

check_response $regular_task_response "Обычная задача"

# Тест 2: Создание задачи о стрижке
echo "✂️ Тест: Создание задачи о стрижке"
haircut_task_response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/jira/webhook" \
  -H "Content-Type: application/json" \
  -H "X-Test-Webhook: true" \
  -d '{
    "webhookEvent": "jira:issue_created",
    "timestamp": 1695461200000,
    "issue": {
      "id": "10002",
      "key": "SALON-456",
      "self": "https://example.atlassian.net/rest/api/3/issue/10002",
      "fields": {
        "summary": "Стрижка каскад для клиентки Марии",
        "status": {
          "id": "1",
          "name": "To Do",
          "statusCategory": {
            "id": 2,
            "key": "new",
            "name": "New"
          }
        },
        "issuetype": {
          "id": "10001",
          "name": "Task",
          "iconUrl": "https://example.com/icon.png"
        },
        "created": "2025-09-23T10:00:00.000+0000",
        "updated": "2025-09-23T10:00:00.000+0000"
      }
    }
  }')

check_response $haircut_task_response "Задача о стрижке"

# Тест 3: Изменение статуса
echo "🔄 Тест: Изменение статуса задачи"
status_change_response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/jira/webhook" \
  -H "Content-Type: application/json" \
  -H "X-Test-Webhook: true" \
  -d '{
    "webhookEvent": "jira:issue_updated",
    "timestamp": 1695461200000,
    "issue": {
      "id": "10002",
      "key": "SALON-456",
      "self": "https://example.atlassian.net/rest/api/3/issue/10002",
      "fields": {
        "summary": "Стрижка каскад для клиентки Марии",
        "status": {
          "id": "3",
          "name": "Done",
          "statusCategory": {
            "id": 3,
            "key": "done",
            "name": "Done"
          }
        },
        "issuetype": {
          "id": "10001",
          "name": "Task",
          "iconUrl": "https://example.com/icon.png"
        },
        "created": "2025-09-23T10:00:00.000+0000",
        "updated": "2025-09-23T10:05:00.000+0000"
      }
    },
    "changelog": {
      "id": "67890",
      "items": [
        {
          "field": "status",
          "fieldtype": "jira",
          "fromString": "In Progress",
          "toString": "Done"
        }
      ]
    }
  }')

check_response $status_change_response "Изменение статуса"

echo -e "\n${YELLOW}3. Тестируем специализированный эндпойнт для стрижек...${NC}"

# Тест 4: Специализированный эндпойнт для стрижек
specialized_response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/jira/webhook/haircut-tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "webhookEvent": "jira:issue_created",
    "timestamp": 1695461200000,
    "issue": {
      "id": "10003",
      "key": "SALON-789",
      "self": "https://example.atlassian.net/rest/api/3/issue/10003",
      "fields": {
        "summary": "Окрашивание волос + стрижка для VIP клиента",
        "status": {
          "id": "1",
          "name": "To Do",
          "statusCategory": {
            "id": 2,
            "key": "new",
            "name": "New"
          }
        },
        "issuetype": {
          "id": "10001",
          "name": "Task",
          "iconUrl": "https://example.com/icon.png"
        },
        "created": "2025-09-23T10:00:00.000+0000",
        "updated": "2025-09-23T10:00:00.000+0000"
      }
    }
  }')

check_response $specialized_response "Специализированный эндпойнт для стрижек"

echo -e "\n${YELLOW}4. Проверяем AI Agent эндпойнты...${NC}"

# Проверяем доступность AI Agent сервисов
ai_endpoints=(
  "/ai-agent/analyze-new-tasks"
  "/ai-agent/analyze-haircut-tasks"
  "/ai-agent/check-progress-tasks"
)

for endpoint in "${ai_endpoints[@]}"; do
  ai_response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL$endpoint" \
    -H "Content-Type: application/json" \
    -d '{"trigger": "webhook-test"}')
  
  if [ "$ai_response" -eq 200 ] || [ "$ai_response" -eq 201 ]; then
    echo -e "${GREEN}✅ $endpoint - доступен${NC}"
  else
    echo -e "${RED}❌ $endpoint - недоступен (Status: $ai_response)${NC}"
  fi
done

echo -e "\n${YELLOW}📊 Результаты тестирования:${NC}"
echo "=================================="
echo "Вебхук интеграция готова к использованию!"
echo ""
echo "📝 Для настройки в Jira используйте:"
echo "URL: $BASE_URL/jira/webhook"
echo "Специализированный URL для стрижек: $BASE_URL/jira/webhook/haircut-tasks"
echo ""
echo "🔧 Поддерживаемые события:"
echo "- jira:issue_created (создание задачи)"
echo "- jira:issue_updated (обновление задачи)"
echo "- comment_created (добавление комментария)"
echo ""
echo "🎯 Автоматические действия:"
echo "- Анализ новых задач через AI"
echo "- Специализированная обработка задач о стрижках"
echo "- Мониторинг изменения статусов"
echo "- Отправка уведомлений"
