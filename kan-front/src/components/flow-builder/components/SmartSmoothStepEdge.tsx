'use client';

import React from 'react';
import {
  EdgeProps,
  getSmoothStepPath,
  EdgeLabelRenderer,
  BaseEdge,
} from '@xyflow/react';

export function SmartSmoothStepEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  label,
  labelStyle = {},
  labelShowBg = true,
  labelBgStyle = {},
  labelBgPadding = [8, 4],
  labelBgBorderRadius = 2,
  ...props
}: EdgeProps) {
  // Увеличиваем отступы для лучшего обхода блоков
  const borderRadius = 15; // Более плавные углы
  const offset = 25; // Больший отступ от блоков

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius,
    offset,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          strokeWidth: 3,
          ...style,
        }}
        {...props}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              fontWeight: 500,
              background: labelShowBg ? '#ffffff' : 'transparent',
              padding: labelShowBg ? '4px 8px' : 0,
              borderRadius: labelShowBg ? 4 : 0,
              border: labelShowBg ? '1px solid #e2e8f0' : 'none',
              boxShadow: labelShowBg ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              pointerEvents: 'all',
              ...labelStyle,
              ...labelBgStyle,
            }}
            className="nodrag nopan"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
