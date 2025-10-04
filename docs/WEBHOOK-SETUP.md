# Настройка Webhook в Jira 🔗

Подробная инструкция по настройке webhook для автоматической интеграции с AI агентом.

## 🎯 Что такое Webhook

Webhook - это механизм автоматической отправки уведомлений от Jira к вашему приложению при изменениях в задачах. Когда пользователь:

- Создаёт задачу
- Изменяет статус
- Добавляет комментарий
- Прикрепляет файл

Jira автоматически отправляет HTTP запрос на ваш сервер, запуская AI анализ.

## 🛠️ Пошаговая настройка

### 1. Установка и запуск ngrok

Для получения webhook от Jira нужен публичный URL:

```bash
# Установка ngrok (macOS)
brew install ngrok

# Или скачайте с https://ngrok.com/download
```

Запустите туннель:

```bash
ngrok http 3000
```

Получите URL вида:

```
https://abc123def456.ngrok-free.app
```

**⚠️ Важно:** Каждый раз при перезапуске ngrok URL меняется!

### 2. Доступ к настройкам Jira

1. Откройте ваш Jira сайт: `https://your-domain.atlassian.net`
2. Перейдите в **⚙️ Settings** → **System**
3. В боковом меню найдите **System** → **Webhooks**
4. Нажмите **Create a webhook**

### 3. Настройка webhook

#### Основные параметры

**Name (Название):**

```
Kanban AI Agent
```

**Status:**

```
✅ Enabled
```

**URL:**

```
https://YOUR-NGROK-URL.ngrok-free.app/jira/process-webhook-before-after
```

**Пример URL:**

```
https://abc123def456.ngrok-free.app/jira/process-webhook-before-after
```

#### События (Events)

Выберите следующие события:

**✅ Jira Software related events:**

- Sprint updated
- Board configuration changed

**✅ Issue related events:**

- Issue created ✅ **Обязательно**
- Issue updated ✅ **Обязательно**
- Issue deleted

**✅ Worklog related events:**

- Worklog created
- Worklog updated
- Worklog deleted

**✅ Comment related events:**

- Comment created ✅ **Обязательно**

#### Фильтры (JQL)

Оставьте пустым или используйте фильтр для конкретного проекта:

```sql
project = KAN
```

### 4. Дополнительные настройки

**Exclude body:**

```
☐ No (оставить не отмеченным)
```

**Secret:**

```
(оставить пустым)
```

**Transitions:**

```
☐ No linked transitions (не отмечать)
```

### 5. Сохранение и проверка

1. Нажмите **Create**
2. Webhook должен появиться в списке с статусом **Enabled**
3. Зелёная галочка означает успешную настройку

## 🧪 Тестирование webhook

### Проверка приложения

Убедитесь что приложение запущено:

```bash
curl http://localhost:3000/jira/process-webhook-before-after/health
```

Ответ должен быть:

```json
{
  "status": "healthy",
  "claudeEndpoint": "http://localhost:3000/photo-analysis-agent/analyze-before-after-photos",
  "timestamp": "2025-10-04T15:30:00.000Z"
}
```

### Проверка ngrok

Откройте интерфейс ngrok:

```
http://127.0.0.1:4040
```

Вы должны увидеть:

- Текущий публичный URL
- Статистику запросов
- Логи входящих запросов

### Тестовое событие

1. **Создайте задачу** в Jira:
   - Тип: любой
   - Название: "Тест webhook"
   - Описание: любое

2. **Проверьте логи приложения:**

   ```bash
   # В консоли должно появиться:
   [LOG] 🎯 Webhook received: jira:issue_created for task KAN-101
   ```

3. **Проверьте ngrok интерфейс:**
   - Должен появиться POST запрос на `/jira/process-webhook-before-after`
   - Статус код: 200 или 201

## 🔄 Автоматическое обновление URL

Поскольку ngrok URL меняется при каждом перезапуске, можно автоматизировать обновление:

### Скрипт автообновления (Bash)

