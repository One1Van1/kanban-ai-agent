'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Zap,
  GitBranch,
  Database,
  FileText,
  Archive,
  Variable,
  MessageSquare,
  Brain,
  Paperclip,
  Bell,
  Clock,
  Timer,
  CheckCircle,
  RotateCcw,
  AlertTriangle,
  Plus,
  Globe,
  Calendar,
  Settings,
  Move,
  FileUp,
  Send,
  Edit,
  ExternalLink,
} from 'lucide-react';
import { useTranslation } from '../../../lib/i18n';

interface BlockPaletteProps {
  onAddBlock: (blockType: string, blockCategory: string) => void;
}

// Полная таблица конвертации Tailwind классов в CSS стили
const tailwindToCSS = {
  // Размеры и отступы
  'w-72': 'width: 288px',
  'w-16': 'width: 64px',
  'h-16': 'height: 64px',
  'w-4': 'width: 16px',
  'h-4': 'height: 16px',
  'w-3': 'width: 12px',
  'h-3': 'height: 12px',
  'p-4': 'padding: 16px',
  'p-2': 'padding: 8px',
  'pb-2': 'padding-bottom: 8px',
  'pt-0': 'padding-top: 0',
  'px-2': 'padding-left: 8px; padding-right: 8px',
  'py-1': 'padding-top: 4px; padding-bottom: 4px',
  'mb-2': 'margin-bottom: 8px',
  'mb-1': 'margin-bottom: 4px',
  'mt-1': 'margin-top: 4px',
  'gap-2': 'gap: 8px',

  // Цвета фона
  'bg-green-50': 'background-color: #f0fdf4',
  'bg-green-100': 'background-color: #dcfce7',
  'bg-green-500': 'background-color: #10b981',
  'bg-blue-50': 'background-color: #eff6ff',
  'bg-blue-100': 'background-color: #dbeafe',
  'bg-blue-500': 'background-color: #3b82f6',
  'bg-yellow-50': 'background-color: #fefce8',
  'bg-yellow-100': 'background-color: #fef3c7',
  'bg-yellow-500': 'background-color: #eab308',
  'bg-purple-50': 'background-color: #faf5ff',
  'bg-purple-100': 'background-color: #f3e8ff',
  'bg-purple-500': 'background-color: #a855f7',
  'bg-orange-50': 'background-color: #fff7ed',
  'bg-orange-100': 'background-color: #ffedd5',
  'bg-orange-500': 'background-color: #f97316',

  // Цвета границ
  'border-green-200': 'border-color: #bbf7d0',
  'border-blue-200': 'border-color: #bfdbfe',
  'border-yellow-200': 'border-color: #fef08a',
  'border-purple-200': 'border-color: #e9d5ff',
  'border-orange-200': 'border-color: #fed7aa',
  'border-white': 'border-color: white',
  'border-2': 'border-width: 2px',

  // Цвета текста
  'text-green-800': 'color: #166534',
  'text-blue-800': 'color: #1e40af',
  'text-yellow-800': 'color: #a16207',
  'text-purple-800': 'color: #7c2d12',
  'text-orange-800': 'color: #c2410c',
  'text-muted-foreground': 'color: #6b7280',
  'text-xs': 'font-size: 12px',
  'text-sm': 'font-size: 14px',

  // Скругления и тени
  'rounded-lg': 'border-radius: 8px',
  rounded: 'border-radius: 4px',
  'rounded-full': 'border-radius: 50%',
  'shadow-sm': 'box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  'shadow-md':
    'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  'shadow-lg':
    'box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',

  // Флексбокс и позиционирование
  flex: 'display: flex',
  'flex-1': 'flex: 1 1 0%',
  'flex-shrink-0': 'flex-shrink: 0',
  'items-start': 'align-items: flex-start',
  'items-center': 'align-items: center',
  'justify-center': 'justify-content: center',
  'min-w-0': 'min-width: 0',
  'max-w-[120px]': 'max-width: 120px',
  'text-center': 'text-align: center',
  'whitespace-normal': 'white-space: normal',
  'line-height-tight': 'line-height: 1.2',
  truncate: 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap',

  // Состояния
  'transition-all': 'transition: all 0.2s',
  'hover:shadow-md': '', // Убираем hover эффекты для drag preview

  // Типография
  'font-medium': 'font-weight: 500',
  'font-semibold': 'font-weight: 600',
  'leading-tight': 'line-height: 1.25',
};

