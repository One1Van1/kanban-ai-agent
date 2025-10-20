# Configuration Files

Файлы конфигурации для всех модулей системы.

## 🎯 Назначение

Централизованное управление настройками приложения через переменные окружения и конфигурационные файлы.

## 📁 Структура

| Файл                      | Описание                      | Переменные окружения                                      |
| ------------------------- | ----------------------------- | --------------------------------------------------------- |
| `app.config.ts`           | Основные настройки приложения | `PORT`, `NODE_ENV`, `API_PREFIX`                          |
| `database.config.ts`      | Подключение к PostgreSQL      | `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` |
| `cache.config.ts`         | Настройки Redis кэша          | `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`              |
| `queue.config.ts`         | Настройки BullMQ очередей     | `REDIS_HOST`, `REDIS_PORT`                                |
| `claude.config.ts`        | API ключи для Claude AI       | `CLAUDE_API_KEY`, `CLAUDE_MODEL`                          |
| `ai-agent.config.ts`      | Настройки AI агентов          | `AI_TIMEOUT`, `MAX_RETRIES`                               |
| `jira.config.ts`          | Подключение к Jira            | `JIRA_HOST`, `JIRA_EMAIL`, `JIRA_API_TOKEN`               |
| `notifications.config.ts` | Настройки уведомлений         | `SMTP_HOST`, `SMTP_PORT`, `EMAIL_FROM`                    |
| `index.ts`                | Экспорт всех конфигов         | -                                                         |

## ⚙️ Основные возможности

- ✅ Валидация переменных окружения
- ✅ Типизация конфигурации
- ✅ Значения по умолчанию
- ✅ Разделение по окружениям (dev/prod)
- ✅ Централизованный экспорт

## 🔧 Использование

### Пример: app.config.ts

```typescript
export default registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  environment: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || 'api',
}));
```

### Импорт в модуле

```typescript
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
  ],
})
```

### Использование в сервисе

```typescript
constructor(
  @Inject('app') private appConfig: ConfigType<typeof appConfig>
) {
  const port = this.appConfig.port;
}
```

## 🔒 Безопасность

- ✅ Используйте `.env` файл для локальной разработки
- ✅ `.env` файлы добавлены в `.gitignore`
- ✅ На продакшене используйте environment variables
- ✅ Никогда не коммитьте секреты в репозиторий

## 📋 Создание нового конфига

1. Создайте файл `feature-name.config.ts`
2. Используйте `registerAs` для регистрации
3. Добавьте валидацию переменных
4. Экспортируйте через `index.ts`
5. Задокументируйте переменные в этом README

## 🌐 Переменные окружения

### Обязательные

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kanban_db
DB_USER=postgres
DB_PASSWORD=password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Claude AI
CLAUDE_API_KEY=your_api_key
```

### Опциональные

```env
# Application
PORT=3000
NODE_ENV=development
API_PREFIX=api

# Jira (опционально)
JIRA_HOST=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your_token
```

## 🔗 Связи

**Используется в:**

- Всех feature-модулях
- Database Management
- Cache Management
- Queue Management
- AI Agent
- Notifications
