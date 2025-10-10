# Анализ блока Photo Analysis

## Бизнес-логика

AI-анализ фотографий "до" и "после" для оценки выполненных работ и прогресса проектов.

## Статус: ✅ РЕАЛИЗОВАНО

### ✅ Анализ фотографий до/после

**Endpoint:** `POST /photo-analysis/analyze-before-after`

**Файлы:**

- Controller: `/Users/one.van/Desktop/kanban_ai_agent/src/features/photo-analysis/analyze-before-after-photos/analyze-before-after-photos.controller.ts`
- Service: `/Users/one.van/Desktop/kanban_ai_agent/src/features/photo-analysis/analyze-before-after-photos/analyze-before-after-photos.service.ts`
- Request DTO: `/Users/one.van/Desktop/kanban_ai_agent/src/features/photo-analysis/analyze-before-after-photos/analyze-before-after-photos.request.dto.ts`
- Response DTO: `/Users/one.van/Desktop/kanban_ai_agent/src/features/photo-analysis/analyze-before-after-photos/analyze-before-after-photos.response.dto.ts`
- Tests: `/Users/one.van/Desktop/kanban_ai_agent/src/features/photo-analysis/analyze-before-after-photos/analyze-before-after-photos.spec.ts`

**Пример из кода:**

```typescript
@Post('analyze-before-after')
@ApiAnalyzeBeforeAfterPhotos()
async handle(
  @Body() requestDto: AnalyzeBeforeAfterPhotosRequestDto,
): Promise<AnalyzeBeforeAfterPhotosResponseDto> {
  return this.service.execute(requestDto);
}
```

**Бизнес-функциональность:**

- Сравнение фотографий до и после выполнения работ
- AI-анализ качества выполнения задач
- Автоматическая оценка прогресса проекта
- Генерация отчетов на основе визуального анализа

## Общие файлы блока

**Модуль:**

- `/Users/one.van/Desktop/kanban_ai_agent/src/modules/photo-analysis.module.ts`

**OpenAPI документация:**

- `/Users/one.van/Desktop/kanban_ai_agent/src/features/photo-analysis/analyze-before-after-photos/openapi.decorator.ts`

## Интеграция с другими блоками

**Связь с Jira Integration:**

- Эндпоинт `/jira/webhook/before-after` в блоке jira-integration обрабатывает webhook'и для фотографий
- Файл: `/Users/one.van/Desktop/kanban_ai_agent/src/features/jira-integration/process-webhook-before-after/process-webhook-before-after.controller.ts`

**Связь с AI Reporting:**

- Результаты анализа фотографий могут использоваться в отчетах
- Интеграция через общие AI сервисы (Claude, OpenAI)

## Зависимости для обработки изображений

**Package.json dependencies:**

```json
{
  "@anthropic-ai/sdk": "^0.64.0", // Claude для анализа изображений
  "openai": "^5.23.1", // OpenAI Vision API
  "form-data": "^4.0.4", // Для загрузки файлов
  "@types/form-data": "^2.5.2" // TypeScript типы
}
```

**Файл:** `/Users/one.van/Desktop/kanban_ai_agent/package.json`

## Покрытие функциональности

✅ **Анализ изображений**: AI-сравнение фотографий до/после  
✅ **Webhook интеграция**: Автоматическая обработка фото из Jira  
✅ **Структурированные ответы**: DTO для результатов анализа  
✅ **Документация**: OpenAPI спецификация  
✅ **Тестирование**: Unit тесты для функциональности

## Возможности расширения

❓ **Качество изображений**: Эндпоинт для проверки качества фотографий  
❓ **Метрики анализа**: Детальные метрики сравнения (проценты изменений, области улучшений)  
❓ **Категоризация**: Классификация типов работ по фотографиям  
❓ **История анализов**: Хранение и получение истории анализов  
❓ **Пакетная обработка**: Анализ множественных фотографий одновременно

## Workflow с другими системами

1. **Jira → Photo Analysis:** Webhook получает фотографии из задач Jira
2. **Photo Analysis → AI Reporting:** Результаты анализа включаются в отчеты
3. **Photo Analysis → Jira:** Результаты могут добавляться как комментарии к задачам
