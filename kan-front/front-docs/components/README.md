# Components Documentation

Документация по всем React компонентам приложения.

## 🎯 Назначение

Модульные React компоненты для построения UI с использованием shadcn/ui и custom компонентов.

## 📁 Структура компонентов

```
src/components/
├── kanban/              # Канбан компоненты
├── agents/              # AI агенты компоненты
├── flow-builder/        # Flow Builder компоненты ⭐
├── charts/              # Графики и диаграммы
├── test/                # Тестовые компоненты
├── ui/                  # shadcn/ui базовые компоненты
├── theme-provider.tsx   # Theme контекст
└── mode-toggle.tsx      # Dark/Light toggle
```

## ⚙️ Категории компонентов

### 1. Kanban Components

**Папка:** `src/components/kanban/`

| Компонент        | Описание        | Props                        |
| ---------------- | --------------- | ---------------------------- |
| `KanbanBoard`    | Главная доска   | `columns`, `tasks`           |
| `KanbanColumn`   | Колонка задач   | `title`, `tasks`, `onDrop`   |
| `TaskCard`       | Карточка задачи | `task`, `onEdit`, `onDelete` |
| `TaskModal`      | Модалка деталей | `task`, `isOpen`, `onClose`  |
| `CreateTaskForm` | Форма создания  | `columnId`, `onSubmit`       |

**Пример использования:**

```typescript
<KanbanBoard>
  <KanbanColumn title="To Do" tasks={todoTasks} />
  <KanbanColumn title="In Progress" tasks={inProgressTasks} />
  <KanbanColumn title="Done" tasks={doneTasks} />
</KanbanBoard>
```

---

### 2. AI Agents Components

**Папка:** `src/components/agents/`

| Компонент           | Описание        | Props                        |
| ------------------- | --------------- | ---------------------------- |
| `AgentList`         | Список агентов  | `agents`                     |
| `AgentCard`         | Карточка агента | `agent`, `onRun`, `onDelete` |
| `CreateAgentDialog` | Диалог создания | `isOpen`, `onClose`          |
| `AgentForm`         | Форма агента    | `onSubmit`                   |
| `RunAgentButton`    | Кнопка запуска  | `agentId`, `onClick`         |
| `AgentResults`      | Результаты      | `results`                    |

**Пример использования:**

```typescript
<AgentList agents={agents}>
  {agents.map(agent => (
    <AgentCard
      key={agent.id}
      agent={agent}
      onRun={handleRun}
      onDelete={handleDelete}
    />
  ))}
</AgentList>
```

---

### 3. Flow Builder Components ⭐ (Самое важное)

**Папка:** `src/components/flow-builder/`

| Компонент      | Описание       | Props                          |
| -------------- | -------------- | ------------------------------ |
| `FlowCanvas`   | Главный canvas | `initialNodes`, `initialEdges` |
| `BlockPalette` | Палитра блоков | `onDragStart`                  |
| `FlowBlock`    | Кастомный блок | `data`, `type`                 |
| `BlockEditor`  | Редактор блока | `block`, `onSave`              |
| `FlowToolbar`  | Toolbar        | `onSave`, `onConvert`          |
| `EdgeTypes`    | Типы связей    | -                              |

**Архитектура Flow Builder:**

```typescript
// FlowCanvas.tsx - главный компонент
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background
} from 'reactflow';

export function FlowCanvas({
  initialNodes,
  initialEdges
}: Props) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const nodeTypes = {
    start: StartBlock,
    action: ActionBlock,
    condition: ConditionBlock,
    end: EndBlock,
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
}
```

**Типы блоков:**

```typescript
// StartBlock - начальный блок
export function StartBlock({ data }: NodeProps) {
  return (
    <div className="start-block">
      <div className="block-icon">▶️</div>
      <div className="block-label">{data.label}</div>
    </div>
  );
}

// ActionBlock - блок действия
export function ActionBlock({ data }: NodeProps) {
  return (
    <div className="action-block">
      <div className="block-icon">⚡</div>
      <div className="block-label">{data.label}</div>
      <div className="block-config">{data.config?.type}</div>
    </div>
  );
}

// ConditionBlock - блок условия
export function ConditionBlock({ data }: NodeProps) {
  return (
    <div className="condition-block">
      <div className="block-icon">🔀</div>
      <div className="block-label">{data.label}</div>
      <Handle type="source" position={Position.Right} id="true" />
      <Handle type="source" position={Position.Bottom} id="false" />
    </div>
  );
}

// EndBlock - конечный блок
export function EndBlock({ data }: NodeProps) {
  return (
    <div className="end-block">
      <div className="block-icon">🏁</div>
      <div className="block-label">{data.label}</div>
    </div>
  );
}
```

**BlockPalette - палитра блоков:**

