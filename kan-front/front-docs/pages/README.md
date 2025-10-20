# Pages Documentation

Документация по всем страницам приложения (Next.js App Router).

## 🎯 Назначение

Next.js 14 App Router страницы для навигации и отображения основного функционала.

## 📁 Структура страниц

| Страница     | Путь        | Описание         | Компоненты               |
| ------------ | ----------- | ---------------- | ------------------------ |
| **Home**     | `/`         | Главная страница | Навигация к функциям     |
| **Kanban**   | `/kanban`   | Канбан-доска     | KanbanBoard, TaskCard    |
| **Agents**   | `/agents`   | AI агенты        | AgentList, AgentCard     |
| **Flows**    | `/flows`    | Flow Builder     | FlowCanvas, BlockPalette |
| **API Test** | `/api-test` | Тестирование API | Test forms               |

## ⚙️ Основные возможности

- ✅ Next.js App Router (современный роутинг)
- ✅ Server Components где возможно
- ✅ Client Components для интерактивности
- ✅ Layouts для общей структуры
- ✅ Loading и Error states

## 🌐 Детали страниц

### Home Page (`/`)

**Файл:** `app/page.tsx`

**Назначение:** Лендинг и навигация

**Содержимое:**

- Приветствие
- Ссылки на основные разделы
- Quick actions

```typescript
export default function Home() {
  return (
    <div>
      <h1>Kanban AI Agent</h1>
      <nav>
        <Link href="/kanban">Kanban Board</Link>
        <Link href="/agents">AI Agents</Link>
        <Link href="/flows">Flow Builder</Link>
      </nav>
    </div>
  );
}
```

---

### Agents Page (`/agents`)

**Файл:** `app/agents/page.tsx`

**Назначение:** Управление AI агентами

**Функционал:**

- Список всех агентов
- Создание нового агента
- Запуск агента
- Просмотр результатов
- Удаление агента

**Подстраницы:**

- `/agents` - список агентов
- `/agents/create` - форма создания
- `/agents/[id]` - детали агента

**Компоненты:**

```
<AgentsPage>
  <AgentList>
    <AgentCard />
    <AgentCard />
  </AgentList>
  <CreateAgentButton />
</AgentsPage>
```

**API Calls:**

- GET `/api/agents` - получить список
- POST `/api/agents/create` - создать агента
- POST `/api/agents/run` - запустить
- GET `/api/agents/result/:id` - результат

---

### Flows Page (`/flows`) ⭐

**Файл:** `app/flows/page.tsx`

**Назначение:** Визуальный Flow Builder

**Функционал:**

- Drag-and-drop блоков
- Создание связей
- Редактирование блоков
- Сохранение флоу
- Конвертация в агента
- Загрузка флоу

**Подстраницы:**

- `/flows` - список флоу
- `/flows/new` - новый флоу
- `/flows/[flowId]` - редактор флоу
- `/flows/[flowId]/editor` - альтернативный редактор

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
