import { create } from 'zustand';
import {
  FlowDefinition,
  FlowExecution,
  FlowVariable,
} from '@/src/features/flow-builder/types';
import { flowsAPI } from '../api/flows.api';

interface FlowEditorStore {
  // Current flow being edited
  currentFlow: FlowDefinition | null;
  setCurrentFlow: (flow: FlowDefinition | null) => void;

  // Original flow state (for comparing changes)
  originalFlow: FlowDefinition | null;
  setOriginalFlow: (flow: FlowDefinition | null) => void;
  hasUnsavedChanges: () => boolean;

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

  // Editor state
  selectedBlockId: string | null;
  setSelectedBlockId: (blockId: string | null) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isPropertiesOpen: boolean;
  setIsPropertiesOpen: (open: boolean) => void;

  // Actions
  loadFlow: (flowId: string) => Promise<void>;
  saveFlow: (flow: FlowDefinition) => Promise<void>;
  discardChanges: () => void;
  testFlow: (flowId: string) => Promise<FlowExecution>;
  executeFlow: (flowId: string, trigger?: any) => Promise<FlowExecution>;
}

export const useFlowEditorStore = create<FlowEditorStore>((set, get) => ({
  // Current flow being edited
  currentFlow: null,
  setCurrentFlow: (flow) => set({ currentFlow: flow }),

  // Original flow state (for comparing changes)
  originalFlow: null,
  setOriginalFlow: (flow) => set({ originalFlow: flow }),
  hasUnsavedChanges: () => {
    const { currentFlow, originalFlow } = get();
    if (!currentFlow || !originalFlow) return false;

    // Simple comparison - you could make this more sophisticated
    return JSON.stringify(currentFlow) !== JSON.stringify(originalFlow);
  },

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

  // Editor state
  selectedBlockId: null,
  setSelectedBlockId: (blockId) => set({ selectedBlockId: blockId }),
  isSidebarOpen: true,
  setIsSidebarOpen: (open) => set({ isSidebarOpen: open }),
  isPropertiesOpen: false,
  setIsPropertiesOpen: (open) => set({ isPropertiesOpen: open }),

  // Actions
  loadFlow: async (flowId) => {
    set({ isLoading: true, error: null });

    try {
      console.log('🔄 Flow Editor Store: Loading flow for editing:', flowId);
      const savedFlow = await flowsAPI.get(flowId);

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

      console.log(
        '✅ Flow Editor Store: Flow loaded successfully:',
        frontendFlow,
      );

      set({
        currentFlow: frontendFlow,
        originalFlow: JSON.parse(JSON.stringify(frontendFlow)), // Deep copy
        isLoading: false,
      });
    } catch (error) {
      console.error('❌ Flow Editor Store: Failed to load flow:', error);
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
      throw error;
    }
  },

  saveFlow: async (flow) => {
    set({ isLoading: true, error: null });

    try {
      console.log('💾 Flow Editor Store: Saving flow changes:', flow);

      // Update existing flow (Editor is only for editing, not creating new flows)
      const savedFlow = await flowsAPI.update(flow.id!, {
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

      console.log(
        '✅ Flow Editor Store: Flow saved successfully:',
        frontendFlow,
      );

      set({
        currentFlow: frontendFlow,
        originalFlow: JSON.parse(JSON.stringify(frontendFlow)), // Update original to match saved
        isLoading: false,
      });
    } catch (error) {
      console.error('❌ Flow Editor Store: Failed to save flow:', error);
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
      throw error;
    }
  },

  discardChanges: () => {
    const { originalFlow } = get();
    if (originalFlow) {
      set({
        currentFlow: JSON.parse(JSON.stringify(originalFlow)), // Restore from original
      });
      console.log(
        '🔄 Flow Editor Store: Changes discarded, reverted to original',
      );
    }
  },

  testFlow: async (flowId) => {
    set({ isLoading: true, error: null });

    try {
      console.log('🧪 Flow Editor Store: Testing flow:', flowId);

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
      console.error('❌ Flow Editor Store: Failed to test flow:', error);
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
      console.log('🚀 Flow Editor Store: Executing flow:', flowId);

      const executionResponse = await flowsAPI.execute(flowId, {
        context: trigger,
        executedBy: 'current-user', // TODO: Get from auth context
      });

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
        logs: executionResponse.instructions.map(
          (instruction: any, index: number) => ({
            timestamp: new Date(),
            blockId: `step-${index + 1}`,
            level: 'info' as const,
            message: `Step ${index + 1}: ${instruction}`,
            data: {},
          }),
        ),
      };

      get().addExecution(execution);
      set({ isLoading: false });
      return execution;
    } catch (error) {
      console.error('❌ Flow Editor Store: Failed to execute flow:', error);
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
      throw error;
    }
  },
}));
