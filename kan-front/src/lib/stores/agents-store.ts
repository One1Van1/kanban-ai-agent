import { create } from 'zustand';
import { apiClient } from '../api/client';
import { Agent, AgentActivity } from '../types';

interface AgentsStore {
  // State
  agents: Agent[];
  selectedAgent: Agent | null;
  agentActivity: AgentActivity[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAgents: () => Promise<void>;
  createAgent: (data: any) => Promise<void>;
  configureAgent: (agentId: string, data: any) => Promise<void>;
  executeAgent: (data: any) => Promise<any>;
  getAgentActivity: (agentId: string) => Promise<void>;
  setSelectedAgent: (agent: Agent | null) => void;
  clearError: () => void;
}

export const useAgentsStore = create<AgentsStore>((set, get) => ({
  // Initial state
  agents: [],
  selectedAgent: null,
  agentActivity: [],
  isLoading: false,
  error: null,

  // Actions
  fetchAgents: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = (await apiClient.agents.list()) as any;
      set({
        agents: response.data || response,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch agents',
        isLoading: false,
      });
    }
  },

  createAgent: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = (await apiClient.agents.create(data)) as any;
      const newAgent = response.data || response;

      set((state) => ({
        agents: [...state.agents, newAgent],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create agent',
        isLoading: false,
      });
      throw error;
    }
  },

  configureAgent: async (agentId, data) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.agents.configure(agentId, data);

      // Update agent in store if needed
      set((state) => ({
        agents: state.agents.map((agent) =>
          agent.id === agentId ? { ...agent, ...data } : agent,
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to configure agent',
        isLoading: false,
      });
      throw error;
    }
  },

  executeAgent: async (data) => {
    set({ error: null });
    try {
      const response = await apiClient.agents.execute(data);

      // Optionally update activity or trigger refresh
      const { getAgentActivity } = get();
      if (data.agentId) {
        await getAgentActivity(data.agentId);
      }

      return response;
    } catch (error: any) {
      set({ error: error.message || 'Failed to execute agent action' });
      throw error;
    }
  },

  getAgentActivity: async (agentId) => {
    try {
      const response = (await apiClient.agents.getActivity(agentId)) as any;
      set({ agentActivity: response.data || response });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch agent activity' });
    }
  },

  setSelectedAgent: (agent) => {
    set({ selectedAgent: agent });
  },

  clearError: () => {
    set({ error: null });
  },
}));
