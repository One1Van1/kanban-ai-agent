# ⚙️ Config Module

## 📍 Расположение: `src/config/`

## 🎯 Назначение

Модуль **Config** управляет всей конфигурацией приложения. Он централизованно хранит настройки для различных сервисов и обеспечивает типобезопасный доступ к конфигурации.

## 📁 Структура

```
src/config/
├── app.config.ts      # Основные настройки приложения
├── claude.config.ts   # Конфигурация для Claude AI
├── jira.config.ts     # Настройки Jira интеграции
└── index.ts           # Экспорт всех конфигураций
```

## 🔧 Файлы конфигурации

### 🏠 `app.config.ts`

**Основные настройки приложения**

```typescript
export const appConfig = () => ({
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
    environment: process.env.NODE_ENV || 'development',
    webhook: {
      secret: process.env.WEBHOOK_SECRET,
    },
  },
});
```

**Настройки:**

- 🌐 **Port** - порт для запуска сервера (по умолчанию 3000)
- 🏷️ **Environment** - окружение (development/production)
- 🔐 **Webhook Secret** - секрет для валидации webhook'ов

### 🤖 `claude.config.ts`

**Конфигурация Claude AI**

```typescript
export const claudeConfig = () => ({
  claude: {
    apiKey: process.env.CLAUDE_API_KEY,
    model: process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229',
    maxTokens: parseInt(process.env.CLAUDE_MAX_TOKENS, 10) || 1000,
    baseUrl: process.env.CLAUDE_BASE_URL || 'https://api.anthropic.com',
  },
});
```

**Настройки:**

- 🔑 **API Key** - ключ для доступа к Claude API
- 🧠 **Model** - модель AI (по умолчанию claude-3-sonnet)
- 📊 **Max Tokens** - максимальное количество токенов в ответе
- 🌐 **Base URL** - базовый URL для API

### 🎯 `jira.config.ts`

**Настройки Jira интеграции**

```typescript
export const jiraConfig = () => ({
  jira: {
    baseUrl: process.env.JIRA_BASE_URL,
    username: process.env.JIRA_USERNAME,
    apiToken: process.env.JIRA_API_TOKEN,
    projectKey: process.env.JIRA_PROJECT_KEY,
    board: {
      id: process.env.JIRA_BOARD_ID,
    },
  },
});
```

**Настройки:**

- 🏢 **Base URL** - URL экземпляра Jira
- 👤 **Username** - имя пользователя Jira
- 🔐 **API Token** - токен для API доступа
- 📋 **Project Key** - ключ проекта (например, "KAN")
- 📊 **Board ID** - ID Kanban доски

## 📝 Переменные окружения

### 🔧 Основные настройки

```bash
# Приложение
PORT=3000
NODE_ENV=development
WEBHOOK_SECRET=your-webhook-secret

# Claude AI
CLAUDE_API_KEY=your-claude-api-key
CLAUDE_MODEL=claude-3-sonnet-20240229
CLAUDE_MAX_TOKENS=1000

# Jira
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_USERNAME=your-email@domain.com
JIRA_API_TOKEN=your-jira-api-token
JIRA_PROJECT_KEY=KAN
JIRA_BOARD_ID=1
```

## 🔄 Использование в модулях

### Инъекция конфигурации

```typescript
@Injectable()
export class SomeService {
  constructor(private configService: ConfigService) {}

  someMethod() {
    const jiraUrl = this.configService.get<string>('jira.baseUrl');
    const claudeModel = this.configService.get<string>('claude.model');
    const appPort = this.configService.get<number>('app.port');
  }
}
```

### Типобезопасный доступ

```typescript
// Получение всей конфигурации Jira
const jiraConfig = this.configService.get('jira');

// Получение конкретного значения с типом
const maxTokens = this.configService.get<number>('claude.maxTokens');
```

## 🏗 Регистрация в AppModule

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jiraConfig, claudeConfig],
      envFilePath: '.env',
    }),
    // другие модули...
  ],
})
export class AppModule {}
```

**Особенности:**

- ✅ **isGlobal: true** - конфигурация доступна во всех модулях
- 📁 **load** - загружает все файлы конфигурации
- 🔧 **envFilePath** - путь к файлу переменных окружения

## 🛡 Валидация конфигурации

### Обязательные поля

```typescript
// Пример валидации в сервисе
if (!this.configService.get('claude.apiKey')) {
  throw new Error('CLAUDE_API_KEY is required');
}

if (!this.configService.get('jira.baseUrl')) {
  throw new Error('JIRA_BASE_URL is required');
}
```

### Схема валидации (планируется)

```typescript
// Будущее улучшение - использование Joi или class-validator
const configSchema = Joi.object({
  CLAUDE_API_KEY: Joi.string().required(),
  JIRA_BASE_URL: Joi.string().uri().required(),
  PORT: Joi.number().default(3000),
});
```

## 🌍 Окружения

### Development

```bash
NODE_ENV=development
PORT=3000
# Тестовые credentials
```

### Production

```bash
NODE_ENV=production
PORT=80
# Продакшн credentials
# SSL настройки
```

### Testing

```bash
NODE_ENV=test
# Mock credentials для тестов
```

## 🔒 Безопасность

### Секретные данные

- ❌ **Никогда не коммитить** `.env` файлы
- ✅ **Использовать** `.env.example` для документации
- 🔐 **Хранить секреты** в защищенных хранилищах

### Пример `.env.example`

```bash
# Скопируйте в .env и заполните реальными значениями

# Application
PORT=3000
NODE_ENV=development
WEBHOOK_SECRET=change-me

# Claude AI
CLAUDE_API_KEY=your-claude-api-key-here
CLAUDE_MODEL=claude-3-sonnet-20240229

# Jira Integration
JIRA_BASE_URL=https://yourcompany.atlassian.net
JIRA_USERNAME=your-email@company.com
JIRA_API_TOKEN=your-jira-api-token
JIRA_PROJECT_KEY=KAN
JIRA_BOARD_ID=1
```

## 🚀 Расширение

Для добавления новой конфигурации:

1. **Создать новый файл** `new-service.config.ts`
2. **Добавить в index.ts** экспорт
3. **Зарегистрировать в AppModule** в массиве `load`
4. **Добавить переменные** в `.env.example`

```typescript
// new-service.config.ts
export const newServiceConfig = () => ({
  newService: {
    apiKey: process.env.NEW_SERVICE_API_KEY,
    timeout: parseInt(process.env.NEW_SERVICE_TIMEOUT, 10) || 5000,
  },
});
```
