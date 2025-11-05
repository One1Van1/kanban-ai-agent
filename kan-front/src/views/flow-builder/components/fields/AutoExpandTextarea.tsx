'use client';

import React, { useEffect, useRef } from 'react';

interface AutoExpandTextareaProps {
  /**
   * Current value
   */
  value?: string;

  /**
   * Default value (for uncontrolled)
   */
  defaultValue?: string;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Change handler
   */
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;

  /**
   * Click handler
   */
  onClick?: (e: React.MouseEvent<HTMLTextAreaElement>) => void;

  /**
   * CSS classes
   */
  className?: string;

  /**
   * Minimum number of rows
   */
  minRows?: number;

  /**
   * Maximum number of rows (optional)
   */
  maxRows?: number;

  /**
   * Ref for form registration
   */
  fieldRef?: (el: HTMLTextAreaElement | null) => void;

  /**
   * Is monospace font (for code)
   */
  monospace?: boolean;
}

/**
 * Auto-expanding textarea component
 * Automatically adjusts height based on content
 */
export function AutoExpandTextarea({
  value,
  defaultValue,
  placeholder,
  onChange,
  onClick,
  className = '',
  minRows = 1,
  maxRows,
  fieldRef,
  monospace = false,
}: AutoExpandTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand function
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get correct scrollHeight
    textarea.style.height = 'auto';

    // Calculate line height
    const styles = window.getComputedStyle(textarea);
    const lineHeight = parseInt(styles.lineHeight);
    const paddingTop = parseInt(styles.paddingTop);
    const paddingBottom = parseInt(styles.paddingBottom);

    // Calculate min and max heights
    const minHeight = lineHeight * minRows + paddingTop + paddingBottom;
    const maxHeight = maxRows
      ? lineHeight * maxRows + paddingTop + paddingBottom
      : Infinity;

    // Set new height
    const newHeight = Math.min(
      Math.max(textarea.scrollHeight, minHeight),
      maxHeight,
    );
    textarea.style.height = `${newHeight}px`;
  };

  // Adjust height on mount and when value changes
  useEffect(() => {
    adjustHeight();
  }, [value, defaultValue]);

  // Handle change with auto-expand
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    adjustHeight();
    onChange?.(e);
  };

  return (
    <textarea
      ref={(el) => {
        // @ts-ignore
        textareaRef.current = el;
        fieldRef?.(el);
      }}
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChange={handleChange}
      onClick={onClick}
      className={`w-full text-xs px-2 py-1 border rounded bg-background resize-none overflow-hidden focus:outline-none focus:ring-1 focus:ring-blue-500 ${
        monospace ? 'font-mono' : ''
      } ${className}`}
      rows={minRows}
      style={{
        minHeight: minRows ? `${minRows * 1.5}em` : undefined,
      }}
    />
  );
}
