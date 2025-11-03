'use client';

import React from 'react';
import { Input } from '@/src/shared/components/ui/input';
import { Label } from '@/src/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/ui/select';
import { useTranslation } from '@/src/shared/i18n';

interface ModelConfigSectionProps {
  formData: {
    model: string;
    temperature: number;
    maxTokens: number;
  };
  onInputChange: (field: string, value: string | number) => void;
}

export function ModelConfigSection({
  formData,
  onInputChange,
}: ModelConfigSectionProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="model">{t('createAgent.form.model')}</Label>
          <Select
            value={formData.model}
            onValueChange={(value) => onInputChange('model', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="claude-3-haiku-20240307">
                Claude 3 Haiku
              </SelectItem>
              <SelectItem value="claude-3-sonnet-20240229">
                Claude 3 Sonnet
              </SelectItem>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="temperature">
            {t('createAgent.form.temperature')}
          </Label>
          <Input
            id="temperature"
            type="number"
            min="0"
            max="1"
            step="0.1"
            value={formData.temperature}
            onChange={(e) => onInputChange('temperature', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxTokens">{t('createAgent.form.maxTokens')}</Label>
        <Input
          id="maxTokens"
          type="number"
          min="100"
          max="4000"
          value={formData.maxTokens}
          onChange={(e) => onInputChange('maxTokens', e.target.value)}
        />
      </div>
    </>
  );
}
