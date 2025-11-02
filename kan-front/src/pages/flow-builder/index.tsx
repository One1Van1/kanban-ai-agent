// Flow Builder Page Exports
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FlowCanvas, {
  FlowCanvasRef,
} from './components/canvas/FlowCanvas';
import { FlowToolbar } from './components/toolbar/FlowToolbar';
import { Button } from '@/src/shared/components/ui/button';
import {
  Save,
  Play,
  Menu,
  ArrowLeft,
  Workflow,
  Sidebar,
} from 'lucide-react';
import { FlowDefinition } from '@/src/features/flow-builder/types';
import { useTranslation } from '@/src/shared/i18n';
import { Sidebar as AppSidebar } from '@/src/shared/components/ui/sidebar';
import { useSidebar } from '@/src/lib/SidebarContext';
import { useFlowBuilderStore } from '@/src/features/flow-builder/stores/flow-builder.store';
import { useDialog } from '@/src/shared/hooks/use-dialog';
import Link from 'next/link';
import { ConfirmCascadeDeleteDialog } from './components/dialogs/ConfirmCascadeDeleteDialog';

export default function FlowBuilderPageContent() {
  const { t } = useTranslation();
  const { isOpen: isSidebarOpen, toggle: toggleSidebar } = useSidebar();
  const { showAlert, showConfirm } = useDialog();
  const searchParams = useSearchParams();
  const flowId = searchParams.get('flowId');

  const { currentFlow, setCurrentFlow, loadFlow } = useFlowBuilderStore();

  const [isPaletteOpen, setIsPaletteOpen] = useState(true);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [quickDeleteMode, setQuickDeleteMode] = useState(false);
  const [isCascadeDeleteOpen, setIsCascadeDeleteOpen] = useState(false);

  const flowCanvasRef = useRef<FlowCanvasRef>(null);

  useEffect(() => {
    if (flowId) {
      loadFlow(flowId).catch((error) => {
        console.error('Failed to load flow:', error);
        showAlert(`Failed to load flow: ${error.message}`, 'error');
      });
    }
  }, [flowId, loadFlow, showAlert]);

  const handleSaveFlow = async () => {
    if (!flowCanvasRef.current) {
      console.warn('FlowCanvas ref not available');
      return;
    }

    if (!flowCanvasRef.current.hasContent()) {
      showAlert(
        'Нечего сохранять. Добавьте блоки в ваш Flow перед сохранением.',
        'warning',
      );
      return;
    }

    await flowCanvasRef.current.saveFlow();
  };

  const handleTestFlow = () => {
    if (currentFlow) {
      console.log('Testing flow:', currentFlow);
    }
  };

  const handleToggleQuickDelete = (enabled: boolean) => {
    setQuickDeleteMode(enabled);
    console.log(enabled ? 'Quick delete mode enabled' : 'Safe mode enabled');
  };

  const handleCascadeDelete = () => {
    setIsCascadeDeleteOpen(true);
  };

  const handleConfirmCascadeDelete = () => {
    console.log('Triggering cascade delete via FlowCanvas');

    if (flowCanvasRef.current) {
      flowCanvasRef.current.triggerCascadeDelete();
    } else {
      if (currentFlow) {
        const emptyFlow: FlowDefinition = {
          ...currentFlow,
          blocks: [],
          connections: [],
          updated: new Date(),
        };
        setCurrentFlow(emptyFlow);
      }
    }

    setIsCascadeDeleteOpen(false);
    console.log('Cascade delete triggered');
  };

  const handleCloseCascadeDialog = () => {
    setIsCascadeDeleteOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
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
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
      >
        <div className="h-screen">
          <div className="h-full flex flex-col">
            <div className="h-16 bg-card border-b border-border shadow-sm flex-shrink-0">
              <div className="h-full flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                  <Link
                    href="/flows"
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Workflow className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold text-foreground">
                        {t('flowBuilder.title')}
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        {t('flowBuilder.subtitle')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                    className="h-8 w-8 p-0"
                  >
                    <Sidebar className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestFlow}
                    disabled={!currentFlow}
                    className="h-8"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    {t('flowBuilder.test')}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveFlow}
                    className="h-8 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {t('flowBuilder.save')}
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-card border-b border-border flex-shrink-0">
              <FlowToolbar
                quickDeleteMode={quickDeleteMode}
                onToggleQuickDelete={handleToggleQuickDelete}
                onCascadeDelete={handleCascadeDelete}
              />
            </div>

            <div className="flex-1 bg-background overflow-hidden">
              <FlowCanvas
                ref={flowCanvasRef}
                flow={currentFlow || undefined}
                onFlowChange={setCurrentFlow}
                isSidebarOpen={isPaletteOpen}
                isPropertiesOpen={isPropertiesOpen}
                isMainSidebarOpen={isSidebarOpen}
                quickDeleteMode={quickDeleteMode}
                onQuickDeleteModeChange={handleToggleQuickDelete}
                onCascadeDelete={handleCascadeDelete}
                showAlert={showAlert}
                showConfirm={showConfirm}
              />
            </div>
          </div>
        </div>
      </div>

      <ConfirmCascadeDeleteDialog
        isOpen={isCascadeDeleteOpen}
        onClose={handleCloseCascadeDialog}
        onConfirm={handleConfirmCascadeDelete}
      />
    </div>
  );
}

export * from './components/sidebar/BlockPalette';
export * from './components/toolbar/FlowToolbar';
export * from './components/properties/PropertiesPanel';

// Blocks
export * from './components/blocks/ActionBlock';
export * from './components/blocks/ContextBlock';
export * from './components/blocks/LogicBlock';
export * from './components/blocks/ResultBlock';
export * from './components/blocks/TriggerBlock';
export * from './components/blocks/WaitBlock';
