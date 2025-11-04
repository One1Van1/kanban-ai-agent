'use client';

import React, { useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/shared/components/ui/card';
import { Badge } from '@/src/shared/components/ui/badge';
import { Button } from '@/src/shared/components/ui/button';
import {
  Zap,
  GitBranch,
  Database,
  Pencil,
  Trash2,
  Globe,
  Clock,
  Ear,
  Play,
} from 'lucide-react';
import { useLanguage } from '@/src/shared/i18n';
import { useBlockEdit } from '@/src/shared/hooks/useBlockEdit';
import { TriggerOutputHandle } from './ConnectionHandle';
import { VariableStorageControl } from './VariableStorageControl';

// Helper для отображения HTTP методов
const getHttpMethodLabel = (
  method: string,
  lang: 'ru' | 'en' = 'ru',
): string => {
  const methodLabels: Record<'ru' | 'en', Record<string, string>> = {
    ru: {
      POST: 'Получение данных',
      GET: 'Запрос информации',
      PUT: 'Полное обновление',
      PATCH: 'Частичное обновление',
      DELETE: 'Удаление данных',
    },
    en: {
      POST: 'Receive Data',
      GET: 'Request Information',
      PUT: 'Full Update',
      PATCH: 'Partial Update',
      DELETE: 'Delete Data',
    },
  };
  return methodLabels[lang][method] || method;
};

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
  onUpdateBlock?: (blockId: string, newData: Partial<any>) => void;
}

