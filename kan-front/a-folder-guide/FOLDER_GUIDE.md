# 📂 Руководство по структуре папок проекта

> Практический гайд: куда класть код и где что искать

---

## 📁 **src/** - Весь исходный код приложения

### 🎨 **src/pages/** - UI логика страниц

**Когда использовать:**

- ✅ Хочешь **изменить визуально** страницу (кнопки, формы, карточки)
- ✅ Нужно добавить новый компонент на страницу
- ✅ Меняешь логику отображения (условный рендеринг, состояния UI)

**Примеры:**

- 🔧 Изменить внешний вид карточки агента → `src/pages/agents/components/AgentCard.tsx`
- 🔧 Добавить новое поле в форму создания агента → `src/pages/agent-create/components/BasicInfoSection.tsx`
- 🔧 Изменить header на странице flows → `src/pages/flows/components/FlowsHeader.tsx`

**Структура:**

```
pages/
├── agents/          # Страница списка агентов
│   ├── index.tsx              # Основной компонент страницы
│   ├── components/            # UI компоненты этой страницы
│   └── hooks/                 # Хуки для этой страницы
├── flow-builder/    # Страница конструктора flow
├── flow-editor/     # Страница редактора flow
├── flows/           # Страница списка flows
├── home/            # Главная страница
├── kanban/          # Страница kanban доски
└── agent-create/    # Страница создания агента
```

---

### 🔧 **src/features/** - Бизнес-логика (API, состояние, типы)

**Когда использовать:**

- ✅ Нужно **изменить функционал** (как работает логика)
- ✅ Добавить/изменить API запрос
- ✅ Изменить глобальное состояние (Zustand store)
- ✅ Добавить/изменить типы данных

**Примеры:**

- 🔧 Изменить endpoint для получения агентов → `src/features/agents/api/agents.api.ts`
- 🔧 Добавить новое поле в состояние агентов → `src/features/agents/stores/agents.store.ts`
- 🔧 Изменить тип данных Flow → `src/features/flows/types/index.ts`
- 🔧 Добавить API метод для kanban → `src/features/kanban/api/kanban.api.ts`

**Структура:**

```
features/
├── agents/
│   ├── api/           # API запросы для агентов
│   ├── stores/        # Zustand store (глобальное состояние)
│   └── types/         # TypeScript типы
├── flows/
│   ├── api/           # API запросы для flows
│   ├── stores/        # Zustand store для flows
│   └── types/         # TypeScript типы
├── flow-builder/
│   ├── stores/        # Zustand store для конструктора
│   └── types/         # TypeScript типы
└── kanban/
    ├── api/           # API запросы для kanban
    ├── stores/        # Zustand store для kanban
    └── types/         # TypeScript типы
```

---

### 🌍 **src/shared/** - Общий переиспользуемый код

**Когда использовать:**

- ✅ Нужно изменить **общий UI компонент** (Button, Card, Dialog)
- ✅ Создать переиспользуемый хук
- ✅ Изменить HTTP клиент, перехватчики
- ✅ Добавить перевод (i18n)
- ✅ Создать утилиту, которая используется в разных местах

**Примеры:**

- 🔧 Изменить стиль всех кнопок → `src/shared/components/ui/button.tsx`
- 🔧 Добавить новый язык → `src/shared/i18n/translations.ts`
- 🔧 Изменить базовый URL API → `src/shared/api/http-client.ts`
- 🔧 Создать переиспользуемый хук → `src/shared/hooks/useMyHook.ts`
- 🔧 Добавить утилиту для конвертации → `src/shared/utils/flow-converter.ts`

**Структура:**

```
shared/
├── components/
│   ├── ui/           # shadcn/ui компоненты (Button, Card, Dialog...)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   ├── alert.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   ├── language-selector.tsx
│   │   ├── language-selector-simple.tsx
│   │   ├── sidebar.tsx
│   │   └── app-layout.tsx
│   └── common/       # Общие компоненты
│       ├── theme-provider.tsx
│       ├── mode-toggle.tsx
│       └── language-toggle.tsx
├── api/              # HTTP клиент, interceptors
│   ├── http-client.ts
│   ├── interceptors.ts
│   └── types.ts
├── hooks/            # Общие React хуки
│   ├── use-dialog.tsx
│   └── useBlockEdit.ts
├── i18n/             # Переводы и языковые настройки
│   ├── index.ts
│   ├── LanguageContext.tsx
│   └── translations.ts
├── stores/           # Общие Zustand stores
│   └── editingStore.ts
├── types/            # Общие TypeScript типы
│   └── index.ts
└── utils/            # Утилиты (конвертеры, хелперы)
    ├── flow-converter.ts
    └── utils.ts
```

---

### 📦 **src/entities/** - Доменные модели

**Когда использовать:**

- ✅ Изменить **структуру данных** сущностей
- ✅ Добавить новую сущность (entity)
- ✅ Описать модель данных для TypeScript

**Примеры:**

- 🔧 Добавить поле в модель User → `src/entities/user/user.entity.ts`
- 🔧 Изменить модель Agent → `src/entities/agent/agent.entity.ts`
- 🔧 Создать новую сущность Project → `src/entities/project/project.entity.ts`

