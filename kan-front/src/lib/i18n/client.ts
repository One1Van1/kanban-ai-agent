'use client';

import { translations } from './translations';
import { useEffect, useState } from 'react';

export function useTranslation() {
  const [locale, setLocale] = useState<'ru' | 'en'>('ru');

  useEffect(() => {
    // Получаем язык из localStorage или используем русский по умолчанию
    const savedLocale = localStorage.getItem('locale') as 'ru' | 'en';
    if (savedLocale) {
      setLocale(savedLocale);
    }
  }, []);

  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations[locale];

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        // Возвращаем ключ, если перевод не найден
        return key;
      }
    }

    return typeof result === 'string' ? result : key;
  };

  const switchLanguage = (newLocale: 'ru' | 'en') => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return { t, locale, switchLanguage };
}
