'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Plus, Activity, Settings } from 'lucide-react';
import { Sidebar } from '@/components/ui/sidebar';
import { useTranslation } from '@/src/lib/i18n';

export default function AgentsPage() {
  const { t } = useTranslation();

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
                      {t('agents.status.active')}
                    </p>
                    <p className="text-sm text-green-700">
                      {t('agents.noAgentsDesc')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
