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
} from 'lucide-react';
import { useTranslation } from '../../../lib/i18n';
import { LanguageToggle } from '../../ui/language-toggle';

interface FlowToolbarProps {
  onSave: () => void;
  onToggleSidebar: () => void;
  onToggleProperties: () => void;
  readonly?: boolean;
}

export function FlowToolbar({
  onSave,
  onToggleSidebar,
  onToggleProperties,
  readonly = false,
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
