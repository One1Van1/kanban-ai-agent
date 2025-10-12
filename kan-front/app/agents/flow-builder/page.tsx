'use client';

import React, { useState } from 'react';
import { FlowCanvas } from '../../../src/components/flow-builder/FlowCanvas';
import { Button } from '../../../components/ui/button';
import { Save, Play, ArrowLeft, Workflow } from 'lucide-react';
import { FlowDefinition } from '../../../src/types/flow-builder';
import { useTranslation } from '../../../src/lib/i18n';
import Link from 'next/link';

export default function FlowBuilderPage() {
  const { t } = useTranslation();
  const [currentFlow, setCurrentFlow] = useState<FlowDefinition | undefined>(
    undefined,
  );

  const handleSaveFlow = () => {
    if (currentFlow) {
      console.log('Saving flow:', currentFlow);
    }
  };

  const handleTestFlow = () => {
    if (currentFlow) {
      console.log('Testing flow:', currentFlow);
    }
  };

  const createDemoFlow = () => {
    const demoFlow: FlowDefinition = {
      id: 'demo-photo-analysis',
      name: t('flowBuilder.demo.name'),
      description: t('flowBuilder.demo.description'),
      version: '1.0',
      created: new Date(),
      updated: new Date(),
      triggers: [],
      blocks: [],
      connections: [],
      variables: [],
      settings: {
        timeout: 300000,
        retryAttempts: 3,
        errorHandling: 'stop',
        logging: 'detailed',
      },
    };
    setCurrentFlow(demoFlow);
  };

  return (
    <div className="fixed inset-0 bg-background">
      {/* Хедер */}
      <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm ml-0 md:ml-64">
        <div className="flex items-center gap-4">
          <Link
            href="/agents"
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Workflow className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {t('flowBuilder.title')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('flowBuilder.subtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={createDemoFlow}
            className="text-primary border-primary/20 hover:bg-primary/10"
          >
            🚀 {t('flowBuilder.createDemo')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestFlow}
            disabled={!currentFlow}
            className="text-muted-foreground border-border hover:bg-muted"
          >
            <Play className="h-4 w-4 mr-2" />
            {t('flowBuilder.test')}
          </Button>
          <Button
            size="sm"
            onClick={handleSaveFlow}
            disabled={!currentFlow}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Save className="h-4 w-4 mr-2" />
            {t('flowBuilder.save')}
          </Button>
        </div>
      </div>

      {/* Основная область Flow Builder */}
      <div className="absolute inset-0 top-16 ml-0 md:ml-64 bg-background">
        <FlowCanvas flow={currentFlow} onFlowChange={setCurrentFlow} />
      </div>
    </div>
  );
}
