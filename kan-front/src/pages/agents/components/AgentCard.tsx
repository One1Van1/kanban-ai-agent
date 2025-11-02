import Link from 'next/link';
import { Bot, Edit } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/shared/components/ui/card';
import { Button } from '@/src/shared/components/ui/button';
import { useTranslation } from '@/src/shared/i18n';
import { AgentSummary } from '@/src/shared/types';

interface AgentCardProps {
  agent: AgentSummary;
}

export function AgentCard({ agent }: AgentCardProps) {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-primary bg-primary/10 border border-primary/20';
      case 'inactive':
        return 'text-muted-foreground bg-muted border border-border';
      case 'paused':
        return 'text-amber-600 bg-amber-50 border border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800';
      default:
        return 'text-muted-foreground bg-muted border border-border';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return t('agents.status.active');
      case 'inactive':
        return t('agents.status.inactive');
      case 'paused':
        return t('agents.status.paused');
      default:
        return status;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow flex flex-col h-80">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">
              {agent.name}
            </CardTitle>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}
          >
            {getStatusText(agent.status)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex flex-col flex-grow">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {agent.description || t('agents.noDescription')}
        </p>

        <div className="space-y-2 text-xs text-muted-foreground mb-4 flex-grow">
          <div>
            {t('agents.created')}: {formatDate(agent.createdAt)}
          </div>
          <div>
            {t('agents.updated')}: {formatDate(agent.updatedAt)}
          </div>
          {agent.boardType && (
            <div>
              {t('agents.boardType')}: {agent.boardType}
            </div>
          )}
        </div>

        <div className="mt-auto">
          <Link href={`/agents/create`} className="block">
            <Button
              variant="secondary"
              className="w-full justify-center"
              size="default"
            >
              <Edit className="h-4 w-4 mr-2" />
              {t('agents.configure')}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