**Структура:**

```
entities/
├── index.ts
├── agent/
│   └── agent.entity.ts
├── flow/
│   └── flow.entity.ts
├── task/
│   └── task.entity.ts
└── user/
    └── user.entity.ts
```

---

### 🛠️ **src/lib/** - Библиотеки и контексты

**Когда использовать:**

- ✅ Изменить глобальные контексты React
- ✅ Добавить библиотечные обертки

**Примеры:**

- 🔧 Изменить логику Sidebar → `src/lib/SidebarContext.tsx`

**Структура:**

```
lib/
└── SidebarContext.tsx
```

---

## 📁 **app/** - Next.js роутинг (App Router)

**Когда использовать:**

- ✅ Создать **новую страницу/роут**
- ✅ Изменить layout приложения
- ✅ Добавить глобальные стили
- ✅ Создать API endpoints

**⚠️ НЕ ИСПОЛЬЗУЙ для:**

- ❌ UI логики (используй `src/pages/`)
- ❌ Бизнес-логики (используй `src/features/`)

**Примеры:**

- 🔧 Создать новую страницу `/settings` → `app/settings/page.tsx`
- 🔧 Изменить глобальный layout → `app/layout.tsx`
- 🔧 Добавить глобальные CSS → `app/globals.css`
- 🔧 Создать API endpoint → `app/api/users/route.ts`

**Структура:**

```
app/
├── page.tsx                    # Главная страница (/)
├── layout.tsx                  # Глобальный layout
├── globals.css                 # Глобальные стили
├── flow-handles-global.css     # Стили для flow handles
├── agents/
│   ├── page.tsx                # /agents
│   ├── create/
│   │   └── page.tsx            # /agents/create
│   └── flow-builder/
│       └── page.tsx            # /agents/flow-builder
├── flows/
│   ├── page.tsx                # /flows
│   ├── builder/
│   │   └── page.tsx            # /flows/builder
│   └── editor/
│       └── page.tsx            # /flows/editor
├── kanban/
│   └── page.tsx                # /kanban
└── api-test/
    └── page.tsx                # /api-test
```

---

## 📁 **lib/** - Общие утилиты (корневые)

**Когда использовать:**

- ✅ Изменить утилиты уровня приложения
- ✅ Функции для работы с tailwind (cn)

**Примеры:**

- 🔧 Изменить функцию `cn()` для стилей → `lib/utils.ts`

**Структура:**

```
lib/
└── utils.ts    # Утилита cn() для tailwind classnames
```

---

## 📁 **public/** - Статические файлы

**Когда использовать:**

- ✅ Добавить **изображения, иконки, favicon**
- ✅ Добавить шрифты, PDF файлы
- ✅ Любые статические файлы, доступные по URL

**Примеры:**

- 🔧 Добавить логотип → `public/logo.png` (доступен по `/logo.png`)
- 🔧 Изменить favicon → `public/favicon.ico`
- 🔧 Добавить шрифт → `public/fonts/custom-font.woff2`
- 🔧 Добавить PDF → `public/docs/manual.pdf`

**Структура:**

```
public/
└── (пусто - готово для статических файлов)
```

---

## 📁 **docs/** - Техническая документация

**Когда использовать:**

- ✅ Узнать **как работает архитектура**
- ✅ Прочитать гайды по разработке
- ✅ Понять паттерны проекта
- ✅ Узнать best practices

**Файлы:**

- 📖 `README.md` - Общее описание документации
- 📖 `COMPONENT_ARCHITECTURE.md` - Архитектура компонентов
- 📖 `DEVELOPMENT_WORKFLOW.md` - Процесс разработки
- 📖 `DESIGN_SYSTEM.md` - Дизайн-система
- 📖 `TESTING_STRATEGY.md` - Как тестировать
- 📖 `ASYNC_LOADING_GUIDE.md` - Асинхронная загрузка
- 📖 `DRAG_PREVIEW_HTML_FIX.md` - Фикс drag preview
- 📖 `EXACT_BLOCK_PREVIEW_MATCH.md` - Точное совпадение превью
- 📖 `REAL_BLOCK_PREVIEW_COMPLETE.md` - Полное превью блоков

**Структура:**

```
docs/
├── README.md
├── COMPONENT_ARCHITECTURE.md
├── DEVELOPMENT_WORKFLOW.md
├── DESIGN_SYSTEM.md
├── TESTING_STRATEGY.md
├── ASYNC_LOADING_GUIDE.md
├── DRAG_PREVIEW_HTML_FIX.md
├── EXACT_BLOCK_PREVIEW_MATCH.md
└── REAL_BLOCK_PREVIEW_COMPLETE.md
```

---

## 📁 **front-docs/** - Справочная документация

**Когда использовать:**

- ✅ Быстро найти **где что лежит**
- ✅ Узнать структуру проекта
- ✅ Прочитать описание компонентов/хуков
- ✅ Получить индекс всех файлов

**Файлы:**

