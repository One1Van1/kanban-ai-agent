'use client';

import React from 'react';
import {
  EdgeProps,
  getStraightPath,
  EdgeLabelRenderer,
  useStore,
} from '@xyflow/react';

// Кастомный компонент для прямых соединений, которые обходят блоки
const StraightEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
  label,
}) => {
  const nodes = useStore((state) => state.nodes);

  // Функция для расчета пути, который обходит блоки
  const calculateAvoidingPath = () => {
    // Определяем прямоугольники всех блоков
    const nodeRects = nodes.map((node) => ({
      id: node.id,
      x: node.position.x - 100, // padding вокруг блока
      y: node.position.y - 50,
      width: node.width ? node.width + 200 : 300, // ширина блока + padding
      height: node.height ? node.height + 100 : 200, // высота блока + padding
    }));

    // Проверяем, пересекает ли прямая линия какой-либо блок
    const lineIntersectsRect = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      rect: any,
    ) => {
      // Упрощенная проверка пересечения линии с прямоугольником
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);

      return !(
        maxX < rect.x ||
        minX > rect.x + rect.width ||
        maxY < rect.y ||
        minY > rect.y + rect.height
      );
    };

    // Проверяем, нужно ли обходить блоки
    let needsDetour = false;
    for (const rect of nodeRects) {
      if (lineIntersectsRect(sourceX, sourceY, targetX, targetY, rect)) {
        needsDetour = true;
        break;
      }
    }

    if (!needsDetour) {
      // Если прямая линия не пересекает блоки, используем её
      return `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
    }

    // Если нужен обход, создаем ломаную линию
    const deltaX = targetX - sourceX;
    const deltaY = targetY - sourceY;

    // Определяем промежуточные точки для обхода
    let midX, midY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Горизонтальное соединение - идем через верх или низ
      midX = sourceX + deltaX / 2;
      midY =
        deltaY > 0
          ? Math.min(sourceY, targetY) - 100
          : Math.max(sourceY, targetY) + 100;
    } else {
      // Вертикальное соединение - идем через левую или правую сторону
      midX =
        deltaX > 0
          ? Math.min(sourceX, targetX) - 100
          : Math.max(sourceX, targetX) + 100;
      midY = sourceY + deltaY / 2;
    }

    return `M ${sourceX},${sourceY} L ${midX},${sourceY} L ${midX},${midY} L ${targetX},${midY} L ${targetX},${targetY}`;
  };

  const path = calculateAvoidingPath();

  // Расчет позиции для лейбла (в центре пути)
  const labelX = (sourceX + targetX) / 2;
  const labelY = (sourceY + targetY) / 2;

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          strokeWidth: 2,
          stroke: style.stroke || '#6b7280',
          fill: 'none',
        }}
        className="react-flow__edge-path"
        d={path}
        markerEnd={markerEnd}
      />

      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              pointerEvents: 'all',
            }}
            className="nodrag nopan bg-background border border-border rounded px-2 py-1 text-xs shadow-sm"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default StraightEdge;
