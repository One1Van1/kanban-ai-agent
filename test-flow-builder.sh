#!/bin/bash

echo "🧪 Тестирование Flow Builder API..."

# Test Flow Definition
FLOW_DATA='{
  "flowDefinition": {
    "id": "test-flow-001",
    "name": "Тестовый Flow для проверки",
    "description": "Проверяем все новые возможности Flow Builder",
    "triggers": [
      {
        "type": "board_move",
        "config": {
          "boardId": "test-board",
          "targetColumn": "In Review"
        }
      }
    ],
    "blocks": [
      {
        "id": "block-1",
        "type": "extract_files",
        "config": {
          "fileTypes": ["pdf", "docx"],
          "analysisType": "извлеки ключевую информацию"
        }
      },
      {
        "id": "block-2", 
        "type": "ai_request",
        "config": {
          "prompt": "Проанализируй документы на предмет технической сложности"
        }
      },
      {
        "id": "block-3",
        "type": "if_condition",
        "config": {
          "condition": "сложность > 5",
          "thenAction": "отправь уведомление тимлиду",
          "elseAction": "добавь в обычную очередь"
        }
      },
      {
        "id": "block-4",
        "type": "move_card",
        "config": {
          "targetColumn": "Ready for Development"
        }
      }
    ],
    "edges": [
      {
        "id": "edge-1",
        "source": "block-1",
        "target": "block-2"
      },
      {
        "id": "edge-2", 
        "source": "block-2",
        "target": "block-3"
      },
      {
        "id": "edge-3",
        "source": "block-3", 
        "target": "block-4"
      }
    ]
  }
}'

echo "📤 Отправляем Flow на бэкенд..."

# Send POST request
RESPONSE=$(curl -s -X POST http://localhost:3000/ai-agent/flow-builder/save-flow \
  -H "Content-Type: application/json" \
  -d "$FLOW_DATA")

echo "📥 Ответ от сервера:"
echo "$RESPONSE" | jq '.'

# Check if response contains expected fields
if echo "$RESPONSE" | jq -e '.success' > /dev/null; then
  echo "✅ Тест прошел успешно!"
  
  # Extract flowId and agent info
  FLOW_ID=$(echo "$RESPONSE" | jq -r '.flowId')
  AGENT_ID=$(echo "$RESPONSE" | jq -r '.createdAgent.id') 
  
  echo "🎯 Созданный Flow ID: $FLOW_ID"
  echo "🤖 Созданный Agent ID: $AGENT_ID"
  
  echo ""
  echo "📋 Проверяем созданные инструкции:"
  echo "$RESPONSE" | jq -r '.createdAgent.name'
  
else
  echo "❌ Тест не прошел!"
  echo "Ошибка в ответе сервера"
fi

echo ""
echo "🏁 Тестирование завершено!"