- 📖 `README.md` - Общее описание
- 📖 `INDEX.md` - Индекс всех файлов
- 📖 `STRUCTURE.md` - Структура проекта
- 📖 `SUMMARY.md` - Краткое резюме
- 📖 `components/README.md` - Список компонентов
- 📖 `hooks/README.md` - Список хуков
- 📖 `pages/README.md` - Список страниц
- 📖 `stores/README.md` - Список stores
- 📖 `types/README.md` - Список типов

**Структура:**

```
front-docs/
├── INDEX.md
├── README.md
├── STRUCTURE.md
├── SUMMARY.md
├── components/
│   └── README.md
├── hooks/
│   └── README.md
├── pages/
│   └── README.md
├── stores/
│   └── README.md
└── types/
    └── README.md
```

---

## 🎯 Быстрая шпаргалка

| Задача                              | Папка                          | Пример                                      |
| ----------------------------------- | ------------------------------ | ------------------------------------------- |
| 🎨 Изменить внешний вид страницы    | `src/pages/{page}/components/` | `src/pages/agents/components/AgentCard.tsx` |
| 🔧 Изменить функционал (API, store) | `src/features/{feature}/`      | `src/features/agents/api/agents.api.ts`     |
| 🌍 Изменить общий UI (Button, Card) | `src/shared/components/ui/`    | `src/shared/components/ui/button.tsx`       |
| 🆕 Создать новую страницу           | `app/{route}/page.tsx`         | `app/settings/page.tsx`                     |
| 🖼️ Добавить картинку                | `public/`                      | `public/logo.png`                           |
| 📖 Прочитать архитектуру            | `docs/`                        | `docs/COMPONENT_ARCHITECTURE.md`            |
| 📋 Найти индекс файлов              | `front-docs/`                  | `front-docs/INDEX.md`                       |
| 🔤 Добавить перевод                 | `src/shared/i18n/`             | `src/shared/i18n/translations.ts`           |
| 🏗️ Изменить модель данных           | `src/entities/{entity}/`       | `src/entities/user/user.entity.ts`          |
| 🎨 Добавить глобальные стили        | `app/`                         | `app/globals.css`                           |
| 🛠️ Создать переиспользуемый хук     | `src/shared/hooks/`            | `src/shared/hooks/useMyHook.ts`             |
| 🔄 Добавить утилиту                 | `src/shared/utils/`            | `src/shared/utils/my-helper.ts`             |

---

## 📌 Золотое правило

```
app/          → ROUTING (где находится страница)
              - Только page.tsx, layout.tsx, route.ts
              - Минимум логики (3-5 строк)

src/pages/    → UI (как выглядит страница)
              - Компоненты страницы
              - Локальные хуки
              - Визуальная логика

src/features/ → LOGIC (как работает страница)
              - API запросы
              - Zustand stores
              - TypeScript типы
              - Глобальная логика

src/shared/   → REUSABLE (что используется везде)
              - UI компоненты (Button, Card...)
              - Общие хуки
              - Утилиты
              - i18n
```

---

## 🚀 Примеры реальных задач

### Задача 1: Добавить новую страницу "Настройки"

1. **Создать роут:** `app/settings/page.tsx` (3 строки)
2. **Создать UI:** `src/pages/settings/index.tsx` + компоненты
3. **Добавить API:** `src/features/settings/api/settings.api.ts`
4. **Добавить store:** `src/features/settings/stores/settings.store.ts`

### Задача 2: Изменить цвет всех кнопок

1. **Открыть:** `src/shared/components/ui/button.tsx`
2. **Изменить:** Tailwind классы в компоненте
3. **Результат:** Все кнопки изменятся везде

### Задача 3: Добавить новое поле в форму агента

1. **UI:** `src/pages/agent-create/components/BasicInfoSection.tsx`
2. **Тип:** `src/features/agents/types/index.ts`
3. **API:** `src/features/agents/api/agents.api.ts`

### Задача 4: Добавить русский язык

1. **Открыть:** `src/shared/i18n/translations.ts`
2. **Добавить:** Новые переводы
3. **Использовать:** В компонентах через `useLanguage()`

---

## 📝 Соглашения по именованию

### Файлы компонентов:

- `PascalCase.tsx` - для компонентов: `AgentCard.tsx`, `MetricCard.tsx`
- `kebab-case.tsx` - для UI компонентов: `button.tsx`, `card.tsx`

### Файлы утилит/хуков:

- `camelCase.ts` - для утилит: `flowConverter.ts`, `useAgents.ts`
- `kebab-case.ts` - для файлов: `http-client.ts`, `use-dialog.tsx`

### Папки:

- `kebab-case` - всегда: `agent-create/`, `flow-builder/`

---

## ✅ Чек-лист перед добавлением кода

- [ ] Это UI компонент страницы? → `src/pages/{page}/components/`
- [ ] Это бизнес-логика? → `src/features/{feature}/`
- [ ] Это переиспользуемый компонент? → `src/shared/components/`
- [ ] Это новая страница? → `app/{route}/page.tsx`
- [ ] Это статический файл? → `public/`
- [ ] Это документация? → `docs/` или `front-docs/`

---

**Последнее обновление:** 2 ноября 2025 г.

**Статус:** ✅ Актуально после рефакторинга и удаления дубликатов
