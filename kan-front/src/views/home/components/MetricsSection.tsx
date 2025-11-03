'use client';

import React from 'react';
import { Bot, Activity, Clock, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/src/shared/i18n';
import { MetricCard } from './MetricCard';

export function MetricsSection() {
  const { t } = useTranslation();

  const metrics = [
    {
      title: t('home.metrics.activeAgents'),
      value: '12',
      trend: `+2 ${t('home.metrics.fromLastWeek')}`,
      icon: Bot,
    },
    {
      title: t('home.metrics.tasksProcessed'),
      value: '1,429',
      trend: `+18% ${t('home.metrics.fromLastMonth')}`,
      icon: Activity,
    },
    {
      title: t('home.metrics.completionRate'),
      value: '94.2%',
      trend: `+5.1% ${t('home.metrics.fromLastMonth')}`,
      icon: CheckCircle,
    },
    {
      title: t('home.metrics.responseTime'),
      value: '2.3s',
      trend: `-0.5s ${t('home.metrics.fromLastWeek2')}`,
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}
