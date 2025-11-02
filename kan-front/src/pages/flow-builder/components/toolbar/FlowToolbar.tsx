'use client';

import React from 'react';
import { Button } from '@/src/shared/components/ui/button';
import { Zap, Shield, Layers3 } from 'lucide-react';
import { useTranslation } from '@/src/shared/i18n';

interface FlowToolbarProps {
  readonly?: boolean;
  quickDeleteMode?: boolean;
  onToggleQuickDelete?: (enabled: boolean) => void;
  onCascadeDelete?: () => void;
}

export function FlowToolbar({
  readonly = false,
  quickDeleteMode = false,
  onToggleQuickDelete,
  onCascadeDelete,
}: FlowToolbarProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Группа режимов удаления */}
      {!readonly && (
        <div className="flex items-center justify-end gap-2 px-3 py-2 border-l border-r border-border">
          {/* Переключатель Безопасный/Быстрый режим */}
          <Button
            variant={quickDeleteMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToggleQuickDelete?.(!quickDeleteMode)}
            className={`h-7 text-xs transition-all active:scale-95 ${
              quickDeleteMode
                ? 'bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white border border-orange-400'
                : 'border border-green-300 text-green-700 hover:bg-green-50 active:bg-green-100 dark:hover:bg-green-950/20 dark:active:bg-green-950/40 dark:border-green-600 dark:text-green-300'
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
            className="h-7 text-xs border border-red-300 text-red-700 hover:bg-red-50 active:bg-red-100 active:scale-95 transition-all dark:hover:bg-red-950/20 dark:active:bg-red-950/40 dark:border-red-600 dark:text-red-300"
          >
            <Layers3 className="h-3 w-3 mr-1" />
            Каскадное удаление
          </Button>
        </div>
      )}

      {/* Правая группа - очищена */}
      <div className="flex items-center gap-2"></div>
    </>
  );
}
