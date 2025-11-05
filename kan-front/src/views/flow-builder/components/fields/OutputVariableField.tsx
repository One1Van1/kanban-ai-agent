'use client';

import React from 'react';
import { useLanguage } from '@/src/shared/i18n';
import { Save } from 'lucide-react';

interface OutputVariableFieldProps {
  /**
   * Current value of the output variable
   */
  value?: string;

  /**
   * Callback when value changes
   */
  onChange: (value: string) => void;

  /**
   * Placeholder text (optional, defaults to translation)
   */
  placeholder?: string;

  /**
   * Show hint text below field
   */
  showHint?: boolean;

  /**
   * Custom hint text (optional)
   */
  hintText?: string;

  /**
   * Ref for form registration (for useBlockEdit hook)
   */
  fieldRef?: (el: HTMLInputElement | null) => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Universal component for output variable input field
 * Used across all block types to maintain consistency
 */
export function OutputVariableField({
  value,
  onChange,
  placeholder,
  showHint = true,
  hintText,
  fieldRef,
  className = '',
}: OutputVariableFieldProps) {
  const { t } = useLanguage();

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Separator */}
      <div className="border-t pt-2 mt-2" />

      {/* Label */}
      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
        <Save className="w-3 h-3" />
        <span>{t('flowBuilder.fields.saveToVariable')}</span>
      </label>

      {/* Input Field */}
      <input
        type="text"
        defaultValue={value || ''}
        placeholder={
          placeholder || t('flowBuilder.fields.outputVariablePlaceholder')
        }
        className="w-full text-xs px-2 py-1 border rounded bg-background focus:outline-none focus:ring-1 focus:ring-blue-500"
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        ref={fieldRef}
      />

      {/* Hint Text */}
      {showHint && (
        <p className="text-[10px] text-muted-foreground italic">
          {hintText || t('flowBuilder.fields.outputVariableHint')}
        </p>
      )}
    </div>
  );
}

/**
 * Display component for showing output variable in preview mode
 */
interface OutputVariableDisplayProps {
  value?: string;
  className?: string;
}

export function OutputVariableDisplay({
  value,
  className = '',
}: OutputVariableDisplayProps) {
  const { t } = useLanguage();

  if (!value) return null;

  return (
    <div
      className={`text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1 ${className}`}
    >
      <Save className="w-3 h-3" />
      <span>→ {value}</span>
    </div>
  );
}
