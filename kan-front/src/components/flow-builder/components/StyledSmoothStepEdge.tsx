'use client';

import React from 'react';
import { EdgeProps, getSmoothStepPath, BaseEdge } from '@xyflow/react';
import { StyledEdgeLabel } from './StyledEdgeLabel';

export function StyledSmoothStepEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  label,
  sourceHandleId,
  source,
  ...props
}: EdgeProps & { sourceType?: string }) {
  console.log(`Edge ${id} coordinates:`, {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 15,
    offset: 25,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          strokeWidth: 3,
          stroke: '#64748b', // Принудительно устанавливаем цвет
          ...style,
        }}
        {...props}
      />
      {label && (
        <StyledEdgeLabel
          label={String(label)}
          labelX={labelX}
          labelY={labelY}
          sourceHandle={sourceHandleId || undefined}
          // Тип блока-источника получим из nodes в FlowCanvas
        />
      )}
    </>
  );
}
