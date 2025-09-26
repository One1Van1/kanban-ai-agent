# 🎯 План интеграции Claude 3.5 Sonnet для анализа стрижек "ДО/ПОСЛЕ"

## 📋 Обзор задачи

**ТЕКУЩЕЕ СОСТОЯНИЕ:** Парикмахер пишет текстовый отчет + загружает 1 фото результата
**НОВАЯ КОНЦЕПЦИЯ:** Парикмахер загружает только 2 фото (ДО и ПОСЛЕ), система автоматически анализирует

## 🏗️ Архитектурные изменения (согласно проектным правилам)

### ⚡ **Принцип: ONE ENDPOINT = ONE FOLDER**

Все новые сервисы должны быть изолированы в отдельных папках эндпоинтов согласно инструкции.

### 1. Новые эндпоинты (каждый в отдельной папке)

#### 1.1 Анализ фото ДО/ПОСЛЕ

```
src/photo-analysis-agent/analyze-before-after-photos/
├── analyze-before-after-photos.controller.ts    # POST /photo-analysis-agent/analyze-before-after-photos
├── analyze-before-after-photos.service.ts       # Основная бизнес-логика
├── analyze-before-after-photos.dto.ts           # DTO для запроса/ответа
├── analyze-before-after-photos.module.ts        # NestJS модуль
├── analyze-before-after-photos.interface.ts     # Интерфейсы
├── claude-vision.service.ts                     # Claude API сервис (локальный)
└── analyze-before-after-photos.spec.ts          # Тесты
```

#### 1.2 Время-трекинг из Jira

```
src/ai-agent/track-work-time/
├── track-work-time.controller.ts    # GET /ai-agent/track-work-time/:taskKey
├── track-work-time.service.ts       # Логика расчета времени
├── track-work-time.dto.ts           # DTO для времени
├── track-work-time.module.ts        # NestJS модуль
├── track-work-time.interface.ts     # Интерфейсы времени
└── track-work-time.spec.ts          # Тесты
```

#### 1.3 Автоматический анализ задач (обновленный процесс)

```
src/ai-agent/process-before-after-task/
├── process-before-after-task.controller.ts    # POST /ai-agent/process-before-after-task
├── process-before-after-task.service.ts       # Новая логика без текста
├── process-before-after-task.dto.ts           # DTO для новой логики
├── process-before-after-task.module.ts        # NestJS модуль
├── process-before-after-task.interface.ts     # Интерфейсы
└── process-before-after-task.spec.ts          # Тесты
```

### 2. Глобальная конфигурация (разрешена в config блоке)

#### 2.1 Конфигурация Claude

```
src/config/claude.config.ts
```

- API ключ Anthropic
- Модель: claude-3-5-sonnet-20241022
- Настройки запросов (температура, max_tokens)

### 3. Изменения существующих эндпоинтов (следуя правилу изоляции)

#### 3.1 Jira Webhook Service (модификация)

```
src/jira/haircut-report-webhook/
├── haircut-report-webhook.controller.ts    # Существующий
├── haircut-report-webhook.service.ts       # ИЗМЕНИТЬ: интеграция с новыми эндпоинтами
├── haircut-report-webhook.dto.ts           # ИЗМЕНИТЬ: поддержка фото ДО/ПОСЛЕ
├── haircut-report-webhook.module.ts        # ИЗМЕНИТЬ: импорт новых модулей
├── haircut-report-webhook.interface.ts     # ИЗМЕНИТЬ: новые интерфейсы
└── haircut-report-webhook.spec.ts          # ОБНОВИТЬ: тесты
```

**ИЗМЕНЕНИЯ в webhook service:**

- Фильтровать attachments по именам (before/after/до/после)
- Извлекать worklog данные вместо комментариев
- Интегрировать с новыми эндпоинтами через HTTP вызовы

### 4. Удаляемые компоненты

#### 4.1 Устаревшие файлы (УДАЛИТЬ)

```
❌ src/ai-agent/process-haircut-task/   # Старая логика с текстовыми отчетами
❌ src/photo-analysis-agent/analyze-haircut-photo/  # Одиночный анализ фото
❌ src/photo-analysis-agent/shared/ollama-vision.service.ts  # Заменяется Claude
```

#### 4.2 Зависимости (УДАЛИТЬ через yarn)

```bash
yarn remove ollama  # Если использовался Ollama SDK
```

## 📦 Установка зависимостей (только yarn!)

### Новые пакеты

```bash
yarn add @anthropic-ai/sdk
yarn add class-validator class-transformer
```

### ❌ НИКОГДА НЕ ИСПОЛЬЗОВАТЬ:

```bash
npm install @anthropic-ai/sdk  ❌
npm add anything               ❌
```

### ✅ ВСЕГДА ИСПОЛЬЗОВАТЬ:

```bash
yarn add package-name          ✅
yarn remove package-name       ✅
yarn install                   ✅
```

