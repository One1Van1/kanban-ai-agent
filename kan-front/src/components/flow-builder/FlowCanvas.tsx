'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { FlowDefinition, FlowNode, FlowEdge } from '@/src/types/flow-builder';
import { BlockPalette } from './sidebar/BlockPalette';
import { PropertiesPanel } from './properties/PropertiesPanel';
import { FlowToolbar } from './toolbar/FlowToolbar';
import { TriggerBlock } from './blocks/TriggerBlock';
import { ContextBlock } from './blocks/ContextBlock';
import { LogicBlock } from './blocks/LogicBlock';
import { ActionBlock } from './blocks/ActionBlock';
import { WaitBlock } from './blocks/WaitBlock';

// Регистрируем кастомные типы блоков
const nodeTypes = {
  trigger: TriggerBlock,
  context: ContextBlock,
  logic: LogicBlock,
  action: ActionBlock,
  wait: WaitBlock,
};

interface FlowCanvasProps {
  flow?: FlowDefinition;
  onFlowChange?: (flow: FlowDefinition) => void;
  readonly?: boolean;
  isSidebarOpen?: boolean;
  isPropertiesOpen?: boolean;
  isMainSidebarOpen?: boolean;
}

export function FlowCanvas({
  flow,
  onFlowChange,
  readonly = false,
  isSidebarOpen = true,
  isPropertiesOpen: externalIsPropertiesOpen = false,
  isMainSidebarOpen = true,
}: FlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner
        flow={flow}
        onFlowChange={onFlowChange}
        readonly={readonly}
        isSidebarOpen={isSidebarOpen}
        isPropertiesOpen={externalIsPropertiesOpen}
        isMainSidebarOpen={isMainSidebarOpen}
      />
    </ReactFlowProvider>
  );
}

