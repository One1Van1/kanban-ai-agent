'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitBranch, RotateCcw, AlertTriangle } from 'lucide-react';

interface LogicBlockProps {
  data: {
    type: string;
    name: string;
    config: any;
  };
  id: string;
  selected: boolean;
}

export function LogicBlock({ data, id, selected }: LogicBlockProps) {
  const getIcon = () => {
    switch (data.type) {
      case 'if_else':
        return <GitBranch className="w-4 h-4" />;
      case 'loop':
        return <RotateCcw className="w-4 h-4" />;
      case 'try_catch':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <GitBranch className="w-4 h-4" />;
    }
  };

  const getColor = () => {
    return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/20 dark:border-yellow-800 dark:text-yellow-200';
  };

  return (
    <Card
      className={`w-64 ${selected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'} ${getColor()} transition-all hover:shadow-md`}
    >
      {/* Входной handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-yellow-500 border-2 border-white"
      />

      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          {getIcon()}
          <span>Logic</span>
          <Badge variant="secondary" className="ml-auto text-xs">
            {data.type}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xs font-medium mb-2">{data.name}</div>
        {data.config?.condition?.variable && (
          <div className="text-xs text-muted-foreground mb-1">
            Variable: {data.config.condition.variable}
          </div>
        )}
        {data.config?.condition?.operator && (
          <div className="text-xs text-muted-foreground mb-1">
            Condition: {data.config.condition.operator}
          </div>
        )}
        {data.config?.condition?.value && (
          <div className="text-xs text-muted-foreground">
            Value: {data.config.condition.value}
          </div>
        )}
      </CardContent>

      {/* Выходные handles для IF/ELSE */}
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
          {/* Лейблы для веток */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs px-4 pb-1">
            <span className="text-green-600 font-medium">True</span>
            <span className="text-red-600 font-medium">False</span>
          </div>
        </>
      )}

      {/* Обычный выходной handle для других типов */}
      {data.type !== 'if_else' && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-yellow-500 border-2 border-white"
        />
      )}
    </Card>
  );
}