// Функция конвертации строки Tailwind классов в CSS стили
const convertTailwindToCSS = (classNames: string): string => {
  return classNames
    .split(' ')
    .map(
      (className) =>
        tailwindToCSS[className as keyof typeof tailwindToCSS] || '',
    )
    .filter(Boolean)
    .join('; ');
};

// Создание pixel-perfect preview блока для drag & drop
const createBlockPreview = (blockType: string, blockCategory: string) => {
  console.log('🎨 createBlockPreview called:', { blockType, blockCategory });

  // Получаем информацию о блоке
  const blockInfo = getBlockInfo(blockType, blockCategory);
  const mockConfig = getDefaultBlockConfig(blockType);

  console.log('📦 Block info:', blockInfo);

  // Создаем основной контейнер - Card wrapper
  const cardDiv = document.createElement('div');

  // Точные размеры и позиционирование (280px как в FlowCanvas getSmartPosition)
  cardDiv.style.cssText = `
    position: absolute;
    top: -2000px;
    left: -2000px;
    width: 280px;
    min-height: 120px;
    font-family: system-ui, -apple-system, sans-serif;
    pointer-events: none;
    z-index: 10000;
    visibility: visible;
    opacity: 1;
  `;

  // Создаем Card элемент с точными стилями
  const card = document.createElement('div');

  // Цвета и стили точно как в React компонентах
  const categoryStyles = {
    trigger: {
      background: '#f0fdf4', // bg-green-50
      borderColor: '#bbf7d0', // border-green-200
      textColor: '#166534', // text-green-800
      handleColor: '#10b981', // bg-green-500
    },
    context: {
      background: '#eff6ff', // bg-blue-50
      borderColor: '#bfdbfe', // border-blue-200
      textColor: '#1e40af', // text-blue-800
      handleColor: '#3b82f6', // bg-blue-500
    },
    logic: {
      background: '#fefce8', // bg-yellow-50
      borderColor: '#fef08a', // border-yellow-200
      textColor: '#a16207', // text-yellow-800
      handleColor: '#eab308', // bg-yellow-500
    },
    action: {
      background: '#faf5ff', // bg-purple-50
      borderColor: '#e9d5ff', // border-purple-200
      textColor: '#7c2d12', // text-purple-800
      handleColor: '#a855f7', // bg-purple-500
    },
    wait: {
      background: '#fff7ed', // bg-orange-50
      borderColor: '#fed7aa', // border-orange-200
      textColor: '#c2410c', // text-orange-800
      handleColor: '#f97316', // bg-orange-500
    },
  };

  const style = categoryStyles[blockCategory as keyof typeof categoryStyles];

  card.style.cssText = `
    position: relative;
    width: 100%;
    background: ${style.background};
    border: 1px solid ${style.borderColor};
    color: ${style.textColor};
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: all 0.2s;
  `;

  // Добавляем handles с точным позиционированием
  if (blockCategory !== 'trigger') {
    const topHandle = document.createElement('div');
    topHandle.style.cssText = `
      position: absolute;
      top: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 12px;
      height: 12px;
      background: ${style.handleColor};
      border: 2px solid white;
      border-radius: 50%;
      z-index: 10;
    `;
    card.appendChild(topHandle);
  }

  const bottomHandle = document.createElement('div');
  bottomHandle.style.cssText = `
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 12px;
    background: ${style.handleColor};
    border: 2px solid white;
    border-radius: 50%;
    z-index: 10;
  `;
  card.appendChild(bottomHandle);

  // CardHeader - точная копия структуры
  const cardHeader = document.createElement('div');
  cardHeader.style.cssText = `
    padding: 16px 16px 8px 16px;
  `;

  const cardTitle = document.createElement('div');
  cardTitle.style.cssText = `
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.2;
  `;

  // Иконка блока (пока заглушка, потом добавим SVG)
  const iconDiv = document.createElement('div');
  iconDiv.style.cssText = `
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    margin-top: 1px;
  `;
  iconDiv.innerHTML = getIconSVG(blockType); // Добавим функцию для SVG иконок

  // Название категории
  const categorySpan = document.createElement('span');
  categorySpan.style.cssText = `
    flex: 1;
    min-width: 0;
    font-weight: 500;
    color: inherit;
  `;
  categorySpan.textContent = blockInfo.categoryName;

  // Badge с названием блока
  const badge = document.createElement('span');
  badge.style.cssText = `
    background: #f4f4f5;
    color: #71717a;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    max-width: 120px;
    text-align: center;
    white-space: normal;
    line-height: 1.2;
  `;
  badge.textContent = blockInfo.name;

  cardTitle.appendChild(iconDiv);
  cardTitle.appendChild(categorySpan);
  cardTitle.appendChild(badge);
  cardHeader.appendChild(cardTitle);

  // CardContent - содержимое блока
  const cardContent = document.createElement('div');
  cardContent.style.cssText = `
    padding: 0 16px 16px 16px;
  `;

  // Название блока
  const blockName = document.createElement('div');
  blockName.style.cssText = `
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 8px;
    color: inherit;
  `;
  blockName.textContent = blockInfo.name;

  // Конфигурация блока
  const configDiv = document.createElement('div');
  configDiv.style.cssText = `
    font-size: 12px;
    color: #6b7280;
    line-height: 1.4;
  `;
  configDiv.innerHTML = getConfigTextSimple(blockType, mockConfig).replace(
    /\n/g,
    '<br>',
  );

  cardContent.appendChild(blockName);
  cardContent.appendChild(configDiv);

  // Собираем всё вместе
  card.appendChild(cardHeader);
  card.appendChild(cardContent);
  cardDiv.appendChild(card);

  document.body.appendChild(cardDiv);
  return cardDiv;
};

