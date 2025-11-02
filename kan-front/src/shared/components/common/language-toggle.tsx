'use client';

import React from 'react';
import { Button } from '@/src/shared/components/ui/button';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/src/shared/i18n';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ru' ? 'en' : 'ru');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
    >
      <Globe className="w-4 h-4" />
      {language === 'ru' ? 'EN' : 'RU'}
    </Button>
  );
}
