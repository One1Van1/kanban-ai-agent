'use client';

import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/shared/components/ui/card';
import { Badge } from '@/src/shared/components/ui/badge';
import { Button } from '@/src/shared/components/ui/button';
import { Clock, Timer, CheckCircle, Pencil, Trash2 } from 'lucide-react';
import { useLanguage } from '@/src/shared/i18n';
import { useBlockEdit } from '@/src/shared/hooks/useBlockEdit';
import {
  WaitInputHandle,
  WaitOutputHandle,
  ConnectionHandle,
} from './ConnectionHandle';
import { VariableStorageControl } from './VariableStorageControl';

interface WaitBlockProps {
  data: {
    type: string;
    name: string;
    config: any;
  };
  id: string;
  selected: boolean;
  onDeleteBlock?: (nodeId: string) => void;
  onUpdateBlock?: (blockId: string, newData: Partial<any>) => void;
}

export function WaitBlock({
  data,
  id,
  selected,
  onDeleteBlock,
  onUpdateBlock,
}: WaitBlockProps) {
  const { t } = useLanguage();
  const {
    isEditing,
    toggleEdit,
    saveEdit,
    cancelEdit,
    updateFormData,
    registerFieldRef,
  } = useBlockEdit(id, onUpdateBlock);

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

  const getUnitSI = (unit: string) => {
    // Если язык русский, используем СИ сокращения
    if (
      t('flowBuilder.fields.seconds') === 'Секунды' ||
      t('flowBuilder.fields.seconds').includes('екунд')
    ) {
      switch (unit) {
        case 'seconds':
          return 'с';
        case 'minutes':
          return 'мин';
        case 'hours':
          return 'ч';
        default:
          return unit;
      }
    }
    // Для английского и других языков используем переводы
    return t(`flowBuilder.fields.${unit}`);
  };

  return (
    <div className="relative">
      {/* Входной handle - ВЫНЕСЕН ЗА ГРАНИЦЫ блока */}
      <WaitInputHandle showLabel={true} />

      <Card
        className={`w-72 ${selected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'} ${getColor()} transition-all hover:shadow-md`}
      >
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
                {(data.type === 'wait_time' ||
                  data.type === 'wait_timeout') && (
                  <>
                    <input
                      type="number"
                      placeholder={`${t('flowBuilder.fields.duration')} (${t('flowBuilder.fields.seconds')}/${t('flowBuilder.fields.minutes')}/${t('flowBuilder.fields.hours')})`}
                      defaultValue={data.config?.duration || ''}
                      min="1"
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData(
                          'duration',
                          parseInt(e.target.value) || 0,
                        )
                      }
                      ref={(el) => registerFieldRef('duration', el)}
                    />
                    <select
                      defaultValue={data.config?.unit || 'seconds'}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateFormData('unit', e.target.value)}
                      ref={(el) => registerFieldRef('unit', el)}
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

                {(data.type === 'wait_response' ||
                  data.type === 'wait_condition' ||
                  data.type === 'wait') && (
                  <>
                    <input
                      type="text"
                      placeholder={t('flowBuilder.fields.responseVariable')}
                      defaultValue={data.config?.responseVariable || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData('responseVariable', e.target.value)
                      }
                      ref={(el) => registerFieldRef('responseVariable', el)}
                    />
                    <input
                      type="number"
                      placeholder={`${t('flowBuilder.fields.timeoutSeconds')} (${t('flowBuilder.fields.seconds')})`}
                      defaultValue={data.config?.timeout || '30'}
                      min="1"
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData(
                          'timeout',
                          parseInt(e.target.value) || 30,
                        )
                      }
                      ref={(el) => registerFieldRef('timeout', el)}
                    />
                    <select
                      defaultValue={data.config?.condition || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData('condition', e.target.value)
                      }
                      ref={(el) => registerFieldRef('condition', el)}
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

                {data.type !== 'wait_time' &&
                  data.type !== 'wait_timeout' &&
                  data.type !== 'wait_response' &&
                  data.type !== 'wait_condition' &&
                  data.type !== 'wait' && (
                    <>
                      <input
                        type="text"
                        placeholder={t('flowBuilder.fields.waitFor')}
                        defaultValue={data.config?.waitFor || ''}
                        className="w-full text-xs px-2 py-1 border rounded bg-background"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          updateFormData('waitFor', e.target.value)
                        }
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

              {/* ✅ ВСТРОЕН: Variable Storage Control (only for wait_response) */}
              {data.type === 'wait_response' && (
                <VariableStorageControl
                  config={data.config || {}}
                  onChange={updateFormData}
                />
              )}

              <div className="flex gap-1 pt-1">
                <Button
                  size="sm"
                  className="text-xs h-6 px-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    saveEdit(e, data.config);
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
              {(data.type === 'wait_time' || data.type === 'wait_timeout') && (
                <>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.fields.duration')}:{' '}
                    {data.config?.duration && data.config?.unit
                      ? `${data.config.duration} ${getUnitSI(data.config.unit)}`
                      : data.config?.duration ||
                        data.config?.waitFor ||
                        t('flowBuilder.fields.notSet')}
                  </div>
                </>
              )}

              {/* Конфигурация для ожидания ответа */}
              {(data.type === 'wait_response' ||
                data.type === 'wait_condition' ||
                data.type === 'wait') && (
                <>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.fields.responseVariable')}:{' '}
                    {data.config?.responseVariable ||
                      t('flowBuilder.fields.notSet')}
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.fields.timeout')}:{' '}
                    {data.config?.timeout
                      ? `${data.config.timeout} ${getUnitSI('seconds')}`
                      : t('flowBuilder.fields.notSet')}
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
              {data.type !== 'wait_time' &&
                data.type !== 'wait_timeout' &&
                data.type !== 'wait_response' &&
                data.type !== 'wait_condition' &&
                data.type !== 'wait' && (
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

      {/* Выходные handles - ВЫНЕСЕНЫ ЗА ГРАНИЦЫ блока */}
      <div
        key={`${id}-success-wrapper`}
        style={{
          position: 'absolute',
          left: '10%', // Выравниваем с лейблом "Успех"
          bottom: '2px', // Прямо на границе блока
          transform: 'translateX(-50%)',
          zIndex: 1000,
        }}
      >
        <ConnectionHandle
          type="source"
          position={Position.Bottom}
          id="success"
          color="green"
          showLabel={false}
          style={{ position: 'static' }}
        />
      </div>
      <div
        key={`${id}-error-wrapper`}
        style={{
          position: 'absolute',
          left: '49%', // Выравниваем с лейблом "Ошибка"
          bottom: '2px', // Прямо на границе блока
          transform: 'translateX(-50%)',
          zIndex: 1000,
        }}
      >
        <ConnectionHandle
          type="source"
          position={Position.Bottom}
          id="error"
          color="red"
          showLabel={false}
          style={{ position: 'static' }}
        />
      </div>
      <div
        key={`${id}-timeout-wrapper`}
        style={{
          position: 'absolute',
          left: '90%', // Выравниваем с лейблом "Таймаут"
          bottom: '2px', // Прямо на границе блока
          transform: 'translateX(-50%)',
          zIndex: 1000,
        }}
      >
        <ConnectionHandle
          type="source"
          position={Position.Bottom}
          id="timeout"
          color="gray"
          showLabel={false}
          style={{ position: 'static' }}
        />
      </div>
    </div>
  );
}