function FlowCanvasInner({
  flow,
  onFlowChange,
  readonly = false,
  isSidebarOpen = true,
  isPropertiesOpen: externalIsPropertiesOpen = false,
  isMainSidebarOpen = true,
}: FlowCanvasProps) {
  const { screenToFlowPosition, getZoom } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(
    externalIsPropertiesOpen,
  );

  // Snap to grid utility
  const snapToGrid = useCallback((position: { x: number; y: number }) => {
    const gridSize = 20;
    return {
      x: Math.round(position.x / gridSize) * gridSize,
      y: Math.round(position.y / gridSize) * gridSize,
    };
  }, []);

  // Обработка соединения блоков с валидацией
  const onConnect = useCallback(
    (params: Connection | Edge) => {
      // Валидация соединений
      const sourceNode = nodes.find((n) => n.id === params.source);
      const targetNode = nodes.find((n) => n.id === params.target);

      if (!sourceNode || !targetNode) return;

      // Правила валидации соединений
      const isValidConnection = validateConnection(
        sourceNode,
        targetNode,
        params.sourceHandle,
      );

      if (isValidConnection) {
        setEdges((eds) => addEdge(params, eds));
      } else {
        // Показать уведомление о неверном соединении
        console.warn(
          'Invalid connection:',
          sourceNode.type,
          '->',
          targetNode.type,
        );
      }
    },
    [setEdges, nodes],
  );

  // Валидация правильности соединений
  const validateConnection = (
    sourceNode: Node,
    targetNode: Node,
    sourceHandle?: string | null,
  ) => {
    const sourceType = sourceNode.type;
    const targetType = targetNode.type;

    // Правила последовательности: trigger -> context -> logic -> action -> wait
    const typeHierarchy = {
      trigger: 1,
      context: 2,
      logic: 3,
      action: 4,
      wait: 5,
    };

    const sourceLevel =
      typeHierarchy[sourceType as keyof typeof typeHierarchy] || 0;
    const targetLevel =
      typeHierarchy[targetType as keyof typeof typeHierarchy] || 0;

    // Разрешаем соединения в правильном порядке или на том же уровне
    return sourceLevel <= targetLevel;
  };

  // Цвет соединения в зависимости от типа
  const getConnectionColor = (
    sourceNode: Node,
    sourceHandle?: string | null,
  ) => {
    if (sourceHandle === 'true') return '#10b981'; // green
    if (sourceHandle === 'false') return '#ef4444'; // red

    switch (sourceNode.type) {
      case 'trigger':
        return '#10b981'; // green
      case 'context':
        return '#3b82f6'; // blue
      case 'logic':
        return '#f59e0b'; // yellow
      case 'action':
        return '#8b5cf6'; // purple
      case 'wait':
        return '#f97316'; // orange
      default:
        return '#6b7280'; // gray
    }
  };

  // Обработка клика по блоку
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedBlock(node.id);
    setIsPropertiesOpen(true);
  }, []);

  // Умное позиционирование блоков
  const getSmartPosition = useCallback(
    (blockCategory: string) => {
      const BLOCK_WIDTH = 280;
      const BLOCK_HEIGHT = 120;
      const MARGIN = 40;
      const CANVAS_PADDING = 60;

      // Определяем предпочтительные Y позиции для каждого типа блока
      const categoryYPositions = {
        trigger: CANVAS_PADDING,
        context: CANVAS_PADDING + (BLOCK_HEIGHT + MARGIN),
        logic: CANVAS_PADDING + 2 * (BLOCK_HEIGHT + MARGIN),
        action: CANVAS_PADDING + 3 * (BLOCK_HEIGHT + MARGIN),
        wait: CANVAS_PADDING + 4 * (BLOCK_HEIGHT + MARGIN),
      };

      const preferredY =
        categoryYPositions[blockCategory as keyof typeof categoryYPositions] ||
        CANVAS_PADDING;

      // Находим существующие блоки того же типа
      const sameTypeBlocks = nodes.filter(
        (node) => node.type === blockCategory,
      );

      // Если это первый блок этого типа, размещаем его слева
      if (sameTypeBlocks.length === 0) {
        const position = {
          x: CANVAS_PADDING,
          y: preferredY,
        };
        return snapToGrid(position);
      }

      // Находим самую правую позицию среди блоков того же типа
      const rightmostX = Math.max(
        ...sameTypeBlocks.map((node) => node.position.x),
      );

      const position = {
        x: rightmostX + BLOCK_WIDTH + MARGIN,
        y: preferredY,
      };

      // Применяем snap to grid
      return snapToGrid(position);
    },
    [nodes, snapToGrid],
  );

  // Добавление нового блока из палитры
  const onAddBlock = useCallback(
    (
      blockType: string,
      blockCategory: string,
      dropPosition?: { x: number; y: number },
    ) => {
      const position = dropPosition || getSmartPosition(blockCategory);

      const newBlock: Node = {
        id: `${blockType}-${Date.now()}`,
        type: blockCategory,
        position,
        data: {
          type: blockType,
          name: getBlockDisplayName(blockType),
          config: getDefaultConfig(blockType),
        },
      };

      setNodes((nds) => nds.concat(newBlock));

      // Автоматически открываем панель свойств для нового блока
      setSelectedBlock(newBlock.id);
      setIsPropertiesOpen(true);

      console.log('Block added:', newBlock);
    },
    [setNodes, getSmartPosition],
  );

  // Получение правильного названия блока
  const getBlockDisplayName = (blockType: string) => {
    const blockNames = {
      // Triggers
      board_move: 'Board Move',
      board_create: 'Board Create',
      board_update: 'Board Update',
      webhook: 'Webhook',
      time_based: 'Schedule',

      // Context
      extract_files: 'Extract Files',
      get_card_data: 'Get Card Data',
      external_api: 'External API',
      variable: 'Set Variable',

      // Logic
      if_else: 'If/Else',
      switch: 'Switch',
      loop: 'Loop',
      try_catch: 'Try/Catch',

      // Actions
      comment: 'Add Comment',
      ai_request: 'AI Request',
      create_file: 'Create File',
      attach_file: 'Attach File',
      send_notification: 'Send Notification',
      move_card: 'Move Card',
      update_field: 'Update Field',
      api_call: 'API Call',

      // Wait
      wait_response: 'Wait Response',
      wait_time: 'Wait Time',
      wait_condition: 'Wait Condition',
      wait_timeout: 'Wait Timeout',
    };

    return (
      blockNames[blockType as keyof typeof blockNames] ||
      blockType.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  // Получение конфигурации по умолчанию для блока
  const getDefaultConfig = (blockType: string) => {
    switch (blockType) {
      case 'board_move':
        return {
          boardType: 'jira', // По умолчанию Jira для тестирования
          event: 'card_moved',
          targetColumn: '',
        };
      case 'board_create':
        return {
          boardType: 'jira',
          event: 'card_created',
        };
      case 'webhook':
        return {
          boardType: 'generic',
          event: 'card_moved',
          webhookUrl: '',
        };
      case 'extract_files':
        return {
          variableName: 'files',
          source: 'card_attachments',
          filter: {},
        };
      case 'if_else':
        return {
          condition: {
            variable: '',
            operator: 'exists',
            value: '',
          },
        };
      case 'comment':
        return {
          commentText: 'Enter your comment here',
        };
      case 'ai_request':
        return {
          aiModel: 'claude',
          prompt: 'Enter your prompt here',
          attachments: [],
        };
      case 'wait_response':
        return {
          waitFor: 'ai_response',
          timeout: 300000, // 5 минут
        };
      default:
        return {};
    }
  };

  // Сохранение flow
  const handleSaveFlow = useCallback(() => {
    if (!onFlowChange) return;

    const flowDefinition: FlowDefinition = {
      id: flow?.id || `flow-${Date.now()}`,
      name: flow?.name || 'Untitled Flow',
      description: flow?.description || '',
      version: '1.0.0',
      created: flow?.created || new Date(),
      updated: new Date(),
      triggers: [],
      blocks: [],
      connections: [],
      variables: [],
      settings: {
        timeout: 600000,
        retryAttempts: 3,
        errorHandling: 'stop',
        logging: 'detailed',
      },
    };

    onFlowChange(flowDefinition);
  }, [flow, onFlowChange, nodes, edges]);

  // Обработчики drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Простая очистка без лишней логики
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      try {
        const data = JSON.parse(
          e.dataTransfer.getData('application/reactflow'),
        );
        const { blockType, blockCategory } = data;

        if (blockType && blockCategory) {
          // Правильно преобразуем экранные координаты в координаты Flow
          const position = screenToFlowPosition({
            x: e.clientX,
            y: e.clientY,
          });

          // Проверяем, что координаты разумные (не NaN и не слишком экстремальные)
          const isValidPosition =
            position &&
            !isNaN(position.x) &&
            !isNaN(position.y) &&
            Math.abs(position.x) < 10000 &&
            Math.abs(position.y) < 10000;

          let finalPosition;
          if (isValidPosition) {
            // Центрируем блок относительно курсора
            const centeredPosition = {
              x: position.x - 140, // половина ширины блока (280px)
              y: position.y - 60, // половина высоты блока (120px)
            };
            // Применяем snap to grid
            finalPosition = snapToGrid(centeredPosition);
          } else {
            // Fallback к smart positioning если координаты невалидные
            console.warn(
              'Invalid drop position, using smart positioning:',
              position,
            );
            finalPosition = getSmartPosition(blockCategory);
          }

          onAddBlock(blockType, blockCategory, finalPosition);
          console.log('Dropped block:', {
            blockType,
            blockCategory,
            position: finalPosition,
            rawPosition: position,
            isValidPosition,
          });
        }
      } catch (error) {
        console.error('Error parsing drop data:', error);
      }
    },
    [onAddBlock, screenToFlowPosition, snapToGrid],
  );

  return (
    <div className="flex h-full w-full bg-background">
      {/* React Flow канвас - расширяется естественно */}
      <div
        className="flex-1 relative transition-all duration-200 bg-gradient-to-br from-background to-muted/20"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Убираем все drop zone индикаторы - только drag preview из палитры */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView={false}
          fitViewOptions={{
            padding: 0.3,
          }}
          defaultEdgeOptions={{
            style: { strokeWidth: 2, stroke: 'hsl(var(--foreground) / 0.4)' },
            animated: true,
          }}
          snapToGrid={true}
          snapGrid={[20, 20]}
          attributionPosition="bottom-left"
        >
          <Controls
            className="bg-card border border-border shadow-sm rounded-lg"
            showZoom={true}
            showFitView={true}
            showInteractive={true}
          />
          <MiniMap
            nodeColor="hsl(var(--primary))"
            maskColor="hsl(var(--card) / 0.9)"
            className="border border-border shadow-sm rounded-lg bg-card"
          />
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1.5}
            color="hsl(var(--border))"
          />
        </ReactFlow>
      </div>

      {/* Палитра блоков - справа, расширяется когда левая шторка закрывается */}
      <div
        className={`${isSidebarOpen ? (isMainSidebarOpen ? 'w-96' : 'w-[26rem]') : 'w-0'} bg-card border-l border-border shadow-sm transition-all duration-300 ease-in-out ${isSidebarOpen ? '' : 'overflow-hidden'}`}
      >
        {isSidebarOpen && (
          <BlockPalette onAddBlock={onAddBlock} getZoom={getZoom} />
        )}
      </div>

      {/* Панель свойств - крайняя справа, также расширяется */}
      {isPropertiesOpen && selectedBlock && (
        <div
          className={`${isMainSidebarOpen ? 'w-96' : 'w-[28rem]'} bg-card border-l border-border shadow-sm transition-all duration-300`}
        >
          <PropertiesPanel
            blockId={selectedBlock}
            nodes={nodes}
            onUpdateNode={(nodeId, data) => {
              setNodes((nds) =>
                nds.map((node) =>
                  node.id === nodeId
                    ? { ...node, data: { ...node.data, ...data } }
                    : node,
                ),
              );
            }}
            onClose={() => setIsPropertiesOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
