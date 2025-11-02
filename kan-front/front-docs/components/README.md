# Components Documentation

> ✅ **ОБНОВЛЕНО:** 2 ноября 2025 г.  
> Документация обновлена после рефакторинга. Отражает актуальную структуру проекта.

---

## 📋 Содержание

1. [Обзор](#обзор)
2. [Структура компонентов](#структура-компонентов)
3. [Типы компонентов](#типы-компонентов)
4. [Примеры использования](#примеры-использования)

---

## 🎯 Обзор

После рефакторинга (ноябрь 2025) компоненты организованы по **модульному принципу**:

- **Компоненты страниц** → `src/pages/{page}/components/`
- **Переиспользуемые компоненты** → `src/shared/components/`
- **UI библиотека** → `src/shared/components/ui/` (shadcn/ui)

---

## 📁 Структура компонентов

### Актуальная структура (2025):

```
src/
├── pages/                              # КОМПОНЕНТЫ СТРАНИЦ
│   ├── home/
│   │   ├── index.tsx
│   │   └── components/
│   │       ├── MetricCard.tsx
│   │       ├── MetricsSection.tsx
│   │       ├── QuickActionCard.tsx
│   │       └── QuickActionsSection.tsx
│   │
│   ├── agents/
│   │   ├── index.tsx
│   │   └── components/
│   │       ├── AgentCard.tsx
│   │       ├── AgentsGrid.tsx
│   │       └── AgentsHeader.tsx
│   │
│   ├── agent-create/
│   │   ├── index.tsx
│   │   └── components/
│   │       ├── AgentCreateForm.tsx
│   │       ├── BasicInfoSection.tsx
│   │       └── ModelConfigSection.tsx
│   │
│   ├── flows/
│   │   ├── index.tsx
│   │   └── components/
│   │       ├── EditableFlowCard.tsx
│   │       ├── FlowsFilters.tsx
│   │       └── FlowsHeader.tsx
│   │
│   ├── flow-builder/
│   │   ├── index.tsx
│   │   └── components/
│   │       ├── blocks/              # Блоки flow
│   │       ├── canvas/              # Canvas для drag & drop
│   │       ├── dialogs/             # Диалоги
│   │       ├── edges/               # Связи между блоками
│   │       ├── properties/          # Панель свойств
│   │       ├── sidebar/             # Боковая панель
│   │       └── toolbar/             # Тулбар
│   │
│   ├── flow-editor/
│   │   ├── index.tsx
│   │   └── components/
│   │       ├── FlowEditorToolbar.tsx
│   │       ├── FlowsList.tsx
│   │       └── FlowEditorContent.tsx
│   │
│   └── kanban/
│       ├── index.tsx
│       └── components/
│           └── (kanban components)
│
└── shared/                             # ПЕРЕИСПОЛЬЗУЕМЫЕ КОМПОНЕНТЫ
    └── components/
        ├── ui/                         # shadcn/ui базовые компоненты
        │   ├── button.tsx
        │   ├── card.tsx
        │   ├── dialog.tsx
        │   ├── input.tsx
        │   ├── select.tsx
        │   ├── table.tsx
        │   ├── tabs.tsx
        │   ├── badge.tsx
        │   ├── alert.tsx
        │   ├── dropdown-menu.tsx
        │   ├── label.tsx
        │   ├── textarea.tsx
        │   ├── sidebar.tsx
        │   ├── app-layout.tsx
        │   ├── language-selector.tsx
        │   └── ... (19 файлов)
        │
        └── common/                     # Общие компоненты
            ├── theme-provider.tsx
            ├── mode-toggle.tsx
            └── language-toggle.tsx
```

---

## 🧩 Типы компонентов

### 1. Компоненты страниц (src/pages/{page}/components/)

**Назначение:** Специфичные UI компоненты для конкретной страницы

**Примеры:**

- `AgentCard` - карточка агента (только для страницы agents)
- `FlowsHeader` - заголовок страницы flows
- `MetricCard` - карточка метрики (только для home)

**Правила:**

- ✅ Используются только на одной странице
- ✅ Могут быть большими (до 200 строк)
- ✅ Специфичная бизнес-логика
- ❌ Не переиспользуются в других местах

**Импорт:**

```typescript
import { AgentCard } from '@/src/pages/agents/components/AgentCard';
import { FlowsHeader } from '@/src/pages/flows/components/FlowsHeader';
```

---

### 2. Переиспользуемые UI компоненты (src/shared/components/ui/)

**Назначение:** Базовые UI компоненты из библиотеки shadcn/ui

**Примеры:**

- `Button` - кнопка
- `Card` - карточка
- `Dialog` - модальное окно
- `Input` - поле ввода
- `Select` - выпадающий список

**Правила:**

- ✅ Используются везде в приложении
- ✅ Стилизованы через Tailwind CSS
- ✅ Соответствуют дизайн-системе
- ✅ Настраиваются через props

**Импорт:**

```typescript
import { Button } from '@/src/shared/components/ui/button';
import { Card, CardHeader, CardContent } from '@/src/shared/components/ui/card';
import { Dialog } from '@/src/shared/components/ui/dialog';
```

**Доступные компоненты:**
| Компонент | Описание | Файл |
|-----------|----------|------|
| `Button` | Кнопка с вариантами стилей | `button.tsx` |
| `Card` | Карточка с заголовком и контентом | `card.tsx` |
| `Dialog` | Модальное окно | `dialog.tsx` |
| `Input` | Текстовое поле | `input.tsx` |
| `Select` | Выпадающий список | `select.tsx` |
| `Table` | Таблица | `table.tsx` |
| `Tabs` | Вкладки | `tabs.tsx` |
| `Badge` | Бейдж/метка | `badge.tsx` |
| `Alert` | Оповещение | `alert.tsx` |
| `DropdownMenu` | Выпадающее меню | `dropdown-menu.tsx` |
| `Label` | Метка для форм | `label.tsx` |
| `Textarea` | Многострочное текстовое поле | `textarea.tsx` |
| `Sidebar` | Боковая панель | `sidebar.tsx` |
| `AppLayout` | Основной layout приложения | `app-layout.tsx` |

---

### 3. Общие компоненты (src/shared/components/common/)

**Назначение:** Переиспользуемые функциональные компоненты

**Примеры:**

- `ThemeProvider` - провайдер темы (dark/light)
- `ModeToggle` - переключатель темы
- `LanguageToggle` - переключатель языка

**Правила:**

- ✅ Используются в нескольких местах
- ✅ Содержат бизнес-логику
- ✅ Независимы от страниц

**Импорт:**

```typescript
import { ThemeProvider } from '@/src/shared/components/common/theme-provider';
import { ModeToggle } from '@/src/shared/components/common/mode-toggle';
```

---

## 📝 Примеры использования

### Пример 1: Использование Button

```typescript
import { Button } from '@/src/shared/components/ui/button';

export function MyComponent() {
  return (
    <div>
      <Button variant="default">Основная кнопка</Button>
      <Button variant="outline">Обводка</Button>
      <Button variant="ghost">Прозрачная</Button>
      <Button variant="destructive">Удалить</Button>
      <Button size="sm">Маленькая</Button>
      <Button size="lg">Большая</Button>
    </div>
  );
}
```

---

### Пример 2: Использование Card

```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/src/shared/components/ui/card';

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Заголовок карточки</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Контент карточки</p>
      </CardContent>
    </Card>
  );
}
```

---

### Пример 3: Создание компонента страницы

```typescript
// src/pages/my-page/components/MyCard.tsx
import { Card, CardHeader, CardTitle } from '@/src/shared/components/ui/card';
import { Button } from '@/src/shared/components/ui/button';

interface MyCardProps {
  title: string;
  onAction: () => void;
}

export function MyCard({ title, onAction }: MyCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <Button onClick={onAction}>Действие</Button>
      </CardHeader>
    </Card>
  );
}
```

```typescript
// src/pages/my-page/components/index.ts
export { MyCard } from './MyCard';
```

```typescript
// src/pages/my-page/index.tsx
import { MyCard } from './components';

export function MyPageContent() {
  const handleAction = () => {
    console.log('Action!');
  };

  return (
    <div>
      <MyCard title="Моя карточка" onAction={handleAction} />
    </div>
  );
}
```

---

## 🏗️ Flow Builder Components (особый случай)

Flow Builder содержит самую сложную структуру компонентов:

### Структура:

```
src/pages/flow-builder/components/
├── blocks/                    # Блоки для flow
│   ├── ActionBlock.tsx       # Блок действия
│   ├── TriggerBlock.tsx      # Блок триггера
│   ├── LogicBlock.tsx        # Блок логики
│   ├── ContextBlock.tsx      # Блок контекста
│   ├── WaitBlock.tsx         # Блок ожидания
│   ├── ResultBlock.tsx       # Блок результата
│   └── ConnectionHandle.tsx  # Точки соединения
│
├── canvas/                    # Canvas для drag & drop
│   ├── FlowCanvas.tsx        # Главный canvas (React Flow)
│   └── DynamicConnectionLine.tsx
│
├── dialogs/                   # Модальные окна
│   ├── SaveFlowDialog.tsx
│   ├── ConfirmDeleteDialog.tsx
│   └── ConfirmCascadeDeleteDialog.tsx
│
├── edges/                     # Связи между блоками
│   ├── StyledSmoothStepEdge.tsx
│   ├── StyledEdgeLabel.tsx
│   └── StraightEdge.tsx
│
├── properties/                # Панель свойств
│   └── PropertiesPanel.tsx
│
├── sidebar/                   # Боковая панель с блоками
│   └── BlockPalette.tsx
│
└── toolbar/                   # Тулбар редактора
    └── FlowToolbar.tsx
```

### Пример использования Flow Block:

```typescript
import { ActionBlock } from '@/src/pages/flow-builder/components/blocks/ActionBlock';

// Используется в FlowCanvas через React Flow
<Node type="action" data={blockData} />
```

---

## 🎨 Стилизация компонентов

### Tailwind CSS

Все компоненты используют Tailwind CSS:

```typescript
<Button className="bg-blue-500 hover:bg-blue-600 text-white">
  Кастомная кнопка
</Button>
```

### cn() утилита

Для комбинирования классов используй `cn()`:

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className
)}>
  Content
</div>
```

---

## 📚 Дополнительно

### Смотри также:

- [FOLDER_GUIDE.md](../FOLDER_GUIDE.md) - Полный гайд по структуре папок
- [REFACTORING_GUIDE.md](../docs/REFACTORING_GUIDE.md) - Гайд по рефакторингу
- [Официальная документация shadcn/ui](https://ui.shadcn.com/)

### Добавление нового компонента shadcn/ui:

```bash
npx shadcn@latest add [component-name]
```

Компонент автоматически добавится в `src/shared/components/ui/`

---

**Обновлено:** 2 ноября 2025 г.  
**Статус:** ✅ Актуально  
**Версия:** 2.0 (после рефакторинга)
