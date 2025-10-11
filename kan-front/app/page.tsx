'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Bot, Activity, Clock, CheckCircle } from 'lucide-react';
import { Sidebar } from '@/components/ui/sidebar';
import { useTranslation } from '@/src/lib/i18n';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 pl-64">
        <div className="min-h-full">
          <div className="max-w-7xl mx-auto p-6">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
                {t('home.title')}{' '}
                <span className="text-primary">{t('home.titleHighlight')}</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('home.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('home.metrics.activeAgents')}
                  </CardTitle>
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    +2 {t('home.metrics.fromLastWeek')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('home.metrics.tasksProcessed')}
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,429</div>
                  <p className="text-xs text-muted-foreground">
                    +18% {t('home.metrics.fromLastMonth')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('home.metrics.completionRate')}
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94.2%</div>
                  <p className="text-xs text-muted-foreground">
                    +5.1% {t('home.metrics.fromLastMonth')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('home.metrics.responseTime')}
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.3s</div>
                  <p className="text-xs text-muted-foreground">
                    -0.5s {t('home.metrics.fromLastWeek2')}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {t('home.quickActions.title')}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link href="/agents/create">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        {t('home.quickActions.createNewAgent.title')}
                      </CardTitle>
                      <CardDescription>
                        {t('home.quickActions.createNewAgent.description')}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/agents">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        {t('home.quickActions.viewAllAgents.title')}
                      </CardTitle>
                      <CardDescription>
                        {t('home.quickActions.viewAllAgents.description')}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/kanban">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        {t('home.quickActions.kanbanBoards.title')}
                      </CardTitle>
                      <CardDescription>
                        {t('home.quickActions.kanbanBoards.description')}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
