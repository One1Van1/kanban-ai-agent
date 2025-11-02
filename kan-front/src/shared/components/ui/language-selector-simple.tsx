'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function LanguageSelector() {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ru' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-1 px-2"
    >
      <span className="text-sm">{language === 'en' ? '🇺🇸' : '🇷🇺'}</span>
      <span className="text-xs hidden sm:inline">
        {language === 'en' ? 'EN' : 'RU'}
      </span>
    </Button>
  );
}
