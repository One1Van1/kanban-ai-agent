'use client';

import React from 'react';
import { Input } from '@/src/shared/components/ui/input';
import { Label } from '@/src/shared/components/ui/label';
import { Textarea } from '@/src/shared/components/ui/textarea';
import { useTranslation } from '@/src/shared/i18n';

interface BasicInfoSectionProps {
  formData: {
    name: string;
    description: string;
    instructions: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
}

export function BasicInfoSection({
  formData,
  errors,
  onInputChange,
}: BasicInfoSectionProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">{t('createAgent.form.name')} *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          placeholder={t('createAgent.form.namePlaceholder')}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          {t('createAgent.form.agentDescription')}
        </Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder={t('createAgent.form.descriptionPlaceholder')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">
          {t('createAgent.form.instructions')} *
        </Label>
        <Textarea
          id="instructions"
          value={formData.instructions}
          onChange={(e) => onInputChange('instructions', e.target.value)}
          placeholder={t('createAgent.form.instructionsPlaceholder')}
          rows={6}
          className={errors.instructions ? 'border-red-500' : ''}
        />
        {errors.instructions && (
          <p className="text-sm text-red-600">{errors.instructions}</p>
        )}
      </div>
    </>
  );
}
