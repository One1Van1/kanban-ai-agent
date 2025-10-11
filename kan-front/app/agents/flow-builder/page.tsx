'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Workflow, Play } from 'lucide-react';
import { Sidebar } from '@/components/ui/sidebar';
import { useTranslation } from '@/src/lib/i18n';

export default function FlowBuilderPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t('flowBuilder.title')} 🚀
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('flowBuilder.subtitle')}
            </p>
          </div>

          {/* Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">1</span>
                  {t('flowBuilder.steps.universal.title')}
                </CardTitle>
                <CardDescription>
                  {t('flowBuilder.steps.universal.description')}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">2</span>
                  {t('flowBuilder.steps.smartLogic.title')}
                </CardTitle>
                <CardDescription>
                  {t('flowBuilder.steps.smartLogic.description')}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">3</span>
                  {t('flowBuilder.steps.testDeploy.title')}
                </CardTitle>
                <CardDescription>
                  {t('flowBuilder.steps.testDeploy.description')}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Example Flow */}
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-xl">
                {t('flowBuilder.example.title')}
              </CardTitle>
              <CardDescription>
                {t('flowBuilder.example.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-6">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full dark:bg-green-900 dark:text-green-200">
                    📋 {t('flowBuilder.blocks.trigger')}
                  </div>
                  <span>→</span>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                    📁 {t('flowBuilder.blocks.extractFiles')}
                  </div>
                  <span>→</span>
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full dark:bg-yellow-900 dark:text-yellow-200">
                    �� {t('flowBuilder.blocks.condition')}
                  </div>
                  <span>→</span>
                  <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full dark:bg-purple-900 dark:text-purple-200">
                    🤖 {t('flowBuilder.blocks.aiAnalysis')}
                  </div>
                  <span>→</span>
                  <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full dark:bg-orange-900 dark:text-orange-200">
                    ⏱️ {t('flowBuilder.blocks.waitResponse')}
                  </div>
                  <span>→</span>
                  <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full dark:bg-purple-900 dark:text-purple-200">
                    📄 {t('flowBuilder.blocks.createReport')}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground mb-3">
                  <strong>{t('flowBuilder.example.flowLogic')}:</strong>{' '}
                  {t('flowBuilder.example.flowDescription')}
                </div>

                <div className="text-sm bg-blue-50 text-blue-700 p-3 rounded dark:bg-blue-900 dark:text-blue-200">
                  <strong>💡 {t('flowBuilder.example.compatibility')}:</strong>{' '}
                  {t('flowBuilder.example.supportedPlatforms')}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-border dark:from-purple-900 dark:to-pink-900">
            <CardContent className="p-8 text-center">
              <div className="max-w-md mx-auto">
                <Workflow className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {t('flowBuilder.comingSoon')} ��
                </h2>
                <p className="text-muted-foreground mb-6">
                  {t('flowBuilder.description')}
                </p>

                <div className="space-y-2 text-left text-sm text-foreground bg-background/50 rounded-lg p-4">
                  <div className="font-semibold mb-2">
                    {t('flowBuilder.features.title')}:
                  </div>
                  <div>✅ {t('flowBuilder.features.trigger')}</div>
                  <div>✅ {t('flowBuilder.features.contextExtraction')}</div>
                  <div>✅ {t('flowBuilder.features.conditionalLogic')}</div>
                  <div>✅ {t('flowBuilder.features.actionBlocks')}</div>
                  <div>✅ {t('flowBuilder.features.waitBlocks')}</div>
                  <div>⏳ {t('flowBuilder.features.visualCanvas')}</div>
                  <div>⏳ {t('flowBuilder.features.propertiesPanel')}</div>
                  <div>⏳ {t('flowBuilder.features.blockPalette')}</div>
                  <div>⏳ {t('flowBuilder.features.flowTesting')}</div>
                </div>

                <Button className="mt-6" disabled>
                  <Play className="w-4 h-4 mr-2" />
                  {t('flowBuilder.launchBuilder')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Technical Implementation Status */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              💡 <strong>{t('flowBuilder.technicalNote')}:</strong>{' '}
              {t('flowBuilder.technicalStatus')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
