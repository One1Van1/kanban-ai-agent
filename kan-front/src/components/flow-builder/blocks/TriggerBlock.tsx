'use client';

import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, GitBranch, Database, Pencil } from 'lucide-react';
import { useLanguage } from '@/src/lib/i18n/LanguageContext';

interface TriggerBlockProps {
  data: {
    type: string;
    name: string;
    config: any;
  };
  id: string;
  selected: boolean;
}

export function TriggerBlock({ data, id, selected }: TriggerBlockProps) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);

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
          {getIcon()}
          <span className="flex-1 min-w-0">
            {t('flowBuilder.blockPalette.categories.trigger')}
          </span>
          <div className="flex items-center gap-1">
            <Badge
              variant="secondary"
              className="text-xs px-2 py-1 max-w-[100px] text-center leading-tight whitespace-normal"
            >
              {t(`flowBuilder.blockPalette.blocks.${data.type}.name`)}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0 border border-border/40 hover:border-border hover:bg-background/50"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(!isEditing);
              }}
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isEditing ? (
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
              <Button
                size="sm"
                className="text-xs h-6 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(false);
                  // TODO: Сохранить изменения
                }}
              >
                {t('flowBuilder.save')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-6 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(false);
                }}
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
            {data.config?.boardType && (
              <div className="text-xs text-muted-foreground mb-1">
                {t('flowBuilder.fields.board')}:{' '}
                {data.config.boardType.toUpperCase()}
              </div>
            )}
            {data.config?.targetColumn && (
              <div className="text-xs text-muted-foreground mb-1">
                {t('flowBuilder.fields.column')}: {data.config.targetColumn}
              </div>
            )}
            {data.config?.event && (
              <div className="text-xs text-muted-foreground">
                {t('flowBuilder.fields.event')}:{' '}
                {t(`flowBuilder.events.${data.config.event}`)}
              </div>
            )}
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
