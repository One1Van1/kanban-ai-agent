'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface ConnectionHandleProps {
  type: 'source' | 'target';
  position: Position;
  id?: string;
  style?: React.CSSProperties;
  className?: string;
  color?: 'green' | 'blue' | 'yellow' | 'purple' | 'orange' | 'red' | 'gray';
  label?: string;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const colorClasses = {
  green: 'bg-green-500 hover:bg-green-600 border-green-300',
  blue: 'bg-blue-500 hover:bg-blue-600 border-blue-300',
  yellow: 'bg-yellow-500 hover:bg-yellow-600 border-yellow-300',
  purple: 'bg-purple-500 hover:bg-purple-600 border-purple-300',
  orange: 'bg-orange-500 hover:bg-orange-600 border-orange-300',
  red: 'bg-red-500 hover:bg-red-600 border-red-300',
  gray: 'bg-gray-500 hover:bg-gray-600 border-gray-300',
};

const sizeClasses = {
  small: 'w-2 h-2',
  medium: 'w-3 h-3',
  large: 'w-4 h-4',
};

export function ConnectionHandle({
  type,
  position,
  id,
  style,
  className,
  color = 'gray',
  label,
  showLabel = false,
  size = 'medium',
}: ConnectionHandleProps) {
  // Позиционируем handles ТОЧНО НА границе блока
  const getPositionStyle = (pos: Position): React.CSSProperties => {
    const handleSize = size === 'small' ? 8 : size === 'large' ? 16 : 12;

    // Базовые позиции
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      zIndex: 9999,
    };

    switch (pos) {
      case Position.Top:
        return {
          ...baseStyle,
          top: `-${handleSize / 2 + 1}px`, // Чуть больше отступ для видимости границы
          left: '50%',
          transform: 'translateX(-50%)',
        };
      case Position.Bottom:
        return {
          ...baseStyle,
          bottom: `-${handleSize / 2 + 1}px`, // Чуть больше отступ для видимости границы
          left: '50%',
          transform: 'translateX(-50%)',
        };
      case Position.Left:
        return {
          ...baseStyle,
          left: `-${handleSize / 2}px`, // ТОЧНО на границе (половина handle левее границы)
          top: '50%',
          transform: 'translateY(-50%)',
        };
      case Position.Right:
        return {
          ...baseStyle,
          right: `-${handleSize / 2}px`, // ТОЧНО на границе (половина handle правее границы)
          top: '50%',
          transform: 'translateY(-50%)',
        };
      default:
        return baseStyle;
    }
  };
  const handleClasses = `
    ${sizeClasses[size]} 
    ${colorClasses[color]} 
    border-2 border-white 
    rounded-full 
    transition-all 
    duration-200 
    shadow-sm
    hover:shadow-lg
    hover:scale-125
    hover:animate-pulse
    active:scale-95
    cursor-pointer
    z-10
    absolute
    group
    ${className || ''}
  `.trim();

  const combinedStyle = {
    ...getPositionStyle(position),
    ...style, // Кастомные стили перебивают базовые (для множественных handles)
  };

  return (
    <div className="relative">
      {/* РАБОЧИЙ ReactFlow Handle с правильным позиционированием */}
      <Handle
        type={type}
        position={position}
        id={id}
        style={combinedStyle}
        className={`${handleClasses}`}
      />

      {showLabel && label && (
        <div
          className={`
            absolute text-xs font-medium px-2 py-1 rounded
            bg-black/80 text-white pointer-events-none
            z-20 whitespace-nowrap
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            ${position === Position.Top ? '-top-8 left-1/2 -translate-x-1/2' : ''}
            ${position === Position.Bottom ? '-bottom-8 left-1/2 -translate-x-1/2' : ''}
            ${position === Position.Left ? 'top-1/2 -left-2 -translate-x-full -translate-y-1/2' : ''}
            ${position === Position.Right ? 'top-1/2 -right-2 translate-x-full -translate-y-1/2' : ''}
          `}
        >
          {label}
          {/* Стрелка tooltip */}
          <div
            className={`
              absolute w-0 h-0 border-solid
              ${position === Position.Top ? 'top-full left-1/2 -translate-x-1/2 border-t-black/80 border-t-[4px] border-x-transparent border-x-[4px]' : ''}
              ${position === Position.Bottom ? 'bottom-full left-1/2 -translate-x-1/2 border-b-black/80 border-b-[4px] border-x-transparent border-x-[4px]' : ''}
              ${position === Position.Left ? 'left-full top-1/2 -translate-y-1/2 border-l-black/80 border-l-[4px] border-y-transparent border-y-[4px]' : ''}
              ${position === Position.Right ? 'right-full top-1/2 -translate-y-1/2 border-r-black/80 border-r-[4px] border-y-transparent border-y-[4px]' : ''}
            `}
          />
        </div>
      )}
    </div>
  );
}

// Предустановленные handle'ы для разных типов блоков
export function TriggerOutputHandle(props: Partial<ConnectionHandleProps>) {
  return (
    <ConnectionHandle
      type="source"
      position={Position.Bottom}
      color="green"
      label="Start"
      {...props}
    />
  );
}

export function ActionInputHandle(props: Partial<ConnectionHandleProps>) {
  return (
    <ConnectionHandle
      type="target"
      position={Position.Top}
      color="purple"
      label="Input"
      {...props}
    />
  );
}

export function ActionOutputHandle(props: Partial<ConnectionHandleProps>) {
  return (
    <ConnectionHandle
      type="source"
      position={Position.Bottom}
      color="purple"
      label="Complete"
      {...props}
    />
  );
}

export function LogicInputHandle(props: Partial<ConnectionHandleProps>) {
  return (
    <ConnectionHandle
      type="target"
      position={Position.Top}
      color="yellow"
      label="Input"
      {...props}
    />
  );
}

export function LogicOutputHandle({
  condition,
  ...props
}: Partial<ConnectionHandleProps> & { condition?: string }) {
  const colors = {
    true: 'green' as const,
    false: 'red' as const,
    default: 'gray' as const,
    case1: 'blue' as const,
    case2: 'green' as const,
    case3: 'yellow' as const,
    text: 'green' as const,
    empty: 'gray' as const,
    error: 'red' as const,
  };

  return (
    <ConnectionHandle
      type="source"
      position={Position.Bottom}
      color={colors[condition as keyof typeof colors] || 'yellow'}
      label={condition}
      {...props}
    />
  );
}

export function ContextInputHandle(props: Partial<ConnectionHandleProps>) {
  return (
    <ConnectionHandle
      type="target"
      position={Position.Top}
      color="blue"
      label="Input"
      {...props}
    />
  );
}

export function ContextOutputHandle(props: Partial<ConnectionHandleProps>) {
  return (
    <ConnectionHandle
      type="source"
      position={Position.Bottom}
      color="blue"
      label="Data"
      {...props}
    />
  );
}

export function WaitInputHandle(props: Partial<ConnectionHandleProps>) {
  return (
    <ConnectionHandle
      type="target"
      position={Position.Top}
      color="orange"
      label="Input"
      {...props}
    />
  );
}

export function WaitOutputHandle(props: Partial<ConnectionHandleProps>) {
  return (
    <ConnectionHandle
      type="source"
      position={Position.Bottom}
      color="orange"
      label="Continue"
      {...props}
    />
  );
}