Создайте файл `update-webhook.sh`:

```bash
#!/bin/bash

# Получаем текущий ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')

if [ "$NGROK_URL" != "null" ]; then
    echo "Новый ngrok URL: $NGROK_URL"
    echo "Обновите webhook в Jira на:"
    echo "$NGROK_URL/jira/process-webhook-before-after"
else
    echo "❌ ngrok не запущен"
fi
```

Запуск:

```bash
chmod +x update-webhook.sh
./update-webhook.sh
```

### Альтернатива: Статический туннель

Для production используйте:

- **ngrok Pro** (статический домен)
- **Cloudflare Tunnel**
- **локальный reverse proxy**

## 🚨 Решение проблем

### Webhook не срабатывает

**1. Проверьте URL в Jira:**

```bash
# Получите текущий ngrok URL
curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url'
```

**2. Проверьте что приложение отвечает:**

```bash
curl https://YOUR-NGROK-URL.ngrok-free.app/jira/process-webhook-before-after/health
```

**3. Проверьте события в webhook:**

- Issue updated ✅
- Comment created ✅

### Ошибки в логах

**`400 Bad Request`:**

```bash
# Проверьте формат webhook данных в ngrok интерфейсе
http://127.0.0.1:4040
```

**`404 Not Found`:**

```bash
# Неверный URL в webhook, проверьте:
https://YOUR-NGROK-URL.ngrok-free.app/jira/process-webhook-before-after
```

**`500 Internal Server Error`:**

```bash
# Ошибка в приложении, проверьте логи сервера
yarn start:dev
```

### ngrok проблемы

**Туннель недоступен:**

```bash
# Перезапустите ngrok
pkill ngrok
ngrok http 3000
```

**Лимит запросов (Free план):**

- Ограничение: 20,000 запросов/месяц
- Решение: ngrok Pro или альтернативы

## 📊 Мониторинг webhook

### Логи в приложении

При успешной работе вы увидите:

```bash
[LOG] 🎯 Webhook received: jira:issue_updated for task KAN-28
[LOG] 📸 Auto-detected photos: before="photo1.jpg", after="photo2.jpg"
[LOG] 🤖 Sending to Claude for analysis
[LOG] ✅ Analysis completed. Score: 8/10
[LOG] 💬 Results posted to task
```

### Статистика ngrok

В интерфейсе `http://127.0.0.1:4040`:

- Количество запросов
- Статус коды ответов
- Время обработки
- Размер данных

### Jira webhook статистика

В настройках webhook в Jira:

1. Нажмите на название webhook
2. Перейдите на вкладку **Statistics**
3. Просмотрите статистику доставки

## 🔧 Расширенная настройка

### Фильтрация по проектам

Для работы только с определённым проектом:

```sql
project = KAN AND summary ~ "стрижк*"
```

### Фильтрация по статусам

Для срабатывания только при определённых статусах:

```sql
project = KAN AND status CHANGED TO ("Review","Testing","Done")
```

### Несколько webhook

Можно создать отдельные webhook для разных целей:

**1. AI Анализ (Claude):**

```
URL: /jira/process-webhook-before-after
События: Issue updated
Фильтр: summary ~ "стрижк*"
```

**2. AI Отчёты:**

```
URL: /ai-reporting-agent/process-report-webhook
События: Issue updated
Фильтр: assignee = "AI-Report-maker"
```

## 🎭 Примеры настройки

### Минимальная настройка

Для тестирования достаточно:

- **URL:** `https://YOUR-NGROK.ngrok-free.app/jira/process-webhook-before-after`
- **События:** Issue updated
- **Статус:** Enabled

### Производственная настройка

Для production рекомендуется:

- **Статический URL** (ngrok Pro, Cloudflare)
- **Фильтры JQL** по проектам
- **Мониторинг** доставки webhook
- **Резервные endpoint** для надёжности

---

**Следующий шаг:** [Архитектура системы](ARCHITECTURE.md)