// ТОЧНАЯ КОПИЯ структуры блоков с канваса
const createExactBlockPreview = (blockType: string, blockCategory: string) => {
  console.log('🎯 EXACT createBlockPreview called:', {
    blockType,
    blockCategory,
  });

  const blockInfo = getBlockInfo(blockType, blockCategory);
  const mockConfig = getDefaultBlockConfig(blockType);

  // Создаем точно такую же структуру как Card компонент
  const card = document.createElement('div');

  // Применяем CSS классы напрямую как у настоящих блоков
  let className = 'w-72 shadow-sm transition-all border rounded-lg';
  switch (blockCategory) {
    case 'trigger':
      className +=
        ' bg-green-50 border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-800 dark:text-green-200';
      break;
    case 'context':
      className +=
        ' bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/20 dark:border-blue-800 dark:text-blue-200';
      break;
    case 'logic':
      className +=
        ' bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/20 dark:border-yellow-800 dark:text-yellow-200';
      break;
    case 'action':
      className +=
        ' bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-950/20 dark:border-purple-800 dark:text-purple-200';
      break;
    case 'wait':
      className +=
        ' bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950/20 dark:border-orange-800 dark:text-orange-200';
      break;
  }

  card.className = className;

  // Применяем базовые CSS стили
  card.style.cssText = `
    position: absolute;
    top: -1000px;
    left: -1000px;
    width: 288px;
    min-height: 120px;
    pointer-events: none;
    z-index: 10000;
    font-family: system-ui, -apple-system, sans-serif;
  `;

  // HTML структура как у React компонентов
  const iconSVG = getIconSVG(blockType);
  const handleColorStyle = getHandleColorStyle(blockCategory);

  card.innerHTML = `
    <!-- CardHeader -->
    <div style="padding: 24px 24px 8px 24px;">
      <div style="display: flex; align-items: flex-start; gap: 8px; font-size: 14px; font-weight: 600;">
        <div style="width: 16px; height: 16px;">
          ${iconSVG}
        </div>
        <span style="flex: 1; min-width: 0;">
          ${blockInfo.categoryName}
        </span>
        <span style="
          background: #f4f4f5;
          color: #71717a;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          max-width: 120px;
          text-align: center;
          line-height: 1.2;
        ">
          ${blockInfo.name}
        </span>
      </div>
    </div>
    
    <!-- CardContent -->
    <div style="padding: 0 24px 24px 24px;">
      <div style="font-size: 12px; font-weight: 500; margin-bottom: 8px;">
        ${blockInfo.name}
      </div>
      ${
        mockConfig?.boardType
          ? `
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
          Board: ${mockConfig.boardType.toUpperCase()}
        </div>
      `
          : ''
      }
      ${
        mockConfig?.event
          ? `
        <div style="font-size: 12px; color: #6b7280;">
          Event: ${mockConfig.event.replace('_', ' ')}
        </div>
      `
          : ''
      }
    </div>
    
    <!-- Handles -->
    ${
      blockCategory !== 'trigger'
        ? `
      <div style="
        position: absolute;
        top: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;
        ${handleColorStyle}
      "></div>
    `
        : ''
    }
    
    <div style="
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid white;
      ${handleColorStyle}
    "></div>
  `;

  document.body.appendChild(card);
  console.log('✅ EXACT Preview element created!');
  return card;
};

