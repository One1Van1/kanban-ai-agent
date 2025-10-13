'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  FlowBuilderState,
  FlowDefinition,
  FlowVariable,
  FlowConnection,
} from '@/src/types/flow-builder';

interface FlowBuilderContextValue extends FlowBuilderState {
  setFlow: (flow: FlowDefinition | null) => void;
  selectBlock: (id: string | null) => void;
  toggleProperties: (open?: boolean) => void;
  setVariable: (name: string, value: any) => void;
  addConnection: (conn: FlowConnection) => void;
}

const FlowBuilderContext = createContext<FlowBuilderContextValue | undefined>(
  undefined,
);

export const FlowBuilderProvider: React.FC<
  React.PropsWithChildren<{ initialFlow?: FlowDefinition | null }>
> = ({ initialFlow = null, children }) => {
  const [flow, setFlow] = useState<FlowDefinition | null>(initialFlow);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [variables, setVariables] = useState<Record<string, any>>({});

  const selectBlock = useCallback((id: string | null) => {
    setSelectedBlock(id);
    if (id) setIsPropertiesPanelOpen(true);
  }, []);

  const toggleProperties = useCallback((open?: boolean) => {
    setIsPropertiesPanelOpen((prev) => (open !== undefined ? open : !prev));
  }, []);

  const setVariable = useCallback((name: string, value: any) => {
    setVariables((prev) => ({ ...prev, [name]: value }));
  }, []);

  const addConnection = useCallback(
    (conn: FlowConnection) => {
      if (!flow) return;
      const updated: FlowDefinition = {
        ...flow,
        connections: [...flow.connections, conn],
        updated: new Date(),
      };
      setFlow(updated);
    },
    [flow],
  );

  return (
    <FlowBuilderContext.Provider
      value={{
        flow,
        selectedBlock,
        isPropertiesPanelOpen,
        isSidebarOpen,
        executionHistory,
        variables,
        setFlow,
        selectBlock,
        toggleProperties,
        setVariable,
        addConnection,
      }}
    >
      {children}
    </FlowBuilderContext.Provider>
  );
};

export function useFlowBuilder() {
  const ctx = useContext(FlowBuilderContext);
  if (!ctx)
    throw new Error('useFlowBuilder must be used within FlowBuilderProvider');
  return ctx;
}
