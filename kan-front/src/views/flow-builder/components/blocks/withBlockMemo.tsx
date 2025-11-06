import { memo, ComponentType } from 'react';

/**
 * HOC для мемоизации блоков React Flow
 * Предотвращает лишние рендеры блоков при изменении несущественных props
 */
export interface BlockProps {
  data: {
    type: string;
    name: string;
    config: any;
    isEditing?: boolean;
  };
  id: string;
  selected: boolean;
  onDeleteBlock?: (nodeId: string) => void;
  onUpdateBlock?: (blockId: string, newData: Partial<any>) => void;
}

/**
 * Создает мемоизированную версию блока с оптимизированным сравнением props
 */
export function withBlockMemo<P extends BlockProps>(
  Component: ComponentType<P>,
  displayName?: string,
) {
  const MemoizedComponent = memo(Component, (prevProps, nextProps) => {
    // Сравниваем только важные props для предотвращения лишних рендеров
    return (
      prevProps.id === nextProps.id &&
      prevProps.selected === nextProps.selected &&
      prevProps.data.type === nextProps.data.type &&
      prevProps.data.name === nextProps.data.name &&
      prevProps.data.isEditing === nextProps.data.isEditing &&
      // Используем JSON.stringify для глубокого сравнения config
      JSON.stringify(prevProps.data.config) ===
        JSON.stringify(nextProps.data.config)
    );
  });

  MemoizedComponent.displayName =
    displayName || Component.displayName || Component.name;

  return MemoizedComponent;
}
