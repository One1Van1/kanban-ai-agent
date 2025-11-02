# 📋 ПЛАН РЕФАКТОРИНГА ФРОНТЕНДА

## 🎯 ЦЕЛЬ

Привести структуру фронтенда к такому же уровню модульности и понятности, как на бэкенде (по принципу "ONE BLOCK = ONE TASK").

---

## 📐 ЭТАП 1: ПРОЕКТИРОВАНИЕ НОВОЙ СТРУКТУРЫ

### 1.1 Целевая структура проекта

```
kan-front/
├── app/                          # Next.js App Router (страницы/роуты)
│   ├── (routes)/                 # Группировка роутов
│   │   ├── agents/
│   │   ├── flows/
│   │   ├── kanban/
│   │   └── api-test/
│   ├── layout.tsx
│   └── page.tsx
│
└── src/
    ├── features/                 # 🔥 ОСНОВНЫЕ БЛОКИ (как на бэке)
    │   ├── agents/               # Блок: Агенты
    │   │   ├── README.md         # 📝 Описание блока
    │   │   ├── components/       # Компоненты агентов
    │   │   ├── hooks/            # Хуки для агентов
    │   │   ├── stores/           # Zustand store агентов
    │   │   ├── api/              # API методы агентов
    │   │   ├── types/            # Типы агентов
    │   │   └── utils/            # Утилиты агентов
    │   │
    │   ├── flows/                # Блок: Управление флоу
    │   │   ├── README.md
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   ├── stores/
    │   │   ├── api/
    │   │   ├── types/
    │   │   └── utils/
    │   │
    │   ├── flow-builder/         # Блок: Конструктор флоу
    │   │   ├── README.md
    │   │   ├── components/
    │   │   │   ├── canvas/       # Компоненты канваса
    │   │   │   ├── blocks/       # Блоки (Action, Logic, Wait и т.д.)
    │   │   │   ├── toolbar/      # Тулбар
    │   │   │   ├── sidebar/      # Сайдбар (палитра блоков)
    │   │   │   ├── properties/   # Панель свойств
    │   │   │   ├── dialogs/      # Диалоги
    │   │   │   └── edges/        # Рёбра (связи)
    │   │   ├── hooks/
    │   │   ├── stores/
    │   │   ├── types/
    │   │   └── utils/
    │   │
    │   ├── kanban/               # Блок: Канбан доска
    │   │   ├── README.md
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   ├── stores/
    │   │   ├── api/
    │   │   ├── types/
    │   │   └── utils/
    │   │
    │   └── analytics/            # Блок: Аналитика (будущее)
    │       ├── README.md
    │       └── ...
    │
    ├── shared/                   # 🔧 ОБЩИЕ РЕСУРСЫ
    │   ├── components/           # UI компоненты (Button, Input, Card и т.д.)
    │   │   ├── ui/               # shadcn/ui компоненты
    │   │   └── common/           # Общие компоненты (ThemeToggle, LanguageToggle)
    │   │
    │   ├── hooks/                # Общие хуки (useDialog, useDebounce и т.д.)
    │   │
    │   ├── api/                  # 🌐 Базовый HTTP клиент
    │   │   ├── http-client.ts    # Axios конфиг, базовые методы
    │   │   ├── interceptors.ts   # Interceptors (auth, errors)
    │   │   └── types.ts          # Общие типы для API
    │   │
    │   ├── utils/                # Утилиты (helpers, formatters и т.д.)
    │   │
    │   ├── constants/            # Константы
    │   │
    │   ├── config/               # Конфигурации
    │   │   └── env.ts            # Env переменные
    │   │
    │   └── types/                # Глобальные типы
    │       └── index.ts
    │
    └── entities/                 # 📊 МОДЕЛИ ДАННЫХ (как Entity на бэке)
        ├── agent/
        │   └── agent.entity.ts   # Модель агента
        ├── flow/
        │   └── flow.entity.ts    # Модель флоу
        ├── task/
        │   └── task.entity.ts    # Модель задачи
        └── user/
            └── user.entity.ts    # Модель пользователя
```

---

### 1.2 Структура БЛОКА (Feature)

Каждый блок следует единому шаблону:

