'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAgentsStore } from '@/src/features/agents/stores/agents.store';
import { toast } from 'sonner';
import { useTranslation } from '@/src/shared/i18n';

interface FormData {
  name: string;
  description: string;
  instructions: string;
  model: string;
  temperature: number;
  maxTokens: number;
  isActive: boolean;
}

export function useAgentCreate() {
  const router = useRouter();
  const { createAgent, isLoading } = useAgentsStore();
  const { t } = useTranslation();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    instructions: '',
    model: 'claude-3-haiku-20240307',
    temperature: 0.7,
    maxTokens: 1000,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | number) => {
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

  return {
    formData,
    errors,
    isLoading,
    handleInputChange,
    handleSubmit,
  };
}
