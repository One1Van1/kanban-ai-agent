'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Save,
  Play,
  Square,
  Settings,
  Sidebar,
  PanelRightOpen,
  Download,
  Upload,
  Trash2,
  Zap,
  Shield,
  Layers3,
} from 'lucide-react';
import { useTranslation } from '../../../lib/i18n';
import { LanguageToggle } from '../../ui/language-toggle';

interface FlowToolbarProps {
  onSave: () => void;
  onToggleSidebar: () => void;
  onToggleProperties: () => void;
  readonly?: boolean;
  quickDeleteMode?: boolean;
  onToggleQuickDelete?: (enabled: boolean) => void;
  onCascadeDelete?: () => void;
}

export function FlowToolbar({
  onSave,
  onToggleSidebar,
  onToggleProperties,
  readonly = false,
  quickDeleteMode = false,
  onToggleQuickDelete,
  onCascadeDelete,
}: FlowToolbarProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Левая группа - основные действия */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="h-8 w-8 p-0"
        >
          <Sidebar className="h-4 w-4" />
        </Button>

        {!readonly && (
          <>
            <Button
              variant="default"
              size="sm"
              onClick={onSave}
              className="h-8"
            >
              <Save className="h-4 w-4 mr-1" />
              {t('flowBuilder.save')}
            </Button>

            <Button variant="outline" size="sm" className="h-8">
              <Play className="h-4 w-4 mr-1" />
              {t('flowBuilder.test')}
            </Button>
          </>
        )}
      </div>

      {/* Центральная группа - название flow */}
      <div className="flex-1 flex justify-center">
        <h1 className="text-sm font-medium text-foreground">
          {t('flowBuilder.title')}
        </h1>
      </div>

      {/* Группа режимов удаления */}
      {!readonly && (
        <div className="flex items-center gap-2 px-3 border-l border-r border-border">
          <div className="flex items-center gap-1 mr-2">
            <Trash2 className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Удаление:</span>
          </div>

          {/* Переключатель Безопасный/Быстрый режим */}
          <Button
            variant={quickDeleteMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToggleQuickDelete?.(!quickDeleteMode)}
            className={`h-7 text-xs transition-all ${
              quickDeleteMode
                ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500'
                : 'border-green-200 text-green-600 hover:bg-green-50'
            }`}
          >
            {quickDeleteMode ? (
              <>
                <Zap className="h-3 w-3 mr-1" />
                Быстрый режим
              </>
            ) : (
              <>
                <Shield className="h-3 w-3 mr-1" />
                Безопасный режим
              </>
            )}
          </Button>

          {/* Каскадное удаление */}
          <Button
            variant="outline"
            size="sm"
            onClick={onCascadeDelete}
            className="h-7 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            <Layers3 className="h-3 w-3 mr-1" />
            Каскадное удаление
          </Button>

          {/* Статус */}
          <div className="ml-2 text-xs">
            {quickDeleteMode ? (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
                <Zap className="h-2 w-2" />
                Быстрый
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                <Shield className="h-2 w-2" />
                Безопасный
              </span>
            )}
          </div>
        </div>
      )}

      {/* Правая группа - настройки и панели */}
      <div className="flex items-center gap-2">
        {!readonly && (
          <>
            <Button variant="ghost" size="sm" className="h-8">
              <Download className="h-4 w-4 mr-1" />
              {t('flowBuilder.toolbar.export')}
            </Button>

            <Button variant="ghost" size="sm" className="h-8">
              <Upload className="h-4 w-4 mr-1" />
              {t('flowBuilder.toolbar.import')}
            </Button>
          </>
        )}

        <Button variant="ghost" size="sm" className="h-8">
          <Settings className="h-4 w-4 mr-1" />
          {t('flowBuilder.toolbar.settings')}
        </Button>

        <LanguageToggle />

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleProperties}
          className="h-8 w-8 p-0"
        >
          <PanelRightOpen className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
