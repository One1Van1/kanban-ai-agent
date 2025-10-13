'use client';

import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  Brain,
  FileText,
  Paperclip,
  Bell,
  Pencil,
} from 'lucide-react';
import { useLanguage } from '@/src/lib/i18n/LanguageContext';

interface ActionBlockProps {
  data: {
    type: string;
    name: string;
    config: any;
  };
  id: string;
  selected: boolean;
}

export function ActionBlock({ data, id, selected }: ActionBlockProps) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);

  const getIcon = () => {
    switch (data.type) {
      case 'comment':
        return <MessageSquare className="w-4 h-4" />;
      case 'ai_request':
        return <Brain className="w-4 h-4" />;
      case 'create_file':
        return <FileText className="w-4 h-4" />;
      case 'attach_file':
        return <Paperclip className="w-4 h-4" />;
      case 'send_notification':
        return <Bell className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getColor = () => {
    return 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-950/20 dark:border-purple-800 dark:text-purple-200';
  };

  return (
    <Card
      className={`w-72 ${selected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'} ${getColor()} transition-all hover:shadow-md`}
    >
      {/* Входной handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />

      <CardHeader className="pb-2">
        <CardTitle className="flex items-start gap-2 text-sm">
          {getIcon()}
          <span className="flex-1 min-w-0">
            {t('flowBuilder.blockPalette.categories.action')}
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
              {data.type === 'comment' && (
                <input
                  type="text"
                  placeholder="Comment text"
                  defaultValue={data.config?.commentText || ''}
                  className="w-full text-xs px-2 py-1 border rounded bg-background"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              {data.type === 'ai_request' && (
                <>
                  <select
                    defaultValue={data.config?.aiModel || ''}
                    className="w-full text-xs px-2 py-1 border rounded bg-background"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="">Select AI Model</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="claude-3">Claude 3</option>
                    <option value="gemini-pro">Gemini Pro</option>
                  </select>
                  <textarea
                    placeholder="Enter your prompt here..."
                    defaultValue={data.config?.prompt || ''}
                    className="w-full text-xs px-2 py-1 border rounded bg-background min-h-[60px] resize-none"
                    onClick={(e) => e.stopPropagation()}
                    rows={3}
                  />
                  <input
                    type="text"
                    placeholder="Response Variable Name"
                    defaultValue={data.config?.responseVariable || ''}
                    className="w-full text-xs px-2 py-1 border rounded bg-background"
                    onClick={(e) => e.stopPropagation()}
                  />
                </>
              )}
              {(data.type === 'create_file' || data.type === 'attach_file') && (
                <>
                  <input
                    type="text"
                    placeholder={t('flowBuilder.fields.fileName')}
                    defaultValue={data.config?.fileName || ''}
                    className="w-full text-xs px-2 py-1 border rounded bg-background"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <select
                    defaultValue={data.config?.fileFormat || ''}
                    className="w-full text-xs px-2 py-1 border rounded bg-background"
                    onClick={(e) => e.stopPropagation()}
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
                    rows={2}
                  />
                </>
              )}
              {data.type === 'send_notification' && (
                <>
                  <input
                    type="text"
                    placeholder="Recipient"
                    defaultValue={data.config?.recipient || ''}
                    className="w-full text-xs px-2 py-1 border rounded bg-background"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <input
                    type="text"
                    placeholder="Message"
                    defaultValue={data.config?.message || ''}
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

            {/* Конфигурация для комментариев */}
            {data.type === 'comment' && (
              <div className="text-xs text-muted-foreground truncate">
                "{data.config?.commentText || t('flowBuilder.fields.notSet')}"
              </div>
            )}

            {/* Конфигурация для AI запросов */}
            {data.type === 'ai_request' && (
              <>
                <div className="text-xs text-muted-foreground mb-1">
                  {t('flowBuilder.fields.model')}:{' '}
                  {data.config?.aiModel || t('flowBuilder.fields.notSet')}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {t('flowBuilder.fields.prompt')}: "
                  {data.config?.prompt
                    ? data.config.prompt.substring(0, 30) + '...'
                    : t('flowBuilder.fields.notSet')}
                  "
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
                    {t('flowBuilder.fields.fileContent')}: "
                    {data.config?.content
                      ? data.config.content.substring(0, 30) + '...'
                      : t('flowBuilder.fields.notSet')}
                    "
                  </div>
                )}
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
                  {t('flowBuilder.fields.message')}: "
                  {data.config?.message
                    ? data.config.message.substring(0, 30) + '...'
                    : t('flowBuilder.fields.notSet')}
                  "
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
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />
    </Card>
  );
}
