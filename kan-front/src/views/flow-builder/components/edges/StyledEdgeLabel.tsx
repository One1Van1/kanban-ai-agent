'use client';

import React from 'react';
import { EdgeLabelRenderer, useReactFlow } from '@xyflow/react';

interface StyledEdgeLabelProps {
  label: string;
  labelX: number;
  labelY: number;
  sourceType?: string;
  sourceHandle?: string;
}

export function StyledEdgeLabel({
  label,
  labelX,
  labelY,
  sourceType,
  sourceHandle,
}: StyledEdgeLabelProps) {
  // Получаем цвет в зависимости от типа блока-источника
  const getLabelColor = (nodeType?: string, handle?: string) => {
    // Специальные цвета для логических условий (более насыщенные)
    if (handle === 'true') return { bg: '#059669', text: '#ffffff' }; // darker green
    if (handle === 'false') return { bg: '#dc2626', text: '#ffffff' }; // darker red
    if (handle === 'error') return { bg: '#dc2626', text: '#ffffff' }; // darker red
    if (handle === 'success') return { bg: '#059669', text: '#ffffff' }; // darker green
    if (handle === 'timeout') return { bg: '#4b5563', text: '#ffffff' }; // darker gray

    // Цвета по типу блока (более насыщенные)
    switch (nodeType) {
      case 'trigger':
        return { bg: '#059669', text: '#ffffff' }; // darker green
      case 'context':
        return { bg: '#2563eb', text: '#ffffff' }; // darker blue
      case 'logic':
        return { bg: '#d97706', text: '#ffffff' }; // darker orange/yellow with white text
      case 'action':
        return { bg: '#7c3aed', text: '#ffffff' }; // darker purple
      case 'wait':
        return { bg: '#ea580c', text: '#ffffff' }; // darker orange
      default:
        return { bg: '#1f2937', text: '#ffffff' }; // darker gray
    }
  };

  const colors = getLabelColor(sourceType, sourceHandle);

  return (
    <EdgeLabelRenderer>
      <div
        style={{
          position: 'absolute',
          transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          pointerEvents: 'all',
        }}
        className="nodrag nopan"
      >
        <div
          className={`
            inline-flex items-center px-3 py-1.5 
            rounded-full text-xs font-semibold
            border-2 border-white
            shadow-lg
            transition-all duration-200
            hover:scale-105 hover:shadow-xl
            backdrop-blur-sm
          `}
          style={{
            backgroundColor: colors.bg,
            color: colors.text,
          }}
        >
          {/* Иконка в зависимости от условия */}
          {sourceHandle === 'true' && <span className="mr-1">✓</span>}
          {sourceHandle === 'false' && <span className="mr-1">✗</span>}
          {sourceHandle === 'error' && <span className="mr-1">⚠</span>}
          {sourceHandle === 'success' && <span className="mr-1">✓</span>}
          {sourceHandle === 'timeout' && <span className="mr-1">⏱</span>}

          {label}
        </div>
      </div>
    </EdgeLabelRenderer>
  );
}
