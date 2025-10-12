'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Archive, Variable } from 'lucide-react';
import { useLanguage } from '@/src/lib/i18n/LanguageContext';

interface ContextBlockProps {
  data: {
    type: string;
    name: string;
    config: any;
  };
  id: string;
  selected: boolean;
}

export function ContextBlock({ data, id, selected }: ContextBlockProps) {
  const { t } = useLanguage();

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
        {data.config?.variableName && (
          <div className="text-xs text-muted-foreground mb-1">
            {t('flowBuilder.fields.variable')}: {data.config.variableName}
          </div>
        )}
        {data.config?.source && (
          <div className="text-xs text-muted-foreground mb-1">
            {t('flowBuilder.fields.source')}: {data.config.source}
          </div>
        )}
        {data.config?.filter?.fileType && (
          <div className="text-xs text-muted-foreground">
            {t('flowBuilder.fields.types')}:{' '}
            {data.config.filter.fileType.join(', ')}
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