export function TriggerBlock({
  data,
  id,
  selected,
  onDeleteBlock,
  onUpdateBlock,
}: TriggerBlockProps) {
  const { t, language } = useLanguage();
  const {
    isEditing,
    toggleEdit,
    saveEdit,
    cancelEdit,
    updateFormData,
    registerFieldRef,
  } = useBlockEdit(id, onUpdateBlock);
  console.log('🔄 TriggerBlock render:', {
    id,
    isEditing,
    dataType: data.type,
  });

  const getIcon = () => {
    switch (data.type) {
      // NEW UNIVERSAL TRIGGERS
      case 'webhook':
        return <Globe className="w-4 h-4" />;
      case 'schedule':
        return <Clock className="w-4 h-4" />;
      case 'event_listener':
        return <Ear className="w-4 h-4" />;
      case 'manual_trigger':
        return <Play className="w-4 h-4" />;
      // OLD BOARD-SPECIFIC TRIGGERS (backward compatibility)
      case 'board_move':
        return <GitBranch className="w-4 h-4" />;
      case 'board_create':
        return <Database className="w-4 h-4" />;
      case 'board_update':
        return <Database className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getColor = () => {
    return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-800 dark:text-green-200';
  };

  return (
    <div className="relative">
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
                {/* ===========================
                    WEBHOOK TRIGGER FIELDS
                =========================== */}
                {data.type === 'webhook' && (
                  <>
                    <input
                      type="text"
                      placeholder="Webhook URL"
                      defaultValue={data.config?.webhookUrl || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData('webhookUrl', e.target.value)
                      }
                      ref={(el) => registerFieldRef('webhookUrl', el)}
                    />
                    <select
                      defaultValue={data.config?.webhookMethod || 'POST'}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData('webhookMethod', e.target.value)
                      }
                      ref={(el) => registerFieldRef('webhookMethod', el)}
                    >
                      <option value="POST">
                        {getHttpMethodLabel('POST', language)}
                      </option>
                      <option value="GET">
                        {getHttpMethodLabel('GET', language)}
                      </option>
                      <option value="PUT">
                        {getHttpMethodLabel('PUT', language)}
                      </option>
                      <option value="PATCH">
                        {getHttpMethodLabel('PATCH', language)}
                      </option>
                      <option value="DELETE">
                        {getHttpMethodLabel('DELETE', language)}
                      </option>
                    </select>
                    <input
                      type="text"
                      placeholder="Webhook Secret (optional)"
                      defaultValue={data.config?.webhookSecret || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData('webhookSecret', e.target.value)
                      }
                      ref={(el) => registerFieldRef('webhookSecret', el)}
                    />
                  </>
                )}

                {/* ===========================
                    SCHEDULE TRIGGER FIELDS
                =========================== */}
                {data.type === 'schedule' && (
                  <>
                    <select
                      defaultValue={data.config?.schedule?.type || 'cron'}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData('schedule', {
                          ...data.config?.schedule,
                          type: e.target.value,
                        })
                      }
                      ref={(el) => registerFieldRef('scheduleType', el)}
                    >
                      <option value="cron">
                        {t('flowBuilder.triggerSettings.cronExpression')}
                      </option>
                      <option value="interval">
                        {t('flowBuilder.triggerSettings.interval')}
                      </option>
                      <option value="once">
                        {t('flowBuilder.triggerSettings.once')}
                      </option>
                    </select>
                    <input
                      type="text"
                      placeholder={
                        data.config?.schedule?.type === 'cron'
                          ? t('flowBuilder.triggerSettings.cronPlaceholder')
                          : t('flowBuilder.triggerSettings.intervalPlaceholder')
                      }
                      defaultValue={data.config?.schedule?.expression || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData('schedule', {
                          ...data.config?.schedule,
                          expression: e.target.value,
                        })
                      }
                      ref={(el) => registerFieldRef('scheduleExpression', el)}
                    />
                    <input
                      type="text"
                      placeholder={t(
                        'flowBuilder.triggerSettings.timezonePlaceholder',
                      )}
                      defaultValue={data.config?.schedule?.timezone || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData('schedule', {
                          ...data.config?.schedule,
                          timezone: e.target.value,
                        })
                      }
                      ref={(el) => registerFieldRef('scheduleTimezone', el)}
                    />
                  </>
                )}

                {/* ===========================
                    EVENT LISTENER TRIGGER FIELDS
                =========================== */}
                {data.type === 'event_listener' && (
                  <>
                    <select
                      defaultValue={data.config?.eventSource || 'board'}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData('eventSource', e.target.value)
                      }
                      ref={(el) => registerFieldRef('eventSource', el)}
                    >
                      <option value="board">
                        {t('flowBuilder.triggerSettings.boardEvents')}
                      </option>
                      <option value="user">
                        {t('flowBuilder.triggerSettings.userEvents')}
                      </option>
                      <option value="system">
                        {t('flowBuilder.triggerSettings.systemEvents')}
                      </option>
                      <option value="custom">
                        {t('flowBuilder.triggerSettings.customEvents')}
                      </option>
                    </select>
                    <input
                      type="text"
                      placeholder={t(
                        'flowBuilder.triggerSettings.eventTypePlaceholder',
                      )}
                      defaultValue={data.config?.eventType || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData('eventType', e.target.value)
                      }
                      ref={(el) => registerFieldRef('eventType', el)}
                    />
                    {data.config?.eventSource === 'board' && (
                      <input
                        type="text"
                        placeholder={t(
                          'flowBuilder.triggerSettings.boardTypePlaceholder',
                        )}
                        defaultValue={
                          data.config?.eventFilters?.boardType || ''
                        }
                        className="w-full text-xs px-2 py-1 border rounded bg-background"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          updateFormData('eventFilters', {
                            ...data.config?.eventFilters,
                            boardType: e.target.value,
                          })
                        }
                        ref={(el) => registerFieldRef('boardType', el)}
                      />
                    )}
                  </>
                )}

                {/* ===========================
                    MANUAL TRIGGER FIELDS
                =========================== */}
                {data.type === 'manual_trigger' && (
                  <>
                    <input
                      type="text"
                      placeholder={t(
                        'flowBuilder.triggerSettings.allowedUsersPlaceholder',
                      )}
                      defaultValue={data.config?.allowedUsers?.join(', ') || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData(
                          'allowedUsers',
                          e.target.value
                            .split(',')
                            .map((u) => u.trim())
                            .filter((u) => u),
                        )
                      }
                      ref={(el) => registerFieldRef('allowedUsers', el)}
                    />
                    <label className="flex items-center space-x-2 text-xs">
                      <input
                        type="checkbox"
                        defaultChecked={
                          data.config?.requireConfirmation || false
                        }
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          updateFormData(
                            'requireConfirmation',
                            e.target.checked,
                          )
                        }
                        ref={(el) =>
                          registerFieldRef('requireConfirmation', el)
                        }
                      />
                      <span>
                        {t('flowBuilder.triggerSettings.requireConfirmation')}
                      </span>
                    </label>
                  </>
                )}
              </div>

              {/* ✅ ВСТРОЕН: Variable Storage Control */}
              <VariableStorageControl
                config={data.config || {}}
                onChange={updateFormData}
              />

              <div className="flex gap-1 pt-1">
                <Button
                  size="sm"
                  className="text-xs h-6 px-2"
                  onClick={(e) => saveEdit(e, data.config)}
                >
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

              {/* WEBHOOK INFO */}
              {data.type === 'webhook' && (
                <>
                  <div className="text-xs text-muted-foreground mb-1">
                    URL:{' '}
                    {data.config?.webhookUrl || t('flowBuilder.fields.notSet')}
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Метод:{' '}
                    {getHttpMethodLabel(
                      data.config?.webhookMethod || 'POST',
                      language,
                    )}
                  </div>
                </>
              )}

              {/* SCHEDULE INFO */}
              {data.type === 'schedule' && (
                <>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.triggerSettings.type')}:{' '}
                    {data.config?.schedule?.type ||
                      t('flowBuilder.fields.notSet')}
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.triggerSettings.expression')}:{' '}
                    {data.config?.schedule?.expression ||
                      t('flowBuilder.fields.notSet')}
                  </div>
                  {data.config?.schedule?.timezone && (
                    <div className="text-xs text-muted-foreground mb-1">
                      {t('flowBuilder.triggerSettings.timezone')}:{' '}
                      {data.config.schedule.timezone}
                    </div>
                  )}
                </>
              )}

              {/* EVENT LISTENER INFO */}
              {data.type === 'event_listener' && (
                <>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.triggerSettings.source')}:{' '}
                    {data.config?.eventSource || t('flowBuilder.fields.notSet')}
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.triggerSettings.event')}:{' '}
                    {data.config?.eventType || t('flowBuilder.fields.notSet')}
                  </div>
                  {data.config?.eventFilters?.boardType && (
                    <div className="text-xs text-muted-foreground mb-1">
                      {t('flowBuilder.triggerSettings.boardType')}:{' '}
                      {data.config.eventFilters.boardType}
                    </div>
                  )}
                </>
              )}

              {/* MANUAL TRIGGER INFO */}
              {data.type === 'manual_trigger' && (
                <>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.triggerSettings.allowedUsersLabel')}:{' '}
                    {data.config?.allowedUsers?.length || 0}{' '}
                    {t('flowBuilder.triggerSettings.users')}
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.triggerSettings.confirmationLabel')}:{' '}
                    {data.config?.requireConfirmation
                      ? t('flowBuilder.triggerSettings.required')
                      : t('flowBuilder.triggerSettings.notRequired')}
                  </div>
                </>
              )}

              {/* OLD BOARD TRIGGERS - BACKWARD COMPATIBILITY */}
              {(data.type === 'board_move' ||
                data.type === 'board_create' ||
                data.type === 'board_update') && (
                <>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.fields.board')}:{' '}
                    {data.config?.boardType
                      ? data.config.boardType.toUpperCase()
                      : t('flowBuilder.fields.notSet')}
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.fields.column')}:{' '}
                    {data.config?.targetColumn ||
                      t('flowBuilder.fields.notSet')}
                  </div>
                  {data.config?.event && (
                    <div className="text-xs text-muted-foreground">
                      {t('flowBuilder.fields.event')}:{' '}
                      {t(`flowBuilder.events.${data.config.event}`)}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Выходной handle - ВЫНЕСЕН ЗА ГРАНИЦЫ блока */}
      <TriggerOutputHandle showLabel={true} />
    </div>
  );
}
