import { create } from 'zustand';
import {
  FlowDefinition,
  FlowExecution,
  FlowVariable,
} from '@/src/types/flow-builder';
import { apiClient } from '@/src/lib/api/client';

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
  loadFlows: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => Promise<{
    flows: FlowDefinition[];
    pagination: any;
  }>;
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
      // Check if this is a new flow or existing one
      const isNewFlow = !flow.id || flow.id.startsWith('flow-');

      let savedFlow;

      if (isNewFlow) {
        // Create new flow
        savedFlow = await apiClient.flowManagement.createFlow({
          name: flow.name,
          description: flow.description,
          definition: {
            blocks: flow.blocks,
            connections: flow.connections,
            variables: flow.variables,
            settings: flow.settings,
            triggers: flow.triggers,
          },
          createdBy: 'current-user', // TODO: Get from auth context
          metadata: {
            version: flow.version,
            category: 'workflow',
          },
        });
      } else {
        // Update existing flow
        savedFlow = await apiClient.flowManagement.updateFlow(flow.id, {
          name: flow.name,
          description: flow.description,
          definition: {
            blocks: flow.blocks,
            connections: flow.connections,
            variables: flow.variables,
            settings: flow.settings,
            triggers: flow.triggers,
          },
          updatedBy: 'current-user', // TODO: Get from auth context
          metadata: {
            version: flow.version,
            category: 'workflow',
          },
        });
      }

      // Convert backend response to frontend format
      const frontendFlow: FlowDefinition = {
        id: savedFlow.flowId,
        name: savedFlow.name,
        description: savedFlow.description || '',
        version: String(savedFlow.metadata?.version || '1.0.0'),
        created: new Date(savedFlow.createdAt),
        updated: new Date(savedFlow.updatedAt),
        triggers: savedFlow.definition.triggers || [],
        blocks: savedFlow.definition.blocks || [],
        connections: savedFlow.definition.connections || [],
        variables: savedFlow.definition.variables || [],
        settings: savedFlow.definition.settings || {
          timeout: 600000,
          retryAttempts: 3,
          errorHandling: 'stop',
          logging: 'detailed',
        },
      };

      set((state) => {
        const existingIndex = state.flows.findIndex((f) => f.id === flow.id);
        const updatedFlows =
          existingIndex >= 0
            ? state.flows.map((f, i) =>
                i === existingIndex ? frontendFlow : f,
              )
            : [...state.flows, frontendFlow];

        return {
          flows: updatedFlows,
          currentFlow: frontendFlow,
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
      const savedFlow = await apiClient.flowManagement.getFlow(flowId);

      // Convert backend response to frontend format
      const frontendFlow: FlowDefinition = {
        id: savedFlow.flowId,
        name: savedFlow.name,
        description: savedFlow.description || '',
        version: String(savedFlow.metadata?.version || '1.0.0'),
        created: new Date(savedFlow.createdAt),
        updated: new Date(savedFlow.updatedAt),
        triggers: savedFlow.definition.triggers || [],
        blocks: savedFlow.definition.blocks || [],
        connections: savedFlow.definition.connections || [],
        variables: savedFlow.definition.variables || [],
        settings: savedFlow.definition.settings || {
          timeout: 600000,
          retryAttempts: 3,
          errorHandling: 'stop',
          logging: 'detailed',
        },
      };

      set({ currentFlow: frontendFlow, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
      throw error;
    }
  },

  loadFlows: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.flowManagement.listFlows(params);

      // Convert backend response to frontend format
      const frontendFlows: FlowDefinition[] = response.items.map((item) => ({
        id: item.flowId,
        name: item.name,
        description: item.description || '',
        version: String(item.metadata?.version || '1.0.0'),
        created: new Date(item.createdAt),
        updated: new Date(item.updatedAt),
        triggers: [], // Will be loaded when flow is opened
        blocks: [], // Will be loaded when flow is opened
        connections: [], // Will be loaded when flow is opened
        variables: [], // Will be loaded when flow is opened
        settings: {
          timeout: 600000,
          retryAttempts: 3,
          errorHandling: 'stop',
          logging: 'detailed',
        },
      }));

      set({
        flows: frontendFlows,
        isLoading: false,
      });

      return {
        flows: frontendFlows,
        pagination: response.pagination,
      };
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
      const executionResponse = await apiClient.flowManagement.executeFlow(
        flowId,
        {
          context: trigger,
          executedBy: 'current-user', // TODO: Get from auth context
        },
      );

      // Convert backend response to frontend format
      const execution: FlowExecution = {
        id: executionResponse.executionId,
        flowId: executionResponse.flowId,
        status: executionResponse.status as any,
        currentBlock: 'flow-start', // TODO: Track current block from instructions
        variables: get().variables,
        startedAt: new Date(executionResponse.startedAt),
        completedAt: executionResponse.completedAt
          ? new Date(executionResponse.completedAt)
          : undefined,
        error: executionResponse.error,
        logs: executionResponse.instructions.map((instruction, index) => ({
          timestamp: new Date(),
          blockId: `step-${index + 1}`,
          level: 'info' as const,
          message: `Step ${index + 1}: ${instruction}`,
          data: {},
        })),
      };

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
