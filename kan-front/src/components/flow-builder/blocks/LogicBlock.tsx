'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitBranch, RotateCcw, AlertTriangle, Brain } from 'lucide-react';
import { useLanguage } from '@/src/lib/i18n/LanguageContext';

interface LogicBlockProps {
  data: { type: string; name: string; config: any };
  id: string;
  selected: boolean;
}

export function LogicBlock({ data, id, selected }: LogicBlockProps) {
  const { t } = useLanguage();

  const renderIcon = () => {
    switch (data.type) {
      case 'if_else':
        return <GitBranch className="w-4 h-4" />;
      case 'loop':
        return <RotateCcw className="w-4 h-4" />;
      case 'try_catch':
        return <AlertTriangle className="w-4 h-4" />;
      case 'ai_result':
        return <Brain className="w-4 h-4" />;
      default:
        return <GitBranch className="w-4 h-4" />;
    }
  };

  const colorClass =
    'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/20 dark:border-yellow-800 dark:text-yellow-200';

  return (
    <Card
      className={`w-72 ${selected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'} ${colorClass} transition-all hover:shadow-md`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-yellow-500 border-2 border-white"
      />
      <CardHeader className="pb-2">
        <CardTitle className="flex items-start gap-2 text-sm">
          {renderIcon()}
          <span className="flex-1 min-w-0">
            {t('flowBuilder.blockPalette.categories.logic')}
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
        {data.type !== 'ai_result' && data.config?.condition?.variable && (
          <div className="text-xs text-muted-foreground mb-1">
            {t('flowBuilder.fields.variable')}: {data.config.condition.variable}
          </div>
        )}
        {data.type !== 'ai_result' && data.config?.condition?.operator && (
          <div className="text-xs text-muted-foreground mb-1">
            {t('flowBuilder.fields.condition')}:{' '}
            {data.config.condition.operator}
          </div>
        )}
        {data.type !== 'ai_result' && data.config?.condition?.value && (
          <div className="text-xs text-muted-foreground">
            {t('flowBuilder.fields.value')}: {data.config.condition.value}
          </div>
        )}
        {data.type === 'ai_result' && data.config?.responseVariable && (
          <div className="text-xs text-muted-foreground mb-1">
            {t('flowBuilder.fields.variable')}: {data.config.responseVariable}
          </div>
        )}
      </CardContent>

      {data.type === 'if_else' && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            style={{ left: '25%' }}
            className="w-3 h-3 bg-green-500 border-2 border-white"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            style={{ left: '75%' }}
            className="w-3 h-3 bg-red-500 border-2 border-white"
          />
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs px-4 pb-1">
            <span className="text-green-600 font-medium">
              {t('flowBuilder.states.true')}
            </span>
            <span className="text-red-600 font-medium">
              {t('flowBuilder.states.false')}
            </span>
          </div>
        </>
      )}

      {data.type === 'ai_result' && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="text"
            style={{ left: '20%' }}
            className="w-3 h-3 bg-green-500 border-2 border-white"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="empty"
            style={{ left: '50%' }}
            className="w-3 h-3 bg-gray-500 border-2 border-white"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="error"
            style={{ left: '80%' }}
            className="w-3 h-3 bg-red-500 border-2 border-white"
          />
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] px-2 pb-1 gap-1">
            <span
              className="px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-medium"
              title={
                t('flowBuilder.blockPalette.blocks.ai_result.textHelp') || ''
              }
            >
              {t('flowBuilder.states.text')}
            </span>
            <span
              className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium"
              title={
                t('flowBuilder.blockPalette.blocks.ai_result.emptyHelp') || ''
              }
            >
              {t('flowBuilder.states.empty')}
            </span>
            <span
              className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 font-medium"
              title={
                t('flowBuilder.blockPalette.blocks.ai_result.errorHelp') || ''
              }
            >
              {t('flowBuilder.states.error')}
            </span>
          </div>
        </>
      )}

      {data.type !== 'if_else' && data.type !== 'ai_result' && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-yellow-500 border-2 border-white"
        />
      )}
    </Card>
  );
}
