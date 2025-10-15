'use client';

import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
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
  ConnectionLineType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
  FlowDefinition,
  FlowNode,
  FlowEdge,
  FlowConnection,
} from '@/src/types/flow-builder';
import { apiClient } from '@/src/lib/api/client';
import {
  convertNodesToFlowDefinition,
  validateFlowDefinition,
} from '@/src/lib/utils/flow-converter';
import { BlockPalette } from './sidebar/BlockPalette';
import { FlowToolbar } from './toolbar/FlowToolbar';
import { TriggerBlock } from './blocks/TriggerBlock';
import { ContextBlock } from './blocks/ContextBlock';
import { LogicBlock } from './blocks/LogicBlock';
import { ActionBlock } from './blocks/ActionBlock';
import { WaitBlock } from './blocks/WaitBlock';
import { ConfirmDeleteDialog } from './dialogs/ConfirmDeleteDialog';
import { DynamicConnectionLine } from './components/DynamicConnectionLine';
import { StyledSmoothStepEdge } from './components/StyledSmoothStepEdge';

// Регистрируем кастомные типы блоков
const nodeTypes = {
  trigger: TriggerBlock,
  context: ContextBlock,
  logic: LogicBlock,
  action: ActionBlock,
  wait: WaitBlock,
};

// Регистрируем кастомные типы соединений
const edgeTypes = {
  styledSmoothStep: StyledSmoothStepEdge,
};

export interface FlowCanvasRef {
  triggerCascadeDelete: () => void;
  saveFlow: () => Promise<void>;
}

interface FlowCanvasProps {
  flow?: FlowDefinition;
  onFlowChange?: (flow: FlowDefinition) => void;
  readonly?: boolean;
  isSidebarOpen?: boolean;
  isMainSidebarOpen?: boolean;
  isPropertiesOpen?: boolean;
  quickDeleteMode?: boolean;
  onQuickDeleteModeChange?: (enabled: boolean) => void;
  onCascadeDelete?: (nodeId: string) => void;
}

const FlowCanvas = forwardRef<FlowCanvasRef, FlowCanvasProps>(
  (
    {
      flow,
      onFlowChange,
      readonly = false,
      isSidebarOpen = false,
      isMainSidebarOpen = false,
      isPropertiesOpen = false,
      quickDeleteMode = false,
      onQuickDeleteModeChange,
      onCascadeDelete,
    },
    ref,
  ) => {
    return (
      <ReactFlowProvider>
        <FlowCanvasInner
          ref={ref}
          flow={flow}
          onFlowChange={onFlowChange}
          readonly={readonly}
          isSidebarOpen={isSidebarOpen}
          isMainSidebarOpen={isMainSidebarOpen}
          isPropertiesOpen={isPropertiesOpen}
          quickDeleteMode={quickDeleteMode}
          onQuickDeleteModeChange={onQuickDeleteModeChange}
          onCascadeDelete={onCascadeDelete}
        />
      </ReactFlowProvider>
    );
  },
);

