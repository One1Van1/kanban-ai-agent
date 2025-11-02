import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { flowsAPI } from '@/src/features/flows/api/flows.api';
import { useDialog } from '@/src/shared/hooks/use-dialog';

export interface FlowItem {
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

export function useFlowsList(shouldLoad: boolean = true) {
  const router = useRouter();
  const { showAlert } = useDialog();

  const [flows, setFlows] = useState<FlowItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (shouldLoad) {
      loadFlowsList();
    }
  }, [shouldLoad]);

  const loadFlowsList = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Loading flows list for editor...');

      const response = await flowsAPI.list({
        limit: 50,
      });

      console.log('✅ Flows loaded successfully:', response);
      setFlows(response.items || []);
    } catch (err) {
      console.error('❌ Failed to load flows:', err);
      showAlert(
        err instanceof Error ? err.message : 'Failed to load flows',
        'error',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFlow = (flowId: string) => {
    router.push(`/flows/editor?flowId=${flowId}`);
  };

  return {
    flows,
    isLoading,
    loadFlowsList,
    handleSelectFlow,
  };
}
