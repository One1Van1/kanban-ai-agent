import Link from 'next/link';
import { Bot, Plus } from 'lucide-react';
import { Card, CardContent } from '@/src/shared/components/ui/card';
import { Button } from '@/src/shared/components/ui/button';
import { useTranslation } from '@/src/shared/i18n';
import { AgentSummary } from '@/src/shared/types';
import { AgentCard } from './AgentCard';

interface AgentsGridProps {
  agents: AgentSummary[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function AgentsGrid({
  agents,
  loading,
  error,
  onRetry,
}: AgentsGridProps) {
  const { t } = useTranslation();

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="text-center py-12">
            <Bot className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              {t('agents.errorTitle')}
            </h3>
            <p className="text-red-600 mb-6">{error}</p>
            <Button onClick={onRetry} variant="outline">
              {t('common.tryAgain')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty state
  if (agents.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Card className="col-span-full">
          <CardContent className="text-center py-12">
            <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t('agents.noAgents')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t('agents.noAgentsDesc')}
            </p>
            <Link href="/agents/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('agents.createNew')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Agents grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
