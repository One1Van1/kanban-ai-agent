#!/bin/bash

# Update imports in app/ directory pages

echo "🔄 Updating imports in app/ directory..."

# Update stores imports
find app -type f -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i '' \
    -e "s|@/src/lib/stores/agents-store|@/src/features/agents/stores/agents.store|g" \
    -e "s|@/src/lib/stores/flow-builder-store|@/src/features/flow-builder/stores/flow-builder.store|g" \
    -e "s|@/src/lib/stores/flow-editor-store|@/src/features/flows/stores/flow-editor.store|g" \
    -e "s|@/src/lib/stores/kanban-store|@/src/features/kanban/stores/kanban.store|g" \
    "$file"
done

# Update API client imports
find app -type f -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i '' \
    -e "s|@/src/lib/api/client|@/src/shared/api/http-client|g" \
    "$file"
done

# Update component imports
find app -type f -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i '' \
    -e "s|@/src/components/flows/EditableFlowCard|@/src/features/flows/components/EditableFlowCard|g" \
    -e "s|../../../src/components/flow-builder/FlowCanvas|@/src/features/flow-builder/components/canvas/FlowCanvas|g" \
    -e "s|../../../src/components/flow-builder/toolbar/FlowToolbar|@/src/features/flow-builder/components/toolbar/FlowToolbar|g" \
    -e "s|../../../src/components/flow-builder/dialogs/ConfirmCascadeDeleteDialog|@/src/features/flow-builder/components/dialogs/ConfirmCascadeDeleteDialog|g" \
    "$file"
done

# Update types imports
find app -type f -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i '' \
    -e "s|../../../src/types/flow-builder|@/src/features/flow-builder/types|g" \
    -e "s|@/src/types/flow-builder|@/src/features/flow-builder/types|g" \
    "$file"
done

echo "✅ Updated imports in app/ directory"

# Update imports in flow-builder components

echo "🔄 Updating imports in flow-builder components..."

# Update FlowCanvas imports
sed -i '' \
  -e "s|@/src/types/flow-builder|@/src/features/flow-builder/types|g" \
  -e "s|@/src/lib/api/client|@/src/features/flows/api/flows.api|g" \
  -e "s|'./sidebar/BlockPalette'|'../sidebar/BlockPalette'|g" \
  -e "s|'./toolbar/FlowToolbar'|'../toolbar/FlowToolbar'|g" \
  -e "s|'./blocks/TriggerBlock'|'../blocks/TriggerBlock'|g" \
  -e "s|'./blocks/ContextBlock'|'../blocks/ContextBlock'|g" \
  -e "s|'./blocks/LogicBlock'|'../blocks/LogicBlock'|g" \
  -e "s|'./blocks/ActionBlock'|'../blocks/ActionBlock'|g" \
  -e "s|'./blocks/WaitBlock'|'../blocks/WaitBlock'|g" \
  -e "s|'./dialogs/ConfirmDeleteDialog'|'../dialogs/ConfirmDeleteDialog'|g" \
  -e "s|'./SaveFlowDialog'|'../dialogs/SaveFlowDialog'|g" \
  -e "s|'./components/DynamicConnectionLine'|'./DynamicConnectionLine'|g" \
  -e "s|'./components/StyledSmoothStepEdge'|'../edges/StyledSmoothStepEdge'|g" \
  src/features/flow-builder/components/canvas/FlowCanvas.tsx

# Update block components imports
find src/features/flow-builder/components/blocks -type f -name "*.tsx" | while read file; do
  sed -i '' \
    -e "s|'../components/ConnectionHandle'|'./ConnectionHandle'|g" \
    "$file"
done

# Update BlockPalette imports
sed -i '' \
  -e "s|../../../lib/i18n|@/src/shared/i18n|g" \
  src/features/flow-builder/components/sidebar/BlockPalette.tsx

# Update FlowToolbar imports
sed -i '' \
  -e "s|../../../lib/i18n|@/src/shared/i18n|g" \
  src/features/flow-builder/components/toolbar/FlowToolbar.tsx

# Update flow-builder store imports
sed -i '' \
  -e "s|@/src/types/flow-builder|@/src/features/flow-builder/types|g" \
  -e "s|@/src/lib/api/client|@/src/features/flows/api/flows.api|g" \
  src/features/flow-builder/stores/flow-builder.store.ts

echo "✅ Updated imports in flow-builder components"

echo ""
echo "🎉 All imports updated successfully!"
echo "Run 'yarn tsc --noEmit' to check for TypeScript errors"