## 🔄 Новый workflow (полная изоляция эндпоинтов)

### Этап 1: Подготовка задачи

1. **Создание задачи** - парикмахер создает задачу в Jira
2. **Статус "In Progress"** - автоматически фиксируется время начала
3. **Загрузка фото ДО** - имя файла содержит "до"/"before"/"pre"

### Этап 2: Выполнение работы

1. **Работа идет** - время отслеживается в статусе "In Progress"
2. **Загрузка фото ПОСЛЕ** - имя файла содержит "после"/"after"/"post"
3. **Перевод в Review** - триггер для автоматической обработки

### Этап 3: Автоматический анализ (через изолированные эндпоинты)

1. **Webhook получает событие** - `/jira/webhook/haircut-report`
2. **Извлечение времени работы** - вызов `/ai-agent/track-work-time/:taskKey`
3. **Анализ фото ДО/ПОСЛЕ** - вызов `/photo-analysis-agent/analyze-before-after-photos`
4. **Итоговая обработка** - вызов `/ai-agent/process-before-after-task`
5. **Результат в Jira** - автоматический перевод в Done с отчетом

### Интеграция между эндпоинтами

```typescript
// В webhook service
async processHaircutTask(taskKey: string) {
  // 1. Получить время работы
  const timeData = await this.httpService.get(`/ai-agent/track-work-time/${taskKey}`);

  // 2. Анализ фото
  const photoAnalysis = await this.httpService.post('/photo-analysis-agent/analyze-before-after-photos', {
    taskKey,
    beforePhoto: extractedBeforePhoto,
    afterPhoto: extractedAfterPhoto
  });

  // 3. Финальная обработка
  const result = await this.httpService.post('/ai-agent/process-before-after-task', {
    taskKey,
    timeData: timeData.data,
    photoAnalysis: photoAnalysis.data
  });

  return result.data;
}
```

## 📊 Структура данных

### Before/After Analysis Result

```typescript
interface BeforeAfterAnalysisResult {
  // Анализ изменений
  transformation: {
    category: 'Быстрая стрижка' | 'Обычная стрижка' | 'Сложная стрижка';
    difficultyLevel: number; // 1-10
    visualChanges: string[];
    technique: string;
  };

  // Оценка качества
  quality: {
    overallScore: number; // 1-10
    evenness: number;
    transitions: number;
    symmetry: number;
    cleanliness: number;
    styleCompliance: number;
  };

  // Анализ времени
  timeAnalysis: {
    actualMinutes: number;
    expectedRange: string;
    efficiency: 'excellent' | 'good' | 'acceptable' | 'slow';
  };

  // Итоговый отчет
  report: {
    summary: string;
    strengths: string[];
    improvements: string[];
    finalPrice: number;
  };
}
```

## 🚀 План реализации (строго по архитектурным правилам)

### Фаза 1: Подготовка проекта ✅

```bash
# Установка зависимостей (только yarn!)
yarn add @anthropic-ai/sdk
yarn add @nestjs/axios

# Создание конфигурации
touch src/config/claude.config.ts
```

### Фаза 2: Создание изолированных эндпоинтов ✅

#### 2.1 Эндпоинт анализа фото ДО/ПОСЛЕ

```bash
mkdir -p src/photo-analysis-agent/analyze-before-after-photos
cd src/photo-analysis-agent/analyze-before-after-photos

# Создание всех необходимых файлов
touch analyze-before-after-photos.controller.ts
touch analyze-before-after-photos.service.ts
touch analyze-before-after-photos.dto.ts
touch analyze-before-after-photos.module.ts
touch analyze-before-after-photos.interface.ts
touch claude-vision.service.ts  # Локальный сервис
touch analyze-before-after-photos.spec.ts
```

#### 2.2 Эндпоинт трекинга времени

```bash
mkdir -p src/ai-agent/track-work-time
cd src/ai-agent/track-work-time

# Создание всех необходимых файлов (полная изоляция)
touch track-work-time.controller.ts
touch track-work-time.service.ts
touch track-work-time.dto.ts
touch track-work-time.module.ts
touch track-work-time.interface.ts
touch track-work-time.spec.ts
```

#### 2.3 Эндпоинт обработки задач ДО/ПОСЛЕ

```bash
mkdir -p src/ai-agent/process-before-after-task
cd src/ai-agent/process-before-after-task

# Создание всех необходимых файлов
touch process-before-after-task.controller.ts
touch process-before-after-task.service.ts
touch process-before-after-task.dto.ts
touch process-before-after-task.module.ts
touch process-before-after-task.interface.ts
touch process-before-after-task.spec.ts
```

### Фаза 3: Модификация webhook (интеграция через HTTP) ✅

```typescript
// Модификация существующего webhook для интеграции
src / jira / haircut - report - webhook / haircut - report - webhook.service.ts;
```

