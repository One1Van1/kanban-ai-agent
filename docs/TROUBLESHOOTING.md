# Решение проблем 🆘

Руководство по диагностике и устранению типичных проблем Kanban AI Agent.

## 🔍 Диагностика системы

### Быстрая проверка компонентов

```bash
# 1. Основное приложение
curl http://localhost:3000
# Ожидаемый ответ: {"message": "Kanban AI Agent is running!"}

# 2. Jira подключение
curl http://localhost:3000/jira/health
# Ожидаемый ответ: {"status": "healthy", "jiraConnected": true}

# 3. Claude webhook
curl http://localhost:3000/jira/process-webhook-before-after/health
# Ожидаемый ответ: {"status": "healthy", "claudeEndpoint": "..."}

# 4. AI отчёты
curl http://localhost:3000/ai-reporting-agent/generate-report/health
# Ожидаемый ответ: {"status": "healthy", "lastReportGenerated": "..."}

# 5. ngrok туннель
curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url'
# Ожидаемый ответ: https://abc123.ngrok-free.app
```

## 🚨 Частые проблемы и решения

### 1. Приложение не запускается

#### Симптомы

```bash
yarn start:dev
# Error: Cannot find module '@nestjs/core'
```

#### Причины и решения

**Проблема:** Не установлены зависимости

```bash
# Решение
yarn install
```

**Проблема:** Неправильная версия Node.js

```bash
# Проверить версию
node --version
# Должно быть >= 18.0.0

# Обновить Node.js через nvm
nvm install 18
nvm use 18
```

**Проблема:** Отсутствует .env файл

```bash
# Решение
cp .env.example .env
# Заполнить переменные окружения
```

### 2. Ошибки подключения к Jira

#### Симптомы

```
❌ Error: 401 Unauthorized
❌ Error: JIRA_HOST not configured
❌ Error: getaddrinfo ENOTFOUND your-domain.atlassian.net
```

#### Решения

**401 Unauthorized:**

```bash
# Проверить учётные данные в .env
JIRA_USERNAME=your-email@domain.com
JIRA_API_TOKEN=your-valid-token

# Создать новый API токен:
# https://id.atlassian.com/manage-profile/security/api-tokens
```

**JIRA_HOST not configured:**

```bash
# Добавить в .env
JIRA_HOST=https://your-domain.atlassian.net
# Без trailing slash!
```

**ENOTFOUND (DNS ошибка):**

```bash
# Проверить правильность домена
ping your-domain.atlassian.net

# Проверить интернет подключение
curl https://atlassian.net
```

### 3. Claude API проблемы

#### Симптомы

```
❌ Error: 401 Unauthorized (OpenRouter)
❌ Error: Insufficient credits
❌ Error: Rate limit exceeded
```

#### Решения

**401 Unauthorized:**

```bash
# Проверить API ключ в .env
OPENROUTER_API_KEY=sk-or-v1-xxx...

# Создать новый ключ:
# https://openrouter.ai/keys
```

**Insufficient credits:**

```bash
# Пополнить баланс на OpenRouter:
# https://openrouter.ai/credits

# Проверить баланс:
curl -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  https://openrouter.ai/api/v1/auth/key
```

**Rate limit exceeded:**

```bash
# Подождать или обновить план
# Или сменить модель в .env:
CLAUDE_MODEL=anthropic/claude-3-haiku  # Быстрее и дешевле
```

### 4. Webhook не срабатывает

#### Симптомы

- При изменении статуса задачи анализ не запускается
- В логах нет сообщений о webhook
- ngrok показывает 0 запросов

#### Диагностика

**1. Проверить ngrok:**

```bash
# Запущен ли ngrok?
ps aux | grep ngrok

# Правильный ли URL?
curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url'

# Доступен ли endpoint?
curl https://YOUR-NGROK-URL.ngrok-free.app/jira/process-webhook-before-after/health
```

**2. Проверить webhook в Jira:**

```
1. Зайти в Jira → Settings → System → Webhooks
2. Найти "Kanban AI Agent"
3. Проверить:
   - Status: Enabled ✅
   - URL: правильный ngrok URL
   - Events: Issue updated ✅
```

**3. Проверить события:**

```bash
# Создать тестовую задачу со словом "стрижк"
# Перевести в статус Review/Testing/Done
# Проверить логи приложения
```

#### Решения

**Неправильный URL в webhook:**

```bash
# Получить актуальный URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')
echo "Обновить webhook на: $NGROK_URL/jira/process-webhook-before-after"
```

**Webhook не включён:**

```
В Jira Settings → Webhooks → включить Kanban AI Agent
```

**Неправильные события:**

```
Убедиться что выбраны:
- Issue updated ✅
- Comment created ✅
```

### 5. Анализ не запускается

#### Симптомы

- Webhook срабатывает, но анализ не выполняется
- В логах: "Skipped processing"

#### Причины и решения

**Задача не содержит ключевых слов:**

```bash
# Проверить название задачи содержит:
"стрижк", "haircut", "причёск", "парикмахер", "hair", "волос"

# Или обновить ключевые слова в коде:
# src/jira/process-webhook-before-after/process-webhook-before-after.service.ts
```

**Неправильный статус:**

```bash
# Анализ запускается только для статусов:
"Review", "Testing", "Done"

# Проверить в коде:
# private readonly triggerStatuses = ['Review', 'Testing', 'Done'];
```

**Анализ уже выполнялся:**

```bash
# Система пропускает повторные анализы
# Проверить комментарии в задаче на наличие "АНАЛИЗ CLAUDE"
```

**Нет фотографий:**

