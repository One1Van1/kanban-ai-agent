'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/src/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/shared/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { useTranslation } from '@/src/shared/i18n';
import { BasicInfoSection } from './BasicInfoSection';
import { ModelConfigSection } from './ModelConfigSection';

interface AgentCreateFormProps {
  formData: any;
  errors: Record<string, string>;
  isLoading: boolean;
  onInputChange: (field: string, value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AgentCreateForm({
  formData,
  errors,
  isLoading,
  onInputChange,
  onSubmit,
}: AgentCreateFormProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-full">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/agents">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('createAgent.backToAgents')}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            {t('createAgent.title')}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t('createAgent.subtitle')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('createAgent.form.title')}</CardTitle>
            <CardDescription>
              {t('createAgent.form.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              <BasicInfoSection
                formData={formData}
                errors={errors}
                onInputChange={onInputChange}
              />

              <ModelConfigSection
                formData={formData}
                onInputChange={onInputChange}
              />

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading
                    ? t('createAgent.form.creating')
                    : t('createAgent.form.createAgent')}
                </Button>
                <Link href="/agents">
                  <Button type="button" variant="outline">
                    {t('createAgent.form.cancel')}
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