```typescript
export function BlockPalette() {
  const blockTypes = [
    { type: 'start', label: 'Start', icon: '▶️' },
    { type: 'action', label: 'Action', icon: '⚡' },
    { type: 'condition', label: 'Condition', icon: '🔀' },
    { type: 'end', label: 'End', icon: '🏁' },
  ];

  const onDragStart = (event: DragEvent, blockType: string) => {
    event.dataTransfer.setData('application/reactflow', blockType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="block-palette">
      {blockTypes.map(block => (
        <div
          key={block.type}
          draggable
          onDragStart={(e) => onDragStart(e, block.type)}
          className="palette-block"
        >
          <span>{block.icon}</span>
          <span>{block.label}</span>
        </div>
      ))}
    </div>
  );
}
```

**BlockEditor - редактор блока:**

```typescript
export function BlockEditor({
  block,
  onSave,
  onClose
}: Props) {
  const [config, setConfig] = useState(block.data.config);

  const handleSave = () => {
    onSave({
      ...block,
      data: {
        ...block.data,
        config,
      },
    });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Block</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            label="Label"
            value={config.label}
            onChange={(e) => setConfig({
              ...config,
              label: e.target.value
            })}
          />

          {block.type === 'action' && (
            <Select
              label="Action Type"
              value={config.actionType}
              onChange={(value) => setConfig({
                ...config,
                actionType: value
              })}
            >
              <option value="ai">AI Action</option>
              <option value="http">HTTP Request</option>
              <option value="transform">Transform Data</option>
            </Select>
          )}

          {block.type === 'condition' && (
            <Input
              label="Condition"
              value={config.condition}
              onChange={(e) => setConfig({
                ...config,
                condition: e.target.value
              })}
              placeholder="e.g., status === 'active'"
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

### 4. UI Components (shadcn/ui)

**Папка:** `components/ui/`

Базовые UI компоненты из shadcn/ui:

| Компонент  | Описание          | Использование                                 |
| ---------- | ----------------- | --------------------------------------------- |
| `Button`   | Кнопки            | `<Button>Click</Button>`                      |
| `Card`     | Карточки          | `<Card><CardContent>...</CardContent></Card>` |
| `Dialog`   | Модальные окна    | `<Dialog open={isOpen}>...</Dialog>`          |
| `Input`    | Поля ввода        | `<Input placeholder="..." />`                 |
| `Select`   | Выпадающие списки | `<Select>...</Select>`                        |
| `Label`    | Лейблы            | `<Label>Name</Label>`                         |
| `Textarea` | Текстовые поля    | `<Textarea />`                                |
| `Checkbox` | Чекбоксы          | `<Checkbox />`                                |
| `Badge`    | Бейджи            | `<Badge>New</Badge>`                          |

**Пример использования:**

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

<Card>
  <CardHeader>
    <h2>Create Task</h2>
  </CardHeader>
  <CardContent>
    <Input placeholder="Task title" />
    <Button>Create</Button>
  </CardContent>
</Card>
```

---

### 5. Utility Components

**Файлы:** `src/components/`

| Компонент       | Описание       | Использование               |
| --------------- | -------------- | --------------------------- |
| `ThemeProvider` | Theme контекст | Обертка для dark/light mode |
| `ModeToggle`    | Toggle theme   | Кнопка переключения темы    |

---

## 📋 Создание нового компонента

### 1. Создайте файл компонента

```typescript
// src/components/feature/MyComponent.tsx
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div>
      <h2>{title}</h2>
      <Button onClick={onAction}>Action</Button>
    </div>
  );
}
```

### 2. Экспортируйте

```typescript
// src/components/feature/index.ts
export { MyComponent } from './MyComponent';
```

### 3. Используйте

```typescript
import { MyComponent } from '@/components/feature';

<MyComponent title="Test" onAction={handleAction} />
```

---

## 🎯 Best Practices

### Компоненты

- ✅ Функциональные компоненты + hooks
- ✅ TypeScript интерфейсы для props
- ✅ Именованные экспорты
- ✅ Один компонент = один файл

### Props

- ✅ Деструктуризация props
- ✅ Типизация всех props
- ✅ Default значения через destructuring
- ✅ children как ReactNode

### Стили

- ✅ Tailwind CSS классы
- ✅ cn() утилита для условных классов
- ✅ Responsive дизайн
- ✅ Dark mode поддержка

### Переиспользование

- ✅ Выносить общую логику в hooks
- ✅ Использовать shadcn/ui компоненты
- ✅ Композиция над наследованием
- ✅ Props drilling → Context/Zustand

---

## 🔗 Связи

**Используется в:**

- Pages (Next.js)
- Другие компоненты

**Использует:**

- UI компоненты (shadcn/ui)
- Hooks (custom и React)
- Stores (Zustand)
- Types (TypeScript)
