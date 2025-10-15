'use client';

import React, { useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  Brain,
  Globe,
  FileText,
  Paperclip,
  Bell,
  Pencil,
  Move,
  Edit,
  Trash2,
} from 'lucide-react';
import { useLanguage } from '@/src/lib/i18n/LanguageContext';
import { useBlockEdit } from '@/src/hooks/useBlockEdit';
import {
  ActionInputHandle,
  ActionOutputHandle,
} from '../components/ConnectionHandle';

interface ActionBlockProps {
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

export function ActionBlock({
  data,
  id,
  selected,
  onDeleteBlock,
  onUpdateBlock,
}: ActionBlockProps) {
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
      case 'comment':
        return <MessageSquare className="w-4 h-4" />;
      case 'ai_request':
        return <Brain className="w-4 h-4" />;
      case 'api_call':
        return <Globe className="w-4 h-4" />;
      case 'create_file':
        return <FileText className="w-4 h-4" />;
      case 'attach_file':
        return <Paperclip className="w-4 h-4" />;
      case 'send_notification':
        return <Bell className="w-4 h-4" />;
      case 'move_card':
        return <Move className="w-4 h-4" />;
      case 'update_field':
        return <Edit className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getColor = () => {
    return 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-950/20 dark:border-purple-800 dark:text-purple-200';
  };

  return (
    <div className="relative">
      {/* Входной handle - ВЫНЕСЕН ЗА ГРАНИЦЫ блока */}
      <ActionInputHandle showLabel={true} />

      <Card
        className={`w-72 ${selected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'} ${getColor()} transition-all hover:shadow-md`}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-start gap-2 text-sm">
            <span className="flex-1 min-w-0">
              {t('flowBuilder.blockPalette.categories.action')}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0 border border-border/40 hover:border-border hover:bg-background/50"
                onClick={(e) => {
                  console.log('🎯 Edit button clicked in ActionBlock!', {
                    id,
                    isEditing,
                  });
                  toggleEdit(e);
                  console.log(
                    '✅ ActionBlock isEditing will change to:',
                    !isEditing,
                  );
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
                {data.type === 'comment' && (
                  <input
                    type="text"
                    placeholder={t('flowBuilder.fields.commentText')}
                    defaultValue={data.config?.commentText || ''}
                    className="w-full text-xs px-2 py-1 border rounded bg-background"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      updateFormData('commentText', e.target.value)
                    }
                    ref={(el) => registerFieldRef('commentText', el)}
                  />
                )}
                {data.type === 'ai_request' && (
                  <>
                    <select
                      defaultValue={data.config?.aiModel || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData('aiModel', e.target.value)
                      }
                      ref={(el) => registerFieldRef('aiModel', el)}
                    >
                      <option value="">
                        {t('flowBuilder.fields.selectAiModel')}
                      </option>
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      <option value="claude-3">Claude 3</option>
                      <option value="gemini-pro">Gemini Pro</option>
                    </select>
                    <textarea
                      placeholder={t('flowBuilder.fields.promptPlaceholder')}
                      defaultValue={data.config?.prompt || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background min-h-[60px] resize-none"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateFormData('prompt', e.target.value)}
                      ref={(el) => registerFieldRef('prompt', el)}
                      rows={3}
                    />
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
                  </>
                )}
                {(data.type === 'create_file' ||
                  data.type === 'attach_file') && (
                  <>
                    <input
                      type="text"
                      placeholder={t('flowBuilder.fields.fileName')}
                      defaultValue={data.config?.fileName || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData('fileName', e.target.value)
                      }
                      ref={(el) => registerFieldRef('fileName', el)}
                    />
                    <select
                      defaultValue={data.config?.fileFormat || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData('fileFormat', e.target.value)
                      }
                      ref={(el) => registerFieldRef('fileFormat', el)}
                    >
                      <option value="">{t('flowBuilder.fields.format')}</option>
                      <option value="txt">Text (.txt)</option>
                      <option value="json">JSON (.json)</option>
                      <option value="csv">CSV (.csv)</option>
                      <option value="pdf">PDF (.pdf)</option>
                      <option value="doc">Document (.doc)</option>
                    </select>
                    <textarea
                      placeholder={t('flowBuilder.fields.fileContent')}
                      defaultValue={
                        data.config?.content || data.config?.path || ''
                      }
                      className="w-full text-xs px-2 py-1 border rounded bg-background min-h-[50px] resize-none"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData('content', e.target.value)
                      }
                      ref={(el) => registerFieldRef('content', el)}
                      rows={2}
                    />
                  </>
                )}
                {data.type === 'api_call' && (
                  <>
                    <input
                      type="text"
                      placeholder={t('flowBuilder.fields.apiUrl')}
                      defaultValue={data.config?.url || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateFormData('url', e.target.value)}
                      ref={(el) => registerFieldRef('url', el)}
                    />
                    <select
                      defaultValue={data.config?.method || 'GET'}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateFormData('method', e.target.value)}
                      ref={(el) => registerFieldRef('method', el)}
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                      <option value="PATCH">PATCH</option>
                    </select>
                    <textarea
                      placeholder={t('flowBuilder.fields.headersPlaceholder')}
                      defaultValue={data.config?.headers || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background min-h-[40px] resize-none"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData('headers', e.target.value)
                      }
                      ref={(el) => registerFieldRef('headers', el)}
                      rows={2}
                    />
                    <textarea
                      placeholder={t('flowBuilder.fields.bodyPlaceholder')}
                      defaultValue={data.config?.body || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background min-h-[50px] resize-none"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateFormData('body', e.target.value)}
                      ref={(el) => registerFieldRef('body', el)}
                      rows={3}
                    />
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
                  </>
                )}
                {data.type === 'send_notification' && (
                  <>
                    <input
                      type="text"
                      placeholder={t('flowBuilder.fields.recipient')}
                      defaultValue={data.config?.recipient || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData('recipient', e.target.value)
                      }
                      ref={(el) => registerFieldRef('recipient', el)}
                    />
                    <input
                      type="text"
                      placeholder={t('flowBuilder.fields.message')}
                      defaultValue={data.config?.message || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData('message', e.target.value)
                      }
                      ref={(el) => registerFieldRef('message', el)}
                    />
                  </>
                )}
                {data.type === 'move_card' && (
                  <>
                    <input
                      type="text"
                      placeholder={t('flowBuilder.fields.cardId')}
                      defaultValue={data.config?.cardId || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateFormData('cardId', e.target.value)}
                      ref={(el) => registerFieldRef('cardId', el)}
                    />
                    <select
                      defaultValue={data.config?.targetColumn || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData('targetColumn', e.target.value)
                      }
                      ref={(el) => registerFieldRef('targetColumn', el)}
                    >
                      <option value="">
                        {t('flowBuilder.fields.selectTargetColumn')}
                      </option>
                      <option value="todo">To Do</option>
                      <option value="inprogress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </>
                )}
                {data.type === 'update_field' && (
                  <>
                    <input
                      type="text"
                      placeholder={t('flowBuilder.fields.cardId')}
                      defaultValue={data.config?.cardId || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateFormData('cardId', e.target.value)}
                      ref={(el) => registerFieldRef('cardId', el)}
                    />
                    <input
                      type="text"
                      placeholder={t('flowBuilder.fields.fieldName')}
                      defaultValue={data.config?.fieldName || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData('fieldName', e.target.value)
                      }
                      ref={(el) => registerFieldRef('fieldName', el)}
                    />
                    <input
                      type="text"
                      placeholder={t('flowBuilder.fields.newValue')}
                      defaultValue={data.config?.newValue || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData('newValue', e.target.value)
                      }
                      ref={(el) => registerFieldRef('newValue', el)}
                    />
                  </>
                )}
              </div>
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

              {/* Конфигурация для комментариев */}
              {data.type === 'comment' && (
                <div className="text-xs text-muted-foreground truncate">
                  &quot;
                  {data.config?.commentText || t('flowBuilder.fields.notSet')}
                  &quot;
                </div>
              )}

              {/* Конфигурация для AI запросов */}
              {data.type === 'ai_request' && (
                <>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.fields.model')}:{' '}
                    {data.config?.aiModel || t('flowBuilder.fields.notSet')}
                  </div>
                  <div className="text-xs text-muted-foreground mb-1 truncate">
                    {t('flowBuilder.fields.prompt')}: &quot;
                    {data.config?.prompt
                      ? data.config.prompt.substring(0, 30) + '...'
                      : t('flowBuilder.fields.notSet')}
                    &quot;
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.fields.responseVariable')}:{' '}
                    {data.config?.responseVariable ||
                      t('flowBuilder.fields.notSet')}
                  </div>
                </>
              )}

              {/* Конфигурация для файлов */}
              {(data.type === 'create_file' || data.type === 'attach_file') && (
                <>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.fields.fileName')}:{' '}
                    {data.config?.fileName || t('flowBuilder.fields.notSet')}
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.fields.format')}:{' '}
                    {data.config?.fileFormat || t('flowBuilder.fields.notSet')}
                  </div>
                  {data.type === 'create_file' && (
                    <div className="text-xs text-muted-foreground truncate">
                      {t('flowBuilder.fields.fileContent')}: &quot;
                      {data.config?.content
                        ? data.config.content.substring(0, 30) + '...'
                        : t('flowBuilder.fields.notSet')}
                      &quot;
                    </div>
                  )}
                </>
              )}

              {/* Конфигурация для API вызовов */}
              {data.type === 'api_call' && (
                <>
                  <div className="text-xs text-muted-foreground mb-1 truncate">
                    {t('flowBuilder.fields.apiUrl')}:{' '}
                    {data.config?.url || t('flowBuilder.fields.notSet')}
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.fields.method')}:{' '}
                    {data.config?.method || 'GET'}
                  </div>
                  {data.config?.headers && (
                    <div className="text-xs text-muted-foreground mb-1">
                      {t('flowBuilder.fields.headers')}:{' '}
                      {data.config.headers.length > 50
                        ? `${data.config.headers.substring(0, 50)}...`
                        : data.config.headers}
                    </div>
                  )}
                  {data.config?.body && (
                    <div className="text-xs text-muted-foreground mb-1">
                      {t('flowBuilder.fields.body')}:{' '}
                      {data.config.body.length > 50
                        ? `${data.config.body.substring(0, 50)}...`
                        : data.config.body}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.fields.responseVariable')}:{' '}
                    {data.config?.responseVariable ||
                      t('flowBuilder.fields.notSet')}
                  </div>
                </>
              )}

              {/* Конфигурация для уведомлений */}
              {data.type === 'send_notification' && (
                <>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.fields.recipient')}:{' '}
                    {data.config?.recipient || t('flowBuilder.fields.notSet')}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {t('flowBuilder.fields.message')}: &quot;
                    {data.config?.message
                      ? data.config.message.substring(0, 30) + '...'
                      : t('flowBuilder.fields.notSet')}
                    &quot;
                  </div>
                </>
              )}

              {/* Конфигурация для перемещения карточки */}
              {data.type === 'move_card' && (
                <>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.fields.cardId')}:{' '}
                    {data.config?.cardId || t('flowBuilder.fields.notSet')}
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.fields.targetColumn')}:{' '}
                    {data.config?.targetColumn ||
                      t('flowBuilder.fields.notSet')}
                  </div>
                </>
              )}

              {/* Конфигурация для обновления поля */}
              {data.type === 'update_field' && (
                <>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.fields.cardId')}:{' '}
                    {data.config?.cardId || t('flowBuilder.fields.notSet')}
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.fields.fieldName')}:{' '}
                    {data.config?.fieldName || t('flowBuilder.fields.notSet')}
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.fields.newValue')}:{' '}
                    {data.config?.newValue || t('flowBuilder.fields.notSet')}
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Выходной handle - ВЫНЕСЕН ЗА ГРАНИЦЫ блока */}
      <ActionOutputHandle showLabel={true} />
    </div>
  );
}
