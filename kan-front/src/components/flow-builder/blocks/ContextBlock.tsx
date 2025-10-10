'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Archive, Variable } from 'lucide-react';

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
    return 'bg-blue-50 border-blue-200 text-blue-800';
  };

  return (
    <Card
      className={`w-64 ${selected ? 'ring-2 ring-blue-500' : ''} ${getColor()}`}
    >
      {/* Входной handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500"
      />

      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          {getIcon()}
          <span>Context</span>
          <Badge variant="secondary" className="ml-auto text-xs">
            {data.type}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xs font-medium mb-1">{data.name}</div>
        {data.config?.variableName && (
          <div className="text-xs text-gray-600">
            Variable: {data.config.variableName}
          </div>
        )}
        {data.config?.source && (
          <div className="text-xs text-gray-600">
            Source: {data.config.source}
          </div>
        )}
        {data.config?.filter?.fileType && (
          <div className="text-xs text-gray-600">
            Types: {data.config.filter.fileType.join(', ')}
          </div>
        )}
      </CardContent>

      {/* Выходной handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500"
      />
    </Card>
  );
}
