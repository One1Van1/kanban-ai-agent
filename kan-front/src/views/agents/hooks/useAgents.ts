import { useEffect, useState } from 'react';
import { agentsAPI } from '@/src/features/agents/api/agents.api';
import { AgentSummary, GetAllAgentsResponse } from '@/src/shared/types';

export function useAgents() {
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading agents...');

      const response: GetAllAgentsResponse = await agentsAPI.getAll();
      console.log('✅ Agents loaded successfully:', response);

      setAgents(response.agents || []);
    } catch (err) {
      console.error('❌ Failed to load agents:', err);
      setError(err instanceof Error ? err.message : 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadAgents();
    }
  }, []);

  return {
    agents,
    loading,
    error,
    reload: loadAgents,
  };
}
