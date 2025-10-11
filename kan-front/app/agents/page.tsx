'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Plus, Activity, Settings, Edit } from 'lucide-react';
import { Sidebar } from '@/components/ui/sidebar';
import { useTranslation } from '@/src/lib/i18n';
import { apiClient } from '@/src/lib/api/client';
import { AgentSummary, GetAllAgentsResponse } from '@/src/lib/types';

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

      const response: GetAllAgentsResponse = await apiClient.agents.getAll();
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
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-red-600 bg-red-100';
      case 'paused':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {t('agents.title')}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {t('agents.subtitle')}
              </p>
            </div>
            <Link href="/agents/create">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                {t('agents.createAgent')}
              </Button>
            </Link>
          </div>

          {/* Status Message */}
          <div className="mb-8">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Bot className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {loading
                        ? 'Загрузка агентов...'
                        : error
                          ? 'Ошибка загрузки'
                          : agents.length > 0
                            ? `Активно агентов: ${agents.length}`
                            : 'Агенты не найдены'}
                    </p>
                    <p className="text-sm text-green-700">
                      {loading
                        ? 'Подключение к API...'
                        : error
                          ? error
                          : agents.length > 0
                            ? 'Управляйте своими AI агентами для автоматизации задач'
                            : 'Создайте своего первого AI агента для автоматизации задач'}
                    </p>
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
                    Ошибка загрузки агентов
                  </h3>
                  <p className="text-red-600 mb-6">{error}</p>
                  <Button onClick={loadAgents} variant="outline">
                    Попробовать снова
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
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
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
                        {agent.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {agent.description || 'Нет описания'}
                    </p>

                    <div className="space-y-2 text-xs text-muted-foreground mb-4">
                      <div>Создан: {formatDate(agent.createdAt)}</div>
                      <div>Обновлен: {formatDate(agent.updatedAt)}</div>
                      {agent.boardType && (
                        <div>Тип доски: {agent.boardType}</div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Link href={`/agents/create`} className="flex-1">
                        <Button variant="outline" className="w-full" size="sm">
                          <Edit className="h-3 w-3 mr-1" />
                          Настроить
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="flex-1"
                        size="sm"
                        disabled
                      >
                        <Activity className="h-3 w-3 mr-1" />
                        Активность
                      </Button>
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
                <CardTitle>
                  {t('agents.features.configuration.title')}
                </CardTitle>
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
    </div>
  );
}