```
features/[feature-name]/
├── README.md                     # 📝 Описание блока
│   ├── Что делает блок
│   ├── Основные компоненты
│   ├── API методы
│   └── Зависимости
│
├── components/                   # Компоненты блока
│   ├── [ComponentName]/          # Каждый компонент в своей папке (если сложный)
│   │   ├── ComponentName.tsx
│   │   ├── ComponentName.types.ts
│   │   └── ComponentName.styles.ts (опционально)
│   └── SimpleComponent.tsx       # Простые компоненты отдельно
│
├── hooks/                        # Хуки блока
│   ├── use-[feature-name].ts     # Основной хук блока
│   └── use-[specific-logic].ts   # Специфичные хуки
│
├── stores/                       # Zustand store
│   └── [feature-name].store.ts   # Store блока
│
├── api/                          # API методы блока
│   └── [feature-name].api.ts     # API клиент блока
│
├── types/                        # Типы блока
│   └── index.ts                  # Экспорт всех типов
│
└── utils/                        # Утилиты блока
    └── [helper-name].ts          # Вспомогательные функции
```

---

## 🗂️ ЭТАП 2: АНАЛИЗ ТЕКУЩИХ ФАЙЛОВ И РАСПРЕДЕЛЕНИЕ

### 2.1 Большие файлы для разбиения

| Файл                    | Строки | Куда переносим                                 | Как разбиваем                                                                                          |
| ----------------------- | ------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `FlowCanvas.tsx`        | 1558   | `features/flow-builder/components/canvas/`     | Разбить на: `FlowCanvas.tsx`, `CanvasControls.tsx`, `CanvasBackground.tsx`, `CanvasNodes.tsx`          |
| `BlockPalette.tsx`      | 1433   | `features/flow-builder/components/sidebar/`    | Разбить на: `BlockPalette.tsx`, `BlockCategory.tsx`, `BlockItem.tsx`                                   |
| `flows/editor/page.tsx` | 751    | `app/(routes)/flows/editor/page.tsx`           | Вынести логику в `features/flows/hooks/use-flow-editor.ts`                                             |
| `PropertiesPanel.tsx`   | 583    | `features/flow-builder/components/properties/` | Разбить на: `PropertiesPanel.tsx`, `ActionProperties.tsx`, `LogicProperties.tsx`, `WaitProperties.tsx` |
| `ActionBlock.tsx`       | 568    | `features/flow-builder/components/blocks/`     | Разбить на: `ActionBlock.tsx`, `ActionTypeSelector.tsx`, `ActionConfig.tsx`                            |
| `LogicBlock.tsx`        | 555    | `features/flow-builder/components/blocks/`     | Разбить на: `LogicBlock.tsx`, `ConditionBuilder.tsx`, `LogicOperators.tsx`                             |

---

### 2.2 Распределение текущих компонентов

| Текущее расположение                | Новое расположение                  | Блок         |
| ----------------------------------- | ----------------------------------- | ------------ |
| `src/components/agents/`            | `features/agents/components/`       | agents       |
| `src/components/flows/`             | `features/flows/components/`        | flows        |
| `src/components/flow-builder/`      | `features/flow-builder/components/` | flow-builder |
| `src/components/kanban/`            | `features/kanban/components/`       | kanban       |
| `src/components/ui/`                | `shared/components/ui/`             | shared       |
| `src/components/mode-toggle.tsx`    | `shared/components/common/`         | shared       |
| `src/components/theme-provider.tsx` | `shared/components/common/`         | shared       |

---

### 2.3 Распределение stores

| Текущий файл                           | Новое расположение                                   |
| -------------------------------------- | ---------------------------------------------------- |
| `src/lib/stores/agents-store.ts`       | `features/agents/stores/agents.store.ts`             |
| `src/lib/stores/flow-builder-store.ts` | `features/flow-builder/stores/flow-builder.store.ts` |
| `src/lib/stores/flow-editor-store.ts`  | `features/flows/stores/flow-editor.store.ts`         |
| `src/lib/stores/kanban-store.ts`       | `features/kanban/stores/kanban.store.ts`             |

---

### 2.4 Создание API клиентов

| Блок      | Файл                                      | Методы из текущего `apiClient`                                     |
| --------- | ----------------------------------------- | ------------------------------------------------------------------ |
| agents    | `features/agents/api/agents.api.ts`       | `agents.getAll()`, `agents.create()`, `agents.execute()` и т.д.    |
| flows     | `features/flows/api/flows.api.ts`         | `flowManagement.createFlow()`, `flowManagement.listFlows()` и т.д. |
| kanban    | `features/kanban/api/kanban.api.ts`       | `kanban.tasks.*`, `kanban.boards.*`, `kanban.comments.*`           |
| analytics | `features/analytics/api/analytics.api.ts` | `analytics.productivity()`, `analytics.teamPerformance()`          |

