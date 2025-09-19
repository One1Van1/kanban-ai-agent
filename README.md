# 🤖 Kanban AI Agent

Автоматизированная система для выполнения задач из канбана с помощью AI агента.

## 🎯 Описание

Система автоматически анализирует новые задачи в Jira с помощью Claude AI и принимает решения о переносе их в соответствующие колонки канбан-доски:

- **Questions** - задачи, требующие дополнительных уточнений
- **In Progress** - задачи, готовые к выполнению

## 🏗️ Архитектура

```
Jira Webhook → WebhookModule → AIAnalysisModule → KanbanModule → Jira API
```

### Модули

- **WebhookModule** - прием webhook'ов от Jira
- **AIAnalysisModule** - анализ задач через Claude AI
- **KanbanModule** - обновление статусов в Jira
- **ConfigModule** - конфигурация приложения

## 🚀 Технологии

- **Backend:** NestJS + TypeScript
- **AI:** Anthropic Claude API
- **Kanban:** Jira REST API v3
- **Package Manager:** Yarn
- **Validation:** class-validator + class-transformer

## ⚙️ Установка

## ⚙️ Установка

```bash
# Клонировать репозиторий
git clone <repository-url>
cd kanban_ai_agent

# Установить зависимости
yarn install

# Настроить environment переменные
cp .env.example .env
# Отредактировать .env файл с вашими API keys
```

## 🔧 Конфигурация

Создайте `.env` файл с следующими переменными:

```env
# Настройки приложения
PORT=3000
NODE_ENV=development

# Claude AI API
CLAUDE_API_KEY=your_claude_api_key_here
CLAUDE_MODEL=claude-3-sonnet-20240229

# Jira API
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your_jira_api_token

# Webhook безопасность (опционально)
WEBHOOK_SECRET=your_webhook_secret
```

## 🚀 Запуск

```bash
# Development режим
yarn start:dev

# Production режим
yarn build
yarn start:prod
```

## 📡 API Endpoints

### POST /webhook/jira

Принимает webhook'и от Jira при создании новых задач.

**Пример запроса:**

```bash
curl -X POST http://localhost:3000/webhook/jira \
  -H "Content-Type: application/json" \
  -d '{
    "webhookEvent": "jira:issue_created",
    "issue": {
      "key": "PROJ-123",
      "fields": {
        "summary": "Заголовок задачи",
        "description": "Описание задачи"
      }
    }
  }'
```

## 🧪 Тестирование

```bash
# Unit тесты
yarn test

# E2E тесты
yarn test:e2e

# Покрытие кода
yarn test:cov
```

## 📁 Структура проекта

```
src/
├── ai-analysis/          # AI анализ задач (Claude)
├── config/              # Конфигурация приложения
├── dto/                 # Data Transfer Objects
├── kanban/              # Jira API интеграция
├── types/               # TypeScript типы и enums
├── webhook/             # Webhook endpoints
└── main.ts              # Точка входа приложения
```

## 🔄 Workflow

1. **Jira создает новую задачу** → отправляет webhook
2. **WebhookModule** получает и валидирует данные
3. **AIAnalysisModule** анализирует задачу через Claude
4. **KanbanModule** обновляет статус в Jira на основе AI решения

## 📊 Статус разработки

- ✅ **WebhookModule** - готов
- ✅ **AIAnalysisModule** - готов
- ✅ **KanbanModule** - готов
- ✅ **Полная интеграция** - завершена

## 🤝 Поддержка

Если у вас есть вопросы или предложения, создайте issue в репозитории.

## 📄 Лицензия

MIT License

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
