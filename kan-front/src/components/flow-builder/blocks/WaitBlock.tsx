'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Timer, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/src/lib/i18n/LanguageContext';

interface WaitBlockProps {
  data: {
    type: string;
    name: string;
    config: any;
  };
  id: string;
  selected: boolean;
}

export function WaitBlock({ data, id, selected }: WaitBlockProps) {
  const { t } = useLanguage();

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
          {getIcon()}
          <span className="flex-1 min-w-0">
            {t('flowBuilder.blockPalette.categories.wait')}
          </span>
          <Badge
            variant="secondary"
            className="text-xs px-2 py-1 max-w-[120px] text-center leading-tight whitespace-normal"
          >
            {t(`flowBuilder.blockPalette.blocks.${data.type}.name`)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xs font-medium mb-2">
          {t(`flowBuilder.blockPalette.blocks.${data.type}.name`)}
        </div>

        {data.config?.waitFor && (
          <div className="text-xs text-muted-foreground mb-1">
            {t('flowBuilder.fields.waitFor')}: {data.config.waitFor}
          </div>
        )}

        {data.config?.timeout && (
          <div className="text-xs text-muted-foreground">
            {t('flowBuilder.fields.timeout')}:{' '}
            {formatTimeout(data.config.timeout)}
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