---

## 🚀 ЭТАП 3: МИГРАЦИЯ (ПОШАГОВЫЙ ПЛАН)

### Шаг 1: Создание базовой структуры

**Действия:**

1. Создать папки `features/`, `shared/`, `entities/`
2. Создать структуру для базового HTTP клиента
3. Создать шаблон README.md для блоков

**Файлы для создания:**

```
src/
├── features/          # Создать пустую папку
├── shared/
│   └── api/
│       ├── http-client.ts
│       ├── interceptors.ts
│       └── types.ts
└── entities/          # Создать пустую папку
```

---

### Шаг 2: Миграция SHARED (общие ресурсы)

**Порядок:**

1. Перенести UI компоненты (`components/ui/` → `shared/components/ui/`)
2. Перенести общие компоненты (`mode-toggle.tsx`, `theme-provider.tsx` → `shared/components/common/`)
3. Перенести общие хуки (`src/hooks/` → `shared/hooks/`)
4. Перенести общие типы (`src/lib/types/` → `shared/types/`)
5. Создать `shared/README.md`

**Проверка:** Общие компоненты доступны через новые импорты ✅

---

### Шаг 3: Миграция блока KANBAN (самый простой)

**Порядок:**

1. Создать структуру `features/kanban/`
2. Перенести компоненты
3. Создать API клиент `kanban.api.ts`
4. Перенести store
5. Создать `README.md`
6. Обновить импорты в `app/kanban/page.tsx`
7. Тестировать работоспособность

**Проверка:** Канбан работает после миграции ✅

---

### Шаг 4: Миграция блока AGENTS

**Порядок:**

1. Создать структуру `features/agents/`
2. Перенести компоненты из `src/components/agents/`
3. Создать API клиент `agents.api.ts`
4. Перенести `agents-store.ts` → `features/agents/stores/`
5. Создать `README.md`
6. Обновить импорты в `app/agents/`
7. Тестировать

**Проверка:** Страница агентов работает ✅

---

### Шаг 5: Миграция блока FLOWS

**Порядок:**

1. Создать структуру `features/flows/`
2. Перенести компоненты из `src/components/flows/`
3. Создать API клиент `flows.api.ts`
4. Перенести `flow-editor-store.ts`
5. Вынести логику из `app/flows/editor/page.tsx` в хук `use-flow-editor.ts`
6. Создать `README.md`
7. Тестировать

**Проверка:** Редактор флоу работает ✅

---

### Шаг 6: Миграция блока FLOW-BUILDER (самый сложный)

**Порядок:**

1. Создать структуру `features/flow-builder/`
2. Разбить `FlowCanvas.tsx` (1558 строк):
   - `components/canvas/FlowCanvas.tsx` (главный компонент)
   - `components/canvas/CanvasControls.tsx` (кнопки зум, фит вью)
   - `components/canvas/CanvasBackground.tsx` (фон)
   - `components/canvas/CanvasNodes.tsx` (логика нод)
3. Разбить `BlockPalette.tsx` (1433 строки):
   - `components/sidebar/BlockPalette.tsx` (контейнер)
   - `components/sidebar/BlockCategory.tsx` (категория блоков)
   - `components/sidebar/BlockItem.tsx` (элемент блока)
4. Разбить `PropertiesPanel.tsx` (583 строки):
   - `components/properties/PropertiesPanel.tsx` (контейнер)
   - `components/properties/ActionProperties.tsx`
   - `components/properties/LogicProperties.tsx`
   - `components/properties/WaitProperties.tsx`
5. Разбить большие блоки:
   - `ActionBlock.tsx` → разбить на подкомпоненты
   - `LogicBlock.tsx` → разбить на подкомпоненты
6. Перенести store
7. Создать хуки для логики
8. Создать `README.md`
9. Тестировать

**Проверка:** Flow Builder работает, все блоки на месте ✅

---

### Шаг 7: Создание ENTITIES (модели данных)

**Создать:**

```typescript
// entities/agent/agent.entity.ts
export interface Agent {
  id: string;
  name: string;
  description: string;
  // ...
}

// entities/flow/flow.entity.ts
export interface Flow {
  id: string;
  name: string;
  // ...
}

// entities/task/task.entity.ts
export interface Task {
  id: string;
  title: string;
  // ...
}
```

---

### Шаг 8: Финальная очистка

