# 📋 Kanban-Management - Управление досками и задачами

## 📋 Содержание

- [Обзор](#обзор)
- [GET - Получение данных](#get---получение-данных)
  - [get-task-details](#get-task-details) - Детальная информация о задаче
  - [get-tasks-by-column](#get-tasks-by-column) - Все задачи в колонке
  - [get-board-structure](#get-board-structure) - Структура доски (колонки, правила)
  - [get-board-summary](#get-board-summary) - Сводка по доске
  - [get-task-history](#get-task-history) - История изменений задачи
  - [get-agent-task-history](#get-agent-task-history) - История действий агента
  - [get-task-comments](#get-task-comments) - Комментарии задачи
  - [get-task-timelog](#get-task-timelog) - Учет времени по задаче
  - [get-task-statistics](#get-task-statistics) - Статистика по задачам
  - [get-available-statuses](#get-available-statuses) - Доступные статусы
  - [get-user-activity](#get-user-activity) - Активность пользователя
  - [download-attachment](#download-attachment) - Скачать вложение
- [POST - Создание данных](#post---создание-данных)
  - [create-task](#create-task) - Создать новую задачу
  - [add-task-comment](#add-task-comment) - Добавить комментарий
  - [add-comment-reaction](#add-comment-reaction) - Добавить реакцию к комментарию
  - [upload-attachment](#upload-attachment) - Загрузить файл
  - [add-task-timelog](#add-task-timelog) - Добавить учет времени
  - [assign-task](#assign-task) - Назначить задачу
  - [create-board-column](#create-board-column) - Создать колонку
  - [create-task-link](#create-task-link) - Связать задачи
  - [execute-task-transition](#execute-task-transition) - Выполнить переход
  - [store-task-history](#store-task-history) - Сохранить в историю
  - [track-agent-in-task](#track-agent-in-task) - Отследить действие агента
- [PATCH - Обновление данных](#patch---обновление-данных)
  - [update-task](#update-task) - Обновить задачу
  - [update-task-details](#update-task-details) - Обновить детали
  - [move-task-to-column](#move-task-to-column) - Переместить задачу
  - [change-task-status](#change-task-status) - Изменить статус
  - [update-task-assignment](#update-task-assignment) - Изменить исполнителя
  - [update-task-labels](#update-task-labels) - Обновить метки
  - [update-comment](#update-comment) - Редактировать комментарий
  - [update-board-column](#update-board-column) - Обновить колонку
  - [reorder-board-columns](#reorder-board-columns) - Изменить порядок колонок
- [DELETE - Удаление данных](#delete---удаление-данных)
  - [delete-task](#delete-task) - Удалить задачу
  - [delete-comment](#delete-comment) - Удалить комментарий
  - [delete-task-attachment](#delete-task-attachment) - Удалить вложение
  - [delete-task-link](#delete-task-link) - Удалить связь
  - [delete-board-column](#delete-board-column) - Удалить колонку
  - [delete-board](#delete-board) - Удалить доску

---

## 🎯 Обзор

**Назначение:** Полное управление Kanban-досками, задачами, колонками, комментариями и вложениями в локальной системе.

**Основные возможности:**

- ✅ CRUD операции с задачами
- ✅ Управление досками и колонками
- ✅ Комментарии и реакции
- ✅ Файлы и вложения
- ✅ История изменений
- ✅ Timelog (учет времени)
- ✅ Статистика и аналитика
- ✅ Связи между задачами
- ✅ Статусы и переходы

**Всего эндпойнтов:** 38 (GET: 12, POST: 11, PATCH: 9, DELETE: 6)

---

## 📥 GET - Получение данных

### get-task-details

**HTTP:** `GET /kanban-management/:id`  
**Назначение:** Получить детальную информацию о задаче.

**🔗 Связи:**

- 📥 Frontend, `ai-agent/execute-agent-action`, `context-management/fetch-task-context`

---

### get-tasks-by-column

**HTTP:** `GET /kanban-management/:column/tasks`  
**Назначение:** Получить все задачи в колонке.

**Query:** `{ limit?, offset?, sortBy? }`

**🔗 Связи:**

- 📥 Frontend (Kanban board), `ai-reporting/generate-report`

---

### get-board-structure

**HTTP:** `GET /kanban-management/structure`  
**Назначение:** Получить структуру доски (колонки, правила, настройки).

**Выходные данные:**

```typescript
{
  boardId: string;
  name: string;
  columns: Array<{
    id: string;
    name: string;
    position: number;
    wip_limit?: number;
    rules?: object;
  }>;
  settings: object;
}
```

**🔗 Связи:**

- 📥 Frontend (инициализация), `ai-agent/configure-column-instructions`, `flow-management/execute-flow`

---

### get-board-summary

**HTTP:** `GET /kanban-management/summary`  
**Назначение:** Получить сводку по доске (кол-во задач, статусы).

**🔗 Связи:**

- 📥 Frontend (дашборд), `ai-reporting/generate-report`

---

### get-task-history

**HTTP:** `GET /kanban-management/task/:taskId`  
**Назначение:** Получить историю изменений задачи.

**🔗 Связи:**

- 📤 `TaskHistoryRepository.find()`
- 📥 Frontend (timeline), `ai-agent/agent-learning`

---

### get-agent-task-history

**HTTP:** `GET /kanban-management/agent/:agentId`  
**Назначение:** Получить историю действий агента с задачами.

**🔗 Связи:**

- 📥 `ai-agent/get-agent-activity`, Frontend

---

### get-task-comments

**HTTP:** `GET /kanban-management/:id/comments`  
**Назначение:** Получить все комментарии к задаче.

**🔗 Связи:**

- 📥 Frontend, `ai-agent/execute-agent-action`

---

### get-task-timelog

**HTTP:** `GET /kanban-management/:id/timelog`  
**Назначение:** Получить учет времени по задаче.

**🔗 Связи:**

- 📥 Frontend, `ai-reporting/generate-report`

---

### get-task-statistics

**HTTP:** `GET /kanban-management/statistics`  
**Назначение:** Получить статистику по всем задачам.

**Query:** `{ dateFrom?, dateTo?, userId? }`

**🔗 Связи:**

- 📥 Frontend, `ai-reporting/generate-report`

---

### get-available-statuses

**HTTP:** `GET /kanban-management`  
**Назначение:** Получить доступные статусы задач.

---

### get-user-activity

**HTTP:** `GET /kanban-management/:id/activity`  
**Назначение:** Получить активность пользователя.

---

### download-attachment

**HTTP:** `GET /kanban-management/attachment/:attachmentId/download`  
**Назначение:** Скачать вложение задачи.

**🔗 Связи:**

- 📤 File Storage
- 📥 Frontend

---

## ➕ POST - Создание данных

### create-task

**HTTP:** `POST /kanban-management`  
**Назначение:** Создать новую задачу.

**Входные данные:**

```typescript
{
  title: string;
  description?: string;
  column: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  dueDate?: Date;
  labels?: string[];
  estimatedTime?: number;
}
```

**🔗 Связи:**

- 📤 Database, `store-task-history`, `ai-agent/execute-agent-action`
- 📥 Frontend, `jira-integration/*`

---

### add-task-comment

**HTTP:** `POST /kanban-management/:id/comments`  
**Назначение:** Добавить комментарий к задаче.

**Входные данные:**

```typescript
{
  text: string;
  userId: string;
  mentions?: string[];
}
```

**🔗 Связи:**

- 📤 Database, `notifications/*`
- 📥 Frontend, `ai-agent/execute-agent-action`

---

### add-comment-reaction

**HTTP:** `POST /kanban-management/comment/:commentId/reactions`  
**Назначение:** Добавить реакцию к комментарию (👍, ❤️, 🎉).

**Входные данные:**

```typescript
{
  emoji: string;
  userId: string;
}
```

---

### upload-attachment

**HTTP:** `POST /kanban-management/:id/attachments`  
**Назначение:** Загрузить файл к задаче.

**Входные данные:** FormData с файлом

**🔗 Связи:**

- 📤 File Storage
- 📥 Frontend, `photo-analysis/analyze-before-after-photos`

---

### add-task-timelog

**HTTP:** `POST /kanban-management/:id/timelog`  
**Назначение:** Добавить запись учета времени.

**Входные данные:**

```typescript
{
  timeSpent: number; // минуты
  date: Date;
  comment?: string;
  userId: string;
}
```

---

### assign-task

**HTTP:** `POST /kanban-management/:id/assign`  
**Назначение:** Назначить задачу пользователю.

**🔗 Связи:**

- 📤 `store-task-history`, `notifications/send-email`
- 📥 Frontend

---

### create-board-column

**HTTP:** `POST /kanban-management/columns`  
**Назначение:** Создать новую колонку на доске.

**Входные данные:**

```typescript
{
  name: string;
  position: number;
  wipLimit?: number;
  rules?: object;
}
```

**🔗 Связи:**

- 📥 Frontend, `ai-agent/configure-column-instructions`

---

### create-task-link

**HTTP:** `POST /kanban-management/:id/links`  
**Назначение:** Создать связь между задачами.

**Входные данные:**

```typescript
{
  targetTaskId: string;
  linkType: 'blocks' | 'relates' | 'duplicates' | 'depends_on';
}
```

---

### execute-task-transition

**HTTP:** `POST /kanban-management/:id/transition`  
**Назначение:** Выполнить переход задачи (workflow).

**🔗 Связи:**

- 📤 `change-task-status`, `ai-agent/execute-agent-action`
- 📥 Frontend

---

### store-task-history

**HTTP:** `POST /kanban-management/store`  
**Назначение:** Сохранить запись в историю задачи (внутренний).

**🔗 Связи:**

- 📥 Все эндпойнты изменения задач, `ai-agent/execute-agent-action`

---

### track-agent-in-task

**HTTP:** `POST /kanban-management/track-agent-in-task/:agentId`  
**Назначение:** Отследить действие агента в задаче.

**🔗 Связи:**

- 📤 `store-task-history`
- 📥 `ai-agent/execute-agent-action`

---

## 🔧 PATCH - Обновление данных

### update-task

**HTTP:** `PATCH /kanban-management/:id`  
**Назначение:** Частично обновить задачу.

**Входные данные:**

```typescript
{
  title?: string;
  description?: string;
  priority?: string;
  dueDate?: Date;
}
```

**🔗 Связи:**

- 📤 `store-task-history`
- 📥 Frontend, `ai-agent/execute-agent-action`

---

### update-task-details

**HTTP:** `PATCH /kanban-management/:id/details`  
**Назначение:** Обновить детали задачи.

---

### move-task-to-column

**HTTP:** `PATCH /kanban-management/:id/move`  
**Назначение:** Переместить задачу в другую колонку.

**Входные данные:**

```typescript
{
  targetColumn: string;
  position?: number;
}
```

**🔗 Связи:**

- 📤 `store-task-history`, `ai-agent/execute-agent-action` (триггер on_enter/on_exit)
- 📥 Frontend (drag-and-drop)

---

### change-task-status

**HTTP:** `PATCH /kanban-management/:id/status`  
**Назначение:** Изменить статус задачи.

**🔗 Связи:**

- 📤 `store-task-history`, `ai-agent/execute-agent-action`
- 📥 Frontend

---

### update-task-assignment

**HTTP:** `PATCH /kanban-management/:id/assignment`  
**Назначение:** Изменить исполнителя задачи.

**🔗 Связи:**

- 📤 `notifications/*`
- 📥 Frontend

---

### update-task-labels

**HTTP:** `PATCH /kanban-management/task/:taskId/labels`  
**Назначение:** Обновить метки задачи.

---

### update-comment

**HTTP:** `PATCH /kanban-management/comment/:commentId`  
**Назначение:** Редактировать комментарий.

---

### update-board-column

**HTTP:** `PATCH /kanban-management/:id`  
**Назначение:** Обновить настройки колонки.

---

### reorder-board-columns

**HTTP:** `PATCH /kanban-management/board/columns/reorder`  
**Назначение:** Изменить порядок колонок на доске.

**Входные данные:**

```typescript
{
  columnIds: string[]; // Массив ID в новом порядке
}
```

**🔗 Связи:**

- 📥 Frontend (drag-and-drop колонок)

---

## 🗑️ DELETE - Удаление данных

### delete-task

**HTTP:** `DELETE /kanban-management/task/:taskId`  
**Назначение:** Удалить задачу (soft delete).

**🔗 Связи:**

- 📤 `store-task-history`
- 📥 Frontend

---

### delete-comment

**HTTP:** `DELETE /kanban-management/comment/:commentId`  
**Назначение:** Удалить комментарий.

---

### delete-task-attachment

**HTTP:** `DELETE /kanban-management/task/:taskId/attachment/:attachmentId`  
**Назначение:** Удалить вложение задачи.

**🔗 Связи:**

- 📤 File Storage (удаление файла)

---

### delete-task-link

**HTTP:** `DELETE /kanban-management/task/:taskId/link/:linkId`  
**Назначение:** Удалить связь между задачами.

---

### delete-board-column

**HTTP:** `DELETE /kanban-management/board-column/:columnId`  
**Назначение:** Удалить колонку с доски.

⚠️ **Внимание:** Требует перемещения задач из удаляемой колонки.

---

### delete-board

**HTTP:** `DELETE /kanban-management/board/:boardId`  
**Назначение:** Удалить всю доску.

⚠️ **Внимание:** Критическая операция с подтверждением.

---

## 📊 Сводка по блоку

**Всего эндпойнтов:** 38

**Распределение:**

- GET: 12 (получение)
- POST: 11 (создание)
- PATCH: 9 (обновление)
- DELETE: 6 (удаление)

**Основные операции:**

- ✅ Управление задачами (CRUD)
- ✅ Доски и колонки
- ✅ Комментарии и реакции
- ✅ Файлы и вложения
- ✅ История и аудит
- ✅ Timelog
- ✅ Статистика
- ✅ Связи задач
- ✅ Workflow

**Ключевые зависимости:**

- `ai-agent/*` - триггеры агентов
- `notifications/*` - уведомления
- `context-management/*` - контекст
- `ai-reporting/*` - отчеты
- File Storage
- Database (TypeORM)

**Основные сущности:**

- Task, Board, Column, Comment, Attachment, TaskHistory, Timelog, TaskLink

---

**Последнее обновление:** 20 октября 2025
