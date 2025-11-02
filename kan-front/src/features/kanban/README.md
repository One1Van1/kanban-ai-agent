# 📋 Kanban (Канбан доска)

## 🎯 Назначение

Блок **Kanban** отвечает за управление задачами на канбан доске.

Позволяет создавать, редактировать, перемещать задачи между колонками, назначать исполнителей и оставлять комментарии.

---

## 📂 Структура

```
kanban/
├── README.md              # Этот файл
├── components/            # Компоненты канбана (пока не созданы)
├── hooks/                 # Хуки для канбана
├── stores/                # Zustand store
│   └── kanban.store.ts    # Главный store канбана
├── api/                   # API методы
│   └── kanban.api.ts      # API клиент канбана
├── types/                 # TypeScript типы
│   └── index.ts           # Task, Board, Comment и т.д.
└── utils/                 # Утилиты (пока не созданы)
```

---

## 🔌 API методы

### Tasks (Задачи):

- `kanbanAPI.tasks.getById(id)` — получить задачу по ID
- `kanbanAPI.tasks.getByColumn(column)` — получить все задачи в колонке
- `kanbanAPI.tasks.create(data)` — создать новую задачу
- `kanbanAPI.tasks.update(id, data)` — обновить задачу
- `kanbanAPI.tasks.delete(id)` — удалить задачу
- `kanbanAPI.tasks.assign(id, data)` — назначить задачу пользователю
- `kanbanAPI.tasks.move(id, data)` — переместить задачу в другую колонку
- `kanbanAPI.tasks.changeStatus(id, data)` — изменить статус задачи

### Boards (Доски):

- `kanbanAPI.boards.getStructure(id)` — получить структуру доски
- `kanbanAPI.boards.getStats(id)` — получить статистику доски

### Comments (Комментарии):

- `kanbanAPI.comments.getByTask(taskId)` — получить все комментарии к задаче
- `kanbanAPI.comments.add(taskId, data)` — добавить комментарий
- `kanbanAPI.comments.update(commentId, data)` — обновить комментарий
- `kanbanAPI.comments.delete(commentId)` — удалить комментарий

**Файл:** `api/kanban.api.ts`

---

## 🪝 Основные хуки

### `useKanbanStore`

Главный Zustand store для управления состоянием канбана.

**Поля состояния:**

- `boards` — список всех досок
- `currentBoard` — текущая активная доска
- `tasks` — список задач
- `comments` — комментарии к задачам
- `isLoading` — индикатор загрузки
- `error` — ошибки

**Actions:**

- `fetchBoards()` — загрузить все доски
- `fetchBoard(id)` — загрузить конкретную доску
- `fetchTasksByColumn(column)` — загрузить задачи колонки
- `createTask(data)` — создать задачу
- `updateTask(id, data)` — обновить задачу
- `deleteTask(id)` — удалить задачу
- `moveTask(id, column, position)` — переместить задачу
- `assignTask(id, email)` — назначить задачу
- `fetchComments(taskId)` — загрузить комментарии
- `addComment(taskId, content)` — добавить комментарий

---

## 📊 Store (состояние)

**Файл:** `stores/kanban.store.ts`

**Использование:**

```tsx
import { useKanbanStore } from '@/src/features/kanban/stores/kanban.store';

function KanbanPage() {
  const { tasks, fetchTasksByColumn, moveTask } = useKanbanStore();

  useEffect(() => {
    fetchTasksByColumn('todo');
  }, []);

  // ...
}
```

---

## 🧩 Компоненты

> **TODO:** Компоненты пока не созданы, будут добавлены позже.

Планируемые компоненты:

- `KanbanBoard` — главная доска
- `KanbanColumn` — колонка с задачами
- `KanbanTask` — карточка задачи
- `TaskDetailsDialog` — диалог с деталями задачи
- `AddTaskButton` — кнопка добавления задачи

---

## 📝 Типы

**Файл:** `types/index.ts`

### Основные типы:

- `Task` — модель задачи
- `Board` — модель доски
- `BoardColumn` — модель колонки
- `Comment` — модель комментария
- `CreateTaskData` — данные для создания задачи
- `UpdateTaskData` — данные для обновления задачи
- `MoveTaskData` — данные для перемещения задачи
- `BoardStats` — статистика доски

**Использование:**

```tsx
import type { Task, Board, Comment } from '@/src/features/kanban/types';
```

---

## 🔗 Зависимости

**От каких блоков зависит:**

- `shared/api` — использует базовый HTTP клиент
- `shared/components/ui` — использует UI компоненты (Button, Card и т.д.)

**Какие блоки зависят от этого:**

- Нет (канбан — независимый блок)

---

## 📝 Примеры использования

### Получить задачи колонки:

```tsx
import { useKanbanStore } from '@/src/features/kanban/stores/kanban.store';

const { tasks, fetchTasksByColumn } = useKanbanStore();

await fetchTasksByColumn('in-progress');
```

### Создать задачу:

```tsx
import { kanbanAPI } from '@/src/features/kanban/api/kanban.api';

await kanbanAPI.tasks.create({
  title: 'Новая задача',
  description: 'Описание задачи',
  column: 'todo',
  priority: 'high',
});
```

### Переместить задачу:

```tsx
const { moveTask } = useKanbanStore();

await moveTask('task-id', 'done', 0);
```

---

## 🚀 Следующие шаги

1. ✅ Создана структура блока
2. ✅ Создан API клиент
3. ✅ Создан store
4. ✅ Созданы типы
5. ⏳ Создать компоненты для канбана
6. ⏳ Создать хуки (useKanbanDragDrop, useTaskFilters и т.д.)

---

**Дата создания:** 2 ноября 2025  
**Последнее обновление:** 2 ноября 2025
