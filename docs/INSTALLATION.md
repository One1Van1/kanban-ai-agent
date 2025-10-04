# Установка и настройка 🛠️

Подробное руководство по развёртыванию Kanban AI Agent.

## 📋 Требования

### Системные требования

- **Node.js** >= 18.0.0
- **yarn** >= 1.22.0
- **ngrok** для webhook (или другой туннель)

### Внешние сервисы

- **Jira Cloud** с правами администратора
- **OpenRouter API** ключ для Claude 3.5 Sonnet

## ⚙️ Установка

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd kanban_ai_agent
```

### 2. Установка зависимостей

```bash
yarn install
```

### 3. Настройка переменных окружения

Скопируйте файл примера:

```bash
cp .env.example .env
```

Отредактируйте `.env` файл:

```env
# Jira Configuration
JIRA_HOST=https://your-domain.atlassian.net
JIRA_USERNAME=your-email@domain.com
JIRA_API_TOKEN=your-jira-api-token
JIRA_PROJECT_KEY=KAN

# Claude API Configuration
OPENROUTER_API_KEY=your-openrouter-api-key
CLAUDE_MODEL=anthropic/claude-3.5-sonnet

# Application Configuration
PORT=3000
NODE_ENV=development
```

## 🔑 Получение API ключей

### Jira API Token

1. Перейдите в [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Нажмите **"Create API token"**
3. Введите название (например, "Kanban AI Agent")
4. Скопируйте сгенерированный токен
5. Добавьте в `.env` как `JIRA_API_TOKEN`

### OpenRouter API Key

1. Зарегистрируйтесь на [OpenRouter.ai](https://openrouter.ai/)
2. Перейдите в [API Keys](https://openrouter.ai/keys)
3. Создайте новый ключ
4. Пополните баланс для использования Claude
5. Добавьте в `.env` как `OPENROUTER_API_KEY`

## 🚀 Запуск приложения

### Development режим

```bash
yarn start:dev
```

Приложение будет доступно на `http://localhost:3000`

### Production режим

```bash
yarn build
yarn start:prod
```

### Проверка работы

```bash
# Проверка здоровья приложения
curl http://localhost:3000

# Проверка Jira подключения
curl http://localhost:3000/jira/health

# Проверка Claude webhook
curl http://localhost:3000/jira/process-webhook-before-after/health
```

## 🔗 Настройка ngrok

Для получения webhook от Jira нужен публичный URL:

### 1. Установка ngrok

```bash
# macOS
brew install ngrok

# или скачайте с https://ngrok.com/download
```

### 2. Запуск туннеля

```bash
ngrok http 3000
```

Получите URL вида: `https://abc123.ngrok-free.app`

### 3. Обновление webhook в Jira

См. подробные инструкции в [WEBHOOK-SETUP.md](WEBHOOK-SETUP.md)

## 📁 Структура проекта

```
kanban_ai_agent/
├── src/                           # Исходный код
│   ├── jira/                      # Jira интеграция
│   │   ├── process-webhook-before-after/  # Claude webhook
│   │   ├── get-task/              # API эндпоинты
│   │   └── ...
│   ├── photo-analysis-agent/      # Claude анализ фото
│   ├── ai-reporting-agent/        # Генерация отчётов
│   └── config/                    # Конфигурация
├── docs/                          # Документация
├── jira-documentations/           # Техническое API
├── .env                           # Переменные окружения
└── package.json                   # Зависимости
```

## 🔧 Настройка конфигурации

### Изменение модели Claude

В `.env` файле можно изменить модель:

```env
# Доступные модели
CLAUDE_MODEL=anthropic/claude-3.5-sonnet      # Рекомендуется
CLAUDE_MODEL=anthropic/claude-3-opus          # Более мощная
CLAUDE_MODEL=anthropic/claude-3-haiku         # Быстрая
```

### Настройка триггер статусов

По умолчанию анализ запускается для статусов: `Review`, `Testing`, `Done`

Для изменения отредактируйте:

```typescript
// src/jira/process-webhook-before-after/process-webhook-before-after.service.ts
private readonly triggerStatuses = ['Review', 'Testing', 'Done'];
```

### Настройка ключевых слов

Система ищет задачи по ключевым словам для стрижек:

```typescript
// src/jira/process-webhook-before-after/process-webhook-before-after.service.ts
private readonly haircutKeywords = [
  'стрижк', 'haircut', 'причёск', 'парикмахер',
  'hair', 'волос', 'укладк', 'стиль'
];
```

## 🧪 Тестирование

### Запуск тестов

```bash
# Unit тесты
yarn test

# E2E тесты
yarn test:e2e

# Coverage
yarn test:cov
```

### Ручное тестирование

1. **Проверка API:**

   ```bash
   curl http://localhost:3000/jira/health
   ```

2. **Тест Claude анализа:**

   ```bash
   curl -X POST http://localhost:3000/photo-analysis-agent/analyze-before-after-photos \
     -H "Content-Type: application/json" \
     -d '{"taskKey": "TEST-1", "beforeImageUrl": "...", "afterImageUrl": "..."}'
   ```

3. **Тест генерации отчёта:**
   ```bash
   curl -X POST http://localhost:3000/ai-reporting-agent/generate-report \
     -H "Content-Type: application/json" \
     -d '{"taskKey": "REPORT-1"}'
   ```

## 🐛 Решение проблем

### Частые ошибки

**1. `JIRA_HOST` not configured**

- Проверьте `.env` файл
- Убедитесь что `JIRA_HOST` указан с https://

**2. `401 Unauthorized` от Jira**

- Проверьте `JIRA_USERNAME` и `JIRA_API_TOKEN`
- Убедитесь что токен не истёк

**3. `Claude API Error`**

- Проверьте `OPENROUTER_API_KEY`
- Убедитесь что есть баланс на OpenRouter

**4. Webhook не срабатывает**

- Проверьте что ngrok запущен
- Обновите URL в Jira webhook
- Проверьте логи приложения

### Логирование

Для детальных логов установите:

```env
NODE_ENV=development
```

Логи покажут:

- Входящие webhook запросы
- Claude API вызовы
- Jira API операции
- Ошибки обработки

## 📊 Мониторинг

### Health Check эндпоинты

```bash
# Общее здоровье приложения
GET /

# Jira подключение
GET /jira/health

# Claude webhook
GET /jira/process-webhook-before-after/health

# AI отчёты
GET /ai-reporting-agent/generate-report/health
```

### Swagger UI

Документация API доступна на:

```
http://localhost:3000/api
```

## 🔄 Обновление

Для обновления до новой версии:

```bash
git pull origin main
yarn install
yarn build
# Перезапустите приложение
```

---

**Следующий шаг:** [Настройка Webhook в Jira](WEBHOOK-SETUP.md)
