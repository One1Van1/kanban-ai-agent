'use client';

import React from 'react';
import { Bot, Activity, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/src/shared/i18n';
import { QuickActionCard } from './QuickActionCard';

export function QuickActionsSection() {
  const { t } = useTranslation();

  const actions = [
    {
      href: '/agents/create',
      title: t('home.quickActions.createNewAgent.title'),
      description: t('home.quickActions.createNewAgent.description'),
      icon: Bot,
    },
    {
      href: '/agents',
      title: t('home.quickActions.viewAllAgents.title'),
      description: t('home.quickActions.viewAllAgents.description'),
      icon: Activity,
    },
    {
      href: '/kanban',
      title: t('home.quickActions.kanbanBoards.title'),
      description: t('home.quickActions.kanbanBoards.description'),
      icon: CheckCircle,
    },
  ];

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {t('home.quickActions.title')}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action, index) => (
          <QuickActionCard key={index} {...action} />
        ))}
      </div>
    </div>
  );
}
