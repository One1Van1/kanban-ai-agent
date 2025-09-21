# 📋 DTO Module

## 📍 Расположение: `src/dto/`

## 🎯 Назначение

Модуль **DTO (Data Transfer Objects)** содержит классы для валидации и типизации данных, передаваемых между различными слоями приложения. Обеспечивает безопасность типов и автоматическую валидацию входящих данных.

## 📁 Структура

```
src/dto/
├── webhook.dto.ts    # DTO для webhook данных
└── index.ts          # Экспорт всех DTO
```

## 🔧 Компоненты

### 🌐 `webhook.dto.ts`

**DTO для обработки Jira webhook'ов**

Содержит типизированные интерфейсы для данных, приходящих от Jira:

#### 📨 `JiraWebhookDto`

Основной DTO для webhook событий от Jira:

```typescript
export interface JiraWebhookDto {
  webhookEvent: string; // Тип события (issue_created, issue_updated)
  timestamp: number; // Временная метка события
  issue: JiraIssueDto; // Данные задачи
  user?: JiraUserDto; // Пользователь, инициировавший событие
  changelog?: JiraChangelogDto; // История изменений (для issue_updated)
}
```

#### 🎯 `JiraIssueDto`

Данные задачи из Jira:

```typescript
export interface JiraIssueDto {
  id: string; // ID задачи
  key: string; // Ключ задачи (например, "KAN-123")
  self: string; // URL задачи в Jira API
  fields: JiraIssueFieldsDto; // Поля задачи
}
```

#### 📝 `JiraIssueFieldsDto`

Поля задачи Jira:

```typescript
export interface JiraIssueFieldsDto {
  summary: string; // Название задачи
  description?: string; // Описание задачи
  status?: JiraStatusDto; // Текущий статус
  priority?: JiraPriorityDto; // Приоритет
  issuetype?: JiraIssueTypeDto; // Тип задачи
  labels?: string[]; // Метки
  assignee?: JiraUserDto; // Исполнитель
  reporter?: JiraUserDto; // Автор задачи
  created?: string; // Дата создания
  updated?: string; // Дата обновления
}
```

#### 🏷️ `JiraStatusDto`

Статус задачи:

```typescript
export interface JiraStatusDto {
  id: string; // ID статуса
  name: string; // Название статуса (NEW, IN_PROGRESS, DONE)
  statusCategory?: {
    id: number;
    key: string; // new, indeterminate, done
    name: string;
  };
}
```

#### 👤 `JiraUserDto`

Пользователь Jira:

```typescript
export interface JiraUserDto {
  accountId: string; // ID аккаунта
  displayName: string; // Отображаемое имя
  emailAddress?: string; // Email
  active: boolean; // Активен ли аккаунт
}
```

#### 📊 `JiraChangelogDto`

История изменений:

```typescript
export interface JiraChangelogDto {
  id: string; // ID изменения
  items: JiraChangelogItemDto[]; // Элементы изменений
}

export interface JiraChangelogItemDto {
  field: string; // Какое поле изменено (status, assignee)
  fieldtype: string; // Тип поля (jira, custom)
  from?: string; // Старое значение
  fromString?: string; // Старое значение (строка)
  to?: string; // Новое значение
  toString?: string; // Новое значение (строка)
}
```

### 🤖 `TaskAnalysisDto`

**DTO для анализа задач AI**

```typescript
export interface TaskAnalysisDto {
  title: string; // Название задачи
  description: string; // Описание
  context?: string; // Дополнительный контекст
  priority?: string; // Приоритет
  labels?: string[]; // Метки
}
```

### 📈 `AIAnalysisResultDto`

**DTO для результатов AI анализа**

```typescript
export interface AIAnalysisResultDto {
  decision: 'questions' | 'in_progress'; // Решение AI
  reasoning: string; // Обоснование решения
  questions?: string[]; // Вопросы для уточнения
  suggestedActions?: string[]; // Предлагаемые действия
  confidence?: number; // Уверенность (0-1)
}
```

## 🔄 Использование DTO

### В контроллерах