// Помощники для стилей
const getCategoryStyles = (category: string) => {
  const styles = {
    trigger:
      'background-color: #f0fdf4; border-color: #bbf7d0; color: #166534;',
    context:
      'background-color: #eff6ff; border-color: #bfdbfe; color: #1e40af;',
    logic: 'background-color: #fefce8; border-color: #fef08a; color: #a16207;',
    action: 'background-color: #faf5ff; border-color: #e9d5ff; color: #7c2d12;',
    wait: 'background-color: #fff7ed; border-color: #fed7aa; color: #c2410c;',
  };
  return styles[category as keyof typeof styles] || styles.trigger;
};

const getHandleColorStyle = (category: string) => {
  const colors = {
    trigger: 'background-color: #10b981;',
    context: 'background-color: #3b82f6;',
    logic: 'background-color: #eab308;',
    action: 'background-color: #a855f7;',
    wait: 'background-color: #f97316;',
  };
  return colors[category as keyof typeof colors] || colors.trigger;
};

// НОВАЯ УПРОЩЁННАЯ ВЕРСИЯ - для тестирования
const createSimpleBlockPreview = (blockType: string, blockCategory: string) => {
  console.log('🚀 SIMPLE createBlockPreview called:', {
    blockType,
    blockCategory,
  });

  const blockInfo = getBlockInfo(blockType, blockCategory);

  // Цвета по категориям
  const categoryColors = {
    trigger: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534' },
    context: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af' },
    logic: { bg: '#fefce8', border: '#fef08a', text: '#a16207' },
    action: { bg: '#faf5ff', border: '#e9d5ff', text: '#7c2d12' },
    wait: { bg: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
  };

  const colors =
    categoryColors[blockCategory as keyof typeof categoryColors] ||
    categoryColors.trigger;

  // Создаем простой div
  const div = document.createElement('div');
  div.style.cssText = `
    position: absolute;
    top: -1000px;
    left: -1000px;
    width: 280px;
    height: 120px;
    background: ${colors.bg};
    border: 2px solid ${colors.border};
    border-radius: 8px;
    color: ${colors.text};
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    font-weight: 600;
    padding: 16px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    pointer-events: none;
    z-index: 10000;
  `;

  div.innerHTML = `
    <div style="margin-bottom: 8px; font-size: 16px;">
      ${blockInfo.categoryName}
    </div>
    <div style="font-size: 12px; opacity: 0.8;">
      ${blockInfo.name}
    </div>
  `;

  document.body.appendChild(div);
  console.log('✅ SIMPLE Preview element created!');
  return div;
};

// Рендер конфигурации блока как в настоящих блоках
const renderBlockConfig = (blockType: string, config: any) => {
  switch (blockType) {
    case 'board_move':
    case 'board_create':
      return (
        <>
          {config?.boardType && (
            <div className="text-xs text-muted-foreground mb-1">
              Board: {config.boardType.toUpperCase()}
            </div>
          )}
          {config?.targetColumn && (
            <div className="text-xs text-muted-foreground mb-1">
              Column: {config.targetColumn}
            </div>
          )}
          {config?.event && (
            <div className="text-xs text-muted-foreground">
              Event: {config.event.replace('_', ' ')}
            </div>
          )}
        </>
      );

    case 'comment':
      return (
        config?.commentText && (
          <div className="text-xs text-muted-foreground truncate">
            "{config.commentText}"
          </div>
        )
      );

    case 'ai_request':
      return (
        <>
          {config?.aiModel && (
            <div className="text-xs text-muted-foreground mb-1">
              Model: {config.aiModel.toUpperCase()}
            </div>
          )}
          {config?.prompt && (
            <div className="text-xs text-muted-foreground truncate">
              Prompt: "{config.prompt}"
            </div>
          )}
        </>
      );

    case 'extract_files':
      return (
        <>
          {config?.variableName && (
            <div className="text-xs text-muted-foreground mb-1">
              Variable: {config.variableName}
            </div>
          )}
          {config?.source && (
            <div className="text-xs text-muted-foreground">
              Source: {config.source.replace('_', ' ')}
            </div>
          )}
        </>
      );

    case 'wait_response':
      return (
        <>
          {config?.waitFor && (
            <div className="text-xs text-muted-foreground mb-1">
              Wait for: {config.waitFor.replace('_', ' ')}
            </div>
          )}
          {config?.timeout && (
            <div className="text-xs text-muted-foreground">
              Timeout: {Math.round(config.timeout / 1000)}s
            </div>
          )}
        </>
      );

    default:
      return (
        <div className="text-xs text-muted-foreground">
          Configure {getBlockDisplayName(blockType).toLowerCase()} settings
        </div>
      );
  }
};

// Получение конфигурации по умолчанию для preview
const getDefaultBlockConfig = (blockType: string) => {
  switch (blockType) {
    case 'board_move':
      return {
        boardType: 'jira',
        event: 'card_moved',
        targetColumn: 'In Progress',
      };
    case 'board_create':
      return {
        boardType: 'jira',
        event: 'card_created',
      };
    case 'comment':
      return {
        commentText: 'Add your comment here',
      };
    case 'ai_request':
      return {
        aiModel: 'claude',
        prompt: 'Analyze the task',
      };
    case 'extract_files':
      return {
        variableName: 'files',
        source: 'card_attachments',
      };
    case 'wait_response':
      return {
        waitFor: 'ai_response',
        timeout: 300000,
      };
    default:
      return {};
  }
};

// Получение SVG иконок для drag preview
const getIconSVG = (blockType: string): string => {
  const iconSVGs = {
    // Triggers
    board_move: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="m18 9 2.5-2.5L18 4l-2.5 2.5L18 9z"/><path d="m6.5 15.5 2.5-2.5L6.5 10.5 4 13l2.5 2.5z"/></svg>`,
    board_create: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
    board_update: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
    webhook: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12l4 4 4-4"/><path d="M16 8l-4 4-4-4"/></svg>`,
    schedule: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,

    // Context
    extract_files: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/></svg>`,
    get_card_data: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M5 12c0 1.66 3.13 3 7 3s7-1.34 7-3"/><path d="M5 17c0 1.66 3.13 3 7 3s7-1.34 7-3"/><path d="M5 7v10"/><path d="M19 7v10"/></svg>`,
    set_variable: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/></svg>`,

    // Logic
    if_else: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="m18 9 2.5-2.5L18 4l-2.5 2.5L18 9z"/></svg>`,
    switch: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6"/><path d="m15.5 3.5-1.5 1.5"/><path d="m10 8.5-1.5 1.5"/><path d="m15.5 20.5-1.5-1.5"/><path d="m10 15.5-1.5-1.5"/><path d="m20.5 15.5-1.5-1.5"/></svg>`,
    loop: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 0 1 2.828 0L22 4.828a2 2 0 0 1 0 2.828L11.828 18H9v-2.828l10.586-10.586z"/></svg>`,
    try_catch: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,

    // Actions
    comment: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    ai_request: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>`,
    create_file: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/><line x1="12" x2="12" y1="18" y2="12"/><line x1="9" x2="15" y1="15" y2="15"/></svg>`,
    attach_file: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`,
    send_notification: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
    move_card: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="22"/></svg>`,
    update_field: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
    api_call: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>`,

    // Wait
    wait_response: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>`,
    wait_time: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>`,
    wait_condition: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>`,
    wait_timeout: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>`,
  };

  return (
    iconSVGs[blockType as keyof typeof iconSVGs] ||
    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9l4-6z"/></svg>`
  );
};

// Получение простого текста конфигурации для canvas
const getConfigTextSimple = (blockType: string, config: any) => {
  switch (blockType) {
    case 'board_move':
    case 'board_create':
      return `Board: ${config?.boardType?.toUpperCase() || 'JIRA'}\nEvent: ${config?.event?.replace('_', ' ') || 'card moved'}`;

    case 'comment':
      return `"${config?.commentText || 'Add your comment here'}"`;

    case 'ai_request':
      return `Model: ${config?.aiModel?.toUpperCase() || 'CLAUDE'}\nPrompt: "${config?.prompt || 'Analyze the task'}"`;

    case 'extract_files':
      return `Variable: ${config?.variableName || 'files'}\nSource: ${config?.source?.replace('_', ' ') || 'card attachments'}`;

    case 'wait_response':
      return `Wait for: ${config?.waitFor?.replace('_', ' ') || 'ai response'}\nTimeout: ${config?.timeout ? Math.round(config.timeout / 1000) : 300}s`;

    default:
      return `Configure ${getBlockDisplayName(blockType).toLowerCase()} settings`;
  }
};

// Получение цвета handle для HTML
const getHandleColor = (blockCategory: string) => {
  const colors = {
    trigger: '#10b981',
    context: '#3b82f6',
    logic: '#eab308',
    action: '#a855f7',
    wait: '#f97316',
  };
  return colors[blockCategory as keyof typeof colors] || '#6b7280';
};

// Получение текста конфигурации для HTML
const getConfigText = (blockType: string, config: any) => {
  switch (blockType) {
    case 'board_move':
    case 'board_create':
      return `Board: ${config?.boardType?.toUpperCase() || 'JIRA'}<br>
              ${config?.targetColumn ? `Column: ${config.targetColumn}<br>` : ''}
              Event: ${config?.event?.replace('_', ' ') || 'card moved'}`;

    case 'comment':
      return `"${config?.commentText || 'Add your comment here'}"`;

    case 'ai_request':
      return `Model: ${config?.aiModel?.toUpperCase() || 'CLAUDE'}<br>
              Prompt: "${config?.prompt || 'Analyze the task'}"`;

    case 'extract_files':
      return `Variable: ${config?.variableName || 'files'}<br>
              Source: ${config?.source?.replace('_', ' ') || 'card attachments'}`;

    case 'wait_response':
      return `Wait for: ${config?.waitFor?.replace('_', ' ') || 'ai response'}<br>
              Timeout: ${config?.timeout ? Math.round(config.timeout / 1000) : 300}s`;

    default:
      return `Configure ${getBlockDisplayName(blockType).toLowerCase()} settings`;
  }
};

// Получение информации о блоке для preview
const getBlockInfo = (blockType: string, blockCategory: string) => {
  const categoryColors = {
    trigger:
      'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-800 dark:text-green-200',
    context:
      'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/20 dark:border-blue-800 dark:text-blue-200',
    logic:
      'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/20 dark:border-yellow-800 dark:text-yellow-200',
    action:
      'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-950/20 dark:border-purple-800 dark:text-purple-200',
    wait: 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950/20 dark:border-orange-800 dark:text-orange-200',
  };

  const handleColors = {
    trigger: 'bg-green-500',
    context: 'bg-blue-500',
    logic: 'bg-yellow-500',
    action: 'bg-purple-500',
    wait: 'bg-orange-500',
  };

  const categoryNames = {
    trigger: 'Trigger',
    context: 'Context',
    logic: 'Logic',
    action: 'Action',
    wait: 'Wait',
  };

  const blockIcons = {
    // Triggers
    board_move: GitBranch,
    board_create: Plus,
    webhook: Globe,
    schedule: Calendar,

    // Context
    extract_files: FileText,
    get_card_data: Database,
    set_variable: Variable,

    // Logic
    if_else: GitBranch,
    switch: Settings,
    loop: RotateCcw,
    try_catch: AlertTriangle,

    // Actions
    comment: MessageSquare,
    ai_request: Brain,
    move_card: Move,
    create_file: FileUp,
    send_notification: Send,
    update_field: Edit,
    api_call: ExternalLink,

    // Wait
    wait_response: Clock,
    wait_timeout: Timer,
    wait_condition: CheckCircle,
  };

  return {
    name: getBlockDisplayName(blockType),
    categoryName: categoryNames[blockCategory as keyof typeof categoryNames],
    colorClass: categoryColors[blockCategory as keyof typeof categoryColors],
    handleColor: handleColors[blockCategory as keyof typeof handleColors],
    icon: blockIcons[blockType as keyof typeof blockIcons] || Zap,
    description: `Configure ${getBlockDisplayName(blockType)} settings`,
  };
};

// Получение правильного названия блока для drag image
const getBlockDisplayName = (blockType: string) => {
  const blockNames = {
    // Triggers
    board_move: 'Board Move',
    board_create: 'Board Create',
    board_update: 'Board Update',
    webhook: 'Webhook',
    schedule: 'Schedule',

    // Context
    extract_files: 'Extract Files',
    get_card_data: 'Get Card Data',
    set_variable: 'Set Variable',

    // Logic
    if_else: 'If/Else',
    switch: 'Switch',
    loop: 'Loop',
    try_catch: 'Try/Catch',

    // Actions
    comment: 'Add Comment',
    ai_request: 'AI Request',
    create_file: 'Create File',
    move_card: 'Move Card',
    send_notification: 'Send Notification',
    update_field: 'Update Field',
    api_call: 'API Call',

    // Wait
    wait_response: 'Wait Response',
    wait_timeout: 'Wait Timeout',
    wait_condition: 'Wait Condition',
  };

  return (
    blockNames[blockType as keyof typeof blockNames] ||
    blockType.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

// Обработчики drag & drop для блоков
const handleDragStart = (
  event: React.DragEvent,
  blockType: string,
  blockCategory: string,
) => {
  event.dataTransfer.setData(
    'application/reactflow',
    JSON.stringify({ blockType, blockCategory }),
  );
  event.dataTransfer.effectAllowed = 'copy';

  // Создаем реальный блок preview СИНХРОННО
  const previewElement = createExactBlockPreview(blockType, blockCategory);

  // Устанавливаем drag image сразу (синхронно)
  if (previewElement) {
    event.dataTransfer.setDragImage(previewElement, 144, 70);
  }

  // Очищаем preview после drag
  setTimeout(() => {
    if (document.body.contains(previewElement)) {
      document.body.removeChild(previewElement);
    }
  }, 1000);

  // Добавляем визуальный эффект при драге
  const target = event.currentTarget as HTMLElement;
  target.style.opacity = '0.5';
  target.style.transform = 'scale(0.95)';
  target.style.transition = 'all 0.2s ease';
};

const handleDragEnd = (event: React.DragEvent) => {
  const target = event.currentTarget as HTMLElement;
  target.style.opacity = '1';
  target.style.transform = 'scale(1)';
  target.style.transition = 'all 0.2s ease';
};

interface PaletteBlock {
  type: string;
  category: 'trigger' | 'context' | 'logic' | 'action' | 'wait';
  icon: React.ReactNode;
  color: string;
}

const PALETTE_BLOCKS: PaletteBlock[] = [
  // Triggers
  {
    type: 'board_move',
    category: 'trigger',
    icon: <GitBranch className="w-4 h-4" />,
    color: 'text-green-600',
  },
  {
    type: 'board_create',
    category: 'trigger',
    icon: <Plus className="w-4 h-4" />,
    color: 'text-green-600',
  },
  {
    type: 'webhook',
    category: 'trigger',
    icon: <Globe className="w-4 h-4" />,
    color: 'text-green-600',
  },
  {
    type: 'schedule',
    category: 'trigger',
    icon: <Calendar className="w-4 h-4" />,
    color: 'text-green-600',
  },

  // Context
  {
    type: 'extract_files',
    category: 'context',
    icon: <FileText className="w-4 h-4" />,
    color: 'text-blue-600',
  },
  {
    type: 'get_card_data',
    category: 'context',
    icon: <Database className="w-4 h-4" />,
    color: 'text-blue-600',
  },
  {
    type: 'set_variable',
    category: 'context',
    icon: <Variable className="w-4 h-4" />,
    color: 'text-blue-600',
  },

  // Logic
  {
    type: 'if_else',
    category: 'logic',
    icon: <GitBranch className="w-4 h-4" />,
    color: 'text-yellow-600',
  },
  {
    type: 'switch',
    category: 'logic',
    icon: <Settings className="w-4 h-4" />,
    color: 'text-yellow-600',
  },
  {
    type: 'loop',
    category: 'logic',
    icon: <RotateCcw className="w-4 h-4" />,
    color: 'text-yellow-600',
  },
  {
    type: 'try_catch',
    category: 'logic',
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'text-yellow-600',
  },

  // Actions
  {
    type: 'comment',
    category: 'action',
    icon: <MessageSquare className="w-4 h-4" />,
    color: 'text-purple-600',
  },
  {
    type: 'ai_request',
    category: 'action',
    icon: <Brain className="w-4 h-4" />,
    color: 'text-purple-600',
  },
  {
    type: 'move_card',
    category: 'action',
    icon: <Move className="w-4 h-4" />,
    color: 'text-purple-600',
  },
  {
    type: 'create_file',
    category: 'action',
    icon: <FileUp className="w-4 h-4" />,
    color: 'text-purple-600',
  },
  {
    type: 'send_notification',
    category: 'action',
    icon: <Send className="w-4 h-4" />,
    color: 'text-purple-600',
  },
  {
    type: 'update_field',
    category: 'action',
    icon: <Edit className="w-4 h-4" />,
    color: 'text-purple-600',
  },
  {
    type: 'api_call',
    category: 'action',
    icon: <ExternalLink className="w-4 h-4" />,
    color: 'text-purple-600',
  },

  // Wait
  {
    type: 'wait_response',
    category: 'wait',
    icon: <Clock className="w-4 h-4" />,
    color: 'text-orange-600',
  },
  {
    type: 'wait_timeout',
    category: 'wait',
    icon: <Timer className="w-4 h-4" />,
    color: 'text-orange-600',
  },
  {
    type: 'wait_condition',
    category: 'wait',
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'text-orange-600',
  },
];

export function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  const { t } = useTranslation();

  const groupedBlocks = PALETTE_BLOCKS.reduce(
    (acc, block) => {
      if (!acc[block.category]) {
        acc[block.category] = [];
      }
      acc[block.category].push(block);
      return acc;
    },
    {} as Record<string, PaletteBlock[]>,
  );

  const categoryColors = {
    trigger:
      'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800',
    context:
      'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800',
    logic:
      'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800',
    action:
      'bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800',
    wait: 'bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800',
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          {t('flowBuilder.blockPalette.title')}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t('flowBuilder.blockPalette.subtitle')}
        </p>
      </div>

      <div className="flex-1">
        <div className="p-3 space-y-3">
          {Object.entries(groupedBlocks).map(([category, blocks]) => (
            <Card
              key={category}
              className={
                categoryColors[category as keyof typeof categoryColors]
              }
            >
              <CardHeader className="pb-2 px-3 pt-3">
                <CardTitle className="text-sm font-medium">
                  {t(`flowBuilder.blockPalette.categories.${category}`)}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-3 pb-3 space-y-1.5">
                {blocks.map((block) => (
                  <Button
                    key={block.type}
                    variant="outline"
                    size="sm"
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(e, block.type, block.category)
                    }
                    onDragEnd={handleDragEnd}
                    className="w-full justify-start h-auto p-2.5 text-left bg-background/50 dark:bg-background/30 hover:bg-muted/50 dark:hover:bg-muted/40 whitespace-normal border border-border/40 dark:border-border/70 hover:border-border/80 dark:hover:border-border transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] active:bg-muted/70 dark:active:bg-muted/60 hover:shadow-sm active:shadow-none cursor-grab active:cursor-grabbing"
                    onClick={() => onAddBlock(block.type, block.category)}
                  >
                    <div className="flex items-start gap-2 w-full">
                      <div className={`mt-0.5 flex-shrink-0 ${block.color}`}>
                        {block.icon}
                      </div>
                      <div className="flex-1 space-y-0.5 min-w-0">
                        <div className="font-medium text-sm text-foreground break-words leading-tight">
                          {t(
                            `flowBuilder.blockPalette.blocks.${block.type}.name`,
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground break-words leading-tight">
                          {t(
                            `flowBuilder.blockPalette.blocks.${block.type}.description`,
                          )}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
