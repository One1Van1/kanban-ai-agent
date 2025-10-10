import { create } from 'zustand';
import {
  FlowDefinition,
  FlowExecution,
  FlowVariable,
} from '@/src/types/flow-builder';

interface FlowBuilderStore {
  // Current flow
  currentFlow: FlowDefinition | null;
  setCurrentFlow: (flow: FlowDefinition | null) => void;

  // Flows list
  flows: FlowDefinition[];
  setFlows: (flows: FlowDefinition[]) => void;
  addFlow: (flow: FlowDefinition) => void;
  updateFlow: (flowId: string, updates: Partial<FlowDefinition>) => void;
  deleteFlow: (flowId: string) => void;

  // Execution history
  executions: FlowExecution[];
  setExecutions: (executions: FlowExecution[]) => void;
  addExecution: (execution: FlowExecution) => void;
  updateExecution: (
    executionId: string,
    updates: Partial<FlowExecution>,
  ) => void;

  // Flow variables
  variables: Record<string, any>;
  setVariables: (variables: Record<string, any>) => void;
  setVariable: (name: string, value: any) => void;
  getVariable: (name: string) => any;

  // UI state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;

  // Builder state
  selectedBlockId: string | null;
  setSelectedBlockId: (blockId: string | null) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isPropertiesOpen: boolean;
  setIsPropertiesOpen: (open: boolean) => void;

  // Actions
  createNewFlow: () => FlowDefinition;
  saveFlow: (flow: FlowDefinition) => Promise<void>;
  loadFlow: (flowId: string) => Promise<void>;
  testFlow: (flowId: string) => Promise<FlowExecution>;
  deployFlow: (flowId: string) => Promise<void>;
  executeFlow: (flowId: string, trigger?: any) => Promise<FlowExecution>;
}

export const useFlowBuilderStore = create<FlowBuilderStore>((set, get) => ({
  // Current flow
  currentFlow: null,
  setCurrentFlow: (flow) => set({ currentFlow: flow }),

  // Flows list
  flows: [],
  setFlows: (flows) => set({ flows }),
  addFlow: (flow) => set((state) => ({ flows: [...state.flows, flow] })),
  updateFlow: (flowId, updates) =>
    set((state) => ({
      flows: state.flows.map((flow) =>
        flow.id === flowId
          ? { ...flow, ...updates, updated: new Date() }
          : flow,
      ),
      currentFlow:
        state.currentFlow?.id === flowId
          ? { ...state.currentFlow, ...updates, updated: new Date() }
          : state.currentFlow,
    })),
  deleteFlow: (flowId) =>
    set((state) => ({
      flows: state.flows.filter((flow) => flow.id !== flowId),
      currentFlow: state.currentFlow?.id === flowId ? null : state.currentFlow,
    })),

  // Execution history
  executions: [],
  setExecutions: (executions) => set({ executions }),
  addExecution: (execution) =>
    set((state) => ({ executions: [...state.executions, execution] })),
  updateExecution: (executionId, updates) =>
    set((state) => ({
      executions: state.executions.map((execution) =>
        execution.id === executionId ? { ...execution, ...updates } : execution,
      ),
    })),

  // Flow variables
  variables: {},
  setVariables: (variables) => set({ variables }),
  setVariable: (name, value) =>
    set((state) => ({ variables: { ...state.variables, [name]: value } })),
  getVariable: (name) => get().variables[name],

  // UI state
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  error: null,
  setError: (error) => set({ error }),

  // Builder state
  selectedBlockId: null,
  setSelectedBlockId: (blockId) => set({ selectedBlockId: blockId }),
  isSidebarOpen: true,
  setIsSidebarOpen: (open) => set({ isSidebarOpen: open }),
  isPropertiesOpen: false,
  setIsPropertiesOpen: (open) => set({ isPropertiesOpen: open }),

  // Actions
  createNewFlow: () => {
    const newFlow: FlowDefinition = {
      id: `flow-${Date.now()}`,
      name: 'Untitled Flow',
      description: '',
      version: '1.0.0',
      created: new Date(),
      updated: new Date(),
      triggers: [],
      blocks: [],
      connections: [],
      variables: [],
      settings: {
        timeout: 600000, // 10 minutes
        retryAttempts: 3,
        errorHandling: 'stop',
        logging: 'detailed',
      },
    };

    set({ currentFlow: newFlow });
    return newFlow;
  },

  saveFlow: async (flow) => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Implement API call to save flow
      const response = await fetch('/api/flows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flow),
      });

      if (!response.ok) {
        throw new Error('Failed to save flow');
      }

      const savedFlow = await response.json();

      set((state) => {
        const existingIndex = state.flows.findIndex((f) => f.id === flow.id);
        const updatedFlows =
          existingIndex >= 0
            ? state.flows.map((f, i) => (i === existingIndex ? savedFlow : f))
            : [...state.flows, savedFlow];

        return {
          flows: updatedFlows,
          currentFlow: savedFlow,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
      throw error;
    }
  },

  loadFlow: async (flowId) => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Implement API call to load flow
      const response = await fetch(`/api/flows/${flowId}`);

      if (!response.ok) {
        throw new Error('Failed to load flow');
      }

      const flow = await response.json();
      set({ currentFlow: flow, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
      throw error;
    }
  },

  testFlow: async (flowId) => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Implement API call to test flow
      const response = await fetch(`/api/flows/${flowId}/test`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to test flow');
      }

      const execution = await response.json();
      get().addExecution(execution);

      set({ isLoading: false });
      return execution;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
      throw error;
    }
  },

  deployFlow: async (flowId) => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Implement API call to deploy flow
      const response = await fetch(`/api/flows/${flowId}/deploy`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to deploy flow');
      }

      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
      throw error;
    }
  },

  executeFlow: async (flowId, trigger) => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Implement API call to execute flow
      const response = await fetch(`/api/flows/${flowId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger }),
      });

      if (!response.ok) {
        throw new Error('Failed to execute flow');
      }

      const execution = await response.json();
      get().addExecution(execution);

      set({ isLoading: false });
      return execution;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
      throw error;
    }
  },
}));
