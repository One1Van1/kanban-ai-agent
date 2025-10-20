# Hooks Documentation

Custom React hooks для переиспользования логики.

## 🎯 Назначение

Кастомные React hooks для инкапсуляции и переиспользования логики компонентов.

## 📁 Структура

```
src/hooks/
├── use-dialog.tsx       # Управление диалогами
└── useBlockEdit.ts      # Редактирование блоков Flow
```

## ⚙️ Основные hooks

### use-dialog

**Назначение:** Управление состоянием модальных окон

**Использование:**

```typescript
import { useDialog } from '@/hooks/use-dialog';

function MyComponent() {
  const { isOpen, open, close } = useDialog();

  return (
    <>
      <Button onClick={open}>Open Dialog</Button>

      <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent>
          Content here
        </DialogContent>
      </Dialog>
    </>
  );
}
```

**Реализация:**

```typescript
export function useDialog(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return { isOpen, open, close, toggle };
}
```

---

### useBlockEdit

**Назначение:** Редактирование блоков в Flow Builder

**Использование:**

```typescript
import { useBlockEdit } from '@/hooks/useBlockEdit';

function FlowBlock({ block }) {
  const {
    editing,
    config,
    startEdit,
    saveEdit,
    cancelEdit
  } = useBlockEdit(block.id);

  return (
    <div onDoubleClick={startEdit}>
      {editing ? (
        <BlockEditor
          config={config}
          onSave={saveEdit}
          onCancel={cancelEdit}
        />
      ) : (
        <BlockDisplay block={block} />
      )}
    </div>
  );
}
```

**Реализация:**

```typescript
export function useBlockEdit(blockId: string) {
  const [editing, setEditing] = useState(false);
  const [config, setConfig] = useState({});

  const startEdit = () => {
    setEditing(true);
    // Load block config from store
  };

  const saveEdit = async (newConfig: any) => {
    // Save to backend
    await updateBlock(blockId, newConfig);
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditing(false);
    // Reset config
  };

  return {
    editing,
    config,
    setConfig,
    startEdit,
    saveEdit,
    cancelEdit,
  };
}
```

---

## 📋 Создание нового hook

### 1. Создайте файл

```typescript
// src/hooks/use-my-hook.ts
import { useState, useEffect } from 'react';

export function useMyHook(initialValue: string) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    // Side effects
  }, [value]);

  return { value, setValue };
}
```

### 2. Используйте в компоненте

```typescript
import { useMyHook } from '@/hooks/use-my-hook';

function MyComponent() {
  const { value, setValue } = useMyHook('initial');

  return <div>{value}</div>;
}
```

---

## 🎯 Best Practices

- ✅ Префикс `use` для всех hooks
- ✅ Возвращать объект, не массив (для именованных значений)
- ✅ TypeScript типизация
- ✅ Документировать сложные hooks
- ✅ Тестировать hooks отдельно

---

## 🔗 Связи

**Используется в:**

- Components (для логики)
- Pages (для состояния)

**Использует:**

- React hooks (useState, useEffect, etc.)
- Stores (Zustand)
- API calls