### Фаза 4: Удаление устаревших компонентов ✅

```bash
# Удаление старых эндпоинтов (нарушающих изоляцию)
rm -rf src/ai-agent/process-haircut-task
rm -rf src/photo-analysis-agent/analyze-haircut-photo
rm -rf src/photo-analysis-agent/shared  # Shared нарушает изоляцию

# Обновление модулей импортов
```

### Фаза 5: Тестирование изолированных эндпоинтов ✅

```bash
# Тестирование каждого эндпоинта отдельно
yarn test track-work-time
yarn test analyze-before-after-photos
yarn test process-before-after-task
yarn test haircut-report-webhook

# Интеграционные тесты
yarn test:e2e
```

### Фаза 6: Продакшен готовность ✅

```bash
yarn build  # Проверка сборки
yarn start:prod  # Тест продакшен режима
```

## 💰 Экономика решения

### Стоимость Claude API (приблизительно)

- **Анализ одной пары фото:** ~$0.02-0.05
- **В месяц (100 стрижек):** ~$2-5
- **В год:** ~$24-60

### Экономия времени

- **Парикмахер:** не пишет отчеты (+5 мин на стрижку)
- **Менеджер:** не проверяет отчеты (+2 мин на задачу)
- **Объективность:** исключены субъективные оценки

**ROI:** Экономия времени окупает стоимость API в 50+ раз

## 🔧 Технические требования

### Зависимости

```bash
yarn add @anthropic-ai/sdk
```

### Environment Variables

```env
CLAUDE_API_KEY=sk-ant-api03-xxx
CLAUDE_MODEL=claude-3-5-sonnet-20241022
CLAUDE_MAX_TOKENS=2048
```

### Jira Setup

- Настроить time tracking в Jira проекте
- Обучить парикмахеров именованию фото:
  - `before_client_name.jpg`
  - `after_client_name.jpg`

## 🚨 Риски и митигация

### Риски

1. **API недоступность** - Claude API может быть недоступен
2. **Превышение лимитов** - достижение rate limits
3. **Неправильное именование фото** - парикмахеры забудут теги
4. **Качество фото** - плохие фото для анализа

### Митигация

1. **Fallback на Ollama** при недоступности Claude
2. **Rate limiting** и очереди запросов
3. **Автоматическое определение** по времени загрузки
4. **Валидация размера** и качества изображений

## 📋 Чек-лист готовности (строгое соблюдение правил)

### ✅ Архитектурные требования

- [ ] Каждый эндпоинт в отдельной папке (ONE ENDPOINT = ONE FOLDER)
- [ ] Никаких shared сервисов (полная изоляция)
- [ ] Каждая папка содержит: controller, service, dto, module, interface, spec
- [ ] Использование только yarn (NEVER NPM!)
- [ ] Kebab-case именование папок и файлов

### ✅ Технические требования

- [ ] API ключ Claude получен и настроен
- [ ] Конфигурация `claude.config.ts` создана
- [ ] Зависимости установлены через `yarn add`
- [ ] Все эндпоинты изолированы и самодостаточны

### ✅ Эндпоинты созданы

- [ ] `/photo-analysis-agent/analyze-before-after-photos` - полная папка
- [ ] `/ai-agent/track-work-time` - полная папка
- [ ] `/ai-agent/process-before-after-task` - полная папка
- [ ] Webhook модифицирован для интеграции через HTTP

### ✅ Старый код удален

- [ ] `src/ai-agent/process-haircut-task/` - УДАЛЕНО
- [ ] `src/photo-analysis-agent/analyze-haircut-photo/` - УДАЛЕНО
- [ ] `src/photo-analysis-agent/shared/` - УДАЛЕНО (нарушает изоляцию)
- [ ] Ollama зависимости удалены через `yarn remove`

### ✅ Тестирование

- [ ] Каждый эндпоинт протестирован отдельно
- [ ] Интеграционные тесты между эндпоинтами
- [ ] E2E тесты полного workflow
- [ ] Сборка проекта через `yarn build`

### ✅ Документация

- [ ] README обновлен с новыми эндпоинтами
- [ ] API документация через Swagger
- [ ] Инструкции для парикмахеров (именование фото)

---

## 🎯 **Ключевые принципы обновленного плана:**

### ✅ **Соблюдение архитектуры:**

- **ONE ENDPOINT = ONE FOLDER** - строго соблюдается
- **Полная изоляция** - никаких shared сервисов
- **Модульность** - каждый блок независим
- **Только yarn** - никакого npm

### ✅ **Новый подход:**

- **3 изолированных эндпоинта** вместо модификации существующих
- **HTTP интеграция** между сервисами
- **Claude в локальном сервисе** эндпоинта
- **Удаление нарушающих** изоляцию компонентов

**План теперь полностью соответствует архитектурным правилам проекта! 🚀**

**Готов к реализации после вашего одобрения!** ✨
