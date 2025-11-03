import React from 'react';
import Link from 'next/link';
import { Button } from '@/src/shared/components/ui/button';
import { Sidebar as AppSidebar } from '@/src/shared/components/ui/sidebar';
import { Menu, ArrowLeft } from 'lucide-react';
import { useSidebar } from '@/src/lib/SidebarContext';
import FlowCanvas, {
  FlowCanvasRef,
} from '@/src/views/flow-builder/components/canvas/FlowCanvas';
import { FlowToolbar } from '@/src/views/flow-builder/components/toolbar/FlowToolbar';
import { ConfirmCascadeDeleteDialog } from '@/src/views/flow-builder/components/dialogs/ConfirmCascadeDeleteDialog';
import { FlowEditorToolbar } from './FlowEditorToolbar';
import { FlowDefinition } from '@/src/features/flow-builder/types';

interface FlowEditorContentProps {
  currentFlow: FlowDefinition | null;
  flowCanvasRef: React.RefObject<FlowCanvasRef | null>;
  isPaletteOpen: boolean;
  isPropertiesOpen: boolean;
  quickDeleteMode: boolean;
  isCascadeDeleteOpen: boolean;
  onFlowChange: (flow: FlowDefinition) => void;
  onTogglePalette: () => void;
  onSave: () => void;
  onTest: () => void;
  onExportJSON: () => void;
  onExportPDF: () => void;
  onImport: () => void;
  onToggleQuickDelete: (enabled: boolean) => void;
  onCascadeDelete: () => void;
  onConfirmCascadeDelete: () => void;
  onCloseCascadeDialog: () => void;
  showAlert: (
    message: string,
    type?: 'success' | 'error' | 'warning' | 'info',
  ) => void;
  showConfirm: (message: string, title?: string) => Promise<boolean>;
}

export function FlowEditorContent({
  currentFlow,
  flowCanvasRef,
  isPaletteOpen,
  isPropertiesOpen,
  quickDeleteMode,
  isCascadeDeleteOpen,
  onFlowChange,
  onTogglePalette,
  onSave,
  onTest,
  onExportJSON,
  onExportPDF,
  onImport,
  onToggleQuickDelete,
  onCascadeDelete,
  onConfirmCascadeDelete,
  onCloseCascadeDialog,
  showAlert,
  showConfirm,
}: FlowEditorContentProps) {
  const { isOpen: isSidebarOpen, toggle: toggleSidebar } = useSidebar();

  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden">
      <AppSidebar />

      {!isSidebarOpen && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 h-10 w-10 p-0 shadow-md border bg-background"
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}

      <div
        className={`flex-1 h-full transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
      >
        <div className="h-screen">
          <div className="h-full flex flex-col">
            <FlowEditorToolbar
              flowName={currentFlow?.name}
              isPaletteOpen={isPaletteOpen}
              onTogglePalette={onTogglePalette}
              onSave={onSave}
              onTest={onTest}
              onExportJSON={onExportJSON}
              onExportPDF={onExportPDF}
              onImport={onImport}
              hasFlow={!!currentFlow}
            />

            <div className="bg-card border-b border-border flex-shrink-0">
              <FlowToolbar
                quickDeleteMode={quickDeleteMode}
                onToggleQuickDelete={onToggleQuickDelete}
                onCascadeDelete={onCascadeDelete}
              />
            </div>

            <div className="flex-1 bg-background overflow-hidden">
              <FlowCanvas
                ref={flowCanvasRef}
                flow={currentFlow || undefined}
                onFlowChange={onFlowChange}
                isSidebarOpen={isPaletteOpen}
                isPropertiesOpen={isPropertiesOpen}
                isMainSidebarOpen={isSidebarOpen}
                quickDeleteMode={quickDeleteMode}
                onQuickDeleteModeChange={onToggleQuickDelete}
                onCascadeDelete={onCascadeDelete}
                showAlert={showAlert}
                showConfirm={showConfirm}
              />
            </div>
          </div>
        </div>
      </div>

      <ConfirmCascadeDeleteDialog
        isOpen={isCascadeDeleteOpen}
        onClose={onCloseCascadeDialog}
        onConfirm={onConfirmCascadeDelete}
      />
    </div>
  );
}
