# Stores Documentation

State management с использованием Zustand.

## 🎯 Назначение

Глобальное управление состоянием приложения через Zustand stores.

## 📁 Структура

```
src/stores/
└── editingStore.ts      # Store для редактирования блоков
```

## ⚙️ Основные stores

### editingStore

**Назначение:** Управление состоянием редактирования блоков Flow Builder

**Реализация:**

```typescript
import { create } from 'zustand';

interface EditingStore {
  // State
  editingBlockId: string | null;
  blockConfig: Record<string, any>;

  // Actions
  setEditingBlock: (id: string | null) => void;
  updateBlockConfig: (id: string, config: any) => void;
  clearEditing: () => void;
}

export const useEditingStore = create<EditingStore>((set) => ({
  // Initial state
  editingBlockId: null,
  blockConfig: {},

  // Actions
  setEditingBlock: (id) => set({ editingBlockId: id }),

  updateBlockConfig: (id, config) =>
    set((state) => ({
      blockConfig: {
        ...state.blockConfig,
        [id]: config,
      },
    })),

  clearEditing: () =>
    set({
      editingBlockId: null,
      blockConfig: {},
    }),
}));
```

**Использование:**

```typescript
import { useEditingStore } from '@/stores/editingStore';

function FlowBlock({ block }) {
  const {
    editingBlockId,
    setEditingBlock
  } = useEditingStore();

  const isEditing = editingBlockId === block.id;

  const handleEdit = () => {
    setEditingBlock(block.id);
  };

  return (
    <div onClick={handleEdit}>
      {isEditing ? 'Editing...' : block.label}
    </div>
  );
}
```

**Селекторы (оптимизация):**

```typescript
// Выбрать только нужную часть стейта
const editingBlockId = useEditingStore((state) => state.editingBlockId);
const setEditingBlock = useEditingStore((state) => state.setEditingBlock);
```

---

## 📋 Создание нового store

### 1. Создайте файл store

```typescript
// src/stores/myStore.ts
import { create } from 'zustand';

interface MyStore {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useMyStore = create<MyStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
```

### 2. Используйте в компоненте

```typescript
import { useMyStore } from '@/stores/myStore';

function Counter() {
  const { count, increment, decrement } = useMyStore();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

---

## 🎯 Best Practices

### Структура store

- ✅ Разделяйте state и actions
- ✅ TypeScript интерфейс для типизации
- ✅ Immutable обновления (set)
- ✅ Селекторы для оптимизации

### Naming

- ✅ Префикс `use` для hooks
- ✅ Суффикс `Store` для store
- ✅ Действия в виде глаголов

### Оптимизация

- ✅ Используйте селекторы
- ✅ Разделяйте большие stores
- ✅ Middleware для debug (devtools)
- ✅ Persist для localStorage

---

## 🔧 Middleware

### DevTools

```typescript
import { devtools } from 'zustand/middleware';

export const useMyStore = create<MyStore>()(
  devtools(
    (set) => ({
      // store implementation
    }),
    { name: 'MyStore' },
  ),
);
```

### Persist (localStorage)

```typescript
import { persist } from 'zustand/middleware';

export const useMyStore = create<MyStore>()(
  persist(
    (set) => ({
      // store implementation
    }),
    { name: 'my-store' },
  ),
);
```

---

## 🔗 Связи

**Используется в:**

- Components (для глобального state)
- Hooks (для сложной логики)

**Использует:**

- Zustand library
- TypeScript types
