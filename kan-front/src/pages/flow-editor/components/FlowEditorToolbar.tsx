import React from 'react';
import Link from 'next/link';
import { Button } from '@/src/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/shared/components/ui/dropdown-menu';
import {
  Save,
  Play,
  ArrowLeft,
  Edit,
  Sidebar,
  Download,
  Upload,
  FileText,
} from 'lucide-react';

interface FlowEditorToolbarProps {
  flowName?: string;
  isPaletteOpen: boolean;
  onTogglePalette: () => void;
  onSave: () => void;
  onTest: () => void;
  onExportJSON: () => void;
  onExportPDF: () => void;
  onImport: () => void;
  hasFlow: boolean;
}

export function FlowEditorToolbar({
  flowName,
  isPaletteOpen,
  onTogglePalette,
  onSave,
  onTest,
  onExportJSON,
  onExportPDF,
  onImport,
  hasFlow,
}: FlowEditorToolbarProps) {
  return (
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
                {flowName || 'Загрузка...'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePalette}
            className="h-8 w-8 p-0"
          >
            <Sidebar className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onTest}
            disabled={!hasFlow}
            className="h-8"
          >
            <Play className="h-4 w-4 mr-1" />
            Тест
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={!hasFlow}
                className="h-8"
              >
                <Download className="h-4 w-4 mr-1" />
                Экспорт
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onExportJSON}>
                <FileText className="h-4 w-4 mr-2" />
                Экспорт в JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportPDF}>
                <FileText className="h-4 w-4 mr-2" />
                Экспорт в PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={onImport}
            className="h-8"
          >
            <Upload className="h-4 w-4 mr-1" />
            Импорт
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            className="h-8 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Save className="h-4 w-4 mr-1" />
            Сохранить изменения
          </Button>
        </div>
      </div>
    </div>
  );
}
