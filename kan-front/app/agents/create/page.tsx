'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/src/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/shared/components/ui/card';
import { Input } from '@/src/shared/components/ui/input';
import { Label } from '@/src/shared/components/ui/label';
import { Textarea } from '@/src/shared/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/ui/select';
import { useAgentsStore } from '@/src/features/agents/stores/agents.store';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/src/shared/i18n';

export default function CreateAgentPage() {
  const router = useRouter();
  const { createAgent, isLoading } = useAgentsStore();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructions: '',
    model: 'claude-3-haiku-20240307',
    temperature: 0.7,
    maxTokens: 1000,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('createAgent.validation.nameRequired');
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = t('createAgent.validation.instructionsRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const agentData = {
        ...formData,
        userId: 'system',
      };
      await createAgent(agentData);
      toast.success(t('createAgent.messages.success'));
      router.push('/agents');
    } catch (error: any) {
      toast.error(error.message || t('createAgent.messages.error'));
    }
  };

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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t('createAgent.form.name')} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('createAgent.form.namePlaceholder')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  {t('createAgent.form.agentDescription')}
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
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
                  onChange={(e) =>
                    handleInputChange('instructions', e.target.value)
                  }
                  placeholder={t('createAgent.form.instructionsPlaceholder')}
                  rows={6}
                  className={errors.instructions ? 'border-red-500' : ''}
                />
                {errors.instructions && (
                  <p className="text-sm text-red-600">{errors.instructions}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="model">{t('createAgent.form.model')}</Label>
                  <Select
                    value={formData.model}
                    onValueChange={(value) => handleInputChange('model', value)}
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
                      <SelectItem value="gpt-3.5-turbo">
                        GPT-3.5 Turbo
                      </SelectItem>
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
                    onChange={(e) =>
                      handleInputChange('temperature', e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxTokens">
                  {t('createAgent.form.maxTokens')}
                </Label>
                <Input
                  id="maxTokens"
                  type="number"
                  min="100"
                  max="4000"
                  value={formData.maxTokens}
                  onChange={(e) =>
                    handleInputChange('maxTokens', e.target.value)
                  }
                />
              </div>

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
