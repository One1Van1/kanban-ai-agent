import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FlowDefinition } from '@/src/features/flow-builder/types';
import { useFlowEditorStore } from '@/src/features/flows/stores/flow-editor.store';
import { useDialog } from '@/src/shared/hooks/use-dialog';
import { flowsAPI } from '@/src/features/flows/api/flows.api';
import { FlowCanvasRef } from '@/src/views/flow-builder/components/canvas/FlowCanvas';

export function useFlowEditor() {
  const { showAlert, showConfirm } = useDialog();
  const searchParams = useSearchParams();
  const router = useRouter();
  const flowId = searchParams?.get('flowId') || null;

  const { currentFlow, setCurrentFlow, loadFlow, isLoading, error } =
    useFlowEditorStore();

  const [isPaletteOpen, setIsPaletteOpen] = useState(true);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [quickDeleteMode, setQuickDeleteMode] = useState(false);
  const [isCascadeDeleteOpen, setIsCascadeDeleteOpen] = useState(false);

  const flowCanvasRef = useRef<FlowCanvasRef>(null);

  // Load flow based on flowId
  useEffect(() => {
    if (flowId) {
      console.log('🔄 Flow Editor: Loading flow for editing:', flowId);
      loadFlow(flowId).catch((error: any) => {
        console.error('❌ Flow Editor: Failed to load flow:', error);
        showAlert(`Failed to load flow: ${error.message}`, 'error');
      });
    }
  }, [flowId]);

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

    console.log('💾 Flow Editor: Saving flow changes...');
    await flowCanvasRef.current.saveFlow();
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

  const handleExportJSON = async () => {
    if (!currentFlow?.id) {
      showAlert('No flow to export', 'warning');
      return;
    }

    try {
      console.log('📤 Exporting flow to JSON:', currentFlow.id);
      const exportData = await flowsAPI.exportJson(currentFlow.id);

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentFlow.name || 'flow'}-export.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showAlert('Flow exported successfully to JSON', 'success');
    } catch (error) {
      console.error('❌ Failed to export flow:', error);
      showAlert(
        error instanceof Error ? error.message : 'Failed to export flow',
        'error',
      );
    }
  };

  const handleExportPDF = async () => {
    if (!currentFlow?.id) {
      showAlert('No flow to export', 'warning');
      return;
    }

    try {
      console.log('📄 Exporting flow to PDF:', currentFlow.id);
      const pdfBlob = await flowsAPI.exportPdf(currentFlow.id);

      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentFlow.name || 'flow'}-export.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showAlert('Flow exported successfully to PDF', 'success');
    } catch (error) {
      console.error('❌ Failed to export flow to PDF:', error);
      showAlert(
        error instanceof Error ? error.message : 'Failed to export flow to PDF',
        'error',
      );
    }
  };

  const handleImportFlow = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        console.log('📥 Importing flow from file:', file.name);
        const text = await file.text();
        const importData = JSON.parse(text);

        let importMode: 'create_new' | 'replace_existing' | 'merge' =
          'create_new';

        if (currentFlow?.id) {
          const choice = window.confirm(
            `Выберите действие:\n\n` +
              `ОК - Добавить блоки к текущему flow (merge на canvas)\n` +
              `Отмена - Создать новый отдельный flow\n\n` +
              `Текущий flow: "${currentFlow.name}"\n` +
              `Импортируемый flow: "${importData.name}"`,
          );

          if (choice) {
            importMode = 'merge';
            console.log('🔀 User chose to MERGE blocks to current flow');
          } else {
            importMode = 'create_new';
            console.log('➕ User chose to CREATE NEW flow');
          }
        }

        if (importMode === 'merge' && currentFlow) {
          console.log('🔀 Merging blocks to canvas...');

          const importedBlocks = importData.definition?.blocks || [];
          const importedConnections = importData.definition?.connections || [];

          const existingBlocks = currentFlow.blocks || [];
          let maxX = 0;
          let maxY = 0;

          existingBlocks.forEach((block: any) => {
            const x = block.position?.x || 0;
            const y = block.position?.y || 0;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          });

          const OFFSET_X = maxX + 400;
          const OFFSET_Y = maxY > 0 ? 100 : 200;

          console.log(
            `📐 Calculated offset: X=${OFFSET_X}, Y=${OFFSET_Y} (maxX=${maxX}, maxY=${maxY})`,
          );

          const timestamp = Date.now();
          const idMapping: Record<string, string> = {};

          const shiftedBlocks = importedBlocks.map((block: any) => {
            const oldId = block.id;
            const newId = `${block.blockType || block.type}-${timestamp}-${Math.random().toString(36).substring(7)}`;
            idMapping[oldId] = newId;

            return {
              ...block,
              id: newId,
              position: {
                x: (block.position?.x || 0) + OFFSET_X,
                y: (block.position?.y || 0) + OFFSET_Y,
              },
            };
          });

          const updatedConnections = importedConnections.map((conn: any) => {
            const newSource = idMapping[conn.source] || conn.source;
            const newTarget = idMapping[conn.target] || conn.target;

            return {
              ...conn,
              id: `edge-${timestamp}-${Math.random().toString(36).substring(7)}`,
              source: newSource,
              target: newTarget,
            };
          });

          const mergedFlow = {
            ...currentFlow,
            blocks: [...(currentFlow.blocks || []), ...shiftedBlocks],
            connections: [
              ...(currentFlow.connections || []),
              ...updatedConnections,
            ],
          };

          console.log('✅ Merged flow with new IDs:', mergedFlow);

          try {
            await flowsAPI.update(currentFlow.id, {
              definition: {
                blocks: mergedFlow.blocks,
                connections: mergedFlow.connections,
                triggers: mergedFlow.triggers || [],
                variables: mergedFlow.variables || [],
                settings: mergedFlow.settings || {},
              },
              updatedBy: 'user-123',
            });

            showAlert(
              `✅ Добавлено ${shiftedBlocks.length} блоков (с новыми ID) и ${updatedConnections.length} связей. Перезагружаю...`,
              'success',
            );

            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } catch (error) {
            console.error('❌ Failed to save merged flow:', error);
            showAlert(
              'Не удалось сохранить объединённый flow: ' +
                (error instanceof Error ? error.message : 'Unknown error'),
              'error',
            );
          }

          return;
        }

        const response = await flowsAPI.import({
          version: importData.version,
          name: importData.name,
          description: importData.description,
          status: importData.status,
          definition: importData.definition,
          metadata: importData.metadata,
          importMode: importMode === 'merge' ? 'create_new' : importMode,
          createdBy: 'user-123',
        });

        showAlert(response.message, 'success');

        if (response.flowId) {
          console.log(
            '✅ Flow imported successfully, redirecting to:',
            response.flowId,
          );
          window.location.href = `/flows/editor?flowId=${response.flowId}`;
        }
      } catch (error) {
        console.error('❌ Failed to import flow:', error);
        showAlert(
          error instanceof Error ? error.message : 'Failed to import flow',
          'error',
        );
      }
    };
    input.click();
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

  return {
    // State
    flowId,
    currentFlow,
    isLoading,
    error,
    isPaletteOpen,
    isPropertiesOpen,
    quickDeleteMode,
    isCascadeDeleteOpen,
    flowCanvasRef,

    // Setters
    setCurrentFlow,
    setIsPaletteOpen,
    setIsPropertiesOpen,

    // Handlers
    handleSaveFlow,
    handleTestFlow,
    handleToggleQuickDelete,
    handleCascadeDelete,
    handleExportJSON,
    handleExportPDF,
    handleImportFlow,
    handleConfirmCascadeDelete,
    handleCloseCascadeDialog,

    // Dialog helpers
    showAlert,
    showConfirm,
  };
}
