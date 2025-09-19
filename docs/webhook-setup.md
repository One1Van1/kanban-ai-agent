# 🔗 Настройка автоматических webhook'ов

## 📋 Пошаговая инструкция

### 1. Регистрация на ngrok

1. Переходим на https://ngrok.com/signup
2. Регистрируемся (можно через GitHub)
3. После регистрации переходим в Dashboard → "Your Authtoken"
4. Копируем authtoken

### 2. Настройка ngrok

```bash
# Добавляем authtoken (замените YOUR_TOKEN на ваш токен)
ngrok config add-authtoken YOUR_TOKEN

# Запускаем туннель
ngrok http 3000
```

После запуска ngrok покажет что-то вроде:

```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

### 3. Настройка webhook в Jira

1. Заходим в Jira как администратор: https://sa4kov2004.atlassian.net
2. Settings → System → WebHooks
3. Нажимаем "Create a WebHook"
4. Заполняем:
   - **Name**: Kanban AI Agent
   - **URL**: `https://abc123.ngrok.io/webhook/jira` (ваш ngrok URL)
   - **Description**: Автоматическое управление статусами задач с помощью AI
   - **Issue events**: ✅ created
   - **JQL filter**: `project = KAN`

### 4. Тестирование

1. Убедитесь что ваш NestJS сервер запущен (`yarn start:dev`)
2. Убедитесь что ngrok туннель активен
3. Создайте новую задачу в Jira проекте "kanban-ai-agent"
4. Проверьте логи сервера - должен прийти webhook
5. Проверьте что задача автоматически переместилась в нужную колонку

## 🎯 Результат

После настройки каждая новая задача в Jira будет:

1. **Автоматически анализироваться** AI агентом
2. **Перемещаться** в колонку "Questions" или "In Progress"
3. **Логироваться** в консоли сервера

## 🔧 Альтернативы ngrok

Если ngrok не подходит, можно использовать:

- **LocalTunnel**: `npx localtunnel --port 3000`
- **Serveo**: `ssh -R 80:localhost:3000 serveo.net`
- **Cloudflare Tunnel**: `cloudflared tunnel --url http://localhost:3000`

## 🚨 Безопасность

- ngrok туннель временный, после перезапуска URL изменится
- Для production используйте постоянный домен
- Добавьте проверку подписи webhook'а для безопасности

## 🎉 После настройки

Система будет работать полностью автономно! ✨
