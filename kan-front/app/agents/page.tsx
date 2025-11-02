'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/src/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/shared/components/ui/card';
import { Bot, Plus, Activity, Settings, Edit } from 'lucide-react';
import { useTranslation } from '@/src/shared/i18n';
import { agentsAPI } from '@/src/features/agents/api/agents.api';
import { AgentSummary, GetAllAgentsResponse } from '@/src/shared/types';

export default function AgentsPage() {
  const { t } = useTranslation();
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Убеждаемся что код выполняется только в браузере
    if (typeof window !== 'undefined') {
      loadAgents();
    }
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading agents...');
      console.log('🌐 API Client baseURL:', 'http://localhost:3000');

      const response: GetAllAgentsResponse = await agentsAPI.getAll();
      console.log('✅ Agents loaded successfully:', response);

      setAgents(response.agents || []);
    } catch (err) {
      console.error('❌ Failed to load agents:', err);
      console.error('📋 Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        cause: err instanceof Error ? err.cause : undefined,
      });
      setError(err instanceof Error ? err.message : 'Failed to load agents');
    } finally {
      setLoading(false);
      console.log('🏁 Load agents finished');
    }
  };
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
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t('agents.title')}
            </h1>
            <p className="mt-2 text-muted-foreground">{t('agents.subtitle')}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/agents/flow-builder">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Settings className="h-4 w-4 mr-2" />
                🎨 Flow Builder
              </Button>
            </Link>
            <Link href="/agents/create">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                {t('agents.createAgent')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Status Message */}
        <div className="mb-8">
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-center text-center">
                <div className="flex items-center gap-3">
                  <Bot className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      {loading
                        ? t('agents.loading')
                        : error
                          ? t('agents.error')
                          : agents.length > 0
                            ? `${t('agents.activeCount')}: ${agents.length}`
                            : t('agents.notFound')}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {loading
                        ? t('agents.connecting')
                        : error
                          ? error
                          : agents.length > 0
                            ? t('agents.manageDescription')
                            : t('agents.createFirstDescription')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agents Grid */}
        {loading ? (
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
        ) : error ? (
          <div className="grid grid-cols-1 gap-6">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="text-center py-12">
                <Bot className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  {t('agents.errorTitle')}
                </h3>
                <p className="text-red-600 mb-6">{error}</p>
                <Button onClick={loadAgents} variant="outline">
                  {t('common.tryAgain')}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : agents.length === 0 ? (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card
                key={agent.id}
                className="hover:shadow-lg transition-shadow flex flex-col h-80"
              >
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
            ))}
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <Bot className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{t('agents.features.automation.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('agents.features.automation.description')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Activity className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>{t('agents.features.monitoring.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('agents.features.monitoring.description')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Settings className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>{t('agents.features.configuration.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('agents.features.configuration.description')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
