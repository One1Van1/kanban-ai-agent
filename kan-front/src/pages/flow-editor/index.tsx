'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/src/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useFlowEditor, useFlowsList } from './hooks';
import { FlowsList, FlowEditorContent } from './components';

export default function FlowEditorPageContent() {
  const editor = useFlowEditor();
  const flowsList = useFlowsList(!editor.flowId);

  // Show flows list when no flowId
  if (!editor.flowId) {
    return (
      <FlowsList
        flows={flowsList.flows}
        isLoading={flowsList.isLoading}
        onSelectFlow={flowsList.handleSelectFlow}
      />
    );
  }

  // Show loading state
  if (editor.isLoading) {
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
  if (editor.error) {
    return (
      <div className="flex h-screen w-screen bg-background items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">
            Ошибка загрузки Flow: {editor.error}
          </p>
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
    <FlowEditorContent
      currentFlow={editor.currentFlow}
      flowCanvasRef={editor.flowCanvasRef}
      isPaletteOpen={editor.isPaletteOpen}
      isPropertiesOpen={editor.isPropertiesOpen}
      quickDeleteMode={editor.quickDeleteMode}
      isCascadeDeleteOpen={editor.isCascadeDeleteOpen}
      onFlowChange={editor.setCurrentFlow}
      onTogglePalette={() => editor.setIsPaletteOpen(!editor.isPaletteOpen)}
      onSave={editor.handleSaveFlow}
      onTest={editor.handleTestFlow}
      onExportJSON={editor.handleExportJSON}
      onExportPDF={editor.handleExportPDF}
      onImport={editor.handleImportFlow}
      onToggleQuickDelete={editor.handleToggleQuickDelete}
      onCascadeDelete={editor.handleCascadeDelete}
      onConfirmCascadeDelete={editor.handleConfirmCascadeDelete}
      onCloseCascadeDialog={editor.handleCloseCascadeDialog}
      showAlert={editor.showAlert}
      showConfirm={editor.showConfirm}
    />
  );
}
