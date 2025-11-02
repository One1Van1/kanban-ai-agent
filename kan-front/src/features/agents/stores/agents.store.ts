import { create } from 'zustand';
import { agentsAPI } from '../api/agents.api';
import { Agent, AgentActivity } from '../types';

interface AgentsStore {
  // State
  agents: Agent[];
  selectedAgent: Agent | null;
  agentActivity: AgentActivity[];
  isLoading: boolean;
  error: string | null;

  // Actions
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
  createAgent: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = (await agentsAPI.create(data)) as any;
      // API возвращает { success, agentId, name, message, agent }
      const newAgent = response.agent || response.data || response;

      set((state) => ({
        agents: [...state.agents, newAgent],
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Create agent error:', error);
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          'Failed to create agent',
        isLoading: false,
      });
      throw error;
    }
  },

  configureAgent: async (agentId, data) => {
    set({ isLoading: true, error: null });
    try {
      await agentsAPI.configure(agentId, data);

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
      const response = await agentsAPI.execute(data);

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
      const response = (await agentsAPI.getActivity(agentId)) as any;
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
