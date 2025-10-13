'use client';

import React, { useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, GitBranch, Database, Pencil, Trash2 } from 'lucide-react';
import { useLanguage } from '@/src/lib/i18n/LanguageContext';
import { useBlockEdit } from '@/src/hooks/useBlockEdit';

interface TriggerBlockProps {
  data: {
    type: string;
    name: string;
    config: any;
    isEditing?: boolean;
  };
  id: string;
  selected: boolean;
  onDeleteBlock?: (nodeId: string) => void;
}

export function TriggerBlock({
  data,
  id,
  selected,
  onDeleteBlock,
}: TriggerBlockProps) {
  const { t } = useLanguage();
  const { isEditing, toggleEdit, saveEdit, cancelEdit } = useBlockEdit(id);

  console.log('🔄 TriggerBlock render:', {
    id,
    isEditing,
    dataType: data.type,
  });

  const getIcon = () => {
    switch (data.type) {
      case 'board_move':
        return <GitBranch className="w-4 h-4" />;
      case 'board_create':
        return <Database className="w-4 h-4" />;
      case 'webhook':
        return <Zap className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getColor = () => {
    return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-800 dark:text-green-200';
  };

  return (
    <Card
      className={`w-72 ${selected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'} ${getColor()} transition-all hover:shadow-md`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-start gap-2 text-sm">
          <span className="flex-1 min-w-0">
            {t('flowBuilder.blockPalette.categories.trigger')}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 border border-border/40 hover:border-border hover:bg-background/50"
              onClick={toggleEdit}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            {onDeleteBlock && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0 border border-red-200 hover:border-red-400 hover:bg-red-50 text-red-600 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteBlock?.(id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </CardTitle>

        {/* Иконка и название действия под заголовком */}
        <div className="flex items-center gap-2 mt-2">
          {getIcon()}
          <Badge
            variant="secondary"
            className="text-xs px-2 py-1 max-w-[150px] text-center leading-tight whitespace-normal"
          >
            {t(`flowBuilder.blockPalette.blocks.${data.type}.name`)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {(() => {
          console.log('🎭 TriggerBlock rendering condition:', { isEditing });
          return isEditing;
        })() ? (
          <div className="space-y-2">
            <div className="text-xs font-medium mb-2">
              {t('flowBuilder.editMode')}
            </div>
            <div className="space-y-1">
              <input
                type="text"
                placeholder={t('flowBuilder.fields.board')}
                defaultValue={data.config?.boardType || ''}
                className="w-full text-xs px-2 py-1 border rounded bg-background"
                onClick={(e) => e.stopPropagation()}
              />
              <input
                type="text"
                placeholder={t('flowBuilder.fields.column')}
                defaultValue={data.config?.targetColumn || ''}
                className="w-full text-xs px-2 py-1 border rounded bg-background"
                onClick={(e) => e.stopPropagation()}
              />
              <input
                type="text"
                placeholder={t('flowBuilder.fields.event')}
                defaultValue={data.config?.event || ''}
                className="w-full text-xs px-2 py-1 border rounded bg-background"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="flex gap-1 pt-1">
              <Button size="sm" className="text-xs h-6 px-2" onClick={saveEdit}>
                {t('flowBuilder.save')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-6 px-2"
                onClick={cancelEdit}
              >
                {t('flowBuilder.cancel')}
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-xs font-medium mb-2">
              {t(`flowBuilder.blockPalette.blocks.${data.type}.name`)}
            </div>
            <div className="text-xs text-muted-foreground mb-1">
              {t('flowBuilder.fields.board')}:{' '}
              {data.config?.boardType
                ? data.config.boardType.toUpperCase()
                : t('flowBuilder.fields.notSet')}
            </div>
            <div className="text-xs text-muted-foreground mb-1">
              {t('flowBuilder.fields.column')}:{' '}
              {data.config?.targetColumn || t('flowBuilder.fields.notSet')}
            </div>
            <div className="text-xs text-muted-foreground">
              {t('flowBuilder.fields.event')}:{' '}
              {data.config?.event
                ? t(`flowBuilder.events.${data.config.event}`)
                : t('flowBuilder.fields.notSet')}
            </div>
          </div>
        )}
      </CardContent>

      {/* Выходной handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
    </Card>
  );
}
