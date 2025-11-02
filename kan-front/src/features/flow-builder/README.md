# Flow Builder Feature Block

## 📋 Description

Visual flow construction system with drag-and-drop interface built on ReactFlow. Allows users to create, edit, and configure automation flows using a graphical node-based editor.

## 🎯 Responsibilities

- Visual flow canvas with drag-and-drop functionality
- Block palette with available flow components
- Properties panel for block configuration
- Toolbar with flow management actions
- Real-time flow validation and preview
- Flow saving and loading
- Integration with ReactFlow engine

## 📁 Structure

```
flow-builder/
├── components/
│   ├── canvas/              # Main flow canvas
│   │   └── FlowCanvas.tsx   # Core ReactFlow canvas (1558 lines)
│   ├── blocks/              # Flow block components
│   │   ├── ActionBlock.tsx  # HTTP request, email, webhook blocks
│   │   ├── LogicBlock.tsx   # Conditional logic blocks
│   │   ├── WaitBlock.tsx    # Delay and wait blocks
│   │   ├── ContextBlock.tsx # Context manipulation blocks
│   │   └── TriggerBlock.tsx # Flow trigger blocks
│   ├── toolbar/             # Toolbar components
│   │   └── ...              # Save, run, validate actions
│   ├── sidebar/             # Sidebar components
│   │   └── BlockPalette.tsx # Draggable block palette (1433 lines)
│   ├── properties/          # Properties panel
│   │   └── PropertiesPanel.tsx # Block configuration panel (583 lines)
│   ├── dialogs/             # Dialog components
│   │   ├── ConfirmDelete.tsx
│   │   ├── ConfirmCascadeDelete.tsx
│   │   └── SaveFlowDialog.tsx
│   └── edges/               # Custom edge components
│       ├── StraightEdge.tsx
│       └── SmartSmoothStepEdge.tsx
├── stores/
│   └── flow-builder.store.ts # Zustand store for flow builder state
├── types/
│   └── index.ts             # Flow builder TypeScript types
├── hooks/                   # Custom hooks (if needed)
├── utils/                   # Utility functions (if needed)
└── README.md               # This file
```

## 🔌 API Integration

Uses the **flows API** from `@/src/features/flows/api/flows.api.ts`:

```typescript
import { flowsAPI } from '@/src/features/flows/api/flows.api';

// Save flow
await flowsAPI.createFlow(flowData);
await flowsAPI.updateFlow(id, flowData);

// Load flow
const flow = await flowsAPI.getFlowById(id);

// Execute flow
await flowsAPI.executeFlow(id, input);
```

## 🗄️ State Management

### Flow Builder Store

Located at `stores/flow-builder.store.ts`, manages:

- **Nodes**: Flow blocks on the canvas
- **Edges**: Connections between blocks
- **Selected elements**: Currently selected nodes/edges
- **Canvas state**: Zoom, pan, viewport
- **Validation state**: Flow validation results
- **Undo/redo**: Action history

```typescript
import { useFlowBuilderStore } from '@/src/features/flow-builder/stores/flow-builder.store';

const {
  nodes,
  edges,
  addNode,
  updateNode,
  deleteNode,
  addEdge,
  deleteEdge,
  setSelectedNode,
  validateFlow,
  saveFlow,
  loadFlow,
} = useFlowBuilderStore();
```

## 🧩 Key Components

### FlowCanvas (1558 lines)

Main ReactFlow canvas component:

- Handles drag-and-drop from palette
- Manages node/edge interactions
- Renders custom blocks and edges
- Handles zoom/pan/selection
- Integrates with ReactFlow engine

**Future optimization**: Consider splitting into:

- `FlowCanvas.tsx` - Main canvas wrapper
- `CanvasControls.tsx` - Zoom, fit, controls
- `CanvasHandlers.tsx` - Event handlers (drop, connect, etc.)
- `CanvasProvider.tsx` - ReactFlow provider setup

### BlockPalette (1433 lines)

Draggable block palette sidebar:

- Displays available block types
- Categorizes blocks (Actions, Logic, Triggers, etc.)
- Provides drag-and-drop functionality
- Shows block descriptions and icons

**Future optimization**: Consider splitting into:

- `BlockPalette.tsx` - Main palette component
- `BlockCategory.tsx` - Category grouping
- `BlockItem.tsx` - Individual draggable block
- `BlockSearch.tsx` - Search/filter functionality

### PropertiesPanel (583 lines)

Block configuration panel:

- Displays selected block properties
- Renders dynamic form fields
- Validates block configuration
- Handles property updates

**Future optimization**: Consider splitting into:

- `PropertiesPanel.tsx` - Main panel wrapper
- `PropertyForm.tsx` - Form rendering logic
- `PropertyFields.tsx` - Field type components
- `PropertyValidation.tsx` - Validation logic

## 📦 Dependencies

### External

- `reactflow` - Flow visualization engine
- `zustand` - State management
- `@/src/shared/api/http-client` - HTTP requests
- `@/src/shared/components/ui/*` - UI components

### Internal

- `@/src/features/flows/api/flows.api` - Flow CRUD operations
- `@/src/features/agents/api/agents.api` - Agent deployment

## 🚀 Usage Example

```typescript
import { FlowCanvas } from '@/src/features/flow-builder/components/canvas/FlowCanvas';
import { BlockPalette } from '@/src/features/flow-builder/components/sidebar/BlockPalette';
import { PropertiesPanel } from '@/src/features/flow-builder/components/properties/PropertiesPanel';
import { useFlowBuilderStore } from '@/src/features/flow-builder/stores/flow-builder.store';

export default function FlowBuilderPage() {
  const { loadFlow, saveFlow } = useFlowBuilderStore();

  useEffect(() => {
    if (flowId) {
      loadFlow(flowId);
    }
  }, [flowId]);

  return (
    <div className="flow-builder">
      <BlockPalette />
      <FlowCanvas />
      <PropertiesPanel />
    </div>
  );
}
```

## 🔄 Integration Points

### With Flows Feature

- Saves flows using `flowsAPI.createFlow()` / `updateFlow()`
- Loads flows using `flowsAPI.getFlowById()`
- Executes flows using `flowsAPI.executeFlow()`

### With Agents Feature

- Can deploy flows as agents
- Integrates agent blocks into flow

### With Shared Components

- Uses UI components from `@/src/shared/components/ui/`
- Uses http-client for API calls

## 📝 Type Definitions

See `types/index.ts` for:

- `FlowNode` - Node type definitions
- `FlowEdge` - Edge type definitions
- `BlockType` - Available block types
- `BlockConfig` - Block configuration schemas
- `FlowValidationResult` - Validation result types

## 🎨 Styling

- Uses Tailwind CSS classes
- Custom ReactFlow styles in `flow-handles-global.css`
- Responsive design for canvas and panels

## 🧪 Future Enhancements

1. **Component Splitting**: Break down large files (FlowCanvas, BlockPalette, PropertiesPanel)
2. **Custom Hooks**: Extract logic into reusable hooks
3. **Utils**: Create utility functions for flow validation, node positioning, etc.
4. **API Layer**: Add flow-builder specific API client if needed
5. **Tests**: Add unit tests for components and store

## 📚 Related Documentation

- [Flows Feature](/kan-front/src/features/flows/README.md)
- [Agents Feature](/kan-front/src/features/agents/README.md)
- [ReactFlow Documentation](https://reactflow.dev/)
- [Frontend Refactoring Plan](/kan-front/FRONTEND_REFACTORING_PLAN.md)
