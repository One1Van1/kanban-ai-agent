# 📄 Правило одного эндпойнта на файл

## Основное правило

**Каждый файл контроллера должен содержать ТОЛЬКО ОДИН эндпойнт**

## Структура файлов

```
src/
├── controllers/
│   ├── get-agent-status.controller.ts     # GET /agent/status
│   ├── get-agent-config.controller.ts     # GET /agent/config
│   ├── put-agent-config.controller.ts     # PUT /agent/config
│   ├── post-agent-start.controller.ts     # POST /agent/start
│   ├── post-agent-stop.controller.ts      # POST /agent/stop
│   ├── post-agent-cycle.controller.ts     # POST /agent/cycle
│   ├── get-ai-analyze.controller.ts       # GET /ai/analyze/:taskKey
│   ├── post-ai-execute.controller.ts      # POST /ai/execute/:taskKey
│   └── post-jira-move-task.controller.ts  # POST /jira/tasks/:taskKey/move
```

## Шаблон файла

```typescript
import { Controller, Get/Post/Put/Delete, Param, Body } from '@nestjs/common';
import { SomeService } from '../services/some.service';

@Controller('endpoint-prefix')
export class SingleEndpointController {
  constructor(private readonly service: SomeService) {}

  @Get('specific-path')  // или @Post, @Put, @Delete
  async handleSingleAction(@Param('id') id: string, @Body() body?: any) {
    // Логика только для этого одного эндпойнта
    return this.service.doSomething(id, body);
  }
}
```

## Преимущества

- ✅ **Четкая ответственность** - один файл = одна функция
- ✅ **Легкое тестирование** - изолированная логика
- ✅ **Простая навигация** - понятно где искать код
- ✅ **Модульность** - можно отключать/включать отдельные эндпойнты
- ✅ **Читаемость** - нет смешения разной логики

## Исключения

**НЕТ ИСКЛЮЧЕНИЙ** - правило действует для всех новых контроллеров.

Существующие многоэндпойнтные контроллеры можно оставить как есть, но все новые должны следовать этому правилу.