1. Удалить старые папки (`src/components/agents`, `src/lib/stores` и т.д.)
2. Удалить старый `src/lib/api/client.ts`
3. Проверить что все импорты работают
4. Обновить `tsconfig.json` (path aliases если нужно)

---

## 📝 ЭТАП 4: ДОКУМЕНТАЦИЯ

### 4.1 README.md для каждого блока

**Шаблон README.md:**

```markdown
# 📦 [Название блока]

## 🎯 Назначение

Краткое описание — что делает этот блок.

## 📂 Структура

- `components/` — компоненты блока
- `hooks/` — хуки для логики
- `stores/` — Zustand store
- `api/` — API методы
- `types/` — TypeScript типы
- `utils/` — вспомогательные функции

## 🔌 API методы

Список основных API методов этого блока.

## 🪝 Основные хуки

Список хуков и для чего они нужны.

## 🔗 Зависимости

От каких других блоков зависит.
```

### 4.2 Создание главного README для структуры

Создать `src/features/README.md` с описанием всех блоков.

---

## ✅ КРИТЕРИИ УСПЕХА

После выполнения плана:

1. ✅ Каждый блок изолирован в своей папке
2. ✅ Нет файлов больше 300 строк
3. ✅ API клиенты разбиты по блокам
4. ✅ Все блоки имеют README.md
5. ✅ Импорты понятные и короткие (через path aliases)
6. ✅ Приложение работает без ошибок
7. ✅ Структура соответствует бэкенду

---

## 🛠️ ТЕХНИЧЕСКИЕ ДЕТАЛИ

### Path Aliases (tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/entities/*": ["./src/entities/*"],
      "@/*": ["./src/*"]
    }
  }
}
```

**Использование:**

```typescript
// Вместо:
import { Button } from '../../../shared/components/ui/button';

// Пишем:
import { Button } from '@/shared/components/ui/button';
```

---

## 📊 TIMELINE (примерная оценка)

| Этап                          | Время            |
| ----------------------------- | ---------------- |
| 1. Создание базовой структуры | 30 мин           |
| 2. Миграция SHARED            | 1 час            |
| 3. Миграция KANBAN            | 1 час            |
| 4. Миграция AGENTS            | 1.5 часа         |
| 5. Миграция FLOWS             | 2 часа           |
| 6. Миграция FLOW-BUILDER      | 4 часа           |
| 7. Создание ENTITIES          | 30 мин           |
| 8. Финальная очистка          | 1 час            |
| 9. Документация               | 1 час            |
| **ИТОГО**                     | **~12-13 часов** |

---

## 🎯 ЧТО ДАЛЬШЕ

После рефакторинга структуры можно будет:

1. Легко добавлять новые фичи (просто создать новый блок)
2. Находить нужный код за секунды
3. Тестировать каждый блок отдельно
4. Масштабировать проект без боли

---

## 🔄 API КЛИЕНТЫ: АРХИТЕКТУРНОЕ РЕШЕНИЕ

### Выбранный подход: API клиенты для каждого блока

**Структура:**

```
src/
├── features/
│   ├── agents/
│   │   └── api/
│   │       └── agents.api.ts      # API методы агентов
│   ├── flows/
│   │   └── api/
│   │       └── flows.api.ts       # API методы флоу
│   └── kanban/
│       └── api/
│           └── kanban.api.ts      # API методы канбана
└── shared/
    └── api/
        ├── http-client.ts         # Базовый HTTP клиент (axios config)
        ├── interceptors.ts        # Interceptors для всех запросов
        └── types.ts               # Общие типы для API
```

**Преимущества:**

- ✅ Каждый блок независим
- ✅ Легче найти API методы конкретного блока
- ✅ Проще тестировать
- ✅ Соответствует принципу "ONE BLOCK = ONE TASK"

---

## 📌 ПРИМЕЧАНИЯ

- Используем **YARN**, не npm
- Все файлы в **kebab-case**
- Компоненты в **PascalCase**
- Следуем принципу **ONE BLOCK = ONE TASK**
- README.md обязателен для каждого блока

---

## ✋ СЛЕДУЮЩИЙ ШАГ

**СОЗДАТЬ ПРИМЕР** на блоке KANBAN:

1. Показать структуру
2. Показать как разбить компоненты
3. Показать как работает API клиент
4. Утвердить подход
5. Начать полную миграцию

---

**Дата создания:** 2 ноября 2025  
**Статус:** Ожидает утверждения