const FlowCanvasInner = forwardRef<FlowCanvasRef, FlowCanvasProps>(
  (
    {
      flow,
      onFlowChange,
      readonly = false,
      isSidebarOpen = true,
      isMainSidebarOpen = true,
      isPropertiesOpen = false,
      quickDeleteMode: externalQuickDeleteMode,
      onQuickDeleteModeChange,
      onCascadeDelete,
    },
    ref,
  ) => {
    const { screenToFlowPosition, getZoom, setCenter } = useReactFlow();
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    // Удалили selectedBlock и isPropertiesOpen - больше не используем панель свойств

    // Состояние для быстрого удаления без подтверждения
    const [internalQuickDeleteMode, setInternalQuickDeleteMode] =
      useState(false);
    const quickDeleteMode = externalQuickDeleteMode ?? internalQuickDeleteMode; // Состояние для модального окна подтверждения удаления
    const [deleteConfirm, setDeleteConfirm] = useState<{
      isOpen: boolean;
      nodeId: string | null;
      blockName: string | null;
      blockType: string | null;
    }>({
      isOpen: false,
      nodeId: null,
      blockName: null,
      blockType: null,
    });

    // Синхронизация внешнего flow с внутренними nodes и edges
    React.useEffect(() => {
      if (flow) {
        console.log('Syncing flow to nodes/edges:', flow);
        console.log('Flow blocks count:', flow.blocks?.length || 0);

        // Конвертируем блоки в nodes (блоки не имеют position, используем случайную позицию)
        const flowNodes: Node[] = (flow.blocks || []).map((block, index) => ({
          id: block.id,
          type: block.type || 'action',
          position: { x: 100 + index * 200, y: 100 + (index % 3) * 150 }, // Расставляем в сетку
          data: {
            name: block.name,
            config: block.config || {},
            type: block.type,
          },
        }));

        // Конвертируем соединения в edges
        const flowEdges: Edge[] = (flow.connections || []).map(
          (connection, index) => ({
            id: connection.id || `edge-${index}`,
            source: connection.from,
            target: connection.to,
            type: 'styledSmoothStep',
            animated: true,
            style: {
              strokeWidth: 3,
              stroke: 'hsl(var(--foreground) / 0.6)',
            },
            label: connection.label,
          }),
        );

        console.log('Setting nodes:', flowNodes);
        console.log('Setting edges:', flowEdges);

        setNodes(flowNodes);
        setEdges(flowEdges);
      } else {
        console.log('No flow provided, clearing nodes and edges');
        setNodes([]);
        setEdges([]);
      }
    }, [flow, setNodes, setEdges]);

    // Функция прямого каскадного удаления (очистка nodes/edges)
    const handleDirectCascadeDelete = useCallback(() => {
      console.log('Direct cascade delete triggered');
      console.log('Current nodes count:', nodes.length);
      console.log('Current edges count:', edges.length);

      // Очищаем все nodes и edges напрямую
      setNodes([]);
      setEdges([]);

      // Также обновляем внешний flow, если есть callback
      if (onFlowChange && flow) {
        const emptyFlow = {
          ...flow,
          blocks: [],
          connections: [],
          updated: new Date(),
        };
        onFlowChange(emptyFlow);
      }

      console.log('Direct cascade delete completed');
    }, [nodes.length, edges.length, setNodes, setEdges, onFlowChange, flow]);

    // Предоставляем доступ к функциям через ref
    // Expose methods via ref will be done after handleSaveFlow

    // Snap to grid utility
    const snapToGrid = useCallback((position: { x: number; y: number }) => {
      const gridSize = 20;
      return {
        x: Math.round(position.x / gridSize) * gridSize,
        y: Math.round(position.y / gridSize) * gridSize,
      };
    }, []);

    // Упрощенная валидация соединений - разрешаем все соединения
    const validateConnection = useCallback(
      (sourceNode: Node, targetNode: Node, sourceHandle?: string | null) => {
        // Проверяем, что нет циклических соединений (блок к самому себе)
        if (sourceNode.id === targetNode.id) {
          console.warn('Cannot connect node to itself');
          return false;
        }

        // Проверяем, что соединение еще не существует
        const existingConnection = edges.find(
          (edge) =>
            edge.source === sourceNode.id &&
            edge.target === targetNode.id &&
            edge.sourceHandle === sourceHandle,
        );
        if (existingConnection) {
          console.warn('Connection already exists');
          return false;
        }

        // ✅ Разрешаем ВСЕ остальные соединения между разными блоками
        console.log(
          `✅ Valid connection: ${sourceNode.type} -> ${targetNode.type} via ${sourceHandle || 'default'}`,
        );
        return true;
      },
      [edges],
    );

    // Цвет соединения в зависимости от типа
    const getConnectionColor = useCallback(
      (sourceNode: Node, sourceHandle?: string | null) => {
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
      },
      [],
    );

    // Улучшенная обработка соединения блоков
    const onConnect = useCallback(
      (params: Connection | Edge) => {
        console.log('🔗 Connection attempt:', params);

        // Валидация соединений
        const sourceNode = nodes.find((n) => n.id === params.source);
        const targetNode = nodes.find((n) => n.id === params.target);

        if (!sourceNode || !targetNode) {
          console.error('❌ Source or target node not found');
          return;
        }

        console.log('🔍 Validating connection:', {
          source: sourceNode.type,
          target: targetNode.type,
          handle: params.sourceHandle,
        });

        // Правила валидации соединений
        const isValidConnection = validateConnection(
          sourceNode,
          targetNode,
          params.sourceHandle,
        );

        if (isValidConnection) {
          // Создаем новое соединение с улучшенными параметрами
          const edgeId = 'id' in params ? params.id : `edge-${Date.now()}`;
          const newEdge: Edge = {
            ...params,
            id: edgeId,
            type: 'styledSmoothStep',
            animated: true,
            style: {
              strokeWidth: 3,
              stroke: getConnectionColor(sourceNode, params.sourceHandle),
            },
            label: params.sourceHandle ? `${params.sourceHandle}` : undefined,
          };

          setEdges((eds) => addEdge(newEdge, eds));

          // Синхронизируем с внешним flow, если есть callback
          if (onFlowChange && flow) {
            const newConnection: FlowConnection = {
              id: newEdge.id,
              from: params.source!,
              to: params.target!,
              label:
                typeof newEdge.label === 'string' ? newEdge.label : undefined,
              condition: params.sourceHandle as FlowConnection['condition'],
            };

            const updatedConnections = [
              ...(flow.connections || []),
              newConnection,
            ];

            const updatedFlow = {
              ...flow,
              connections: updatedConnections,
              updated: new Date(),
            };

            onFlowChange(updatedFlow);
          }

          console.log('✅ Connection created successfully');
        } else {
          // TODO: Показать пользователю уведомление о неверном соединении
          console.warn(
            '❌ Invalid connection:',
            sourceNode.type,
            '->',
            targetNode.type,
          );
        }
      },
      [
        setEdges,
        nodes,
        validateConnection,
        getConnectionColor,
        onFlowChange,
        flow,
      ],
    );

    // Обработка клика по блоку - больше не открываем панель свойств
    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
      // Теперь клик по блоку не делает ничего, так как редактирование будет inline
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
          categoryYPositions[
            blockCategory as keyof typeof categoryYPositions
          ] || CANVAS_PADDING;

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

        console.log('Block added:', newBlock);
      },
      [setNodes, getSmartPosition],
    );

    // Функция для обновления данных блока
    const onUpdateBlock = useCallback(
      (blockId: string, newData: Partial<any>) => {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === blockId
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    ...newData,
                  },
                }
              : node,
          ),
        );

        console.log('Block updated:', blockId, newData);
      },
      [setNodes],
    );

    // Функция для центрирования блока в видимой области канваса
    const centerBlock = useCallback(
      (blockId: string) => {
        const node = nodes.find((n) => n.id === blockId);
        if (node) {
          // Центрируем канвас на позиции блока
          setCenter(node.position.x + 140, node.position.y + 60, {
            zoom: getZoom(),
            duration: 500, // Плавная анимация
          });
          console.log('Block centered:', blockId, node.position);
        }
      },
      [nodes, setCenter, getZoom],
    );

    // Функция для получения центральной позиции видимого канваса
    const getCenterPosition = useCallback(() => {
      // Получаем размеры контейнера канваса
      const canvasElement = document.querySelector('.react-flow');
      if (!canvasElement) {
        return { x: 300, y: 200 }; // Fallback позиция
      }

      const rect = canvasElement.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Конвертируем экранные координаты в координаты канваса
      const flowPosition = screenToFlowPosition({ x: centerX, y: centerY });

      // Смещаем на половину размера блока, чтобы блок был точно по центру
      return {
        x: flowPosition.x - 140, // половина ширины блока
        y: flowPosition.y - 60, // половина высоты блока
      };
    }, [screenToFlowPosition]);

    // Функция для проверки, занята ли позиция
    const isPositionOccupied = useCallback(
      (position: { x: number; y: number }, excludeId?: string) => {
        const BLOCK_WIDTH = 280;
        const BLOCK_HEIGHT = 120;
        const PADDING = 20; // Дополнительный отступ между блоками

        return nodes.some((node) => {
          if (excludeId && node.id === excludeId) return false;

          const nodeLeft = node.position.x - PADDING;
          const nodeRight = node.position.x + BLOCK_WIDTH + PADDING;
          const nodeTop = node.position.y - PADDING;
          const nodeBottom = node.position.y + BLOCK_HEIGHT + PADDING;

          const posLeft = position.x;
          const posRight = position.x + BLOCK_WIDTH;
          const posTop = position.y;
          const posBottom = position.y + BLOCK_HEIGHT;

          // Проверяем пересечение прямоугольников
          return !(
            posRight < nodeLeft ||
            posLeft > nodeRight ||
            posBottom < nodeTop ||
            posTop > nodeBottom
          );
        });
      },
      [nodes],
    );

    // Функция для поиска свободной позиции рядом с центром
    const findFreePositionNearCenter = useCallback(() => {
      const centerPos = getCenterPosition();
      const BLOCK_WIDTH = 280;
      const BLOCK_HEIGHT = 120;
      const HORIZONTAL_OFFSET = 60; // Шаг смещения по горизонтали
      const VERTICAL_OFFSET = 100; // Увеличенный шаг смещения по вертикали

      // Сначала проверяем центр
      if (!isPositionOccupied(centerPos)) {
        return centerPos;
      }

      // Ищем свободную позицию по спирали от центра
      for (let radius = 1; radius <= 10; radius++) {
        const positions = [
          // Справа от центра
          {
            x: centerPos.x + (BLOCK_WIDTH + HORIZONTAL_OFFSET) * radius,
            y: centerPos.y,
          },
          // Слева от центра
          {
            x: centerPos.x - (BLOCK_WIDTH + HORIZONTAL_OFFSET) * radius,
            y: centerPos.y,
          },
          // Снизу от центра
          {
            x: centerPos.x,
            y: centerPos.y + (BLOCK_HEIGHT + VERTICAL_OFFSET) * radius,
          },
          // Сверху от центра
          {
            x: centerPos.x,
            y: centerPos.y - (BLOCK_HEIGHT + VERTICAL_OFFSET) * radius,
          },
          // По диагоналям
          {
            x: centerPos.x + (BLOCK_WIDTH + HORIZONTAL_OFFSET) * radius,
            y: centerPos.y + (BLOCK_HEIGHT + VERTICAL_OFFSET) * radius,
          },
          {
            x: centerPos.x - (BLOCK_WIDTH + HORIZONTAL_OFFSET) * radius,
            y: centerPos.y - (BLOCK_HEIGHT + VERTICAL_OFFSET) * radius,
          },
          {
            x: centerPos.x + (BLOCK_WIDTH + HORIZONTAL_OFFSET) * radius,
            y: centerPos.y - (BLOCK_HEIGHT + VERTICAL_OFFSET) * radius,
          },
          {
            x: centerPos.x - (BLOCK_WIDTH + HORIZONTAL_OFFSET) * radius,
            y: centerPos.y + (BLOCK_HEIGHT + VERTICAL_OFFSET) * radius,
          },
        ];

        for (const pos of positions) {
          if (!isPositionOccupied(pos)) {
            return pos;
          }
        }
      }

      // Если не нашли свободную позицию, возвращаем центр со случайным смещением
      return {
        x: centerPos.x + Math.random() * 200 - 100,
        y: centerPos.y + Math.random() * 200 - 100,
      };
    }, [getCenterPosition, isPositionOccupied]);

    // Обработчик клика на блок в палитре - добавляет блок в свободной позиции рядом с центром
    const handleBlockPaletteClick = useCallback(
      (blockType: string, blockCategory: string) => {
        // Находим свободную позицию рядом с центром
        const position = snapToGrid(findFreePositionNearCenter());

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

        console.log('Block added at position:', newBlock.position, newBlock);
      },
      [setNodes, findFreePositionNearCenter, snapToGrid],
    );

    // Функция для показа диалога подтверждения удаления
    const onDeleteBlock = useCallback(
      (nodeId: string) => {
        // Если включен режим быстрого удаления, удаляем сразу
        if (quickDeleteMode) {
          handleDirectDelete(nodeId);
          return;
        }

        const node = nodes.find((n) => n.id === nodeId);
        if (!node) return;

        const blockType = (node.data.type as string) || 'unknown';
        const blockName =
          (node.data.name as string) || getBlockDisplayName(blockType);

        setDeleteConfirm({
          isOpen: true,
          nodeId,
          blockName,
          blockType,
        });
      },
      [nodes, quickDeleteMode],
    );

    // Функция для прямого удаления без диалога
    const handleDirectDelete = useCallback(
      (nodeId: string) => {
        // Удаляем блок из списка узлов
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));

        // Удаляем все связанные соединения
        setEdges((edges) =>
          edges.filter(
            (edge) => edge.source !== nodeId && edge.target !== nodeId,
          ),
        );

        console.log('Block deleted directly:', nodeId);
      },
      [setNodes, setEdges],
    );

    // Функция для выполнения удаления блока
    const handleConfirmDelete = useCallback(() => {
      if (!deleteConfirm.nodeId) return;

      // Удаляем блок из списка узлов
      setNodes((nds) => nds.filter((node) => node.id !== deleteConfirm.nodeId));

      // Удаляем все связанные соединения
      setEdges((edges) =>
        edges.filter(
          (edge) =>
            edge.source !== deleteConfirm.nodeId &&
            edge.target !== deleteConfirm.nodeId,
        ),
      );

      console.log('Block deleted:', deleteConfirm.nodeId);
    }, [deleteConfirm.nodeId, setNodes, setEdges]);

    // Функция для закрытия диалога подтверждения
    const handleCloseDeleteDialog = useCallback(() => {
      setDeleteConfirm({
        isOpen: false,
        nodeId: null,
        blockName: null,
        blockType: null,
      });
    }, []);

    // Функция для включения режима быстрого удаления
    const handleEnableQuickDelete = useCallback(() => {
      // Используем внешний обработчик, если доступен, иначе локальный
      if (onQuickDeleteModeChange) {
        onQuickDeleteModeChange(true);
      } else {
        setInternalQuickDeleteMode(true);
      }

      // Выполняем текущее удаление
      if (deleteConfirm.nodeId) {
        handleDirectDelete(deleteConfirm.nodeId);
      }

      // Закрываем диалог
      handleCloseDeleteDialog();

      console.log('Quick delete mode enabled');
    }, [
      deleteConfirm.nodeId,
      handleDirectDelete,
      handleCloseDeleteDialog,
      onQuickDeleteModeChange,
    ]);

    // Создание динамических nodeTypes с передачей onDeleteBlock
    const dynamicNodeTypes = useMemo(() => {
      const result: Record<string, React.ComponentType<any>> = {};
      Object.keys(nodeTypes).forEach((key) => {
        const Component = nodeTypes[key as keyof typeof nodeTypes];
        result[key] = React.memo((props: any) => (
          <Component
            {...props}
            onDeleteBlock={(nodeId: string) => {
              onDeleteBlock(nodeId);
            }}
            onUpdateBlock={onUpdateBlock}
            onCascadeDelete={handleDirectCascadeDelete}
          />
        ));
      });
      return result;
    }, [onDeleteBlock, onUpdateBlock, handleDirectCascadeDelete]);

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
        ai_result: 'AI Result',

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
        case 'get_card_data':
          return {
            variableName: 'cardData',
            source: 'current_card',
          };
        case 'if_else':
          return {
            condition: {
              variable: '',
              operator: 'exists',
              value: '',
            },
          };
        case 'switch':
          return {
            // Переключатель не нуждается в конфигурации
          };
        case 'ai_result':
          return {
            responseVariable: 'ai_response',
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
    const handleSaveFlow = useCallback(async () => {
      if (!onFlowChange) return;

      try {
        console.log('Starting Flow save process...');

        // Конвертируем текущие nodes и edges в FlowDefinition
        const flowDefinition = convertNodesToFlowDefinition(nodes, edges, {
          id: flow?.id,
          name: flow?.name || 'Untitled Flow',
          description: flow?.description || 'Flow created with visual builder',
        });

        console.log('Converted FlowDefinition:', flowDefinition);

        // Валидируем Flow перед отправкой
        const validation = validateFlowDefinition(flowDefinition);
        if (!validation.valid) {
          console.error('Flow validation failed:', validation.errors);
          alert(`Flow validation failed:\n${validation.errors.join('\n')}`);
          return;
        }

        // Отправляем на бэкенд
        console.log('Sending Flow to backend...');
        const response = await apiClient.flowBuilder.saveFlow(flowDefinition);

        console.log('Flow saved successfully:', response);

        // Обновляем локальное состояние с данными от сервера
        const updatedFlow: FlowDefinition = {
          ...flowDefinition,
          id: response.flowId,
          updated: new Date(),
        };

        onFlowChange(updatedFlow);

        // Показываем успешное сообщение
        alert(
          `✅ ${response.message}\n\nCreated Agent: ${response.createdAgent.name}\nAgent ID: ${response.createdAgent.id}`,
        );
      } catch (error) {
        console.error('Failed to save Flow:', error);
        alert(
          `❌ Failed to save Flow: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }, [flow, onFlowChange, nodes, edges]);

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        triggerCascadeDelete: handleDirectCascadeDelete,
        saveFlow: handleSaveFlow,
      }),
      [handleDirectCascadeDelete, handleSaveFlow],
    );

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
            nodeTypes={dynamicNodeTypes}
            edgeTypes={edgeTypes}
            fitView={false}
            fitViewOptions={{
              padding: 0.3,
            }}
            defaultEdgeOptions={{
              type: 'styledSmoothStep',
              style: {
                strokeWidth: 3,
                stroke: 'hsl(var(--foreground) / 0.6)',
              },
              animated: true,
            }}
            // Динамическая линия соединения с цветом блока-источника
            connectionLineComponent={DynamicConnectionLine}
            snapToGrid={true}
            snapGrid={[20, 20]}
            nodesDraggable={!readonly}
            nodesConnectable={!readonly}
            elementsSelectable={!readonly}
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
            <BlockPalette
              onAddBlock={onAddBlock}
              onBlockClick={handleBlockPaletteClick}
              getZoom={getZoom}
            />
          )}
        </div>

        {/* Панель свойств удалена - теперь редактирование inline */}

        {/* Диалог подтверждения удаления блока */}
        <ConfirmDeleteDialog
          isOpen={deleteConfirm.isOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleConfirmDelete}
          onConfirmWithoutAsking={handleEnableQuickDelete}
          blockName={deleteConfirm.blockName || undefined}
          blockType={deleteConfirm.blockType || undefined}
        />
      </div>
    );
  },
);

export { FlowCanvas as default };