```bash
# Убедиться что в задаче есть прикреплённые изображения
# Система добавит комментарий об отсутствии фото
```

### 6. Отчёты не генерируются

#### Симптомы

- Задача назначена на AI-Report-maker, но отчёт не создаётся
- Ошибка парсинга дат

#### Решения

**Неправильное назначение:**

```bash
# Точное имя assignee должно быть:
"AI-Report-maker"
# Не "AI Report maker" или "AI-report-maker"
```

**Неподдерживаемый формат даты:**

```bash
# Поддерживаемые фразы:
"сегодня", "вчера", "прошлую неделю", "этот месяц"
"последние 7 дней", "последние 30 дней"

# Или точные даты:
"с 01.10.2025 по 07.10.2025"
```

**Нет данных за период:**

```bash
# Проверить есть ли завершённые анализы за период:
curl -X POST http://localhost:3000/jira/search \
  -H "Content-Type: application/json" \
  -d '{"jql": "project = KAN AND summary ~ \"стрижк*\" AND status = Done"}'
```

### 7. Проблемы с изображениями

#### Симптомы

```
❌ Неподдерживаемый формат файла
❌ Файл слишком большой
❌ Изображения не найдены
```

#### Решения

**Неподдерживаемый формат:**

```bash
# Поддерживаемые форматы:
JPG, JPEG, PNG, GIF, BMP, WEBP

# Конвертировать в поддерживаемый формат:
convert image.tiff image.jpg
```

**Большой размер файла:**

```bash
# Максимальный размер: 10MB
# Сжать изображение:
convert image.jpg -quality 85 -resize 1920x1920> compressed.jpg
```

**Изображения не найдены:**

```bash
# Рекомендуемые названия для автоопределения:
"до.jpg", "before.jpg", "start.jpg"  # Для фото ДО
"после.jpg", "after.jpg", "result.jpg"  # Для фото ПОСЛЕ

# Или система выберет по времени:
# Самое раннее = ДО, самое позднее = ПОСЛЕ
```

## 🔧 Инструменты диагностики

### Логирование

**Включить подробные логи:**

```bash
# В .env файле:
NODE_ENV=development

# Перезапустить приложение:
yarn start:dev
```

**Просмотр логов в реальном времени:**

```bash
# Логи приложения
tail -f logs/application.log

# Или просто вывод в консоли при yarn start:dev
```

### Тестирование API

**Ручное тестирование Claude анализа:**

```bash
curl -X POST http://localhost:3000/photo-analysis-agent/analyze-before-after-photos \
  -H "Content-Type: application/json" \
  -d '{
    "taskKey": "TEST-1",
    "beforeImageUrl": "https://example.com/before.jpg",
    "afterImageUrl": "https://example.com/after.jpg"
  }'
```

**Ручное тестирование отчёта:**

```bash
curl -X POST http://localhost:3000/ai-reporting-agent/generate-report \
  -H "Content-Type: application/json" \
  -d '{
    "dateRange": "последние 7 дней",
    "includeDetails": true
  }'
```

### Мониторинг ngrok

**Веб-интерфейс ngrok:**

```bash
# Открыть в браузере:
open http://127.0.0.1:4040

# Или через curl:
curl -s http://localhost:4040/api/tunnels | jq '.'
```

## 📊 Системные ошибки

### Нехватка памяти

#### Симптомы

```
❌ Error: JavaScript heap out of memory
❌ Process killed (OOM)
```

#### Решения

```bash
# Увеличить лимит памяти для Node.js:
export NODE_OPTIONS="--max-old-space-size=4096"
yarn start:dev

# Или в package.json:
"start:dev": "NODE_OPTIONS='--max-old-space-size=4096' nest start --watch"
```

### Проблемы с портами

#### Симптомы

```
❌ Error: listen EADDRINUSE :::3000
❌ Port 3000 is already in use
```

#### Решения

```bash
# Найти процесс использующий порт:
lsof -i :3000

# Завершить процесс:
kill -9 <PID>

# Или использовать другой порт:
PORT=3001 yarn start:dev
```

## 🆘 Экстренные действия

### Полный перезапуск системы

```bash
# 1. Остановить все процессы
pkill -f "node.*nest"
pkill -f ngrok

# 2. Очистить кэш
yarn cache clean

# 3. Переустановить зависимости
rm -rf node_modules
yarn install

# 4. Перезапустить
yarn start:dev

# 5. Запустить ngrok
ngrok http 3000

# 6. Обновить webhook в Jira
```

### Откат к стабильной версии

```bash
# Переключиться на стабильную ветку
git checkout main
git pull origin main

# Переустановить зависимости
yarn install

# Запустить
yarn start:dev
```

## 📞 Получение помощи

### Сбор информации для поддержки

```bash
# Версия Node.js
node --version

# Версия yarn
yarn --version

# Версия приложения
cat package.json | grep version

# Логи ошибок (последние 50 строк)
tail -50 logs/error.log

# Конфигурация (без секретов)
cat .env | grep -v TOKEN | grep -v API_KEY
```

### Полезные команды

```bash
# Проверка сетевых подключений
netstat -tlnp | grep :3000

# Проверка DNS
nslookup your-domain.atlassian.net

# Проверка SSL сертификатов
openssl s_client -connect your-domain.atlassian.net:443

# Тест HTTP подключения
curl -v https://your-domain.atlassian.net/rest/api/3/myself
```

---

**🎯 Если проблема не решена:**

1. Проверьте [Issues на GitHub](https://github.com/your-repo/issues)
2. Создайте новый Issue с подробным описанием
3. Приложите логи и конфигурацию (без секретов)
