'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, GitBranch, Database } from 'lucide-react';

interface TriggerBlockProps {
  data: {
    type: string;
    name: string;
    config: any;
  };
  id: string;
  selected: boolean;
}

export function TriggerBlock({ data, id, selected }: TriggerBlockProps) {
  const getIcon = () => {
    switch (data.type) {
      case 'board_move':
        return <GitBranch className="w-4 h-4" />;
      case 'board_create':
        return <Database className="w-4 h-4" />;
      case 'webhook':
        return <Zap className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getColor = () => {
    return 'bg-green-50 border-green-200 text-green-800';
  };

  return (
    <Card
      className={`w-64 ${selected ? 'ring-2 ring-blue-500' : ''} ${getColor()}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          {getIcon()}
          <span>Trigger</span>
          <Badge variant="secondary" className="ml-auto text-xs">
            {data.type}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xs font-medium mb-1">{data.name}</div>
        {data.config?.boardType && (
          <div className="text-xs text-gray-600">
            Board: {data.config.boardType.toUpperCase()}
          </div>
        )}
        {data.config?.targetColumn && (
          <div className="text-xs text-gray-600">
            Column: {data.config.targetColumn}
          </div>
        )}
        {data.config?.event && (
          <div className="text-xs text-gray-600">
            Event: {data.config.event}
          </div>
        )}
      </CardContent>

      {/* Выходной handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-500"
      />
    </Card>
  );
}
