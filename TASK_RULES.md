# 🎯 Инструкция для задачи: Улучшенный Kanban Workflow

## ❌ СТРОГО ЗАПРЕЩЕНО изменять:

### Существующие файлы:

- `src/webhook/webhook.service.ts` - НЕ ТРОГАТЬ
- `src/ai-analysis/ai-analysis.service.ts` - НЕ ТРОГАТЬ
- `src/kanban/kanban.service.ts` - НЕ ТРОГАТЬ
- `src/task-executor/task-executor.service.ts` - НЕ ТРОГАТЬ
- `src/types/enums.ts` - НЕ ТРОГАТЬ
- `src/dto/webhook.dto.ts` - НЕ ТРОГАТЬ
- `app.module.ts` - НЕ ТРОГАТЬ

### Существующую логику:

- Не менять существующие методы
- Не удалять код
- Не переписывать логику

## ✅ РАЗРЕШЕНО создавать:

### Новые папки:

- `src/enhanced-workflow/` - расширенный workflow
- `src/status-transitions/` - управление переходами статусов
- `src/workflow-orchestrator/` - оркестратор процессов

### Новые файлы:

- Новые сервисы для расширенной логики
- Новые модули для новой функциональности
- Новые контроллеры для дополнительных endpoint'ов
- Новые интерфейсы и типы

## 🔧 Подход к реализации:

### 1. Композиция, не изменение

```typescript
// ✅ ПРАВИЛЬНО
@Injectable()
class EnhancedWorkflowService {
  constructor(
    private readonly webhookService: WebhookService, // используем как есть
    private readonly aiService: AIAnalysisService, // используем как есть
    private readonly kanbanService: KanbanService, // используем как есть
  ) {}

  // НОВАЯ логика здесь
}

// ❌ НЕПРАВИЛЬНО - изменение существующего файла
```

### 2. Новые endpoint'ы, не изменение старых

```typescript
// ✅ ПРАВИЛЬНО - новый контроллер
@Controller('enhanced-workflow')
class EnhancedWorkflowController {
  // новые endpoint'ы
}

// ❌ НЕПРАВИЛЬНО - добавление в webhook.controller.ts
```

### 3. Расширение через наследование или wrapper'ы

- Создаем обертки вокруг существующих сервисов
- Добавляем новую логику в новые методы
- Используем существующие сервисы как dependency

## 🎯 Цель задачи:

Реализовать улучшенный workflow:
`Backlog → New → AI анализ → Questions OR (выполнение → In Progress) → Review → Done`

**БЕЗ ИЗМЕНЕНИЯ** существующего кода!

---

**Соблюдение этих правил обязательно!**
