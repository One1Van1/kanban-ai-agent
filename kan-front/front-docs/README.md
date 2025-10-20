# Frontend Documentation

Полная документация фронтенда Kanban AI Agent.

## 🎯 Назначение

Централизованная документация всех компонентов фронтенда: страницы, компоненты, hooks, stores и типы.

## 📚 Навигация

### 🚀 [Pages](./pages/README.md)

Next.js страницы и роутинг

- Kanban Board - управление задачами
- AI Agents - создание и запуск агентов
- Flow Builder - визуальный редактор процессов

### 🧩 [Components](./components/README.md)

React компоненты

- Kanban components - доска и задачи
- Agent components - управление агентами
- Flow Builder components - визуальный редактор ⭐
- UI components - shadcn/ui базовые компоненты

### 🪝 [Hooks](./hooks/README.md)

Custom React hooks

- `use-dialog` - управление модальными окнами
- `useBlockEdit` - редактирование блоков Flow

### 🗄️ [Stores](./stores/README.md)

Zustand state management

- `editingStore` - состояние редактирования блоков

### 📘 [Types](./types/README.md)

TypeScript типы и интерфейсы

- Flow Builder types - типы для визуального редактора
- Kanban types - типы для канбан-доски
- Agent types - типы для AI агентов

---

## 🏗️ Архитектура проекта

```
kan-front/
├── app/                    # Next.js App Router
│   ├── kanban/            # Канбан страница
│   ├── agents/            # AI агенты
│   ├── flows/             # Flow Builder ⭐
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
│
├── src/
│   ├── components/        # React компоненты
│   │   ├── kanban/       # Канбан компоненты
│   │   ├── agents/       # Агенты компоненты
│   │   ├── flow-builder/ # Flow Builder ⭐
│   │   └── ui/           # shadcn/ui компоненты
│   │
│   ├── hooks/            # Custom React hooks
│   ├── stores/           # Zustand stores
│   ├── types/            # TypeScript типы
│   └── lib/              # Утилиты
│
├── components/           # Общие компоненты
│   └── ui/              # shadcn/ui копии
│
└── front-docs/          # 📚 Документация
    ├── pages/
    ├── components/
    ├── hooks/
    ├── stores/
    └── types/
```

---

## 🎯 Принципы архитектуры

### 1. Модульность

Каждый компонент независим и переиспользуем

### 2. TypeScript Everywhere

100% типизация для безопасности

### 3. shadcn/ui Philosophy

Copy-paste компоненты, полный контроль

### 4. React Flow Integration

Мощный визуальный редактор для Flow Builder

### 5. Zustand для State

Простой и эффективный state management

---

## 🔗 Технологический стек

```
┌─────────────────────────────────────────┐
│           FRONTEND STACK                │
├─────────────────────────────────────────┤
│  Framework:      Next.js 14             │
│  UI Library:     React 18               │
│  Language:       TypeScript 5+          │
│  Styling:        Tailwind CSS           │
│  Components:     shadcn/ui              │
│  Flow Editor:    React Flow             │
│  State:          Zustand                │
│  Forms:          React Hook Form        │
│  HTTP:           Fetch API              │
└─────────────────────────────────────────┘
```

---

## 📋 Workflow разработки

### 1. Создание новой страницы

```bash
# Создать папку и файл
mkdir -p app/new-page
touch app/new-page/page.tsx

# Добавить компонент
export default function NewPage() {
  return <div>New Page</div>;
}
```

### 2. Создание компонента

```typescript
// src/components/feature/MyComponent.tsx
interface MyComponentProps {
  title: string;
}

export function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>;
}
```

### 3. Добавление hook

```typescript
// src/hooks/use-my-hook.ts
export function useMyHook() {
  const [state, setState] = useState();
  return { state, setState };
}
```

### 4. Создание store

```typescript
// src/stores/myStore.ts
import { create } from 'zustand';

export const useMyStore = create((set) => ({
  value: 0,
  setValue: (value) => set({ value }),
}));
```

### 5. Определение типов

```typescript
// src/types/my-feature.ts
export interface MyData {
  id: string;
  name: string;
}
```

---

## 🚀 Быстрый старт

### Установка

```bash
# Установить зависимости (используйте YARN!)
cd kan-front
yarn install
```

### Запуск

```bash
# Development mode
yarn dev
# → http://localhost:3001

# Production build
yarn build
yarn start

# Lint
yarn lint
```

### Структура команд

```bash
# Добавить shadcn/ui компонент
npx shadcn-ui@latest add button

# Проверить типы
yarn tsc --noEmit

# Format code
yarn format
```

---

## 🔍 Поиск информации

### По функционалу

1. Откройте [Pages](./pages/README.md)
2. Найдите нужную страницу
3. Изучите компоненты страницы

### По компонентам

1. Откройте [Components](./components/README.md)
2. Найдите категорию компонента
3. Изучите props и примеры

### По типам данных

1. Откройте [Types](./types/README.md)
2. Найдите нужный интерфейс
3. Проверьте связанные типы

### По состоянию

1. Откройте [Stores](./stores/README.md)
2. Найдите нужный store
3. Изучите actions и selectors

---

## 🎓 Обучающие материалы

### Фреймворки и библиотеки

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Flow](https://reactflow.dev/)
- [Zustand](https://docs.pmnd.rs/zustand/)

### Наши гайды

- [Presentations Guide](./PRESENTATIONS-GUIDE.md) - как презентовать проект
- [Quick Brief](./QUICK-BRIEF.md) - 5 минут overview
- [Tech Lead Brief](./TECH-LEAD-BRIEF.md) - 10 минут детально

---

## 📦 Package Manager

**⚠️ КРИТИЧЕСКИ ВАЖНО: ВСЕГДА ИСПОЛЬЗУЙТЕ YARN!**

```bash
# ✅ Правильно
yarn add package-name
yarn install
yarn dev

# ❌ Неправильно
npm install package-name
npm install
npm run dev
```

---

## 🤝 Contributing

### Добавление документации

1. Создайте файл в соответствующей папке
2. Следуйте структуре существующих документов
3. Добавьте ссылку в главный README
4. Используйте эмодзи для навигации

### Структура документа

```markdown
# Название

## 🎯 Назначение

Краткое описание

## ⚙️ Основные возможности

- ✅ Фича 1
- ✅ Фича 2

## 📋 Примеры

Код и использование

## 🔗 Связи

Что использует и где используется
```

---

## 📞 Поддержка

### Если нужна помощь:

1. ✅ Проверь документацию
2. ✅ Посмотри примеры в коде
3. ✅ Изучи shadcn/ui docs
4. ✅ Создай issue

---

**Последнее обновление:** 20 октября 2025 г.
