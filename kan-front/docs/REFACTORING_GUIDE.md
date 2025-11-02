# 🔄 Refactoring Guide - Frontend Architecture

> Руководство по новой модульной архитектуре после рефакторинга (ноябрь 2025)

---

## 📋 Содержание

1. [Что изменилось](#что-изменилось)
2. [Новая структура](#новая-структура)
3. [Миграция кода](#миграция-кода)
4. [Примеры рефакторинга](#примеры-рефакторинга)
5. [Чек-лист для новых страниц](#чек-лист-для-новых-страниц)

---

## 🎯 Что изменилось

### До рефакторинга ❌

```
kan-front/
├── app/
│   └── agents/
│       └── page.tsx        # 500+ строк - ВСЁ В ОДНОМ ФАЙЛЕ
├── components/
│   ├── ui/                 # Дубликаты!
│   └── agents/
│       └── AgentCard.tsx
└── src/
    └── (пусто)
```

**Проблемы:**

- ❌ Огромные файлы (500-750 строк)
- ❌ Смешанная логика и UI
- ❌ Дублирующиеся компоненты
- ❌ Сложно тестировать
- ❌ Сложно поддерживать

---

### После рефакторинга ✅

```
kan-front/
├── app/                           # ТОЛЬКО РОУТИНГ (3-5 строк)
│   └── agents/
│       └── page.tsx
├── src/
│   ├── pages/                     # UI ЛОГИКА СТРАНИЦ
│   │   └── agents/
│   │       ├── index.tsx          # Основной компонент (5-10 строк)
│   │       ├── components/        # UI компоненты страницы
│   │       │   ├── AgentCard.tsx
│   │       │   ├── AgentsGrid.tsx
│   │       │   └── AgentsHeader.tsx
│   │       └── hooks/             # Логика страницы
│   │           └── useAgents.ts
│   ├── features/                  # БИЗНЕС-ЛОГИКА (API, Store, Types)
│   │   └── agents/
│   │       ├── api/
│   │       ├── stores/
│   │       └── types/
│   └── shared/                    # ПЕРЕИСПОЛЬЗУЕМОЕ
│       ├── components/ui/
│       ├── hooks/
│       └── utils/
└── components/                    # ❌ УДАЛЕНО (были дубликаты)
```

**Преимущества:**

- ✅ Модульность (файлы 50-200 строк)
- ✅ Разделение ответственности
- ✅ Переиспользование кода
- ✅ Легко тестировать
- ✅ Легко поддерживать

---

## 📁 Новая структура

### 1. app/ - Next.js Роутинг (App Router)

**Назначение:** ТОЛЬКО роутинг, минимум кода (3-5 строк)

**Пример:**

```typescript
// app/agents/page.tsx
import { AgentsPageContent } from '@/src/pages/agents';

export default function AgentsPage() {
  return <AgentsPageContent />;
}
```

**Правила:**

- ✅ Только `page.tsx`, `layout.tsx`, `route.ts`
- ✅ Минимум логики (3-5 строк)
- ❌ НЕТ бизнес-логики
- ❌ НЕТ UI компонентов

---

### 2. src/pages/ - UI Логика Страниц

**Назначение:** UI компоненты и логика конкретной страницы

**Структура:**

```
src/pages/{page-name}/
├── index.tsx              # Главный компонент (экспортируется в app/)
├── components/            # UI компоненты этой страницы
│   ├── ComponentA.tsx
│   ├── ComponentB.tsx
│   └── index.ts          # Экспорты
└── hooks/                # Хуки для этой страницы
    ├── usePageLogic.ts
    └── index.ts          # Экспорты
```

**Пример - agents:**

```
src/pages/agents/
├── index.tsx                    # 10 строк - главный компонент
├── components/
│   ├── AgentCard.tsx           # 120 строк - карточка агента
│   ├── AgentsGrid.tsx          # 80 строк - сетка агентов
│   ├── AgentsHeader.tsx        # 60 строк - заголовок
│   └── index.ts                # Экспорты
└── hooks/
    ├── useAgents.ts            # 150 строк - логика списка агентов
    └── index.ts                # Экспорты
```

**Правила:**

- ✅ Компоненты специфичны для страницы
- ✅ Хуки содержат логику UI (state, effects)
- ❌ НЕТ API вызовов (используй `src/features/`)
- ❌ НЕТ глобального состояния (используй `src/features/`)

---

### 3. src/features/ - Бизнес-логика

**Назначение:** API, глобальное состояние (Zustand), типы данных

**Структура:**

```
src/features/{feature-name}/
├── api/
│   └── {feature}.api.ts        # API методы
├── stores/
│   └── {feature}.store.ts      # Zustand store
└── types/
    └── index.ts                # TypeScript типы
```

**Пример - agents:**

```
src/features/agents/
├── api/
│   └── agents.api.ts           # GET /agents, POST /agents/create
├── stores/
│   └── agents.store.ts         # useAgentsStore (глобальное состояние)
└── types/
    └── index.ts                # AgentConfig, AgentStatus, etc.
```

**Правила:**

- ✅ API запросы здесь
- ✅ Глобальное состояние (Zustand)
- ✅ TypeScript типы для бизнес-логики
- ❌ НЕТ UI компонентов

---

### 4. src/shared/ - Переиспользуемое

**Назначение:** Код, используемый в разных местах приложения

**Структура:**

```
src/shared/
├── components/
│   ├── ui/                     # shadcn/ui компоненты
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── common/                 # Общие компоненты
│       ├── theme-provider.tsx
│       └── language-toggle.tsx
├── hooks/                      # Общие хуки
│   ├── use-dialog.tsx
│   └── useBlockEdit.ts
├── api/                        # HTTP клиент
│   ├── http-client.ts
│   └── interceptors.ts
├── i18n/                       # Интернационализация
│   └── translations.ts
└── utils/                      # Утилиты
    └── flow-converter.ts
```

**Правила:**

- ✅ Переиспользуется в 2+ местах
- ✅ Независимо от конкретной страницы
- ✅ Общие UI компоненты
- ✅ Общие хуки и утилиты

---

## 🔄 Миграция кода

### Старые пути → Новые пути

| Старо ❌                          | Ново ✅                                               |
| --------------------------------- | ----------------------------------------------------- |
| `components/ui/button.tsx`        | `src/shared/components/ui/button.tsx`                 |
| `components/agents/AgentCard.tsx` | `src/pages/agents/components/AgentCard.tsx`           |
| `app/agents/page.tsx` (500 строк) | `app/agents/page.tsx` (5 строк) + `src/pages/agents/` |
| `@/components/ui/button`          | `@/src/shared/components/ui/button`                   |

---

### Импорты - До и После

#### ❌ Старые импорты (НЕ РАБОТАЮТ):

```typescript
import { Button } from '@/components/ui/button';
import { AgentCard } from '@/components/agents/AgentCard';
```

#### ✅ Новые импорты (ПРАВИЛЬНО):

```typescript
import { Button } from '@/src/shared/components/ui/button';
import { AgentCard } from '@/src/pages/agents/components/AgentCard';
import { agentsAPI } from '@/src/features/agents/api/agents.api';
import { useAgentsStore } from '@/src/features/agents/stores/agents.store';
```

---

## 📝 Примеры рефакторинга

### Пример 1: Простая страница (Home)

#### ДО (144 строки в одном файле):

```typescript
// app/page.tsx - 144 строки
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [metrics, setMetrics] = useState([]);

  // 100+ строк логики и UI...

  return (
    <div>
      {/* Много JSX */}
    </div>
  );
}
```

#### ПОСЛЕ (5 строк в app/, остальное в src/):

**1. app/page.tsx** (5 строк):

```typescript
import { HomePageContent } from '@/src/pages/home';

export default function HomePage() {
  return <HomePageContent />;
}
```

**2. src/pages/home/index.tsx** (главный компонент):

```typescript
'use client';

import { MetricsSection, QuickActionsSection } from './components';

export function HomePageContent() {
  return (
    <div className="min-h-screen bg-background">
      <MetricsSection />
      <QuickActionsSection />
    </div>
  );
}
```

**3. src/pages/home/components/** (разбитые компоненты):

```
src/pages/home/components/
├── MetricsSection.tsx       # 80 строк
├── MetricCard.tsx           # 40 строк
├── QuickActionsSection.tsx  # 60 строк
├── QuickActionCard.tsx      # 45 строк
└── index.ts                 # Экспорты
```

**Результат:**

- ✅ 144 строки → 5 строк в app/
- ✅ Логика разбита на 4 компонента
- ✅ Каждый компонент < 100 строк
- ✅ Легко тестировать

---

### Пример 2: Сложная страница (Flow Editor)

#### ДО (748 строк в одном файле):

```typescript
// src/pages/flow-editor/index.tsx - 748 СТРОК!
export default function FlowEditorPageContent() {
  // Огромное количество state
  const [flows, setFlows] = useState([]);
  const [isPaletteOpen, setIsPaletteOpen] = useState(true);
  const [quickDeleteMode, setQuickDeleteMode] = useState(false);
  // ... ещё 20+ useState

  // Огромное количество функций
  const handleSaveFlow = async () => { /* 50 строк */ };
  const handleExportJSON = async () => { /* 40 строк */ };
  const handleImportFlow = () => { /* 150 строк */ };
  // ... ещё 10+ функций

  // Огромное количество JSX
  return (
    <div>
      {/* 400+ строк JSX */}
    </div>
  );
}
```

#### ПОСЛЕ (83 строки в index.tsx):

**1. Создали хуки** (вся логика):

```typescript
// src/pages/flow-editor/hooks/useFlowEditor.ts - 349 строк
export function useFlowEditor() {
  // Вся логика редактора
  const [isPaletteOpen, setIsPaletteOpen] = useState(true);
  const [quickDeleteMode, setQuickDeleteMode] = useState(false);

  const handleSaveFlow = async () => {
    /* логика */
  };
  const handleExportJSON = async () => {
    /* логика */
  };
  const handleImportFlow = () => {
    /* логика */
  };

  return {
    // State
    isPaletteOpen,
    quickDeleteMode,
    // Handlers
    handleSaveFlow,
    handleExportJSON,
    handleImportFlow,
  };
}

// src/pages/flow-editor/hooks/useFlowsList.ts - 65 строк
export function useFlowsList() {
  // Логика списка flows
}
```

**2. Создали компоненты** (UI):

```typescript
// src/pages/flow-editor/components/FlowEditorToolbar.tsx - 137 строк
export function FlowEditorToolbar({ onSave, onExport, ... }) {
  return (
    <div className="toolbar">
      {/* Только UI тулбара */}
    </div>
  );
}

// src/pages/flow-editor/components/FlowsList.tsx - 147 строк
export function FlowsList({ flows, onSelect }) {
  return (
    <div className="grid">
      {/* Только UI списка */}
    </div>
  );
}

// src/pages/flow-editor/components/FlowEditorContent.tsx - 126 строк
export function FlowEditorContent({ currentFlow, ... }) {
  return (
    <div className="editor">
      {/* Только UI редактора */}
    </div>
  );
}
```

**3. Главный файл** (координатор):

```typescript
// src/pages/flow-editor/index.tsx - 83 строки
export default function FlowEditorPageContent() {
  const editor = useFlowEditor();
  const flowsList = useFlowsList(!editor.flowId);

  if (!editor.flowId) {
    return <FlowsList flows={flowsList.flows} />;
  }

  if (editor.isLoading) {
    return <LoadingState />;
  }

  return (
    <FlowEditorContent
      currentFlow={editor.currentFlow}
      onSave={editor.handleSaveFlow}
      onExport={editor.handleExportJSON}
    />
  );
}
```

**Результат:**

- ✅ 748 строк → 83 строки в index.tsx
- ✅ 2 хука для логики (414 строк)
- ✅ 3 компонента для UI (410 строк)
- ✅ Каждый файл < 350 строк
- ✅ Логика отделена от UI
- ✅ Легко тестировать

---

### Пример 3: Удаление дубликатов

#### ДО:

```
components/ui/                    # ❌ Дубликат 1
├── button.tsx
├── card.tsx
└── ... (16 файлов)

src/shared/components/ui/         # ❌ Дубликат 2
├── button.tsx
├── card.tsx
└── ... (19 файлов)
```

**Проблема:** 14 файлов дублировались!

#### ПОСЛЕ:

```
src/shared/components/ui/         # ✅ Единственный источник
├── button.tsx
├── card.tsx
├── dialog.tsx
├── ... (19 файлов)

components/                       # ❌ УДАЛЕНО
```

**Действия:**

1. Заменили все импорты: `@/components/ui/` → `@/src/shared/components/ui/`
2. Обновили `components.json` (конфиг shadcn/ui)
3. Удалили папку `components/`

**Результат:**

- ✅ Один источник истины
- ✅ Нет дубликатов
- ✅ Чистая структура

---

## ✅ Чек-лист для новых страниц

Используй этот чек-лист при создании новой страницы:

### 1. Создать роут в app/

```typescript
// app/my-page/page.tsx
import { MyPageContent } from '@/src/pages/my-page';

export default function MyPage() {
  return <MyPageContent />;
}
```

✅ Файл создан  
✅ Импорт из src/pages/  
✅ Не более 5 строк

---

### 2. Создать структуру в src/pages/

```
src/pages/my-page/
├── index.tsx
├── components/
│   └── index.ts
└── hooks/
    └── index.ts
```

✅ Папка создана  
✅ index.tsx создан  
✅ Подпапки components/ и hooks/ созданы

---

### 3. Разбить UI на компоненты

Правило: **Компонент = одна ответственность**

```
src/pages/my-page/components/
├── MyPageHeader.tsx      # Заголовок
├── MyPageContent.tsx     # Основной контент
├── MyPageSidebar.tsx     # Боковая панель
└── index.ts              # export { MyPageHeader, ... }
```

✅ Каждый компонент < 200 строк  
✅ Понятные названия  
✅ index.ts для экспортов

---

### 4. Вынести логику в хуки

Правило: **Хук = одна логическая единица**

```
src/pages/my-page/hooks/
├── useMyPageData.ts      # Загрузка данных
├── useMyPageFilters.ts   # Фильтры
└── index.ts              # export { useMyPageData, ... }
```

✅ Хуки содержат только UI логику  
✅ API вызовы в src/features/  
✅ index.ts для экспортов

---

### 5. Создать feature (если нужно)

Если страница требует API/Store/Types:

```
src/features/my-feature/
├── api/
│   └── my-feature.api.ts
├── stores/
│   └── my-feature.store.ts
└── types/
    └── index.ts
```

✅ API методы в api/  
✅ Zustand store в stores/  
✅ TypeScript типы в types/

---

### 6. Проверить импорты

Все импорты должны использовать правильные пути:

```typescript
// ✅ ПРАВИЛЬНО
import { Button } from '@/src/shared/components/ui/button';
import { MyComponent } from '@/src/pages/my-page/components/MyComponent';
import { myAPI } from '@/src/features/my-feature/api/my-feature.api';

// ❌ НЕПРАВИЛЬНО
import { Button } from '@/components/ui/button';
import { MyComponent } from '@/components/my-page/MyComponent';
```

✅ Все импорты начинаются с `@/src/`  
✅ UI компоненты из `@/src/shared/components/`  
✅ API из `@/src/features/`

---

## 🎯 Золотые правила

1. **app/ → ROUTING** (3-5 строк)
   - Только page.tsx, layout.tsx, route.ts
   - Минимум логики

2. **src/pages/ → UI** (50-200 строк на компонент)
   - UI компоненты страницы
   - Локальные хуки
   - Визуальная логика

3. **src/features/ → LOGIC** (API + Store + Types)
   - API запросы
   - Глобальное состояние
   - Бизнес-типы

4. **src/shared/ → REUSABLE** (переиспользуемое)
   - Общие UI компоненты
   - Общие хуки
   - Утилиты

5. **Один компонент = одна ответственность**
   - Максимум 200 строк
   - Понятное название
   - Одна задача

6. **Логика отдельно от UI**
   - Хуки для логики
   - Компоненты для UI
   - Чистота кода

---

## 📊 Сравнение: До vs После

| Метрика               | До рефакторинга | После рефакторинга |
| --------------------- | --------------- | ------------------ |
| **Строк в index.tsx** | 748             | 83 (-89%)          |
| **Количество файлов** | 1               | 9 (+800%)          |
| **Хуки**              | 0               | 2                  |
| **Компоненты**        | 0 (всё в одном) | 3                  |
| **Тестируемость**     | ❌ Сложно       | ✅ Легко           |
| **Поддержка**         | ❌ Сложно       | ✅ Легко           |
| **Переиспользование** | ❌ Нет          | ✅ Да              |
| **Читаемость**        | ❌ Низкая       | ✅ Высокая         |

---

## 🚀 Дальнейшие шаги

1. ✅ Рефакторинг выполнен для:
   - home
   - agents
   - agent-create
   - flows
   - flow-builder
   - flow-editor

2. 🔄 Требуется рефакторинг:
   - kanban (если есть)
   - Другие страницы по необходимости

3. 📚 Обновить документацию:
   - ✅ FOLDER_GUIDE.md - создан
   - ✅ REFACTORING_GUIDE.md - этот файл
   - 🔄 front-docs/ - обновляется

---

## 💡 Советы

1. **Начинай с малого:**
   - Сначала вынеси 1-2 компонента
   - Затем добавь хуки
   - Постепенно рефактори всё

2. **Тестируй после каждого шага:**
   - Проверяй TypeScript ошибки
   - Запускай dev server
   - Тестируй функционал

3. **Используй существующие примеры:**
   - Смотри на flow-editor (лучший пример)
   - Копируй структуру
   - Адаптируй под свою страницу

4. **Не бойся переименовывать:**
   - Плохое название → переименуй
   - Большой компонент → раздели
   - Сложная логика → вынеси в хук

---

**Создано:** 2 ноября 2025 г.  
**Статус:** ✅ Актуально  
**Версия:** 1.0