```typescript
@Controller('webhook')
export class WebhookController {
  @Post('jira')
  async handleJiraWebhook(
    @Body() payload: JiraWebhookDto, // Автоматическая валидация
    @Headers() headers: Record<string, string>,
  ) {
    // payload уже типизирован и провалидирован
    const issueKey = payload.issue.key;
    const status = payload.issue.fields.status?.name;

    return await this.webhookService.processWebhook(payload);
  }
}
```

### В сервисах

```typescript
@Injectable()
export class AIAnalysisService {
  async analyzeTask(taskData: TaskAnalysisDto): Promise<AIAnalysisResultDto> {
    // Входные данные типизированы
    const { title, description, priority } = taskData;

    // Логика анализа...

    return {
      decision: 'in_progress',
      reasoning: 'Task is well defined',
      suggestedActions: ['Create entity', 'Write tests'],
      confidence: 0.95,
    };
  }
}
```

## ✅ Валидация данных

### Использование class-validator

```typescript
import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
  @IsOptional()
  priority?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  labels?: string[];
}
```

### Автоматическая валидация

```typescript
// В main.ts
app.useGlobalPipes(
  new ValidationPipe({
    transform: true, // Автоматическое преобразование типов
    whitelist: true, // Удаление лишних полей
    forbidNonWhitelisted: true, // Ошибка при лишних полях
  }),
);
```

## 🔄 Трансформация данных

### Извлечение данных из Jira

```typescript
export class WebhookService {
  private extractTaskData(payload: JiraWebhookDto): TaskAnalysisDto {
    const issue = payload.issue;

    return {
      title: issue.fields.summary,
      description: issue.fields.description || '',
      context: `Status: ${issue.fields.status?.name || 'Unknown'}`,
      priority: issue.fields.priority?.name,
      labels: issue.fields.labels || [],
    };
  }
}
```

### Подготовка данных для AI

```typescript
private prepareAIPrompt(taskData: TaskAnalysisDto): string {
  return `
    Analyze this task:
    Title: ${taskData.title}
    Description: ${taskData.description}
    Priority: ${taskData.priority || 'Not set'}
    Labels: ${taskData.labels?.join(', ') || 'None'}
  `;
}
```

## 📊 Примеры реальных данных

### Webhook создания задачи

```json
{
  "webhookEvent": "jira:issue_created",
  "timestamp": 1695123456789,
  "issue": {
    "id": "10001",
    "key": "KAN-123",
    "fields": {
      "summary": "Создать API для пользователей",
      "description": "Нужно создать REST API для управления пользователями",
      "status": {
        "id": "1",
        "name": "To Do"
      },
      "priority": {
        "name": "High"
      },
      "issuetype": {
        "name": "Task"
      }
    }
  }
}
```

### Webhook изменения статуса

```json
{
  "webhookEvent": "jira:issue_updated",
  "issue": {
    "key": "KAN-123",
    "fields": {
      "status": {
        "name": "In Progress"
      }
    }
  },
  "changelog": {
    "items": [
      {
        "field": "status",
        "fromString": "To Do",
        "toString": "In Progress"
      }
    ]
  }
}
```

## 🛡 Безопасность и валидация

### Обязательные поля

```typescript
// Проверка обязательных полей
if (!payload.issue?.key) {
  throw new BadRequestException('Issue key is required');
}

if (!payload.issue?.fields?.summary) {
  throw new BadRequestException('Issue summary is required');
}
```

### Санитизация данных

```typescript
// Очистка HTML из описания
private sanitizeDescription(description: string): string {
  return description
    .replace(/<[^>]*>/g, '')           // Удаляем HTML теги
    .replace(/&nbsp;/g, ' ')          // Заменяем &nbsp; на пробелы
    .trim();                          // Убираем лишние пробелы
}
```

## 🚀 Расширение

Для добавления новых DTO:

1. **Создать новый файл** или добавить в существующий
2. **Добавить экспорт** в `index.ts`
3. **Добавить валидацию** с помощью декораторов
4. **Написать тесты** для валидации

```typescript
// Пример нового DTO
export interface ProjectAnalysisDto {
  projectKey: string;
  boardId: string;
  timeframe: {
    from: Date;
    to: Date;
  };
  metrics: string[];
}
```
