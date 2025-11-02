'use client';

import React from 'react';
import { ConnectionLineComponentProps, getSmoothStepPath } from '@xyflow/react';

export function DynamicConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
  fromNode,
}: ConnectionLineComponentProps) {
  // Получаем цвет в зависимости от типа блока-источника
  const getConnectionColor = (nodeType?: string) => {
    switch (nodeType) {
      case 'trigger':
        return '#10b981'; // green
      case 'context':
        return '#3b82f6'; // blue
      case 'logic':
        return '#f59e0b'; // yellow/orange
      case 'action':
        return '#8b5cf6'; // purple
      case 'wait':
        return '#f97316'; // orange
      default:
        return '#6b7280'; // gray
    }
  };

  const [edgePath] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
    borderRadius: 15,
    offset: 25,
  });

  return (
    <g>
      <path
        fill="none"
        stroke={getConnectionColor(fromNode?.type)}
        strokeWidth={4}
        strokeDasharray="10,5"
        strokeLinecap="round"
        d={edgePath}
        opacity={0.8}
      />
      {/* Добавляем свечение для лучшей видимости */}
      <path
        fill="none"
        stroke={getConnectionColor(fromNode?.type)}
        strokeWidth={8}
        strokeOpacity={0.2}
        d={edgePath}
      />
    </g>
  );
}
