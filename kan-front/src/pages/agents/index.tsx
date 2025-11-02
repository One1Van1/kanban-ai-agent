'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/shared/components/ui/card';
import { Bot, Activity, Settings } from 'lucide-react';
import { useTranslation } from '@/src/shared/i18n';
import { useAgents } from './hooks';
import { AgentsHeader, AgentsGrid } from './components';

export function AgentsPageContent() {
  const { t } = useTranslation();
  const { agents, loading, error, reload } = useAgents();

  return (
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto">
        <AgentsHeader />

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
        <AgentsGrid
          agents={agents}
          loading={loading}
          error={error}
          onRetry={reload}
        />

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
