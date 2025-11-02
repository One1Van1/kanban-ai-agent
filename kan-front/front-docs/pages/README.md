# Pages Documentation

> ✅ **ОБНОВЛЕНО:** 2 ноября 2025 г.  
> Документация обновлена после рефакторинга. Отражает разделение app/ (routing) и src/pages/ (UI logic).

## 🎯 Назначение

Страницы организованы по **двухуровневой архитектуре**:

1. **app/** - Next.js 14 App Router (роутинг, 3-5 строк)
2. **src/pages/** - UI логика и компоненты (модульная структура)

## 📁 Структура страниц

### Уровень 1: Роутинг (app/)

| Страница         | Путь                   | Описание          |
| ---------------- | ---------------------- | ----------------- |
| **Home**         | `/`                    | Главная страница  |
| **Kanban**       | `/kanban`              | Канбан-доска      |
| **Agents**       | `/agents`              | Список AI агентов |
| **Agent Create** | `/agents/create`       | Создание агента   |
| **Flow Builder** | `/agents/flow-builder` | Конструктор flow  |
| **Flows**        | `/flows`               | Список flows      |
| **Flow Editor**  | `/flows/editor`        | Редактор flow     |
| **API Test**     | `/api-test`            | Тестирование API  |

### Уровень 2: UI Логика (src/pages/)

```
src/pages/
├── home/
│   ├── index.tsx                    # Главный компонент
│   └── components/                  # UI компоненты
│       ├── MetricCard.tsx
│       ├── MetricsSection.tsx
│       ├── QuickActionCard.tsx
│       └── QuickActionsSection.tsx
│
├── agents/
│   ├── index.tsx
│   ├── components/
│   │   ├── AgentCard.tsx
│   │   ├── AgentsGrid.tsx
│   │   └── AgentsHeader.tsx
│   └── hooks/
│       └── useAgents.ts
│
├── agent-create/
│   ├── index.tsx
│   ├── components/
│   │   ├── AgentCreateForm.tsx
│   │   ├── BasicInfoSection.tsx
│   │   └── ModelConfigSection.tsx
│   └── hooks/
│       └── useAgentCreate.ts
│
├── flows/
│   ├── index.tsx
│   ├── components/
│   │   ├── EditableFlowCard.tsx
│   │   ├── FlowsFilters.tsx
│   │   └── FlowsHeader.tsx
│   └── hooks/
│       └── useFlows.ts
│
├── flow-builder/
│   ├── index.tsx
│   └── components/
│       ├── blocks/                  # Блоки flow
│       ├── canvas/                  # Canvas (React Flow)
│       ├── dialogs/                 # Диалоги
│       ├── edges/                   # Связи
│       ├── properties/              # Панель свойств
│       ├── sidebar/                 # Боковая панель
│       └── toolbar/                 # Тулбар
│
└── flow-editor/                     # 🆕 НОВАЯ СТРАНИЦА
    ├── index.tsx                    # 83 строки (после рефакторинга)
    ├── components/
    │   ├── FlowEditorToolbar.tsx
    │   ├── FlowsList.tsx
    │   └── FlowEditorContent.tsx
    └── hooks/
        ├── useFlowEditor.ts
        └── useFlowsList.ts
```

## ⚙️ Основные принципы

### 1. Разделение app/ и src/pages/

**app/** - ТОЛЬКО роутинг:

```typescript
// app/agents/page.tsx (5 строк)
import { AgentsPageContent } from '@/src/pages/agents';

export default function AgentsPage() {
  return <AgentsPageContent />;
}
```

**src/pages/** - UI логика:

```typescript
// src/pages/agents/index.tsx
export function AgentsPageContent() {
  const { agents, isLoading } = useAgents();

  return (
    <div>
      <AgentsHeader />
      <AgentsGrid agents={agents} loading={isLoading} />
    </div>
  );
}
```

### 2. Модульная структура каждой страницы

```
page-name/
├── index.tsx              # Главный компонент
├── components/            # UI компоненты страницы
│   ├── Component1.tsx
│   ├── Component2.tsx
│   └── index.ts          # Экспорты
└── hooks/                # Логика страницы
    ├── usePageLogic.ts
    └── index.ts          # Экспорты
```

---

## 🌐 Детали страниц

### Home Page (`/`)

**Роутинг:** `app/page.tsx` (5 строк)  
**UI Логика:** `src/pages/home/` (4 компонента)

**Компоненты:**

- `MetricsSection` - секция с метриками
- `MetricCard` - карточка метрики
- `QuickActionsSection` - секция быстрых действий
- `QuickActionCard` - карточка действия

**Функционал:**

- ✅ Отображение метрик проекта
- ✅ Быстрые ссылки на разделы
- ✅ Адаптивный дизайн

---

### Agents Page (`/agents`)

**Роутинг:** `app/agents/page.tsx` (5 строк)  
**UI Логика:** `src/pages/agents/` (3 компонента + 1 хук)

**Компоненты:**

- `AgentsHeader` - заголовок с кнопкой создания
- `AgentsGrid` - сетка карточек агентов
- `AgentCard` - карточка агента

**Хуки:**

- `useAgents` - загрузка и управление списком агентов

**Функционал:**

- ✅ Список всех агентов
- ✅ Создание нового агента (→ `/agents/create`)
- ✅ Создание flow (→ `/agents/flow-builder`)
- ✅ Просмотр статистики
- ✅ Фильтрация и поиск

**API:**

- `GET /api/agents` - получить список
- `DELETE /api/agents/:id` - удалить агента

---

### Agent Create Page (`/agents/create`)

**Роутинг:** `app/agents/create/page.tsx` (5 строк)  
**UI Логика:** `src/pages/agent-create/` (3 компонента + 1 хук)

**Компоненты:**

- `AgentCreateForm` - основная форма
- `BasicInfoSection` - базовая информация
- `ModelConfigSection` - конфигурация модели

**Хуки:**

- `useAgentCreate` - логика создания агента

**Функционал:**

- ✅ Форма создания агента
- ✅ Выбор модели (GPT-4, Claude, etc.)
- ✅ Настройка параметров
- ✅ Валидация данных
- ✅ Сохранение агента

**API:**

- `POST /api/agents` - создать агента

---

### Flows Page (`/flows`)

**Роутинг:** `app/flows/page.tsx` (5 строк)  
**UI Логика:** `src/pages/flows/` (3 компонента + 1 хук)

**Компоненты:**

- `FlowsHeader` - заголовок страницы
- `FlowsFilters` - фильтры и поиск
- `EditableFlowCard` - карточка flow с редактированием

**Хуки:**

- `useFlows` - загрузка и управление flows

**Функционал:**

- ✅ Список всех flows
- ✅ Создание нового flow
- ✅ Редактирование inline
- ✅ Удаление flow
- ✅ Фильтрация по статусу
- ✅ Поиск

**API:**

- `GET /api/flows` - получить список
- `PUT /api/flows/:id` - обновить flow
- `DELETE /api/flows/:id` - удалить flow

---

### Flow Builder Page (`/agents/flow-builder`) ⭐

**Роутинг:** `app/agents/flow-builder/page.tsx` (5 строк)  
**UI Логика:** `src/pages/flow-builder/` (сложная структура)

**Основные компоненты:**

1. **Blocks** (блоки flow):
   - `TriggerBlock` - блок триггера
   - `ActionBlock` - блок действия
   - `LogicBlock` - блок логики
   - `ContextBlock` - блок контекста
   - `WaitBlock` - блок ожидания
   - `ResultBlock` - блок результата

2. **Canvas**:
   - `FlowCanvas` - главный canvas (React Flow)
   - `DynamicConnectionLine` - динамические связи

3. **Dialogs**:
   - `SaveFlowDialog` - сохранение flow
   - `ConfirmDeleteDialog` - подтверждение удаления
   - `ConfirmCascadeDeleteDialog` - каскадное удаление

4. **Edges**:
   - `StyledSmoothStepEdge` - стилизованные связи
   - `StraightEdge` - прямые связи

5. **Other**:
   - `PropertiesPanel` - панель свойств блока
   - `BlockPalette` - палитра блоков
   - `FlowToolbar` - тулбар редактора

**Функционал:**

- ✅ Drag & Drop блоков
- ✅ Создание связей между блоками
- ✅ Редактирование свойств
- ✅ Сохранение flow
- ✅ Валидация структуры
- ✅ Экспорт/импорт

**Технологии:**

- React Flow - библиотека для node-based UI
- Zustand - state management
- React DnD - drag and drop

---

### Flow Editor Page (`/flows/editor`) 🆕

**Роутинг:** `app/flows/editor/page.tsx` (5 строк)  
**UI Логика:** `src/pages/flow-editor/` (3 компонента + 2 хука)

**Компоненты:**

- `FlowEditorToolbar` - тулбар редактора (Save, Export, Import)
- `FlowsList` - список flows для выбора
- `FlowEditorContent` - основной редактор

**Хуки:**

- `useFlowEditor` - логика редактирования flow
- `useFlowsList` - логика списка flows

**Функционал:**

- ✅ Редактирование существующих flows
- ✅ Выбор flow из списка
- ✅ Экспорт в JSON/PDF
- ✅ Импорт из JSON
- ✅ Merge flows (объединение)
- ✅ Quick delete mode
- ✅ Cascade delete

**Особенности:**

- 🎯 Рефакторинг: 748 строк → 83 строки в index.tsx
- 🎯 Модульная структура
- 🎯 Переиспользуемые компоненты из flow-builder

**API:**

- `GET /api/flows/:id` - получить flow
- `PUT /api/flows/:id` - обновить flow
- `POST /api/flows/export/json` - экспорт JSON
- `POST /api/flows/export/pdf` - экспорт PDF
- `POST /api/flows/import` - импорт flow

---

### Kanban Page (`/kanban`)

**Роутинг:** `app/kanban/page.tsx` (5 строк)  
**UI Логика:** `src/pages/kanban/`

**Функционал:**

- ✅ Kanban доска
- ✅ Drag & Drop задач
- ✅ Создание/редактирование задач
- ✅ Статусы задач

---

## 📊 Сравнение: До vs После

| Метрика                         | До рефакторинга | После     |
| ------------------------------- | --------------- | --------- |
| **Строк в app/page.tsx**        | 144             | 5 (-97%)  |
| **Строк в app/agents/page.tsx** | 241             | 5 (-98%)  |
| **Строк в flow-editor**         | 748             | 83 (-89%) |
| **Модульность**                 | ❌ Нет          | ✅ Да     |
| **Переиспользование**           | ❌ Сложно       | ✅ Легко  |

---

## 📚 Дополнительно

### Смотри также:

- [FOLDER_GUIDE.md](../FOLDER_GUIDE.md) - Полный гайд по структуре
- [REFACTORING_GUIDE.md](../docs/REFACTORING_GUIDE.md) - Гайд по рефакторингу
- [components/README.md](../components/README.md) - Документация компонентов

---

**Обновлено:** 2 ноября 2025 г.  
**Статус:** ✅ Актуально  
**Версия:** 2.0 (после рефакторинга)

**Компоненты:**

```
<FlowsPage>
  <FlowToolbar>
    <SaveButton />
    <ConvertButton />
  </FlowToolbar>

  <FlowCanvas>
    <BlockPalette />
    <ReactFlow>
      <FlowBlock type="start" />
      <FlowBlock type="action" />
      <FlowBlock type="end" />
    </ReactFlow>
  </FlowCanvas>

  <BlockEditor />
</FlowsPage>
```

**API Calls:**

- GET `/api/flows` - список флоу
- POST `/api/flows/create` - создать
- PUT `/api/flows/:id` - обновить
- POST `/api/flows/:id/convert` - конвертировать в агента
- DELETE `/api/flows/:id` - удалить

---

### API Test Page (`/api-test`)

**Файл:** `app/api-test/page.tsx`

**Назначение:** Тестирование API endpoints

**Функционал:**

- Формы для тестирования API
- Отображение ответов
- Отладка интеграции

---

## 🔧 Layouts

### Root Layout

**Файл:** `app/layout.tsx`

**Содержит:**

- HTML структуру
- Global styles
- Theme provider
- Metadata

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## 🎯 Навигация

### Between Pages

```typescript
import Link from 'next/link';

<Link href="/kanban">Go to Kanban</Link>
<Link href="/agents">Go to Agents</Link>
<Link href="/flows">Go to Flows</Link>
```

### Programmatic Navigation

```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/flows');
router.back();
```

---

## 📋 Создание новой страницы

### 1. Создайте папку и файл

```bash
mkdir -p app/new-page
touch app/new-page/page.tsx
```

### 2. Добавьте компонент

```typescript
export default function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
    </div>
  );
}
```

### 3. Добавьте в навигацию

```typescript
<Link href="/new-page">New Page</Link>
```

---

## 🎯 Best Practices

- ✅ Используйте Server Components где возможно
- ✅ Client Components только для интерактивности
- ✅ Loading.tsx для loading states
- ✅ Error.tsx для error boundaries
- ✅ Metadata для SEO

---

## 🔗 Связи

**Используется в:**

- Next.js App Router
- Layout components
- Navigation

**Использует:**

- Components (Kanban, Agents, Flow)
- API routes
- Backend endpoints
