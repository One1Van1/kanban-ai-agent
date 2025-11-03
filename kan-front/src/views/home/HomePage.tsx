'use client';

import React from 'react';
import { useTranslation } from '@/src/shared/i18n';
import { MetricsSection } from './components/MetricsSection';
import { QuickActionsSection } from './components/QuickActionsSection';

export default function HomePageContent() {
  const { t } = useTranslation();

  return (
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
            {t('home.title')}{' '}
            <span className="text-primary">{t('home.titleHighlight')}</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>
        </div>

        <MetricsSection />
        <QuickActionsSection />
      </div>
    </div>
  );
}
