'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileOutput, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/src/lib/i18n/LanguageContext';

interface ResultBlockProps {
  data: {
    type: string; // 'ai_result'
    name: string;
    config: any;
  };
  id: string;
  selected: boolean;
}

// This block can be used to branch based on AI response presence/content
export function ResultBlock({ data, id, selected }: ResultBlockProps) {
  const { t } = useLanguage();

  return (
    <Card
      className={`w-72 ${selected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'} bg-teal-50 border-teal-200 text-teal-800 dark:bg-teal-950/20 dark:border-teal-800 dark:text-teal-200 transition-all hover:shadow-md`}
    >
      {/* Input */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-teal-500 border-2 border-white"
      />

      <CardHeader className="pb-2">
        <CardTitle className="flex items-start gap-2 text-sm">
          <FileOutput className="w-4 h-4" />
          <span className="flex-1 min-w-0">AI Result</span>
          <Badge
            variant="secondary"
            className="text-xs px-2 py-1 max-w-[120px] text-center leading-tight whitespace-normal"
          >
            Result
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xs font-medium mb-2">AI Response Branch</div>
        {data.config?.responseVariable && (
          <div className="text-xs text-muted-foreground mb-1">
            Var: {data.config.responseVariable}
          </div>
        )}
        <div className="text-xs text-muted-foreground">
          Branches: text / empty / error
        </div>
      </CardContent>

      {/* Output handles */}
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
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs px-2 pb-1">
        <span className="text-green-600 font-medium">text</span>
        <span className="text-gray-600 font-medium">empty</span>
        <span className="text-red-600 font-medium">error</span>
      </div>
    </Card>
  );
}
