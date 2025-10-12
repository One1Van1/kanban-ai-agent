'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Brain, FileText, Paperclip, Bell } from 'lucide-react';

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
      className={`w-64 ${selected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'} ${getColor()} transition-all hover:shadow-md`}
    >
      {/* Входной handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />

      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          {getIcon()}
          <span>Action</span>
          <Badge variant="secondary" className="ml-auto text-xs">
            {data.type}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xs font-medium mb-2">{data.name}</div>

        {/* Конфигурация для комментариев */}
        {data.type === 'comment' && data.config?.commentText && (
          <div className="text-xs text-muted-foreground truncate">
            "{data.config.commentText}"
          </div>
        )}

        {/* Конфигурация для AI запросов */}
        {data.type === 'ai_request' && (
          <>
            {data.config?.aiModel && (
              <div className="text-xs text-muted-foreground mb-1">
                Model: {data.config.aiModel}
              </div>
            )}
            {data.config?.prompt && (
              <div className="text-xs text-muted-foreground truncate">
                Prompt: "{data.config.prompt.substring(0, 30)}..."
              </div>
            )}
          </>
        )}

        {/* Конфигурация для файлов */}
        {(data.type === 'create_file' || data.type === 'attach_file') && (
          <>
            {data.config?.fileName && (
              <div className="text-xs text-muted-foreground mb-1">
                File: {data.config.fileName}
              </div>
            )}
            {data.config?.fileFormat && (
              <div className="text-xs text-muted-foreground">
                Format: {data.config.fileFormat}
              </div>
            )}
          </>
        )}

        {/* Конфигурация для уведомлений */}
        {data.type === 'send_notification' && (
          <>
            {data.config?.recipient && (
              <div className="text-xs text-muted-foreground mb-1">
                To: {data.config.recipient}
              </div>
            )}
            {data.config?.message && (
              <div className="text-xs text-muted-foreground truncate">
                "{data.config.message.substring(0, 30)}..."
              </div>
            )}
          </>
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
