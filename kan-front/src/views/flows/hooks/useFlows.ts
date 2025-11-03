import { useEffect, useState } from 'react';
import { flowsAPI } from '@/src/features/flows/api/flows.api';

interface FlowItem {
  flowId: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  agentId?: string;
  blockCount: number;
  metadata?: any;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export function useFlows(searchTerm: string = '', statusFilter: string = '') {
  const [flows, setFlows] = useState<FlowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFlows = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading flows...');

      const response = await flowsAPI.list({
        limit: 50,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
      });

      console.log('✅ Flows loaded successfully:', response);
      setFlows(response.items || []);
    } catch (err) {
      console.error('❌ Failed to load flows:', err);
      setError(err instanceof Error ? err.message : 'Failed to load flows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadFlows();
    }
  }, [searchTerm, statusFilter]);

  return {
    flows,
    loading,
    error,
    reload: loadFlows,
    setFlows,
  };
}

export type { FlowItem };
