'use client';

import React from 'react';
import { useLanguage } from '@/src/shared/i18n';
import { Button } from '@/src/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/shared/components/ui/dropdown-menu';
import { Languages, Check } from 'lucide-react';

const languages = [
  {
    code: 'en' as const,
    name: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'ru' as const,
    name: 'Русский',
    flag: '🇷🇺',
  },
];

interface LanguageSelectorProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  showText?: boolean;
}

export function LanguageSelector({
  variant = 'ghost',
  size = 'default',
  showText = false,
}: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage();

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          {currentLanguage ? (
            <>
              <span className="text-lg">{currentLanguage.flag}</span>
              {showText && (
                <span className="hidden sm:inline">{currentLanguage.name}</span>
              )}
            </>
          ) : (
            <>
              <Languages className="h-4 w-4" />
              {showText && (
                <span className="hidden sm:inline">{t('common.language')}</span>
              )}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
            {language === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
