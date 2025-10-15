'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FlowCanvas, {
  FlowCanvasRef,
} from '../../../src/components/flow-builder/FlowCanvas';
import { FlowToolbar } from '../../../src/components/flow-builder/toolbar/FlowToolbar';
import { Button } from '../../../components/ui/button';
import {
  Save,
  Play,
  ArrowLeft,
  Workflow,
  Sidebar,
  PanelRightOpen,
  Menu,
} from 'lucide-react';
import { FlowDefinition } from '../../../src/types/flow-builder';
import { useTranslation } from '../../../src/lib/i18n';
import { Sidebar as AppSidebar } from '../../../components/ui/sidebar';
import { useSidebar } from '../../../src/lib/SidebarContext';
import { useFlowBuilderStore } from '../../../src/lib/stores/flow-builder-store';
import { useDialog } from '../../../src/hooks/use-dialog';
import Link from 'next/link';
import { ConfirmCascadeDeleteDialog } from '../../../src/components/flow-builder/dialogs/ConfirmCascadeDeleteDialog';

export default function FlowBuilderPage() {
  const { t } = useTranslation();
  const { isOpen: isSidebarOpen, toggle: toggleSidebar } = useSidebar();
  const { showAlert, showConfirm } = useDialog();
  const searchParams = useSearchParams();
  const flowId = searchParams.get('flowId');

  const { currentFlow, setCurrentFlow, loadFlow, isLoading, error } =
    useFlowBuilderStore();

  const [isPaletteOpen, setIsPaletteOpen] = useState(true);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);

  // Состояние для режима быстрого удаления
  const [quickDeleteMode, setQuickDeleteMode] = useState(false);

  // Состояние для диалога каскадного удаления
  const [isCascadeDeleteOpen, setIsCascadeDeleteOpen] = useState(false);

  // Ref для доступа к функциям FlowCanvas
  const flowCanvasRef = useRef<FlowCanvasRef>(null);

  // Load flow if flowId is provided
  useEffect(() => {
    if (flowId) {
      loadFlow(flowId).catch((error) => {
        console.error('Failed to load flow:', error);
        showAlert(`Failed to load flow: ${error.message}`, 'error');
      });
    }
  }, [flowId, loadFlow, showAlert]);

  const handleSaveFlow = async () => {
    // Проверяем, есть ли что сохранять
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

    const confirmed = await showConfirm(
      'Вы уверены, что хотите сохранить этот Flow?',
      'Подтверждение сохранения',
    );

    if (confirmed) {
      await flowCanvasRef.current.saveFlow();
    }
  };

  const handleTestFlow = () => {
    if (currentFlow) {
      console.log('Testing flow:', currentFlow);
    }
  };

  // Функции для управления режимами удаления
  const handleToggleQuickDelete = (enabled: boolean) => {
    setQuickDeleteMode(enabled);
    console.log(enabled ? 'Quick delete mode enabled' : 'Safe mode enabled');
  };

  const handleCascadeDelete = () => {
    setIsCascadeDeleteOpen(true);
  };

  const handleConfirmCascadeDelete = () => {
    console.log('Triggering cascade delete via FlowCanvas');

    // Вызываем прямое каскадное удаление через ref
    if (flowCanvasRef.current) {
      flowCanvasRef.current.triggerCascadeDelete();
    } else {
      // Fallback: обновляем flow состояние
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

  const createDemoFlow = () => {
    const demoFlow: FlowDefinition = {
      id: 'demo-photo-analysis',
      name: t('flowBuilder.demo.name'),
      description: t('flowBuilder.demo.description'),
      version: '1.0',
      created: new Date(),
      updated: new Date(),
      triggers: [],
      blocks: [],
      connections: [],
      variables: [],
      settings: {
        timeout: 300000,
        retryAttempts: 3,
        errorHandling: 'stop',
        logging: 'detailed',
      },
    };
    setCurrentFlow(demoFlow);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      {/* Кнопка для открытия сайдбара когда он закрыт */}
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

            {/* FlowToolbar с режимами удаления */}
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

      {/* Диалог подтверждения каскадного удаления */}
      <ConfirmCascadeDeleteDialog
        isOpen={isCascadeDeleteOpen}
        onClose={handleCloseCascadeDialog}
        onConfirm={handleConfirmCascadeDelete}
      />
    </div>
  );
}
