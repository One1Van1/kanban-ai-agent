'use client';

import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Timer, CheckCircle, Pencil, Trash2 } from 'lucide-react';
import { useLanguage } from '@/src/lib/i18n/LanguageContext';
import { useBlockEdit } from '@/src/hooks/useBlockEdit';

interface WaitBlockProps {
  data: {
    type: string;
    name: string;
    config: any;
  };
  id: string;
  selected: boolean;
  onDeleteBlock?: (nodeId: string) => void;
}

export function WaitBlock({
  data,
  id,
  selected,
  onDeleteBlock,
}: WaitBlockProps) {
  const { t } = useLanguage();
  const { isEditing, toggleEdit, saveEdit, cancelEdit } = useBlockEdit(id);

  const getIcon = () => {
    switch (data.type) {
      case 'wait_response':
        return <CheckCircle className="w-4 h-4" />;
      case 'wait_time':
        return <Timer className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getColor = () => {
    return 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950/20 dark:border-orange-800 dark:text-orange-200';
  };

  const formatTimeout = (timeout: number) => {
    const minutes = Math.floor(timeout / 60000);
    const seconds = Math.floor((timeout % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <Card
      className={`w-72 ${selected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'} ${getColor()} transition-all hover:shadow-md`}
    >
      {/* Входной handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-orange-500 border-2 border-white"
      />

      <CardHeader className="pb-2">
        <CardTitle className="flex items-start gap-2 text-sm">
          <span className="flex-1 min-w-0">
            {t('flowBuilder.blockPalette.categories.wait')}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 border border-border/40 hover:border-border hover:bg-background/50"
              onClick={(e) => {
                e.stopPropagation();
                toggleEdit(e);
              }}
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
        {isEditing ? (
          <div className="space-y-2">
            <div className="text-xs font-medium mb-2">
              {t('flowBuilder.editMode')}
            </div>
            <div className="space-y-1">
              {data.type === 'wait_time' && (
                <>
                  <input
                    type="number"
                    placeholder={t('flowBuilder.fields.duration')}
                    defaultValue={data.config?.duration || ''}
                    className="w-full text-xs px-2 py-1 border rounded bg-background"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <select
                    defaultValue={data.config?.unit || 'seconds'}
                    className="w-full text-xs px-2 py-1 border rounded bg-background"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="seconds">
                      {t('flowBuilder.fields.seconds')}
                    </option>
                    <option value="minutes">
                      {t('flowBuilder.fields.minutes')}
                    </option>
                    <option value="hours">
                      {t('flowBuilder.fields.hours')}
                    </option>
                  </select>
                </>
              )}

              {data.type === 'wait_response' && (
                <>
                  <input
                    type="text"
                    placeholder={t('flowBuilder.fields.responseVariable')}
                    defaultValue={data.config?.responseVariable || ''}
                    className="w-full text-xs px-2 py-1 border rounded bg-background"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <input
                    type="number"
                    placeholder={t('flowBuilder.fields.timeoutSeconds')}
                    defaultValue={data.config?.timeout || '30'}
                    className="w-full text-xs px-2 py-1 border rounded bg-background"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <select
                    defaultValue={data.config?.condition || ''}
                    className="w-full text-xs px-2 py-1 border rounded bg-background"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="">
                      {t('flowBuilder.fields.waitCondition')}
                    </option>
                    <option value="not_empty">
                      {t('flowBuilder.fields.variableNotEmpty')}
                    </option>
                    <option value="equals">
                      {t('flowBuilder.fields.variableEquals')}
                    </option>
                    <option value="contains">
                      {t('flowBuilder.fields.variableContains')}
                    </option>
                    <option value="api_success">
                      {t('flowBuilder.fields.apiSuccess')}
                    </option>
                  </select>
                </>
              )}

              {data.type !== 'wait_time' && data.type !== 'wait_response' && (
                <>
                  <input
                    type="text"
                    placeholder={t('flowBuilder.fields.waitFor')}
                    defaultValue={data.config?.waitFor || ''}
                    className="w-full text-xs px-2 py-1 border rounded bg-background"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <input
                    type="number"
                    placeholder={t('flowBuilder.fields.timeout')}
                    defaultValue={data.config?.timeout || ''}
                    className="w-full text-xs px-2 py-1 border rounded bg-background"
                    onClick={(e) => e.stopPropagation()}
                  />
                </>
              )}
            </div>
            <div className="flex gap-1 pt-1">
              <Button
                size="sm"
                className="text-xs h-6 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  saveEdit(e);
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
                  cancelEdit(e);
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

            {/* Конфигурация для ожидания времени */}
            {data.type === 'wait_time' && (
              <>
                <div className="text-xs text-muted-foreground mb-1">
                  {t('flowBuilder.fields.duration')}:{' '}
                  {data.config?.duration ||
                    data.config?.waitFor ||
                    t('flowBuilder.fields.notSet')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('flowBuilder.fields.unit')}:{' '}
                  {data.config?.unit
                    ? t(`flowBuilder.fields.${data.config.unit}`)
                    : data.config?.timeout
                      ? 'секунды'
                      : t('flowBuilder.fields.notSet')}
                </div>
              </>
            )}

            {/* Конфигурация для ожидания ответа */}
            {data.type === 'wait_response' && (
              <>
                <div className="text-xs text-muted-foreground mb-1">
                  {t('flowBuilder.fields.responseVariable')}:{' '}
                  {data.config?.responseVariable ||
                    t('flowBuilder.fields.notSet')}
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  {t('flowBuilder.fields.timeout')}:{' '}
                  {data.config?.timeout || t('flowBuilder.fields.notSet')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('flowBuilder.fields.condition')}:{' '}
                  {data.config?.condition
                    ? t(`flowBuilder.fields.${data.config.condition}`)
                    : t('flowBuilder.fields.notSet')}
                </div>
              </>
            )}

            {/* Конфигурация для других типов ожидания */}
            {data.type !== 'wait_time' && data.type !== 'wait_response' && (
              <>
                <div className="text-xs text-muted-foreground mb-1">
                  {t('flowBuilder.fields.waitFor')}:{' '}
                  {data.config?.waitFor || t('flowBuilder.fields.notSet')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('flowBuilder.fields.timeout')}:{' '}
                  {data.config?.timeout
                    ? formatTimeout(data.config.timeout)
                    : t('flowBuilder.fields.notSet')}
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>

      {/* Выходные handles для разных исходов */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="success"
        style={{ left: '20%' }}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="error"
        style={{ left: '50%' }}
        className="w-3 h-3 bg-red-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="timeout"
        style={{ left: '80%' }}
        className="w-3 h-3 bg-gray-500 border-2 border-white"
      />

      {/* Лейблы для веток */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs px-2 pb-1">
        <span className="text-green-600 font-medium">
          {t('flowBuilder.states.success')}
        </span>
        <span className="text-red-600 font-medium">
          {t('flowBuilder.states.error')}
        </span>
        <span className="text-gray-600 font-medium">
          {t('flowBuilder.states.timeout')}
        </span>
      </div>
    </Card>
  );
}
