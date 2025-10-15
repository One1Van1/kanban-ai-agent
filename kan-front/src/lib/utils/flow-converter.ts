import { Node, Edge } from '@xyflow/react';
import { FlowDefinition } from '../../types/flow-builder';

export interface FlowNodeData {
  type: string;
  name: string;
  config: Record<string, any>;
}

/**
 * Конвертирует React Flow nodes и edges в упрощенный формат для отправки на бэкенд
 */
export function convertNodesToFlowDefinition(
  nodes: Node[],
  edges: Edge[],
  flowMetadata: Partial<FlowDefinition> = {},
): any {
  console.log('Converting nodes to FlowDefinition:', { nodes, edges });

  // Извлекаем triggers из trigger nodes
  const triggers = nodes
    .filter((node) => node.type === 'trigger')
    .map((node) => {
      const data = node.data as unknown as FlowNodeData;
      return {
        type: 'board_move' as const,
        config: {
          targetColumn:
            data.config?.targetColumn ||
            data.config?.columnName ||
            data.name ||
            'Default',
          boardId: data.config?.boardId || 'default-board',
        },
      };
    });

  // Извлекаем blocks из всех non-trigger nodes
  const blocks = nodes
    .filter((node) => node.type !== 'trigger')
    .map((node) => {
      const data = node.data as unknown as FlowNodeData;
      const blockType = data.config?.blockType || data.type || node.type;

      return {
        type: blockType,
        config: {
          ...data.config,
          // Добавляем стандартные поля если их нет
          ...(blockType === 'comment' && {
            message:
              data.config?.message ||
              data.name ||
              'Comment added by Flow Builder',
          }),
          ...(blockType === 'ai_request' && {
            prompt:
              data.config?.prompt || 'Analyze this task and provide insights',
          }),
        },
      };
    });

  const flowDefinition = {
    id: flowMetadata.id || `flow-${Date.now()}`,
    name: flowMetadata.name || 'Flow Created from Builder',
    description:
      flowMetadata.description || 'Flow created using visual Flow Builder',
    triggers,
    blocks,
  };

  console.log('Converted FlowDefinition:', flowDefinition);
  return flowDefinition;
}

/**
 * Валидирует FlowDefinition перед отправкой
 */
export function validateFlowDefinition(flow: FlowDefinition): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!flow.name || flow.name.trim() === '') {
    errors.push('Flow name is required');
  }

  if (!flow.triggers || flow.triggers.length === 0) {
    errors.push('At least one trigger is required');
  }

  if (!flow.blocks || flow.blocks.length === 0) {
    errors.push('At least one action block is required');
  }

  // Проверяем что у triggers есть нужные поля
  flow.triggers.forEach((trigger, index) => {
    if (!trigger.type) {
      errors.push(`Trigger ${index + 1}: type is required`);
    }
    if (!trigger.config?.targetColumn) {
      errors.push(`Trigger ${index + 1}: target column is required`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
