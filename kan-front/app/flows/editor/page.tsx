'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FlowCanvas, {
  FlowCanvasRef,
} from '../../../src/components/flow-builder/FlowCanvas';
import { FlowToolbar } from '../../../src/components/flow-builder/toolbar/FlowToolbar';
import { Button } from '../../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import {
  Save,
  Play,
  ArrowLeft,
  Edit,
  Sidebar,
  Menu,
  FileText,
  Clock,
  Bot,
} from 'lucide-react';
import { FlowDefinition } from '../../../src/types/flow-builder';
import { useTranslation } from '../../../src/lib/i18n';
import { Sidebar as AppSidebar } from '../../../components/ui/sidebar';
import { useSidebar } from '../../../src/lib/SidebarContext';
import { useFlowEditorStore } from '../../../src/lib/stores/flow-editor-store';
import { useDialog } from '../../../src/hooks/use-dialog';
import Link from 'next/link';
import { ConfirmCascadeDeleteDialog } from '../../../src/components/flow-builder/dialogs/ConfirmCascadeDeleteDialog';
import { apiClient } from '../../../src/lib/api/client';

interface FlowItem {
  flowId: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  agentId?: string;
  blockCount: number;
  metadata?: any;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export default function FlowEditorPage() {
  const { t } = useTranslation();
  const { isOpen: isSidebarOpen, toggle: toggleSidebar } = useSidebar();
  const { showAlert, showConfirm } = useDialog();
  const searchParams = useSearchParams();
  const router = useRouter();
  const flowId = searchParams.get('flowId');

  const { currentFlow, setCurrentFlow, loadFlow, isLoading, error } =
    useFlowEditorStore();

  // State for flows list when no flowId
  const [flows, setFlows] = useState<FlowItem[]>([]);
  const [flowsLoading, setFlowsLoading] = useState(false);

  const [isPaletteOpen, setIsPaletteOpen] = useState(true);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);

  // Состояние для режима быстрого удаления
  const [quickDeleteMode, setQuickDeleteMode] = useState(false);

  // Состояние для диалога каскадного удаления
  const [isCascadeDeleteOpen, setIsCascadeDeleteOpen] = useState(false);

  // Ref для доступа к функциям FlowCanvas
  const flowCanvasRef = useRef<FlowCanvasRef>(null);

  // Load flows list or specific flow based on flowId
  useEffect(() => {
    if (flowId) {
      // Load specific flow for editing ТОЛЬКО если это новый flowId
      console.log('🔄 Flow Editor: Loading flow for editing:', flowId);
      loadFlow(flowId).catch((error: any) => {
        console.error('❌ Flow Editor: Failed to load flow:', error);
        showAlert(`Failed to load flow: ${error.message}`, 'error');
      });
    } else {
      // Load flows list for selection
      loadFlowsList();
    }
  }, [flowId]); // УБИРАЕМ loadFlow и showAlert из зависимостей!

  const loadFlowsList = async () => {
    try {
      setFlowsLoading(true);
      console.log('🔄 Loading flows list for editor...');

      const response = await apiClient.flowManagement.listFlows({
        limit: 50,
      });

      console.log('✅ Flows loaded successfully:', response);
      setFlows(response.items || []);
    } catch (err) {
      console.error('❌ Failed to load flows:', err);
      showAlert(
        err instanceof Error ? err.message : 'Failed to load flows',
        'error',
      );
    } finally {
      setFlowsLoading(false);
    }
  };

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

    const confirmed = await showConfirm(
      'Вы уверены, что хотите сохранить изменения в этом Flow?',
      'Подтверждение сохранения изменений',
    );

    if (confirmed) {
      console.log('💾 Flow Editor: Saving flow changes...');
      await flowCanvasRef.current.saveFlow();
    }
  };

  const handleTestFlow = () => {
    if (currentFlow) {
      console.log('🧪 Flow Editor: Testing flow:', currentFlow);
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

  const handleSelectFlow = (selectedFlowId: string) => {
    router.push(`/flows/editor?flowId=${selectedFlowId}`);
  };

  // Show flows list when no flowId
  if (!flowId) {
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
          <div className="h-full flex flex-col">
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
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Edit className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h1 className="text-xl font-semibold text-foreground">
                          Выберите Flow для редактирования
                        </h1>
                        <p className="text-sm text-muted-foreground">
                          Выберите существующий flow из списка ниже
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-6 bg-background overflow-auto">
                {flowsLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Загрузка flows...</p>
                  </div>
                ) : flows.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Нет доступных flows
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Создайте новый flow в Flow Builder, чтобы его можно было
                      редактировать
                    </p>
                    <Link href="/agents/flow-builder">
                      <Button>Создать новый Flow</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {flows.map((flow) => (
                      <Card
                        key={flow.flowId}
                        className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50"
                        onClick={() => handleSelectFlow(flow.flowId)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-lg line-clamp-1">
                                {flow.name}
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    flow.status === 'active'
                                      ? 'default'
                                      : flow.status === 'draft'
                                        ? 'secondary'
                                        : 'outline'
                                  }
                                >
                                  {flow.status}
                                </Badge>
                                {flow.agentId && (
                                  <Badge variant="outline" className="text-xs">
                                    <Bot className="h-3 w-3 mr-1" />
                                    Deployed
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {flow.description || 'Нет описания'}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {flow.blockCount || 0} блоков
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(flow.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen bg-background items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Загрузка Flow для редактирования...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-screen w-screen bg-background items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Ошибка загрузки Flow: {error}</p>
          <Link href="/flows/editor">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к выбору flows
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Show flow editor
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
            <div className="h-16 bg-card border-b border-border shadow-sm flex-shrink-0">
              <div className="h-full flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                  <Link
                    href="/flows/editor"
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Edit className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold text-foreground">
                        Редактирование Flow
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        {currentFlow?.name || 'Загрузка...'}
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
                    Тест
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveFlow}
                    className="h-8 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Сохранить изменения
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
