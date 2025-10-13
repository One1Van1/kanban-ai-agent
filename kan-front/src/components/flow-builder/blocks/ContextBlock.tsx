'use client';

import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Archive, Variable, Pencil, Trash2 } from 'lucide-react';
import { useLanguage } from '@/src/lib/i18n/LanguageContext';

interface ContextBlockProps {
  data: {
    type: string;
    name: string;
    config: any;
  };
  id: string;
  selected: boolean;
  onDeleteBlock?: (nodeId: string) => void;
}

export function ContextBlock({
  data,
  id,
  selected,
  onDeleteBlock,
}: ContextBlockProps) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);

  const getIcon = () => {
    switch (data.type) {
      case 'extract_files':
        return <FileText className="w-4 h-4" />;
      case 'get_card_data':
        return <Archive className="w-4 h-4" />;
      default:
        return <Variable className="w-4 h-4" />;
    }
  };

  const getColor = () => {
    return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/20 dark:border-blue-800 dark:text-blue-200';
  };

  return (
    <Card
      className={`w-72 ${selected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'} ${getColor()} transition-all hover:shadow-md`}
    >
      {/* Входной handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />

      <CardHeader className="pb-2">
        <CardTitle className="flex items-start gap-2 text-sm">
          {getIcon()}
          <span className="flex-1 min-w-0">
            {t('flowBuilder.blockPalette.categories.context')}
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
            {onDeleteBlock && (
              <Button
                variant="outline"
                size="sm"
                className="h-6 w-6 p-0 border border-red-200 hover:border-red-400 hover:bg-red-50 text-red-600 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteBlock?.(id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
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
              {/* Поля для всех типов */}
              <input
                type="text"
                placeholder={t('flowBuilder.fields.variable')}
                defaultValue={data.config?.variableName || ''}
                className="w-full text-xs px-2 py-1 border rounded bg-background"
                onClick={(e) => e.stopPropagation()}
              />
              <input
                type="text"
                placeholder={t('flowBuilder.fields.source')}
                defaultValue={data.config?.source || ''}
                className="w-full text-xs px-2 py-1 border rounded bg-background"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Поле типов только для extract_files */}
              {data.type === 'extract_files' && (
                <input
                  type="text"
                  placeholder={t('flowBuilder.fields.types')}
                  defaultValue={data.config?.filter?.fileType?.join(', ') || ''}
                  className="w-full text-xs px-2 py-1 border rounded bg-background"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
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

            {/* Поля для extract_files */}
            {data.type === 'extract_files' && (
              <>
                <div className="text-xs text-muted-foreground mb-1">
                  {t('flowBuilder.fields.variable')}:{' '}
                  {data.config?.variableName || t('flowBuilder.fields.notSet')}
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  {t('flowBuilder.fields.source')}:{' '}
                  {data.config?.source || t('flowBuilder.fields.notSet')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('flowBuilder.fields.types')}:{' '}
                  {data.config?.filter?.fileType?.join(', ') ||
                    t('flowBuilder.fields.notSet')}
                </div>
              </>
            )}

            {/* Поля для get_card_data */}
            {data.type === 'get_card_data' && (
              <>
                <div className="text-xs text-muted-foreground mb-1">
                  {t('flowBuilder.fields.variable')}:{' '}
                  {data.config?.variableName || t('flowBuilder.fields.notSet')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('flowBuilder.fields.source')}:{' '}
                  {data.config?.source || t('flowBuilder.fields.notSet')}
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>

      {/* Выходной handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
    </Card>
  );
}
