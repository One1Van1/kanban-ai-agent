# 🔄 Flow-Management - Управление процессами

## 📋 Содержание

- [Обзор](#обзор)
- [Эндпойнты](#эндпойнты)
  - [create-flow](#create-flow) - Создать новый flow
  - [get-flow](#get-flow) - Получить flow по ID
  - [list-flows](#list-flows) - Список всех flows с пагинацией
  - [update-flow](#update-flow) - Обновить существующий flow
  - [delete-flow](#delete-flow) - Удалить flow
  - [clone-flow](#clone-flow) - Клонировать flow
  - [execute-flow](#execute-flow) - Запустить выполнение flow
  - [deploy-to-agent](#deploy-to-agent) - Конвертировать flow в agent

---

## 🎯 Обзор

**Назначение:** Управление визуальными flow-процессами, их создание, выполнение и конвертация в AI-агентов.

**Основные возможности:**

- ✅ Создание и редактирование flow
- ✅ Выполнение flow с AI-блоками
- ✅ Конвертация flow в agent instructions
- ✅ Клонирование и версионирование
- ✅ Deploy flow в production агентов

**Сущности:**

- `Flow` - основная сущность flow

**Всего эндпойнтов:** 8

---

## 📌 Эндпойнты

### create-flow

**HTTP:** `POST /flow-management`  
**Назначение:** Создать новый flow с блоками и связями.

**🔗 Связи:**

- 📤 `FlowRepository.create()` - создание в БД
- 📤 `cache-management` - кэширование
- 📥 Frontend: Flow Builder

---

### get-flow

**HTTP:** `GET /flow-management/:flowId`  
**Назначение:** Получить flow по ID с полной структурой блоков.

**🔗 Связи:**

- 📤 `FlowRepository.findOne()` - поиск
- 📥 Frontend: загрузка для редактирования
- 📥 `execute-flow` - перед выполнением

---

### list-flows

**HTTP:** `GET /flow-management`  
**Назначение:** Получить список всех flow с пагинацией.

**Query параметры:**

```typescript
{
  page?: number;
  limit?: number;
  status?: 'draft' | 'active' | 'archived';
}
```

**🔗 Связи:**

- 📤 `FlowRepository.findAndCount()` - список
- 📥 Frontend: страница списка flows

---

### update-flow

**HTTP:** `PUT /flow-management/:flowId`  
**Назначение:** Обновить существующий flow.

**🔗 Связи:**

- 📤 `FlowRepository.update()` - обновление
- 📤 `cache-management` - инвалидация кэша
- 📥 Frontend: сохранение изменений

---

### delete-flow

**HTTP:** `DELETE /flow-management/:flowId`  
**Назначение:** Удалить flow.

**🔗 Связи:**

- 📤 `FlowRepository.delete()` - удаление
- 📤 Soft delete с архивацией
- 📥 Frontend: кнопка удаления

---

### clone-flow

**HTTP:** `POST /flow-management/:flowId/clone`  
**Назначение:** Клонировать существующий flow.

**🔗 Связи:**

- 📤 `get-flow` - получение оригинала
- 📤 `create-flow` - создание копии
- 📥 Frontend: дублирование flow

---

### execute-flow

**HTTP:** `POST /flow-management/:flowId/execute`  
**Назначение:** Запустить выполнение flow с контекстом задачи.

**Входные данные:**

```typescript
{
  flowId: string;
  context: {
    taskId?: string;
    boardId?: string;
    variables?: Record<string, any>;
  };
  async?: boolean;
}
```

**🔗 Связи:**

**📤 Исходящие связи:**

- `get-flow` - получение flow
- `ai-agent/execute-agent-action` - выполнение AI блоков
- `jira-integration/*` - интеграционные блоки
- `context-management/get-flow-variables` - переменные
- `queue-management` - асинхронное выполнение

**📥 Входящие связи:**

- Frontend: кнопка "Run Flow"
- `jira-webhook-handler-correct` - автоматический запуск

**🔄 Процесс:**

1. Получение flow и его блоков
2. Валидация структуры
3. Инициализация контекста
4. Последовательное выполнение блоков
5. Передача данных между блоками
6. Обработка ошибок
7. Возврат результата

---

### deploy-to-agent

**HTTP:** `POST /flow-management/:flowId/deploy`  
**Назначение:** Конвертировать flow в agent instructions и развернуть.

**Входные данные:**

```typescript
{
  flowId: string;
  agentName?: string;
  boardType?: string;
  autoActivate?: boolean;
}
```

**Выходные данные:**

```typescript
{
  success: boolean;
  agentId: string;
  instructionsCreated: number;
  deployedAt: Date;
}
```

**🔗 Связи:**

**📤 Исходящие связи:**

- `flow-conversion/convert-flow-to-agent` - конвертация
- `ai-agent/create-agent` - создание агента
- `ai-agent/configure-column-instructions` - создание инструкций

**📥 Входящие связи:**

- Frontend: кнопка "Deploy to Production"

**🔄 Процесс:**

1. Анализ flow структуры
2. Группировка блоков по триггерам
3. Генерация инструкций
4. Создание агента
5. Настройка инструкций
6. Активация агента
7. Возврат результата

---

## 📊 Сводка

**Всего эндпойнтов:** 8  
**Операции:** CRUD + Execute + Deploy + Clone

**Ключевые зависимости:**

- ai-agent
- flow-conversion
- context-management
- jira-integration
- queue-management

---

**Последнее обновление:** 20 октября 2025
