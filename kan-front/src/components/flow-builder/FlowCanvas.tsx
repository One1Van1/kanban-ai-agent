'use client';

import React, { useState, useCallback } from 'react';
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
}

export function FlowCanvas({
  flow,
  onFlowChange,
  readonly = false,
}: FlowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);

  // Обработка соединения блоков
  const onConnect = useCallback(
    (params: Connection | Edge) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges],
  );

  // Обработка клика по блоку
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedBlock(node.id);
    setIsPropertiesOpen(true);
  }, []);

  // Добавление нового блока из палитры
  const onAddBlock = useCallback(
    (blockType: string, blockCategory: string) => {
      const newBlock: Node = {
        id: `${blockType}-${Date.now()}`,
        type: blockCategory,
        position: {
          x: Math.random() * 400,
          y: Math.random() * 400,
        },
        data: {
          type: blockType,
          name: `New ${blockType}`,
          config: getDefaultConfig(blockType),
        },
      };

      setNodes((nds) => nds.concat(newBlock));
    },
    [setNodes],
  );

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

  return (
    <div className="flex h-full w-full bg-background">
      {/* Боковая панель с палитрой блоков */}
      {isSidebarOpen && (
        <div className="w-80 bg-card border-r border-border shadow-sm h-full">
          <BlockPalette onAddBlock={onAddBlock} />
        </div>
      )}

      {/* Основной канвас */}
      <div className="flex-1 relative h-full">
        {/* Панель инструментов */}
        <FlowToolbar
          onSave={handleSaveFlow}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onToggleProperties={() => setIsPropertiesOpen(!isPropertiesOpen)}
          readonly={readonly}
        />

        {/* React Flow канвас */}
        <div className="absolute inset-0 top-12 bg-gradient-to-br from-background to-muted/20">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{
              padding: 0.3,
            }}
            defaultEdgeOptions={{
              style: { strokeWidth: 2, stroke: 'hsl(var(--foreground) / 0.4)' },
              animated: true,
            }}
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
      </div>

      {/* Панель свойств */}
      {isPropertiesOpen && selectedBlock && (
        <div className="w-96 bg-card border-l border-border shadow-sm h-full">
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
